
var express = require('express');
const mongoose = require('mongoose');
const { DbUser, validate } = require("../models/user.model.js")
const {DbFahrt }= require("../models/fahrt.model.js")
const {DbGastFahrt}= require("../models/gastfahrt.model.js");
var assert = require('assert');
const { JSDOM } = require( "jsdom" );
const { window } = new JSDOM( "" );
const $ = require( "jquery" )( window );


var should = require('should');
describe("TestDescription",function(){
    describe("#basicTest",async function(){
      await $.ajax({ //POST http://localhost:3000/login?name=t&password=t
        type: "GET",
        adapter: adapterXhr,
        url:"http://localhost:3000/login",
        //url: "http://localhost:3000/login?name=t&password=t",
        success: function(msg){
            console.log("Juhuu")
        }
    });
        it("should be true",function(){ should.equal(true,true,"Lalalal das failte")})
    })
})


/*
var assert = require('assert');
describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
*/