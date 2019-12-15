const { Annotation, ETag } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    if ("canonical" in req.body || "via" in req.body) {
      return res.sendStatus(405);
    }
    await Annotation.updateOne({ id: req.body.id }, req.body);
    const doc = await Annotation.findOne({ id: req.body.id }).lean();
    if (!doc) {
      res.sendStatus(404);
    } else {
      res.json(doc);
      await ETag.update(
        { annotationId: doc._id },
        { etag: res._headers.etag },
        { upsert: true }
      );
    }
  } catch (error) {
    res.sendStatus(400);
  }
};
