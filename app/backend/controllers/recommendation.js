/*
    Get endpoint for recommendations. It recommends new users and articles to logged in user.
*/
module.exports.recommend = async (request, response) => {
  let User = request.models['User']
  let Article = request.models['Article']

  response.status(204).send()
}