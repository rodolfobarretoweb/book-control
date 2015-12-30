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
    res.render("user/form", {user : '', validation_errors : ''});
  });

  app.post('/user/save', function(req, res) {
    var data   = req.body.user,
        errors = null;

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

    errors = req.validationErrors();

    if(errors !== null) {
      res.render('user/form', {user : data, validation_errors : errors});
    }
  });
};
