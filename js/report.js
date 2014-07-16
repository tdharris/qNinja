var nodemailer = require('nodemailer'),
    logme = require('logme'),
    transport = require('./transport');

exports.init = function(task) {
	
	this.report = {

		mailOptions: {
			from: "qNinja <qNinja@mymobile.lab.novell.com>",
	        to: task.engineer + "@novell.com",
	        subject: "[qNinja] Email Report ✔",
	        html: null
    	},
    	messages: ['abc123']
    }

}

exports.saveToReport = function(message) {

    this.report.messages.push(message);

}

exports.getReport = function() {

	var pReport = '';
    this.report.messages.forEach(function(item, index, array){
        pReport += item + "<br>";
    });

    return pReport;

}

exports.sendReport = function(done) {

    this.report.mailOptions.html = this.getReport();

    var self = this;

    // Send report to engineer
    console.log('Sending Report through Notify Transport: \n', transport.notify);
    transport.notify.sendMail(self.report.mailOptions,
    function(error, response){
        // close the transport first
        transport.notify.close();
        
        // exit early if there's an error
        if(error) { 
            logme.error(error);
            return done(error, null);
        }

        var message = 'Sent qNinja Report to ' + self.report.mailOptions.engineer;
        logme.info('Sent report to: ' + self.report.mailOptions.engineer + ' | ' + response.message);
        return done(null, message);
    });

};