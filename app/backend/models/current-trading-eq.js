const {mongoose} =  require('../db');  // The mongodb connector library

let CurrentTradingEquipment = mongoose.model('CurrentTradingEquipment', {

  from: {
    type: String,
    require: true
  },

  to: {
    type: String,
    require: true
  },

  rate: {
    type: String,
    require: true
  },

  Date:{
    type: String,
    require: true
  }
  
});

module.exports = {
  CurrentTradingEquipment: CurrentTradingEquipment
}