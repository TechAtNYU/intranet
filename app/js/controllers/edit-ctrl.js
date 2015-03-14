'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, Restangular) {

  var resourceName = $stateParams.resourceName,
      resourceId = //$stateParams.id; 
      '53f54dd98d1e62ff12539dbb';

  

  Restangular
    .one(resourceName, resourceId)
    .get()
      .then(function(presenter){

        // transform presenter from Array to String 
        presenter.schools = presenter.schools.join(' ');

        // yyyy-MM-dd INSANITY 
        var d = new Date(presenter.graduationDate);
        var yyyy = d.getFullYear().toString(),
              mm = d.getMonth() + 1,
              dd = d.getDate();
        presenter.graduationDate = yyyy + '-' + (mm > 9 ? mm.toString() : '0' + mm) + '-' + (dd.toString() > 9 ? dd : '0' + dd);
        $scope.presenter = presenter; 
      })

});