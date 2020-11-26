const jwt = require('jsonwebtoken');
const verifyToken = (req, res, next) => {
  const key = process.env.JWT_SECRET;
  const headerAuth = req.headers.authorization;
  if (headerAuth === undefined) {
    return next(new Error('Token was not provided'));
  } else {
    const token = headerAuth.replace(/['"]+/g, '');
    jwt.verify(token, key, (err, decoded) => {
      if (err) {
        return next(new Error('Token is not valid'));
      } else if (decoded === undefined) {
        return next(new Error('Token could not be loaded'));
      }
      req.user = decoded;
      next();
    });
  }
};
const verifyAdmin = (req, res, next) => {
  const user_role = req.user.role;
  if (user_role === 'admin') {
    return next();
  } else {
    next(new Error("You don't have admin permission"));
  }
};
const createToken = (data) => {
  const privateKey = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    jwt.sign(data, privateKey, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};
module.exports = {
  verifyToken,
  verifyAdmin,
  createToken,
};
