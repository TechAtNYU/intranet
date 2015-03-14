'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, Restangular) {

  var resourceName = $stateParams.resourceName,
      resourceId = //$stateParams.id; 
      '5403bec2627d5f43512ce1dc';

  $scope.presenter = Restangular
    .one(resourceName, resourceId)
    .get().$object;

});