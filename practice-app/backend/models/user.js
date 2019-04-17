const mongoose =  require('mongoose');  // The mongodb connector library

const {dbCredentials} = require('../secrets.js')  // Database credentials, contact to the team for the actual file

// Connecting to database.
mongoose.connect(`mongodb://${dbCredentials['username']}:${dbCredentials['password']}@${dbCredentials['ip']}/admin`, {useNewUrlParser: true});

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