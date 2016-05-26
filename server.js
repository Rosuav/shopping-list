var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
	this.items = [];
	this.id = 0;
};

Storage.prototype.add = function(name) {
	var item = {name: name, id: this.id};
	this.items.push(item);
	this.id += 1;
	return item;
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
	res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400);
	}

	var item = storage.add(req.body.name);
	res.status(201).json(item);
});

app.delete('/items/:id', jsonParser, function(req, res) {
	if (!req.body) {
		return res.sendStatus(400);
	}
	for (var i=0; i<storage.items.length; ++i) {
		if (storage.items[i].id == req.params.id) {
			storage.items.splice(i, 1);
			res.status(204).end();
			return;
		}
	}

	res.status(404).json({error: "No item with that id found"});
});

app.put('/items/:id', jsonParser, function(req, res) {
	//What happens if req.body.id doesn't match req.params.id??
	if (!req.body) {
		return res.sendStatus(400);
	}
	for (var i=0; i<storage.items.length; ++i) {
		if (storage.items[i].id == req.params.id) {
			storage.items[i].name = req.body.name;
			res.status(204).end();
			return;
		}
	}

	var item = {name: req.body.name, id: +req.params.id};
	storage.items.push(item);
	res.status(201).json(item);
});

app.listen(process.env.PORT || 8800);

exports.app = app;
exports.storage = storage;
