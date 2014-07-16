var validate = require('./validate'),
    getRecipients = require('./getRecipients'),
    createEmail = require('./createEmail'),
    sendMail = require('./sendMail'),
    report = require('./report');

// process an email item
// roll task/item into a config object
module.exports = function processEmail(mail, done) {

    console.log('\nProcessing: ', mail, '\n');

    // pull item/task/transport off of config object
    // var item = config.item,
    //     task = config.task,
    //     transport = config.transport;

    // get validated list of recipients
    var recipients = getRecipients([mail.primaryContact, mail.alternateContact]);
    console.log('\nValidated recipients: ', recipients);

    console.log('\nCreating mail item:');
    mail.mailOptions = createEmail(mail, recipients);
    
    console.log('mailOptions for transport: ', mail.mailOptions);
    sendMail(mail, function (err, result) {
       // result now equals 'done' 
       console.log('appending to task report.');
       report.saveToReport(result);

       done();

    });
};