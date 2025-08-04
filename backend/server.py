from flask import Flask, request, jsonify, session
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime, timedelta
import hashlib
import secrets
import qrcode
import io
import base64
import pyotp
import re
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

DB_PATH = "caliedu.db"

# In-memory job storage (for demo only)
import_jobs = {}

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def insert_beneficiary():
    try:
        conn = get_db()
        c = conn.cursor()
        table_name = "Beneficiary"

        # Fetch joined records
        c.execute("""
            SELECT p.SSID, COALESCE(p.FirstName, s.FirstName) AS FirstName,
                     COALESCE(p.LastName, s.LastName) AS LastName, COALESCE(p.DOB, s.DOB) AS DOB, 
                     COALESCE(s.Address, p.Address) AS Address
                     FROM RawCALPADS p 
                     FULL OUTER JOIN RawCALSAWS s ON p.FirstName = s.FirstName AND p.LastName = s.LastName AND p.DOB = s.DOB
        """)
        rows = c.fetchall()
        rows = [dict(row) for row in rows]
        # Evaluate and insert eligibility
        for row in rows:
            first_name = row['FirstName']
            last_name = row['LastName']
            dob = row['DOB']
            c.execute(f"SELECT COUNT(*) FROM {table_name} WHERE FirstName = ? AND LastName = ? AND DOB = ?", (first_name, last_name, dob))
            exists = c.fetchone()[0] > 0
            
            if exists:
                continue
            
            columns = ', '.join(row.keys())
            placeholders = ', '.join(['?'] * len(row))
            values = list(row.values())
            c.execute(f"INSERT OR REPLACE INTO {table_name} ({columns}) VALUES ({placeholders})", values)
        
        conn.commit()
        conn.close()
    except Exception as e:
        print('Error fetching records:', e)
        return jsonify({"error": "Failed to fetch records"}), 500

