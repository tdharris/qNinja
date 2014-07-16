var nodemailer = require('nodemailer');

exports.init = function (engineer, password) {

    this.engineer = engineer;
    this.password = password;

}

// Transport for tasks
exports.novell = nodemailer.createTransport("SMTP", {
    host: "xgate.provo.novell.com",
    secureConnection: false,
    tls: {
        ciphers:'SSLv3'
    },
    port: 25,
    auth: {
        user: this.engineer,
        pass: this.password
    }
});

// Transport for report
exports.notify = nodemailer.createTransport("Direct");