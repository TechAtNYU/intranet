'use strict';

angular
.module('app.controllers')
.controller('CoorganizerAddCtrl', function($scope, $modalInstance, $http) {
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
