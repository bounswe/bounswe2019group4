const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/login-signup')
const { modelBinder } = require('../controllers/db')
const { User } = require('../models/user')

/*
  Post endpoint for signup.
  Check controller function for more detail
*/
router.post('/signup', modelBinder(User, 'User'), authControllers.signup)

/*
  Post endpoint for login.
  Check controller function for more detail
*/
router.post('/login', modelBinder(User, 'User'), authControllers.login)

/*
  Post endpoint for google authentication.
  Check controller function for more detail
*/
router.post('/google', modelBinder(User, 'User'), authControllers.google)

/*
  Get endpoint for forget passport.
*/
router.post('/forget-password', modelBinder(User, 'User'), authControllers.forgetPassword)

/*
  Post endpoint to reset passport.
*/
router.post('/reset-password', modelBinder(User, 'User'), authControllers.resetPassword)
/*
  Get method in order to verify email.
*/
router.get('/verify', modelBinder(User, 'User'), authControllers.verify)

module.exports = router