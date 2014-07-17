var request = require('request'),
		logme = require('logme'),
		api = require('express-api-helper'),
		myUtil = require('./myUtil'),
		async = require('async');

module.exports=function(req, res) {

	var engineer = req.body.engineer,
	serverError = {'err': null, 'message': undefined };
	request('http://proetus.provo.novell.com/qmon/brief-tse-json.asp?tse='+ engineer, function (error, response, body) {
		
		if (myUtil.isEmpty(response) || error && response.statusCode !== 200) {
			logme.error('Failed response from Proetus for engineer: ' + engineer + ' - ', error);
			api.invalid(req, res, error);
		} else if (body.length <= 11) {
			logme.warning('Failed response from Proetus for engineer: ' + engineer + ' - no such engineer!');
			api.notFound(req, res);
		}

		else try {

			// Novell Proetus server sometimes has newline characters
			var data = JSON.parse(body.replace(/\n|\r/g, ""));

		}

		catch(err) {

			logme.error('Failed to parse response from Proetus for engineer: ' + engineer + ' - ', err, "\n" + body);
			serverError={'err': true, 'message': err};

		}

		finally {

			if (serverError.err){
				api.serverError(req, res, serverError);
			} else {
				// logme.info('Successful response from Proetus for engineer: ' + engineer);
				api.ok(req, res, JSON.stringify(data));
			}

		}

	});
};
