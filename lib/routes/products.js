'use strict';

var Product = require('../models/Product');
var products = require('express').Router();

products.route('/')
  .get(function(req, res, next) {
    Product.find().populate('category').exec(function(err, products) {
      if(err) {
        next(err);
      } else {
        res.json({count: products.length, elements: products});
      }
    });
  })
  .post(function(req, res, next) {
    var product = req.body;
    product.createdAt = product.updatedAt = new Date();
    Product.create(product, function(err, product) {
      if(err) {
        next(err);
      } else {
        res.json(product);
      }
    });
  });

products.route('/:id')
  .get(function(req, res, next) {
    Product.findById(req.params.id).populate('category').exec(function(err, product) {
      if(err) {
        next(err);
      } else {
        res.json(product);
      }
    });
  })
  .put(function(req, res, next) {
    var product = req.body;
    product.updatedAt = new Date();
    Product.findByIdAndUpdate(req.params.id, product, function(err, product) {
      if(err) {
        next(err);
      } else {
        res.json(product);
      }
    });
  })
  .delete(function(req, res, next) {
    Product.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
        next(err);
      } else {
        res.json({});
      }
    });
  });

module.exports = products;
