const {mongoose} =  require('../db');  // The mongodb connector library

/*
  Model in order to keep user's order investments.
  User can set order for specific value of trading equipments.
*/
let OrderInvestment = mongoose.model('OrderInvestment', {

  userId: {
    type: String,
    require: true
  },

  type: {
    type: String,
    require: true
  },

  currency:{
    type: String,
    require: true
  },

  amount: {
    type: Number,
    require: true
  },

  rate: {
    type: Number,
    require: true
  },

  compare: {
    type: String,
    require: true
  }
});

module.exports = {
  OrderInvestment: OrderInvestment
}