var nodemailer = require('nodemailer');
 
var transports = {};
    
exports.init = function (engineer, password) {

    transports.novell = nodemailer.createTransport("SMTP", {
        host: "xgate.provo.novell.com",
        secureConnection: false,
        tls: {
            ciphers:'SSLv3'
        },
        port: 25,
        auth: {
            user: engineer,
            pass: password
        }
    });

    transports.notify = nodemailer.createTransport("Direct");
 
}

exports.get = function(name) {
    return transports[name];
}