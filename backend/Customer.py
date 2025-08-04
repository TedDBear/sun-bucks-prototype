API ENDPOINTS:
 
from flask import Flask, request, jsonify, session
import sqlite3
import hashlib
import secrets
import qrcode
import io
import base64
import pyotp
from datetime import datetime, timedelta
import re
import os
from werkzeug.utils import secure_filename
 
app = Flask(__name__)
app.secret_key = 'your-secret-key-change-this'
 
DB_PATH = "../caliedu.db"
 
def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn
 
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
 
if __name__ == '__main__':
    app.run(debug=True, port=5001)


 