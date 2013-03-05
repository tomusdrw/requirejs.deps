var program = require('commander');
var path = require('path');
var fs = require('fs');

var requirejs = require('requirejs');

program.version('0.0.1').usage('[options]').option('-c, --config [config]', 'r.js config file [./build.js]', './build.js').parse(process.argv);



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
          deps: []
        };
      }
      var content = fs.readFileSync(src, 'utf8');

      var deps = parse.findDependencies(src, content);

      return {
        name: moduleName,
        deps: deps.map(findDependencies)
      };
    };
  };

require('./require.libs')(function(libs) {
  var rConfig = libs.build.createConfig(require(path.resolve(program.config)));
  requirejs(rConfig);

  var buildContext = requirejs.s.contexts._;

  var findDeps = depsFinder(buildContext, libs.parse);

  var modules = rConfig.modules;
  var moduleDeps = modules.map(function(module) {
    return findDeps(module.name);
  });


  // return json format for d3 visualisation
  console.log(JSON.stringify(require('./report/d3')(moduleDeps)));
});