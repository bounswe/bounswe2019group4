const {mongoose} =  require('../db');  // The mongodb connector library

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