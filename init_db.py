import sqlite3

conn = sqlite3.connect("caliedu.db")
c = conn.cursor()

c.execute("""
CREATE TABLE IF NOT EXISTS Roles (
    RoleID INT PRIMARY KEY,
    RoleName NVARCHAR(50),
    Description NVARCHAR(255)
);
""")

c.execute('''
    CREATE TABLE IF NOT EXISTS Users (
    UserID INT PRIMARY KEY,
    Username NVARCHAR(50) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Email NVARCHAR(100),
    RoleID INT,
    MFAEnabled BIT DEFAULT 1,
    LastLogin DATETIME,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);
''')

# Create the admin_users table
c.execute('''
CREATE TABLE IF NOT EXISTS AdminUsers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);
''')

c.execute(''' CREATE TABLE IF NOT EXISTS Households (
    HouseholdID INT PRIMARY KEY,
    HouseholdName NVARCHAR(100),
    Address NVARCHAR(255)
);
''')

c.execute(''' CREATE TABLE IF NOT EXISTS Beneficiary (
    BeneficiaryID INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    SSID NVARCHAR(20),
    DOB DATE,
    Address NVARCHAR(255),
    HouseholdID NVARCHAR(100),
    EligibilityStatus NVARCHAR(50),
    FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID)
  )''')

c.execute('''CREATE TABLE IF NOT EXISTS EligibilityRecords (
    EligibilityID INT PRIMARY KEY,
    ParticipantID INT,
    IssuanceType NVARCHAR(50),
    IssuanceAmount DECIMAL(10,2),
    IssuanceDate DATE,
    ApprovalStatus NVARCHAR(50),
    HouseholdID INT,
    FOREIGN KEY (HouseholdID) REFERENCES Households(HouseholdID)
);
''')

c.execute('''CREATE TABLE IF NOT EXISTS SystemConfigs (
    ConfigKey NVARCHAR(100) PRIMARY KEY,
    ConfigValue NVARCHAR(255)
);
''')


c.execute("""CREATE TABLE IF NOT EXISTS AuditLogs (
    LogID INT PRIMARY KEY,
    UserID INT,
    Action NVARCHAR(255),
    TableAffected NVARCHAR(100),
    RecordID INT,
    OldValue NVARCHAR(1000),
    NewValue NVARCHAR(1000),
    ActionDate DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
""")

c.execute("""CREATE TABLE IF NOT EXISTS EBTAccounts (
    EBTAccountID INT PRIMARY KEY,
    EligibilityID INT,
    AccountNumber NVARCHAR(50),
    Status NVARCHAR(50),
    BenefitBalance DECIMAL(10,2),
    ExpungementDate DATE,
    FOREIGN KEY (EligibilityID) REFERENCES EligibilityRecords(EligibilityID)
);
""")

c.execute("""CREATE TABLE IF NOT EXISTS BenefitIssuances (
    IssuanceID INT PRIMARY KEY,
    EligibilityID INT,
    IssuanceDate DATE,
    IssuanceAmount DECIMAL(10,2),
    IssuanceType NVARCHAR(50),
    IsReplacement BIT DEFAULT 0,
    Approved BIT DEFAULT 0,
    FOREIGN KEY (EligibilityID) REFERENCES EligibilityRecords(EligibilityID)
);
""")

c.execute("""CREATE TABLE IF NOT EXISTS Documents (
    DocumentID INT PRIMARY KEY,
    EligibilityID INT,
    FileName NVARCHAR(255),
    FileType NVARCHAR(50),
    UploadedBy INT,
    UploadDate DATETIME,
    FOREIGN KEY (EligibilityID) REFERENCES EligibilityRecords(EligibilityID),
    FOREIGN KEY (UploadedBy) REFERENCES Users(UserID)
);""")

c.execute("""CREATE TABLE IF NOT EXISTS Comments (
    CommentID INT PRIMARY KEY,
    EligibilityID INT,
    UserID INT,
    CommentText NVARCHAR(1000),
    CreatedAt DATETIME,
    FOREIGN KEY (EligibilityID) REFERENCES EligibilityRecords(EligibilityID),
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);""")

c.execute("""CREATE TABLE IF NOT EXISTS Tasks (
    TaskID INT PRIMARY KEY,
    AssignedTo INT,
    CreatedBy INT,
    TaskType NVARCHAR(50),
    RelatedRecordID INT,
    DueDate DATE,
    Status NVARCHAR(50),
    CreatedAt DATETIME,
    FOREIGN KEY (AssignedTo) REFERENCES Users(UserID),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);""")

