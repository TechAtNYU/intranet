'use strict';

angular.module('app.controllers', []).
  controller('EventAddCtrl', function ($scope, $http, userData) {
    // User Initialization
    (function() {
        userData.getInformation(function(data){
            $scope.currentUser = data;
            if (userData.isLoggedIn($scope.currentUser)) {
                console.log("User logged in");
            }
            userData.onTeams($scope.currentUser);
        });
    })();

    // Data Initialization
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

        $http.post('https://api.tnyu.org/v1.0/events', 
                    $scope.event, 
                    { headers: { "Content-Type": "application/vnd.api+json" } })
            .success(function(data) {
                console.log(data);
            })
            .error(function(data, status) {
                console.log(status);
            });
    }
  });
