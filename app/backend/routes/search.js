const { Router } = require('express')

const {multipleModelBinder} = require('../controllers/db')
const {Article} = require('../models/article')
const {User} = require('../models/user')
const {TradingEquipment} = require('../models/trading-eq')
const {Event} = require('../models/event')
const {validateQuery} = require('../controllers/middleware')

const {search} = require('../controllers/search')

const router = Router()

router.get('/', [
    validateQuery(['q']),
    multipleModelBinder(
        [[User, 'User'],
        [Article, 'Article'],
        [Event, 'Event'],
        [TradingEquipment, 'TradingEquipment'],
    ]),
    search])

module.exports = router