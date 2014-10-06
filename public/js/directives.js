'use strict';

/**
 * Setup.
 */

var directives = [
  'tanTextInput'
];

directives.forEach(function(directive) {
  angular.module('app.directives', []).directive(
    directive, eval(directive)
  );
});

/**
 * Directives.
 */

function tanTextInput() {
  return {
    restrict: 'E',
    template: '<input type="text" value="{{character-count}}"/>',
    replace: true,
    scope: {
      characterCount: '@'
    },
    link: function(scope, el, attrs) {
      console.log(scope)
      alert(scope.characterCount);
      // scope.characterCount = attrs.characterCount;
    }
  }
}
