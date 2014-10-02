/**
  * ANGULAR APP.JS
  * Configure the Angular app and local routes here
  * For other functions, see controllers.js, directives.js, filters.js, and services.js.
  */

'use strict';

// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/people', {
      templateUrl: 'partials/people',
      controller: 'PeopleCtrl'
    }).
    when('/other', {
      templateUrl: 'partials/other',
      controller: 'OtherCtrl'
    }).
    otherwise({
      redirectTo: '/people'
    });

  $locationProvider.html5Mode(true);
});
