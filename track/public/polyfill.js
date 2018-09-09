(function polyfill() {
  const ObjectPolyfills = {
    values: function values(o) {
      'use strict';
      const values = []
      for (var key in o) {
        values.push(o[key])
      }
      return values
    },

    assign: function assign(target, varArgs) {
      'use strict';
      if (target == null) { // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) { // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }
      return to;
    }
  }

  for (var objectMethod in ObjectPolyfills) {
    if ('function' !== typeof Object[objectMethod]) {
      Object.defineProperty(Object, objectMethod, {
        value: ObjectPolyfills[objectMethod],
        writable: true,
        configurable: true,
        enumerable: false
      })
    }
  }
})()
