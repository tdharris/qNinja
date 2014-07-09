var express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    api = require('express-api-helper'),
    getServiceRequests = require('./js/getServiceRequests');

app.use(express.static(__dirname+'/public'))
   .use(bodyParser.json());

app.post('/getServiceRequests', function(req, res){
	getServiceRequests(req, res);
});

console.log('qNinja service is up.');
