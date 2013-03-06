var program = require('commander');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');

var requirejs = require('requirejs');

program.version('0.0.1')
.usage('[options]')
.option('-c, --config [config]', 'r.js config file [./build.js]', './build.js')
.option('-f, --from [module]', 'Single module as start point')
.option('-w, --why [module]', 'Tells all paths from [from_module] to given module')
.option('-o, --output [format]', 'Return format output (d3, yuml, line, raw) [yuml]', 'yuml')
.parse(process.argv);

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

var depsFinder = function(buildContext, parse) {
    var nameToUrl = buildContext.nameToUrl.bind(buildContext);
    var starMap = buildContext.config.map["*"];

    return function findDependencies(moduleName) {
      //TODO ToDr Some nasty hacking for starMap?
      if(moduleName in starMap) {
        moduleName = starMap[moduleName];
      }

      var src = nameToUrl(moduleName);
      if(src === 'empty:.js') {
        return {
          name: moduleName,
          clazz: classify(moduleName),
          deps: []
        };
      }
      var content = fs.readFileSync(src, 'utf8');

      var deps = parse.findDependencies(src, content);

      return {
        name: moduleName,
        clazz: classify(moduleName),
        deps: deps.map(findDependencies)
      };
    };
  };

require('./require.libs')(function(libs) {
  var rConfig = libs.build.createConfig(require(path.resolve(program.config)));
  requirejs(rConfig);

  var buildContext = requirejs.s.contexts._;

  var findDeps = depsFinder(buildContext, libs.parse);

  var modules = (program.from) ? [{
    name: program.from
  }] : rConfig.modules;
  var moduleDeps = modules.map(function(module) {
    return findDeps(module.name);
  });

  if (program.why) {
    moduleDeps = require('./filter')(moduleDeps, program.why);
  }

  // return json format for d3 visualisation
  console.log(program.output );
  if (program.output === 'd3') {
    console.log(JSON.stringify(require('./report/d3')(moduleDeps), null, 2));
  } else if (program.output === 'yuml') {
    require('./report/yuml')(moduleDeps);
  } else if (program.output === 'line') {
    require('./report/line')(moduleDeps);
  } else {
    console.log(JSON.stringify(moduleDeps, null, 2));
  }
});