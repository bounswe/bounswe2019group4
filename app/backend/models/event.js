const {mongoose} =  require('../db');  // The mongodb connector library

let Event = mongoose.model('Event', {
  CalendarId: {
    type: String,
    unique: true,
  },

  Date: {
    type: Date
  },

  Country: {
    type: String
  },

  Catogory: {
    type: String,
  },

  Event: {
    type: String
  },

  Source: {
    type: String
  },

  Actual: {
    type: String
  },

  Previous: {
    type: String
  },

  Forecast: {
    type: String
  },

  Importance: {
    type: Number
  }
});

module.exports = {
  Event: Event
}