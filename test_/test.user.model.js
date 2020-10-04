/*
##################
-UNIT TEST USING MOCHA, CHAI AND SUPERTEST
-TESTING THE MONGOOSE USER SCHEMA 
-PRECISELY: THE UNIT TEST TESTS THAT NO USER CAN BE CREATED WITHOUT ALL REQUIRED PROPERTIES OF THE SCHEMA
- IF A REQUIRED PROPERTY IS MISSING THE USER VALIDATION FAILS, WHICH THE TEST THEN DISPLAYS AS A MESSAGE
##################
*/
const chai = require('chai')
global.expect = chai.expect

var supertest = require('supertest');

mongoose = require('mongoose');

const app= require('../server.js') 

var request = require('supertest');
global.request = supertest(app);




const UserSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique:true,
    minlength: 3,
    maxlength: 50
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  },
  //give different access rights if admin or not 
  isAdmin: Boolean,
  IsArzt: Boolean,
  IsInfiziert:Boolean
});


describe('Lifecycle', function(){
	
 it('should not save without all required properties', function(done){
	var User = mongoose.model('User', UserSchema);
	var user = new User({
		email: "alex1@alex.com",
		
	});
	user.save(function(err){
		expect(err).to.exist
		.and.be.instanceof(Error)
		.and.have.property('message', 'user validation failed');
	 done();	
	});
	
});

}) 






