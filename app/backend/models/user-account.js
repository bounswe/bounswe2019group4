const {mongoose} =  require('../db');  // The mongodb connector library

let UserAccount = mongoose.model('UserAccount', {

  userId: {
    type: String,
    require: true,
    unique: true
  },

  EUR: {
    type: Number,
    default: 0
  },

  TRY: {
    type: Number,
    default: 0
  }, 

  USD: {
    type: Number,
    default: 0
  },

  AUD: {
    type: Number,
    default: 0
  },

  CNY: {
    type: Number,
    default: 0
  },

  HKD: {
    type: Number,
    default: 0
  },

  INR: {
    type: Number,
    default: 0
  },

  JPY: {
    type: Number,
    default: 0
  },

  AED: {
    type: Number,
    default: 0
  },

  LTC: {
    type: Number,
    default: 0
  },

  XRP: {
    type: Number,
    default: 0
  },

  ETH: {
    type: Number,
    default: 0
  },

  BTC: {
    type: Number,
    default: 0
  },

  FB: {
    type: Number,
    default: 0
  },

  AMZN: {
    type: Number,
    default: 0
  },

  AAPL: {
    type: Number,
    default: 0
  },

  MSFT: {
    type: Number,
    default: 0
  },

  GOOG: {
    type: Number,
    default: 0
  }

});

module.exports = {
  UserAccount: UserAccount
}