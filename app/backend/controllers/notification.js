  /*
    Get method for list all notification history of such user.
  */
module.exports.getNotifications = async (request, response) => {
  let Notification = request.models['Notification']
  
  notifications = await Notification.find({userId: request.session['user']._id}).sort({date: -1})

  return response.send({notifications})
}