var express = require('express');
const mongoose = require('mongoose');
var ArztRouter=express.Router(),UserRouter=express.Router() ,AdminRouter = express.Router();
const Fahrt = require("./models/fahrt.model")
const app=express();
const { DbUser, validate } = require("./models/user.model")
const DbFahrt = require("./models/fahrt.model")
const DbGastFahrt= require("./models/gastfahrt.model");
const c = require('config');
ArztRouter.get("/FindUsers", function(req,res) {
    DbUser.find(function(err,DbUser) {
    res.send(DbUser);
    })
})
ArztRouter.post("/FindUser", function(req,res) {
    DbUser.findOne({ID:req.body.ID},function(err,DbUser) {
    res.send(DbUser);
    })
})
//https://github.com/Sudarshan101/curlapinode/blob/master/server.js

//Create User
AdminRouter.post("/CreateUser", function(req,res) {
    DbUser.create(req.body,function(err,user){
        if (err){
           res.send(err);
        }
        if(user) {
           res.json(user);
        }})
})
//Update User
ArztRouter.put("/SetRiskTrue", function(req, res) {
    DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: true }}, function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    });
})
ArztRouter.put("/SetRiskFalse", function(req, res) {
    DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: false }}, function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    
    });
})
// Fahrt als Risiko markieren (Arzt)
ArztRouter.put("/SetFahrtRiskTrue", function(req, res) {
    DbFahrt.findOneAndUpdate({ID:req.body.ID}, { $set: { Risiko: true }}, function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    });
    ArztRouter.get("/FindRisikoFahrten", function(req,res) {
    DbFahrt.find({Risiko:true},function(err,DbFahrt) {
    res.send(DbFahrt);
    })
})

ArztRouter.get("/FindInfizierte", function(req,res) {
    DbUser.find({IsInfiziert:true},function(err,DbUser) {
    res.send(DbUser);
    })
})

})
ArztRouter.post("/FindRisikoFahrtenTeilnehmer", function(req,res) {
    DbGastFahrt.find({FahrtID:req.body.ID},function(err,DbGastFahrt) {
    res.send(DbGastFahrt);
    })
})

//Alle Fahrten eines Nutzers als Risiko markieren (in bestimmter Zeit) (Arzt)

/*router.post("/FindUser", function(req,res) {
    DbUser.findOne({ID:req.body.ID},function(err,DbUser) {
    res.send(DbUser);
    })
})*/

ArztRouter.post("/FindUserByName", function(req,res) {
    DbUser.findOne({name:req.body.name},function(err,DbUser) {
    res.send(DbUser);
    })
})

ArztRouter.post("/FindUserFahrten", function(req,res) {
    DbGastFahrt.find({GastID:req.body.ID},function(err,DbGastFahrt) {
    res.send(DbGastFahrt);
    })
})

ArztRouter.post("/SetManyFahrtRisikoTrue", function(req,res) {
    a=req.body.IDs
    for(x in a){
        DbFahrt.findOneAndUpdate({ID:x}, { $set: { Risiko: true }}, function(err, user) {
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    }
})
ArztRouter.post("/GetUsersFromManyFahrten", function(req,res) { //???????????????????????????????????????????????????????????????????
    a=req.body.IDs
    c={};
    for(x in a){
        DbGastFahrt.find({GastID:req.body.ID},function(err,DbGastFahrt) {
            c={...c,DbGastFahrt};
            })
    }
    res.send(c);
})

ArztRouter.post("/SetManyUserRisikoTrue", function(req,res) {
    a=req.body.IDs
    for(x in a){
        DbUser.findOneAndUpdate({ID:x}, { $set: { IsInfiziert: true }}, function(err, user) {
            if (err){
                res.send(err);
            }
            res.json(user);
        });
    }
})

//Eine Fahrt nehmen (User)

//{Username,IDderFahrt(Nummer),einstiegszeit(String),endstation(String),liniennamen(String),Lat(Nummer),Long(Nummer),StationID(Nummer)}
UserRouter.post("/AddUserToFahrt", function(req,res) {
    a={};
    DbUser.findOne({name:req.body.name},function(err,DbUser) {
    a=DbUser;
    })
    b=a.ID;
    DbGastFahrt.create({
        ID:Date.now,
        GastID:b,
        FahrtID:req.body.FahrtID,
        einstiegszeit:req.body.einstiegszeit,
        endstation: req.body.endstation,
        liniennamen: req.body.liniennamen,
        stationsname: req.body.stationsname,
        Lat:req.body.Lat,
        Long:req.body.Long,
        StationID:req.body.StationID

    }, function(err, user) {
        if (err){
           res.send(err);
        }
        if(user) {
           res.json(user);
        }
});
})

//ID(Number,required,unique),Risiko(Boolean,required),endstation(String),liniennamen(String)

UserRouter.post("/AddFahrt", function(req,res) {
    DbGastFahrt.create({
        ID:req.body.ID,
        Risiko:req.body.Risiko,
        endstation:req.body.endstation,
        einstiegszeit:req.body.einstiegszeit,
        liniennamen: req.body.liniennamen,

    }, function(err, user) {
        if (err){
        res.send(err);
        }
        if(user) {
        res.json(user);
        }
    });
})
//Bisherige Fahrten anzeigen (User)
UserRouter.get("/FindAllFahrten", function(req,res) {
    DbGastFahrt.find({GastID:req.body.ID},function(err,DbUser) {
    res.send(DbUser);
    })
})

//Alle Fahrten einsehen (Arzt)

ArztRouter.get("/FindAllFahrten", function(req,res) {
    DbFahrt.find(function(err,DbUser) {
    res.send(DbUser);
    })
})
module.exports.ArztRouter=ArztRouter;
module.exports.UserRouter=UserRouter;
module.exports.AdminRouter=AdminRouter;