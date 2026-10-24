const deny = (res) => res.status(403).render('error', { code: 403, message: 'You do not have permission to open this page.' });

exports.isLoggedIn = (req, res, next) => req.session.userId ? next() : res.redirect('/login');

const role = (...roles) => (req, res, next) => {
  if (!req.session.userId) return res.redirect('/login');
  return roles.includes(req.session.role) ? next() : deny(res);
};
exports.isAdmin = role('admin');
exports.isGuidance = role('guidance');
exports.isStaff = role('admin', 'guidance'); // reports
exports.deny = deny;
