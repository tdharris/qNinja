var myUtil = require('./myUtil');

module.exports = function createEmail(mail, recipients) {

    // Prep mailOptions
    var from = "support@novell.com";

    if(mail.fromUser || myUtil.isEmpty(mail.fromUser)) {
        from = mail.ENGINEER.toLowerCase() + "@novell.com";
    }

    mailOptions = {
        from: from,
        to: recipients.join(','),
        cc: mail.ccSupport,
        subject: "SR " + mail.SR + " - " + mail.BRIEF + " +EO",
        html: mail.content + mail.signature
    };

    // console.log('\nmailOptions: ', mailOptions);
    return mailOptions;
}