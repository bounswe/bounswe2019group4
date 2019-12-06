const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated, isTrader} = require('../controllers/auth')
const { UserAccount } = require('../models/user-account')
const { CurrentTradingEquipment } = require('../models/current-trading-eq')
const { InvestmentHistory } = require('../models/investment-history')
const { OrderInvestment } = require('../models/order-investment')
const { validateBody } = require('../controllers/middleware')

/*
  Get endpoint for investment history of that user.
  Check controller function for more detail
*/
router.get('/', [
  isAuthenticated,
  isTrader,
  modelBinder(InvestmentHistory, 'InvestmentHistory')], investmentController.getHistory)

/*
  Post endpoint for deposit money.
  Check controller function for more detail
*/
router.post('/deposit', [
  validateBody(['amount', 'iban', 'currency']),
  isAuthenticated,
  isTrader,
  multipleModelBinder([
  [InvestmentHistory, 'InvestmentHistory'],
  [UserAccount, 'UserAccount']
])], investmentController.depositMoney)

/*
  Post endpoint for invest for equipment.
  Check controller function for more detail
*/
router.post('/buy', [
  validateBody(['currency', 'amount']),
  isAuthenticated,
  isTrader,
  multipleModelBinder([
  [CurrentTradingEquipment, 'CurrentTradingEquipment'],
  [UserAccount, 'UserAccount'],
  [InvestmentHistory, 'InvestmentHistory']
])], investmentController.buy)

/*
  Post endpoint for sell equipment.
  Check controller function for more detail
*/
router.post('/sell', [
  validateBody(['currency', 'amount']),
  isAuthenticated,
  isTrader,
  multipleModelBinder([
  [CurrentTradingEquipment, 'CurrentTradingEquipment'],
  [UserAccount, 'UserAccount'],
  [InvestmentHistory, 'InvestmentHistory']
])], investmentController.sell)

/*
  Get endpoint for listing order investments.
  Check controller function for more detail
*/
router.get('/order', [
  isAuthenticated,
  isTrader,
  modelBinder(OrderInvestment, 'OrderInvestment')], investmentController.getOrders)

/*
  Post endpoint for order investment.
  Check controller function for more detail
*/
router.post('/order', [
  validateBody(['currency', 'amount', 'type', 'rate']),
  isAuthenticated,
  isTrader,
  modelBinder(OrderInvestment, 'OrderInvestment')], investmentController.createOrder)

/*
  Post endpoint for order investment.
  Check controller function for more detail
*/
router.delete('/order/:id', [
  isAuthenticated,
  isTrader,
  modelBinder(OrderInvestment, 'OrderInvestment')], investmentController.deleteOrder)


module.exports = router
