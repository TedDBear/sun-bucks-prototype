from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

def get_db_connection():
    conn = sqlite3.connect('caliedu.db')
    conn.row_factory = sqlite3.Row
    return conn

# Authentication endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT * FROM Users WHERE Username = ?', (username,)
    ).fetchone()
    conn.close()
    
    if user and user['PasswordHash'] == hashlib.sha256(password.encode()).hexdigest():
        return jsonify({
            'success': True,
            'user': {
                'id': user['UserID'],
                'username': user['Username'],
                'email': user['Email'],
                'roleId': user['RoleID']
            }
        })
    
    return jsonify({'success': False, 'message': 'Invalid credentials'}), 401

# Eligibility Records endpoints
@app.route('/api/eligibility', methods=['GET'])
def get_eligibility_records():
    conn = get_db_connection()
    records = conn.execute('''
        SELECT e.*, h.HouseholdName, h.Address 
        FROM EligibilityRecords e
        LEFT JOIN Households h ON e.HouseholdID = h.HouseholdID
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(record) for record in records])

@app.route('/api/eligibility', methods=['POST'])
def create_eligibility_record():
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO EligibilityRecords 
        (ParticipantID, IssuanceType, IssuanceAmount, IssuanceDate, ApprovalStatus, HouseholdID)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data.get('participantId'),
        data.get('issuanceType'),
        data.get('issuanceAmount'),
        data.get('issuanceDate'),
        data.get('approvalStatus', 'Pending'),
        data.get('householdId')
    ))
    
    record_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': record_id}), 201

# Households endpoints
@app.route('/api/households', methods=['GET'])
def get_households():
    conn = get_db_connection()
    households = conn.execute('SELECT * FROM Households').fetchall()
    conn.close()
    
    return jsonify([dict(household) for household in households])

@app.route('/api/households', methods=['POST'])
def create_household():
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO Households (HouseholdName, Address)
        VALUES (?, ?)
    ''', (data.get('householdName'), data.get('address')))
    
    household_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'success': True, 'id': household_id}), 201

# Documents endpoints
@app.route('/api/documents/<int:eligibility_id>', methods=['GET'])
def get_documents(eligibility_id):
    conn = get_db_connection()
    documents = conn.execute('''
        SELECT d.*, u.Username as UploadedByName
        FROM Documents d
        LEFT JOIN Users u ON d.UploadedBy = u.UserID
        WHERE d.EligibilityID = ?
    ''', (eligibility_id,)).fetchall()
    conn.close()
    
    return jsonify([dict(doc) for doc in documents])

# Users endpoints
@app.route('/api/users', methods=['GET'])
def get_users():
    conn = get_db_connection()
    users = conn.execute('''
        SELECT u.UserID, u.Username, u.Email, u.RoleID, u.LastLogin, r.RoleName
        FROM Users u
        LEFT JOIN Roles r ON u.RoleID = r.RoleID
    ''').fetchall()
    conn.close()
    
    return jsonify([dict(user) for user in users])

# Reports endpoints
@app.route('/api/reports/summary', methods=['GET'])
def get_summary_report():
    conn = get_db_connection()
    
    # Get total records
    total_records = conn.execute('SELECT COUNT(*) as count FROM EligibilityRecords').fetchone()['count']
    
    # Get pending approvals
    pending_approvals = conn.execute(
        "SELECT COUNT(*) as count FROM EligibilityRecords WHERE ApprovalStatus = 'Pending'"
    ).fetchone()['count']
    
    # Get approved records
    approved_records = conn.execute(
        "SELECT COUNT(*) as count FROM EligibilityRecords WHERE ApprovalStatus = 'Approved'"
    ).fetchone()['count']
    
    conn.close()
    
    return jsonify({
        'totalRecords': total_records,
        'pendingApprovals': pending_approvals,
        'approvedRecords': approved_records
    })

# Audit logs endpoints
@app.route('/api/audit-logs', methods=['GET'])
def get_audit_logs():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 50, type=int)
    offset = (page - 1) * per_page
    
    conn = get_db_connection()
    logs = conn.execute('''
        SELECT a.*, u.Username
        FROM AuditLogs a
        LEFT JOIN Users u ON a.UserID = u.UserID
        ORDER BY a.ActionDate DESC
        LIMIT ? OFFSET ?
    ''', (per_page, offset)).fetchall()
    conn.close()
    
    return jsonify([dict(log) for log in logs])

if __name__ == '__main__':
    app.run(debug=True, port=5000)
