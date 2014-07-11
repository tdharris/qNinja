var express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    api = require('express-api-helper'),
    getServiceRequests = require('./js/getServiceRequests'),
    sendMail = require('./js/sendMail');

app.use(express.static(__dirname+'/public'))
   .use(bodyParser.json());

app.post('/getServiceRequests', function(req, res){
	getServiceRequests(req, res);
});

app.post('/sendMail', function(req, res){
   sendMail(req, res);
});

console.log('qNinja service is up.');

// Where to put utility?
String.prototype.isEmpty = function() {
   return (this.legnth === 0 || !this.trim());
}
