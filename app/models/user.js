module.exports = function(app) {
  var User = null;

  return {
    initialize : function() {
      var schema = app.factories.database();

      User = schema.define('users', {
        created_at : {type : schema.Date, "null" : false},
        deleted_in : {type : schema.Date, "null" : true},
        email      : {type : schema.String, limit : 80, unique : true, "null" : false},
        password   : {type : schema.String, limit : 255, unique : true, "null" : false}
      });
    },

    save : function(data, callback) {
      new User(data).save(function(error) {
        callback(error);
      });
    },

    getDataToCheckDuplicateEmail : function(data, callback) {
      var merge  = require('merge'),
          params = {email : data.email};

      if(data.id != undefined) merge(params, {id : data.id});

      User.count({where : params}, function(error, count) {
        callback(count);
      });
    }
  }
};
