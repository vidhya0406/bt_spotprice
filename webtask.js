var express    = require('express');
var Webtask    = require('webtask-tools');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Client = require('coinbase').Client;

//Coinbase 
var client = new Client({
  'apiKey': API_KEY,
  'apiSecret': API_SECRET,
  'version':'2017-10-06'
});
currencyCode = 'CAD'  // can also use EUR, CAD, etc


//Mongoose Schema and model

var currencySchema = new mongoose.Schema({
  amount: Number,
  date: { type: Date, default: Date.now }
});
var cryptoCur = mongoose.model('cryptoCur', currencySchema);


var app = express();

app.use(bodyParser.json());

app.post('/', function (req, res) {
  client.getSpotPrice({'currency': currencyCode}, function(err, price) {
    mongoose.connect(DB_URL');
    var newPrice = cryptoCur({'amount': price.data.amount}).save(function(err,data){
     if (err) throw err;
     res.json(data);
   });
   
});  
});

module.exports = Webtask.fromExpress(app);
