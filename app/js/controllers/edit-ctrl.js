'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $sce, Restangular, apiDescription, formElementProvider) {
  var resourceName = $stateParams.resourceName,
      resourceId = //$stateParams.id; 
      '53f54dd98d1e62ff12539dbb'; // test id 
  $scope.rdesc = apiDescription.resource(resourceName);
  $scope.fep = formElementProvider;
  console.log($scope.rdesc);

  var resource = Restangular.one(resourceName, resourceId);

  resource.get()
    .then(function(presenter) {
      // // transform schools to String 
      // presenter.schools = presenter.schools.join(',');

      // // format date for input[type=date]
      // if (presenter.graduationDate) {
      //   presenter.graduationDate = presenter.graduationDate.formatForInputTypeDate(); // see js/lib/extentions.js  
      // }
    
      // $scope.presenter = Restangular.stripRestangular(presenter);
    });

  // FAKE, but more or less like this...  
  $scope.updateResource = function(){
    console.log($scope.presenter);
    // resource.put($scope.presenter); ClayReedA gets 403 Forbidden 
  };
});