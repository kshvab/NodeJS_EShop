// Require library
const excel = require('excel4node');
const nodemailer = require('nodemailer');

const config = require('../config');

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

function sendOrderMailXLSX(orderId, filename, path) {
  let mailOptions = {
    from: 'svarkaclubinfo@gmail.com',
    to: config.MAILING_ADMINS,
    subject: 'Оформлен новыйзаказ №' + orderId,
    html: '<b>Оформлен новыйзаказ</b><br>Номер заказа: ' + orderId,
    attachments: [
      {
        filename,
        path // stream this file
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('XLS FILE - Order #' + orderId + ' to IGOR sent.');
    console.log('Message %s sent: %s', info.messageId, info.response);
  });
}

function order2XLS(order) {
  //console.log('order \n' + order);

  // Create a new instance of a Workbook class
  var workbook = new excel.Workbook();

  // Add Worksheets to the workbook
  var worksheet = workbook.addWorksheet('Sheet 1');
  worksheet.column(1).setWidth(30);
  worksheet.column(2).setWidth(12);
  worksheet.column(3).setWidth(15);
  worksheet.column(4).setWidth(15);
  worksheet.column(5).setWidth(15);
  worksheet.column(6).setWidth(12);
  worksheet.column(7).setWidth(12);
  worksheet.column(8).setWidth(12);

  //worksheet.row(1).setHeight(20);

  // Create a reusable style
  var userStyle = workbook.createStyle({
    font: {
      bold: true,
      color: '#FF0800',
      size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  var shopcartStyle = workbook.createStyle({
    font: {
      bold: true,
      color: '#001684',
      size: 12
    },
    numberFormat: '$#,##0.00; ($#,##0.00); -'
  });

  var summStyle = workbook.createStyle({
    font: {
      bold: true
    },
    numberFormat: '#,##0.00; (#,##0.00); -'
  });
  worksheet
    .cell(1, 1)
    .string('_id заказа')
    .style(userStyle);

  worksheet.cell(1, 2).number(order._id);

  worksheet
    .cell(3, 1)
    .string('Пользователь')
    .style(userStyle);
  worksheet.cell(3, 2).string(order.user.name);

  worksheet
    .cell(4, 1)
    .string('Группа')
    .style(userStyle);
  worksheet.cell(4, 2).string(order.user.group);

  worksheet
    .cell(5, 1)
    .string('Логин')
    .style(userStyle);
  worksheet.cell(5, 2).string(order.user.login);

  worksheet
    .cell(6, 1)
    .string('id пользователя')
    .style(userStyle);
  worksheet.cell(6, 2).string(order.user._id);

  worksheet
    .cell(7, 1)
    .string('Клиент агента')
    .style(userStyle);
  worksheet.cell(7, 2).string(order.user.customer);

  worksheet
    .cell(8, 1)
    .string('Еmail')
    .style(userStyle);
  worksheet.cell(8, 2).string(order.user.email);

  worksheet
    .cell(9, 1)
    .string('Телефон')
    .style(userStyle);
  worksheet.cell(9, 2).string(order.user.phonenumber);

  worksheet
    .cell(10, 1)
    .string('Способдоставки')
    .style(userStyle);
  worksheet.cell(10, 2).string(order.user.deliveryType);

  worksheet
    .cell(11, 1)
    .string('Город')
    .style(userStyle);
  worksheet.cell(11, 2).string(order.user.deliveryCity);

  worksheet
    .cell(12, 1)
    .string('Отделение')
    .style(userStyle);
  worksheet.cell(12, 2).string(order.user.deliveryDepartment);

  worksheet
    .cell(13, 1)
    .string('Способ платежа')
    .style(userStyle);
  worksheet.cell(13, 2).string(order.user.paymentMethod);

  worksheet
    .cell(14, 1)
    .string('Комментарий к заказу')
    .style(userStyle);
  worksheet.cell(14, 2).string(order.user.ordercomment);

  worksheet
    .cell(16, 1)
    .string('КОРЗИНА ТОВАРОВ')
    .style(shopcartStyle);

  worksheet
    .cell(17, 1)
    .string('Наименование')
    .style(shopcartStyle);

  worksheet
    .cell(17, 2)
    .string('vendorCode')
    .style(shopcartStyle);

  worksheet
    .cell(17, 3)
    .string('Вход цена, дол')
    .style(shopcartStyle);

  worksheet
    .cell(17, 4)
    .string('Прод цена, грн')
    .style(shopcartStyle);

  worksheet
    .cell(17, 5)
    .string('Баз цена,грн')
    .style(shopcartStyle);

  worksheet
    .cell(17, 6)
    .string('Изобр')
    .style(shopcartStyle);

  worksheet
    .cell(17, 7)
    .string('Группа')
    .style(shopcartStyle);

  worksheet
    .cell(17, 8)
    .string('Количество')
    .style(shopcartStyle);

  worksheet
    .cell(17, 9)
    .string('Сумма')
    .style(shopcartStyle);

  let shopcart = order.shopcart;
  let totalUah = 0;
  for (let i = 0; i < shopcart.length; i++) {
    worksheet.cell(17 + 1 + i, 1).string(shopcart[i].name);

    worksheet.cell(17 + 1 + i, 2).string(shopcart[i].vendorCode);

    //worksheet.cell(17 + 1 + i, 3).number(+shopcart[i].inputPriceUsd);

    worksheet.cell(17 + 1 + i, 4).number(+shopcart[i].price);

    worksheet.cell(17 + 1 + i, 5).number(+shopcart[i].basePrice);

    worksheet.cell(17 + 1 + i, 6).string(shopcart[i].picture);

    worksheet.cell(17 + 1 + i, 7).string(shopcart[i].groups);

    worksheet.cell(17 + 1 + i, 8).number(+shopcart[i].quantity);

    worksheet
      .cell(17 + 1 + i, 9)
      .number(shopcart[i].quantity * shopcart[i].price)
      .style(summStyle);
    totalUah += shopcart[i].quantity * shopcart[i].price;
  }
  worksheet
    .cell(17 + 2 + shopcart.length, 8)
    .string('ИТОГО:')
    .style(userStyle);
  worksheet
    .cell(17 + 2 + shopcart.length, 9)
    .number(totalUah)
    .style(summStyle);

  let orderId = order._id;
  let path = './ftpshared/xlsx_orders/xlsx_order_' + order._id + '.xlsx';
  let filename = 'xlsx_order_' + order._id + '.xlsx';
  workbook.write(path, function(err, stats) {
    if (err) {
      console.error(err);
    } else {
      console.log('XLS saved (k.8)'); // Prints out an instance of a node.js fs.Stats object
      sendOrderMailXLSX(orderId, filename, path);
    }
  });
}
module.exports = {
  order2XLS
};
