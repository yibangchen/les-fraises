'use strict';

var socket = io('http://localhost:3000');

socket.emit('PING');

var users = {};
var me = socket.id;

// ---------------------
//    SOCKET HANDLERS
// ---------------------
socket.on('PONG', function (data) {
  console.log('Got PONG!');
});

/**
 * Handles STATE events.
 * These are fired when the client first connects,
 * the data object contains:
 *   - users (list of user objects currently connected)
 *   - user  (the id of the current client)
 */
socket.on('STATE', function (data) {
  users = data.users;
  me = data.user;
  console.log(':STATE - Users in channel: ' + getUserList());

  postMessage(infoColor, 'Hello! You name is ' + users[me].name + '. Currently,'
              + ' these people are chatting: <br>' + getUserList());
});

/**
 * Handles JOINED events.
 * When a new user joins.
 * Data object contains:
 *   - user (the user that just joined)
 */
socket.on('JOINED', function (data) {
  var user = data.user;
  users[user.id] = user;
  console.log(':JOINED - ' + user.string);

  postMessage(infoColor, user.name + ' just joined the channel!');
});

/**
 * Handles LEFT events.
 * Deletes users who leave.
 * Data object:
 *   - user (the user that left)
 */
socket.on('LEFT', function (data) {
  var user = data.user;
  console.log(':LEFT - ' + user.string);
  delete users[user.id];

  postMessage(infoColor, user.name + ' just left :(');
});


socket.on('MESG', function (data) {
  console.log(':MSG - <' + data.from + '> ' + data.message);

  postMessage(messageColor, formatMessage(data.from, data.message));
});

/**
 * Handles NAME events.
 * Updates a users name.
 * Data object:
 *   - user (the updated user object)
 */
socket.on('NAME', function (data) {
  var user = data.user;
  var old = users[user.id];
  users[user.id] = user;

  console.log(':NAME - <' + old.string + '> changed to <' + user.name + '>');

  postMessage(infoColor,
              '&lt;' + old.name + '&gt; changed their name to &lt;' + user.name + '&gt;');
});

/**
 * Handles ERROR events.
 * Data object:
 *   - message
 */
socket.on('ERROR', function (data) {
  console.log(':ERROR - ' + data.message);

  postMessage(errorColor, 'ERROR: ' + data.message);
});

//HELPER METHODS
function getUserList() {
  return _.reduce(users,
                  function (rest, user) { 
                    return (rest ? rest + ', ' : '') + user.name;
                  },
                  ''
                 );
}

function sendMessage(message) {
  // check if it's a command
  if(message.substring(0,1) != '/') {
    socket.emit('MESG', {message: message});
  } else {
    // it's a command!
    var params = message.substring(1).split(' ');

    var cmd = params[0];

    sendCommand(cmd, params);
  }
}

function sendCommand(cmd, params) {
  console.log('User attempted cmd ' + cmd);
  console.log('Params: ' + params);

  switch(cmd.toLowerCase()) {
    case 'setname':
      setName(params[1]);
      break;

    case 'image':
      sendImage(params[1]);
      break;

    case 'giphy':
      sendGif(params[1]);
      break;

    default:
      postMessage(errorColor, 'ERROR: Invalid command "' + cmd + '"');
  }
}

/**
 * Sends a NAME message to the server
 * changing this users name
 */
function setName(newName) {
  socket.emit('NAME', {newName: newName});
}

function sendImage(url) {
  socket.emit('IMG', {url: url});
}

function sendGif(searchTerm) {
  
}

