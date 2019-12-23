const {mongoose} =  require('../db');  // The mongodb connector library

let TradingEquipment = mongoose.model('TradingEquipment', {

  _id: {
    code:String, 
    Date:String,
  },
  
  code: {
    type: String
  },

  name: {
    type: String
  },

  value: {
    type: String
  },

  open: {
    type: String
  },

  high: {
    type: String
  },

  low: {
    type: String
  },

  close: {
    type: String
  },

  Date:{
    type: String
  }
  
});

module.exports = {
  TradingEquipment: TradingEquipment
}