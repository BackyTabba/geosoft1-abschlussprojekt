const chai = require('chai')
global.expect = chai.expect;
var supertest = require('supertest');
let should = chai.should();




const api= require('../src/javascripts/api.js')
const app= require('../server.js') 


global.request = supertest(server);


describe('API Test saveFahrt', function() {
    
    it('should not save a Fahrt without all properties necessary', function(done) {
       
       let fahrt = {
       	Lat: 51.5,
       	Long: -0.5,

       }

       request
        .post('localhost:3000/user/AddUserToFahrt')
        .send(fahrt)
        .end((err, res) =>{
        	
        	res.body.should.be.a('Object');
        	
        	res.body.should.have.property('stationsname');
        	res.body.stationsname.should.have.property('kind').eql('required');
       done();
        });
    });
});
