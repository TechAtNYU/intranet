'use strict';

angular
.module('app.controllers')
.controller('EventAddCtrl', function ($scope, $http, $modal, $interval, userData, Restangular) {
  // User Initialization
  userData.getInformation(function(data){
    // Put the user into the current scope
    $scope.currentUser = data;
    // Fix the addedBy null in the event scope
    $scope.event.addedBy = $scope.currentUser['id'];
    // Check if the user is Logged in
    if (userData.isLoggedIn($scope.currentUser)) {
      console.log("User logged in");
    }
    // Get the teams corresponding to a particular user
    userData.onTeams($scope.currentUser, function(teamData){
      if(teamData.length == 0){
        var destinationUrl = "https://api.tnyu.org/v1.0/people/me/"
        window.location = destinationUrl;
      }
      $scope.currentUserTeams = teamData;
    });
  });

  // Data Initialization
  $scope.event = { 
    addedBy: null, 
    links: {}, 
    startDateTime: new Date(), 
    endDateTime: new Date()
  };

  $scope.selectedTeams = {};
  $scope.teams = Restangular.all('teams').getList({isMeta: false}).$object;

  $scope.eventStatuses = Restangular.all('event-statuses').getList().$object;

  /* Multi-select requires an input model as an array of object literals. An optional
   * output model can also be specified. This writes an array of selected object literals
   * to the current scope.
   */

  $scope.refreshPresenters = function(selectedId) {
    Restangular.all('presenters').getList()
      .then(function(data) {
        $scope.presenters =
          _.map(data, function(presenter) {
            presenter.ticked = presenter.id === selectedId;
            return presenter;
          });
      });
  }

  $scope.refreshCoorganizers = function(selectedId) {
    Restangular.all('organizations').getList()
      .then(function(data) {
        $scope.coorganizers =
          _.map(data, function(org) {
            org.ticked = org.id === selectedId;
            return org;
          });
      });
  }

  $scope.refreshVenues = function(selectedId) {
    Restangular.all('venues').getList()
      .then(function(data) {
        $scope.venues =
          _.map(data, function(venue) {
            venue.ticked = venue.id === selectedId;
            return venue;
          });
      });
  }

  $scope.refreshGenderRep = function() {
    $scope.genderRep = Restangular.all('people/board').getList().$object;
  }

  $scope.refreshHost = function() {
    $scope.host = Restangular.all('people/board').getList().$object;
  }

  $scope.refreshPresenters(null);
  $scope.refreshCoorganizers(null);
  $scope.refreshVenues(null);
  $scope.refreshGenderRep();
  $scope.refreshHost();

  $scope.toggleTeam = function(teamid) {
    if($scope.selectedTeams[teamid])
      delete $scope.selectedTeams[teamid];
    else $scope.selectedTeams[teamid] = true;
  }

  $scope.submit = function() {
    $scope.event.startDateTime = $scope.event.startDateTime.toISOString();
    $scope.event.endDateTime = $scope.event.endDateTime.toISOString();

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

    if($scope.selectedVenue[0])
      $scope.event.links.venue = $scope.selectedVenue[0].id;

    if($scope.selectedGenderRep) {
      $scope.event.links.genderRep = $scope.selectedGenderRep;
    }

    console.log($scope.event);

    $http.post('https://api.tnyu.org/v1.0/events', 
          { 
            "links": {
              "events.venue": {
                "type": "venues"
              },
              "events.coorganizers": {
                "type": "related-clubs"
              },
              "events.presenters": {
                "type": "presenters"
              },
              "events.teams": {
                "type": "teams"
              },
              "events.genderRep": {
                "type": "person"
              },
              "events.status": {
                "type": "event-statuses"
              }
            }, 
            "events": $scope.event
          }, 
          { headers: { "Content-Type": "application/vnd.api+json" } })
      .success(function(data) {
        console.log(data);
      })
      .error(function(data, status) {
        $scope.validationErrors = data.errors;
      });
  }
  
  $scope.addCoorganizer = function addCoorganizer() {
    $modal.open({
      templateUrl: '/partials/coorganizer.html',
      controller: 'CoorganizerAddCtrl'
    }).result.then(function(orgs) {
      $scope.refreshCoorganizers(orgs.id);
    });
  };

  $scope.addPresenter = function addPresenter() {
    $modal.open({
      templateUrl: '/partials/presenter.html',
      controller: 'PresenterAddCtrl'
    }).result.then(function(presenters) {
      $scope.refreshPresenters(presenters.id);
    });
  };

  $scope.addVenue = function addVenue() {
    $modal.open({
      templateUrl: '/partials/venue.html',
      controller: 'VenueAddCtrl'
    }).result.then(function(venues) { // This fires on modal close (not dismiss)
      $scope.refreshVenues(venues.id);
    });
  };
});