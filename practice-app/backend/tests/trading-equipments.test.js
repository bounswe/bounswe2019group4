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
                console.log(Object.keys(payload))
                done()  // calls the next test case
            }
        }
        tradingEqController.dollarRates(req, res) // actual controller call
    })
    // tests whether the dollarRates controller returns an Object on successful API call
    it('should return an Object', done => {
        try {
            expect(response).to.be.an('Object')  // checks if the response is an Object
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })
    // tests whether the dollarRates controllers Object's values are all numbers
    it('values should be numbers', done => {
        try {
            const values = Object.values(response)
            let anyerror = false
            for(let i=0; i<values.length; i++){
                if(typeof values[i] != "number"){
                    anyerror = true
                    break
                }
            }
            expect(anyerror).to.be.equal(false)  // checks if the anyerror is false
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })
    // tests whether the dollarRates controllers Object's keys are starting with "USD"
    it('keys should start with "USD"', done => {
        try {
            const ratenames = Object.keys(response)
            let anyerror = false
            for(let i=0; i<ratenames.length; i++){
                if(!ratenames[i].startsWith("USD")){
                    anyerror = true
                    break
                }
            }
            expect(anyerror).to.be.equal(false)  // checks if anyerror is false
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })
    
})