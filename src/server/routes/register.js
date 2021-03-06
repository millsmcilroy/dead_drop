var express = require('express');
var router = express.Router();
var passport = require('../db/lib/auth');
var helpers = require('../db/lib/helper');
var knex = require('../db/knex.js');

// Route to GET the endpoint /register and display the newaccount.html view
router.get('/', function(req, res, next) {
    var error = req.flash('regError');
    res.render('newaccount', { title: 'Create An Account!', error: error });
  });

//route to POST a new user to the database
  router.post('/', function(req, res, next) {
    var userEmail = req.body.email;
    var userPassword = req.body.password;
    var userName = req.body.username;
    // check if email and username is unique
    knex('users').where('email', userEmail).orWhere({username: userName})
    .then(function(data) {
      // if email is not unique, send an error
      if (data.length) {
        req.flash('regError', {status: 'danger', value: 'Email or username has been taken, try another.'});
        return res.redirect('/register');
      } else {
          // else insert email and password
          hashedPassword = helpers.hashing(userPassword);
          knex('users').insert({
          username: userName,
          email: userEmail,
          password: hashedPassword,
          admin: false,
          banned: false

      }).then(function(data) {
          req.flash('message', {status: 'success', value: 'Your account has been created successfully!'});
          return res.redirect('/login');
      })
      .catch(function(err) {
          req.flash('message', {status: 'danger', value: 'Something went wrong. Shit. Ask someone about something.'});
          return res.redirect('/login');
        });
    }
    })
    .catch(function(err) {
      return next(err);
    });
  });

module.exports = router;