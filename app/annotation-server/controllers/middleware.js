const contentType = `application/ld+json; profile="http://www.w3.org/ns/anno.jsonld"`;

module.exports.jsonld = async (req, res, next) => {
  const isCorrectContentType = /application\/ld\+json;\s*profile="http:\/\/www\.w3\.org\/ns\/anno\.jsonld"/.test(
    req.get("content-type")
  );

  res.set("content-type", contentType);
  res.set("Vary", "Accept");
  res.set(
    "Link",
    `Link: <http://www.w3.org/TR/annotation-protocol/>; rel="http://www.w3.org/ns/ldp#constrainedBy"`
  );
  res.set("Allow", "GET, OPTIONS, PUT, HEAD, DELETE, PATCH");

  if (req.method == "GET" || req.method == "DELETE") {
    next();
  } else if (isCorrectContentType) {
    if (req.body) {
      try {
        req.body = JSON.parse(await new TextDecoder().decode(req.body));
      } catch (error) {
        return res.status(400).send('Bad request body');
      }
    }
    next();
  } else {
    res.sendStatus(400);
  }
};

module.exports.validateRequestBody = spec => {
  // creates a middleware dynamicly
  return (req, res, next) => {
    // helper function used in mapping keys in given spec
    function notContainsKey(key) {
      // if given key isn't present in the request body, return a dict with error message
      if (req.body[key] === undefined) {
        const error = {};
        error[key] = `Couldn't found the '${key}' in the request body.`;
        return error;
      }
      // otherwise, return false, as there's no error about that key
      return false;
    }
    // map every key in the spec and filter out false values
    const errorMessages = spec.map(notContainsKey).filter(error => error);
    // if there are any errors, return them
    if (errorMessages.length > 0) {
      return res.status(400).send({
        errmsg: errorMessages
      });
    }
    // else, continue with the execution
    next();
  };
};
