const bcrypt = require('bcryptjs');
const { sendForgetPassword } = require('./../emails/forgetPassword');
const { sendVerifyEmail } = require('./../emails/verifyEmail');
const randomstring = require('randomstring')
const { checkPassword, checkIBAN, checkTCKN } = require('../utils')

/*
  Post method for signup.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.signup = async (request, response) => {
  let User = request.models['User']

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
    token: token,
  });


  if(!request.body.googleId){
    if(!request.body.password){
      response.status(400).send({ errmsg: 'Password is required in the request body' })
      return
    }

    // check whether password is valid or not.
    if(!checkPassword(request.body.password)){
      response.status(400).send({ errmsg: 'Enter valid password. Your password either is less than 6 characters or is easy to guess.' })
      return
    } 

    // Hashes the password
    user.password = bcrypt.hashSync(request.body.password, 10)
  }
  else{
    user.isVerified = true
  }

  if(request.body.isTrader == true){
    if(!request.body.iban){
      response.status(400).send({ errmsg: 'IBAN is required in the request body' }) 
      return
    } 

    if(!request.body.tckn){
      response.status(400).send({ errmsg: 'TCKN is required in the request body' }) 
      return
    } 

    if(!checkIBAN(request.body.iban)){
      response.status(400).send({ errmsg: 'Enter valid IBAN.' })
      return
    }

    if(!checkTCKN(request.body.tckn)){
      response.status(400).send({ errmsg: 'Enter valid TCKN.' })
      return
    }
  }
  
  // Saves the instance into the database, returns any error occured
  user.save()
    .then(doc => {
    // Omit sensitive data
    const { _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified, googleId } = doc  // Extract certain keys from doc
    
    if(!user.googleId)
      sendVerifyEmail(email, user.token)

    response.send({ _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified, googleId });  // Send only the extracted keys 
  }).catch(error => {
    response.status(400).send(error);
  });
}

/*
  Post endpoint for login.
  Get user attributes from request.body and respondes accordingly.
*/
module.exports.login = async (request, response) => {
  let User = request.models['User']
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
        const { _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified } = userRegistered  // Extract certain keys from user
        response.send({
          msg: 'Successfully logged in.',
          _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified  // Send only the extracted keys
        })
      } else {
        throw Error('Email not found or password does not match!')
      }

    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }
}

module.exports.google = async (request, response) => {
  let User = request.models['User']
  const googleId = request.body.googleId  //Email and password fields in request body

  if (!googleId) {           // If there's no email field in the request, return status 400
    response.status(400).send({ errmsg: 'Google ID required' })
  } else{
    try {
      let userRegistered = await User.findOne({googleId})  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, credentials are invalid
        response.status(400).send({ errmsg: 'User must be signed up' })
      }else{
        request.session['user'] = userRegistered
        const { _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified, googleId} = userRegistered  // Extract certain keys from user
        response.send({
          msg: 'Successfully logged in.',
          _id, name, surname, email, location, isTrader, iban, tckn, isPublic, isVerified, googleId // Send only the extracted keys
        })
      }
    } catch (err) { // Some error is thrown before, returns the error message
      response.status(400).send({ errmsg: err.message })
    }
  }
}

/*
  Post method for forget password, it sends email to user in order reset their password.
*/
module.exports.forgetPassword = async (request, response) => {
  let User = request.models['User']
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

      if(userRegistered.googleId){   // if user registered via Google, he/she cannot change password
        throw Error('User registered via Google.')
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
  let User = request.models['User']
  const recoverPassToken = request.body.token
  if (!recoverPassToken) {           // If there's no email field in the request, return status 400
    return response.status(400).send({ errmsg: 'Token is required in the request body' })
  } 
  
  if (!request.body.password) {
    return response.status(400).send({errmsg: 'New password is required in the request body'})
  }
  // check whether password is valid or not.
  if(!checkPassword(request.body.password)){
    response.status(400).send({ errmsg: 'Enter valid password. Your password either is less than 6 characters or is easy to guess.' })
  } else{
    try {
      let userRegistered = await User.findOne({ recoverPassToken })  // Retrieve the user instance from database
      if (!userRegistered) {  // If no instance is returned, credentials are invalid
        throw Error('User not found.')
      }

      if(userRegistered.googleId){
        throw Error('User registered via Google')  // if user registered via Google, he/she cannot change password
      }

      userRegistered.recoverPassToken = null
      userRegistered.password = bcrypt.hashSync(request.body.password, 10)

      userRegistered.save().then(() => {
        return response.sendStatus(204);
      }, (error) => {
        return response.status(400).send({error});
      });

    } catch (err) { // Some error is thrown before, returns the error message
        return response.status(400).send({ errmsg: err.message })
    }
  }
}

/*
  Get endpoint for verify email.
*/
module.exports.verify = async (request, response) => {
  let User = request.models.User
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

/*
  Get endpoint for verify email.
*/
module.exports.logout = (request, response) => {
    request.session['user'] = null
    response.status(204).send()
}