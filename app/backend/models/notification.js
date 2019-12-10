const {mongoose} =  require('../db');  // The mongodb connector library

/*
  Model in order to keep user's notification.
  It keeps notifications with their date.
*/
let Notification = mongoose.model('Notification', {

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
  Notification: Notification
}