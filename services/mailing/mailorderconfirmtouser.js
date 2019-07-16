const nodemailer = require('nodemailer');
//const ejs = require('ejs');
//const fs = require('fs');

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

function sendOrderMail(orderId, recipientEmail) {
  let mailOptions = {
    from: 'svarkaclubinfo@gmail.com',
    to: recipientEmail,
    subject: 'Вы оформили новый заказ',
    html:
      '<b>Вы оформили новый заказ</b><p>Номер заказа: ' +
      orderId +
      '</p><p>Наши менеджеры свяжутся с Вами в ближайшее время!</p>'
  };

  //html: ejs.render( fs.readFileSync('e-mail.ejs', 'utf-8') , {mensagem: 'olá, funciona'})

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message about order #' + orderId + ' tocustomer sent.');
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

module.exports = {
  sendOrderMail
};
