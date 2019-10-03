const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.signup = (request, response) => {
  // User instance to add to the database
  let user = new User({
    ...request.body,
    // Hashes the password
    password: bcrypt.hashSync(request.body.password, 10),
  });

  // Saves the instance into the database, returns any error occured
  user.save().then((doc) => {
    // Omit sensitive data
    const { _id, isTrader, name, surname, email, location } = doc  // Extract certain keys from doc
    response.send({ _id, isTrader, name, surname, email, location });  // Send only the extracted keys 
  }, (error) => {
    response.status(400).send(error);
  });
}

/*
  Post endpoint for login.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.login = async (request, response) => {
  const { email, password } = request.body  //Email and password fields in request body

  if (!email) {           // If there's no email field in the request, return status 400
    response.status(400).send({ errmsg: 'Email is required in the request body' })
  } else if (!password) { // If there's no password field in the request, return status 400
    response.status(400).send({ errmsg: 'Password is required in the request body' })
  } else{
    try {
      let userRegistered = await User.findOne({ email })  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, credentials are invalid
        throw Error('Email not found or password does not match!')
      }

      // If password hashed in the user instance doesn't match with the password in the request, credentials are invalid
      if (bcrypt.compareSync(password, userRegistered['password'])) {
        // The user credentials are correct, its instance is userRegistered and added to the cookie
        request.session['user'] = userRegistered
        const { _id, isTrader, name, surname, email, location } = userRegistered  // Extract certain keys from user
        response.send({
          msg: 'Successfully logged in.',
          _id, isTrader, name, surname, email, location  // Send only the extracted keys
        })
      } else {
        throw Error('Email not found or password does not match!')
      }

    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }
}
