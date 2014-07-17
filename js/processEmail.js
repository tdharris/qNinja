var validate = require('./validate'),
    getRecipients = require('./getRecipients'),
    createEmail = require('./createEmail'),
    sendMail = require('./sendMail'),
    report = require('./report');

// process an email item
// roll task/item into a config object
module.exports = function processEmail(mail, done) {

    // console.log('\nProcessing: ', mail, '\n');

    // get validated list of recipients
    var recipients = getRecipients([mail.primaryContact, mail.alternateContact]);
    // console.log('\nValidated recipients: ', recipients);

    // console.log('\nCreating mail item:');
    mail.mailOptions = createEmail(mail, recipients);
    
    // console.log('mailOptions for transport: ', mail.mailOptions);
    sendMail(mail, function (err, result) {

       report.saveToReport(result);
       done();

    });
};