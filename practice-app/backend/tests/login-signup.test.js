const expect = require('chai').expect   // Mocha test library
const controller = require('../controllers/login-signup')

// unit tests on the controller handling signup requests
describe('Test for signup', () => {
    let response        // response of the controller, will be assigned later
    // prepares testbed, calls the controller and assigns the response to the variable in the closure
    before('log', done => {
        let body = {
            name: 'Test-Name',
            surname: 'Test-Surname',
            email: 'testingemail@testing.com'+Date.now(),
            password: 'testpassword',
            location: 'Boun',
            isTrader: false
        };

        let req = {
            body: body
        };
            // fake request object
        let res = {     // fake response object with send method
            send: async payload => {
                response = payload  
                done()  // calls the next test case
            }
        }
        controller.signup(req, res); // actual controller call
    })
    // tests whether the list controller returns an object on successful API call
    it('should return an Object', done => {
        try {
            expect(response).to.be.an('Object');  // checks 
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })

    it('compare attribute values', done => {
        try {
            expect(response['name']).to.be.equal('Test-Name');
            expect(response['surname']).to.be.equal('Test-Surname');
            expect(response['location']).to.be.equal('Boun');
            expect(response['isTrader']).to.be.equal(false);
            done()          // calls the next test case
        } catch (error) {   // if error occurs,
            done(error)     // delegates the error message and continues
        }
    })
});
