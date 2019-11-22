const {mongoose} =  require('../db');  // The mongodb connector library

let PortfolioTradingEq = mongoose.model('PortfolioTradingEq', {

  _id: {
    PortfolioId:String, 
    TradingEq:String,
  },

  PortfolioId: {
    type: String,
    require: true
  },

  TradingEq: {
    type: String,
    require: true
  }
});

module.exports = {
  PortfolioTradingEq: PortfolioTradingEq
}