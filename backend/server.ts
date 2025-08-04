import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database connection
let db: any;

async function initDB() {
  db = await open({
    filename: path.join(__dirname, '../caliedu.db'),
    driver: sqlite3.Database
  });
}

// In-memory job storage (for demo purposes only)
const importJobs: Record<string, { status: 'processing' | 'done' | 'failed'; data?: any }> = {};

// === Authentication routes ===
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await db.get('SELECT * FROM Users WHERE Username = ?', [username]);

    if (user && user.PasswordHash === password) {
      res.json({
        success: true,
        user: {
          id: user.UserID,
          username: user.Username,
          email: user.Email,
          roleId: user.RoleID
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Eligibility routes ===
app.get('/api/eligibility', async (req, res) => {
  try {
    const records = await db.all(`
      SELECT e.*, h.HouseholdName, h.Address 
      FROM EligibilityRecords e
      LEFT JOIN Households h ON e.HouseholdID = h.HouseholdID
    `);
    res.json(records);
  } catch (error) {
    console.error('Error fetching eligibility records:', error);
    res.status(500).json({ error: 'Failed to fetch eligibility records' });
  }
});

app.post('/api/eligibility', async (req, res) => {
  const { participantId, issuanceType, issuanceAmount, issuanceDate, householdId } = req.body;

  try {
    const result = await db.run(`
      INSERT INTO EligibilityRecords 
      (ParticipantID, IssuanceType, IssuanceAmount, IssuanceDate, ApprovalStatus, HouseholdID)
      VALUES (?, ?, ?, ?, 'Pending', ?)
    `, [participantId, issuanceType, issuanceAmount, issuanceDate, householdId]);

    res.status(201).json({ success: true, id: result.lastID });
  } catch (error) {
    console.error('Error creating eligibility record:', error);
    res.status(500).json({ error: 'Failed to create eligibility record' });
  }
});

// === Import API ===
app.post('/api/import', async (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const jobId = uuidv4();
  importJobs[jobId] = { status: 'processing' };

  // Simulate processing (you can replace this with actual DB logic)
  try {
    for (const row of data) {
      const columns = Object.keys(row).join(', ');
      const placeholders = Object.keys(row).map(() => '?').join(', ');
      const values = Object.values(row);

      await db.run(`INSERT INTO RawCALPADS (${columns}) VALUES (${placeholders})`, values);
    }

    importJobs[jobId] = { status: 'done', data: data };
    res.status(200).json({ jobId });
  } catch (error) {
    console.error('Import error:', error);
    importJobs[jobId] = { status: 'failed' };
    res.status(500).json({ error: 'Failed to import data' });
  }
});

app.get('/api/import/:jobId', (req, res) => {
  const job = importJobs[req.params.jobId];
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({ status: job.status, data: job.data });
});

// === RawCALPADS Display API ===
app.get('/api/calpads-results', async (req, res) => {
  try {
    const records = await db.all(`SELECT * FROM RawCALPADS`);
    res.json(records);
  } catch (error) {
    console.error('Error fetching RawCALPADS records:', error);
    res.status(500).json({ error: 'Failed to fetch RawCALPADS records' });
  }
});

// === Start server ===
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});