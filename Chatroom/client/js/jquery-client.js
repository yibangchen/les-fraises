var nameColor = 'blue';
var messageColor = '#000000';
var errorColor = 'red';
var infoColor = '#888888';

var formatMessage = function(user, message) {
  return '<span style="color: ' + nameColor + '">' + user + '</span>' +
    ': ' + message;
};

var postMessage = function (color, contents) {
  console.log('Error: jQuery not ready yet');
};

$(function() {
  postMessage = function(color, contents) {
    $('<li><span style="color: ' + color + '">' 
        + contents + '</span></li>').hide().appendTo('#messages').fadeIn(200);
  };

  $('#message-form').submit(function (event) {
    //alert("Form submitted");

    event.preventDefault();

    //client side messaging only
    sendMessage($('#message').val());
    $('#message').val('');
  });

  $('#message').on('keypress', function (event) {
  	if(event.keyCode === 13) {
  		event.preventDefault();
  		if($("#message").val() !== '') {
  			$("#message-form").submit();
  		}
  	}
  });

});