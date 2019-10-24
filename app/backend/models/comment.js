const {mongoose} =  require('../db');  // The mongodb connector library

let Comment = mongoose.Schema({

  userId: {
    type: String,
    require: true
  },

  related: {
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

let EventsComment = mongoose.model('EventsComment', Comment)
let TradingEquipmentsComment = mongoose.model('TradingEquipmentsComment', Comment)

module.exports = {
  EventsComment: EventsComment,
  TradingEquipmentsComment: TradingEquipmentsComment
}