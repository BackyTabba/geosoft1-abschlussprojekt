//https://www.youtube.com/watch?v=Ud5xKCYQTjM
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config()

}
const express = require('express')
const app = express()
const bcrypt = require("bcrypt");
const passport = require("passport")
const session = require("express-session")
const flash = require("express-flash")
const methodOverride = require("method-override")
const sessionStorage = require("node-sessionstorage");
const mongoose = require("mongoose");
const cookie = require("cookie-parser");
mongoose.set('useFindAndModify', false);
const { DbUser, validate } = require("./models/user.model")
const {DbFahrt }= require("./models/fahrt.model")
const {DbGastFahrt}= require("./models/gastfahrt.model");
const mail = require('sendmail')();
var { ArztRouter, UserRouter, AdminRouter } = require("./db");
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));
//connect to mongodb
mongoose //127.0.0.1
  .connect("mongodb://127.0.0.1:27017/corona-app", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then(() => console.log("Connected to MongoDB via localhost..."))
  .catch(err => {
    console.error("Could not connect to MongoDB via localhost...")
    mongoose //Docker
      .connect("mongodb://mongodbservice:27017/corona-app", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
      .then(() => console.log("Connected to MongoDB via Docker..."))
      .catch(err => {
        console.error("Could not connect to MongoDB via Docker...")
      })

  })


//initialzie Passport
const initializePassport = require("./passport-config");
const { User } = require("./models/user.model");
initializePassport(
  passport,
  async (name) => { return await FindUserByName(name) },
  async (ID) => { return await FindUserByID(ID) }
)


//Nach der Anmeldung:
async function postLogin(a) {
  sessionStorage.setItem("ID", a.ID);
  sessionStorage.setItem("name", a.name);
  sessionStorage.setItem("email", a.email);
  sessionStorage.setItem("password", a.password);
  sessionStorage.setItem("IsInfiziert", a.IsInfiziert);
  sessionStorage.setItem("IsArzt", a.IsArzt);
  sessionStorage.setItem("IsAdmin", a.IsAdmin);
  if (a.IsArzt) {
    sessionStorage.setItem("Role", "Arzt")
  } else {
    sessionStorage.setItem("Role", "User")
  }
  if (a.IsAdmin) {
    sessionStorage.setItem("Role", "Admin")
  }
}
//Funktion um UserByID zu finden (Mongoose)
async function FindUserByID(ID) {
  return await DbUser.findOne({ ID: ID }).exec();
}
//Funktion um FindUserByName zu finden (Mongoose)
async function FindUserByName(Name) {
  return await (await DbUser.findOne({ name: Name }))
}

app.use(express.urlencoded({ extended: false }))
app.use("/css", express.static(__dirname + "/src/css"));
app.use("/javascripts", express.static(__dirname + "/src/javascripts"));
app.use("/icons", express.static(__dirname + "/src/icons"));
app.use('/jquery', (req, res) => { res.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js"); });
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

//Pfade der Router
app.use("/User",checkAuthenticated , UserRouter, express.static(__dirname + "/src/html/user"));
app.use("/Arzt",checkArzt,  ArztRouter, express.static(__dirname + "/src/html/arzt"));
app.use("/Admin",checkAdmin,  AdminRouter);

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method")) //Für Logout

app.get("/", checkAuthenticated, (req, res) => {
  res.redirect("/" + sessionStorage.getItem("Role")); //Weiterleitung abhängig von der Rolle
  res.sendFile(__dirname + "/src/html/index.html")
})

//Emailschnittstelle (ungetestet)
app.post("/arzt/risikofahrt", MeldeRisikoFahrt);
//Login
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/src/html/login.html");
})

//Authentifizierung von Passport
app.post('/login', checkNotAuthenticated, function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect("/login"); }
    req.logIn(user, function (err) {
      if (err) { return next(err); }
      console.log("success")
      console.log(user)
      postLogin(user);
      console.log(sessionStorage.getItem("Role"))
      return res.redirect("/"+sessionStorage.getItem("Role"));
    });
  })(req, res, next);
});


//Registrierung
app.get("/register", checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/src/html/register.html");
})
//Testmodul um Dinge zu Testen
//app.get("/test", wrapper);

//Registrierung Post
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    let user = new DbUser({
      ID: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      IsInfiziert: false,
      IsArzt: false,
      IsAdmin: false
    });
    user.save();
    res.redirect("/login")
    console.log(user)
  } catch(e){
    res.redirect("/register")
  }
  
})
//Logout
app.delete("/logout", (req, res) => {
  sessionStorage.removeItem("Role");
  req.logOut()
  res.redirect("/login")
})



//Risikofahrt ermitteln mit Emailbenachrichtigung (ungetestet)
async function MeldeRisikoFahrt(req, res, next) {
  //1)
  a = await DbFahrt.find({FahrtID:req.ID},{new:true}).exec();
  for(x of a){await DbFahrt.findOneAndUpdate({ID:a}, { $set: { Risiko: true }},{new:true}).exec();}
    //2)
    b = await DbGastFahrt.find({FahrtID: a.ID,},{new:true}).exec();
  for (x in b) {
       await DbUser.findOneAndUpdate({ID:x.GastID}, { $set: { Risiko: true }},{new:true}).exec();

    mail({
      from: 'service@corona.de',
      to: x.Email,
      subject: 'Teilnahme an eine Risikofahrt',
      content: 'Sie sind möglicherweise Infiziert! Bitte machen Sie einen Test!'
    },
      function (err, response) {
        if (err) {
          console.log(err);
        }
        console.dir(response);
      });
  }
  return next();
}


//Ist Benutzer angemeldet?
function checkAuthenticated(req, res, next) {
  if (!(sessionStorage.getItem("Role")==undefined)) {
    console.log("User Authenticated")
    console.log(sessionStorage.getItem("Role"))
    return next()
  }else{
  try {
    req.session.save(() => { res.redirect("/login") })
  } catch (e) {
    res.redirect("/login")
  }
}
}


//Ist Benutzer nicht angemeldet? Session muss gespeichert werden, sonst wird endlos redirected...

function checkNotAuthenticated(req, res, next) {

  if (req.isAuthenticated()) {
    //https://github.com/jaredhanson/passport/issues/482
    req.session.save(() => { return res.redirect("/") })
  }
  next()
}
function wrapper(req, res, next) {
  var a, b;
  testa(req, res, next);


  console.log(a, b);
}

// Ist Rolle = Arzt?
function checkArzt(req, res, next) {
  if (!(sessionStorage.getItem("IsArzt") || sessionStorage.getItem("IsAdmin"))) {
    res.redirect("/")
  } else {
    next();
  }
}

// Ist Rolle = Admin?
function checkAdmin(req, res, next) {
  if (!(sessionStorage.getItem("IsAdmin"))) {
    res.redirect("/")
  } else {
    next();
  }
}

//Mongoose datenbank connection Errorhandling
process.on("SIGTERM", () => {
  server.close();
  app.locals.dbConnection.close();
  console.log("SIGTERM");
  process.exit(0);
});

process.on("SIGINT", () => {
  server.close();
  app.locals.dbConnection.close();
  console.log("SIGINT");
  process.exit(0);
});
