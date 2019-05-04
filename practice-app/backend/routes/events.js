const express = require('express');
var request = require('request');
const router = express.Router();
const url = "https://api.tradingeconomics.com/calendar/country/All/2016-12-02/2016-12-03?c=guest:guest";

// Retrieves some important events that happened recently
router.get("/list", (req, res) => {
  request(url, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      const events = JSON.parse(body);

      var eventList = [];

      events.forEach((event) => {
        var obj = {
          id: event.CalendarId,
          date: event.Date,
          country: event.Country,
          eventName: event.Event,
          signifanceLevel: event.Importance,
          actual: event.Actual,
          previous: event.Previous,
          forecast: event.Forecast
        };
        eventList.push(obj);
      });
      res.send(eventList);
    }
  });
});

module.exports = router;
