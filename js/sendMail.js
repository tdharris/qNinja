var logme = require('logme'),
    api = require('express-api-helper'),
    nodemailer = require("nodemailer"),
    setops = require('setops'),
    validateEmailAddresses = require('./validateEmailAddresses');

module.exports=function(req, res) {
    var report = [];
    var formData = req.body,
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
    logme.info('[' + formData.engineer + '] Received new sendMail request ' + formData.emails.length + ' email(s): sendFromUser is', formData.fromUser, hasPassword);

    logme.info('[' + formData.engineer + '] Validating', formData.emails.length + ' email(s)');
    function validateEmail(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    formData.emails.forEach(function(mail, index){

        // Create an array of emailAddresses from user input (comma dileneated list)
        var checkEmailAddresses = [];
        if(! mail.primaryContact.isEmpty()) {
            checkEmailAddresses = mail.primaryContact.split(',');
        } if (! mail.alternateContact.isEmpty()) {
            checkEmailAddresses = setops(checkEmailAddresses).union(mail.alternateContact.split(','));
        }

        // Validate emailAddresses
        validateEmailAddresses(checkEmailAddresses, function(recipients){
            mail.subject = "SR " + mail.sr + " - " + mail.brief + " +";

            var mailOptions = {
                from: formData.engineer + "@novell.com",
                to: recipients,
                cc: "support@novell.com",
                subject: "SR " + mail.sr + " - " + mail.brief + " +",
                html: formData.content + formData.signature
            }

            transport.sendMail(mailOptions, function(error, response){
                logme.info('[' + formData.engineer + '] [mail ' + index + '] ' + mail.subject, ' to ' + recipients);
                if(error){
                    var message = '[' + formData.engineer + '] [mail ' + index + '] Failed to send: ' + mail + response.message;
                    logme.error(message);
                    report.push(message);
                }else{
                    var message = '[' + formData.engineer + '] [mail ' + index + '] Sent: ' + response.message;
                    logme.info();
                    report.push(message);
                }

            });
        });



    });
    //     transport.close();
    // console.log(validateEmail(req.body.emails[0].primaryContact));
    api.ok(req, res, JSON.stringify({"message": "Finished!"}));
};
