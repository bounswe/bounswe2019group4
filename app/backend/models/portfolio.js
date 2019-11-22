const {mongoose} =  require('../db');  // The mongodb connector library

let Portfolio = mongoose.model('Portfolio', {

  userId: {
    type: String,
    require: true
  },

  title:{
    type: String,
    require: true,
    unique: true
  },

  definition:{
    type: String,
    require: true
  },

  date:{
    type: Date,
    require: true
  },

  isPrivate: {
    type: Boolean,
    require: true
  }
});

module.exports = {
    Portfolio: Portfolio
}