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
router.post('/login', (request, response, nextHandler) => {
    response.send({status: `You cannot login yet, since we haven't implemented that functionality.`})
})

module.exports = router