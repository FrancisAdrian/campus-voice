const Feedback = require('../models/feedbackModel');

const CATEGORIES = ['Academics', 'Facilities', 'Safety', 'Bullying / Well-being', 'Teacher Concern', 'Canteen', 'Extracurriculars', 'General Suggestion', 'Others'];
const URGENCY = ['Low', 'Medium', 'High'];
const TYPES = ['Feedback', 'Suggestion'];

exports.landing = (req, res) => res.render('home');

exports.form = (req, res) => res.render('submit', { errors: [], v: {}, CATEGORIES, URGENCY, TYPES });

exports.submit = (req, res) => {
  const b = req.body;
  const v = { type: b.type, category: b.category, subject: (b.subject || '').trim(), message: (b.message || '').trim(), urgency: b.urgency, anonymous: !!b.anonymous };
  const errors = [];
  if (!v.category || !v.subject || !v.message) errors.push('Please fill in all required fields.');
  if (v.category && !CATEGORIES.includes(v.category)) errors.push('Choose a category from the list.');
  if (!TYPES.includes(v.type)) errors.push('Choose Feedback or Suggestion.');
  if (!URGENCY.includes(v.urgency)) errors.push('Choose an urgency level from the list.');
  if (v.subject.length > 100) errors.push('Subject is too long (max 100 characters).');
  if (v.message.length > 2000) errors.push('Message is too long (max 2000 characters).');
  if (errors.length) return res.status(400).render('submit', { errors, v, CATEGORIES, URGENCY, TYPES });

  // anonymous = never attach a user id, even when logged in
  const userId = !v.anonymous && req.session.userId ? req.session.userId : null;
  const code = Feedback.create({ userId, type: v.type, category: v.category, subject: v.subject, message: v.message, urgency: v.urgency });
  res.render('success', { code });
};

exports.trackForm = (req, res) => {
  const code = (req.query.code || '').trim().toUpperCase();
  if (!code) return res.render('track', { item: null, searched: false, code: '' });
  const item = Feedback.findByCode(code);
  res.render('track', { item, searched: true, code });
};

exports.studentDashboard = (req, res) =>
  res.render('student-dashboard', { items: Feedback.byUser(req.session.userId) });

exports.CATEGORIES = CATEGORIES;
