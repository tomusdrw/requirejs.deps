var _ = require('underscore');
var fs = require('fs');

var isIgnored = function(name, src, ignored) {
    return name in ignored || src.indexOf('empty:') !== -1;
  };

var convertToObject = function(array) {
    var obj = {};
    _.each(array || [], function(o) {
      obj[o] = true;
    });
    return obj;
  };


var depsFinder = function(buildContext, parse, classify, hiddenArray, ignoredArray) {
    var nameToUrl = buildContext.nameToUrl.bind(buildContext);
    var starMap = buildContext.config.map["*"];
    var ignored = convertToObject(ignoredArray);
    var hidden = convertToObject(hiddenArray);
    var visited = {};

    var fillDependencies = function(findDependencies, module, moduleName) {
        var src = nameToUrl(moduleName);
        if(isIgnored(moduleName, src, ignored)) {
          //this module should be ignored
          //so put empty deps
          module.deps = [];
          module.ignored = true;
        } else {
          //parse dependencies of module
          var content = fs.readFileSync(src, 'utf8');

          var deps = parse.findDependencies(src, content);
          module.deps = deps.filter(function(module) {
            return !(module in hidden);
          }).map(findDependencies);
        }
      };

    return function findDependencies(moduleName) {
      //TODO ToDr Some nasty hacking for starMap?
      if(moduleName in starMap) {
        moduleName = starMap[moduleName];
      }

      // This module was visited in past - leave it as is
      if(moduleName in visited) {
        return visited[moduleName];
      }

      var module = {
        name: moduleName,
        clazz: classify(moduleName)
      };

      //mark as visited (do it at the beggining to prevent circular deps)
      visited[moduleName] = module;

      fillDependencies(findDependencies, module, moduleName);

      return module;
    };
  };

module.exports = function(modules, requireContext, callback, classify, hidden, ignored) {
  if(_.isUndefined(classify)) {
    classify = function(name) {
      return name;
    };
  }
  require('./require.libs')(function(libs) {
    var findDeps = depsFinder(requireContext, libs.parse, classify, hidden, ignored);

    var moduleDeps = modules.map(function(module) {
      return findDeps(module.name);
    });

    callback(moduleDeps);

  });
};