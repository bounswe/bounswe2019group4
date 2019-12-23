const {mongoose} =  require('../db');  // The mongodb connector library

let TradingEquipmentPrediction = mongoose.model('TradingEquipmentPrediction', {

  _id: {
    UserId:String, 
    TradingEq:String,
    Date:String,
  },
  UserId: {
    type: String,
    require: true
  },

  TradingEq: {
    type: String,
    require: true
  },

  Date: {
    type: String,
    require : true
  },

  DateWithTime: {
    type: Date,
    require : true
  },

  Prediction: {
    type: String,  // up, down
    require: true
  },

  CurrentValue: {
    type: String,
    require: true
  },

  Result: {
    type: String,  // true, false 
    default: "",
  }
  
});

module.exports = {
  TradingEquipmentPrediction: TradingEquipmentPrediction
}