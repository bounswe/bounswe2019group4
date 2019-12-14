const { Router } = require("express");

const annotations = require("./annotations");

const router = Router();
router.use("/annotations", annotations);

module.exports = router;
