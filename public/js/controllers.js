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

  /* Multi-select requires an input model as an array of object literals. An optional
   * output model can also be specified. This writes an array of selected object literals
   * to the current scope.
   */

  $scope.presenters = [];
  $http.get("https://api.tnyu.org/v1.0/presenters")
    .success(function(data){
      data.presenters.forEach(function(presenter) {
        $scope.presenters.push({ name: presenter.name, id: presenter.id, ticked: false});
      });
    })
    .error(function(data, status){
      console.log(status);
    });

  $scope.coorganizers = [];
  $http.get("https://api.tnyu.org/v1.0/related-clubs")
    .success(function(data){
      data["related-clubs"].forEach(function(club) {
        $scope.coorganizers.push({ name: club.name, id: club.id, ticked : false});
      });
      $http.get("https://api.tnyu.org/v1.0/organizations")
        .success(function(data){
          data.organizations.forEach(function(organization) {
            $scope.coorganizers.push({ name: organization.name, id: organization.id, ticked: false});
          });
        })
        .error(function(data, status){
          console.log(status);
        });
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
    $scope.event.links.teams = [];
    Object.keys($scope.selectedTeams).forEach(function(teamid) {
      $scope.event.links.teams.push(teamid);
    });

    $scope.event.links.presenters = [];
    $scope.selectedPresenters.forEach(function(presenter) {
      $scope.event.links.presenters.push(presenter.id);
    });

    $scope.event.links.coorganizers = [];
    $scope.selectedCoorgs.forEach(function(coorganizer) {
      $scope.event.links.coorganizers.push(coorganizer.id);
    });

    console.log($scope.event);

    // $http.post('https://api.tnyu.org/v1.0/events', 
    //       $scope.event, 
    //       { headers: { "Content-Type": "application/vnd.api+json" } })
    //   .success(function(data) {
    //     console.log(data);
    //   })
    //   .error(function(data, status) {
    //     console.log(status);
    //   });
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