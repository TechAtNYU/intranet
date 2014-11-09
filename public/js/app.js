'use strict';

angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'multi-select',
  'app.controllers',
  'app.filters',
  'app.services',
  'app.directives',
]).config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
});
