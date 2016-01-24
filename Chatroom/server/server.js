'use strict';

console.log("Hello world");

//use socket.io
var Server = require('socket.io');
var io = Server(3000);
console.log('SocketIO listening on port 3000');

//make a new express app & listen to port 3000:
// var path = require('path');
// var express = require('express');
// var app = express(); //set up the app
// app.use(express.static(path.join(__dirname, '../client')));

// var routes = require('./routes');
// app.use('/', router);

// var server = app.listen(3000, function(){
//   console.log('Express server liseting on 3000');
// })

var Moniker = require('moniker');
var _ = require('underscore');
var User = require('./user');
var mongo = require('mongodb').MongoClient;
var uri = "mongodb://yibang:870915sOe@ds047095.mongolab.com:47095/codeweekend";
//var uri = "mongodb://localhost: 27017/";

var users = {};


io.on('connection', function (socket) {
  // on 'connection' we need to set some stuff up
  console.log('Got a new connection');
  var name = getUniqueName();
  var user = User(socket, name);
  users[socket.id] = user;
  console.log(":CONNECTION - " + user.toString());

  //begin program - display last 10 messages
  mongo.connect(uri, function(err, db){
    var collection = db.collection('chatmsgs')
    collection.find().sort({ date: -1}).limit(10).toArray((err, array) => 
    {
      if(err) return console.error(err);
      for(var i=array.length -1; i >=0; i--) {
        socket.emit('MESG', array[i]); //
      }
    });
  })

  // emit the current state to the new user
  socket.emit('STATE', {
    users: _.mapObject(users, (user) => user.toObj()), //_ for functional js
    user: user.getId()
  });

  // emit the new JOIN for all the other users
  socket.broadcast.emit('JOINED', {user: users[socket.id].toObj()});

  // -----------------
  //  SOCKET HANDLERS
  // -----------------
  /**
   * Handles PING
   * Responds with a PONG
   */
  socket.on('PING', function (data) {
    console.log('Got a PING');

    socket.emit('PONG'); // reply with a PONG
  });

  /**
   * Handles MESG
   */
  socket.on('MESG', function(data) {
    var user = users[socket.id];
    console.log(`:MESG - <${user.getName()}> ${data.message}`);

    var message = {
      from: user.getName(),
      message: data.message
    };

  mongo.connect(uri, function (err, db) {
      let collection = db.collection('chatmsgs');
      collection.insert({
        date: new Date().getTime(),
        from: user.getName(),
        message: data.message}, function(err, o) {
            if (err) { console.warn(err.message); }
            else { console.log("chat message inserted into db: " + message); }
      });
  });

    io.emit('MESG', message); // broadcast the message everywhere
  });


  socket.on('NAME', (data) => {
  	var user = users[socket.id];
  	console.log(`:NAME - <${user.getName()}> wants to change name to`
  		+ ` <${data.newName}>`);

  	if(isUniqueName(data.newName)) {
      // success!
      console.log(
      	`:NAME - <${user.getName()}> changed name to <${data.newName}>`);
      user.setName(data.newName);
      io.emit('NAME', {user: user.toObj()});
    } else {
      // failure :(
      	console.log(':ERROR - NON_UNIQUE_NAME');
      	socket.emit('ERROR', {message: 'NON_UNIQUE_NAME'});
    }
  });

  socket.on('IMG', function (data) {
    var user = users[socket.id];
    console.log(`:IMG - <${user.getName()}> IMAGE @ ${data.url}`);

    var message = {
      from: user.getName(),
      message: `<img src=${data.url} class="message-image">`
    };

    io.emit('MESG', message);
  });


  socket.on('disconnect', function() {
    var user = users[socket.id];
    console.log(`:LEFT - ${user.toString()})`);
    socket.broadcast.emit('LEFT', {user: user.toObj()});
    delete users[socket.id];
  });
});

// HELPER FUNCTIONS
function isUniqueName (name) {
  var names = _.mapObject(users, (user) => user.getName().toLowerCase());
  return !_.contains(names, name.toLowerCase());
}

/**
 * Gets a unique name using Moniker (showcases basic npm modules)
 * @return String a unique name
 */
function getUniqueName() {
  var name = Moniker.choose();
  while(!isUniqueName(name)) {
    name = Moniker.choose();
  }

  return name;
}