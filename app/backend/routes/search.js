const { Router } = require('express')

const {multipleModelBinder} = require('../controllers/db')
const {Article} = require('../models/article')
const {User} = require('../models/user')
const {CurrentTradingEquipment} = require('../models/current-trading-eq')
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
        [CurrentTradingEquipment, 'CurrentTradingEquipment'],
    ]),
    search])

module.exports = router