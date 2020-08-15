const mongodb = require('mongodb');
const app = express();

(async () => {

    try {
        // Use connect method to the mongo-client with the mongod-service
        //                      and attach connection and db reference to the app
        app.locals.dbConnection = await mongodb.MongoClient.connect("mongodb://mongodbservice:27017", { useNewUrlParser: true });
        app.locals.db = await app.locals.dbConnection.db("itemdb");
        console.log("Using db: " + app.locals.db.databaseName);
    } catch (error) {
        console.dir(error);
    }

})();