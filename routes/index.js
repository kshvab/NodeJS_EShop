const auth = require('./auth');
const profile = require('./profile');
const mainpage = require('./mainpage');
const administrator = require('./administrator');
const adminusers = require('./adminusers');
const adminpublications = require('./adminpublications');
const upload = require('./upload');
const shop = require('./shop');

module.exports = {
  administrator,
  adminpublications,
  adminusers,
  auth,
  mainpage,
  profile,
  shop,
  upload
};
