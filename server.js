var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var mongoHost = process.env.MONGO_HOST || "classmongo.engr.oregonstate.edu";
// var mongoPort = process.env.MONGO_PORT || '27017';
var mongoPort = '27017';
var mongoUsername = process.env.MONGO_USERNAME || "cs290_caperss";
var mongoPassword = process.env.MONGO_PASSWORD || "cs290_caperss";
var mongoDBName = process.env.MONGO_DB_NAME || "cs290_caperss";

var mongoURL = "mongodb://" +
	mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":"
	+ mongoPort + "/" + mongoDBName;

var mongoDB = null;

var app = express();
var port = process.env.PORT || 13276;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// app.use(bodyParser.json());

app.use(express.static('public'));

app.get('*', function (req, res, next) {
	console.log('== got a request');
	console.log(' -- method:', req.method);
	console.log(' -- url:', req.url	);
	next();
});

app.get('/', function (req, res, next) {
	res.status(200).render('homePage');
});

app.get('/environments/', function (req, res, next) {
	var environmentsCollection = mongoDB.collection('environments');
	environmentsCollection.find().toArray(function (err, environments) {
		if (err) {
			res.status(500).send("Error fetching environments from DB.");
		} else {
				res.status(200).render('environmentsPage', {
					environments: environments,
					environmentsList: true
				});
		}
	});
});

app.get('/environments/:environment', function (req, res, next) {
	var environment = req.params.environment.toLowerCase();
	var environmentsCollection = mongoDB.collection('environments');
	environmentsCollection.find({ environment: environment }).toArray(function (err, environmentDocs) {
		if (err) {
			res.status(500).send("Error fetching environment from DB.");
		} else if (environmentDocs.length > 0) {
			res.status(200).render('environmentsPage', environmentDocs[0]);
		} else {
			next();
		}
	});
});

app.post('/environtments/:environtment/addMap', function (req,res,next) {
	var environment = req.params.environment.toLowerCase();
	if (req.body && req.body.caption && req.body.canvas) {
		var map = {
			caption: req.body.caption,
			mapData: req.body.mapData // CHECK THIS CODE
		};
		var mapsCollection = mongoDB.collection('maps');
		mapsCollection.updateOne(
			{ environmentId: environment },
			{ $push: { maps: map } },
			function (err, result) {
				if (err) {
					res.status(500).send("Error inserting map into DB.");
				} else {
					console.log("== mongo insert result:", result);
					res.status(200).end();	
				}
			}
		);
	} else {
		res.status(400).send("Request needs a JSON body with caption and map");
	}
});

app.get('/search', function (req, res, next) {
	res.status(404).render('404Page', {
		error404: false
	});
	console.log('  ~~ invalid destination');
});

app.get('*', function (req, res) {
	res.status(404).render('404Page', {
		error404: true
	});
	console.log('  ~~ invalid destination');
});

MongoClient.connect(mongoURL, function (err, client) {
	if (err) {
		throw err;
	}
	mongoDB = client.db(mongoDBName);
	app.listen(port, function () {
		console.log('== Server is listening on port', port);
	});
});
