/*
  Post method for comments.
  It saves comment to database.
*/
module.exports.postComment = async (request, response) => {
  let Comment = request.models['Comment']

  if(!request.body.related || !request.body.text){
    return response.status(400).send({
      errmsg: "Related field or text is missing in body!"
    })
  }

    // Comment instance to add to the database
  let comment = new Comment({
    ...request.body,
    userId: request.session['user']._id,
    date: new Date()
  });

  // Saves the instance into the database, returns any error occured
  comment.save()
    .then(doc => {
    return response.status(204).send();
  }).catch(error => {
    return response.status(400).send(error);
  });
}
