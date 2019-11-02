const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { User } = require('../models/user')
const { UserFollow } = require('../models/user-follow')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')

/*
  Get endpoint for profile page.
  Check controller function for more detail
*/
router.get('/:id', multipleModelBinder([
  [User, 'User'],
  [UserFollow, 'UserFollow'],
  [TradingEquipmentFollow, 'TradingEquipmentFollow'],
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
  Post endpoint for rejecting user following request.
  Check controller function for more detail
*/
router.get('/accept/:id', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.acceptRequest)

/*
  Post endpoint for rejecting user following request.
  Check controller function for more detail
*/
router.get('/reject/:id', [isAuthenticated, modelBinder(UserFollow, 'UserFollow')], profileController.rejectRequest)

module.exports = router
