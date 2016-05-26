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
		console.log("id: "+storage.items[i].id);
		if (storage.items[i].id == req.params.id) {
			storage.items.splice(i, 1);
			res.status(204).end();
			return;
		}
	}

	res.status(404).json({error: "No item with that id found"});
});

app.listen(process.env.PORT || 8800);
