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

module.exports = router