const { Annotation, ETag } = require("../../models");

module.exports = async (req, res, next) => {
  const instances = await Annotation.find({
    articleId: req.params.articleId
  }).lean();
  res.json(instances);
};
