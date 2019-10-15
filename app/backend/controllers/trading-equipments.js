/*
  Post method for following specific trading equipment.
*/
module.exports.followTradingEq = async (request, response) => {
  let TradingEqFollow = request.models['TradingEquipmentFollow']

  const UserId = request.body.userId
  const TradingEq = request.query.tEq

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

  const UserId = request.body.userId
  const TradingEq = request.query.tEq

  TradingEqFollow.deleteOne({ UserId, TradingEq }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.send(204);
  });
}
