import sqlite3
import random
from datetime import datetime, timedelta
from faker import Faker
import uuid

fake = Faker()

def get_db():
    return sqlite3.connect('caliedu.db')

def populate_roles():
    conn = get_db()
    c = conn.cursor()
    
    roles_data = [
        (1, 'Administrator', 'Full system access'),
        (2, 'Supervisor', 'Manage teams and review cases'),
        (3, 'Caseworker', 'Handle individual cases'),
        (4, 'Viewer', 'Read-only access'),
    ]
    
    for role_id, role_name, description in roles_data:
        c.execute("""
            INSERT OR IGNORE INTO Roles (RoleID, RoleName, Description)
            VALUES (?, ?, ?)
        """, (role_id, role_name, description))
    
    conn.commit()
    conn.close()
    print("✅ Roles populated")

def populate_users():
    conn = get_db()
    c = conn.cursor()
    
    users_data = [
        (1, 'admin', 'hashed_password_123', 'admin@caliedu.gov', 1, 1, datetime.now()),
        (2, 'supervisor', 'hashed_password_456', 'supervisor@caliedu.gov', 2, 1, datetime.now()),
        (3, 'caseworker1', 'hashed_password_789', 'worker1@caliedu.gov', 3, 0, datetime.now()),
        (4, 'caseworker2', 'hashed_password_abc', 'worker2@caliedu.gov', 3, 1, datetime.now()),
        (5, 'viewer', 'hashed_password_def', 'viewer@caliedu.gov', 4, 0, datetime.now()),
    ]
    
    for user_id, username, password, email, role_id, mfa_enabled, last_login in users_data:
        c.execute("""
            INSERT OR IGNORE INTO Users (UserID, Username, PasswordHash, Email, RoleID, MFAEnabled, LastLogin)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, username, password, email, role_id, mfa_enabled, last_login))
    
    conn.commit()
    conn.close()
    print("✅ Users populated")

def populate_admin_users():
    conn = get_db()
    c = conn.cursor()
    
    admin_users_data = [
        ('admin', 'admin123'),
        ('superadmin', 'super456'),
        ('sysadmin', 'sys789'),
    ]
    
    for username, password in admin_users_data:
        c.execute("""
            INSERT OR IGNORE INTO AdminUsers (username, password)
            VALUES (?, ?)
        """, (username, password))
    
    conn.commit()
    conn.close()
    print("✅ Admin Users populated")

def populate_households():
    conn = get_db()
    c = conn.cursor()
    
    for i in range(1, 51):  # HouseholdID 1-50
        household_name = f"Household_{fake.last_name()}_{i}"
        address = fake.address().replace('\n', ', ')
        
        c.execute("""
            INSERT OR IGNORE INTO Households (HouseholdID, HouseholdName, Address)
            VALUES (?, ?, ?)
        """, (i, household_name, address))
    
    conn.commit()
    conn.close()
    print("✅ Households populated")

def populate_beneficiary():
    conn = get_db()
    c = conn.cursor()
    
    for i in range(100):
        household_id = random.randint(1, 50)  # Reference existing household IDs
        ssid = f"{random.randint(10000000, 99999999)}"
        
        c.execute("""
            INSERT INTO Beneficiary (
                FirstName, LastName, SSID, DOB, Address, HouseholdID
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            fake.first_name(),
            fake.last_name(),
            ssid,
            fake.date_of_birth(minimum_age=0, maximum_age=80),
            fake.address().replace('\n', ', '),
            str(household_id)  # HouseholdID is NVARCHAR(100) in your schema
        ))
    
    conn.commit()
    conn.close()
    print("✅ Beneficiary populated")

