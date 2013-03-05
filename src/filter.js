var _ = require('underscore');

var findConnection = function findConnection(module, why) {
    var markModule = false;
    _.each(module.deps, function(deps) {
      if(deps.name === why || findConnection(deps, why)) {
        deps.marked = true;
        markModule = true;
      }
    });
    module.marked = markModule;
    return markModule;
  };

var filter = function filter(module) {
    if(module.marked) {
      var deps = [];
      _.each(module.deps, function(dep) {
        var filtered = filter(dep);
        if(filtered) {
          deps.push(filtered);
        }
      });

      module.deps = deps;
      return module;
    }
    return false;
  };

/*
 * Filter only paths that ends with "why"
 */
module.exports = function(moduleDeps, why) {
  // mark modues that should stay
  _.each(moduleDeps, function(module) {
    findConnection(module, why);
  });

  // filter not marked modules
  var ret = [];
  _.each(moduleDeps, function(module) {
    var filtered = filter(module);
    if(filtered) {
      ret.push(filtered);
    }
  });

  return ret;
};