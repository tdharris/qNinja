var logme = require('logme');

module.exports = function sendMail(mail, callback) {

    var eventHeader = '[' + mail.engineer + '] [mail] ';

    // Debug
    // console.log(eventHeader + ' sending ' + mailOptions);

    // Send mail through transport
    // console.log('\n\nNovell Transport: \n', mail.transport, '\n\n');
    mail.transport.sendMail(mail.mailOptions, function(error, response){

        var message,
            mailInfo = '<b>To: </b>' + mail.mailOptions.to + ' <b>Cc: </b>' + mail.mailOptions.cc +' <b>From: </b>' + mail.mailOptions.from + ' <b>Subject: </b>' + mail.mailOptions.subject;
            
        if(error){
            message = 'Failed to send: <b style="color: red">' + error + '</b> | ' + mailInfo;
            logme.error('Failed to send: ', error + ' | To:' + mail.mailOptions.to + ' Cc:' + mail.mailOptions.cc + ' From:' + mail.mailOptions.from + ' Subject:' + mail.mailOptions.subject);
        }else{
            message = 'Sent: <b style="color: green">' + response.message + ' ✔</b> | ' + mailInfo;
            logme.info('Sent: ' + response.message + ' | To:' + mail.mailOptions.to + ' Cc:' + mail.mailOptions.cc + ' From:' + mail.mailOptions.from + ' Subject:' + mail.mailOptions.subject);
        }

        callback(null, message);

    });

}