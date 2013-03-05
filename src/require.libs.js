var reqjs = require('requirejs');

module.exports = function(callback) {
  reqjs.tools.useLib(function(require) {
    var modules = {
      'parse' : require('parse'),
      'build' : require('build'),
      'prim' : require('prim')
    };
    callback(modules);
  });
};