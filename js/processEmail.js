var validate = require('./validate'),
    getRecipients = require('./getRecipients'),
    createEmail = require('./createEmail'),
    sendMail = require('./sendMail'),
    report = require('./report');

// process an email item
// roll task/item into a config object
module.exports = function processEmail(config, done) {
    // pull item/task/transport off of config object
    var item = config.item,
        task = config.task,
        transport = config.transport;

    // get validated list of recipients
    var recipients = getRecipients(item);
    
    var mail = createEmail(task, recipients);
    
    sendMail(transport, mail, function (err, result) {
       // result now equals 'done' 
       console.log('appending to task report.');
       report.saveToReport(result);

       callback();

    });
};