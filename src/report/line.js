/*
 * Display every dependency path as separate line
 */
var _ = require('underscore');

var printArray = function(array) {
    var depLine = array.map(function(module) {
      if (module) {
        return '[' + module.name + ']';
      }
      return '!circular_dependency!';
    }).join('->');

    console.log(depLine);
  };

var printDeep = function printDeep(printArray, module, prefixArray, visited) {
    var newPrefixArray = prefixArray.concat([module]);
    //circular dependency detected
    if (module.name in visited) {
      printArray(newPrefixArray.concat([false]));
      return;
    }
    visited[module.name] = true;

    if(module.deps.length) {
      _.each(module.deps, function(depModule) {
        //make recursive call
        printDeep(printArray, depModule, newPrefixArray, _.clone(visited));
      });
    } else {
      printArray(newPrefixArray);
    }
  };

var lineExport = function(moduleDeps) {

  _.each(moduleDeps, function(module) {
    printDeep(printArray, module, [], {});
  });

};
lineExport.printDeep = function(printArray, module, prefixArray) {
  return printDeep(printArray, module, prefixArray, {});
};

module.exports = lineExport;