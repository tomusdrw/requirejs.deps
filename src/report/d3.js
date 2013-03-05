var _ = require('underscore');

var moduleToName = function(module) {
    return module.name;
  };

var flatten = function(moduleDeps) {
    var flattened = {};

    var queue = moduleDeps;
    var module = queue.pop();
    while(module) {
      if(!flattened[module.name]) {
        flattened[module.name] = {
          name: module.name,
          deps: module.deps.map(moduleToName)
        };

        queue.push.apply(queue, module.deps);
      }
      module = queue.pop();
    }

    return flattened;
  };

module.exports = function(modulesDeps) {
  //first we need to flatten the data
  var flattened = flatten(modulesDeps);

  //Now we have to create nodes and links object
  var nodes = _.values(flattened).map(function(module, idx) {
    //update flattened object with indices
    flattened[module.name].idx = idx;
    return {
      name: module.name
    };
  });

  var links = [];
  _.each(flattened, function(module) {
    _.each(module.deps, function(depName) {
      links.push({
        source: module.idx,
        target: flattened[depName].idx
      });
    });
  });

  return {
    nodes: nodes,
    links: links
  };
};