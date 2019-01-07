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
    process.env.PUBLICATIONS_PICTURE_SAVE_DESTINATION || 'publication_images'
};
