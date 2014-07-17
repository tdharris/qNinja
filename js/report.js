var logme = require('logme');

var Report = module.exports = function(engineer, transport) {
    this.engineer = engineer;
    this.transport = transport;
    this.results = [];
};

Report.prototype = {

    send: function(done) {
        var self = this,
            mailOptions = {
                from: "qNinja <qNinja@mymobile.lab.novell.com>",
                to: this.engineer + "@novell.com",
                subject: "[qNinja] Email Report ✔",
                html: this.results.join('<br>')
            }

        this.transport.sendMail(mailOptions, function(error, response){
            // close the transport first
            self.transport.close();
            
            // exit early if there's an error
            if(error) { 
                logme.error(error);
                return done(error, null);
            }

            logme.info('Sent Report:', response.message + ' | To:', mailOptions.to);
            done();
        });

    }
}