var express = require('express');
const mongoose = require('mongoose');
var ArztRouter=express.Router(),UserRouter=express.Router() ,AdminRouter = express.Router();
const Fahrt = require("./models/fahrt.model")
const app=express();
const { DbUser, validate } = require("./models/user.model")
const DbFahrt = require("./models/fahrt.model")
const DbGastFahrt= require("./models/gastfahrt.model");
const c = require('config');
//II)
ArztRouter.get("/FindUsers", function(req,res) {
    DbUser.find(function(err,DbUser) {
    res.send(DbUser);
    })
})
ArztRouter.post("/FindUserByID", function(req,res) {
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
ArztRouter.put("/SetUserRiskTrue", function(req, res) {
    DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: true }}, function(err, user) {
        if (err){
            res.send(err);
        }
         (user);
    });
})
ArztRouter.put("/SetUserRiskFalse", function(req, res) {
    DbUser.findOneAndUpdate({ID:req.body.ID}, { $set: { IsInfiziert: false }}, function(err, user) {
        if (err){
            res.send(err);
        }
        res.json(user);
    
    });
})

//I) Fahrt als Risiko markieren (Arzt)
ArztRouter.put("/SetFahrtRiskTrue", function (req, res) {SetFahrtRiskTrue(req.body.FahrtID)
})
    //finde Fahrt nach ID
    function SetFahrtRiskTrue(SentID){
    DbFahrt.findOneAndUpdate({ID:SentID}, { $set: { Risiko: true }}, function(err, fahrt) {
        if (err){
            res.send(err);
        }
        //setze Risiko=true
        
        //finde alle Mitfahrer
        DbGastFahrt.find({FahrtID:fahrt.FahrtID},function(err,DbGastFahrt) {
            res.send(DbGastFahrt);
            for(x in DbGastFahrt){
                //setze bei jedem IsInfiziert=true
                DbUser.findOneAndUpdate({ID:req.body.ID},{ $set: { IsInfiziert: true }},function(err,DbUser) {
                    res.send(DbUser);
                    })
            }
            })
    });
}


    ArztRouter.get("/FindRisikoFahrten", function(req,res) {
    DbFahrt.find({Risiko:true},function(err,DbFahrt) {
    res.send(DbFahrt);
    })
})

ArztRouter.get("/FindInfizierteUser", function(req,res) {
    DbUser.find({IsInfiziert:true},function(err,DbUser) {
    res.send(DbUser);
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
//III)
ArztRouter.post("/MarkAllFahrtenFromUserByName", function(req,res) {
    //FindeUserByName
    DbUser.findOne({name:req.body.name},function(err,DbUser) {
    b=DbUser;
    //Finde alle Fahren des Users

    DbGastFahrt.find({GastID:b.ID},function(err,DbGastFahrt) {
        a=DbGastFahrt;


        //Setze bei allen Fahrten des Users Risiko=true
        for(x in a){
            SetFahrtRiskTrue(x);
        }
        })
    })
})

ArztRouter.post("/FindUserByName", function(req,res) {
    DbUser.findOne({name:req.body.name},function(err,DbUser) {
    res.send(DbUser);
    })
})

ArztRouter.post("/FindFahrtenByUserID", function(req,res) {
    DbGastFahrt.find({GastID:req.body.ID},function(err,DbGastFahrt) {
    res.send(DbGastFahrt);
    })
})

ArztRouter.post("/SetManyFahrtenRisikoTrue", function(req,res) {
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
ArztRouter.post("/GetUsersFromManyFahrten", function(req,res) { 
    a=req.body.IDs
    c={};
    for(x in a){
        DbGastFahrt.find({GastID:req.body.ID},function(err,DbGastFahrt) {
            c={...c,DbGastFahrt};
            })
    }
    res.send(c);
})

ArztRouter.post("/SetManyUserRisikoTrueByUserID", function(req,res) {
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

//IV) Eine Fahrt nehmen (User)

//{Username,IDderFahrt(Nummer),einstiegszeit(String),endstation(String),liniennamen(String),Lat(Nummer),Long(Nummer),StationID(Nummer)}

UserRouter.post("/AddUserToFahrt", function(req,res) {AddUserToFahrt(req.body)})
function AddUserToFahrt(b){
    //ID,einstiegszeit,endstation,liniennamen,stationsname,Lat,Long,StationID
a=sessionStorage.getItem("ID");
    //User mit der ID hinzufügen
    DbUser.findOne({ID:a},function(err,DbUser) {
        //für den User a neue Fahrt anlegen, a wird aus dem SessionStorage geholt, die Informationen für b müssen übergeben werden.
        DbGastFahrt.create({
            ID:Date.now,
            GastID:a,
            FahrtID:b.FahrtID,
            einstiegszeit:b.einstiegszeit,
            endstation: b.endstation,
            liniennamen: b.liniennamen,
            stationsname: b.stationsname,
            Lat:b.Lat,
            Long:b.Long,
            StationID:b.StationID

        }, function(err, user) {
            if (err){
            res.send(err);
            }
            if(user) {
            res.json(user);
            }
        });
    })
}


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
//V) Bisherige Fahrten anzeigen (User)
UserRouter.get("/FindAllFahrten", function(req,res) {
    a=sessionStorage.getItem("ID");
    DbGastFahrt.find({GastID:a},function(err,DbUser) {
    res.send(DbUser);
    })
})

//VI) Alle Fahrten einsehen (Arzt)
ArztRouter.get("/FindAllFahrten", function(req,res) {
    DbFahrt.find(function(err,DbUser) {
    res.send(DbUser);
    })
})
module.exports.ArztRouter=ArztRouter;
module.exports.UserRouter=UserRouter;
module.exports.AdminRouter=AdminRouter;