//https://www.youtube.com/watch?v=Ud5xKCYQTjM
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config()

}
const express = require('express')
const app= express()
const bcrypt = require("bcrypt");
const users=[]
const passport = require("passport")
const session = require("express-session")
const flash = require("express-flash")
const methodOverride = require("method-override")
const mongoose = require("mongoose");
const mail = require('sendmail')();

//connect to mongodb
mongoose
    .connect("mongodb://127.0.0.1:27017/corona-app", { useNewUrlParser: true , useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB..."))
    .catch(err => console.error("Could not connect to MongoDB..."));

//initialzie Passport
//lalala
const initializePassport = require("./passport-config");
const { User } = require("./models/user.model");
initializePassport(
    passport,
    name=> users.find(user => user.name === name),
    id => users.find(user => user.id === id)
    )

app.use(express.urlencoded({extended:false}))
//app.use("/", express.static(__dirname + "/src/html"));


app.use(flash())
app.use(session({
    secret: process.env.SEISSION_SECRET,
    resave:false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride("_method"))

app.get('/',checkAuthenticated,checkArzt,checkArzt,(req,res)=>{
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
app.post("/register",checkNotAuthenticated,async (req,res)=>{
    try{
        const hashedPassword = await bcrypt.hash(req.body.password,12)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
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

  function checkArzt(req,res,next) {
      console.log(req.user.role)
      if(req.user.role==undefined) req.user.role="User"
      req.session.save();
      next();
  }
  /*  function allowAdmins(req, res, next) {
        if (req.user.role === 'Admin') return next();
        res.redirect('/user-login');
      }
      
      function allowRegular(req, res, next) {
        if (req.user.role === 'Regular') return next();
        res.redirect('/admin-login');
      }*/

app.listen(3000)