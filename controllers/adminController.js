const bcrypt = require('bcrypt');
const Feedback = require('../models/feedbackModel');
const User = require('../models/userModel');
const { deny } = require('../middleware/auth');
const { CATEGORIES } = require('./feedbackController');
const { EMAIL_RE } = require('./authController');

const scopeOf = (req) => (req.baseUrl === '/guidance' ? 'guidance' : 'admin');
const ROLES = ['student', 'teacher', 'admin', 'guidance'];

exports.dashboard = (req, res) => {
  const scope = scopeOf(req);
  const f = { category: req.query.category || '', status: req.query.status || '', q: (req.query.q || '').trim() };
  const items = Feedback.list({ assigned: scope, ...f });
  res.render('admin-dashboard', { items, f, CATEGORIES, scope, stats: Feedback.stats(scope) });
};

exports.details = (req, res) => {
  const item = Feedback.findById(req.params.id);
  if (!item || item.assigned_to !== scopeOf(req)) return deny(res);
  Feedback.log(req.session.userId, 'viewed', item.id);
  res.render('feedback-details', { item, error: null, base: req.baseUrl });
};

exports.respond = (req, res) => {
  const item = Feedback.findById(req.params.id);
  if (!item || item.assigned_to !== scopeOf(req)) return deny(res);
  const response = (req.body.response || '').trim();
  if (!response) return res.status(400).render('feedback-details', { item, error: 'Write a reply before saving.', base: req.baseUrl });
  if (response.length > 2000) return res.status(400).render('feedback-details', { item, error: 'Reply is too long (max 2000 characters).', base: req.baseUrl });
  const status = req.body.action === 'resolve' ? 'Resolved' : 'In Review';
  Feedback.respond(item.id, response, status, req.session.userId);
  Feedback.log(req.session.userId, `set ${status}`, item.id);
  res.redirect(`${req.baseUrl}/dashboard`);
};

exports.users = (req, res) => res.render('users', { users: User.all(), ROLES, errors: [], v: {} });

exports.addUser = async (req, res) => {
  const v = { name: (req.body.name || '').trim(), email: (req.body.email || '').trim(), role: req.body.role };
  const pw = req.body.password || '';
  const errors = [];
  if (!v.name || !v.email || !pw) errors.push('Please fill in all required fields.');
  if (v.email && !EMAIL_RE.test(v.email)) errors.push('Enter a valid email address.');
  if (pw && (pw.length < 8 || !/[A-Za-z]/.test(pw) || !/\d/.test(pw))) errors.push('Password needs 8+ characters with at least one letter and one number.');
  if (!ROLES.includes(v.role)) errors.push('Choose a valid role.');
  if (!errors.length && User.findByEmail(v.email)) errors.push('An account with this email already exists.');
  if (errors.length) return res.status(400).render('users', { users: User.all(), ROLES, errors, v });
  User.create(v.name, v.email, await bcrypt.hash(pw, 10), v.role);
  res.redirect('/admin/users');
};

exports.toggleUser = (req, res) => {
  if (Number(req.params.id) !== req.session.userId) User.toggle(req.params.id); // can't deactivate yourself
  res.redirect('/admin/users');
};

exports.reports = (req, res) => {
  // guidance only sees its own category numbers; admin sees system-wide
  const stats = Feedback.stats(req.session.role === 'guidance' ? 'guidance' : null);
  res.render('reports', { stats });
};
