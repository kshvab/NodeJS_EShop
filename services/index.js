const novaposhta = require('./novaposhta');
//const catscreating = require('./catscreating');
//const itemscreating = require('./itemscreating');
const mailorderconfirmtouser = require('./mailing/mailorderconfirmtouser');
const photoparsing = require('./photoparsing');
const order2xls = require('./order2xls');
const shopxmlparsing = require('./shopxmlparsing');
const cronautoimport = require('./cronautoimport');
const mailformtoadmins = require('./mailing/mailformtoadmins');

module.exports = {
  novaposhta,
  //catscreating,
  //itemscreating,
  photoparsing,
  order2xls,
  shopxmlparsing,
  cronautoimport,
  mailorderconfirmtouser,
  mailformtoadmins
};
