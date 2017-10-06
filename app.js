//import express package
var express = require("express");
//import mongodb package
var mongodb = require("mongodb");
var path = require('path');

//Plotly
var charts = require('plotly')('vidhya0406', 'PJQCBSWERHz3XdRzMggK');

//MongoDB connection URL - mongodb://host:port/dbName
var dbHost = "mongodb://test:test@ds037195.mlab.com:37195/cryptocurrency";
var dbObject;
var MongoClient = mongodb.MongoClient;
MongoClient.connect(dbHost, function(err, db){
  if ( err ) throw err;
  dbObject = db;
});

// function to grab and format data from mongodb collection
function getData(responseObj){
  dbObject.collection("cryptocurs").find({}).toArray(function(err, data){
    if ( err ) throw err;
    var dateArray = [];
    var amountArray = [];

    //Loop through the entires and grab the data
    for (index in data){
      var entry = data[index];
      var date = entry['date'];
      var amount = entry['amount'];

      //push data to the arrays for plotting
      dateArray.push(date);
      amountArray.push(amount);
    }

    //Dataset for plotting
    var dataset = [
      {
        x : dateArray,
        y: amountArray,
        type: "scatter"

      }
    ];

    var response = {
          "dataset" : dataset,
        };
    responseObj.json(response);
  });
}

//create express app
var app = express();

//NPM Module to integrate Handlerbars UI template engine with Express
var exphbs  = require('express-handlebars');

//Declaring Express to use Handlerbars template engine with main.handlebars as
//the default layout
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
//view configs
app.use('/public', express.static('public'));
app.get("/getPrices", function(req, res){
  getData(res);
});
app.get("/", function(req, res){
  res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(3300);
