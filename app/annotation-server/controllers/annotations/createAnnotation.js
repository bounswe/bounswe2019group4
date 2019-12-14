const { Annotation } = require("../../models");

const { siteUrl } = require("../../utils");

module.exports = async (req, res, next) => {
  const instance = new Annotation({ ...req.body });
  let doc = await instance.save();
  doc.id = `${siteUrl}/annotations/${doc._id}`;
  doc = await doc.save();

  res.status(201).json(doc);
};
