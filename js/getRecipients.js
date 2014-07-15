var setops = require('setops');

module.exports = function getRecipients(item) {
    var recipients = [];
    console.log('parsing addresses...');

    [item.primaryContact, item.alternateContact].forEach(function(item, index, array) {
        if(!myUtil.isEmpty(item)) {
            recipients = setops(recipients).union(item.split(','));
        }
    });
    
    // validate emails and return them here
    return validate(recipients);
}