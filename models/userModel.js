const db = require('../config/db');
exports.findByEmail = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
exports.all = () => db.prepare('SELECT id,name,email,role,is_active FROM users ORDER BY role,name').all();
exports.create = (name, email, hash, role) =>
  db.prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)').run(name, email.toLowerCase(), hash, role);
exports.toggle = (id) => db.prepare('UPDATE users SET is_active = 1 - is_active WHERE id = ?').run(id);
