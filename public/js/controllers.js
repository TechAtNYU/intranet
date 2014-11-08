'use strict';

angular.module('app.controllers', []).
  controller('EventAddCtrl', function ($scope, $http) {
    $scope.event = { addedBy: "Max" };
    $scope.selectedTeams = {};

    $http.get("https://api.tnyu.org/v1.0/teams")
        .success(function(data){
        	console.log(data);
        	$scope.teams = data.teams;
        })
        .error(function(data, status){
        	console.log(status);
        });

    $scope.toggleTeam = function(teamid) {
        console.log(teamid);
        if($scope.selectedTeams[teamid]) 
            delete $scope.selectedTeams[teamid];
        else $scope.selectedTeams[teamid] = true;
    }

    $scope.submit = function() {

        // Aggregrate all selected teams into our event to be submitted.
        $scope.event.teams = [];
        for(var teamid in Object.keys($scope.selectedTeams))
            $scope.event.teams.push(teamid);
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
