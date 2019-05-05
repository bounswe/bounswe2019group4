const request = require('request');
const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";

// Retrieves some important events that happened recently
module.exports.list = (req, res) => {
    request(url, (error, response, body) => {
        // If there is an error
        if(error){
            res.status(400).send({
                message: error,
            });
        }

        // If there is no error, returns event lists 
        else{
            const events = JSON.parse(body);
  
            var eventList = [];

            events.forEach((event) => {
                var obj = {
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
    })
}