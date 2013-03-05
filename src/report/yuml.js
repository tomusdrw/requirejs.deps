var _ = require('underscore');
var flatten = require('./flatten');

module.exports = function(moduleDeps) {
  //first we need to flatten the data
  var flattened = flatten(moduleDeps);

  _.each(flattened, function(module) {
    _.each(module.deps, function(depName) {
      console.log('[' + module.name + ']->[' + depName + ']');
    });
  });
};