c.execute("""
    CREATE TABLE IF NOT EXISTS RolePermissions (
    RolePermissionID INT PRIMARY KEY,
    RoleID INT,
    PermissionName NVARCHAR(100),
    IsAllowed BIT,
    FOREIGN KEY (RoleID) REFERENCES Roles(RoleID)
);""")


c.execute("""
    CREATE TABLE IF NOT EXISTS RawCALPADS (
    CALPADS_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    SSID NVARCHAR(20),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    DOB DATE,
    Address NVARCHAR(255),
    SchoolName NVARCHAR(100),
    Grade INT,
    MealStatus NVARCHAR(20),
    ImportTimestamp DATETIME
);""")
c.execute("""
          CREATE TABLE IF NOT EXISTS RawCALSAWS (
    CalSAWS_ID INTEGER PRIMARY KEY AUTOINCREMENT,
    CaseNumber NVARCHAR(50),
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    DOB DATE,
    Address NVARCHAR(255),
    ProgramType NVARCHAR(50),
    ImportTimestamp DATETIME
);""")
c.execute("""
    CREATE TABLE IF NOT EXISTS DeduplicationErrors (
    ErrorID INT PRIMARY KEY,
    Source NVARCHAR(20), -- 'CALPADS' or 'CalSAWS'
    RecordID INT,
    ErrorMessage NVARCHAR(255),
    Reviewed BIT DEFAULT 0,
    LoggedAt DATETIME
);""")
c.execute("""
          CREATE TABLE IF NOT EXISTS Communications (
    CommunicationID INT PRIMARY KEY,
    EligibilityID INT,
    CommunicationType NVARCHAR(20), -- 'Mail', 'Email', 'SMS'
    Content NVARCHAR(1000),
    SentDate DATETIME,
    SentBy INT,
    FOREIGN KEY (EligibilityID) REFERENCES EligibilityRecords(EligibilityID),
    FOREIGN KEY (SentBy) REFERENCES Users(UserID)
);
          """)

c.execute(""" CREATE TABLE IF NOT EXISTS LunchEligibilityStatus (
            SSID TEXT PRIMARY KEY,
            IsEligible BOOLEAN,
            Reason TEXT
        );""")

c.execute("""
          CREATE TABLE IF NOT EXISTS CommunicationTemplates (
    TemplateID INT PRIMARY KEY,
    TemplateName NVARCHAR(100),
    TemplateType NVARCHAR(20), -- 'Approval Notice', 'Reminder', etc.
    BodyText NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME,
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);""")

c.execute("""
    CREATE TABLE IF NOT EXISTS AuditLogsEnhanced (
    LogID INT PRIMARY KEY,
    UserID INT,
    ActionType NVARCHAR(100), -- e.g., 'INSERT', 'UPDATE', 'DELETE'
    TableName NVARCHAR(100),
    RecordID INT,
    FieldName NVARCHAR(100),
    OldValue NVARCHAR(1000),
    NewValue NVARCHAR(1000),
    ActionDate DATETIME,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);""")

c.execute("""CREATE TABLE IF NOT EXISTS CaseBenefit (
    CaseID NVARCHAR(50) PRIMARY KEY,
    BeneficiaryID INTEGER,
    Status NVARCHAR(10) DEFAULT pending,
    Created TIMESTAMP,
    LastModified TIMESTAMP,
    EligibilityReason NVARCHAR(255),
    Documents INT,
    Notes NVARCHAR(1000),
    FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiary(BeneficiaryID)
);""")

    # Customer Accounts Table
c.execute('''
    CREATE TABLE IF NOT EXISTS CustomerAccounts (
        CustomerID INTEGER PRIMARY KEY AUTOINCREMENT,
        Username NVARCHAR(50) UNIQUE NOT NULL,
        PasswordHash NVARCHAR(255) NOT NULL,
        Email NVARCHAR(100) UNIQUE NOT NULL,
        PhoneNumber NVARCHAR(20),
        FirstName NVARCHAR(50),
        LastName NVARCHAR(50),
        DOB DATE,
        PreferredLanguage NVARCHAR(10) DEFAULT 'en',
        MFAEnabled BIT DEFAULT 0,
        MFASecret NVARCHAR(100),
        AccountStatus NVARCHAR(20) DEFAULT 'Active',
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        LastLogin DATETIME,
        EmailVerified BIT DEFAULT 0,
        PhoneVerified BIT DEFAULT 0
    );
    ''')
 
    # Link Customer to existing Beneficiary records
