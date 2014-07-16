module.exports = function createEmail(mail, recipients) {

    // Prep mailOptions
    var from = "support@novell.com",
        carbonCopy = "support@novell.com";

    if(mail.fromUser) {
        from = mail.engineer + "@novell.com";
    }
    if(!mail.ccSupport) {
        carbonCopy = "";
    }

    mailOptions = {
        from: from,
        to: recipients.join(','),
        cc: carbonCopy,
        subject: "SR " + mail.sr + " - " + mail.brief + " +EO",
        html: mail.content + mail.signature
    };

    // console.log('\nmailOptions: ', mailOptions);
    return mailOptions;
}