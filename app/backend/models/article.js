const {mongoose} =  require('../db');  // The mongodb connector library

let Article = mongoose.model('Article', {

  userId: {
    type: String,
    require: true
  },

  text: {
    type: String,
    require: true
  },

  title:{
      type: String,
      require: true
  },

  date:{
    type: Date,
    require: true
  },

  rateAverage:{
    type: Number,
    default: 0
  },

  numberOfRates:{
    type: Number,
    default: 0
  }
});

module.exports = {
  Article: Article
}