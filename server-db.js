var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Todo API Root');
});

// GET /todos?completed=true&q=house
app.get('/todos', function (req, res) {
  var query = req.query;
  var where = {};
  
  // set up where parameters
  if (query.hasOwnProperty('completed') && query.completed == 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed == 'false') {
    where.completed = false;
  } else if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }
  
  // make call to db
  db.todo.findAll({where: where}).then(function (todos) {
    res.json(todos);
  }, function (e) {
    res.status(500).send();
  });
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  
  db.todo.findById(todoId).then(function (todo) {
    if (!!todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function (e) {
    res.status(500).send();
  });
});

// POST todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed');
  
  // verify data submission integrity
  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send();
  }
  
  body.description = body.description.trim();
  
  // post data to the db
  db.todo.create(body).then(function (todo) {
      res.json(todo.toJSON());
    }, function (e) {
      res.status(400).json(e);
  });
});

// DELETE todos
app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  
  db.todo.destroy({ where: { id: todoId } }).then(function (rowsDeleted) {
    if (rowsDeleted == 0) {
      res.status(404).json({
        error: 'No todo with id'
      });
    } else {
      res.status(204).json();
    }
  }, function () {
    res.status(500).send();
  });
});

// UPDATE todos
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, 'description', 'completed');
  var attributes = {};
  
  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }
  
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description.trim();
  }
  
  db.todo.findById(todoId).then(function (todo) {
    if (todo) {
      todo.update(attributes).then(function (todo){
        res.json(todo.toJSON());
      }, function (e) {
        res.status(400).json(e);
      });
    } else {
      res.status(404).send();
    }
  }, function () {
    res.status(500).send();
  });
  
});

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log('Express listening on port ' + PORT + '!');
  });
});