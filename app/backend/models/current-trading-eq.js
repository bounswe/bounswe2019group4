const {mongoose} =  require('../db');  // The mongodb connector library

let CurrentTradingEquipment = mongoose.model('CurrentTradingEquipment', {

  from: {
    type: String,
    require: true
  },

  fromName: {
    type: String
  },

  to: {
    type: String,
    require: true
  },

  toName: {
    type: String
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