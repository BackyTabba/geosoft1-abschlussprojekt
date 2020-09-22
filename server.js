//https://www.youtube.com/watch?v=Ud5xKCYQTjM
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()

}
const express = require('express')
const app= express()
const bcrypt = require("bcrypt");
const users=[{
    id: '1600781382780',
    name: 'w',
    email: 'w@w',
    password: '$2b$12$q50ZOCs7fcDFLAXYUnAsz.aNT3OG3sp3amtcb.C/gOpCozubNGenK'
  }]
const passport = require("passport")
const session = require("express-session")
const flash = require("express-flash")
const methodOverride = require("method-override")
const sessionStorage = require("node-sessionstorage");
const mongoose = require("mongoose");
const cookie= require("cookie-parser");
mongoose.set('useFindAndModify', false);
const mail = require('sendmail')();
var {ArztRouter,UserRouter,AdminRouter} = require("./db");
var server = app.listen(3000, () => console.log("listening on port " + 3000 + "! :)"));
//connect to mongodb
mongoose
    .connect("mongodb://127.0.0.1:27017/corona-app", { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));


//initialzie Passport
const initializePassport = require("./passport-config");
const { User } = require("./models/user.model");
initializePassport(
    passport,
    //name=> users.find(user => user.name === name),
    async (name) => {return await FindUserByName(name)},
    //id => users.find(user => user.id === id)
    async (ID) => {return await FindUserByID(ID)}
    )


//Irgendwie nach der Anmeldung:
function postLogin(){
a=FindUserByName(Username);
    sessionStorage.setItem("ID", a.ID);
    sessionStorage.setItem("name", a.name);
    sessionStorage.setItem("email",a.email);
    sessionStorage.setItem("password", a.password);
    sessionStorage.setItem("IsInfiziert", a.IsInfiziert);
    sessionStorage.setItem("IsArzt", a.IsArzt);
    sessionStorage.setItem("IsAdmin",a.IsAdmin);
}

//--------------------------------------------------------------------
const { DbUser, validate } = require("./models/user.model")
const DbFahrt = require("./models/fahrt.model")
const DbGastFahrt= require("./models/gastfahrt.model");

async function FindUserByID(ID){
    await DbUser.findOne({ID:ID},function(err,DbUser) {
      console.log("User found by ID:"+DbUser)
      return DbUser;  
    })
}

//const doc = await Band.findOne({ name: "Guns N' Roses" }); // works



async function FindUserByName(Name){
    await DbUser.findOne({name:Name},function(err,DbUser) {
        console.log("User found by Name:"+DbUser);
    return DbUser;
    })}

function CreateUser (data){
        DbUser.create(data);
}
//DbUser.create({ name: 'fluffy',password:"12345",email:"qaaaaaaaaa@q",ID:1234566 });

//--------------------------------------------------------------------

app.use(express.urlencoded({extended:false}))
//app.use("/", express.static(__dirname + "/src/html"));


app.use('/jquery', (req,res)=> { res.sendFile(__dirname+"/node_modules/jquery/dist/jquery.min.js"); });
app.use('/leaflet', express.static(__dirname+'/node_modules/leaflet/dist'));
app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap/dist'));


//Pfade und Router
app.use("/User", UserRouter,express.static(__dirname+"/src/html/user"));
app.use("/Arzt", ArztRouter,express.static(__dirname+"/src/html/arzt"));//CheckArzt ,
app.use("/Admin", AdminRouter);//CheckAdmin ,

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.get('/',checkAuthenticated,checkArzt,(req,res)=>{
    res.sendFile(__dirname+"/src/html/index.html")
    })

app.post("/arzt/risikofahrt",risikoFahrt);
app.get("/login",checkNotAuthenticated,(req,res)=>{
    res.sendFile(__dirname+"/src/html/login.html");
})
app.post("/login",checkNotAuthenticated ,passport.authenticate("local",{
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))
app.get("/register",checkNotAuthenticated,  (req,res)=>{
    res.sendFile(__dirname+"/src/html/register.html");
})
app.get("/test",wrapper);
app.post("/register",checkNotAuthenticated,async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,12)
        //users.push({
            CreateUser({
            ID: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            IsInfiziert:false,
            IsArzt:false,
            IsAdmin:false
        })
        res.redirect("/login")
    } catch {
        res.redirect("/register")
    }
    console.log(users)
})

app.delete("/logout",(req,res)=>{
    req.logOut()
    res.redirect("/login")
})




function risikoFahrt(req,res,next){
   //1)
   ID=req.ID;
    /*[Datenbankschnittstelle Fahrt]*/ a=Fahrt.find(Fahrt.ID==ID)
    a.update(Risiko)=true
    //2)
    /*[Datenbankschnittstelle für GastFahrten]*/ b=GastFahrten.find(FahrtID=a.ID)
    for(x in b){
        /*[Datenbankschnittstelle für User]*/ User.find(x.GastID).IsInfiziert=true;
        mail({
            from: 'noreply@meinedomain.com',
            to: User.Email,
            subject: 'Teilnahme an eine Risikofahrt',
            content: 'Sie sind möglicherweise Infiziert! Bitte machen Sie einen Test!'
        },
        function(err,response){
           if(err){
              console.log(err);
           }
           console.dir(response);
     });
    }
    return next();
}



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }

    req.session.save(() => {res.redirect("/login")})
  }


  
  function checkNotAuthenticated(req, res, next) {
      
    if (req.isAuthenticated()) {
        //https://github.com/jaredhanson/passport/issues/482
        req.session.save(() => {return res.redirect("/")})
    }
    next()
  }
  function wrapper(req,res,next){
      var a,b;
      testa(req,res,next);

    
  console.log(a,b);


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
  async function testa(req,res,next){
    DbUser.find({ name: {$regex:"^A"}} ).
    then(DbUsers => {              
      console.log(DbUsers[0].name); // 'A'
      res.send(DbUsers);
      return DbUser.find({ name:{$regex: "^B"} });
    }).
    then(DbUsers => {
      console.log(DbUsers[1].name); // 'B'
      res.send(DbUsers);
    });
  }
  function checkArzt(req,res,next){
    if(!(sessionStorage.getItem("IsArzt"))){
        req.redirect("/")
    }else{
    next();
    }
  }
  function checkAdmin(req,res,next){
    if(!(sessionStorage.getItem("IsAdmin"))){
        req.redirect("/")
    }else{
    next();
    }
  }
  function checkArzti(req,res,next) {
      console.log(req.user.role)
      CreateUser({
        id: Date.now().toString(),
        name: "q",
        email: "q@q",
        password: 123456778,
        IsInfiziert:false,
        IsArzt:false,
        IsAdmin:false
      })
      sessionStorage.setItem("key", "value");
      sessionStorage.setItem("lala", "value");
      sessionStorage.setItem("los", "santos");
      console.log(sessionStorage.getItem("los"));
      //req.session.test={hallo:"welt"};
     // req.sessionStorage.set(val1)={val2:"val3"}
     // console.log(""+req.session.test);
     // console.log(""+console.req.sessionStorage)
      if(req.user.role==undefined) req.user.role="User"
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

