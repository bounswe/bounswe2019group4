const { Router } = require('express')

const {modelBinder, multipleModelBinder} = require('../controllers/db')
const {Article} = require('../models/article')
const {User} = require('../models/user')
const {TradingEquipment} = require('../models/trading-eq')
const {Event} = require('../models/event')

const {search} = require('../controllers/search')

const router = Router()

router.get('/', multipleModelBinder(
    [[User, 'User'],
    [Article, 'Article'],
    [Event, 'Event'],
    [TradingEquipment, 'TradingEquipment'],
]), search)

module.exports = router