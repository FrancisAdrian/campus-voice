const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const db = new Database(process.env.DB_FILE || 'campus.db');
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student','teacher','admin','guidance')),
  is_active INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS feedback (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_code TEXT NOT NULL UNIQUE,
  user_id INTEGER REFERENCES users(id),          -- NULL when anonymous
  type TEXT NOT NULL DEFAULT 'Feedback',
  category TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Low',
  status TEXT NOT NULL DEFAULT 'Pending',
  assigned_to TEXT NOT NULL DEFAULT 'admin',     -- 'admin' or 'guidance'
  response TEXT,
  responded_by INTEGER REFERENCES users(id),
  created_at TEXT NOT NULL,
  resolved_at TEXT
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  action TEXT NOT NULL,
  feedback_id INTEGER,
  at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);

if (db.prepare('SELECT COUNT(*) c FROM users').get().c === 0) {
  const ins = db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
  const hash = bcrypt.hashSync('password123', 10);
  [['Ana Admin', 'admin@school.edu', 'admin'],
   ['Gina Guidance', 'guidance@school.edu', 'guidance'],
   ['Sam Student', 'student@school.edu', 'student'],
   ['Tess Teacher', 'teacher@school.edu', 'teacher']]
    .forEach(([n, e, r]) => ins.run(n, e, hash, r));
  console.log('Seeded demo accounts (password: password123)');
}
module.exports = db;
