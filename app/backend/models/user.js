const {mongoose} =  require('../db');  // The mongodb connector library

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
let User = mongoose.model('User', {
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
    required: 'Password is required',
    minlength: 6,
  },

  location: {
    type: String,
    required: true,
  },

  isTrader: {
    type: Boolean,
    default: false,
  },

  token: {
    type: String
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
});

module.exports = {
  User: User
}