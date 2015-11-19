'use strict';
var domain = require('domain');
var onHeaders = require('on-headers');

var limit;

var tracer = module.exports = function(options) {
  limit = options.limit * 1000000;
  return function(req, res, next) {
    var d = domain._stack[0];
    if (!d) {
      d = domain.create();
      d.add(req);
      d.add(res);
      d.run(next);
    }
    var start = process.hrtime();
    d._leanengineTracer = {last: start, stack: new Error().stack};

    onHeaders(res, function() {
      var duration = getDuration();
      if (duration > limit) {
        console.log('tracer:', getCodePoint(domain._stack[0]._leanengineTracer.stack), '->', getCodePoint(new Error().stack), duration / 1000000, 'ms');
      }
    });
  };
};

tracer.pin = function() {
  if (!domain._stack[0]) {
    return console.error('OMG...');
  }
  var duration = getDuration();
  if (duration > limit) {
    console.log('tracer:', getCodePoint(domain._stack[0]._leanengineTracer.stack), '->', getCodePoint(new Error().stack), duration / 1000000, 'ms');
  }
  domain._stack[0]._leanengineTracer = {
    last: process.hrtime(),
    stack: new Error().stack
  };
};

var getDuration = function() {
  var diff = process.hrtime(domain._stack[0]._leanengineTracer.last);
  return (diff[0] * 1e9 + diff[1]);
};

var getCodePoint = function(stack) {
  var end = 5; // stack 第一行字符数
  var start, line;
  // 找到第一个不是 tracer 的堆栈行
  do {
    start = end + 1;
    end = stack.indexOf('\n', start + 1);
    line = stack.slice(start, end);
  } while (line.indexOf(__filename) >= 0);
  var names = line.split('/');
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
