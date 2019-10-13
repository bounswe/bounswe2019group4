const mongoose =  require('mongoose');  // The mongodb connector library

const {dbCredentials} = require('./secrets.js')  // Database credentials, contact to the team for the actual file

// it says ensureIndex is deprecated and createIndexes should be used instead
mongoose.set('useCreateIndex', true)
// Connecting to database.
mongoose.connect(
  `mongodb://${dbCredentials['ip']}/admin`,
  {
    useNewUrlParser: true,
    user: dbCredentials['username'],
    pass: dbCredentials['password'],
    useUnifiedTopology: true,
  },
  err => {
    if(err) {
      console.log(err)
    }
  });

  module.exports = {
    mongoose
  }