/*
 * Display every dependency path as separate line
 */
var _ = require('underscore');

var printArray = function(array) {
    var depLine = array.map(function(name) {
      return '[' + name + ']';
    }).join('->');

    console.log(depLine);
  };

var printDeep = function(module, prefixArray) {
    var newPrefixArray = prefixArray.concat([module.name]);
    if(module.deps.length) {
      _.each(module.deps, function(depModule) {
        //make recursive call
        printDeep(depModule, newPrefixArray);
      });
    } else {
      printArray(newPrefixArray);
    }
  };

module.exports = function(moduleDeps) {

  _.each(moduleDeps, function(module) {
    printDeep(module, []);
  });

};