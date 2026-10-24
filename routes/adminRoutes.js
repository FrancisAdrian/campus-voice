// Mounted twice in app.js: /admin (admin role) and /guidance (guidance role)
const r = require('express').Router();
const c = require('../controllers/adminController');
const { isAdmin, isGuidance } = require('../middleware/auth');

const guard = (req, res, next) => (req.baseUrl === '/guidance' ? isGuidance : isAdmin)(req, res, next);
r.use(guard);
r.get('/dashboard', c.dashboard);
r.get('/feedback/:id', c.details);
r.post('/feedback/:id/respond', c.respond);

// user management is admin-only
r.get('/users', (req, res, next) => req.baseUrl === '/admin' ? c.users(req, res) : next());
r.post('/users', (req, res, next) => req.baseUrl === '/admin' ? c.addUser(req, res) : next());
r.post('/users/:id/toggle', (req, res, next) => req.baseUrl === '/admin' ? c.toggleUser(req, res) : next());
module.exports = r;
