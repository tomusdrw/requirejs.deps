require.config({
  "baseUrl": "/",
  "paths": {
    "@SomePath": "js/abc",
    "@SomePath2": "js/abc2/x",
    "+IgnoreMe": "xyz",
    "lib1": "js/libs/x",
    "library2": "js/libs/y"
  },
  "map": {
    "*": {
      "a": "lib1"
    }
  },
  "shim" : {
    "lib1" : {
      "deps" : ["library2"],
      "exports" : "x"
    },
    "library2" : {
      "exports": "y"
    }
  }
});