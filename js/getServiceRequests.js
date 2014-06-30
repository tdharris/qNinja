var request = require('request'),
	logme = require('logme');

module.exports=function(engineer, callback) {
	request('http://proetus.provo.novell.com/qmon/brief-tse.asp?tse='+ engineer, function (error, response, body) {
		if (error && response.statusCode !== 200) {
			logme.error('Failed response from Proetus for engineer: ' + engineer + ' - ', response, error);
			callback(error); 
		}
		else if (response.body.length <= 11) {
			logme.warning('Failed response from Proetus for engineer: ' + engineer + ' - no such engineer!');
			callback(true);
		}

		else {
			logme.info('Successful response from Proetus for engineer: ' + engineer);
	  		callback(false, response.body);
		}
	  	
	});
};