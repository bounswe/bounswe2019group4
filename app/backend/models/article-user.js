const {mongoose} =  require('../db');  // The mongodb connector library

let ArticleUser = mongoose.model('ArticleUser', {
  _id: {
    userId:String, 
    articleId:String
  },

  userId: {
    type: String,
    require: true
  },

  articleId: {
    type: String,
    require: true
  },

  rate: {
    type: Number,
    default: 0,
  }
});

module.exports = {
  ArticleUser: ArticleUser
}