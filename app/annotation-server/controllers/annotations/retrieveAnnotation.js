const { Annotation, ETag } = require("../../models");

module.exports = async (req, res, next) => {
  const instance = await Annotation.findById(req.params.id).lean();
  if (!instance) {
    return res.sendStatus(404);
  }
  res.json(instance);
  await ETag.updateOne(
    { etag: res._headers.etag },
    { annotationId: instance._id },
    { upsert: true }
  );
};
