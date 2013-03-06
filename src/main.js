var program = require('commander');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var requirejs = require('requirejs');

program.version('0.0.1') //
.usage('[options]') //
.option('-c, --config [config]', 'r.js config file [./build.js]', './build.js') //
.option('-f, --from [module]', 'Single module as start point') //
.option('-w, --why [module]', 'Tells all paths from [from_module] to given module') //
.option('-o, --output [format]', 'Return format output (d3, yuml, line, dot, raw) [yuml]', 'yuml') //
.option('-i, --ignore <ignored, ...>', 'Pass ignored modules list (comma separated)', function(val) {
  return val.split(',');
}).parse(process.argv);

//TODO move to external file? Add possiblity to load your own
var classify = function(name) {
    var classes = ['@CommonBundle', '@AppBundle', '@CkdbBundle', '+', '#'];
    var retClazz = 'unknown';

    _.every(classes, function(clazz) {
      if(name.indexOf(clazz) !== -1) {
        retClazz = clazz;
        return false;
      }
      return true;
    });

    return retClazz;
  };

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

var depsFinder = function(buildContext, parse, ignoredArray) {
    var nameToUrl = buildContext.nameToUrl.bind(buildContext);
    var starMap = buildContext.config.map["*"];
    var ignored = convertToObject(ignoredArray);
    var visited = {};

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
        module.deps = deps.map(findDependencies);
      }

      return module;
    };
  };

var outputToReport = {
  'd3': './report/d3',
  'yuml': './report/yuml',
  'line': './report/line',
  'dot': './report/dot'
};

require('./require.libs')(function(libs) {
  var rConfig = libs.build.createConfig(require(path.resolve(program.config)));
  requirejs(rConfig);

  var buildContext = requirejs.s.contexts._;


  var modules = (program.from) ? [{
    name: program.from
  }] : rConfig.modules;

  var findDeps = depsFinder(buildContext, libs.parse, program.ignore);

  var moduleDeps = modules.map(function(module) {
    return findDeps(module.name);
  });

  if(program.why) {
    moduleDeps = require('./filter')(moduleDeps, program.why);
  }

  // call reporter
  if(program.output in outputToReport) {
    require(outputToReport[program.output])(moduleDeps);
  } else {
    //TODO detect circular dependencies
    console.log(JSON.stringify(moduleDeps, null, 2));
  }
});