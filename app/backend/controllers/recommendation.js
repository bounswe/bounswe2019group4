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
                recommendedUserIds.push(userInfo._id)
        }
    }
  }

  response.send({userRecommends, articleRecommends})
}