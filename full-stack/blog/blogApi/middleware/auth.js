const passport = require("../config/passport");

// Valid token required, or 401.
function requireAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: { message: "Authentication required." } });
    }
    req.user = user;
    next();
  })(req, res, next);
}

// Logged in AND an author, or 403 (401 if not logged in at all).
function requireAuthor(req, res, next) {
  requireAuth(req, res, (err) => {
    if (err) return next(err);
    if (req.user.role !== "AUTHOR") {
      return res
        .status(403)
        .json({ error: { message: "Author access required." } });
    }
    next();
  });
}

// Attach req.user if a valid token is present, but never reject.
// Lets one endpoint serve drafts to the author and published-only to everyone else.
function optionalAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) return next(err);
    if (user) req.user = user;
    next();
  })(req, res, next);
}

module.exports = { requireAuth, requireAuthor, optionalAuth };
