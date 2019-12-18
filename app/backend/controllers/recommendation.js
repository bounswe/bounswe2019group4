/*
    Get endpoint for recommendations. It recommends new users and articles to logged in user.
*/
module.exports.recommend = async (request, response) => {
  let User = request.models['User']
  let Article = request.models['Article']
  let UserFollow = request.models['UserFollow']
  let ArticleUser = request.models['ArticleUser']

  let userId = request.session['user']._id
  let userRecommends = []
  let recommendedUserIds = []
  
  let myFollowers = await UserFollow.find({FollowedId: userId})
  for( i = 0; i < myFollowers.length; i++){
    follow = myFollowers[i]
    followStatus = await UserFollow.findOne({FollowingId: userId, FollowedId: follow.FollowingId, status: true})
    if(!followStatus){
        userInfo = await User.findOne().select('name surname location predictionRate').where('_id').equals(follow.FollowingId)
        if((userInfo.predictionRate != "0/0" && eval(userInfo.predictionRate) > 0.4) ||
            (userInfo.location.toLowerCase().includes(request.session['user'].location.toLowerCase())) || 
            (request.session['user'].location.toLowerCase().includes(userInfo.location.toLowerCase()))){
                userRecommends.push(userInfo)
                  recommendedUserIds.push(userInfo._id.toString())
        }
    }
  }

  let predictionCut = 0.8
  let counter = 0
  while(userRecommends.length < 6 && counter < 5){
    counter++
    users = await User.find().select('name surname location predictionRate')
    for(i = 0; i < users.length; i++){
        user = users[i]
        if(!recommendedUserIds.includes(user._id.toString()) && user._id != request.session['user']._id){
            followStatus = await UserFollow.findOne({FollowingId: userId, FollowedId: user._id, status: true})
            if(!followStatus){
                if((user.predictionRate != "0/0" && eval(user.predictionRate) > predictionCut)){
                    userRecommends.push(user)
                    recommendedUserIds.push(user._id.toString())
                }
            }
        }
    }
    predictionCut -= 0.1
  }

  userRecommends = Array.from(new Set(userRecommends)).sort((a, b) => eval(b.predictionRate) - eval(a.predictionRate))

  let articleRecommends = []
  let recommendedArticleIds = []
  let myFollowings = await UserFollow.find({FollowingId: userId, status: true})
  for( i = 0; i < myFollowings.length; i++){
    follow = myFollowings[i]
    userArticles = await Article.find({userId : follow.FollowedId})
    for(j = 0; j < userArticles.length; j++){
        article = userArticles[j]
        rateStatus = await ArticleUser.findOne({userId : userId, articleId: article._id})
        if(!rateStatus && article.rateAverage > 2){
            recommendedArticleIds.push(article._id.toString())
            let articleOwner = await User.findOne({_id: article.userId})
            articleRecommends.push({
                ...article._doc,
                rateAverage: Math.round(article.rateAverage * 10) / 10,
                username: articleOwner.name,
                usersurname: articleOwner.surname
            })
        }
    }
  }

  let rateCut = 4
  let count = 0
  while(articleRecommends.length < 6 && count < 5){
    count++
    articles = await Article.find({})
    for(i = 0; i < articles.length; i++){
        article = articles[i]
        rateStatus = await ArticleUser.findOne({userId : userId, articleId: article._id})
        if(article.userId != userId && !rateStatus && article.rateAverage >= rateCut && !recommendedArticleIds.includes(article._id.toString())){
            recommendedArticleIds.push(article._id.toString())
            let articleOwner = await User.findOne({_id: article.userId})
            articleRecommends.push({
                ...article._doc,
                rateAverage: Math.round(article.rateAverage * 10) / 10,
                username: articleOwner.name,
                usersurname: articleOwner.surname
            })
        }
    }
    rateCut -= 0.5
  }

  response.send({userRecommends, articleRecommends})
}