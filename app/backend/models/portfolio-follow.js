const {mongoose} =  require('../db');  // The mongodb connector library

let PortfolioFollow = mongoose.model('PortfolioFollow', {
  UserId: {
    type: String,
    require: true
  },

  PortfolioId: {
    type: String,
    require: true
  }
});

module.exports = {
    PortfolioFollow: PortfolioFollow
}