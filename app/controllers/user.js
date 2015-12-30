module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render("user/sign");
  });

  app.get('/change_language/:language', function(req, res) {
    // Receives the value and obtain sure its format
    res.cookie('current_language', req.params.language == 'en' ? 'en' : 'br');

    res.redirect('/');
  });
};
