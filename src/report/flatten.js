var moduleToName = function(module) {
    return module.name;
  };

module.exports = function(moduleDeps) {
  var flattened = {};

  var queue = moduleDeps;
  var module = queue.pop();
  while(module) {
    if(!flattened[module.name]) {
      flattened[module.name] = module;

      var deps = module.deps;
      module.deps = deps.map(moduleToName);
      queue.push.apply(queue, deps);
    }
    module = queue.pop();
  }

  return flattened;
};