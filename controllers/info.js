var config  = require('../config').config;
var fs      = require('fs');
var spawn   = require('child_process').spawn;

exports.info = function(req, res) {
  var rrdFile = config.rrdPath + req.params.rrd;
  //判断文件是否存在，存在则执行读取命令，不存在则抛出异常
  fs.exists(rrdFile, function(exists) {
    if (exists) {
      var info = {};
      info.rrdFile = req.params.rrd;
      info.dsList = [];
      info.rraList = [];
      rrd = spawn('rrdtool', ['info', rrdFile]);

      //将子进程执行rrdtool命令解析的RRD文件信息以字符串的形式提取出来，保存到s1中
      var data = [];
      var str = '';
      rrd.stdout.on('data', function (chunk) {
        str += chunk;
      });
      //stdout结束时，对提取出的字符串进行处理并格式化，获取相关信息
      rrd.stdout.on('end', function() {
        var lines = str.split('\n');
        for (var i in lines) {
          var line = lines[i].split(' = ');
          if (line[0] == 'last_update') {
            info.lastUpdate = parseInt(line[1]);
          } else if (line[0] == 'step') {
            info.minStep = parseInt(line[1]);
          } else if (line[0].slice(0,2)=='ds' && line[0].slice(-4)=='type') {
            info.dsList.push({
              name: line[0].slice(3,-6),
              type: line[1].slice(1,-1)
            });
          } else if (line[0].slice(0,3)=='rra' && line[0].slice(-4)=='rows') {
            info.rraList[parseInt(line[0].slice(4,-6))] = {};
            info.rraList[parseInt(line[0].slice(4,-6))]['rows'] = parseInt(line[1]);
          } else if (line[0].slice(0,3)=='rra' && line[0].slice(-11)=='pdp_per_row') {
            info.rraList[parseInt(line[0].slice(4,-6))]['step'] = info.minStep*parseInt(line[1]);
          }
        }
        res.render('info',{info:info});
      });

      //错误捕捉
      rrd.stderr.on('data', function (data_t) {
        console.log('stderr: \n' + data_t);
      });

      //子进程退出，这时stdout并不一定执行完毕
      rrd.on('exit', function (code) {
        if (code != 0) {
          console.log('Failed: ' + code);
        }
      });
    } else {
      throw new Error(rrdFile + ': doesn\'t exist!!!');
    }
  });
}
