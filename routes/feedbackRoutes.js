const r = require('express').Router();
const c = require('../controllers/feedbackController');
const { isLoggedIn } = require('../middleware/auth');
r.get('/', c.landing);
r.get('/submit', c.form);
r.post('/submit', c.submit);
r.get('/track', c.trackForm);
r.get('/student/dashboard', isLoggedIn, c.studentDashboard);
module.exports = r;
