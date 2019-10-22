const {mongoose} =  require('../db');  // The mongodb connector library

let TradingEquipmentFollow = mongoose.model('TradingEquipmentFollow', {
  UserId: {
    type: String,
    require: true
  },

  TradingEq: {
    type: String,
    require: true
  }
});

module.exports = {
  TradingEquipmentFollow: TradingEquipmentFollow
}