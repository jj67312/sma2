const express = require('express');
const router = express.Router();

// Utitlities:
const catchAsync = require('../utils/catchAsync');

// Models
const User = require('../models/UserModel');

// Passport
const passport = require('passport');

// User controller
// const users = require('../controllers/userController');
const { Users } = require('../controllers/userController');
const users = new Users();
// middleware:
const { isLoggedIn } = require('../middleware');

router.route('').get(isLoggedIn, users.renderHome);

router
  .route('/register')
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
      keepSessionInfo: true,
    }),
    catchAsync(users.login)
  );

router.get('/logout', users.logout);

module.exports = router;
