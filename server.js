var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var http = require('http').Server(app);
//var Cookies = require( "cookies" )
var io = require('socket.io')(http);
var moment = require('moment');
var db = require('./db.js');
var bodyParser = require('body-parser');
var _ = require('underscore');
var globalName;

//app.engine('.html', require('ejs').__express);
app.use(express.static(__dirname + '/client'));
app.set('views', __dirname + '/client');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());

exports.name = globalName;
var clientInfo = {};

// sends current users to provided socket
function sendCurrentUsers (socket) {
  var info = clientInfo[socket.id];
  var users = [];
  
  if (typeof info == 'undefined') {
    return;
  }
  
  Object.keys(clientInfo).forEach(function (socketId) {
    var userInfo = clientInfo[socketId];
    
    if (info.room == userInfo.room) {
      users.push(userInfo.name);
    }
  });
  
  socket.emit('message', {
    name: 'System',
    text: 'Current users: ' + users.join(', '),
    timestamp: moment().valueOf()
  });
}

io.on('connection', function (socket) {
  console.log('User connected via socket.io!');
  
  socket.on('message', function (message) {
    console.log('Message received from ' + message.name + ' at ' + message.time + ': ' + message.text);
    
    if (message.text == '@currentUsers') {
      sendCurrentUsers(socket);
    } else {
      message.timestamp = moment().valueOf();
      io.emit('message', message);
    }
  });
});

app.get('/chat', function (req, res) {
  res.render('chat',{title: "Chat Setup", user_name: globalName});
});

app.get('/whiteboard', function (req, res) {
  if (globalName) {
    res.render('whiteboard',{title: "Whiteboard", room:"whiteboard", user_name: globalName});
  } else {
    res.render('chat',{title: "Chat Setup", user_name: globalName});
  }
});

app.get('/whiteboard_vegas', function (req, res) {
  if (globalName) {
    res.render('whiteboard_vegas',{title: "Whiteboard - Vegas", room:"whiteboard_vegas", user_name: globalName});
  } else {
    res.render('chat',{title: "Chat Setup", user_name: globalName});
  }
});

app.get('/itinerary', function (req, res) {
  res.render('itinerary',{title: "Itinerary", user_name: globalName});
});

app.get('/contacts', function (req, res) {
  res.render('contacts',{title: "Emergency Contacts", user_name: globalName});
});

app.get('/lost', function (req, res) {
  res.render('lost',{title: "Lost?", user_name: globalName});
});

app.get('/uber', function (req, res) {
  res.render('uber',{title: "Request an Uber", user_name: globalName});
});

app.get('/', function(req, res){ 
 res.render('index',{title: "GEM Camp 3.0 - Home", user_name: globalName});
});

app.get('/buddy-tracker', function(req, res){ 
 res.render('buddy-tracker',{title: "Buddy Tracking", user_name: globalName});
});

app.post('/update_namevar', function(req, res){
  var body = _.pick(req.body, 'name');
  globalName = body.name;
  res.send();
});

// POST Whiteboard Items
app.post('/wbitems', function (req, res) {
  console.log('post item started');
  var body = _.pick(req.body, 'name', 'mtext');
  
  // verify data submission integrity
  if (!_.isString(body.name) || body.name.trim().length === 0 || !_.isString(body.mtext) || body.mtext.trim().length === 0) {
    return res.status(400).send();
  }
  
  body.mtext = body.mtext.trim();
  body.name = body.name.trim();
  
  // post data to the db
  db.wblist.create(body).then(function (wblist) {
      res.json(wblist.toJSON());
    }, function (e) {
      res.status(400).json(e);
  });
});

// GET 
app.get('/wball', function (req, res) {
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
  db.wblist.findAll({where: where, order: [['createdAt', 'DESC']]}).then(function (wblist) {
    res.json(wblist);
  }, function (e) {
    res.status(500).send();
  });
});

// POST Whiteboard Items
app.post('/wbitemsv', function (req, res) {
  console.log('post item started');
  var body = _.pick(req.body, 'name', 'mtext');
  
  // verify data submission integrity
  if (!_.isString(body.name) || body.name.trim().length === 0 || !_.isString(body.mtext) || body.mtext.trim().length === 0) {
    return res.status(400).send();
  }
  
  body.mtext = body.mtext.trim();
  body.name = body.name.trim();
  
  // post data to the db
  db.wblistv.create(body).then(function (wblistv) {
      res.json(wblistv.toJSON());
    }, function (e) {
      res.status(400).json(e);
  });
});

// GET WB Vegas
app.get('/wballv', function (req, res) {
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
  db.wblistv.findAll({where: where, order: [['createdAt', 'DESC']]}).then(function (wblistv) {
    res.json(wblistv);
  }, function (e) {
    res.status(500).send();
  });
});

// POST User Location for Buddy Tracker
app.post('/updateploc', function (req, res) {
  console.log('location update started');
  var body = _.pick(req.body, 'name', 'uloc', 'id', 'active');
  var attributes = {};
  
  if (!body.id) {
    // verify data submission integrity
    if (!_.isString(body.name) || body.name.trim().length === 0 || !_.isString(body.uloc) || body.uloc.trim().length === 0) {
      return res.status(400).send();
    }
    
    body.uloc = body.uloc.trim();
    body.name = body.name.trim();
    
    // post data to the db
    db.peopTable.create(body).then(function (peopTable) {
        res.json(peopTable.toJSON());
      }, function (e) {
        res.status(400).json(e);
    });
  } else {
    attributes.uloc = body.uloc;
    // update data to the db
    db.peopTable.findById(body.id).then(function (locData) {
      if (locData) {
        locData.update(attributes).then(function (locData){
          res.json(locData.toJSON());
        }, function (e) {
          res.status(400).json(e);
        });
      } else {
        res.status(404).send();
      }
    }, function () {
      res.status(500).send();
    });
  }
});

// GET User Location for Buddy Tracker
app.get('/getploc', function (req, res) {
  var dateEnd = new Date();
  
  var dateMod = dateEnd - 100000000;
  
  var dateStart = new Date (dateMod);
  
  var where = {
    updatedAt: {
      $between: [dateStart,dateEnd]
    }
  };
  
  // make call to db
  db.peopTable.findAll({where: where, order: [['updatedAt', 'DESC']]}).then(function (peopTable) {
    res.json(peopTable);
  }, function (e) {
    res.status(500).send();
  });
});

db.sequelize.sync().then(function () {
  http.listen(PORT, function () {
    console.log('Server started!');
  });
});