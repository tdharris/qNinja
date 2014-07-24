var request = require('request'),
		logme = require('logme'),
		api = require('express-api-helper'),
		myUtil = require('./myUtil'),
		async = require('async');

module.exports=function(req, res) {

	var engineer = req.body.engineer;
	serverError = {'err': null, 'message': undefined };
	var options = {
		url: 'http://proetus.provo.novell.com/qmon/brief-tse-json.asp?tse='+ engineer,
		json: true
	}
	request(options, function (error, response, body) {
		
		if (myUtil.isEmpty(response) || response.statusCode !== 200) {
			logme.error('Failed response from Proetus for engineer: ' + engineer + ' - ', error);
			api.invalid(req, res, error);
		} else if (body.length == 0) {
			logme.warning('Failed response from Proetus for engineer: ' + engineer + ' - no such engineer!');
			api.notFound(req, res);
		} else if (serverError.err){
				api.serverError(req, res, serverError);
		} else {
			logme.info('Successful response from Proetus for engineer: ' + engineer);
			api.ok(req, res, body);
		}


		// else try {

		// 	Novell Proetus server sometimes has newline characters
		// 	var data = body.replace(/\n|\r/g, " ").trim();
		// 	var data = JSON.stringify(body);

		// }

		// catch(err) {

		// 	logme.error('Failed to parse response from Proetus for engineer: ' + engineer + ' - ', err, "\n" + data);
		// 	serverError={'err': true, 'message': err};

		// }

		// finally {

			
		// }

	});
};
