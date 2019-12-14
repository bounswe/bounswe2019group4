module.exports.jsonld = (req, res, next) => {
  const isCorrectContentType = /application\/ld\+json;\s*profile="http:\/\/www\.w3\.org\/ns\/anno\.jsonld"/.test(
    req.get("content-type")
  );
  if (isCorrectContentType) {
    res.set("content-type", req.get("content-type"));
    res.set("Vary", "Accept");
    res.set(
      "Link",
      `Link: <https://${req.hostname}/annotations/>; rel="http://www.w3.org/ns/oa#annotationService"`
    );
    res.set("Allow", "GET, OPTIONS, PUT, HEAD, DELETE, PATCH");
    next();
  } else {
    res.sendStatus(400);
  }
};
