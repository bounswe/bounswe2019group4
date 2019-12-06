const {mongoose} =  require('../db');  // The mongodb connector library

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