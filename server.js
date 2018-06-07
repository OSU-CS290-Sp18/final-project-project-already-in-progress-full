

var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('*', function (req, res, next) {
	console.log('== got a request');
	console.log(' -- method:', req.method);
	console.log(' --url:', req.url);
	next();
});

app.use(express.static('public'));

app.get('*', function (req, res) {
	res.status(404).render('404Page');
});

app.listen(port, function () {
	console.log('== Server is listening on port', port);
});