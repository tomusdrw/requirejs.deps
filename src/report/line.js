/*
 * Display every dependency path as separate line
 */
var _ = require('underscore');

var printArray = function(array) {
    var depLine = array.map(function(module) {
      return '[' + module.name + ']';
    }).join('->');

    console.log(depLine);
  };

var printDeep = function printDeep(printArray, module, prefixArray) {
    var newPrefixArray = prefixArray.concat([module]);
    if(module.deps.length) {
      _.each(module.deps, function(depModule) {
        //make recursive call
        printDeep(printArray, depModule, newPrefixArray);
      });
    } else {
      printArray(newPrefixArray);
    }
  };

var lineExport = function(moduleDeps) {

  _.each(moduleDeps, function(module) {
    printDeep(printArray, module, []);
  });

};
lineExport.printDeep = printDeep;

module.exports = lineExport;