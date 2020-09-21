const mongoose = require('mongoose');

//simple schema

const GastFahrtSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique:true,
  },
  GastID: {
    type: Number,
    required: true,
  },
  FahrtID: {
    type: Number,
    required: true,
  },
  einstiegszeit: String,
  endstation: String,
  liniennamen: String,
  stationsname: String,
  Lat:Number,
  Long:Number,
  StationID:Number
});



const GastFahrt = mongoose.model('GastFahrt', GastFahrtSchema);

//function to validate Fahrten 
/*function validateUser(Fahrten) {

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(user);
}*/

exports.GastFahrt = GastFahrt;