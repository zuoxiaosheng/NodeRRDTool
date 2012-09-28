var list = require('./controllers/list');
var info = require('./controllers/info');
var raw = require('./controllers/raw');
var graph = require('./controllers/graph');

exports = module.exports = function(app) {
  app.get('/', list.list);
  app.get('/info/:rrd', info.info);
  app.get('/raw/:rrd', raw.raw);
  app.get('/data/:rrd/:ds/:rra', raw.data);
  app.get('/fresh/:rrd/:ds/:rra', raw.fresh);
  app.get('/graph/:rrd', graph.graph);
}
