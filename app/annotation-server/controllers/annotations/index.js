const retrieveAnnotationsByArticle = require("./retrieveAnnotationsByArticle");
const retrieveAnnotation = require("./retrieveAnnotation");
const createAnnotation = require("./createAnnotation");
const updateAnnotation = require("./updateAnnotation");
const deleteAnnotation = require("./deleteAnnotation");

module.exports = {
  retrieveAnnotationsByArticle,
  deleteAnnotation,
  retrieveAnnotation,
  updateAnnotation,
  createAnnotation
};
