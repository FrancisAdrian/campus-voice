const r = require('express').Router();
const c = require('../controllers/authController');
r.get('/login', c.loginForm);
r.post('/login', c.login);
r.post('/logout', c.logout);
module.exports = r;
