const {filterData} = require('../utils')

module.exports.search = async (req, res, next) => {
    const {Event, TradingEquipment, Article, User} = req.models
    
    const terms = req.query.q.split(' ')    // splits query string into words for word-by-word search

    // creates connections for each query
    let usersData = User.find().select('name surname location').lean()
    let eventsData = Event.find().select('Country CalendarId Date Catogory Event').lean()
    let tradingEqData = TradingEquipment.find().select('code name').lean()
    let articlesData = Article.find().select('text title').lean()


    usersData = await usersData
    eventsData = await eventsData
    tradingEqData = await tradingEqData
    articlesData = await articlesData

    // searches for every word in the query string
    const users = terms.flatMap(term => filterData(usersData, ['name', 'surname', 'location'], term))
    const events = terms.flatMap(term => filterData(eventsData, ['Country', 'Catogory', 'Event'], term))
    const tradingEq = terms.flatMap(term => filterData(tradingEqData, ['code', 'name'], term))
    const articles = terms.flatMap(term => filterData(articlesData, ['text', 'title'], term))

    return res.json({
        users,
        events,
        'trading-equipments': tradingEq,
        articles,
    })
}