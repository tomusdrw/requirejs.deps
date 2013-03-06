var program = require('commander');
var path = require('path');

var requirejs = require('requirejs');
var list = function(val) {
    return val.split(',');
  };

program.version('0.0.1') //
.usage('[options]') //
.option('-c, --config [config]', 'Config file with all the options. [deps.js]', 'deps.js') //
.option('-r, --rconfig [rconfig]', 'r.js config file [./build.js]') // dont provide default here
.option('-f, --from [module]', 'Single module as start point') //
.option('-w, --why [module]', 'Tells all paths from [from_module] to given module') //
.option('-o, --output [format]', 'Return format output (d3, yuml, line, dot, raw) [yuml]') //
.option('-i, --ignore <ignored, ...>', 'Pass ignored modules list (comma separated)', list) //
.option('-h, --hide <hidden, ...>', 'Hide some deps from output.', list) //
.parse(process.argv);


var report = function(moduleDeps, options) {
    var outputToReport = {
      'd3': './report/d3',
      'yuml': './report/yuml',
      'line': './report/line',
      'dot': './report/dot'
    };

    // call reporter
    if(options.output in outputToReport) {
      require(outputToReport[options.output])(moduleDeps);
    } else {
      //TODO detect circular dependencies
      console.log(JSON.stringify(moduleDeps, null, 2));
    }
  };

var composeOptions = function(config) {
    var options = {
      // possibility to override with comamnd line
      rconfig: program.rconfig || config.rconfig,
      // concat wih cmdline arguments
      hide: config.hide.concat(program.hide),
      ignore: config.ignore.concat(program.ignore),
      // take from config
      classify: config.classify,
      // possible to override with cmdline
      output: program.output || config.output
    };

    return options;
  };

var loadOptions = function() {
    //If no config is specified we just return program variable
    if(!program.config) {
      program.rconfig = program.rconfig || 'build.js';
      program.output = program.output || 'yuml';
      return program;
    }
    var config = require(path.resolve(program.config));
    return composeOptions(config);
  };

require('./require.libs')(function(libs) {
  var options = loadOptions();

  //load default rconfig
  var rConfig = libs.build.createConfig(require(path.resolve(options.rconfig)));
  //put this to requirejs
  requirejs(rConfig);
  //take out context from requirejs
  var buildContext = requirejs.s.contexts._;

  //take modules to trace (possibility to override from cmdline)
  var modules = (program.from) ? [{
    name: program.from
  }] : rConfig.modules;

  require('./deps')(modules, buildContext, function(moduleDeps) {
    
    //filter output with "why"
    if(program.why) {
      moduleDeps = require('./filter')(moduleDeps, program.why);
    }

    //display report
    report(moduleDeps, options);

  }, options.classify, options.hide, options.ignore);
});