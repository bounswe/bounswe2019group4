const { Router } = require("express");

const { validateRequestBody } = require("../controllers/middleware");
const {
  updateAnnotation,
  retrieveAnnotation,
  createAnnotation
} = require("../controllers/annotations");

const router = Router();
router.get("/:id", retrieveAnnotation);
router.post("/", validateRequestBody([]), createAnnotation);
router.put("/", updateAnnotation);

module.exports = router;
