const {mongoose} =  require('../db');  // The mongodb connector library

/*
  Model in order to keep user's investment actions.
  User can either deposit money to account, buy a currency, or sell a currency.
  It keeps those actions with their date.
*/
let InvestmentHistory = mongoose.model('InvestmentHistory', {

  userId: {
    type: String,
    require: true
  },

  text: {
    type: String,
    require: true
  },

  date:{
    type: Date,
    require: true
  },

  profit: {
    type:Number,
    require: true,
    default: 0
  },

  type: {
    type: String,
    require: true
  },

  amount: {
    type: Number,
    require: true
  },

  currency: {
    type: String,
    require: true
  },

  fromRate: {
    type: Number,
    require: true
  }
});

module.exports = {
  InvestmentHistory: InvestmentHistory
}