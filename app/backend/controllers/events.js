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
  const limit = parseInt(request.query.limit || 10)
  const skip = (parseInt(request.query.page || 1) - 1) * limit
  // undefined variables are the projections over the collection
  try {
    if(Country && Importance){
      events = await Event.find({ Country, Importance }, undefined, {skip, limit})
    } else if(Country && !Importance){
      events = await Event.find({ Country }, undefined, {skip, limit})
    } else if(!Country && Importance){
      events = await Event.find({ Importance }, undefined, {skip, limit})
    } else {
      events = await Event.find({ }, undefined, {skip, limit})
    }
    const totalNumberOfEvents = await Event.countDocuments({})
    return response.send({
      totalNumberOfEvents,
      totalNumberOfPages: Math.ceil(totalNumberOfEvents / limit),
      eventsInPage: events.length,
      events
    }); 
  } catch(e) {
    console.log(e)
  }
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
