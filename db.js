var express = require('express');
const mongoose = require('mongoose');
const { DbUser, validate } = require("./models/user.model")
const {DbFahrt }= require("./models/fahrt.model")
const {DbGastFahrt}= require("./models/gastfahrt.model");
var ArztRouter=express.Router(),UserRouter=express.Router() ,AdminRouter = express.Router();
const Fahrt = require("./models/fahrt.model")
const app=express();
const sessionStorage= require("node-sessionstorage");

ArztRouter.use(express.json());
ArztRouter.use(express.urlencoded({ extended: false }))
UserRouter.use(express.json());
UserRouter.use(express.urlencoded({ extended: false }))
AdminRouter.use(express.json());
AdminRouter.use(express.urlencoded({ extended: false }))
//II)
ArztRouter.get("/FindUsers", async function(req,res,next) {
    await DbUser.find(function(err,DbUser) {
    res.send(DbUser);
    })
})
ArztRouter.post("/FindUserByID", async function(req,res,next) { //http post http://localhost:3000/arzt/FindUserByID ID=1600866993418
    //await DbUser.findOne({ID:req.body.ID},function(err,DbUser) {
  //  res.send(DbUser);
   // }) async (ID) => { return await FindUserByID(ID) }        return await DbUser.findOne({ ID: ID }).exec();
    const a = await DbUser.findOne({ID:req.body.ID}).exec();
    res.send(a);
   next()
})
//https://github.com/Sudarshan101/curlapinode/blob/master/server.js



//Create   http post http://localhost:3000/Admin/CreateUser name="Bron Cena" ID=244423 email=asd@asd password=12313 IsAdmin=false IsArzt=false IsInfiziert=false
AdminRouter.post("/CreateUser", function(req,res,next) {
    DbUser.create(req.body,function(err,user){
        if (err){
           //res.send(err);
        }
        if(user) {
           res.json(user);
        }})
        next();
})
AdminRouter.post("/CreateFahrt", function(req,res,next) {
    DbFahrt.create(req.body,function(err,user){
        if (err){
           //res.send(err);
        }
        if(user) {
           res.json(user);
        }})
        next();
})
ArztRouter.put("/SetUserRiskTrue", async function(req, res,next) { //http put http://localhost:3000/Arzt/SetUserRiskTrue ID=244423
    a= await DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: true }}, function(err, user) {
        if (err){
            res.send(err);
        }
        
    });
    res.json(a);
    next();
})
ArztRouter.put("/SetUserRiskFalse", async function(req, res,next) { //http put http://localhost:3000/Arzt/SetUserRiskFalse ID=244423
    a = await DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: false }}, function(err, user) {
        if (err){
            res.send(err);
        }
        //res.json(user);
    
    });
    res.json(a);
    next();
})


//Fahrt hinzufügen
//ID(Number,required,unique),Risiko(Boolean,required),endstation(String),liniennamen(String)
//http post localhost:3000/user/AddFahrt ID=123341 FahrtID=123456 Risiko=false endstation="Hüttenberg", liniennamen="TolleLinie"
UserRouter.post("/AddFahrt", async function(req,res,next) {
    a= sessionStorage.getItem("ID");
    req.body={GastID:a,...req.body};
    a= await DbGastFahrt.create(req.body,function(err,user){
        if (err){
       // res.send(err);
        }
        if(user) {
         //res.json(user);
        }})
        res.send(a);
        next();
})

//I) Fahrt als Risiko markieren (Arzt)
ArztRouter.put("/SetFahrtRiskTrue",async function (req, res,next) {SetFahrtRiskTrue(req.body.FahrtID); next();
})
    //finde Fahrt nach ID
    //setze Risiko=true
    async function SetFahrtRiskTrue(SentID){
   a= await DbFahrt.findOneAndUpdate({FahrtID:SentID}, { $set: { Risiko: true }},{new:true});

        
        //finde alle Mitfahrer
       b= await DbGastFahrt.find({FahrtID:a.FahrtID}).exec()
            
            for(x in b){
                //setze bei jedem IsInfiziert=true
                await DbUser.findOneAndUpdate({ID:req.body.ID},{ $set: { IsInfiziert: true }}).exec()
            }
            
    
}


    ArztRouter.get("/FindRisikoFahrten", async function(req,res,next) {
    a=await DbFahrt.find({Risiko:true},{new:true}).exec();
    res.send(a);
    next();
})

