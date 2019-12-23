const { Router } = require("express");

const annotations = require("./annotations");

const router = Router();
router.use("/annotations", annotations);
router.use("/", (req, res, next) => {
  res.sendStatus(400);
});
module.exports = router;
