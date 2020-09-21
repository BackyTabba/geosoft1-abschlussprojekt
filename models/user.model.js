const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');

//simple schema


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



const User = mongoose.model('User', UserSchema);

//function to validate user 
function validateUser(user) {

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(user);
}

exports.DbUser = User; 
exports.validate = validateUser;