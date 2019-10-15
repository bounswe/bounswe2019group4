const express = require('express');
const router = express.Router();
const tradingEquipmentController = require('../controllers/trading-equipments')
const {modelBinder} = require('../controllers/db')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')

/*
  Post endpoint for following specific trading equipment.
  Check controller function for more detail
*/
router.post('/follow', modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow'), tradingEquipmentController.followTradingEq)

module.exports = router
