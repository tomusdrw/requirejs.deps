var moduleToName = function(module) {
    return module.name;
  };

var visit = function(moduleDeps, visitor) {
    var queue = [].concat(moduleDeps);
    var module = queue.pop();
    var visited = {};
    while(module) {
      if(!visited[module.name]) {
        var deps = module.deps;

        visitor(module);

        visited[module.name] = true;
        queue.push.apply(queue, deps);
      }

      module = queue.pop();
    }
  };
exports.visit = visit;


exports.flatten = function(moduleDeps) {
  var flattened = {};

  visit(moduleDeps, function(module) {
    flattened[module.name] = module;

    module.deps = module.deps.map(moduleToName);
  });
  return flattened;
};