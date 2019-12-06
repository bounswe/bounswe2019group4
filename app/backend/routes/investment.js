const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investment')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { UserAccount } = require('../models/user-account')
const { validateBody } = require('../controllers/middleware')

/*
  Post endpoint for deposit money.
  Check controller function for more detail
*/
router.post('/deposit', modelBinder(UserAccount, 'UserAccount'), investmentController.depositMoney)


module.exports = router
