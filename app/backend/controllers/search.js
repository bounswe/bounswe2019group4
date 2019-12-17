const {filterData} = require('../utils')

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
    users = users.reduce((acc, value) => {
        if(value._id in acc) {
            return acc
        } else {
            acc[value._id] = value
            return acc
        }
    }, {})
    users = Object.values(users)
    users = Array.from(new Set(users)).sort((a, b) => eval(b.predictionRate) - eval(a.predictionRate))
    let events = terms.flatMap(term => filterData(eventsData, ['Country', 'Catogory', 'Event'], term))
    events = events.reduce((acc, value) => {
        if(value._id in acc) {
            return acc
        } else {
            acc[value._id] = value
            return acc
        }
    }, {})
    events = Object.values(events)
    let tradingEq = terms.flatMap(term => filterData(tradingEqData, ['from', 'fromName', 'to', 'toName'], term))
    tradingEq = tradingEq.reduce((acc, value) => {
        if(value._id in acc) {
            return acc
        } else {
            acc[value._id] = value
            return acc
        }
    }, {})
    tradingEq = Object.values(tradingEq)
    let articles = terms.flatMap(term => filterData(articlesData, ['text', 'title'], term))
    articles = articles.reduce((acc, value) => {
        if(value._id in acc) {
            return acc
        } else {
            acc[value._id] = value
            return acc
        }
    }, {})
    articles = Object.values(articles)
    return res.json({
        users,
        events,
        'trading-equipments': tradingEq,
        articles,
    })
}