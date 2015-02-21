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

  $scope.eventStatuses = [];
  $http.get("https://api.tnyu.org/v1.0/event-statuses")
    .success(function(data) {
      $scope.eventStatuses = data["event-statuses"];
    })
    .error(function(data, status) {
      console.log("Failed to fetch event-statuses from API with error " + status);
    });

  /* Multi-select requires an input model as an array of object literals. An optional
   * output model can also be specified. This writes an array of selected object literals
   * to the current scope.
   */

  $scope.refreshPresenters = function(selectedId) {
    $scope.presenters = [];
    $http.get("https://api.tnyu.org/v1.0/presenters")
      .success(function(data){
        data.presenters.forEach(function(presenter) {
          $scope.presenters.push({ name: presenter.name, id: presenter.id, ticked: presenter.id == selectedId});
        });
      })
      .error(function(data, status){
        console.log(status);
      });
  }

  $scope.refreshCoorganizers = function(selectedId) {
    $scope.coorganizers = [];
    $http.get("https://api.tnyu.org/v1.0/organizations")
      .success(function(data) {
        data["organizations"].forEach(function(club) {
          $scope.coorganizers.push({ name: club.name, id: club.id, ticked : club.id == selectedId});
        });
      })
      .error(function(data, status) {
        console.log(status);
      });
  }

  $scope.refreshVenues = function(selectedId) {
    $scope.venues = [];
    $http.get("https://api.tnyu.org/v1.0/venues")
      .success(function(data){
        data["venues"].forEach(function(venue) {
          $scope.venues.push({ name: venue.name, id: venue.id, ticked : venue.id == selectedId});
        });
      })
      .error(function(data, status) {
        console.log(status);
      });
  }

  $scope.refreshGenderRep = function() {
    $scope.genderRep = [];
    $http.get("https://api.tnyu.org/v1.0/people/board")
      .success(function(data){
        data["people"].forEach(function(person) {
          $scope.genderRep.push(
            { name: person.name, id: person.id, ticked : false});
        });
      })
      .error(function(data, status){
        console.log(status);
      });
  }

  $scope.refreshHost = function() {
    $scope.host = [];
    $http.get("https://api.tnyu.org/v1.0/people/board")
      .success(function(data){
        data["people"].forEach(function(person) {
          $scope.host.push(
            { name: person.name, id: person.id, ticked : false});
        });
      })
      .error(function(data, status){
        console.log(status);
      });
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
      controller: 'AddCoorganizerCtrl'
    }).result.then(function(orgs) {
      $scope.refreshCoorganizers(orgs.id);
    });
  };

  $scope.addPresenter = function addPresenter() {
    $modal.open({
      templateUrl: '/partials/presenter.html',
      controller: 'AddPresenterCtrl'
    }).result.then(function(presenters) {
      $scope.refreshPresenters(presenters.id);
    });
  };

  $scope.addVenue = function addVenue() {
    $modal.open({
      templateUrl: '/partials/venue.html',
      controller: 'AddVenueCtrl'
    }).result.then(function(venues) { // This fires on modal close (not dismiss)
      $scope.refreshVenues(venues.id);
    });
  };
});

controllers.controller('AddPresenterCtrl', function($scope, $modalInstance, $http) {
  function serializeData(data) {
    var result = {};
    result.links = {};
    result.links['presenters.currentEmployer'] = { type: 'organizations' };
    result.links['presenters.skills'] = { type: 'skills' };

    result.presenters = {};

    for(var key in data) {
      result.presenters[key] = data[key];
    }

    delete result.presenters.currentEmployer;

    result.presenters.links = {};
    result.presenters.links.currentEmployer = data.currentEmployer;
    console.log($scope.selectedSkills);
    result.presenters.links.skills = $scope.selectedSkills;

    console.log('JSON Presenter', result);
    return result;
  }

  $scope.formData = {};

  $scope.companies = [];
  $http.get("https://api.tnyu.org/v1.0/organizations")
    .success(function(data) {
      $scope.companies = data["organizations"];
    })
    .error(function(data, status) {
      console.log("Failed to fetch companies from API with error " + status);
    });

  $scope.skills = [];
  $http.get("https://api.tnyu.org/v1.0/skills")
    .success(function(data) {
      $scope.skills = data["skills"];
    })
    .error(function(data, status) {
      console.log("Failed to fetch companies from API with error " + status);
    });

  $scope.schools = [];
  $http.get("https://api.tnyu.org/v1.0/people?fields=schools")
    .success(function(data) {
      $scope.schools = [];
      var schools = {};
      var people = data["people"];
      people.forEach(function(person) {
        if(person.schools) {
          person.schools.forEach(function(school) {
            if(!schools[school]) {
              schools[school] = true;
              $scope.schools.push({ name: school });
            }
          });
        }
      });
    })
    .error(function(data, status) {
      console.log("Failed to fetch companies from API with error " + status);
    });

  $scope.processForm = function() {
    $http({
      method  : 'POST',
      url     : 'https://api.tnyu.org/v1.0/presenters',
      data    : serializeData($scope.formData),
      headers : { 'Content-Type': 'application/vnd.api+json' }
    })
    .success(function(data) {
      $modalInstance.close(data.presenters);
    });
  };

  $scope.submitPresenter = function() {
    $scope.processForm();
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

  $scope.showAddCompanyForm = false;

  $scope.addCompany = function() {
    $scope.showAddCompanyForm = true;
  };

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
      $modalInstance.close(data.venues);
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});

controllers.controller('AddCoorganizerCtrl', function($scope, $modalInstance, $http) {
  $scope.liaisons = [];
  $http.get("https://api.tnyu.org/v1.0/people")
    .success(function(data){
      data.people.forEach(function(person) {
        $scope.liaisons.push({ name: person.name, id: person.id, ticked: false});
      });
    })
    .error(function(data, status){
      console.log(status);
    });

  function serializeData(data, resource) {
    var result = {};
    result.links = {};
    result.links[resource + '.liaisons'] = {};
    result.links[resource + '.liaisons'].type = 'organizations';

    result[resource] = {};

    for(var key in data) {
      result[resource][key] = data[key];
    }

    delete result[resource].liaisons;

    result[resource].links = {};
    result[resource].links.liaisons = data.liaisons;

    console.log('JSON Coorganizer', result);
    return result;
  }

  $scope.formData = { inNYUEN: false };

  $scope.submitCoorganizer = function() {
    var resource = $scope.isRelatedClub ? 'related-clubs' : 'organizations';

    $http({
      method  : 'POST',
      url     : 'https://api.tnyu.org/v1.0/' + resource,
      data    : serializeData($scope.formData, resource),
      headers : { 'Content-Type': 'application/vnd.api+json' }
    })
    .success(function(data) {
      $modalInstance.close(data[resource]);
    });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
