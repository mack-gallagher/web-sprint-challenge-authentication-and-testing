const jwt = require('jsonwebtoken');
const secret = require('../secrets');

module.exports = (req, res, next) => {
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */

  const token = req.headers.authorization;

  if (!token) {
    res.status(403).json({ message: 'token required' });
    return;
  } else if (token.split('.').length !== 3
             || !jwt.verify(token,secret) ) {
    res.status(401).json({ message: 'token invalid!' });
    return;
  } else {
    req.headers.authorization = jwt.verify(token,secret);
    next();
  }

};
