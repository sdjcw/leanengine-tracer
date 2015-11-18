'use strict';
var domain = require('domain');
var onHeaders = require('on-headers');

var limit;

var tracer = module.exports = function(options) {
  limit = options.limit * 1000000;
  return function(req, res, next) {
    var d = process.domain;
    if (!d) {
      d = domain.create();
      d.add(req);
      d.add(res);
      d.run(next);
    }
    var start = process.hrtime();
    d._tracer = {last: start, codeLine: getCodePoint()};

    onHeaders(res, function() {
      var duration = getDuration();
      if (duration > limit) {
        console.log('tracer:', process.domain._tracer.codeLine, '->', getCodePoint(), duration / 1000000, 'ms');
      }
    });
  };
};

tracer.pin = function() {
  if (!process.domain) {
    return console.error('OMG...');
  }
  var duration = getDuration();
  if (duration > limit) {
    console.log('tracer:', process.domain._tracer.codeLine, '->', getCodePoint(), duration / 1000000, 'ms');
  }
  process.domain._tracer = {
    last: process.hrtime(),
    codeLine: getCodePoint()
  };
};

var getDuration = function() {
  var diff = process.hrtime(process.domain._tracer.last);
  return (diff[0] * 1e9 + diff[1]);
};

var getCodePoint = function() {
  var stack = new Error().stack;
  var start = stack.indexOf('\n', stack.indexOf('\n', stack.indexOf('\n', 6)) + 1) + 1; // 异常堆栈第四行的开头
  var end = stack.indexOf('\n', start + 1);
  
  var codeLine = stack.slice(start, end);
  var names = codeLine.split('/');
  var result = names.map(function(name) {
    return name.slice(0, 2);
  }).slice(0, -1).join('/');
  var targetFile = names[names.length - 1];
  if (targetFile[targetFile.length -1] === ')') {
    targetFile = targetFile.slice(0, targetFile.length -2);
  }
  result += '/' + targetFile;
  
  return result.trim();
};
