const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendation')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { Article } = require('../models/article')
const {User} = require('../models/user')
const { UserFollow } = require('../models/user-follow')
const { ArticleUser } = require('../models/article-user')

/*
  Get endpoint for recommendations.
  Check controller function for more detail
*/
router.get('/', [
    isAuthenticated,
    multipleModelBinder(
        [[User, 'User'],
        [Article, 'Article'],
        [UserFollow, 'UserFollow'],
        [ArticleUser, 'ArticleUser']
    ])], recommendationController.recommend)

module.exports = router
