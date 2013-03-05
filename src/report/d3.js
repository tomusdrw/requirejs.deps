var _ = require('underscore');
var flatten = require('./flatten');

module.exports = function(modulesDeps) {
  //first we need to flatten the data
  var flattened = flatten(modulesDeps);

  //Now we have to create nodes and links object
  var nodes = _.values(flattened).map(function(module, idx) {
    //update flattened object with indices
    flattened[module.name].idx = idx;
    return module;
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