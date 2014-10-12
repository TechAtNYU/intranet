'use strict';

/**
 * Setup.
 */

var directives = [
  'tInput'
];

directives.forEach(function(directive) {
  angular.module('app.directives', []).directive(
    directive, eval(directive)
  );
});

/**
 * Directives.
 */

/**
 * Input element that displays the amount of characters left given a maxlength.
 */

function tInput() {
  return {
    restrict: 'E',
    replace: true,
    scope: {
      max: "="
    },
    template: '<div class="t-input">' +
                '<input type="text" ng-model="tinput" ' +
                  'ng-change="changeClass()"/>' +
                '<span class="charleft">' +
                  '{{charsLeft()}}' +
                '</span>' +
              '</div>',
    link: function(scope, elem, attrs) {
      // Sets the threshold to show warning at 20% of characters remaining
      var THRESHOLD = scope.max ? Math.ceil(scope.max * 0.2) : 0;

      var span = elem.find('span');

      // Only sets user-specified attributes and not those by Angular
      for(var attr in attrs) {
        if(attr.charAt(0) !== '$') {
          elem.children()[0].setAttribute(attr, attrs[attr]);
        }
      }

      scope.changeClass = function() {
        if(!scope.max) {
          return;
        }

        clearClasses();

        if(!scope.tinput) {
          return;
        }

        var klass = 'input-valid';
        var difference = scope.max - scope.tinput.length;

        if(difference <= 0) klass = 'input-invalid';
        else if(difference <= THRESHOLD) klass = 'input-warning';

        span.addClass(klass);
      }

      function clearClasses() {
        span.removeClass('input-valid');
        span.removeClass('input-invalid');
        span.removeClass('input-warning');
      }

      scope.charsLeft = function() {
        if(!scope.max) return '';
        else if(!scope.tinput) return scope.max;

        return scope.max - scope.tinput.length;
      }
    }
  }
}
