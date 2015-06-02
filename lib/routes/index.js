'use strict';

var passport = require('passport');
var Router = require('express').Router;

var Account = require('../models/Account');

var main = Router();
var api = Router();

main.route('/login')
  .get(function(req, res) {
    res.render('login', {message: req.flash('message')});
  })
  .post(passport.authenticate('local', {
    successRedirect: '/', failureRedirect: '/login', failureFlash: true, successFlash: true
  }));

main.route('/signin')
  .get(function(req, res) {
    res.render('signin');
  })
  .post(function(req, res) {
    var account = new Account(req.body);
    account.encryptPassword();
    account.save(function(err, account) {
      res.redirect('login');
    });
  });

main.get('/logout', function(req, res) {
  req.logout();
  res.redirect('login');
});

main.get('/account', function(req, res) {
  if(req.user) {
    var account = {};
    ['_id', 'username'].forEach(function(attr) {
      account[attr] = req.user[attr];
    });
    res.json(account);
  } else {
    res.status(404).json({error: 'Not found'});
  }
});

api.use('/products', require('./products'));
api.use('/categories', require('./categories'));
main.use('/api', api);

module.exports = main;