def insert_case_benefit(status='pending'):
    try:
        conn = get_db()
        c = conn.cursor()
        table_name = "CaseBenefit"

        # Fetch joined records
        c.execute("""
            SELECT   COALESCE(p.MealStatus, s.ProgramType) AS EligibilityReason, b.BeneficiaryID
                     FROM RawCALPADS p 
                     FULL OUTER JOIN RawCALSAWS s ON p.FirstName = s.FirstName AND p.LastName = s.LastName AND p.DOB = s.DOB
                     LEFT JOIN Beneficiary b ON COALESCE(p.FirstName, s.FirstName) = b.FirstName AND COALESCE(p.LastName, s.LastName) = b.LastName AND COALESCE(p.DOB, s.DOB) = b.DOB
        """)
        rows = c.fetchall()
        rows = [dict(row) for row in rows]

        # Evaluate and insert eligibility
        for row in rows:
            beneficiary_id = row['BeneficiaryID']
            if beneficiary_id == None:
                continue
            # Check only RawCALPADS for SSID duplicates
            c.execute(f"SELECT COUNT(*) FROM {table_name} WHERE BeneficiaryID = ?", (beneficiary_id,))
            exists = c.fetchone()[0] > 0
            
            if exists:
                continue
            
            row['CaseID'] = str(beneficiary_id) + '-2025'
            row['Created'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            row['Status'] = status
            columns = ', '.join(row.keys())
            placeholders = ', '.join(['?'] * len(row))
            values = list(row.values())
            c.execute(f"INSERT OR REPLACE INTO {table_name} ({columns}) VALUES ({placeholders})", values)
        
        conn.commit()
        c.execute("SELECT COUNT(*) FROM CaseBenefit")
        count = c.fetchone()[0]
        print(count)
        conn.close()
    except Exception as e:
        print('Error fetching records:', e)
        return jsonify({"error": "Failed to fetch records"}), 500

def hash_password(password):
    """Simple password hashing - use bcrypt in production"""
    return hashlib.sha256(password.encode()).hexdigest()
 
def verify_password(password, hashed):
    return hash_password(password) == hashed
 
def generate_mfa_secret():
    return pyotp.random_base32()
 
def verify_mfa_token(secret, token):
    totp = pyotp.TOTP(secret)
    return totp.verify(token, valid_window=1)
 
def calculate_eligibility(application_data):
    """Business rules engine for meal program eligibility"""
    household_size = application_data['household_size']
    monthly_income = application_data['monthly_income']
    
    # 2024 Federal Income Eligibility Guidelines (130% of poverty)
    income_limits = {
        1: 1580, 2: 2137, 3: 2694, 4: 3250,
        5: 3807, 6: 4364, 7: 4921, 8: 5478
    }
    
    # Calculate income limit for household size
    if household_size <= 8:
        income_limit = income_limits[household_size]
    else:
        income_limit = income_limits[8] + ((household_size - 8) * 557)
    
    # Auto-qualify conditions
    auto_qualify = (
        application_data.get('receives_snap', False) or
        application_data.get('receives_tanf', False) or
        application_data.get('receives_fdpir', False) or
        application_data.get('is_homeless', False)
    )
    
    if auto_qualify:
        return {
            'eligible': True,
            'category': 'Categorical',
            'reason': 'Automatically qualified based on program participation',
            'income_limit': income_limit,
            'monthly_income': monthly_income
        }
    elif monthly_income <= income_limit:
        return {
            'eligible': True,
            'category': 'Income',
            'reason': f'Household income (${monthly_income}) is within limit (${income_limit})',
            'income_limit': income_limit,
            'monthly_income': monthly_income
        }
    else:
        return {
            'eligible': False,
            'category': 'Income',
            'reason': f'Household income (${monthly_income}) exceeds limit (${income_limit})',
            'income_limit': income_limit,
            'monthly_income': monthly_income
        }
 
# === CUSTOMER REGISTRATION & LOGIN ===
 
@app.route('/api/customer/register', methods=['POST'])
def customer_register():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['username', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, data['email']):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Validate password strength
        if len(data['password']) < 8:
            return jsonify({'error': 'Password must be at least 8 characters'}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Check if username or email already exists
        c.execute("""
            SELECT CustomerID FROM CustomerAccounts 
            WHERE Username = ? OR Email = ?
        """, (data['username'], data['email']))
        
        if c.fetchone():
            return jsonify({'error': 'Username or email already exists'}), 409
        
        # Hash password
        password_hash = hash_password(data['password'])
        
        # Generate MFA secret if requested
        mfa_secret = None
        mfa_qr = None
        if data.get('enable_mfa', False):
            mfa_secret = generate_mfa_secret()
            # Generate QR code for MFA setup
            totp_uri = pyotp.totp.TOTP(mfa_secret).provisioning_uri(
                data['email'],
                issuer_name="CalEdu Benefits"
            )
            qr = qrcode.QRCode(version=1, box_size=10, border=5)
            qr.add_data(totp_uri)
            qr.make(fit=True)
            img = qr.make_image(fill_color="black", back_color="white")
            img_buffer = io.BytesIO()
            img.save(img_buffer, format='PNG')
            mfa_qr = base64.b64encode(img_buffer.getvalue()).decode()
        
        # Insert new customer
        c.execute("""
            INSERT INTO CustomerAccounts 
            (Username, PasswordHash, Email, FirstName, LastName, DOB, PhoneNumber, 
             PreferredLanguage, MFAEnabled, MFASecret)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data['username'],
            password_hash,
            data['email'],
            data['first_name'],
            data['last_name'],
            data.get('dob'),
            data.get('phone_number'),
            data.get('preferred_language', 'en'),
            1 if data.get('enable_mfa', False) else 0,
            mfa_secret
        ))
        
        customer_id = c.lastrowid
        conn.commit()
        conn.close()
        
        response = {
            'success': True,
            'customer_id': customer_id,
            'message': 'Account created successfully'
        }
        
        if mfa_qr:
            response['mfa_qr_code'] = mfa_qr
            response['mfa_secret'] = mfa_secret
        
        return jsonify(response), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
@app.route('/api/customer/login', methods=['POST'])
def customer_login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')
        mfa_token = data.get('mfa_token')
        
        if not username or not password:
            return jsonify({'error': 'Username and password required'}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Get customer account
        c.execute("""
            SELECT * FROM CustomerAccounts 
            WHERE Username = ? OR Email = ?
        """, (username, username))
        
        customer = c.fetchone()
        if not customer or not verify_password(password, customer['PasswordHash']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Check if account is active
        if customer['AccountStatus'] != 'Active':
            return jsonify({'error': 'Account is not active'}), 401
        
        # Check MFA if enabled
        if customer['MFAEnabled']:
            if not mfa_token:
                return jsonify({
                    'requires_mfa': True,
                    'customer_id': customer['CustomerID']
                }), 200
            
            if not verify_mfa_token(customer['MFASecret'], mfa_token):
                return jsonify({'error': 'Invalid MFA token'}), 401


 
  # Update last login
        c.execute("""
            UPDATE CustomerAccounts 
            SET LastLogin = ? 
            WHERE CustomerID = ?
        """, (datetime.now(), customer['CustomerID']))
        
        # Create session
        session_token = secrets.token_urlsafe(32)
        c.execute("""
            INSERT INTO CustomerSessions 
            (CustomerID, SessionToken, MFAVerified, ExpiresAt, IPAddress, UserAgent)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            customer['CustomerID'],
            session_token,
            1 if customer['MFAEnabled'] else 0,
            datetime.now() + timedelta(hours=24),
            request.remote_addr,
            request.headers.get('User-Agent', '')
        ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'customer_id': customer['CustomerID'],
            'session_token': session_token,
            'customer': {
                'username': customer['Username'],
                'email': customer['Email'],
                'first_name': customer['FirstName'],
                'last_name': customer['LastName'],
                'preferred_language': customer['PreferredLanguage']
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
# === ELIGIBILITY CHECKER ===
 
@app.route('/api/customer/am-i-eligible', methods=['POST'])
def check_eligibility():
    try:
        data = request.json
        
        # Validate required fields
        required_fields = ['household_size', 'monthly_income']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Calculate eligibility
        eligibility_result = calculate_eligibility(data)
        
        # If customer is logged in, save the application
        customer_id = data.get('customer_id')
        if customer_id:
            conn = get_db()
            c = conn.cursor()
            
            c.execute("""
                INSERT INTO EligibilityApplications 
                (CustomerID, HouseholdSize, MonthlyIncome, HasDisability, IsPregnant, 
                 IsHomeless, ReceivesSNAP, ReceivesTANF, ReceivesFDPIR, EligibilityResult)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                customer_id,
                data['household_size'],
                data['monthly_income'],
                data.get('has_disability', 0),
                data.get('is_pregnant', 0),
                data.get('is_homeless', 0),
                data.get('receives_snap', 0),
                data.get('receives_tanf', 0),
                data.get('receives_fdpir', 0),
                'Eligible' if eligibility_result['eligible'] else 'Not Eligible'
            ))
            
            application_id = c.lastrowid
            conn.commit()
            conn.close()
            
            eligibility_result['application_id'] = application_id
        
        # Add next steps
        if eligibility_result['eligible']:
            eligibility_result['next_steps'] = [
                'Complete the full application',
                'Upload required documents',
                'Wait for application review',
                'Receive your EBT card if approved'
            ]
        else:
            eligibility_result['next_steps'] = [
                'Check if you qualify for other programs',
                'Contact your local office for assistance',
                'Reapply if your circumstances change'
            ]
        
        return jsonify(eligibility_result)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
 
 
 
@app.route('/api/customer/documents/upload', methods=['POST'])
def upload_documents():
    try:
        customer_id = request.form.get('customer_id')
        application_id = request.form.get('application_id')
        document_type = request.form.get('document_type')
        
        if not customer_id:
            return jsonify({'error': 'Customer ID required'}), 400
        
        # Allowed file types
        ALLOWED_EXTENSIONS = {'pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'}
        MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB
        
        def allowed_file(filename):
            return '.' in filename and \
                   filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
        
        uploaded_files = []
        
        for file_key in request.files:
            file = request.files[file_key]
            
            if file and file.filename and allowed_file(file.filename):
                # Check file size
                file.seek(0, os.SEEK_END)
                file_size = file.tell()
                file.seek(0)
                
                if file_size > MAX_FILE_SIZE:
                    return jsonify({'error': f'File {file.filename} is too large (max 5MB)'}), 400
                
                # Generate secure filename
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                filename = f"{timestamp}_{filename}"
                
                # Create directory structure
                upload_dir = f"uploads/customers/{customer_id}"
                os.makedirs(upload_dir, exist_ok=True)
                
                file_path = os.path.join(upload_dir, filename)
                file.save(file_path)
                
                # Store in database
                conn = get_db()
                c = conn.cursor()
                
                c.execute("""
                    INSERT INTO CustomerDocuments 
                    (CustomerID, ApplicationID, DocumentType, FileName, FileSize, 
                     FilePath, MimeType, Status)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'Uploaded')
                """, (
                    customer_id,
                    application_id,
                    document_type or 'General',
                    file.filename,
                    file_size,
                    file_path,
                    file.content_type
                ))
                
                document_id = c.lastrowid
                conn.commit()
                conn.close()
                
                uploaded_files.append({
                    'document_id': document_id,
                    'filename': file.filename,
                    'file_size': file_size,
                    'status': 'uploaded'
                })
        
        if not uploaded_files:
            return jsonify({'error': 'No valid files uploaded'}), 400
        
        return jsonify({
            'success': True,
            'files': uploaded_files,
            'message': f'{len(uploaded_files)} file(s) uploaded successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
# === EBT CARD REPLACEMENT ===
 
@app.route('/api/customer/ebt/replacement', methods=['POST'])
def request_ebt_replacement():
    try:
        data = request.json
        customer_id = data.get('customer_id')
        reason = data.get('reason')  # 'lost', 'stolen', 'damaged', 'not_received'
        
        if not customer_id or not reason:
            return jsonify({'error': 'Customer ID and reason required'}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Check if customer has an active card
        c.execute("""
            SELECT * FROM CustomerEBTCards 
            WHERE CustomerID = ? AND Status = 'Active'
            ORDER BY IssuedDate DESC LIMIT 1
        """, (customer_id,))
        
        current_card = c.fetchone()
        
        # Check replacement limits
        if current_card and current_card['ReplacementCount'] >= 3:
            return jsonify({
                'error': 'Replacement limit reached. Please contact customer service.'
            }), 400
        
        # Deactivate current card if exists
        if current_card:
            c.execute("""
                UPDATE CustomerEBTCards 
                SET Status = 'Replaced' 
                WHERE CardID = ?
            """, (current_card['CardID'],))
        
        # Generate new card number (simplified)
        import random
        new_card_number = f"4000{random.randint(100000000000, 999999999999)}"
        
        # Get customer name for card
        c.execute("""
            SELECT FirstName, LastName FROM CustomerAccounts 
            WHERE CustomerID = ?
        """, (customer_id,))
        
        customer = c.fetchone()
        card_holder_name = f"{customer['FirstName']} {customer['LastName']}"
        
        # Create new card
        c.execute("""
            INSERT INTO CustomerEBTCards 
            (CustomerID, CardNumber, CardHolderName, ExpirationDate, Status, 
             ReplacementReason, ReplacementCount)
            VALUES (?, ?, ?, ?, 'Processing', ?, ?)
        """, (
            customer_id,
            new_card_number,
            card_holder_name,
            datetime.now() + timedelta(days=365*3),  # 3 years
            reason,
            (current_card['ReplacementCount'] + 1) if current_card else 1
        ))
        
        new_card_id = c.lastrowid
        conn.commit()
        conn.close()
        
        # Mask card number for response
        masked_number = f"****-****-****-{new_card_number[-4:]}"
        
        return jsonify({
            'success': True,
            'card_id': new_card_id,
            'masked_card_number': masked_number,
            'estimated_delivery': '7-10 business days',
            'tracking_info': 'You will receive tracking information via email',
            'replacement_count': (current_card['ReplacementCount'] + 1) if current_card else 1,
            'remaining_replacements': 2 if not current_card else (2 - current_card['ReplacementCount'])
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
 
 
# === PROGRAM OPT-IN/OUT ===
 
@app.route('/api/customer/program-preferences', methods=['POST'])
def update_program_preferences():
    try:
        data = request.json
        customer_id = data.get('customer_id')
        
        if not customer_id:
            return jsonify({'error': 'Customer ID required'}), 400
        
        conn = get_db()
        c = conn.cursor()
        
        # Update or insert preferences
        for program_type, preferences in data.get('preferences', {}).items():
            c.execute("""
                INSERT OR REPLACE INTO ProgramPreferences 
                (CustomerID, ProgramType, OptedIn, CommunicationMethod, LanguagePreference)
                VALUES (?, ?, ?, ?, ?)
            """, (
                customer_id,
                program_type,
                preferences.get('opted_in', 1),
                preferences.get('communication_method', 'Email'),
                preferences.get('language_preference', 'en')
            ))
        
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'Preferences updated successfully'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
 
@app.route('/api/customer/program-preferences/<int:customer_id>', methods=['GET'])
def get_program_preferences(customer_id):
    try:
        conn = get_db()
        c = conn.cursor()
        
        c.execute("""
            SELECT * FROM ProgramPreferences 
            WHERE CustomerID = ?
        """, (customer_id,))
        
        preferences = [dict(row) for row in c.fetchall()]
        conn.close()
        
        return jsonify({
            'preferences': preferences
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# === Authentication route ===
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM Users WHERE Username = ?', (username,))
    user = c.fetchone()
    conn.close()

    if user and user['PasswordHash'] == password:  # Replace with hashed password check!
        return jsonify({
            "success": True,
            "user": {
                "id": user['UserID'],
                "username": user['Username'],
                "email": user['Email'],
                "roleId": user['RoleID']
            }
        })
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# === Eligibility routes ===
@app.route('/api/eligibility', methods=['GET'])
def get_eligibility():
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("""
            SELECT e.*, h.HouseholdName, h.Address
            FROM EligibilityRecords e
            LEFT JOIN Households h ON e.HouseholdID = h.HouseholdID
        """)
        rows = c.fetchall()
        conn.close()
        results = [dict(row) for row in rows]
        return jsonify(results)
    except Exception as e:
        print('Error fetching eligibility records:', e)
        return jsonify({"error": "Failed to fetch eligibility records"}), 500

@app.route('/api/eligibility', methods=['POST'])
def post_eligibility():
    data = request.json
    participantId = data.get('participantId')
    issuance_type = data.get('issuanceType')
    issuance_amount = data.get('issuanceAmount')
    issuance_date = data.get('issuanceDate')
    household_id = data.get('householdId')

    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("""
            INSERT INTO EligibilityRecords
            (ParticipantID, IssuanceType, IssuanceAmount, IssuanceDate, ApprovalStatus, HouseholdID)
            VALUES (?, ?, ?, ?, 'Pending', ?)
        """, (participantId, issuance_type, issuance_amount, issuance_date, household_id))
        conn.commit()
        last_id = c.lastrowid
        conn.close()
        return jsonify({"success": True, "id": last_id}), 201
    except Exception as e:
        print('Error creating eligibility record:', e)
        return jsonify({"error": "Failed to create eligibility record"}), 500

# === Import API ===
@app.route('/api/import-data', methods=['POST'])
def import_data():
    try:
        data = request.json.get('data', [])
        source = request.json.get('source')  # e.g., 'CALPADS'
        table_name = f'Raw{source.upper()}'
        
        job_id = str(uuid.uuid4()) 
        import_jobs[job_id] = {"status": "processing"}

        conn = sqlite3.connect("caliedu.db")
        c = conn.cursor()

        for row in data:
            if source.upper() == 'CALPADS':
                student_id = row.get('SSID')
                # Check only RawCALPADS for SSID duplicates
                c.execute(f"SELECT COUNT(*) FROM {table_name} WHERE SSID = ?", (student_id,))
                exists = c.fetchone()[0] > 0

            elif source.upper() == 'CALSAWS':
                case_number = row.get('CaseNumber')
                # Check only RawCALSAWS for CaseNumber duplicates
                c.execute(f"SELECT COUNT(*) FROM {table_name} WHERE CaseNumber = ?", (case_number,))
                exists = c.fetchone()[0] > 0

            else:
                exists = False  # Default fallback if source is unexpected

            if exists:
                continue

            # Dynamically insert row into table
            columns = ', '.join(row.keys())
            placeholders = ', '.join(['?'] * len(row))
            values = list(row.values())
            c.execute(f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})", values)

        conn.commit()
        conn.close()
        insert_beneficiary()
        insert_case_benefit(status='eligible')
        import_jobs[job_id] = {"status": "done", "data": data} 
        return jsonify({"jobId": job_id}), 200

    except Exception as e:
        print(f"Error during import: {e}")
        import_jobs[job_id] = {"status": "failed"}
        return jsonify({"error": "Failed to import data"}), 500

@app.route('/api/import/<job_id>', methods=['GET'])
def import_status(job_id):
    job = import_jobs.get(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    return jsonify({"status": job["status"], "data": job.get("data")})

# === RawCALPADS Display API ===
@app.route('/api/results', methods=['GET'])
def results():
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("""SELECT p.SSID, COALESCE(p.FirstName, s.FirstName) AS FirstName,
                     COALESCE(p.LastName, s.LastName) AS LastName, COALESCE(p.DOB, s.DOB) AS DOB, 
                     COALESCE(s.Address, p.Address) AS Address, p.MealStatus, s.CaseNumber, s.ProgramType AS CALSAWS_ProgramType, e.IsEligible, e.Reason 
                     FROM RawCALPADS p 
                     FULL OUTER JOIN RawCALSAWS s ON p.FirstName = s.FirstName AND p.LastName = s.LastName AND p.DOB = s.DOB
                     LEFT JOIN LunchEligibilityStatus e ON p.SSID = e.SSID""")
        rows = c.fetchall()
        conn.close()
        results = [dict(row) for row in rows]
        return jsonify(results)
    except Exception as e:
        print('Error fetching RawCALPADS records:', e)
        return jsonify({"error": "Failed to fetch RawCALPADS records"}), 500
    
@app.route('/api/cases', methods=['GET'])
def cases():
    try:
        conn = get_db()
        c = conn.cursor()
        c.execute("""SELECT c.CaseId as caseId, b.FirstName || ' ' || b.LastName AS name, c.Status as status, 
                  c.Created as created, c.LastModified as lastModified, c.EligibilityReason as eligibilityReason, c.Documents as documents, c.Notes as notes
                  FROM CaseBenefit c LEFT JOIN Beneficiary b on c.BeneficiaryID = b.BeneficiaryID""")
        rows = c.fetchall()
        conn.close()
        results = [dict(row) for row in rows]
        return jsonify(results)
    except Exception as e:
        print('Error fetching RawCALPADS records:', e)
        return jsonify({"error": "Failed to fetch RawCALPADS records"}), 500

@app.route('/api/notes', methods={'POST'})
def notes():
    caseId = request.json.get('caseId')
    note = request.json.get('note')
    print(note)
    return jsonify({"success": True}), 200
    
if __name__ == "__main__":
    
    app.run(host="0.0.0.0", port=5000, debug=True)