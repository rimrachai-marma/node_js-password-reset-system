const express = require('express');

const {
  register,
  login,
  getUserProfile,
  logout,
  logoutAllDevices,
  deleteUserAcount,
  updateUserprofile,
  passwordResetRequest,
  resetPassword
} = require('../controllers/user.controller');

const { auth } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/users', register);
router.post('/users/login', login);
router.get('/users/profile', auth, getUserProfile);
router.post('/users/logout', auth, logout);
router.post('/users/logoutAllDevices', auth, logoutAllDevices);
router.delete('/users/profile', auth, deleteUserAcount);
router.patch('/users/profile', auth, updateUserprofile);

router.post('/users/passwordResetRequest', passwordResetRequest);
router.patch('/users/passwordReset', resetPassword);

module.exports = router;
