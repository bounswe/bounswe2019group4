const { Annotation, ETag } = require("../../models");
const { siteUrl } = require("../../utils");

module.exports = async (req, res, next) => {
  const instance = new Annotation({ ...req.body });
  let doc = await instance.save();
  doc.id = `${siteUrl}/annotations/${doc._id}`;
  doc = await doc.save();

  res.status(201).json(doc);
  await ETag.updateOne(
    { etag: res._headers.etag },
    { annotationId: doc._id },
    { upsert: true }
  );
};
