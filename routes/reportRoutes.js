const r = require('express').Router();
const { isStaff } = require('../middleware/auth');
r.get('/', isStaff, require('../controllers/adminController').reports);
module.exports = r;
