const express = require('express');
const router = express.Router();
const authControllers = require('../controllers/login-signup')
const { modelBinder } = require('../controllers/db')
const { User } = require('../models/user')
const { validateBody } = require('../controllers/middleware')

/*
  Post endpoint for signup.
  Check controller function for more detail
*/
router.post('/signup', [
  validateBody(['name', 'surname', 'email', 'location', 'isPublic']),
  modelBinder(User, 'User')], authControllers.signup)

/*
  Post endpoint for login.
  Check controller function for more detail
*/
router.post('/login', [
  validateBody(['password', 'email']),
  modelBinder(User, 'User')], authControllers.login)

/*
  Post endpoint for google authentication.
  Check controller function for more detail
*/
router.post('/google', [
  validateBody(['googleId']),
  modelBinder(User, 'User')], authControllers.google)

/*
  Get endpoint for forget passport.
*/
router.post('/forget-password', [
  validateBody(['email']),
  modelBinder(User, 'User')], authControllers.forgetPassword)

/*
  Post endpoint to reset passport.
*/
router.post('/reset-password', [
  validateBody(['password', 'token']),
  modelBinder(User, 'User')], authControllers.resetPassword)

/*
  Post endpoint to logout.
*/
router.post('/logout', modelBinder(User, 'User'), authControllers.logout)

/*
  Get method in order to verify email.
*/
router.get('/verify', modelBinder(User, 'User'), authControllers.verify)



module.exports = router