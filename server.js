//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var mongodb = require("mongodb");
var bodyParser = require("body-parser")
var bcrypt = require("bcryptjs")
var jwt = require('jwt-simple');
var JWT_SECRET = "5r6qwer4sd56f46dsa65f4a6w8esd5f4";
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var mongoClient = mongodb.MongoClient;
var io = socketio.listen(server);

// Connection url
var url = 'mongodb://trader:1234@ds145780.mlab.com:45780/demoguardianapp';
// Connect using MongoClient
var db = null;
var signals = [];
mongoClient.connect(url, function(err, dbconn) {
  if(!err)
  {
    console.log("Conectado a mongodb SI");
    db = dbconn;
    db.collection('signals',function(err,signalsCollection){
      signalsCollection.find({}).toArray(function(err,signalslist){  //What's the correct callback synatax here?
          signals = signalslist;
          console.log(signals);
      }); //find
    });
  }
  else
  {
    console.log("NOOOO");
  }
});

router.use(bodyParser.json());

router.use(express.static(path.resolve(__dirname, 'client')));

router.post('/users',function(req,res,next){
  db.collection('users',function(err,usersCollection){
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
          var newUser = {
          username:req.body.username,
          password:hash,
          nombre:req.body.nombre,
          apellidos:req.body.apellidos,
          pais:req.body.pais,
          telefono:req.body.telefono,
          email:req.body.email,
          f_nacimiento: req.body.f_nacimiento,
          genero:req.body.genero,
          divisa:req.body.divisa,
          apalancamiento:req.body.apalancamiento,
          saldo:req.body.saldo
          }
          usersCollection.insert(newUser, {w:1}, function(err){
              res.send();
          });
      });
    });
  });
});

router.put('/users/signin',function(req,res,next){
  db.collection('users',function(err,usersCollection){
    //Se obtiene el usuario de la base de datos
    usersCollection.find({username:req.body.username}).limit(1).toArray(function(err,user){
      if (typeof user[0] !== 'undefined') {
          console.log(user[0].password);
          console.log(req.body.password);
          //Se compara la clave sin cifrar con el hash de la bd
          bcrypt.compare(req.body.password, user[0].password, function(err, compresult) {
              if(compresult){
                var userToken = jwt.encode(user[0].password, JWT_SECRET);  
                res.send({token:userToken});
              }else{
                res.status(400).send();
              }
          });
      }else{
        res.status(400).send();
      }
    }); 
  });
});

router.get('/traders', function(req, res, next){
  
    db.collection('traders',function(err,tradersCollection){
      tradersCollection.find({}).toArray(function(err,traders){  //What's the correct callback synatax here?
          return res.send(traders);
      }); //find
    });
      
});

var messages = [];
var sockets = [];

io.on('connection', function (socket) {
    messages.forEach(function (data) {
      socket.emit('message', data);
    });
    signals.forEach(function (data) {
      socket.emit('signal', data);
    });

    sockets.push(socket);

    socket.on('disconnect', function () {
      sockets.splice(sockets.indexOf(socket), 1);
      updateRoster();
    });

    socket.on('signal',function(alertaRecibida){
      console.log(alertaRecibida);
      signals.push(alertaRecibida);
      io.sockets.emit('signal',alertaRecibida);
    });
    
    socket.on('message', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text,
          destacado: false
        };

        broadcast('message', data);
        messages.push(data);
      });
    });
    
    socket.on('message2', function (msg) {
      var text = String(msg || '');

      if (!text)
        return;

      socket.get('name', function (err, name) {
        var data = {
          name: name,
          text: text,
          destacado: true
        };

        broadcast('message', data);
        messages.push(data);
      });
    });

    socket.on('identify', function (name) {
      socket.set('name', String(name || 'Anonymous'), function (err) {
        updateRoster();
      });
    });
  });

function updateRoster() {
  async.map(
    sockets,
    function (socket, callback) {
      socket.get('name', callback);
    },
    function (err, names) {
      broadcast('roster', names);
    }
  );
}

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    socket.emit(event, data);
  });
}

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Chat server listening at", addr.address + ":" + addr.port);
});