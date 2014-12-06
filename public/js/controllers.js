'use strict';

var controllers = angular.module('app.controllers', [])

controllers.controller('EventAddCtrl', function ($scope, $http, $modal, $interval, userData) {
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
      $scope.currentUserTeams = teamData;
    });
  });

  // Data Initialization
  $scope.event = { addedBy: null, links: {}, startDateTime: new Date(), endDateTime: new Date()};
  $scope.selectedTeams = {};
  $http.get("https://api.tnyu.org/v1.0/teams?isMeta=false")
    .success(function(data){
      $scope.teams = data.teams;
    })
    .error(function(data, status){
      console.log("Failed to fetch teams from API with error " + status);
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

  $scope.venues = [];
  $http.get("https://api.tnyu.org/v1.0/venues")
    .success(function(data){
      data["venues"].forEach(function(venue) {
        $scope.venues.push({ name: venue.name, id: venue.id, ticked : false});
      });
    })
    .error(function(data, status){
      console.log(status);
    });

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
              }
            }, "events": $scope.event
          }, 
          { headers: { "Content-Type": "application/vnd.api+json" } })
      .success(function(data) {
        console.log(data);
      })
      .error(function(data, status) {
        console.log(status);
      });
  }
  
  $scope.addCoorganizer = function addCoorganizer() {
    $modal.open({
      templateUrl: '/partials/coorganizer.html',
      controller: 'AddCoorganizerCtrl'
    });
  };

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

controllers.controller('AddPresenterCtrl', function($scope, $modalInstance, $http) {
  function serializeData(data) {
    var result = {};
    result.links = {};
    result.links['presenters.currentEmployer'] = {};
    result.links['presenters.currentEmployer'].type = 'organizations';

    result.presenters = {};

    for(var key in data) {
      result.presenters[key] = data[key];
    }

    delete result.presenters.currentEmployer;

    result.presenters.links = {};
    result.presenters.links.currentEmployer = data.currentEmployer;

    console.log('JSON Presenter', result);
    return result;
  }

  $scope.formData = {};

  $scope.processForm = function() {
    $http({
      method  : 'POST',
      url     : 'https://api.tnyu.org/v1.0/presenters',
      data    : serializeData($scope.formData),
      headers : { 'Content-Type': 'application/vnd.api+json' }
    })
    .success(function(data) {
      // $scope.formData = {};
      console.log('Submitted form.');
    });
  };

  $scope.submitPresenter = function() {
    $scope.processForm();
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('AddVenueCtrl', function($scope, $modalInstance, $http) {
  $scope.companies = [];
  $http.get("https://api.tnyu.org/v1.0/organizations")
    .success(function(data){
      data.organizations.forEach(function(organization) {
        $scope.companies.push({ name: organization.name, id: organization.id, ticked: false});
      });
    })
    .error(function(data, status){
      console.log(status);
    });

  function serializeData(data) {
    var result = {};
    result.links = {};
    result.links['venues.organization'] = {};
    result.links['venues.organization'].type = 'organizations';

    result.venues = {};

    for(var key in data) {
      result.venues[key] = data[key];
    }

    delete result.venues.organization;

    result.venues.links = {};
    result.venues.links.organization = data.organization;

    console.log('JSON Venue', result);
    return result;
  }

  $scope.formData = {};

  $scope.submitVenue = function() {
    $http({
      method  : 'POST',
      url     : 'https://api.tnyu.org/v1.0/venues',
      data    : serializeData($scope.formData),
      headers : { 'Content-Type': 'application/vnd.api+json' }
    })
    .success(function(data) {
      // $scope.formData = {};
      console.log('Submitted form.');
    });
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('AddCoorganizerCtrl', function($scope, $modalInstance, $http) {
  $scope.liasons = [];
  $http.get("https://api.tnyu.org/v1.0/people")
    .success(function(data){
      data.presenters.forEach(function(person) {
        $scope.liasons.push({ name: person.name, id: person.id, ticked: false});
      });
    })
    .error(function(data, status){
      console.log(status);
    });

  function serializeData(data) {
    var result = {};
    result.links = {};
    result.links['related-clubs.liasons'] = {};
    result.links['related-clubs.liasons'].type = 'organizations';

    result['related-clubs'] = {};

    for(var key in data) {
      result['related-clubs'][key] = data[key];
    }

    delete result['related-clubs'].liasons;

    result['related-clubs'].links = {};
    result['related-clubs'].links.liasons = data.liasons;

    console.log('JSON Coorganizer', result);
    return result;
  }

  $scope.formData = { inNYUEN: false };

  $scope.submitCoorganizer = function() {
    $http({
      method  : 'POST',
      url     : 'https://api.tnyu.org/v1.0/related-clubs',
      data    : serializeData($scope.formData),
      headers : { 'Content-Type': 'application/vnd.api+json' }
    })
    .success(function(data) {
      // $scope.formData = {};
      console.log('Submitted form.');
    });
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
