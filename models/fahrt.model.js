const mongoose = require('mongoose');

//simple schema
const FahrtSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: true,
    unique:true,
    minlength: 3,
    maxlength: 50
  },
  Risiko: {
    type: Boolean,
    required: true
  },
  endstation: String,
  liniennamen:String,
});



const Fahrt = mongoose.model('Fahrt', FahrtSchema);

//function to validate Fahrt 
/*function validateUser(Fahrt) {

  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  });

  return schema.validate(user);
}*/

exports.Fahrt = Fahrt; 
