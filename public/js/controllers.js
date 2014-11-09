'use strict';

var controllers = angular.module('app.controllers', [])

controllers.controller('EventAddCtrl', function ($scope, $http, $modal, userData) {
  // User Initialization
  (function() {
    userData.getInformation(function(data){
      $scope.currentUser = data;
      if (userData.isLoggedIn($scope.currentUser)) {
        console.log("User logged in");
      }
      userData.onTeams($scope.currentUser, function(teamData){
        console.log(teamData);
      });
    });
  })();

  // Data Initialization
  $scope.event = { addedBy: "Max", links: {} };
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
      $scope.event.links.teams.push(teamid);

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

  $scope.addPresenter = function addPresenter() {
    $modal.open({
      templateUrl: '/partials/presenter.html',
      controller: 'AddPresenterCtrl'
    });
  };

  $scope.addVenue = function addVenue() {
  $modal.open({
    templateUrl: '/partials/venue.html',
    controller: 'AddVenueCtrl'
  });
  };
});

controllers.controller('AddPresenterCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('AddVenueCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

 controllers.controller('DatePickerCtrl', function ($scope) {

  $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.toggleOpenDatePicker = function($event,datePicker) {
   $event.preventDefault();
   $event.stopPropagation();
   $scope[datePicker] = !$scope[datePicker];
  };
  
  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.format = 'shortDate';
});