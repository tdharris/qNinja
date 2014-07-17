var nodemailer = require('nodemailer'),
    logme = require('logme'),
    transport = require('./transport');

var report,
    transport;

exports.init = function(engineer, transport) {
    
	report = {

        transport: transport,
		mailOptions: {
			from: "qNinja <qNinja@mymobile.lab.novell.com>",
	        to: engineer + "@novell.com",
	        subject: "[qNinja] Email Report ✔",
	        html: null
    	},
    	messages: []
    }

}

exports.saveToReport = function(message) {

    report.messages.push(message);

}

function getReport() {

	var pReport = '';
    report.messages.forEach(function(item, index, array){
        pReport += item + "<br>";
    });

    return pReport;

}

exports.sendReport = function() {

    // Close the smtp connection pool
    transport.get('novell').close();

    report.mailOptions.html = getReport();

    // Send report to engineer
    // console.log('Sending Report: \n', report.transport);
    // console.log(report.mailOptions);

    report.transport.sendMail(report.mailOptions, function(error, response){
        // close the transport first
        report.transport.close();
        
        // exit early if there's an error
        if(error) { 
            logme.error(error);
            return done(error, null);
        }

        logme.info('Sent Report:', response.message + ' | To:', report.mailOptions.to);

    });

};