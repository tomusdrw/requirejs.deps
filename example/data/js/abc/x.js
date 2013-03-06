//make some circular dependency here
define(['library2', 'js/main'], function(lib2) {
  console.log("abc/x");
});