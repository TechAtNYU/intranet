'use strict';

var controllers = angular.module('app.controllers', [])

controllers.controller('EventAddCtrl', function ($scope, $http, $modal, userData) {
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
  $scope.event = { addedBy: null, links: {} };
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

    $scope.event.links.venue = $scope.selectedVenue[0].id;

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
    console.log('aoeu', data);

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

    return result;
  }

  $scope.formData = {};

  $scope.processForm = function() {
    // var testObject = {
    //   "links": {
    //     "presenters.currentEmployer": {
    //       "type": "organizations"
    //     }
    //   },
    //   "presenters": {
    //     "name": "Justin",
    //     "contact": {
    //       "twitter": "tsiraetn",
    //       "email": "bo@gmail.com"
    //     },
    //     "links": {
    //       "currentEmployer": "543f1d54ceb990925e68d2c1"
    //     }
    //   }
    // };

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

controllers.controller('AddVenueCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('AddCoorganizerCtrl', function($scope, $modalInstance) {
  $scope.ok = function() {
    $modalInstance.close();
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('DateTimePickerCtrl', function ($scope, $timeout) {

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
  $scope.hourStep = 1;
  $scope.minuteStep = 15;

  $scope.timeOptions = {
    hourStep: [1, 2, 3],
    minuteStep: [1, 5, 10, 15, 25, 30]
  };

  $scope.showMeridian = true;
  $scope.timeToggleMode = function() {
    $scope.showMeridian = !$scope.showMeridian;
  };
  
});
