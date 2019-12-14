const { Router } = require("express");

const { retrieveAnnotation } = require("../controllers/annotations");

const router = Router();
router.get("/", retrieveAnnotation);

module.exports = router;
