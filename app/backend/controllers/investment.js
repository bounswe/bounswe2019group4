const { checkIBAN } = require('../utils')

  /*
    Get method for list all investment history of such user.
  */
module.exports.getHistory = async (request, response) => {
  let InvestmentHistory = request.models['InvestmentHistory']
  let UserAccount = request.models['UserAccount']
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']

  // It contains main page of investments.
  // It finds user's investment history, current exchange rates, and user's account.
  histories = await InvestmentHistory.find({userId: request.session['user']._id}).sort({date: -1})
  currentRates = await CurrentTradingEquipment.find({})
  account = await UserAccount.findOne({userId: request.session['user']._id})

  // If user has no account yet, it returns empty account.
  if(!account){
    account = new UserAccount({
      userId: request.session['user']._id
    })
  }

  return response.send({
    histories,
    currentRates,
    account
  })
}

  /*
    Post method for deposit money into account.
    It adds money to your account.
  */
module.exports.depositMoney = async (request, response) => {
  let UserAccount = request.models['UserAccount']
  let InvestmentHistory = request.models['InvestmentHistory']

  // If IBAN is not valid, it rejects.
  if(!checkIBAN(request.body.iban)){
    return response.status(400).send({ errmsg: 'Enter valid IBAN.' })
  }

  let currency = request.body.currency.toUpperCase()

  // Find user account.
  row = await UserAccount.findOne({userId : request.session['user']._id})
  // If user has no account yet, create new.
  if(!row){
    let account = new UserAccount({
      userId: request.session['user']._id,
      [currency]: request.body.amount
    });

    account.save()
      .then(doc => {
        // Add this action to investment history.
        let history = new InvestmentHistory({
          userId: request.session['user']._id,
          text: request.body.amount + " " + currency+ " deposited to account.",
          date: new Date()
        })

        history.save().then(doc => {

        }).catch(error => {
          console.log(error)
        })

      return response.status(200).send(doc);
    }).catch(error => {
      return response.status(400).send(error);
    });
  } else{
    // If user has already an account.
    currentAmount = row[currency]
    newAmount = currentAmount + request.body.amount
    // It updated related currency's value.
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: newAmount}).then(async doc => {

      // Add this action to investment history.
      let history = new InvestmentHistory({
          userId: request.session['user']._id,
          text: request.body.amount + " " + currency+ " deposited to account.",
          date: new Date()
        })

        history.save().then(doc => {

        }).catch(error => {
          console.log(error)
        })        
      account = await UserAccount.findOne({userId : request.session['user']._id})
      return response.status(200).send(account)
    }).catch(error => {
      return response.status(400).send(error);
    })
  }
}


  /*
    Post method for buy currency.
    It buys that currency and adds into your account.
  */
module.exports.buy = async (request, response) => {
  let UserAccount = request.models['UserAccount']
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']
  let InvestmentHistory = request.models['InvestmentHistory']

  let currency = request.body.currency.toUpperCase()

  if(currency == "EUR"){
    return response.status(400).send({
      errmsg: "User can not buy EUR."
    })
  }

  // Find user's account.
  row = await UserAccount.findOne({userId : request.session['user']._id})
  // If user has no account yet, it rejects. User must have account in order to buy a currency
  if(!row){
    return response.status(400).send({
      errmsg: "User has no account yet!"
    });
  } else{
    // It makes some calculations, finds the amount of decreasing in EUR using exchange rates.
    let EUR_AMOUNT = row['EUR']
    let TEQ_AMOUNT = row[currency]

    let currentTeq = await CurrentTradingEquipment.findOne({from: currency, to: 'EUR'})
    let EXCHANGE_RATE = currentTeq.rate
    let DECREASE_EUR = EXCHANGE_RATE * request.body.amount

    let FINAL_EUR = EUR_AMOUNT - DECREASE_EUR
    let FINAL_TEQ = TEQ_AMOUNT + request.body.amount

    // If user has no enought monet, it rejects
    if(FINAL_EUR < 0){
      return response.status(400).send({
        errmsg: "Not enough money in EUR."
      })
    }
    
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: FINAL_TEQ, 'EUR': FINAL_EUR}).then(async doc => {
      
      // It adds this action to history.
      let history = new InvestmentHistory({
        userId: request.session['user']._id,
        text: request.body.amount + " " + currency+ " bougth.",
        date: new Date()
      })

      history.save().then(doc => {

      }).catch(error => {
        console.log(error)
      })

      account = await UserAccount.findOne({userId : request.session['user']._id})
      return response.status(200).send(account)
    }).catch(error => {
      return response.status(400).send(error);
    })
  }
}

  /*
    Post method for sell currency.
    It sell that currency and deletes from your account.
  */
