'use stract';
var express = require('express');
var router = express.Router();
var tracer = require('../..');
var testModel = require('../test');

/* GET home page. */
router.get('/', function(req, res, next) {
  tracer.pin();
  testModel.mix(function() {
    res.render('index', { title: 'Express' });
  });
});

module.exports = router;
