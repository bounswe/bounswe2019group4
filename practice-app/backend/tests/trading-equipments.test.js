const expect = require('chai').expect   // Mocha test library
const tradingEqController = require('../controllers/trading-equipments')

// unit tests on the controller handling GET /tradingEq/dollarRates requests
describe('GET /tradingEq/dollarRates', () => {
    let response        // response of the controller, will be assigned later
    // prepares testbed, calls the controller and assigns the response to the variable in the closure
    before('log', done => {
        let req = {}    // fake request object
        let res = {     // fake response object with send method
            send: async payload => {
                response = payload  
                done()  // calls the next test case
            }
        }
        tradingEqController.dollarRates(req, res) // actual controller call
    })
    // tests whether the dollarRates controller returns an array on successful API call
    it('should return an array', done => {
        try {
            expect(response).to.be.an('Array')  // checks if the response is an array
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })
    
})