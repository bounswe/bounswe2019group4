module.exports.jsonld = (req, res, next) => {
  if (
    req.headers["content-type"] !=
    `application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"`
  ) {
    res.sendStatus(400);
  } else {
    next();
  }
};
