const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');

//Setting up express app
const app = express();

//To parse form data
app.use(bodyParser.urlencoded({
    extended: true
}));

//Setting up middleware
app.use(bodyParser.json());

//Setting up api routes root directory
app.use('/api', require('./routes/api'));
app.get('/yo',function(req,res){
    res.send("Hello");
});

exports.app = functions.https.onRequest(app);