c.execute('''
    CREATE TABLE IF NOT EXISTS CustomerBeneficiaryLink (
        LinkID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        BeneficiaryID INT,
        RelationshipType NVARCHAR(20) DEFAULT 'Self',
        VerificationStatus NVARCHAR(20) DEFAULT 'Pending',
        LinkedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID),
        FOREIGN KEY (BeneficiaryID) REFERENCES Beneficiary(BeneficiaryID)
    );
    ''')
 
    # Eligibility Applications
c.execute('''
    CREATE TABLE IF NOT EXISTS EligibilityApplications (
        ApplicationID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        ApplicationType NVARCHAR(50) DEFAULT 'Meal Program',
        HouseholdSize INT,
        MonthlyIncome DECIMAL(10,2),
        HasDisability BIT DEFAULT 0,
        IsPregnant BIT DEFAULT 0,
        IsHomeless BIT DEFAULT 0,
        ReceivesSNAP BIT DEFAULT 0,
        ReceivesTANF BIT DEFAULT 0,
        ReceivesFDPIR BIT DEFAULT 0,
        ApplicationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        Status NVARCHAR(20) DEFAULT 'Submitted',
        EligibilityResult NVARCHAR(50),
        ProcessedBy INT,
        ProcessedDate DATETIME,
        Comments TEXT,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID),
        FOREIGN KEY (ProcessedBy) REFERENCES Users(UserID)
    );
    ''')
 
    # Document Uploads
c.execute('''
    CREATE TABLE IF NOT EXISTS CustomerDocuments (
        DocumentID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        ApplicationID INT,
        DocumentType NVARCHAR(50),
        FileName NVARCHAR(255),
        FileSize INT,
        FilePath NVARCHAR(500),
        MimeType NVARCHAR(100),
        UploadDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        Status NVARCHAR(20) DEFAULT 'Uploaded',
        ReviewedBy INT,
        ReviewedDate DATETIME,
        ReviewNotes TEXT,
        ExpirationDate DATE,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID),
        FOREIGN KEY (ApplicationID) REFERENCES EligibilityApplications(ApplicationID),
        FOREIGN KEY (ReviewedBy) REFERENCES Users(UserID)
    );
    ''')
 
    # EBT Card Management
c.execute('''
    CREATE TABLE IF NOT EXISTS CustomerEBTCards (
        CardID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        CardNumber NVARCHAR(20) UNIQUE,
        CardHolderName NVARCHAR(100),
        ExpirationDate DATE,
        Status NVARCHAR(20) DEFAULT 'Active',
        IssuedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        ReplacementReason NVARCHAR(50),
        ReplacementCount INT DEFAULT 0,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID)
    );
    ''')
 
    # Program Participation Preferences
c.execute('''
    CREATE TABLE IF NOT EXISTS ProgramPreferences (
        PreferenceID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        ProgramType NVARCHAR(50),
        OptedIn BIT DEFAULT 1,
        CommunicationMethod NVARCHAR(20) DEFAULT 'Email',
        LanguagePreference NVARCHAR(10) DEFAULT 'en',
        UpdatedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID)
    );
    ''')
 
    # Session Management for MFA
c.execute('''
    CREATE TABLE IF NOT EXISTS CustomerSessions (
        SessionID INTEGER PRIMARY KEY AUTOINCREMENT,
        CustomerID INT,
        SessionToken NVARCHAR(255) UNIQUE,
        MFAVerified BIT DEFAULT 0,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        ExpiresAt DATETIME,
        IPAddress NVARCHAR(45),
        UserAgent TEXT,
        FOREIGN KEY (CustomerID) REFERENCES CustomerAccounts(CustomerID)
    );
    ''')


c.execute("SELECT COUNT(*) FROM CaseBenefit")
count = c.fetchone()[0]
print(count)
c.execute("SELECT * FROM CaseBenefit")
columns = [desc[0] for desc in c.description]
rows = c.fetchall()

"""for row in rows:
    print(dict(zip(columns, row)))"""
conn.commit()
conn.close()

print("Database initialized.")
