module.exports.isAuthenticated = (req, res, next) => {
  // checks wheter user is logged in or not. if not returns 401.
  if(!req.session['user']) {
    return res.status(401).send();
  }

  next()
}

module.exports.isTrader = (req, res, next) => {
  // checks wheter user is trader or not. if not returns 403.
  if(!req.session['user'].isTrader) {
    return res.status(403).send();
  }

  next()
}