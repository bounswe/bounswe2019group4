const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { User } = require('../models/user')
const { UserFollow } = require('../models/user-follow')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')
const { Article } = require('../models/article')
const { Portfolio } = require('../models/portfolio')
const { validateBody } = require('../controllers/middleware')

/*
  Get endpoint for profile page.
  Check controller function for more detail
*/
router.get('/:id', multipleModelBinder([
  [User, 'User'],
  [UserFollow, 'UserFollow'],
  [TradingEquipmentFollow, 'TradingEquipmentFollow'],
  [Article, 'Article'],
  [Portfolio, 'Portfolio']
]), profileController.getDetails)

/*
  Get endpoint for following user.
  Check controller function for more detail
*/
router.get('/:id/follow', [isAuthenticated, multipleModelBinder([
  [User, 'User'],
  [UserFollow, 'UserFollow'],
])], profileController.followUser)

/*
  Get endpoint for unfollowing user.
  Check controller function for more detail
*/
router.get('/:id/unfollow', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.unfollowUser)

/*
  Get endpoint for rejecting user following request.
  Check controller function for more detail
*/
router.get('/accept/:id', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.acceptRequest)

/*
  Get endpoint for rejecting user following request.
  Check controller function for more detail
*/
router.get('/reject/:id', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.rejectRequest)

/*
  Get endpoint for canceling user following request.
  Check controller function for more detail
*/
router.get('/cancel/:id', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.cancelRequest)


/*
  Get endpoint for editing profile details.
  Check controller function for more detail
*/
router.patch('/edit',[
  validateBody(['name', 'surname', 'email', 'location', 'isTrader', 'isPublic']),
  isAuthenticated,
  modelBinder(User, 'User')], profileController.editProfile)

/*
  Get endpoint for change password
  Check controller function for more detail
*/
router.patch('/changePassword',[
  validateBody(['oldPassword', 'password']),
  isAuthenticated,
  modelBinder(User, 'User')
], profileController.changePassword)

module.exports = router
