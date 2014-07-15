var nodemailer = require('nodemailer');

module.exports = function createNovellTransport(engineer, password) {

    // Create transport for task of [mail]
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