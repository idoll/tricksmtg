var express = require("express");
var app = express();
app.use(express.logger());
// getting-started.js
var mongoose = require('mongoose');
mongoose.connect('mongodb://idoll:temppw@dharma.mongohq.com:10054/app16467904');

app.get('/', function(request, response) {
  response.send('Welcome to the Magic Card Webservice');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});