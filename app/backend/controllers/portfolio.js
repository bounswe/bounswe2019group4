/*
  Post method for portfolio.
  It saves portfolio to database.
*/
module.exports.postPortfolio = async (request, response) => {
  let Portfolio = request.models['Portfolio']
  let PortfolioTradingEq = request.models['PortfolioTradingEq']

  let title = request.body['title']
  let definition = request.body['definition']
  let tradingEqs = request.body['tradingEqs']
  let isPrivate = request.body['isPrivate']

  // Portfolio instance to add to the database
  let portfolio = new Portfolio({
    title,
    definition,
    isPrivate,
    userId: request.session['user']._id,
    date: new Date()
  });

  // Saves the instance into the database, returns any error occured
  portfolio.save()
    .then(doc => {
      for (const tradingEq of tradingEqs) {
          // portfolioTradingEq instance to add to the database
          let portfolioTradingEq = new PortfolioTradingEq({
              _id: {
                  PortfolioId: doc._id,
                  TradingEq: tradingEq
              },
              PortfolioId: doc._id,
              TradingEq: tradingEq
          });

          // Saves the instance into the database, returns any error occured
          portfolioTradingEq.save()
      }
      return response.status(200).send(doc);
  }).catch(error => {
    return response.status(400).send(error);
  });
}
  
/*
  Get method for portfolios.
  It returns given portfolio.
*/
module.exports.getPortfolio = async (request, response) => {
  let PortfolioTradingEq = request.models['PortfolioTradingEq']
  let Portfolio = request.models['Portfolio']
  let PortfolioFollow = request.models['PortfolioFollow']

  try {
    let portfolio = await Portfolio.findOne({ _id : request.params['id']})
    
    if(portfolio){
      let tradingEqsObj = await PortfolioTradingEq.find({ PortfolioId : request.params['id']})
      let tradingEqs = []
      for (const tradingEq of tradingEqsObj) {
        tradingEqs.push(tradingEq['TradingEq']);
      }
  
      let followStatus = "FALSE"
  
      if(request.session['user']){
        let row = await PortfolioFollow.findOne({UserId: request.session['user']._id, PortfolioId: request.params['id']})
        if(row)
          followStatus = "TRUE"
      }
  
      obj = {
        portfolio: portfolio,
        tradingEqs: tradingEqs,
        followStatus
      }
      return response.send(obj)
    } else {
      return response.status(400).send({
        errmsg: "No such portfolio."
      })
    }
  } catch (error) {
      return response.status(400).send({
        errmsg: "No such portfolio."
      })
  }
}

/*
  Patch method for editing portfolios.
*/
module.exports.editPortfolio = async (request, response) => {
  let Portfolio = request.models['Portfolio']
  let PortfolioTradingEq = request.models['PortfolioTradingEq']
  const userId = request.session['user']._id
  const title = request.body["title"];
  const definition = request.body["definition"];
  const isPrivate = request.body["isPrivate"];
  const PortfolioId = request.params['id'];
  let tradingEqs = request.body['tradingEqs']

  portfolio = await Portfolio.findOne({ _id : PortfolioId, userId: userId});
  if(portfolio){
    Portfolio.updateOne({_id:PortfolioId, userId: userId},{ title: title, definition: definition, isPrivate: isPrivate}) 
      .then( doc => {
        // first delete every trading Eqs of this portfolio from db
        PortfolioTradingEq.deleteMany({ PortfolioId : request.params['id']}, (err, results) => {
          if(err){
            return response.status(404).send({
              errmsg: "Failed to delete portfolio - trading eq. instances."
            })
          }
        });

        // then add the updated arary
        for (const tradingEq of tradingEqs) {
          // portfolioTradingEq instance to add to the database
          let portfolioTradingEq = new PortfolioTradingEq({
              _id: {
                  PortfolioId: PortfolioId,
                  TradingEq: tradingEq
              },
              PortfolioId: PortfolioId,
              TradingEq: tradingEq
          });

          // Saves the instance into the database, returns any error occured
          portfolioTradingEq.save()
        }
        return response.status(204).send()
      }).catch(error => {
        return response.status(400).send(error);
      });
  } else {
    return response.status(400).send({
      errmsg: "No such portfolio."
    })
  }
}
  
  /*
    Delete method for portfolios.
    It deletes given portfolio and portfolio - trading eq. instances.
  */
  module.exports.deletePortfolio = async (request, response) => {
    let Portfolio = request.models['Portfolio']
    let PortfolioTradingEq = request.models['PortfolioTradingEq']
  
    Portfolio.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
      if(err){
        return response.status(404).send({
          errmsg: "Failed to delete portfolio."
        })
      }

      PortfolioTradingEq.deleteMany({ PortfolioId : request.params['id']}, (err, results) => {
        if(err){
          return response.status(404).send({
            errmsg: "Failed to delete portfolio - trading eq. instances."
          })
        }       
        return response.status(204).send(); 
      });
    });
  }

/*
  Post method for following specific portfolio.
*/
module.exports.followPortfolio = async (request, response) => {
  let PortfolioFollow = request.models['PortfolioFollow']

  const UserId = request.session['user']._id
  const PortfolioId = request.params['id']

  try{
    row = await PortfolioFollow.findOne({ UserId, PortfolioId })

    if (!row) {  // If no instance is returned, credentials are invalid
      let follow = new PortfolioFollow({
        UserId: UserId,
        PortfolioId: PortfolioId,
      });

    follow.save()
      .then(doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });

    } else{
      throw Error('Already followed that portfolio.') // Send only the extracted keys
    }
  } catch(error){
    return response.status(404).send({
      errmsg: error.message
    })
  }
}

/*
  Post method for unfollowing specific portfolio.
*/
module.exports.unfollowPortfolio = async (request, response) => {
  let PortfolioFollow = request.models['PortfolioFollow']

  const UserId = request.session['user']._id
  const PortfolioId = request.params['id'];
  
  PortfolioFollow.deleteOne({ UserId, PortfolioId }, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.sendStatus(204);
  });
}

