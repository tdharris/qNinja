var logme = require('logme');

module.exports = function sendMail(transport, mailOptions, callback) {

    var eventHeader = '[' + task.engineer + '] [mail] ';

    // Debug
    // console.log(eventHeader + ' sending ' + mailOptions);

    // Send mail through transport
    transport.sendMail(mailOptions, function(error, response){

        // close the transport first
        transport.close();

        var message,
            mailInfo = mailOptions.subject + ' to: ' + mailOptions.to + ' from: ' + mailOptions.from;
            
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