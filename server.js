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
  //name=> users.find(user => user.name === name),
  async (name) => { return await FindUserByName(name) },
  //id => users.find(user => user.id === id)
  async (ID) => { return await FindUserByID(ID) }
)


//Irgendwie nach der Anmeldung:
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


//--------------------------------------------------------------------


async function FindUserByID(ID) {
  return await DbUser.findOne({ ID: ID }).exec();
}

//const doc = await Band.findOne({ name: "Guns N' Roses" }); // works



async function FindUserByName(Name) {
  return await (await DbUser.findOne({ name: Name }))
}

function CreateUser(data) {
  DbUser.create(data);
}
//DbUser.create({ name: 'fluffy',password:"12345",email:"qaaaaaaaaa@q",ID:1234566 });

//--------------------------------------------------------------------

app.use(express.urlencoded({ extended: false }))


app.use("/css", express.static(__dirname + "/src/css"));
app.use("/javascripts", express.static(__dirname + "/src/javascripts"));
app.use("/icons", express.static(__dirname + "/src/icons"));
app.use('/jquery', (req, res) => { res.sendFile(__dirname + "/node_modules/jquery/dist/jquery.min.js"); });
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));


//Pfade und Router
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
app.use(methodOverride("_method"))

app.get("/", checkAuthenticated, (req, res) => {
  res.redirect("/" + sessionStorage.getItem("Role"));
  res.sendFile(__dirname + "/src/html/index.html")
})

app.post("/arzt/risikofahrt", MeldeRisikoFahrt);
app.get("/login", checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/src/html/login.html");
})
/*
app.post("/login",checkNotAuthenticated ,passport.authenticate("local",
{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
*/

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



app.get("/register", checkNotAuthenticated, (req, res) => {
  res.sendFile(__dirname + "/src/html/register.html");
})
app.get("/test", wrapper);
app.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    //users.push({
    CreateUser({
      ID: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      IsInfiziert: false,
      IsArzt: false,
      IsAdmin: false
    })
    res.redirect("/login")
  } catch(e){
    res.redirect("/register")
  }
  console.log(users)
})

app.delete("/logout", (req, res) => {
  sessionStorage.removeItem("Role");
  req.logOut()
  res.redirect("/login")
})




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


  // user = await DbUser.findOneByName(name);
  //console.log(DbUser);
  //FindUserByID(1600789791848,(abc)=>{res.json(abc)});
  /*{
      ID: Date.now().toString(),
      name: "qqqqqqqqqqq",
      email: "q@qqqqqqqq",
      password: 123456323778,
      IsInfiziert:false,
      IsArzt:false,
      IsAdmin:false
    }*/
  //next();
}
async function testa(req, res, next) {
  DbUser.find({ name: { $regex: "^A" } }).
    then(DbUsers => {
      console.log(DbUsers[0].name); // 'A'
      res.send(DbUsers);
      return DbUser.find({ name: { $regex: "^B" } });
    }).
    then(DbUsers => {
      console.log(DbUsers[1].name); // 'B'
      res.send(DbUsers);
    });
}
function checkArzt(req, res, next) {
  if (!(sessionStorage.getItem("IsArzt") || sessionStorage.getItem("IsAdmin"))) {
    res.redirect("/")
  } else {
    next();
  }
}
function checkAdmin(req, res, next) {
  if (!(sessionStorage.getItem("IsAdmin"))) {
    res.redirect("/")
  } else {
    next();
  }
}
function checkArzti(req, res, next) {
  console.log(req.user.role)
  CreateUser({
    id: Date.now().toString(),
    name: "q",
    email: "q@q",
    password: 123456778,
    IsInfiziert: false,
    IsArzt: false,
    IsAdmin: false
  })
  sessionStorage.setItem("key", "value");
  sessionStorage.setItem("lala", "value");
  sessionStorage.setItem("los", "santos");
  console.log(sessionStorage.getItem("los"));
  //req.session.test={hallo:"welt"};
  // req.sessionStorage.set(val1)={val2:"val3"}
  // console.log(""+req.session.test);
  // console.log(""+console.req.sessionStorage)
  if (req.user.role == undefined) req.user.role = "User"
  req.session.save();
  next();
}
//Bitte ignorieren, zukünftige Funktionen:
//https://stackoverflow.com/questions/28741062/how-can-you-define-multiple-isauthenticated-functions-in-passport-js
/*  function allowAdmins(req, res, next) {
      if (req.user.role === 'Admin') return next();
      res.redirect('/user-login');
    }
    
    function allowRegular(req, res, next) {
      if (req.user.role === 'Regular') return next();
      res.redirect('/admin-login');
    }*/

    //db functions






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


