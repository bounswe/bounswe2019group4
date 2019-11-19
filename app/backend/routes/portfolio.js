const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolio')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const { Portfolio } = require('../models/portfolio')
const { PortfolioTradingEq } = require('../models/portfolio-tradingEq')
const { PortfolioFollow } = require('../models/portfolio-follow')
const { validateBody } = require('../controllers/middleware')

/*
  Post endpoint for portfolio.
  Check controller function for more detail
*/

router.post('/',[
  validateBody(['title', 'definition', 'tradingEqs', 'isPrivate']),
  isAuthenticated, 
  multipleModelBinder([
    [Portfolio, 'Portfolio'],
    [PortfolioTradingEq, 'PortfolioTradingEq']
  ])], portfolioController.postPortfolio)

/*
  Post endpoint for rename portfolio.
  Check controller function for more detail
*/

router.patch('/:id', [
  validateBody(['title', 'definition']),
  isAuthenticated,
  modelBinder(Portfolio, 'Portfolio')], portfolioController.editPortfolio)

/*
  Get endpoint for portfolio.
  Check controller function for more detail
*/
router.get('/:id',[ multipleModelBinder([
  [Portfolio, 'Portfolio'],
  [PortfolioTradingEq, 'PortfolioTradingEq']
])], portfolioController.getPortfolio)

/*
  Post endpoint for add trading eq to portfolio.
  Check controller function for more detail
*/

router.post('/:id/add',[
  validateBody(['tradingEqs']),
  isAuthenticated,
  multipleModelBinder([
    [Portfolio, 'Portfolio'],
    [PortfolioTradingEq, 'PortfolioTradingEq']
  ])], portfolioController.addTradingEq)

/*
  Delete endpoint for remove trading eq from portfolio.
  Check controller function for more detail
*/

router.delete('/:id/remove',[
  validateBody(['tradingEqs']),
  isAuthenticated,
  multipleModelBinder([
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
router.patch('/:id/share', [ isAuthenticated, modelBinder(Portfolio, 'Portfolio')], portfolioController.sharePortfolio)

/*
  Post endpoint for following specific portfolio.
  Check controller function for more detail
*/
router.post('/:id/follow', [isAuthenticated, modelBinder(PortfolioFollow, 'PortfolioFollow')], portfolioController.followPortfolio)

/*
  Post endpoint for unfollowing specific portfolio.
  Check controller function for more detail
*/
router.post('/:id/unfollow', [isAuthenticated, modelBinder(PortfolioFollow, 'PortfolioFollow')], portfolioController.unfollowPortfolio)

module.exports = router
