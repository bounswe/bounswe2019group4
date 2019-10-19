const express = require('express');
const router = express.Router();
const tradingEquipmentController = require('../controllers/trading-equipments')
const {modelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')
const { TradingEquipment } = require('../models/trading-eq')

/*
  Get endpoint for information of specific trading equipment.
  Check controller function for more detail
*/
router.get('/:code', [modelBinder(TradingEquipment, 'TradingEquipment'), modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.getTradingEquipment)

/*
  Post endpoint for following specific trading equipment.
  Check controller function for more detail
*/
router.post('/follow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.followTradingEq)

/*
  Post endpoint for unfollowing specific trading equipment.
  Check controller function for more detail
*/
router.post('/unfollow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.unfollowTradingEq)

module.exports = router
