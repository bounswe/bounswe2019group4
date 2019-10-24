const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments')
const {modelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { Comment } = require('../models/comment')

/*
  Post endpoint for comment page.
  Check controller function for more detail
*/
router.post('/', [isAuthenticated, modelBinder(Comment, 'Comment')], commentController.postComment)

/*
  Get endpoint for comment page.
  Check controller function for more detail
*/
router.get('/:id', modelBinder(Comment, 'Comment'), commentController.getComment)

module.exports = router
