const {findUserArticle} = require('../utils')

/*
  Post method for articles.
  It saves article to database.
*/
module.exports.postArticle = async (request, response) => {
    let Article = request.models['Article']
  
    // Article instance to add to the database
    let article = new Article({
      ...request.body,
      userId: request.session['user']._id,
      date: new Date()
    });
  
    // Saves the instance into the database, returns any error occured
    article.save()
      .then(doc => {
      return response.status(204).send();
    }).catch(error => {
      return response.status(400).send(error);
    });
  }
  
  /*
    Get method for articles.
    It returns given article.
  */
  module.exports.getArticle = async (request, response) => {

    let article = await await findUserArticle({ _id : request.params['id']})
  
    if(article){
      return response.send(article)
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
  const articleId = request.body['articleId'];

  article = await Article.findOne({ _id : articleId});
  if(article){
    try{
      if(!title && !text){ // no change
        return response.status(400).send({
          errmsg: "No change."
        })
      } else if(!title && text){ // just text edited
        await Article.updateOne({_id:articleId, userId: userId},{ text: text}) 
        .then( doc => {
          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
      } else if(!text && title){ // just title edited
        await Article.updateOne({_id:articleId, userId: userId},{ title: title}) 
        .then( doc => {
          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
      } else if(text && title){ // text and title are both edited
        await Article.updateOne({_id:articleId, userId: userId},{ title: title, text: text}) 
        .then( doc => {
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
  
  /*
    Delete method for articles.
    It deletes given article.
  */
  module.exports.deleteArticle = async (request, response) => {
    let Article = request.models['Article']
  
    Article.deleteOne({ _id : request.params['id'], userId : request.session['user']._id }, (err, results) => {
      if(err){
        return response.status(404).send({
          errmsg: "Failed."
        })
      }
  
      return response.status(404).send();
    });
  }

  
/*
  Post method for rating an article
*/
module.exports.rateArticle = async (request, response) => {
  let ArticleUser = request.models['ArticleUser']
  const userId = request.session['user']._id
  const value = request.body["value"];
  const articleId = request.body['articleId'];
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
  
        await rate.save()
        .then(async doc => {
           // now calculate the new average rate of the article update the database
          let newNumberOfRates = article.numberOfRates+1;
          let newRateAverage = (article.rateAverage*article.numberOfRates+value)/newNumberOfRates;
          await Article.updateOne({_id:articleId},{ rateAverage: newRateAverage, numberOfRates: newNumberOfRates}) 
          .then( doc => {
            return response.status(204).send();
          }).catch(error => {
            return response.status(400).send(error);
          });
          return response.status(204).send();
        }).catch(error => {
          return response.status(400).send(error);
        });
  
      } else{
        // User already rated for that article. Change the rate value and update the database
        await ArticleUser.updateOne({_id:row._id},{ rate: value}) 
        .then(async doc => {
          let newRateAverage = (article.rateAverage*article.numberOfRates-row.rate+value)/article.numberOfRates;
          await Article.updateOne({_id:articleId},{ rateAverage: newRateAverage}) 
          .then(doc => {
            return response.status(204).send();
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
  