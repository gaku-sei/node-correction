'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');

var routes = require('./routes');

var Account = require('./models/Account');

var messages = [];

mongoose.connect('mongodb://localhost/ecomm', function(err) {
  if(err) {
    console.error(err);
  }
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new LocalStrategy({
  usernameField : 'username',
  passwordField : 'password',
  passReqToCallback : true
}, function(req, username, password, done) {
  Account.findOne({username: username}, function(err, account) {
    if(account) {
      if(account.isValid(password)) {
        done(null, account);
      } else {
        done(null, false, req.flash('message', 'Mot de passe non valide'));
      }
    } else {
      done(null, false, req.flash('message', 'Nom utilisateur non valide'));
    }
  });
}));

app.set('view engine', 'jade')
app.set('views', __dirname + '/views/')

app.use('/vendors', express.static(__dirname + '/../public/vendors'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('I am secret'));
app.use(session({resave: true, saveUninitialized: true, secret: 'I am secret too', cookie: {maxAge: 1000 * 60 * 60 * 24}}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(err, req, res, next) {
  console.error('foo:'+err.stack);
  res.status(500).json(err);
});

app.use(routes);

app.use(function(req, res, next) {
  if(req.user) {
    app.use(express.static(__dirname + '/../public'));
    next();
  } else {
    res.redirect('login');
  }
});

server.listen(3000, function() {
  console.log('Serveur démarré sur le port 3000');
});

io.on('connection', function(socket) {
  socket.emit('all messages', messages);

  socket.on('new message', function(data) {
    messages.push(data);
    io.emit('new message', data);
  });
});
