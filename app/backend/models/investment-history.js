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
  }
});

module.exports = {
  InvestmentHistory: InvestmentHistory
}