const chai = require('chai')
global.expect = chai.expect;
var supertest = require('supertest');




const express = require('express')
const app= require('../server.js') 


global.request = supertest(app);


describe('API Test GET /login', function() {
    
    it('OK /login', function(done) {
       request
        .get('/login')
        .expect(200)
       done();
        });
    });

// describe('API Test POST /register', function(){

// 	it('should register a user with ID, name, email and password', function(done){
//         let user = {
//         	ID: 12345
//         	name : 'JohnDoe'
//         	email: 'john@doe.com'
//         	password: '123455663045'
//         }

// 		request.post('/register')
// 		    .send(user)
// 		    .end((err, res) => {
// 		    	res.should.have.status(200);
// 		    	res.should.have.property('ID');
// 		    	res.should.have.property('name');
// 		    	res.should.have.property('email');
// 		    	res.should.have.property('password');
// 		    done();
// 		    });
// 	});
// })
 