def populate_eligibility_records():
    conn = get_db()
    c = conn.cursor()
    
    # Get BeneficiaryID values (ParticipantID references this)
    c.execute("SELECT BeneficiaryID FROM Beneficiary LIMIT 50")
    beneficiary_ids = [row[0] for row in c.fetchall()]
    
    issuance_types = ['CalFresh', 'CalWORKs', 'Medi-Cal', 'WIC', 'Housing Assistance']
    statuses = ['Approved', 'Pending', 'Denied', 'Under Review']
    
    for i in range(1, 201):  # EligibilityID 1-200
        participant_id = random.choice(beneficiary_ids) if beneficiary_ids else None
        household_id = random.randint(1, 50)
        
        c.execute("""
            INSERT OR IGNORE INTO EligibilityRecords (
                EligibilityID, ParticipantID, IssuanceType, IssuanceAmount, 
                IssuanceDate, ApprovalStatus, HouseholdID
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            i,
            participant_id,
            random.choice(issuance_types),
            round(random.uniform(50, 800), 2),
            fake.date_between(start_date='-1y', end_date='+30d'),
            random.choice(statuses),
            household_id
        ))
    
    conn.commit()
    conn.close()
    print("✅ Eligibility Records populated")

def populate_system_configs():
    conn = get_db()
    c = conn.cursor()
    
    configs = [
        ('max_benefit_amount', '800.00'),
        ('renewal_period_months', '12'),
        ('document_retention_years', '7'),
        ('auto_approval_threshold', '200.00'),
        ('system_maintenance_window', '02:00-04:00'),
        ('max_household_size', '10'),
        ('income_verification_required', 'true'),
        ('email_notifications_enabled', 'true'),
    ]
    
    for key, value in configs:
        c.execute("""
            INSERT OR IGNORE INTO SystemConfigs (ConfigKey, ConfigValue)
            VALUES (?, ?)
        """, (key, value))
    
    conn.commit()
    conn.close()
    print("✅ System Configs populated")

def populate_audit_logs():
    conn = get_db()
    c = conn.cursor()
    
    actions = ['LOGIN', 'LOGOUT', 'CREATE_CASE', 'UPDATE_CASE', 'DELETE_CASE', 'VIEW_REPORT']
    tables = ['Users', 'Beneficiary', 'EligibilityRecords', 'BenefitIssuances']
    
    for i in range(1, 501):  # LogID 1-500
        user_id = random.randint(1, 5)
        table_affected = random.choice(tables)
        record_id = random.randint(1, 100)
        
        c.execute("""
            INSERT OR IGNORE INTO AuditLogs (
                LogID, UserID, Action, TableAffected, RecordID, 
                OldValue, NewValue, ActionDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            i,
            user_id,
            random.choice(actions),
            table_affected,
            record_id,
            fake.sentence(nb_words=5),
            fake.sentence(nb_words=5),
            fake.date_time_between(start_date='-90d', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Audit Logs populated")

def populate_ebt_accounts():
    conn = get_db()
    c = conn.cursor()
    
    # Get EligibilityID values
    c.execute("SELECT EligibilityID FROM EligibilityRecords LIMIT 100")
    eligibility_ids = [row[0] for row in c.fetchall()]
    
    statuses = ['Active', 'Inactive', 'Suspended', 'Closed']
    
    for i in range(1, 101):  # EBTAccountID 1-100
        eligibility_id = random.choice(eligibility_ids) if eligibility_ids else i
        account_number = fake.credit_card_number(card_type='visa')
        
        c.execute("""
            INSERT OR IGNORE INTO EBTAccounts (
                EBTAccountID, EligibilityID, AccountNumber, Status, 
                BenefitBalance, ExpungementDate
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            i,
            eligibility_id,
            account_number,
            random.choice(statuses),
            round(random.uniform(0, 500), 2),
            fake.date_between(start_date='+1y', end_date='+3y') if random.choice([True, False]) else None
        ))
    
    conn.commit()
    conn.close()
    print("✅ EBT Accounts populated")

def populate_benefit_issuances():
    conn = get_db()
    c = conn.cursor()
    
    # Get EligibilityID values
    c.execute("SELECT EligibilityID FROM EligibilityRecords LIMIT 100")
    eligibility_ids = [row[0] for row in c.fetchall()]
    
    issuance_types = ['CalFresh', 'CalWORKs', 'Cash Aid', 'Emergency Food']
    
    for i in range(1, 151):  # IssuanceID 1-150
        eligibility_id = random.choice(eligibility_ids) if eligibility_ids else i
        
        c.execute("""
            INSERT OR IGNORE INTO BenefitIssuances (
                IssuanceID, EligibilityID, IssuanceDate, IssuanceAmount, 
                IssuanceType, IsReplacement, Approved
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            i,
            eligibility_id,
            fake.date_between(start_date='-1y', end_date='now'),
            round(random.uniform(25, 600), 2),
            random.choice(issuance_types),
            random.choice([0, 1]),
            random.choice([0, 1])
        ))
    
    conn.commit()
    conn.close()
    print("✅ Benefit Issuances populated")

def populate_documents():
    conn = get_db()
    c = conn.cursor()
    
    # Get EligibilityID and UserID values
    c.execute("SELECT EligibilityID FROM EligibilityRecords LIMIT 50")
    eligibility_ids = [row[0] for row in c.fetchall()]
    
    file_types = ['PDF', 'JPEG', 'PNG', 'DOC', 'TXT']
    
    for i in range(1, 101):  # DocumentID 1-100
        eligibility_id = random.choice(eligibility_ids) if eligibility_ids else i
        user_id = random.randint(1, 5)
        
        c.execute("""
            INSERT OR IGNORE INTO Documents (
                DocumentID, EligibilityID, FileName, FileType, UploadedBy, UploadDate
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            i,
            eligibility_id,
            fake.file_name(),
            random.choice(file_types),
            user_id,
            fake.date_time_between(start_date='-1y', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Documents populated")

def populate_comments():
    conn = get_db()
    c = conn.cursor()
    
    # Get EligibilityID values
    c.execute("SELECT EligibilityID FROM EligibilityRecords LIMIT 50")
    eligibility_ids = [row[0] for row in c.fetchall()]
    
    for i in range(1, 81):  # CommentID 1-80
        eligibility_id = random.choice(eligibility_ids) if eligibility_ids else i
        user_id = random.randint(1, 5)
        
        c.execute("""
            INSERT OR IGNORE INTO Comments (
                CommentID, EligibilityID, UserID, CommentText, CreatedAt
            ) VALUES (?, ?, ?, ?, ?)
        """, (
            i,
            eligibility_id,
            user_id,
            fake.text(max_nb_chars=200),
            fake.date_time_between(start_date='-6m', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Comments populated")

def populate_tasks():
    conn = get_db()
    c = conn.cursor()
    
    task_types = ['Review Application', 'Verify Documents', 'Process Renewal', 'Investigate Case']
    statuses = ['Open', 'In Progress', 'Completed', 'Cancelled']
    
    for i in range(1, 81):  # TaskID 1-80
        assigned_to = random.randint(1, 5)
        created_by = random.randint(1, 5)
        
        c.execute("""
            INSERT OR IGNORE INTO Tasks (
                TaskID, AssignedTo, CreatedBy, TaskType, RelatedRecordID, 
                DueDate, Status, CreatedAt
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            i,
            assigned_to,
            created_by,
            random.choice(task_types),
            random.randint(1, 100),
            fake.date_between(start_date='-30d', end_date='+60d'),
            random.choice(statuses),
            fake.date_time_between(start_date='-60d', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Tasks populated")

def populate_role_permissions():
    conn = get_db()
    c = conn.cursor()
    
    permissions_data = [
        (1, 1, 'CREATE_USER', 1), (2, 1, 'UPDATE_USER', 1), (3, 1, 'DELETE_USER', 1),
        (4, 2, 'VIEW_REPORTS', 1), (5, 2, 'APPROVE_CASES', 1), (6, 2, 'MANAGE_TEAM', 1),
        (7, 3, 'CREATE_CASE', 1), (8, 3, 'UPDATE_CASE', 1), (9, 3, 'VIEW_CASE', 1),
        (10, 4, 'VIEW_CASE', 1), (11, 4, 'VIEW_REPORTS', 0),
    ]
    
    for perm_id, role_id, permission_name, is_allowed in permissions_data:
        c.execute("""
            INSERT OR IGNORE INTO RolePermissions (RolePermissionID, RoleID, PermissionName, IsAllowed)
            VALUES (?, ?, ?, ?)
        """, (perm_id, role_id, permission_name, is_allowed))
    
    conn.commit()
    conn.close()
    print("✅ Role Permissions populated")

def populate_deduplication_errors():
    conn = get_db()
    c = conn.cursor()
    
    sources = ['CALPADS', 'CalSAWS']
    
    for i in range(1, 21):  # ErrorID 1-20
        c.execute("""
            INSERT OR IGNORE INTO DeduplicationErrors (
                ErrorID, Source, RecordID, ErrorMessage, Reviewed, LoggedAt
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            i,
            random.choice(sources),
            random.randint(1, 100),
            f"Duplicate record found: {fake.sentence(nb_words=6)}",
            random.choice([0, 1]),
            fake.date_time_between(start_date='-30d', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Deduplication Errors populated")

def populate_communications():
    conn = get_db()
    c = conn.cursor()
    
    # Get EligibilityID values
    c.execute("SELECT EligibilityID FROM EligibilityRecords LIMIT 50")
    eligibility_ids = [row[0] for row in c.fetchall()]
    
    comm_types = ['Mail', 'Email', 'SMS']
    
    for i in range(1, 101):  # CommunicationID 1-100
        eligibility_id = random.choice(eligibility_ids) if eligibility_ids else i
        sent_by = random.randint(1, 5)
        
        c.execute("""
            INSERT OR IGNORE INTO Communications (
                CommunicationID, EligibilityID, CommunicationType, Content, SentDate, SentBy
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (
            i,
            eligibility_id,
            random.choice(comm_types),
            fake.text(max_nb_chars=200),
            fake.date_time_between(start_date='-6m', end_date='now'),
            sent_by
        ))
    
    conn.commit()
    conn.close()
    print("✅ Communications populated")

def populate_communication_templates():
    conn = get_db()
    c = conn.cursor()
    
    templates = [
        (1, 'Approval Notice', 'Approval Notice', 'Your application has been approved. Benefits will begin on {date}.', 1),
        (2, 'Denial Notice', 'Denial Notice', 'Your application has been denied. Reason: {reason}', 1),
        (3, 'Renewal Reminder', 'Reminder', 'Your benefits are due for renewal. Please submit required documents.', 2),
        (4, 'Document Request', 'Document Request', 'Additional documents required: {documents}', 2),
        (5, 'Benefit Change', 'Benefit Change', 'Your benefit amount has changed to ${amount} effective {date}.', 1),
    ]
    
    for template_id, name, template_type, body, created_by in templates:
        c.execute("""
            INSERT OR IGNORE INTO CommunicationTemplates (
                TemplateID, TemplateName, TemplateType, BodyText, CreatedBy, CreatedAt
            ) VALUES (?, ?, ?, ?, ?, ?)
        """, (template_id, name, template_type, body, created_by, fake.date_time_between(start_date='-1y', end_date='now')))
    
    conn.commit()
    conn.close()
    print("✅ Communication Templates populated")

def populate_audit_logs_enhanced():
    conn = get_db()
    c = conn.cursor()
    
    action_types = ['INSERT', 'UPDATE', 'DELETE', 'SELECT']
    table_names = ['Users', 'Beneficiary', 'EligibilityRecords', 'BenefitIssuances']
    field_names = ['FirstName', 'LastName', 'Status', 'Amount', 'Address']
    
    for i in range(1, 201):  # LogID 1-200
        user_id = random.randint(1, 5)
        
        c.execute("""
            INSERT OR IGNORE INTO AuditLogsEnhanced (
                LogID, UserID, ActionType, TableName, RecordID, FieldName, 
                OldValue, NewValue, ActionDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            i,
            user_id,
            random.choice(action_types),
            random.choice(table_names),
            random.randint(1, 100),
            random.choice(field_names),
            fake.word(),
            fake.word(),
            fake.date_time_between(start_date='-90d', end_date='now')
        ))
    
    conn.commit()
    conn.close()
    print("✅ Audit Logs Enhanced populated")

def main():
    print("🚀 Starting to populate dummy data...")
    
    try:
        populate_roles()
        populate_users()
        populate_admin_users()
        populate_households()
        populate_beneficiary()
        populate_eligibility_records()
        populate_system_configs()
        populate_audit_logs()
        populate_ebt_accounts()
        populate_benefit_issuances()
        populate_documents()
        populate_comments()
        populate_tasks()
        populate_role_permissions()
        populate_deduplication_errors()
        populate_communications()
        populate_communication_templates()
        populate_audit_logs_enhanced()
        
        print("\n🎉 All dummy data populated successfully!")
        print("\nSummary:")
        print("- 4 Roles with permissions")
        print("- 5 Users + 3 Admin users")
        print("- 50 Households")
        print("- 100 Beneficiaries")
        print("- 200 Eligibility Records")
        print("- 100 EBT Accounts")
        print("- 150 Benefit Issuances")
        print("- 100 Documents")
        print("- 80 Comments")
        print("- 80 Tasks")
        print("- 11 Role Permissions")
        print("- 20 Deduplication Errors")
        print("- 100 Communications")
        print("- 5 Communication Templates")
        print("- 200 Enhanced Audit Logs")
        print("- 8 System Configurations")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()