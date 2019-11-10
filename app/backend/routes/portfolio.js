const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { Portfolio } = require('../models/portfolio')
const { PortfolioTradingEq } = require('../models/portfolio-tradingEq')
const { PortfolioFollow } = require('../models/portfolio-follow')

/*
  Post endpoint for portfolio.
  Check controller function for more detail
*/

router.post('/',[ isAuthenticated, multipleModelBinder([
    [Portfolio, 'Portfolio'],
    [PortfolioTradingEq, 'PortfolioTradingEq']
  ])], portfolioController.postPortfolio)

/*
  Post endpoint for rename portfolio.
  Check controller function for more detail
*/

router.patch('/rename', [ isAuthenticated, modelBinder(Portfolio, 'Portfolio')], portfolioController.renamePortfolio)

/*
  Get endpoint for portfolio.
  Check controller function for more detail
*/
router.get('/:id',[ isAuthenticated, multipleModelBinder([
  [Portfolio, 'Portfolio'],
  [PortfolioTradingEq, 'PortfolioTradingEq']
])], portfolioController.getPortfolio)

/*
  Post endpoint for add trading eq to portfolio.
  Check controller function for more detail
*/

router.post('/add',[ isAuthenticated, multipleModelBinder([
  [Portfolio, 'Portfolio'],
  [PortfolioTradingEq, 'PortfolioTradingEq']
])], portfolioController.addTradingEq)

/*
  Delete endpoint for remove trading eq from portfolio.
  Check controller function for more detail
*/

router.delete('/remove',[ isAuthenticated, multipleModelBinder([
  [Portfolio, 'Portfolio'],
  [PortfolioTradingEq, 'PortfolioTradingEq']
])], portfolioController.removeTradingEq)

/*
  Delete endpoint for portfolio.
  Check controller function for more detail
*/
router.delete('/:id',[ isAuthenticated, multipleModelBinder([
  [Portfolio, 'Portfolio'],
  [PortfolioTradingEq, 'PortfolioTradingEq']
])], portfolioController.deletePortfolio)

/*
  Post endpoint for share portfolio.
  Check controller function for more detail
*/
router.patch('/share', [ isAuthenticated, modelBinder(Portfolio, 'Portfolio')], portfolioController.sharePortfolio)

/*
  Post endpoint for following specific portfolio.
  Check controller function for more detail
*/
router.post('/follow', [isAuthenticated, modelBinder(PortfolioFollow, 'PortfolioFollow')], portfolioController.followPortfolio)

/*
  Post endpoint for unfollowing specific portfolio.
  Check controller function for more detail
*/
router.post('/unfollow', [isAuthenticated, modelBinder(PortfolioFollow, 'PortfolioFollow')], portfolioController.unfollowPortfolio)

module.exports = router
