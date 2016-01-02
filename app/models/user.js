module.exports = function(app) {
  return {
    initialize : function(data) {
      var schema = app.factories.database(),

          User = schema.define('users', {
            created_at : {type : schema.Date, "null" : false},
            deleted_in : {type : schema.Date, "null" : true},
            email      : {type : schema.String, limit : 80, unique : true, "null" : false},
            password   : {type : schema.String, limit : 255, unique : true, "null" : false}
          });

      return new User(data);
    }
  }
};
