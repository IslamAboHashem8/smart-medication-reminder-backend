const jwt = require('jsonwebtoken');

module.exports = function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    // نفس الـ JWT_SECRET بتاع Backend B
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Backend B بيحط الـ id هنا
    req.user = { _id: decoded.id };

    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};