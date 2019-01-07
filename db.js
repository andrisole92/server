// const MongoClient = require('mongodb').MongoClient;
const mongoose = require("mongoose");
const User = require("./models/user");
const url = "mongodb://localhost:27017/mydb";
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     const dbo = db.db("mydb");
//     const myobj = { name: "Company Inc"};
//     dbo.collection("user").insertOne(myobj, function(err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

mongoose.connect(url);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
    console.log('we are connected');
    const user = new User({ name: 'Silence' });
    console.log(user.name);
});

module.exports = db;