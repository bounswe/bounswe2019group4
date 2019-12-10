const {mongoose} =  require('../db');  // The mongodb connector library

/*
  Model in order to keep user's alerts for trading equipment.
  User can set alert for specific value of trading equipments.
*/
let TradingEquipmentAlert = mongoose.model('TradingEquipmentAlert', {

  userId: {
    type: String,
    require: true
  },
  
  currency:{
    type: String,
    require: true
  },

  rate: {
    type: Number,
    require: true
  },

  compare: {
    type: String,
    require: true
  }
});

module.exports = {
  TradingEquipmentAlert: TradingEquipmentAlert
}