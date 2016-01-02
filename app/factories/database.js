var caminte = require('caminte'),
    ENV     = require('../config/env.js'),
    Schema  = caminte.Schema,
    wrapper = null;

wrapper = function() {
  return new Schema("mysql", {
    driver   : "mysql",
    host     : ENV.MYSQL_HOST,
    port     : ENV.MYSQL_PORT,
    username : ENV.MYSQL_USERNAME,
    password : ENV.MYSQL_PASSWORD,
    database : ENV.MYSQL_DATABASE,
    pool     : false
  });
};

module.exports = function() {
  return wrapper;
};
