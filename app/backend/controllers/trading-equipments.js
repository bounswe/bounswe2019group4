/*
  Get method for information of specific trading equipment.
*/
module.exports.getTradingEquipment = async (request, response) => {
  let TradingEquipment = request.models['TradingEquipment']
  let TradingEqFollow = request.models['TradingEquipmentFollow']
  let TradingEq = request.params['code'].toUpperCase()
  let following = false

  // If user is logged in, control whether user follows that equipment or not.
  if(request.session['user']){
    UserId = request.session['user']._id
    result = await TradingEqFollow.findOne({UserId , TradingEq})

    if(result){
      following = true
    }
  }

  // Returns all values of given currency
  values = await TradingEquipment.find({ code: TradingEq }).sort({ Date: -1})

  if(values.length == 0){
    return response.status(400).send({
      errmsg: "No such currency."
    })
  }

  return response.send({
    following,
    values
  }); 
}

/*
  Get method for information of specific trading equipment.
*/
module.exports.getCurrentValues = async (request, response) => {
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']

  // Returns current values of all currency
  currencies = await CurrentTradingEquipment.find()

  return response.send({
    currencies
  }); 
}

/*
  Post method for following specific trading equipment.
*/
module.exports.followTradingEq = async (request, response) => {
  let TradingEqFollow = request.models['TradingEquipmentFollow']

  const UserId = request.session['user']._id
  const TradingEq = request.query.tEq.toUpperCase()

  try{
    row = await TradingEqFollow.findOne({ UserId, TradingEq })

    if (!row) {  // If no instance is returned, credentials are invalid
      let follow = new TradingEqFollow({
        UserId: UserId,
        TradingEq: TradingEq,
      });

    follow.save()
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });

    } else{
      throw Error('Already followed that currency.') // Send only the extracted keys
    }
  } catch(error){
    return response.status(404).send({
      errmsg: error.message
    })
  }
}

/*
  Post method for unfollowing specific trading equipment.
*/
module.exports.unfollowTradingEq = async (request, response) => {
  let TradingEqFollow = request.models['TradingEquipmentFollow']

  const UserId = request.session['user']._id
  const TradingEq = request.query.tEq.toUpperCase()
  
  TradingEqFollow.deleteOne({ UserId, TradingEq }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.send(204);
  });
}
