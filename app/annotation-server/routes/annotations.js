const { Router } = require("express");

const { validateRequestBody } = require("../controllers/middleware");
const {
  deleteAnnotation,
  updateAnnotation,
  retrieveAnnotation,
  retrieveAnnotationsByArticle,
  createAnnotation
} = require("../controllers/annotations");

const router = Router();
router.delete("/", deleteAnnotation);
router.get("/article/:articleId", retrieveAnnotationsByArticle);
router.get("/:id", retrieveAnnotation);
router.post("/", validateRequestBody([]), createAnnotation);
router.put("/", updateAnnotation);

module.exports = router;
