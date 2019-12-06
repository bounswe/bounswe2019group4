const { checkIBAN } = require('../utils')

  /*
    Post method for deposit money into account.
    It returns all articles in database.
  */
module.exports.depositMoney = async (request, response) => {
  let UserAccount = request.models['UserAccount']

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
      return response.status(200).send(doc);
    }).catch(error => {
      return response.status(400).send(error);
    });
  } else{
    currentAmount = row[currency]
    newAmount = currentAmount + request.body.amount
    UserAccount.updateOne({userId: request.session['user']._id, [currency]: newAmount}).then(async doc => {
      account = await UserAccount.findOne({userId : request.session['user']._id})
      return response.status(200).send(account)
    }).catch(error => {
      return response.status(400).send(error);
    })
  }
}
