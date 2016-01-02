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
        SHA512 = require('crypto-js/sha512'),
        ENV = require('../config/env.js'),
        data = req.body.user,
        validation_errors = null,
        user = null;

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
    } else {
      // Encrypt the password
      data.password = SHA512(data.password).toString();

      // Add data to object
      user = app.models.user.initialize(
        merge(data, {created_at : dateFormat(new Date(), 'yyyy-mm-dd')})
      );

      user.save(function(error) {
        if(error !== null) {
          if(ENV.ENVIRONMENT === 'developer') console.dir(error);

          res.render('user/form', {user : data, errors : [{msg : res.__('database_error')}]});
        } else {
          res.redirect('/');
        }
      });
    }
  });
};
