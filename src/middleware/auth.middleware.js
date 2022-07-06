const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

const auth = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findOne({
        _id: decoded._id,
        'tokens.token': token
      }).select('-password');

      if (!user) {
        throw new Error('Not authorized, token failed');
      }

      req.user = user;
      req.token = token;

      next();
    } catch (error) {
      res.status(401).send({ message: error.message });
    }
  }

  if (!token) {
    res.status(401).send({ message: 'Not authorized, no token' });
  }
};

module.exports = { auth };
