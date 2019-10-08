const bcrypt = require('bcryptjs');
let { User } = require('./../models/user.js');  // The connection to the User model in the database
const { sendForgetPassword } = require('./../emails/forgetPassword');
const { sendVerifyEmail } = require('./../emails/verifyEmail');
const randomstring = require('randomstring')

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.signup = async (request, response) => {
  // create a token for the user and make sure it's unique
  let token = randomstring.generate()
  let duplicateTokenOwners = await User.findOne({token})
  while(duplicateTokenOwners) {
    token = randomstring.generate()
    duplicateTokenOwners = await User.findOne({token})
  }
  
  // User instance to add to the database
  let user = new User({
    ...request.body,
    // Hashes the password
    password: bcrypt.hashSync(request.body.password, 10),
    token: token,
  });

  // Saves the instance into the database, returns any error occured
  user.save()
    .then(doc => {
    // Omit sensitive data
    const { _id, isTrader, name, surname, email, location } = doc  // Extract certain keys from doc
    sendVerifyEmail(email, user.token)
    response.send({ _id, isTrader, name, surname, email, location });  // Send only the extracted keys 
  }).catch(error => {
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
        return
      }

      if(!userRegistered.isVerified){
        throw Error('Email not verified!')
        return
      }

      // If password hashed in the user instance doesn't match with the password in the request, credentials are invalid
      if (bcrypt.compareSync(password, userRegistered['password'])) {
        // The user credentials are correct, its instance is userRegistered and added to the cookie
        request.session['user'] = userRegistered
        const { _id, isTrader, isPublic, name, surname, email, location } = userRegistered  // Extract certain keys from user
        response.send({
          msg: 'Successfully logged in.',
          _id, isTrader, isPublic, name, surname, email, location  // Send only the extracted keys
        })
      } else {
        throw Error('Email not found or password does not match!')
      }

    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }
}

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.google = async (request, response) => {
  const { email, password } = request.body  //Email and password fields in request body

    try {
      let userRegistered = await User.findOne({ email })  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, the user must be registered.
        response.status(400).send({
          errmsg: 'User must be signed up'
        })
      }
      else{
        // If password hashed in the user instance doesn't match with the password in the request, credentials are invalid
        if (bcrypt.compareSync(password, userRegistered['password'])) {
          // The user credentials are correct, its instance is userRegistered and added to the cookie
          request.session['user'] = userRegistered
          const { _id, isTrader, isPublic, name, surname, email, location } = userRegistered  // Extract certain keys from user
          response.send({
            msg: 'Successfully logged in.',
            _id, isTrader, isPublic, name, surname, email, location  // Send only the extracted keys
          })
        } else {
          throw Error('Email not found or password does not match!')
        }
      }
    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }

/*
  Post method for forget password, it sends email to user in order reset their password.
*/
module.exports.forgetPassword = async (request, response) => {
  
  recoverPassToken = randomstring.generate()

  let duplicateTokenOwners = await User.findOne({recoverPassToken})
  while(duplicateTokenOwners) {
    recoverPassToken = randomstring.generate()
    duplicateTokenOwners = await User.findOne({recoverPassToken})
  }

  const email = request.body.email

  if (!email) {           // If there's no email field in the request, return status 400
  response.status(400).send({ errmsg: 'Email is required in the request body' })
  } else {
    try {
      let userRegistered = await User.findOne({ email })  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, credentials are invalid
        throw Error('User not found.')
      }

      userRegistered.recoverPassToken = recoverPassToken

      userRegistered.save().then(() => {
        sendForgetPassword(email, recoverPassToken) // Send email to reset password.
        response.sendStatus(204);   
      }, (error) => {
        response.status(400).send(error);
      });

    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }
}

/*
  Post method for reset password. It gets new password and saves it.
*/  
module.exports.resetPassword = async (request, response) => {
  const recoverPassToken = request.body.token
  if (!recoverPassToken) {           // If there's no email field in the request, return status 400
    response.status(400).send({ errmsg: 'Token is required in the request body' })
  } else if (!request.body.password) {
    response.status(400).send({errmsg: 'New password is required in the request body'})
  } else {
    try {
      let userRegistered = await User.findOne({ recoverPassToken })  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, credentials are invalid
        throw Error('User not found.')
      }

      userRegistered.recoverPassToken = null
      userRegistered.password = bcrypt.hashSync(request.body.password, 10)

      userRegistered.save().then(() => {
        response.sendStatus(204);
      }, (error) => {
        response.status(400).send({error});
      });

    } catch (err) { // Some error is thrown before, returns the error message
        response.status(400).send({ errmsg: err.message })
    }
  }
}

/*
  Get endpoint for verify email.
*/
module.exports.verify = async (request, response) => {
  const token = request.query.token
  if(!token) {
    response.status(400).send({
      errmsg: "Verification token should be supplied in the query string"
    })
  } else {
    User.findOne({ token })     // Retrieve the user instance from database
      .then(user => {
        if(user.isVerified) {
          response.sendStatus(204)
        } else {
          user.isVerified = true
          user.save()
            .then(data => {
              response.sendStatus(204)
            })
            .catch(error => {
              response.status(400).send({errmsg: error})
            })
        }
      })
      .catch(error => {
        response.status(400).send({errmsg: "invalid verification token"})
      })
  }
}
