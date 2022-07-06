const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/user.model');
const Token = require('../models/token.model');
const {
  sendPasswordResetRequestEmail,
  sendPasswordResetSuccessEmail,
  sendRegisterEmail,
  sendCancelationEmail
} = require('../emails/acount');

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({ name, email, password });

    const token = await user.generateAuthToken();

    sendRegisterEmail(user.email, user.name);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'User already exists' });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);

    const token = await user.generateAuthToken();

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -tokens ');

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.tokens = user.tokens.filter((_token) => {
      return _token.token !== req.token;
    });
    await user.save();

    res.status(200).json({ message: 'Successfuly logout' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutAllDevices = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.tokens = [];
    await user.save();

    res.status(200).json({ message: 'Successfuly logout all devices' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUserAcount = async (req, res) => {
  try {
    await req.user.remove();

    sendCancelationEmail(req.user.email, req.user.name);

    res.status(200).json({ message: 'Successfuly deleted acount' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserprofile = async (req, res) => {
  const updates = Object.keys(req.body);

  const allowedUpdates = ['name', 'email', 'password'];

  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  try {
    if (!isValidOperation) throw new Error('Invalid updates');

    const user = await User.findById(req.user._id);

    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();

    res.status(200).json({ message: 'Successfuly updated profile' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const passwordResetRequest = async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    await Token.findOneAndDelete({ user: user._id });

    const resetToken = crypto.randomBytes(32).toString('hex');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(resetToken, salt);

    await Token.create({
      user: user._id,
      token: hash
    });

    const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&id=${user._id}`;

    sendPasswordResetRequestEmail(email, user.name, link);

    res.json({ message: 'Successfuly password reset link sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const userId = req.body.id;
  const token = req.body.resetToken;
  const password = req.body.password;

  try {
    const _token = await Token.findOne({ user: userId });

    if (!_token) {
      return res
        .status(500)
        .json({ message: 'Invalid or expired password reset token' });
    }
    const isValid = await bcrypt.compare(token, _token.token);

    if (!isValid) {
      return res
        .status(500)
        .json({ message: 'Invalid or expired password reset token' });
    }

    const user = await User.findById(req.body.id);
    if (!user) {
      return res.status(404).json({ message: 'User does not exist' });
    }
    user.password = password;
    await user.save();
    sendPasswordResetSuccessEmail(user.email, user.name);

    res.json({ message: 'Password reset Successfuly' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getUserProfile,
  logout,
  logoutAllDevices,
  deleteUserAcount,
  updateUserprofile,
  passwordResetRequest,
  resetPassword
};
