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

  CAD: {
    type: Number,
    default: 0
  },

  AUD: {
    type: Number,
    default: 0
  },

  CHF: {
    type: Number,
    default: 0
  },

  CNY: {
    type: Number,
    default: 0
  },

  DKK: {
    type: Number,
    default: 0
  },

  HKD: {
    type: Number,
    default: 0
  },

  IDR: {
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

  KRW: {
    type: Number,
    default: 0
  },

  KWD: {
    type: Number,
    default: 0
  },

  NOK: {
    type: Number,
    default: 0
  },

  AED: {
    type: Number,
    default: 0
  },

  MXN: {
    type: Number,
    default: 0
  }

});

module.exports = {
  UserAccount: UserAccount
}