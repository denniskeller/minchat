var express = require('express');
var events = require('events');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.text());

var newMsg = new events.EventEmitter();
var msgs = [];

app.post('/msg', function(req, res) {
	res.sendStatus(204);
	if (req.body !== "") {
		msgs.push(req.body);
		newMsg.emit('newmsg', req.body);
	}
});

app.get('/msg/:n', function(req, res) {
	var n = parseInt(req.params.n);
	if (n < msgs.length) {
		res.setHeader('Content-Type', 'text/plain');
		res.send(msgs[n]);
	} else if (n == msgs.length) {
		res.setTimeout(24*3600*1000);
		newMsg.once('newmsg', function(msg) {
			res.setHeader('Content-Type', 'text/plain');
			res.send(msg);
		});
	} else {
		res.sendStatus(404);
	}
});

app.get('/', function(req, res) {
	res.sendFile('index.html', { root: __dirname });
});

var server = app.listen(process.env.PORT || 8080);