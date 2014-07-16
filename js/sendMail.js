var logme = require('logme');

module.exports = function sendMail(mail, callback) {

    var eventHeader = '[' + mail.engineer + '] [mail] ';

    // Debug
    // console.log(eventHeader + ' sending ' + mailOptions);

    // Send mail through transport
    console.log('\n\nNovell Transport: \n', mail.transport, '\n\n');
    mail.transport.sendMail(mail.mailOptions, function(error, response){

        // close the transport first
        mail.transport.close();

        var message,
            mailInfo = mail.mailOptions.subject + ' to: ' + mail.mailOptions.to + ' from: ' + mail.mailOptions.from;
            
        if(error){
            message = 'Failed to send: <b style="color: red">' + error + '</b> | ' + mailInfo;
            logme.error('Failed to send: ', error + ' | ' + mailInfo);
        }else{
            message = 'Sent: <b style="color: green">' + response.message + ' ✔</b> | ' + mailInfo;
            logme.info('Sent: ' + response.message + ' | ' + mailInfo);
        }

        callback(null, message);

    });

}