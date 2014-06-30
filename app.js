var express = require('express'),
    app = module.exports = express(),
    bodyParser = require('body-parser'),
    api = require('express-api-helper'),
    getServiceRequests = require('./js/getServiceRequests');

app.use(express.static(__dirname+'/public'))
   .use(bodyParser.json());

app.post('/getServiceRequests', function(req, res){
	getServiceRequests(req.body.engineer, function(err, data) {
		if(err) return api.notFound(req, res);
		api.ok(req, res, data);
	});	
});

console.log('qNinja service is up.');