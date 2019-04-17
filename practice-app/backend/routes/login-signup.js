const express = require('express');
const router = express.Router();

var {User} = require('./../models/user.js');

router.post('/signup', (request, response) => {
    var user = new User({
      name: request.body.name,
      surname: request.body.surname,
      email: request.body.email,
      password: request.body.password,
      location: request.body.location,
      isTrader: request.body.isTrader,
      iban: request.body.iban,
      tckn: request.body.tckn,
    });

    user.save().then((doc) => {
      response.send(doc);
    }, (error) => {
      response.status(400).send(error);
    });
})

router.post('/login', (request, response, nextHandler) => {
    response.send({status: `You cannot login yet, since we haven't implemented that functionality.`})
})

module.exports = router