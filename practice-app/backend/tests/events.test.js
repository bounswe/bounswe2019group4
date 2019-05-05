const expect = require('chai').expect   // Mocha test library
const eventsController = require('../controllers/events')

// unit tests on the controller handling GET /events/list requests
describe('GET /events/list', () => {
    let response
    before('log', done => {
        let req = {}    // fake request object
        let res = {     // fake response object with send method
            send: async payload => {
                response = payload
                done()
            }
        }
        eventsController.list(req, res) // actual controller call
    })
    // tests whether the list controller returns an array on successful API call
    it('should return an array', done => {
        try {
            expect(response).to.be.an('Array')
            done()
        } catch (error) {
            done(error)
        }
    })
    // test whether every object in the response has eventName key
    it('should have eventName key in every item', done => {
        // uses reducer when checking every item in the list
        const allContainsEventname = response.reduce((acc, cur) => {
            // true if all items before cur and cur itself have the key eventName
            return acc && 'eventName' in cur
        }, true)
        try {
            expect(allContainsEventname).to.be.equals(true)         // test check
            done()          // calls next test
        } catch (error) {   // when error occurs,
            done(error)     // delegates the error message and continues
        }
    })
    // test whether every object in the response has signifanceLevel key
    it('should have signifanceLevel key in every item', done => {
        // uses reducer when checking every item in the list
        const allContainsSignifanceLevel = response.reduce((acc, cur) => {
            // true if all items before cur and cur itself have the key signifanceLevel
            return acc && 'signifanceLevel' in cur  
        }, true)
        try {
            expect(allContainsSignifanceLevel).to.be.equals(true)   // test check
            done()          // calls next test
        } catch (error) {   // when error occurs,
            done(error)     // delegates the error message and continues
        }
    })
})