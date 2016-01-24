var nameColor = 'blue';
var messageColor = '#000000';
var errorColor = 'red';
var infoColor = '#888888';

var formatMessage = function(user, message) {
  return '<span style="color: ' + nameColor + '">' + user + '</span>' +
    ': ' + message;
  //return "The same message every time";
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
    postMessage('black', formatMessage('Me', $('#message').val())); // post message to page
    $('#message').val(''); //get rid of typed message
  });

  $('#message').on('keypress', function (event) {
  	event.preventDefault();
  	if (event.keyCode === 13 && $('#message').val() !== '') { //if Enter is pressed
  		$("#message-form").submit();
  	}
  });

  var x = 0; //the degree of rotation;
  setInterval(function(){
  	$('#messages').css('transform',"rotate(" + x + "deg)");
  	x += .2;
  }, 20); //every 20 milisec

  var y=0;
  var growthSpeed = 0.1;
  setInterval(function() {
  	$('h1').css('font-size', y +"rem");
  	y += growthSpeed;

  	if (y > 2) {
  		growthSpeed -= .01;
  	} else if (y < 0) {
  		growthSpeed = 0.01;
  	}
  })

});

