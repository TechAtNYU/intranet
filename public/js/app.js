'use strict';

angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'app.controllers',
  'app.filters',
  'app.services',
  'app.directives',
]).config(function (datepickerConfig) {
      datepickerConfig.showWeeks = false;
}).config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
});
