var nodemailer = require('nodemailer'); 

exports.novell = function(engineer, password) {
    return nodemailer.createTransport("SMTP", {
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
}

exports.notify = function() {
    return nodemailer.createTransport("Direct");
}