const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated, isTrader} = require('../controllers/auth')
const { UserAccount } = require('../models/user-account')
const { CurrentTradingEquipment } = require('../models/current-trading-eq')
const { validateBody } = require('../controllers/middleware')

/*
  Post endpoint for deposit money.
  Check controller function for more detail
*/
router.post('/deposit', [
  validateBody(['amount', 'iban', 'currency']),
  isAuthenticated,
  isTrader,
  modelBinder(UserAccount, 'UserAccount')
  ], investmentController.depositMoney)


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
  [UserAccount, 'UserAccount']
])], investmentController.buy)


module.exports = router
