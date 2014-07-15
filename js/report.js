var nodemailer = require('nodemailer');

exports.initReport = function(task) {
	
	var report = {

		mailOptions: {
			from: "qNinja <qNinja@mymobile.lab.novell.com>",
		        to: task.engineer + "@novell.com",
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

exports.sendReport = function(done) {

    notifyTransport = nodemailer.createTransport("Direct");

    report.mailOptions.html = getReport();

    // Send report to engineer
    notifyTransport.sendMail(report.mailOptions,
    function(error, response){
        // close the transport first
        notifyTransport.close();
        
        // exit early if there's an error
        if(error) { 
            logme.error(error);
            return done(error, null);
        }

        var message = 'Sent qNinja Report to ' + report.mailOptions.engineer;
        logme.info('Sent report to: ' + report.mailOptions.engineer + ' | ' + response.message);
        return done(null, message);
    });

};