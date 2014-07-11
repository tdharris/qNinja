var request = require('request'),
		logme = require('logme'),
		api = require('express-api-helper');

module.exports=function(req, res) {
	var engineer = req.body.engineer;
	request('http://proetus.provo.novell.com/qmon/brief-tse-json.asp?tse='+ engineer, function (error, response, body) {

		try {

			// Novell Proetus server sometimes has newline characters
			var data = JSON.parse(response.body.replace(/\n|\r/g, ""));

		}

		catch(err) {

			logme.error('Failed to parse response from Proetus for engineer: ' + engineer + ' - ', err, "\n" + response.body);
			error=true;

		}

		finally {

			if (error && response.statusCode !== 200 || response.statusCode === undefined) {
				logme.error('Failed response from Proetus for engineer: ' + engineer + ' - ', error);
				api.invalid(req, res, errors)
			} else if (response.body.length <= 11) {
				logme.warning('Failed response from Proetus for engineer: ' + engineer + ' - no such engineer!');
				api.notFound(req, res);
			} else if (error){
				api.serverError(req, res, error);
			} else {
				logme.info('Successful response from Proetus for engineer: ' + engineer);
				api.ok(req, res, JSON.stringify(data));
			}

		}

	});
};
