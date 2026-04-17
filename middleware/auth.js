// Authentication middleware
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('error', 'You must be logged in to access this page');
    return res.redirect('/login');
  }
  next();
};

module.exports.isGuest = (req, res, next) => {
  if (req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

// Attach user info to all views
module.exports.attachUser = (req, res, next) => {
  res.locals.currentUser = req.session.userId || null;
  res.locals.username = req.session.username || null;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};
