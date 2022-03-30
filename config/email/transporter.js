const nodemailer = require('nodemailer');

const smtpConfig = require('./smtp.js');

const transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: false,
    auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass
    },
    tls: {
        rejectUnauthorized: false
    }
});

module.exports = transporter;