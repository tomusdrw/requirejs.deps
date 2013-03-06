var printDeep = require('./line').printDeep;
var utils = require('./utils');
var _ = require('underscore');


var printer = function(moduleToId) {
    return function(array) {
      console.log(array.map(function(module) {
        if (module) {
          return moduleToId[module.name];
        }
        return '!circular!';
      }).join(' -> ') + ';');
    };
  };


module.exports = function(moduleDeps) {
  console.log("digraph DepsVisualisation {");
  //first we have to define labels
  var id = 1;

  //we have to store ids externally - because we visit every module only once
  var moduleToId = {};
  utils.visit(moduleDeps, function(module) {
    module.id = "node" + id;
    moduleToId[module.name] = module.id;

    id += 1;
    //define label
    console.log(module.id + '[label="' + module.name + '"];');
  });

  console.log("");

  //now print everything!
  var printArray = printer(moduleToId);

  _.each(moduleDeps, function(module) {
    printDeep(printArray, module, []);
  });


  console.log("}");
};