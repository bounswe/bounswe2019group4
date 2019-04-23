const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let { User } = require('./../models/user.js');  // The connection to the User model in the database

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
router.post('/signup', (request, response) => {
  // User instance to add to the database
  let user = new User({
    ...request.body,
    // Hashes the password
    password: bcrypt.hashSync(request.body.password, 10),
  });

  // Saves the instance into the database, returns any error occured
  user.save().then((doc) => {
    // Omit sensitive data
    const { isTrader, name, surname, email, location } = doc  // Extract certain keys from doc
    response.send({ isTrader, name, surname, email, location });  // Send only the extracted keys 
  }, (error) => {
    response.status(400).send(error);
  });
})

/*
  Post method for login.
  Get user attributes from request.body and respondes accordingly.
*/
router.post('/login', async (request, response) => {
  const { email, password } = request.body  //Email and password fields in request body

  if (!email) {           // If there's no email field in the request, return status 400
    response.status(400).send({ errmsg: 'Email is required in the request body' })
  } else if (!password) { // If there's no password field in the request, return status 400
    response.status(400).send({ errmsg: 'Password is required in the request body' })
  }

  try {
    let userRegistered = await User.findOne({ email })  // Retrieve the user instance from database
    if (!userRegistered) {  // If no instance is returned, credentials are invalid
      throw Error('Email not found!')
    }

    // If password hashed in the user instance doesn't match with the password in the request, credentials are invalid
    if (bcrypt.compareSync(password, userRegistered['password'])) {
      // The user credentials are correct, its instance is userRegistered and added to the cookie
      request.session['user'] = userRegistered
      const { isTrader, name, surname, email, location } = userRegistered  // Extract certain keys from user
      response.send({
        msg: 'Successfully logged in.',
        isTrader, name, surname, email, location  // Send only the extracted keys
      })
    } else {
      throw Error('Password does not match!')
    }

  } catch (err) { // Some error is thrown before, returns the error message
    response.status(400).send({ errmsg: err.message })
  }
})

module.exports = router