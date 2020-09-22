//https://www.wlaurance.com/2018/09/async-await-passportjs-local-strategy

//******************************************************************** von dem "YTTutorial"
const { authenticate } = require("passport")
const bcrypt = require("bcrypt")
//******************************************************************** von dem Bolg
const LocalStrategy = require('passport-local').Strategy;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ von mir
const DbUser = require("./models/user.model")
const DbFahrt = require("./models/fahrt.model")
const DbGastFahrt= require("./models/gastfahrt.model");
//+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++








///////////////////////////////////////
//Gesamt
const express = require('express');
const app = express();
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");




let strategy = new LocalStrategy(
    async function(name, password, done) {
      let user;
      try {
        user = await DbUser.findOneByName(name);
        if (!user) {
          return done(null, false, {message: 'No user by that name'});
        }
      } catch (e) {
        return done(e);
      }
  
      let match = await user.comparePassword(password);
      if (!match) {
        return done(null, false, {message: 'Not a matching password'});
      }
  
      return done(null, user);
  
    }
  );

//defined above
passport.use(strategy);

app.use(session({ secret: "cats" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());

//Could be async if we wanted it to
passport.serializeUser((user, done) => {
  done(null, user.email);
});

//ASYNC ALL THE THINGS!!
passport.deserializeUser(async (email, done) => {
  try {
    let user = await UserController.findOneByEmail(email);
    if (!user) {
      return done(new Error('user not found'));
    }
    done(null, user);
  } catch (e) {
    done(e);
  }
});

app.post('/login',
  passport.authenticate('local', { successRedirect: '/' }));

app.get('/me', async (req, res) => {
  res.send(req.user);
});

app.listen(3000, () => { console.log('listening on 3000') });