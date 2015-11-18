# Lanengine-tracer

一个监控程序执行耗时的插件，通过设置阈值和打点，能将执行耗时超过阈值的点记录下来。



## 安装

``` 
npm install --save sdjcw/leanengine-tracer
```



## 使用

``` 
...
var tracer = require('leanengine-tracer');
...

var app = ...
app.use(tracer({limit: 100})) // 阈值，单位毫秒，超过该值则输出日志

exports.mix = function(cb) {
  tracer.pin(); // 打点
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
```



示例输出：

``` 
tracer: /Us/ch/wo/le/te/no/ex/li/ro/layer.js:82: -> /Us/ch/wo/le/te/ro/index.js:9:10 2.882666 ms
tracer: /Us/ch/wo/le/te/test.js:7:1 -> /Us/ch/wo/le/te/test.js:11:1 215.287499 ms
tracer: /Us/ch/wo/le/te/test.js:32:12 -> /Us/ch/wo/le/te/test.js:21:1 1003.393078 ms
tracer: /Us/ch/wo/le/te/test.js:21:1 -> /Us/ch/wo/le/te/test.js:24:12 165.777347 ms
tracer: /Us/ch/wo/le/te/test.js:35:16 -> /Us/ch/wo/le/no/on/index.js:46:1 206.589918 ms
```

