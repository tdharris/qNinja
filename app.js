var express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    getServiceRequests = require('./js/getServiceRequests'),
    requestHandler = require('./js/requestHandler'),
    compress = require('compression')();

app.use(compress)
   .use(express.static(__dirname+'/public'))
   .use(bodyParser.json());

app.post('/getServiceRequests', function(req, res){
	getServiceRequests(req, res);
});

app.post('/sendMail', function(req, res){
  requestHandler(req, res);
});

// Where to put utility?
String.prototype.isEmpty = function() {
   return (this.length === 0 || !this.trim());
}

Array.prototype.appendStringToElementAtIndex = function(index, str) {
    if(typeof this[index] === 'undefined' || typeof this[index] !== 'string') return false;
    this[index] += ' ' + str;
};