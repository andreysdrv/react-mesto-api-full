const jwt = require('jsonwebtoken');
const Auth = require('../errors/Auth');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    throw new Auth('Необходима авторизация');
  }
  req.user = payload;

  next();
};

module.exports = auth;
