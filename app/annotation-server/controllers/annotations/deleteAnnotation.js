const { Annotation, ETag } = require("../../models");

module.exports = async (req, res, next) => {
  const etag = await ETag.findOne({ etag: req.get("If-Match") });
  if (etag) {
    await ETag.deleteMany({ annotationId: etag.annotationId });
    await Annotation.deleteOne({ _id: etag.annotationId });
    res.sendStatus(204);
  } else {
    res.sendStatus(404);
  }
};
