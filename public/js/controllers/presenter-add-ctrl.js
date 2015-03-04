'use strict';

angular
.module('app.controllers')
.controller('PresenterAddCtrl', function($scope, $modalInstance, $http) {
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