'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('PeopleCtrl', function ($scope, $http) {
      $http({
        method: 'GET',
        url: '/api/people'
      }).
      success(function (data, status, headers, config) {
        $scope.people = data;
        console.log(data);
      }).
      error(function (data, status, headers, config) {
        $scope.error = status;
      });
  }).
  controller('OtherCtrl', function ($scope) {
    // write Ctrl here

  });
