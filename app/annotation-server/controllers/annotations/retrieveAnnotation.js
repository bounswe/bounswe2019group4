const { Annotation } = require("../../models");

module.exports = async (req, res, next) => {
  const instance = await Annotation.findById(req.params.id).lean();

  res.json(instance);
};
