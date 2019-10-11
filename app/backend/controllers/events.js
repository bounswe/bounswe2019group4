const request = require('request');
const url = "https://api.tradingeconomics.com/calendar/country/all?c=guest:guest";

/*
  Get method for events.
  Using 3rd party API, it saves events to database.
*/
module.exports.getEventsFromAPI = async (req, res) => {
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

        event.save().then(doc => {
          console.log(doc);
        }).catch(err => {
          console.log(err);
        });
      });
    }

    res.status(204).send();
  })
}

/*
  Get method for events.
  It returns events from database.
*/
module.exports.getEvents = async (request, response) => {
  let Event = request.models['Event']

  /*
    Country and importance is used for filtering.
    Events can be filtered by country and importance
    TODO: FILTER BY DATE MUST BE ADDED!
  */
  let Country = request.query.country
  let Importance = request.query.importance

  if(Country && Importance){
    events = await Event.find({ Country, Importance })
  } else if(Country && !Importance){
    events = await Event.find({ Country })
  } else if(!Country && Importance){
    events = await Event.find({ Importance })
  } else {
    events = await Event.find({ })
  }

  response.send({
    totalNumberOfEvents: events.length,
    events
  }); 
}

/*
  Get method for specific event.
*/
module.exports.getEvent = async (request, response) => {
  let Event = request.models['Event']
  const CalendarId = request.params['id']
  
  try{
    event = await Event.findOne({ CalendarId })

    if (!event) {  // If no instance is returned, credentials are invalid
      throw Error('No such event!')
    } else{
      response.send(event)  // Send only the extracted keys
    }
  } catch(error){
    response.status(404).send({
      errmsg: error.message
    })
  }
}
