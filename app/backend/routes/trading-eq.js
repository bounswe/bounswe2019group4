const express = require('express');
const router = express.Router();
const tradingEquipmentController = require('../controllers/trading-equipments')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { TradingEquipmentFollow } = require('../models/trading-eq-follow')
const { TradingEquipmentPrediction } = require('../models/trading-eq-prediction')
const { TradingEquipment } = require('../models/trading-eq')
const { CurrentTradingEquipment } = require('../models/current-trading-eq')
const { TradingEquipmentAlert } = require('../models/trading-eq-alert')
const { Comment } = require('../models/comment')
const {validateBody} = require('../controllers/middleware')

/*
  Delete endpoint for alerts.
  Check controller function for more detail
*/
router.delete('/alert/:id', [
  isAuthenticated,
  modelBinder(TradingEquipmentAlert, 'TradingEquipmentAlert')], tradingEquipmentController.deleteAlert)

/*
  Post endpoint for following specific trading equipment.
  Check controller function for more detail
*/
router.post('/follow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.followTradingEq)

/*
  Post endpoint for making a prediction regarding the increase or decrease of a specific trading equipment.
  Check controller function for more detail
*/
router.post('/prediction', [
  isAuthenticated,
  modelBinder(TradingEquipmentPrediction, 'TradingEquipmentPrediction')],
  validateBody(['tEq', 'value', 'prediction']),
  tradingEquipmentController.predictTradingEq)

/*
  Post endpoint for set alerts for trading equipment.
  Check controller function for more detail
*/
router.post('/alert', [
  validateBody(['currency','rate', 'compare']),
  isAuthenticated,
  multipleModelBinder([
  [CurrentTradingEquipment, 'CurrentTradingEquipment'],
  [TradingEquipmentAlert, 'TradingEquipmentAlert'],
])], tradingEquipmentController.setAlert)

/*
  Post endpoint for unfollowing specific trading equipment.
  Check controller function for more detail
*/
router.post('/unfollow', [isAuthenticated, modelBinder(TradingEquipmentFollow, 'TradingEquipmentFollow')], tradingEquipmentController.unfollowTradingEq)

/*
  Get endpoint for previously set alerts for trading equipment.
  Check controller function for more detail
*/
router.get('/alert/show', [
  isAuthenticated,
  modelBinder(TradingEquipmentAlert, 'TradingEquipmentAlert')], tradingEquipmentController.getAlerts)

/*
  Get endpoint for information of specific trading equipment.
  Check controller function for more detail
*/
router.get('/:code', multipleModelBinder([
  [TradingEquipment, 'TradingEquipment'],
  [TradingEquipmentFollow, 'TradingEquipmentFollow'],
  [CurrentTradingEquipment, 'CurrentTradingEquipment'],
  [TradingEquipmentPrediction, 'TradingEquipmentPrediction'],
  [Comment, 'Comment'],
]), tradingEquipmentController.getTradingEquipment)

/*
  Get endpoint for information of all trading equipment's current values.
  Check controller function for more detail
*/
router.get('/', modelBinder(CurrentTradingEquipment, 'CurrentTradingEquipment'), tradingEquipmentController.getCurrentValues)

module.exports = router
