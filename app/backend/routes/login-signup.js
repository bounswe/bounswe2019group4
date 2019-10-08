const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/login-signup')

/*
  Post endpoint for signup.
  Check controller function for more detail
*/
router.post('/signup', authControllers.signup)

/*
  Post endpoint for login.
  Check controller function for more detail
*/
router.post('/login', authControllers.login)

/*
  Post endpoint for google authentication.
  Check controller function for more detail
*/
router.post('/google', authControllers.google)

/*
  Get endpoint for forget passport.
*/
router.post('/forget-password', authControllers.forgetPassword)

/*
  Post endpoint to reset passport.
*/
router.post('/reset-password', authControllers.resetPassword)

/*
  Get method in order to verify email.
*/
router.get('/verify', authControllers.verify)

module.exports = router