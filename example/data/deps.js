var _ = require('underscore');

module.exports = {
  "rconfig": "build.json",
  "hide": ["backbone", "@SomePath/x"],
  "ignore": ["!context", "xyz"],
  "output": "yuml",
  "classify": function(name) {
    var classes = ['@CommonBundle', '@AppBundle', '@CkdbBundle', '+', '#'];
    var defaultClazz = 'unknown';

    var retClazz = _.find(classes, function(clazz) {
      return name.indexOf(clazz) !== -1;
    });

    return retClazz || defaultClazz;
  }
};