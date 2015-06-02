'use strict';

var mongoose = require('mongoose');

var categorySchema = mongoose.Schema({
  name: String,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Category', categorySchema);
