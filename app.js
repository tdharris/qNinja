var express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    getServiceRequests = require('./js/getServiceRequests'),
    requestHandler = require('./js/requestHandler');

app.use(express.static(__dirname+'/public'))
   .use(bodyParser.json());

app.post('/getServiceRequests', function(req, res){
	getServiceRequests(req, res);
});

app.post('/handleRequest', function(req, res){
  requestHandler(req, res, function(){
    console.log('done!');
  });
});

console.log('qNinja service is up.');

// Where to put utility?
String.prototype.isEmpty = function() {
   return (this.length === 0 || !this.trim());
}

Array.prototype.appendStringToElementAtIndex = function(index, str) {
    if(typeof this[index] === 'undefined' || typeof this[index] !== 'string') return false;
    this[index] += ' ' + str;
};