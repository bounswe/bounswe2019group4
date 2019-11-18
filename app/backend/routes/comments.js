const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments')
const {modelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const {validateBody} = require('../controllers/middleware')
const { Comment } = require('../models/comment')

/*
  Post endpoint for comment page.
  Check controller function for more detail
*/

router.post('/', [
  isAuthenticated,
  validateBody(['related', 'text', 'about']),
  modelBinder(Comment, 'Comment')], commentController.postComment)

/*
  Get endpoint for comment page.
  Check controller function for more detail
*/
router.get('/:about/:id', modelBinder(Comment, 'Comment'), commentController.getComment)

/*
  Delete endpoint for comment page.
  Check controller function for more detail
*/
router.delete('/:id', [isAuthenticated, modelBinder(Comment, 'Comment')], commentController.deleteComment)

module.exports = router
