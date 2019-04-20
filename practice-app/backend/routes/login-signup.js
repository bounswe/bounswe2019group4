const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

let {User} = require('./../models/user.js');  // The connection to the User model in the database

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
router.post('/signup', (request, response) => {
    // User instance to add to the database
    let user = new User({
      ...request.body,
      // hashes the password
      password: bcrypt.hashSync(request.body.password, 10),
    });

    // saves the instance into the database, returns any error occured
    user.save().then((doc) => {
      // omit sensitive data
      const { isTrader, name, surname, email, location } = doc  // extract certain keys from doc
      response.send({ isTrader, name, surname, email, location });  // send only the extracted keys 
    }, (error) => {
      response.status(400).send(error);
    });
})

// responses a text sample message in a JSON format
router.post('/login', async (request, response) => {
  const {email, password} = request.body  //email and password fields in request body
  
  if (!email) {           // if there's no email field in the request, return status 400
    response.status(400).send({errmsg:'email is required in the request body'})
  } else if (!password) { // if there's no password field in the request, return status 400
    response.status(400).send({errmsg:'password is required in the request body'})
  }

  try {
    let userRegistered = await User.findOne({email})  // retrieve the user instance from database
    if (!userRegistered) {  // if no instance is returned, credentials are invalid
      throw Error('invalid credentials')
    }

    // if password hashed in the user instance doesn't match with the password in the request, credentials are invalid
    if (bcrypt.compareSync(password, userRegistered['password'])) { 
      // TODO the user credentials are correct, its instance is userRegistered, some cookie should be generated
      response.send({status: 'You deserved some cookies!'})
    } else {
      throw Error('invalid credentials')
    }
  } catch (err) { // some error is thrown before, returns the error message
      response.status(400).send({errmsg: err.message})
  }
})

module.exports = router