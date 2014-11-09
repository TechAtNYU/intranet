'use strict';

angular.module('app.directives', []).
  directive('datetime', [
    function() {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          ngModel: '=',
          dayFormat: "=",
          monthFormat: "=",
          yearFormat: "=",
          dayHeaderFormat: "=",
          dayTitleFormat: "=",
          monthTitleFormat: "=",
          showWeeks: "=",
          startingDay: "=",
          yearRange: "=",
          dateFormat: "=",
          minDate: "=",
          maxDate: "=",
          dateOptions: "=",
          dateDisabled: "&",
          hourStep: "=",
          minuteStep: "=",
          showMeridian: "=",
          meredians: "=",
          mousewheel: "=",
          readonlyTime: "@"
        },
        template: function(elem, attrs) {
          function dashCase(name, separator) {
            return name.replace(/[A-Z]/g, function(letter, pos) {
              return (pos ? '-' : '') + letter.toLowerCase();
            });
          }

          function createAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + dateTimeAttr + "\" ";
            } else {
              return '';
            }
          }

          function createFuncAttr(innerAttr, funcArgs, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + dateTimeAttr + "({" + funcArgs + "})\" ";
            } else {
              return '';
            }
          }

          function createEvalAttr(innerAttr, dateTimeAttrOpt) {
            var dateTimeAttr = angular.isDefined(dateTimeAttrOpt) ? dateTimeAttrOpt : innerAttr;
            if (attrs[dateTimeAttr]) {
              return dashCase(innerAttr) + "=\"" + attrs[dateTimeAttr] + "\" ";
            } else {
              return dashCase(innerAttr);
            }
          }

          function createAttrConcat(previousAttrs, attr) {
            return previousAttrs + createAttr.apply(null, attr)
          }
          var tmpl = "<div class=\"datetimepicker-wrapper\">" +
            "<input class=\"form-control\" type=\"text\" ng-click=\"open($event)\" is-open=\"opened\" ng-model=\"ngModel\" " + [
              ["minDate"],
              ["maxDate"],
              ["dayFormat"],
              ["monthFormat"],
              ["yearFormat"],
              ["dayHeaderFormat"],
              ["dayTitleFormat"],
              ["monthTitleFormat"],
              ["startingDay"],
              ["yearRange"],
              ["datepickerOptions", "dateOptions"]
          ].reduce(createAttrConcat, '') +
            createFuncAttr("dateDisabled", "date: date, mode: mode") +
            createEvalAttr("datepickerPopup", "dateFormat") +
            "/>\n" +
            "</div>\n" +
            "<div class=\"datetimepicker-wrapper\" ng-model=\"time\" ng-change=\"time_change()\" style=\"display:inline-block\">\n" +
            "<timepicker " + [
              ["hourStep"],
              ["minuteStep"],
              ["showMeridian"],
              ["meredians"],
              ["mousewheel"]
          ].reduce(createAttrConcat, '') +
            createEvalAttr("readonlyInput", "readonlyTime") +
            "></timepicker>\n" +
            "</div>";
          return tmpl;
        },
        controller: ['$scope',
          function($scope) {
            $scope.time_change = function() {
              if (angular.isDefined($scope.ngModel) && angular.isDefined($scope.time)) {
                $scope.ngModel.setHours($scope.time.getHours(), $scope.time.getMinutes());
              }
            }
            $scope.open = function($event) {
              $event.preventDefault();
              $event.stopPropagation();
              $scope.opened = true;
            };
          }
        ],
        link: function(scope) {
          scope.$watch(function() {
            return scope.ngModel;
          }, function(ngModel) {
            scope.time = ngModel;
          });
        }
      }
    }
  ]);

/**
 * Input element that displays the amount of characters left given a maxlength.

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
*/
