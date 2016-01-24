var giphy = require('giphy-api')();
var express = require('express');
var router = express.Router();

router.get('/test', function(req, res){
	console.log("someone tried to access /test"); //display on terminal
	return res.send('this is a test route'); //show on the web (a route)
});


router.get('/giphy/:searchterm', function(req, res){
	//console.log("someone tried to access /giphy"); //display on terminal
	//return res.send('Someone entered giphy, searchterm was: ' + req.params['serachterm']); //show on the web (a route)
});


// moduel.exports = function(){
// 	console.log("Hello, this is ???")
// }

moduel.exports = router;