require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
require('./config/db'); // creates tables + seeds demo accounts

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-only-secret',
  resave: false,
  saveUninitialized: false,
  rolling: true, // timeout counts from last activity
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 30 * 60 * 1000 } // 30 min
}));

app.use((req, res, next) => {
  res.locals.user = req.session.userId ? { id: req.session.userId, name: req.session.name, role: req.session.role } : null;
  next();
});

app.use('/', require('./routes/authRoutes'));
app.use('/', require('./routes/feedbackRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/guidance', require('./routes/adminRoutes'));
app.use('/reports', require('./routes/reportRoutes'));

app.use((req, res) => res.status(404).render('error', { code: 404, message: 'That page does not exist.' }));
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).render('error', { code: 500, message: 'Something went wrong on our side.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Campus Voice running at http://localhost:${PORT}`));
