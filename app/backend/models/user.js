const bcrypt = require('bcryptjs')
const randomstring = require('randomstring')
const {mongoose} =  require('../db');  // The mongodb connector library
const utils = require('../utils')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: 'Name is required',
  },
  
  surname: {
    type: String,
    required: 'Surname is required',
  },

  email: { 
    type: String,
    required: 'Email is required',
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },

  password: {
    type: String,
    minlength: 6
  },

  googleId: {
    type: String,
    default: null
  },

  location: {
    type: String,
    required: true,
  },

  isTrader: {
    type: Boolean,
    default: false,
  },

  isPublic: {
    type: Boolean,
    default: true,
  },
  
  isVerified: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String,
    unique: true,
    default: randomstring.generate,
  },

  iban: {
    type: String,
    default: null,
  },

  tckn: {
    type: String,
    default: null,
  },
  
  recoverPassToken: {
    type: String,
    default: null,
  }
})

userSchema.pre('validate', function (next) {
  const errors = {}
  if(this.googleId) { // when user is logged in with Google
    this.isVerified = true
    if(this.password) {
      errors.password = {
        message: 'Cannot register with Google along with a password',
      }
    }
  } else {
    if(!this.password) {  // when password not provided
      errors.password = {
        message: 'Password is required',
      }
    }
    // strong password check
    else if(!utils.checkPassword(this.password)) {
      errors.password = {
        message: 'Enter valid password. Your password either is less than 6 characters or is easy to guess.',
      }
    }
  }
  if(this.isTrader == true) { // when the user is registering as a trader
    if(!this.iban) {  // when iban is missing
      errors.iban = {
        message: 'Missing iban for trader user'
      }
    } else {  // when iban is provided
      // check valid iban
      if(!utils.checkIBAN(this.iban)) {
        errors.iban = {
          message: 'Enter valid IBAN.'
        }
      }
    }
    if(!this.tckn) {  // when tckn is missing
      errors.tckn = {
        message: 'Missing tckn for trader user'
      }
    } else {    // when tckn is provided
      // check valid tckn
      if(!utils.checkTCKN(this.tckn)) {
        errors.tckn = {
          message: 'Enter valid TCKN.'
        }
      }
    }
  }
  if(Object.keys(errors).length > 0) { // when there are errors
    next(new Error(JSON.stringify(errors)))
  } else {
    next()
  }
  // console.log(errors)
})

/*
  Model for user which has following attributes
    name,
    surname,
    email,
    password,
    location,
    isTrader,
    iban,
    tckn.
*/
let User = mongoose.model('User', userSchema);

module.exports = {
  User: User
}