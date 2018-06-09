var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var MongoClient = require('mongodb').MongoClient;

var app = express();
// var port = process.env.PORT || 3000;
var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoGBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" +
	mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":"
	+ mongoPort + "/" + mongoDBName;

var mongoDB = null;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('*', function (req, res, next) {
	console.log('== got a request');
	console.log(' -- method:', req.method);
	console.log(' --url:', req.url);
	next();
});

app.use(express.static('public'));

 // Add pages to render here

app.get('*', function (req, res) {
	res.status(404).render('404Page');
});

app.listen(port, function () {
	console.log('== Server is listening on port', port);
});