'use strict';

angular.module('app.controllers', []).
  controller('EventAddCtrl', function ($scope, $http) {
    $scope.event = { addedBy: "Max" };

    $http.get("https://api.tnyu.org/teams")
        .success(function(data){
        	console.log(data);
        	$scope.teams = data.teams;
        })
        .error(function(data, status){
        	console.log(status);
        });

    $scope.submit = function() {
        console.log($scope.event);
        $http.post('http://posttestserver.com/post.php', $scope.event)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data, status) {
                console.log(status);
            });
    }
  });
