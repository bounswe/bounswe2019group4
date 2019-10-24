/*
  Post method for comments.
  It saves comment to database.
*/
module.exports.postComment = async (request, response) => {
  let EventsComment = request.models['EventsComment']
  let TradingEquipmentsComment = request.models['TradingEquipmentsComment']

  let obj = {
    ...request.body,
    userId: request.session['user']._id,
    date: new Date()
  }

  // Comment instance to add to the database
  if(request.body.type == 'EVENT'){
    comment = new EventsComment({
      ...obj
    });
  } else if(request.body.type == 'TRADING-EQUIPMENT') {
    comment = new TradingEquipmentsComment({
      ...obj
    });
  } else{
    return response.status(400).send({
      errmsg: "No such type!"
    })
  }
  
  // Saves the instance into the database, returns any error occured
  comment.save()
    .then(doc => {
    return response.status(204).send();
  }).catch(error => {
    return response.status(400).send(error);
  });
}

/*
  Get method for comments.
  It returns given comment.
*/
module.exports.getComment = async (request, response) => {
  let EventsComment = request.models['EventsComment']
  let TradingEquipmentsComment = request.models['TradingEquipmentsComment']

  comment = await EventsComment.findOne({ _id : request.params['id']}) || await TradingEquipmentsComment.findOne({ _id : request.params['id']});

  if(comment){
    return response.send(comment)
  } else {
    return response.status(400).send({
      errmsg: "No such comment."
    })
  }
}

/*
  Delete method for comments.
  It deletes given comment.
*/
module.exports.deleteComment = async (request, response) => {
  let EventsComment = request.models['EventsComment']
  let TradingEquipmentsComment = request.models['TradingEquipmentsComment']

  if(request.body.type == 'EVENT'){
    EventsComment.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
        if(err){
          return response.status(404).send({
            errmsg: "Failed."
          })
        }

        return response.send(204);
      });
  } else if(request.body.type == 'TRADING-EQUIPMENT'){
    TradingEquipmentsComment.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
      if(err){
        return response.status(404).send({
          errmsg: "Failed."
        })
      }

      return response.send(204);
    });
  }
}
