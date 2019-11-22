const {filterData} = require('../utils')

module.exports.search = async (req, res, next) => {
    const {Event, TradingEquipment, Article, User} = req.models
    
    const term = req.query.q

    if(!term) {
        return res.status(400).json({errormsg: 'Query string should be passed as query in \'q\'.'})
    }

    const users = filterData(await User.find().lean(), ['name', 'surname',], term)
    const events = filterData(await Event.find().lean(), ['Country', 'CalendarId', 'Date', 'Catogory',], term)
    const tradingEq = filterData(await TradingEquipment.find().lean(), ['code', 'name',], term)
    const articles = filterData(await Article.find().lean(), ['text', 'title',], term)

    return res.json({
        users,
        events,
        'trading-equipments': tradingEq,
        articles,
    })
}