var setops = require('setops'),
    myUtil = require('./myUtil');

module.exports = function(req, res) {
    var envelope = req.body;
    // var stufftoparse = ['tyler.adsver', 'tylerdavidharris@klofecom', 'tylerdavidharris@gmail.com', 'tylerdavid.com'];

    async.waterfall([
        function(callback) {
            var recipients = [];

            stufftoparse.forEach(function(item, index, array) {

                var empty = myUtil.isEmpty(item);
                if(!empty) {
                    recipients = setops(recipients).union(item.split(','));
                }

                if (index === array.length - 1) {
                     console.log('calling to validateRecipients...' + recipients);
                     callback(null, recipients);
                 }
                
            });
        },
        function(recipients, callback) { 
            console.log(recipients);
            callback(null, recipients);
        },
        function(recipients, callback) {
            console.log('sending mail...');
            callback(null, recipients);
        }
    ], function (err, result) {
       // result now equals 'done' 
       console.log(result);  
    });

}

exports.parseRecipients = function(array, callback) { 
	// Do some parsing, string-->array, merge into a single array from user input (comma dileneated list)
    var recipients = [];

    array.forEach(function(item, index, array) {

        var empty = myUtil.isEmpty(item);
        if(!empty) {
            recipients = setops(recipients).union(item.split(','));
        }

        if (index === array.length - 1) {
             callback(null, recipients);
         }
        
    });

}

exports.validateRecipients = function(recipients, callback) {

    function looksLegit(str) {
        var lastAtPos = str.lastIndexOf('@');
        var lastDotPos = str.lastIndexOf('.');
        return (lastAtPos < lastDotPos && lastAtPos > 0 && str.indexOf('@@') == -1 && lastDotPos > 2 && (str.length - lastDotPos) > 2);
    }

	recipients.forEach(function(address, index, array){
		// splice index of address from array if not valid
        if(!looksLegit(email)){
          array.splice(index);
        }
		if(index === array.length - 1) {
			callback(null, array);
		}
	});
	
}

exports.sendMail = function(recipients, callback) {
	// Create sendOptions, create smtpTransport, do async send
    console.log('sending mail...');
    callback(recipients);
}



// 
// 
// 
// 
// 
// 
// function(req, res) {
//     var report = [],
//         formData = req.body,
//         eventHeader = '[' + formData.engineer + ']',
//         hasPassword="",
//         transport = nodemailer.createTransport("SMTP", {
//             host: "xgate.provo.novell.com",
//             secureConnection: false,
//             tls: {
//                 ciphers:'SSLv3'
//             },
//             port: 25,
//             auth: {
//                 user: formData.engineer,
//                 pass: formData.password
//             }
//         });

//     if(typeof formData.password != "undefined") { hasPassword='with credentials' }
//     logme.info(eventHeader + ' Received new sendMail request ' + formData.emails.length + ' email(s): sendFromUser is', formData.fromUser, hasPassword);

//     logme.info(eventHeader + ' Validating', formData.emails.length + ' email(s)');

//     formData.emails.forEach(function(mail, index) {
//         async.series({
//             one: mailApp.prepMail(mail, callback),
//             two: function(callback){
//                 setTimeout(function(){
//                     callback(null, 2);
//                 }, 200);
//             },
//             three: function(callback){
//                 setTimeout(function(){
//                     callback(null, 3);
//                 }, 200);
//             }
//         },
//         function(err, results) {
//             console.log(results);
//         });
//     });

//     formData.emails.forEach(function(mail, index) {
            

//             // Validate emailAddresses
//             if (!skipValidate) {
//                 validateEmailAddresses(checkEmailAddresses, function(recipients) {
//                     if (myUtil.isEmpty(recipients)) {
//                         var error = 'No email addresses! ' + mail.sr + ' ' + mail.brief;
//                         // api.invalid(req, res, [error]);
//                         logme.warning(eventHeader + ' No valid email addresses for SR ' + mail.sr);
//                     } else {
//                         mail.subject = "SR " + mail.sr + " - " + mail.brief + " +";
//                         var mailOptions = {
//                             from: formData.engineer + "@novell.com",
//                             to: recipients,
//                             cc: "support@novell.com",
//                             subject: "SR " + mail.sr + " - " + mail.brief + " +EO",
//                             html: formData.content + formData.signature
//                         };

//                         transport.sendMail(mailOptions, function(error, response){
//                             var message = eventHeader + ' [mail ' + index + '] ' + mail.subject + ' to ' + recipients;
//                             if(error){
//                                 // api.badRequest(req, res, message)
//                                 logme.error(message + ' | Failed to send: ' + response.message);
//                                 report.push(message + ' | Failed to send: ' + response.message);
//                             }else{
//                                 // api.ok(req, res, message);
//                                 logme.info(message + ' | Sent: ' + response.message);
//                                 report.push(message + ' | Sent: ' + response.message);
//                             }

//                         });
//                     }    
//                 });
//             }

//         }); 
// };