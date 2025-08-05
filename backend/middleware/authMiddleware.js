const jwt = require('jsonwebtoken');

// ✅ Middleware to check if user is logged in (token is valid)
function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Access token missing' });

  jwt.verify(token, "secretkey", (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// ✅ Optional: Middleware to restrict access to admin only
function isAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}

module.exports = {
  auth,
  isAdmin
};
