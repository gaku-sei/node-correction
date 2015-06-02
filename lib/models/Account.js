'use strict';

var crypto = require('crypto');

var mongoose = require('mongoose');

var hMac = function(password) {
  return crypto.createHmac('sha512', 'account-password').update(password).digest('hex');
};

var accountSchema = mongoose.Schema({
  username: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
});

accountSchema.methods.encryptPassword = function() {
  this.password = hMac(this.password);
  return this;
};

accountSchema.methods.isValid = function(password) {
  return this.password === hMac(password);
};

module.exports = mongoose.model('Account', accountSchema);
