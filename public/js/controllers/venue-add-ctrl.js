'use strict';

angular
.module('app.controllers')
.controller('VenueAddCtrl', function($scope, $modalInstance, $http) {
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