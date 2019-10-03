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
*/let User = mongoose.model('User', {
  name: {
    type: String,
    required: true,
  },
  
  surname: {
    type: String,
    required: true,
  },

  email: { 
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
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

  iban: {
    type: String,
    default: null,
  },

  tckn: {
    type: String,
    default: null,
  },
});

module.exports = {
  User: User
}