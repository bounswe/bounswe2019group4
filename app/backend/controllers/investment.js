const { checkIBAN } = require('../utils')

  /*
    Post method for deposit money into account.
    It adds money to your account.
  */
module.exports.depositMoney = async (request, response) => {
  let UserAccount = request.models['UserAccount']
  let InvestmentHistory = request.models['InvestmentHistory']

  if(!checkIBAN(request.body.iban)){
    return response.status(400).send({ errmsg: 'Enter valid IBAN.' })
  }

  let currency = request.body.currency.toUpperCase()

  row = await UserAccount.findOne({userId : request.session['user']._id})
  if(!row){
    let account = new UserAccount({
      userId: request.session['user']._id,
      [currency]: request.body.amount
    });

    account.save()
      .then(doc => {
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
    currentAmount = row[currency]
    newAmount = currentAmount + request.body.amount
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: newAmount}).then(async doc => {

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

  row = await UserAccount.findOne({userId : request.session['user']._id})
  if(!row){
    return response.status(400).send({
      errmsg: "User has no account yet!"
    });
  } else{
    let EUR_AMOUNT = row['EUR']
    let TEQ_AMOUNT = row[currency]

    let currentTeq = await CurrentTradingEquipment.findOne({from: currency, to: 'EUR'})
    let EXCHANGE_RATE = currentTeq.rate
    let DECREASE_EUR = EXCHANGE_RATE * request.body.amount

    let FINAL_EUR = EUR_AMOUNT - DECREASE_EUR
    let FINAL_TEQ = TEQ_AMOUNT + request.body.amount

    if(FINAL_EUR < 0){
      return response.status(400).send({
        errmsg: "Not enough money in EUR."
      })
    }
    
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: FINAL_TEQ, 'EUR': FINAL_EUR}).then(async doc => {
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
    Post method for buy currency.
    It buys that currency and adds into your account.
  */
module.exports.sell = async (request, response) => {
  let UserAccount = request.models['UserAccount']
  let CurrentTradingEquipment = request.models['CurrentTradingEquipment']
  let InvestmentHistory = request.models['InvestmentHistory']

  let currency = request.body.currency.toUpperCase()

  row = await UserAccount.findOne({userId : request.session['user']._id})
  if(!row){
    return response.status(400).send({
      errmsg: "User has no account yet!"
    });
  } else{
    let EUR_AMOUNT = row['EUR']
    let TEQ_AMOUNT = row[currency]

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
