const express = require('express');
const router = express.Router();
const commentController = require('../controllers/comments')
const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {isAuthenticated} = require('../controllers/auth')
const {validateBody} = require('../controllers/middleware')
const { EventsComment, TradingEquipmentsComment } = require('../models/comment')

/*
  Post endpoint for comment page.
  Check controller function for more detail
*/
router.post('/', [isAuthenticated, 
  multipleModelBinder([
    [EventsComment, 'EventsComment'],
    [TradingEquipmentsComment, 'TradingEquipmentsComment']
  ])], commentController.postComment)

/*
  Get endpoint for comment page.
  Check controller function for more detail
*/
router.get('/:id', multipleModelBinder([[EventsComment, 'EventsComment'], 
    [TradingEquipmentsComment, 'TradingEquipmentsComment']]), commentController.getComment)

/*
  Delete endpoint for comment page.
  Check controller function for more detail
*/
router.delete('/:id', [isAuthenticated, multipleModelBinder([[EventsComment, 'EventsComment'], 
    [TradingEquipmentsComment, 'TradingEquipmentsComment']])], commentController.deleteComment)

module.exports = router
