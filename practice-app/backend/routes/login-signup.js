const express = require('express');
const router = express.Router();

let {User} = require('./../models/user.js');  // The connection to the User model in the database

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
router.post('/signup', (request, response) => {
    // User instance to addto the database
    let user = new User({
      name: request.body.name,
      surname: request.body.surname,
      email: request.body.email,
      password: request.body.password,
      location: request.body.location,
      isTrader: request.body.isTrader,
      iban: request.body.iban,
      tckn: request.body.tckn,
    });

    // saves the instance into the database, returns any error occured
    user.save().then((doc) => {
      response.send(doc);
    }, (error) => {
      response.status(400).send(error);
    });
})

// responses a text sample message in a JSON format
router.post('/login', (request, response, nextHandler) => {
    response.send({status: `You cannot login yet, since we haven't implemented that functionality.`})
})

module.exports = router