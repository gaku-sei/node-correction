'use strict';

var Category = require('../models/Category');
var categories = require('express').Router();

categories.route('/')
  .get(function(req, res, next) {
    Category.find(function(err, categories) {
      if(err) {
        next(err);
      } else {
        res.json({count: categories.length, elements: categories});
      }
    });
  })
  .post(function(req, res, next) {
    var category = req.body;
    category.createdAt = category.updatedAt = new Date();
    Category.create(category, function(err, category) {
      if(err) {
        next(err);
      } else {
        res.json(category);
      }
    });
  });

categories.route('/:id')
  .get(function(req, res, next) {
    Category.findById(req.params.id, function(err, category) {
      if(err) {
        next(err);
      } else {
        res.json(category);
      }
    });
  })
  .put(function(req, res, next) {
    var category = req.body;
    category.updatedAt = new Date();
    Category.findByIdAndUpdate(req.params.id, category, function(err, category) {
      if(err) {
        next(err);
      } else {
        res.json(category);
      }
    });
  })
  .delete(function(req, res, next) {
    Category.findByIdAndRemove(req.params.id, function(err) {
      if(err) {
        next(err);
      } else {
        res.json({});
      }
    });
  });

module.exports = categories;
