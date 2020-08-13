// routes for get, post, put, and delete

//if(Validation(req.seissionID)) else return;


app.get("/api/", (req, res) => {
    // find all
    app.locals.db.collection('item').find({}).toArray((error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});

app.get("/api/item", (req, res) => {
    // find item
    console.log("get item " + req.query._id);
    app.locals.db.collection('item').find({_id:new mongodb.ObjectID(req.query._id)}).toArray((error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});

app.post("/api/item", (req, res) => {
    // insert item
    console.log("insert item "+JSON.stringify(req.body));
    app.locals.db.collection('item').insertOne(req.body, (error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});

app.put("/api/item", (req, res) => {
    // update item
    console.log("update item " + req.body._id);
    let id = req.body._id;
    delete req.body._id;
    console.log(req.body); // => { name:req.body.name, description:req.body.description }
    app.locals.db.collection('item').updateOne({_id:new mongodb.ObjectID(id)}, {$set: req.body}, (error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});

app.delete("/api/item", (req, res) => {
    // delete item
    console.log("delete item " + req.body._id);
    let objectId = "ObjectId(" + req.body._id + ")";
    app.locals.db.collection('item').deleteOne({_id:new mongodb.ObjectID(req.body._id)}, (error, result) => {
        if(error){
            console.dir(error);
        }
        res.json(result);
    });
});