ArztRouter.get("/FindInfizierteUser", async function(req,res,next){
    a= await DbUser.find({IsInfiziert:true},{new:true}).exec();
    res.send(a);
    next();
})


ArztRouter.post("/FindRisikoFahrtenTeilnehmer",async function(req,res,next) {
    a=await DbGastFahrt.find({FahrtID:req.body.ID},{new:true});
    res.send(a);
    next();
})

//Alle Fahrten eines Nutzers als Risiko markieren (in bestimmter Zeit) (Arzt)

/*router.post("/FindUser", function(req,res) {
    DbUser.findOne({ID:req.body.ID},function(err,DbUser) {
    res.send(DbUser);
    })
})*/
//III)
ArztRouter.post("/MarkAllFahrtenFromUserByName",async function(req,res,next) {
    //FindeUserByName
    b= await DbUser.findOne({name:req.body.name},{new:true}).exec();
    //Finde alle Fahren des Users

    a= awaitDbGastFahrt.find({GastID:b.ID},{new:true}).exec();


        //Setze bei allen Fahrten des Users Risiko=true
        for(x in a){
            await SetFahrtRiskTrue(x);
        }
        next();
})

ArztRouter.post("/FindUserByName", async function(req,res,next) {
    a= await DbUser.findOne({name:req.body.name},{new:true}).exec();
    res.send(a);
    next();

})

ArztRouter.post("/FindFahrtenByUserID",async function(req,res,next) {
   a= await DbGastFahrt.find({GastID:req.body.ID},{new:true}).exec();
   res.send(a);
   next();
})

ArztRouter.post("/SetManyFahrtenRisikoTrue",async function(req,res,next) {
    a=req.body.IDs
    for(x in a){
        await DbFahrt.findOneAndUpdate({ID:x}, { $set: { Risiko: true }},{new:true}).exec();
    }
    next();
})
ArztRouter.post("/GetUsersFromManyFahrten", async function(req,res,next) { 
    a=req.body.IDs
    c={};
    for(x in a){
        d= await DbGastFahrt.find({GastID:req.body.ID},{new:true}).exec();
            c={...c,d};
    }
    res.send(c);
    next();
})

ArztRouter.post("/SetManyUserRisikoTrueByUserID", async function(req,res,next) {
    a=req.body.IDs
    for(x in a){
        await DbUser.findOneAndUpdate({ID:x}, { $set: { IsInfiziert: true }},{new:true}).exec();
        }
    next();
})

//IV) Eine Fahrt nehmen (User)

//{Username,IDderFahrt(Nummer),einstiegszeit(String),endstation(String),liniennamen(String),Lat(Nummer),Long(Nummer),StationID(Nummer)}

UserRouter.post("/AddUserToFahrt", async function(req,res) { await AddUserToFahrt(req.body)})
async function AddUserToFahrt(b){
    //ID,einstiegszeit,endstation,liniennamen,stationsname,Lat,Long,StationID
    a=sessionStorage.getItem("ID");
    //User mit der ID hinzufügen
        //für den User a neue Fahrt anlegen, a wird aus dem SessionStorage geholt, die Informationen für b müssen übergeben werden.
        c={GastID:a,...b}
            d=await DbGastFahrt.create(c,{new:true}).exec();

            res.send(d);
                next();
    
}



//V) Bisherige Fahrten anzeigen (User)
UserRouter.get("/FindAllFahrten", async function(req,res) {
    a=sessionStorage.getItem("ID");
    b=await DbGastFahrt.find({GastID:a},{new:true}).exec();
    res.send(b);
})

//VI) Alle Fahrten einsehen (Arzt)
ArztRouter.get("/FindAllFahrten", async function(req,res) {
    a= await DbFahrt.find().exec();
    res.send(a);
})


module.exports.ArztRouter=ArztRouter;
module.exports.UserRouter=UserRouter;
module.exports.AdminRouter=AdminRouter;