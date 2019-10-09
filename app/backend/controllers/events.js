const request = require('request');
const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";

/*
  Get method for events.
  Using 3rd party API, it saves events to database.
*/
module.exports.getEvents = async (req, res) => {
  let Event = req.models['Event']

  request(url, (error, response, body) => {
    // If there is an error
    if(error){
      res.status(400).send({
        errmsg: error,
      });
    }

    // If there is no error, returns event lists 
    else{
      const events = JSON.parse(body);
            
      events.forEach((ev) => {
        let event = new Event({
          ...ev
        });

        event.save();
      });
    }

    res.status(204).send();
  })
}

/*
  Get method for specific event.
*/
module.exports.getEvent = (request, response) => {
  let Event = request.models['Event']
  const CalendarId = request.params['id']
  
  Event.findOne({ CalendarId })     // Retrieve the event instance from database
    .then(event => {            // when the user's data is public 
      response.send(event)  // Send only the extracted keys
    })
    .catch(error => {   // when it's the case an error occurs accessing the database
      response.status(404).send({
      errmsg: "No such event."
    })
  })
}
