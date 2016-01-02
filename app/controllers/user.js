module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render("user/sign");
  });

  app.get('/user/change_language/:language', function(req, res) {
    // Receives the value and obtain sure its format
    res.cookie('current_language', req.params.language == 'en' ? 'en' : 'br');

    res.redirect('/');
  });

  app.get('/user/register', function(req, res) {
    res.render("user/form", {user : '', errors : ''});
  });

  app.post('/user/save', function(req, res) {
    var merge = require('merge'),
        dateFormat = require('dateformat'),
        HMAC_SHA512 = require('crypto-js/hmac-sha512'),
        ENV = require('../config/env.js'),
        data = req.body.user,
        validation_errors = null,
        user_model = app.models.user;

    // initialize the model
    user_model.initialize();

    req.checkBody({
      'user[email]' : {
        notEmpty : true,

        isEmail : {
          errorMessage : res.__('validator.invalid_email')
        },

        errorMessage : res.__('validator.empty', {field : res.__('email')})
      },

      'user[password]' : {
        notEmpty: true,

        isLength : {
          options : [6, 20],
          errorMessage : res.__('validator.length', {field : res.__('password'), first_choise : 6, second_choise : 20})
        },

        isAlphanumeric : {
          errorMessage : res.__('validator.alphanumeric', {field : res.__('password')})
        },

        errorMessage : res.__('validator.empty', {field : res.__('password')})
      }
    });

    validation_errors = req.validationErrors();

    // Display all erros of form validation
    if(validation_errors) {
      res.render('user/form', {user : data, errors : validation_errors});

      return false;
    }

    user_model.getDataToCheckDuplicateEmail(data, function(count){

    });

    if(user_model.checkDuplicateUser(data)) {
      res.render('user/form', {user : data, errors : [{msg : res.__('duplicate_email')}]});

      return false;
    }

    // Encrypt the password
    data.password = HMAC_SHA512(data.password, ENV.ENCRYPTION_KEY).toString();

    user_model.save(
      merge(data, {created_at : dateFormat(new Date(), 'yyyy-mm-dd')}),

      function(error) {
        if(error !== null) {
          res.render('user/form', {user : data, errors : [{msg : res.__('database_error')}]});
        } else {
          res.redirect('/');
        }
      }
    );
  });
};
