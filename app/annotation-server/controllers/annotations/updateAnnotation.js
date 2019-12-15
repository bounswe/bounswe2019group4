const { Annotation } = require("../../models");

module.exports = async (req, res, next) => {
  try {
    if ("canonical" in req.body || "via" in req.body) {
      return res.sendStatus(405);
    }
    await Annotation.updateOne({ id: req.body.id }, req.body);
    Annotation.updateOne()
    res.json();
  } catch (error) {
    res.sendStatus(400);
  }
};
