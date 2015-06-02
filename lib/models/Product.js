'use strict';

var mongoose = require('mongoose');

var productSchema = mongoose.Schema({
  name: String,
  price: Number,
  category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  description: String,
  createdAt: Date,
  updatedAt: Date
});

module.exports = mongoose.model('Product', productSchema);
