const jwt = require('jsonwebtoken');


const authenticate = (req, res, next) => {
  const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Invalid token:', error);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
