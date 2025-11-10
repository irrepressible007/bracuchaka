// api/middleware/auth.js

const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // 1. Get token from the request header
  const token = req.header('x-auth-token');

  // 2. Check if token doesn't exist
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // 3. Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Add the decoded user payload (id, role) to the request object
    req.user = decoded.user;

    // 5. Call the next function in the chain (the actual route)
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// --- Optional but Recommended: Role-specific middleware ---
// This creates a new middleware function that also checks for a specific role.
const authorize = (roles) => {
  return (req, res, next) => {
    // This runs AFTER the 'auth' middleware, so we have req.user
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
    next();
  };
};

module.exports = { auth, authorize };