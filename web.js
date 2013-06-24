var application_root = __dirname;
var express = require("express");
var app = express();
var path = require("path")
app.use(express.logger());
// getting-started.js
var mongoose = require('mongoose');
var cardSchema = new mongoose.Schema({
		  layout:  String,
		  types: [{type: String, trim:true}],
		  colors: [{type: String, trim:true}],
		  multiverseid: Number,
		  name: String,
		  cmc: Number,
		  rarity: String,
		  arist: String,
		  manaCost: String,
		  text: String,
		  number: String,
		  imageName: String,
		  code: String
		 });
module.exports = mongoose.model('mtgcards', cardSchema);

var uristring = process.env.MONGOLAB_URI || 
  process.env.MONGOHQ_URL

mongoose.connect(uristring, function (err, res) {
  if (err) { 
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var Cards = mongoose.model('mtgcards');

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/api/cards/', function (req, res){
  Cards.find(function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/name/:name', function (req, res){
    Cards.find({name:req.params.name}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/type/:type', function (req, res){
    Cards.find({type:req.params.type}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/cmc/gt/:cmc', function (req, res){
    Cards.find({cmc:{$gt : req.params.cmc}}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/cmc/lt/:cmc', function (req, res){
    Cards.find({cmc:{$lt : req.params.cmc}}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/cmc/:cmc', function (req, res){
    Cards.find({cmc: req.params.cmc}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/code/:code', function (req, res){
	var sets = req.params.code.split(',');
	console.log(req.params.code);
    Cards.find({code: { $in : sets } }, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/cards/code/:code/types/:types/cmc/:cmc', function (req, res){
	var sets = req.params.code.split(',');
	var types = req.params.types.split(',');
    Cards.find({code: { $in : sets } , types: {$in : types}, cmc: {$lt : req.params.cmc+1}}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  });
});

app.get('/api/availableTricks/:code/:manaCost', function (req, res){
	var sets = req.params.code.split(',');
	var manaCosts = req.params.manaCost.split(',');
	var cmc = 0;
	/*^({[0-9X]+})*(|({R}){1,2}|({B}){1,2}){1,2}$*/
	var regexs = '^({[0-9X]+})*('
	for(var i=0; i < manaCosts.length; i++)
	{
		var length = manaCosts[i].length;
		if(length < 2)
		{
			cmc += 1;
			regexs += "|({" + manaCosts[i].charAt(0) + "}){1,1}"
		}
		else if (length = 2)
		{
			cmc += parseInt(manaCosts[i].charAt(0));
			regexs += "|({" + manaCosts[i].charAt(1) + "}){1," + manaCosts[i].charAt(0) + "}"
		}
	}
	regexs += "){1," + manaCosts.length + "}$"
	console.log(regexs + " " + cmc)
    Cards.find({code: { $in : sets } , types: "Instant", cmc: {$lt : cmc+1}, manaCost: {$regex: regexs}}, function (err, mtgcards) {
    if (!err) {
      res.send(mtgcards);
    } else {
      console.log(err);
    }
  	});
});


var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
