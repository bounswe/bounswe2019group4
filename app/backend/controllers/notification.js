  /*
    Get method for list all notification history of such user.
  */
module.exports.getNotifications = async (request, response) => {
  let Notification = request.models['Notification']
  
  notifications = await Notification.find({userId: request.session['user']._id}).sort({date: -1})

  return response.send({notifications})
}

  /*
    Post method for make all notifications seen of such user.
  */
module.exports.postNotifications = async (request, response) => {
  let Notification = request.models['Notification']
  
  notifications = await Notification.find({userId: request.session['user']._id, seen: false})
    
  for(i =0; i< notifications.length;i++){
    notification = notifications[i]
    notification.seen = true
    await notification.save()
  }

  return response.status(204).send()
}