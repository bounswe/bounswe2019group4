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

  return response.send({
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
      return response.send(event)  // Send only the extracted keys
    }
  } catch(error){
    return response.status(404).send({
      errmsg: error.message
    })
  }
}
