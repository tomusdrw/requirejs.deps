
y = {
  "imma" : "y"
};
define("library2", (function (global) {
    return function () {
        var ret, fn;
        return ret || global.y;
    };
}(this)));

x = {
  "hello" : "world"
};
define("lib1", ["library2"], (function (global) {
    return function () {
        var ret, fn;
        return ret || global.x;
    };
}(this)));

define('@SomePath/x',['library2'], function(lib2) {
  console.log("abc/x");
});
define('@SomePath2',['$'], function(library){
  console.log("abc2/x");
});
define('something', [], function(){
  return 'anything';
});

require(['lib1', '@SomePath/x', '+IgnoreMe', '@SomePath2'], function(library, x) {
  console.log(library, x);
});
define("js/main", function(){});
