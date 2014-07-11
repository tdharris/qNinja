var logme = require('logme'),
    api = require('express-api-helper'),
    nodemailer = require("nodemailer"),
    setops = require('setops'),
    validateEmailAddresses = require('./validateEmailAddresses'),
    myUtil = require('./myUtil');
    // async_block = require('node-async');

module.exports = function(req, res) {
    var report = [],
        formData = req.body,
        eventHeader = '[' + formData.engineer + ']',
        hasPassword="",
        transport = nodemailer.createTransport("SMTP", {
            host: "xgate.provo.novell.com",
            secureConnection: false,
            tls: {
                ciphers:'SSLv3'
            },
            port: 25,
            auth: {
                user: formData.engineer,
                pass: formData.password
            }
        });

    if(typeof formData.password != "undefined") { hasPassword='with credentials' }
    logme.info(eventHeader + ' Received new sendMail request ' + formData.emails.length + ' email(s): sendFromUser is', formData.fromUser, hasPassword);

    logme.info(eventHeader + ' Validating', formData.emails.length + ' email(s)');

    formData.emails.forEach(function(mail, index) {
            // Create an array of emailAddresses from user input (comma dileneated list)
            var checkEmailAddresses = [];

            var pce = myUtil.isEmpty(mail.primaryContact),
                ace = myUtil.isEmpty(mail.alternateContact),
                skipValidate = false;

            if(pce && ace) {
                skipValidate = true;
                console.log(req);
                var error = 'No email addresses! ' + mail.sr + ' - ' + mail.brief;
                // api.invalid(req, res, [error]);
                logme.warning(eventHeader + ' No email addresses for SR ' + mail.sr);
            }
            if(!pce && !ace) checkEmailAddresses = setops(mail.primaryContact.split(',')).union(mail.alternateContact.split(','));
            if(!pce && ace) checkEmailAddresses = mail.primaryContact.split(',');
            if(pce && !ace) checkEmailAddresses = mail.alternateContact.split(',');

            // Validate emailAddresses
            if (!skipValidate) {
                validateEmailAddresses(checkEmailAddresses, function(recipients) {
                    if (myUtil.isEmpty(recipients)) {
                        var error = 'No email addresses! ' + mail.sr + ' ' + mail.brief;
                        // api.invalid(req, res, [error]);
                        logme.warning(eventHeader + ' No valid email addresses for SR ' + mail.sr);
                    } else {
                        mail.subject = "SR " + mail.sr + " - " + mail.brief + " +";
                        var mailOptions = {
                            from: formData.engineer + "@novell.com",
                            to: recipients,
                            cc: "support@novell.com",
                            subject: "SR " + mail.sr + " - " + mail.brief + " +EO",
                            html: formData.content + formData.signature
                        };

                        transport.sendMail(mailOptions, function(error, response){
                            var message = eventHeader + ' [mail ' + index + '] ' + mail.subject + ' to ' + recipients;
                            if(error){
                                // api.badRequest(req, res, message)
                                logme.error(message + ' | Failed to send: ' + response.message);
                                report.push(message + ' | Failed to send: ' + response.message);
                            }else{
                                // api.ok(req, res, message);
                                logme.info(message + ' | Sent: ' + response.message);
                                report.push(message + ' | Sent: ' + response.message);
                            }

                        });
                    }    
                });
            }
        }); 
};

// function notifyEngineer(){
//     // Send report to user from notify@mymobile.lab.novell.com
//     notifyTransport = nodemailer.createTransport("SMTP", {
//         host: "mymobile.lab.novell.com",
//         secureConnection: false,
//         tls: {
//             ciphers:'SSLv3'
//         },
//         port: 25,
//         auth: {
//             user: notify,
//             pass: "novell"
//         }
//     });
//     notifyTransport.sendMail({
//         from: notify@mymobile.lab.novell.com,
//         to: formData.engineer + "@novell.com",
//         subject: "[qNinja] " + formData.engineer + " email report",
//         html: report
//     }, function(error, response){
//         if(error) logme.error()
//     };
// });

        // asyncTasker([
        //     {
        //         name: 'validateEmailAddresses',
        //         task: validateEmailAddresses(checkEmailAddresses, callback)
        //     },
        //     {
        //         name: 'prepMail',
        //         task: function(recipients, callback){
        //             mail.subject = "SR " + mail.sr + " - " + mail.brief + " +";
        //
        //             var mailOptions = {
        //                 from: formData.engineer + "@novell.com",
        //                 to: recipients,
        //                 cc: "support@novell.com",
        //                 subject: "SR " + mail.sr + " - " + mail.brief + " +",
        //                 html: formData.content + formData.signature
        //             };
        //
        //             callback(null, mailOptions);
        //         }
        //     },
        //     {
        //         name: 'sendMail',
        //         task: function(mailOptions, callback) {
        //             report = "yay";
        //             transport.sendMail(mailOptions, function(error, response){
        //                 logme.info('[' + formData.engineer + '] [mail ' + index + '] ' + mail.subject, ' to ' + recipients);
        //                 if(error){
        //                     var message = '[' + formData.engineer + '] [mail ' + index + '] Failed to send: ' + mail + response.message;
        //                     logme.error(message);
        //                     report.push(message);
        //                 }else{
        //                     var message = '[' + formData.engineer + '] [mail ' + index + '] Sent: ' + response.message;
        //                     logme.info();
        //                     report.push(message);
        //                 }
        //             callback(null, report);
        //             });
        //         }
        //
        //     }
        // ], function(results){
        //     console.log(results);
        //     transport.close();
        //     api.ok(req, res, JSON.stringify({"message": "Finished!"}));
        // });