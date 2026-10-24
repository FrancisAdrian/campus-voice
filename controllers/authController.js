const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const home = { admin: '/admin/dashboard', guidance: '/guidance/dashboard' };

exports.loginForm = (req, res) => res.render('login', { error: null, email: '' });

exports.login = async (req, res) => {
  const email = (req.body.email || '').trim();
  const password = req.body.password || '';
  if (!email || !password) return res.status(400).render('login', { error: 'Please fill in all required fields.', email });
  if (!EMAIL_RE.test(email)) return res.status(400).render('login', { error: 'Enter a valid email address.', email });

  const u = User.findByEmail(email);
  const ok = u && u.is_active && await bcrypt.compare(password, u.password_hash);
  if (!ok) return res.status(401).render('login', { error: 'Wrong email or password, or the account is inactive.', email });

  req.session.regenerate((err) => {
    if (err) throw err;
    req.session.userId = u.id;
    req.session.name = u.name;
    req.session.role = u.role;
    res.redirect(home[u.role] || '/student/dashboard');
  });
};

exports.logout = (req, res) => req.session.destroy(() => { res.clearCookie('connect.sid'); res.redirect('/login'); });
exports.EMAIL_RE = EMAIL_RE;
