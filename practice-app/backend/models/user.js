const mongoose =  require('mongoose');  // The mongodb connector library

const {dbCredentials} = require('../secrets.js')  // Database credentials, contact to the team for the actual file

// it says ensureIndex is deprecated and createIndexes should be used instead
mongoose.set('useCreateIndex', true)
// Connecting to database.
mongoose.connect(
  `mongodb://${dbCredentials['ip']}/admin`,
  {
    useNewUrlParser: true,
    user: dbCredentials['username'],
    pass: dbCredentials['password'],
  },
  err => {
    if(err) {
      console.log(err)
    }
  });

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