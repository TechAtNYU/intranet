'use strict';

angular.module('app.controllers', []).
  controller('EventAddCtrl', function ($scope, $http) {
    $scope.event = {};

    $http.get("https://api.tnyu.org/teams")
    .success(function(data){
    	console.log(data);
    	$scope.teams = data.teams;
    }).error(function(data, status){
    	console.log(status);
    });
  });