module.exports.sell = async (request, response) => {
  let UserAccount = request.models['UserAccount']
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']
  let InvestmentHistory = request.models['InvestmentHistory']

  let currency = request.body.currency.toUpperCase()

  if(currency == "EUR"){
    return response.status(400).send({
      errmsg: "User can not sell EUR."
    })
  }

  // Find user's account.
  row = await UserAccount.findOne({userId : request.session['user']._id})
  // If user has no account yet, it rejects. User must have account in order to buy a currency
  if(!row){
    return response.status(400).send({
      errmsg: "User has no account yet!"
    });
  } else{
    // It makes some calculations, finds the amount of increasing in EUR using exchange rates.
    let EUR_AMOUNT = row['EUR']
    let TEQ_AMOUNT = row[currency]

    // If user has no enough money, it rejects
    if(request.body.amount > TEQ_AMOUNT){
      return response.status(400).send({
        errmsg: "Not enough money in " + currency
      })
    }

    let currentTeq = await CurrentTradingEquipment.findOne({from: currency, to: 'EUR'})
    let EXCHANGE_RATE = currentTeq.rate
    let INCREASE_EUR = EXCHANGE_RATE * request.body.amount

    let FINAL_EUR = EUR_AMOUNT + INCREASE_EUR
    let FINAL_TEQ = TEQ_AMOUNT - request.body.amount

    
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: FINAL_TEQ, 'EUR': FINAL_EUR}).then(async doc => {
      
      // It adds this action to history.
      let history = new InvestmentHistory({
        userId: request.session['user']._id,
        text: request.body.amount + " " + currency+ " sold.",
        date: new Date()
      })

      history.save().then(doc => {

      }).catch(error => {
        console.log(error)
      })

      account = await UserAccount.findOne({userId : request.session['user']._id})
      return response.status(200).send(account)
    }).catch(error => {
      return response.status(400).send(error);
    })
  }
}

  /*
    Get method for list all investment history of such user.
  */
module.exports.getOrders = async (request, response) => {
  let OrderInvestment = request.models['OrderInvestment']

  const limit = parseInt(request.query.limit || 10)
  const skip = (parseInt(request.query.page || 1) - 1) * limit

  orders = await OrderInvestment.find({userId: request.session['user']._id})
  return response.send({orders})
}

  /*
    Post method for creating an order investment.
  */
module.exports.createOrder = async (request, response) => {
  let OrderInvestment = request.models['OrderInvestment']
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']

  let currency = request.body.currency.toUpperCase()

  if(currency == "EUR"){
    return response.status(400).send({
      errmsg: "User can not order for EUR."
    })
  }

  let type = request.body.type.toUpperCase()
  let compare = request.body.compare.toUpperCase()

  if(type != "BUY" && type != "SELL"){
    return response.status(400).send({
      errmsg: "Type of order must either BUY or SELL"
    })
  }

  if(compare != "HIGHER" && compare != "LOWER"){
    return response.status(400).send({
      errmsg: "Compare of order must either HIGHER or LOWER"
    })
  }

  let currentTeq = await CurrentTradingEquipment.findOne({from: currency, to: 'EUR'})

  if(parseFloat(currentTeq.rate) > request.body.rate && compare == "HIGHER"){
    return response.status(400).send({
      errmsg: "Exchange rate is already higher than given rate."
    })
  }

  if(parseFloat(currentTeq.rate) < request.body.rate && compare == "LOWER"){
    return response.status(400).send({
      errmsg: "Exchange rate is already lower than given rate."
    })
  }

  let order = new OrderInvestment({
    ...request.body,
    userId: request.session['user']._id,
    type: type,
    compare: compare,
    currency: currency
  })

  order.save().then(doc => {
    return response.status(204).send()
  }).catch(error => {
    return response.status(400).send()
  })
}

  /*
    Delete method for deleting an order investment.
  */
module.exports.deleteOrder = async (request, response) => {
  let OrderInvestment = request.models['OrderInvestment']

  OrderInvestment.deleteOne({_id: request.params['id'], userId: request.session['user']._id}, (err, results) => {
    if(err){
      return response.status(404).send({
        errmsg: "Failed."
      })
    }

    return response.send(204);
  })
}
