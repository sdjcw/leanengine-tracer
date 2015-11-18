'use stract';
var tracer = require('./..');
var AV = require('leanengine');
AV.initialize("c3qmjo603iorb46fs3iqy8h6rfio40lqby0reb26fgslq94a", "irp03bat0v15v4k6fm1rc9lodkrwlc33oyxmhjwjsj3vm65f");

var create = exports.create = function(cb) {
  tracer.pin();
  var obj = new AV.Object('TestClass');
  obj.save({foo: 'bar'}, {
    success: function(obj) {
      tracer.pin();
      cb(null);
    }, error: function(obj, err) {
      tracer.pin();
      cb(null);
    }
  });
};

var find = exports.find = function(cb) {
  tracer.pin();
  var q = new AV.Query('TestClass');
  q.find().then(function(objs) {
    tracer.pin();
    cb(null, objs);
  });
};

exports.mix = function(cb) {
  tracer.pin();
  create(function(err) {
    tracer.pin();
    setTimeout(function() {
      find(function(err, objs) {
        tracer.pin();
        cb(err, objs);
      })
    }, 1000);
  });
}
