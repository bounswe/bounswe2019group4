module.exports.isAuthenticated = (req, res, next) => {
  // checks wheter user is logged in or not. if not returns 401.
  if(!req.session['user']) {
    return res.status(401).send();
  }

  next()
}