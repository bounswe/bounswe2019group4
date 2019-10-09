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
  Get endpoint for forget passport.
*/
router.post('/forget-password', modelBinder(User, 'User'), authControllers.forgetPassword)

/*
  Post endpoint to reset passport.
*/
router.post('/reset-password', modelBinder(User, 'User'), authControllers.resetPassword)

/*
  Post endpoint to logout.
*/
router.post('/logout', modelBinder(User, 'User'), authControllers.logout)

/*
  Get method in order to verify email.
*/
router.get('/verify', modelBinder(User, 'User'), authControllers.verify)



module.exports = router