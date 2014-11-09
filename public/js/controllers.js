'use strict';

var controllers = angular.module('app.controllers', [])

controllers.controller('EventAddCtrl', function ($scope, $http, $modal, userData) {
  // User Initialization
  (function() {
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
  })();

  // Data Initialization
  $scope.event = { addedBy: null, links: {} };
  $scope.selectedTeams = {};
  $http.get("https://api.tnyu.org/v1.0/teams?isMeta=false")
    .success(function(data){
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
