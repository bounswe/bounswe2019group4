const {mongoose} =  require('../db');  // The mongodb connector library

let Event = mongoose.model('Event', {
  calendarId: {
    type: String
  },

  event: {
    type: String
  },

  date: {
    type: Date
  },

  source: {
    type: String
  },

  country: {
    type: String
  },

  importance: {
    type: Number
  },

  actual: {
    type: Number
  },

  previous: {
    type: Number
  },

  forecast: {
    type: Number
  },
});

module.exports = {
  Event: Event
}