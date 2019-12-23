const {findUserArticle} = require('../utils')
const {findUserComments} = require('../utils')
const {User} = require('../models/user')
const axios = require('axios')
  /*
    Get method for articles.
    It returns all articles in database.
  */
module.exports.getArticles = async (request, response) => {
  let Article = request.models['Article']

  const limit = parseInt(request.query.limit || 10)
  const skip = (parseInt(request.query.page || 1) - 1) * limit

  try {
    rows = await Article.find({ }, undefined, {skip, limit}).sort({date: -1}).lean()

    articles = await Promise.all(rows.map(async el => {
    const user = await User.findOne({_id: el.userId})
    return {
      ...el,
      rateAverage: Math.round(el.rateAverage * 10) / 10,
      username: user.name,
      usersurname: user.surname
    }}))
    const totalNumberOfArticles = await Article.countDocuments({})
    return response.send({
      totalNumberOfArticles,
      totalNumberOfPages: Math.ceil(totalNumberOfArticles / limit),
      articlesInPage: rows.length,
      articles
    }); 
  } catch(e) {
    console.log(e)
  }
}

/*
  Post method for articles.
  It saves article to database.
*/
module.exports.postArticle = async (request, response) => {
    let Article = request.models['Article']
  
    // Article instance to add to the database
    let article = new Article({
      imageId: Math.floor(Math.random() * 10) + 1,
      ...request.body,
      userId: request.session['user']._id,
      date: new Date()
    });

    let queryKeyword = request.body.title.split(' ').join('+')
    let tags = await axios.get(`https://api.datamuse.com/words?max=20&ml=${queryKeyword}`)
    tags = tags.data.map(el => el.word)
    article.tags = tags

    queryKeyword = request.body.text.split(' ').join('+')
    tags = await axios.get(`https://api.datamuse.com/words?max=20&ml=${queryKeyword}`)
    tags = tags.data.map(el => el.word)
    article.tags.concat(tags)
    
    // Saves the instance into the database, returns any error occured
    article.save()
      .then(doc => {
      return response.status(200).send(doc);
    }).catch(error => {
      return response.status(400).send(error);
    });
  }
  
  /*
    Get method for articles.
    It returns given article.
  */
  module.exports.getArticle = async (request, response) => {
    let ArticleUser = request.models['ArticleUser']

    let articleId = request.params['id']
    let article = await findUserArticle({ _id : articleId})
  
    if(article){
      let yourRate = 0

      comments = await findUserComments({ related : articleId, about : "ARTICLE"})

      if(request.session['user']){
        let userId = request.session['user']._id
        row = await ArticleUser.findOne({userId, articleId})
        if(row){
          yourRate = row.rate
        }
      }
      return response.send({...article[0], yourRate, comments})
    } else {
      return response.status(400).send({
        errmsg: "No such article."
      })
    }
  }

/*
  Patch method for editing articles.
  It saves article to database.
*/
module.exports.editArticle = async (request, response) => {
  let Article = request.models['Article']
  const userId = request.session['user']._id
  const title = request.body["title"];
  const text = request.body["text"];
  const articleId = request.params['id'];

  article = await Article.findOne({ _id : articleId});
  if(article){
    Article.updateOne({_id:articleId, userId: userId},{ title: title, text: text}) 
      .then( doc => {
        return response.status(204).send();
      }).catch(error => {
        return response.status(400).send(error);
      });
  } else {
    return response.status(400).send({
      errmsg: "No such article."
    })
  }
}
  
  /*
    Delete method for articles.
    It deletes given article.
  */
  module.exports.deleteArticle = async (request, response) => {
    let Article = request.models['Article']
    let ArticleUser = request.models['ArticleUser']
  
    Article.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
      if(err){
        return response.status(404).send({
          errmsg: "Failed."
        })
      }

      ArticleUser.deleteMany({ articleId : request.params['id']}, (err, results) => {
        if(err){
          return response.status(404).send({
            errmsg: "Failed."
          })
        }
        return response.sendStatus(204);
      });
    });
  }

  
/*
  Post method for rating an article
*/
module.exports.rateArticle = async (request, response) => {
  let ArticleUser = request.models['ArticleUser']
  const userId = request.session['user']._id
  const value = request.body["value"];
  const articleId = request.params['id'];
  let Article = request.models['Article']

  if(value<1 || value>5){
    return response.status(400).send({
      errmsg: "value must be in the range 1, 5"
    })
  }
  
  article = await Article.findOne({ _id : articleId});
  if(article){
    try{
      row = await ArticleUser.findOne({userId, articleId})
      if (!row) {  
        // If no instance is returned, make a new rate
        let rate = new ArticleUser({
          _id: {userId: userId, articleId: articleId},
          userId: userId,
          articleId: articleId,
          rate: value
        });
  
        rate.save()
        .then(async doc => {
           // now calculate the new average rate of the article update the database
          let newNumberOfRates = article.numberOfRates+1;
          let newRateAverage = (article.rateAverage*article.numberOfRates+value)/newNumberOfRates;
          Article.updateOne({_id:articleId},{ rateAverage: newRateAverage, numberOfRates: newNumberOfRates}) 
          .then( doc => {
          }).catch(error => {
            return response.status(204).send();
          });
          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
  
      } else{
        // User already rated for that article. Change the rate value and update the database
        ArticleUser.updateOne({_id:row._id},{ rate: value}) 
        .then(doc => {
          let newRateAverage = (article.rateAverage*article.numberOfRates-row.rate+value)/article.numberOfRates;
          Article.updateOne({_id:articleId},{ rateAverage: newRateAverage}) 
          .then(doc => {
          }).catch(error => {
            return response.status(400).send(error);
          });

          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
      }
      
    } catch(error){
      return response.status(404).send({
        errmsg: error.message
      })
    }
  } else {
    return response.status(400).send({
      errmsg: "No such article."
    })
  }
  
}
  