const mongoose =  require('mongoose');  // the mongodb connector library

const {dbCredentials} = require('../secrets.js')  // database credentials, contact to the team for the actual file

mongoose.connect(`mongodb://${dbCredentials['username']}:${dbCredentials['password']}@${dbCredentials['ip']}/admin`, {useNewUrlParser: true});

// the User model in the database
let User = mongoose.model('User', {
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
  User: User,
};