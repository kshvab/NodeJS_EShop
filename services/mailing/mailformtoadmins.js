const nodemailer = require('nodemailer');

const config = require('../../config');

var transporter = nodemailer.createTransport({
  service: config.MAILING_SERVISE,
  auth: {
    user: config.MAILING_USER,
    pass: config.MAILING_PASS
  },
  tls: {
    secureProtocol: 'TLSv1_method'
  }
});

function sendFormMail(htmlMsg) {
  let mailOptions = {
    from: 'svarkaclubinfo@gmail.com',
    to: config.MAILING_ADMINS,
    subject: 'Сообщение через форму обратной связи',
    html: htmlMsg
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message from main contactsform sent.');
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports = {
  sendFormMail
};
