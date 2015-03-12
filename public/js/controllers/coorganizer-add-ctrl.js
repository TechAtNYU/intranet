'use strict';

angular
.module('app.controllers')
.controller('CoorganizerAddCtrl', function($scope, $modalInstance, $http, Restangular) {
  $scope.liaisons = Restangular.all('people').getList().$object;

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

    result[resource].links = {
      liaisons: data.liaisons
    };

    console.log('JSON Coorganizer', result);
    return result;
  }

  $scope.formData = { inNYUEN: false };

  $scope.submitCoorganizer = function() {
    var resource = $scope.isRelatedClub ? 'related-clubs' : 'organizations';

    Restangular.all(resource).post(formData)
      .then(function(createdObject) {
        $modalInstance.close(createdObject);
      });
  };

  $scope.cancel = function() {
    $modalInstance.dismiss('cancel');
  };
});
