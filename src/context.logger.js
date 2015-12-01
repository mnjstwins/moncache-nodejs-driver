var IO = require('fs');

var logsDirectory = './logs';

if (!IO.existsSync(logsDirectory)) {
  IO.mkdirSync(logsDirectory);
}

var intel = require('intel');
intel.basicConfig({
  file: logsDirectory + '/logs.log',
  format: '[%(date)s] %(name)s.%(levelname)s: %(message)s',
  level: intel.TRACE
});

module.exports = function(name) {
  return intel.getLogger(name);
};