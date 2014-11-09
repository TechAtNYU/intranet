'use strict';

angular.module('app', [
  'ngRoute',
  'ui.bootstrap',
  'app.controllers',
  'app.filters',
  'app.services',
  'app.directives',
]).config(function ($routeProvider, $locationProvider) {
  $locationProvider.html5Mode(true);
});
