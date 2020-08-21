
"use strict";

const express = require("express");
var cookieParser= require("cookie-parser")

const app = express();
const port = 3000;

app.use(cookieParser())
//https://expressjs.com/en/resources/middleware/cookie-parser.html
app.use(express.urlencoded({ extended: true }));

// middleware for handling json request data
// https://expressjs.com/en/4x/api.html#express.json
app.use(express.json());
app.use("/src", express.static(__dirname + "/src"));
app.use('/user',express.static(__dirname+"/src/html/user"));
app.use("/arzt",express.static(__dirname+"/src/html/arzt"));
app.use('/jquery', (req,res)=> { res.sendFile(__dirname+"/node_modules/jquery/dist/jquery.min.js"); });
app.use('/leaflet', express.static(__dirname+'/node_modules/leaflet/dist'));
app.use('/leaflet-draw', express.static(__dirname+'/node_modules/leaflet-draw/dist'));
app.use('/bootstrap', express.static(__dirname+'/node_modules/bootstrap/dist'));
app.use('/leaflet-heat',(req,res)=> { res.sendFile(__dirname+'/node_modules/leaflet.heat/dist/leaflet-heat.js'); });

app.get("/", (req, res) => { res.sendFile(__dirname + "/index.html"); });

//auth,openRouter https://expressjs.com/en/5x/api.html


var server = app.listen(port, () => console.log("listening on port " + port + "!"));


const mongodb = require('mongodb');
// const mongoose = require('mongoose');
// //https://www.npmjs.com/package/mongoose
//
//
// (async () => {
//     await mongoose.connect('mongodb://mongodbservice:27017/corona-bus', {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     });
//
// })();

(async () => {

    try {
        // Use connect method to the mongo-client with the mongod-service
        //                      and attach connection and db reference to the app
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true });
        app.locals.db = await app.locals.dbConnection.db("corona-bus");
        console.log("Using db: " + app.locals.db.databaseName);
    } catch (error) {
        console.dir(error);
    }

    //mongo.close();

})();

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