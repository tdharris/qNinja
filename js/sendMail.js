var logme = require('logme'),
    api = require('express-api-helper'),
    nodemailer = require("nodemailer"),
    setops = require('setops'),
    validateEmailAddresses = require('./validateEmailAddresses'),
    myUtil = require('./myUtil'),
    validate = require('./validateEmailAddresses'),
    async = require('async');

module.exports = function(req, res, done) {
 
    var task = req.body;
    task.report = [];
    // task.emails = ['email1.com', 'email@domain', 'email@domain.com'];
            // .engineer, .password, .content, .signature, .emails[array], .fromUser[boolean]
    async.each(
        task.emails,
        function(item, callback) {
            async.waterfall([
                function(callback) {
                    var recipients = [];
                    console.log('parsing addresses...');

                    [item.primaryContact, item.alternateContact].forEach(function(item, index, array) {

                        var empty = myUtil.isEmpty(item);
                        if(!empty) {
                            recipients = setops(recipients).union(item.split(','));
                        }

                        if (index === array.length - 1) {
                             callback(null, recipients);
                         }
                        
                    });
                },
                function(recipients, callback) { 
                    console.log('validating email...');
                    validate(recipients, callback);
                },
                function(recipients, callback) {

                    // Prep mailOptions
                    task.subject = "SR " + item.sr + " - " + item.brief + " +EO";
                    task.from = "support@novell.com";
                    if(task.fromUser) {
                        task.from = task.engineer + "@novell.com";
                    }

                    var mailOptions = {
                        from: task.from,
                        to: recipients.join(','),
                        // cc: "support@novell.com",
                        subject: task.subject,
                        html: task.content + task.signature
                    };

                    callback(null, mailOptions);

                },
                function(mailOptions, callback) {

                    var eventHeader = '[' + task.engineer + '] [mail] ';

                    // Debug
                    // console.log(eventHeader + ' sending ' + mailOptions);

                    // Create transport
                    transport = nodemailer.createTransport("SMTP", {
                        host: "xgate.provo.novell.com",
                        secureConnection: false,
                        tls: {
                            ciphers:'SSLv3'
                        },
                        port: 25,
                        auth: {
                            user: task.engineer,
                            pass: task.password
                        }
                    });

                    // Send mail through transport
                    transport.sendMail(mailOptions, function(error, response){
                        var mailInfo = mailOptions.subject + ' to: ' + mailOptions.to + ' from: ' + mailOptions.from;
                        if(error){
                            var message = 'Failed to send: <b style="color: red">' + error + '</b> | ' + mailInfo;
                            logme.error('Failed to send: ', error + ' | ' + mailInfo);
                        }

                        else{
                            var message = 'Sent: <b style="color: green">' + response.message + ' ✔</b> | ' + mailInfo;
                            logme.info('Sent: ' + response.message + ' | ' + mailInfo);
                        }

                        transport.close();
                        callback(null, message);

                    });

                }
            ], function (err, result) {
               // result now equals 'done' 
               console.log('mail sent, appending to task report.');
               task.report.push(result);
               callback();
            });
        },
        function(err, results) {
            // Prettify report email content
            var pReport = '',
            notifyTransport = nodemailer.createTransport("Direct");

            task.report.forEach(function(item, index, array){
                pReport += item + "<br>";
            });

            // Send report to engineer
            // task.engineer + "@novell.com"
            notifyTransport.sendMail({
                from: "qNinja <qNinja@mymobile.lab.novell.com>",
                to: 'tylerdavidharris@gmail.com',
                subject: "[qNinja] Email Report ✔",
                html: pReport
            },
            function(error, response){
                if(error) { 
                    logme.error(error);
                    done(error, null);
                }
                else { 
                    var message = 'Sent qNinja Report!';
                    logme.info('Sent report to: ' + task.engineer + ' | ' + response.message);
                    done(null, message);
                }
                notifyTransport.close();
            });

        }
    );

}