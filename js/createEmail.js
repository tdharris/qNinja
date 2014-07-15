module.exports = function createEmail(task, recipients) {

    // Prep mailOptions
    var from = "support@novell.com",
        carbonCopy = "support@novell.com";

    if(task.fromUser) {
        from = task.engineer + "@novell.com";
    }
    if(!task.ccSupport) {
        carbonCopy = "";
    }

    var mailOptions = {
        from: from,
        to: recipients.join(','),
        cc: carbonCopy,
        subject: "SR " + item.sr + " - " + item.brief + " +EO",
        html: task.content + task.signature
    };

    return mailOptions;
}