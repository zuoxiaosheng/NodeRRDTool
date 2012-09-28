var rrdtool = require('../libs/rrd/rrdtool');
var config  = require('../config').config;

exports.graph = function(req, res) {
	var rrd = req.params.rrd;
	var file = new rrdtool.RRDFile(config.rrdPath + rrd);
	var info = {};
	info.rrdFile = rrd;
	info.dsNames = file.getDSNames();
	info.rraCount = file.getRRACount();
	res.render('graph', {info:info});
}