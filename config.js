const dotenv = require('dotenv');
const path = require('path');

const root = path.join.bind(this, __dirname);
dotenv.config({ path: root('.env') });

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URL: process.env.MONGO_URL,
  SESSION_SECRET: process.env.SESSION_SECRET,
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  LIST_ITEMS_PER_PAGE: process.env.LIST_ITEMS_PER_PAGE || 20,
  PUBLICATIONS_PICTURE_SAVE_DESTINATION:
    process.env.PUBLICATIONS_PICTURE_SAVE_DESTINATION,
  SHOP_PICTURE_SAVE_DESTINATION: process.env.SHOP_PICTURE_SAVE_DESTINATION,
  MAILING_SERVISE: process.env.MAILING_SERVISE,
  MAILING_USER: process.env.MAILING_USER,
  MAILING_PASS: process.env.MAILING_PASS,
  MAILING_ADMINS: process.env.MAILING_ADMINS,
  GOOGLE_MAP_API: process.env.GOOGLE_MAP_API
};
