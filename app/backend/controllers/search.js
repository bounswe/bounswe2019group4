const {filterData, filterArticleTitles} = require('../utils')

module.exports.search = async (req, res, next) => {
    const {Event, CurrentTradingEquipment, Article, User} = req.models
    
    const terms = req.query.q.split(' ')    // splits query string into words for word-by-word search

    // creates connections for each query
    let usersData = User.find().select('name surname location predictionRate').sort({predictionRate: -1}).lean()
    let eventsData = Event.find().select('Country CalendarId Date Catogory Event Importance').sort({Importance: -1}).lean()
    let tradingEqData = CurrentTradingEquipment.find().select('from fromName to toName rate').lean()
    let articlesData = Article.find().select('text title').lean()


    usersData = await usersData
    eventsData = await eventsData
    tradingEqData = await tradingEqData
    articlesData = await articlesData

    // searches for every word in the query string
    let users = terms.flatMap(term => filterData(usersData, ['name', 'surname', 'location'],term))
    users = Array.from(new Set(users)).sort((a, b) => eval(b.predictionRate) - eval(a.predictionRate))
    const events = terms.flatMap(term => filterData(eventsData, ['Country', 'Catogory', 'Event'], term))
    const tradingEq = terms.flatMap(term => filterData(tradingEqData, ['from', 'fromName', 'to', 'toName'], term))
    const articles = await filterArticleTitles(articlesData, req.query.q)

    return res.json({
        users,
        events,
        'trading-equipments': tradingEq,
        articles,
    })
}