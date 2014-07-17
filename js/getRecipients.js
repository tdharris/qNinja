var setops = require('setops'),
	myUtil = require('./myUtil'),
    validate = require('./validate');

module.exports = function getRecipients(array) {
    var recipients = [];
    // console.log('Parsing through: ', array);
    array.forEach(function(item, index, array) {
        if(!myUtil.isEmpty(item)) {
            recipients = setops(recipients).union(item.split(','));
        }
    });
    // recipients = recipients.filter(Boolean);

    // console.log('Parsed recipients: ', recipients);
    
    // validate emails and return them here
    return validate(recipients);
}