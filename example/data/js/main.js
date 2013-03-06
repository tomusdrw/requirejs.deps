define('something', [], function(){
  return 'anything';
});

require(['lib1', '@SomePath/x', '+IgnoreMe', '@SomePath2'], function(library, x) {
  console.log(library, x);
});