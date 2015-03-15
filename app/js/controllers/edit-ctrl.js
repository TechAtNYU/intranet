'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, Restangular) {

  var resourceName = $stateParams.resourceName,
      resourceId = //$stateParams.id; 
      '53f54dd98d1e62ff12539dbb'; // test id 

  Restangular
    .one(resourceName, resourceId)
    .get()
      .then(function(presenter){

        // transform presenter from Array to String 
        presenter.schools = presenter.schools.join(',');
        // format date for input[type=date]
        if (presenter.graduationDate) {
          presenter.graduationDate = presenter.graduationDate.formatForInputTypeDate(); // see js/lib/extentions.js file 
        }
        
        $scope.presenter = presenter; 
      })

});