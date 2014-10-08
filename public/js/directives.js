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
      maxlength: "="
    },
    template: '<div class="t-input">' +
                '<input type="text" max="{{maxlength}}" ' +
                  'ng-model="tinput">' +
                '</input>' +
                '<span class="charleft">{{maxlength - tinput.length}}</span>' +
              '</div>'
  }
}
