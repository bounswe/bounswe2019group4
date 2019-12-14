const { Router } = require("express");

const { validateRequestBody } = require("../controllers/middleware");
const {
  retrieveAnnotation,
  createAnnotation
} = require("../controllers/annotations");

const router = Router();
router.get("/:id", retrieveAnnotation);
router.post("/", validateRequestBody([]), createAnnotation);

module.exports = router;
