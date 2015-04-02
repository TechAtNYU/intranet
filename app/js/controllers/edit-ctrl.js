'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescription, formElementProvider) {
	var resourceName = $stateParams.resourceName, 
		resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);
	$scope.rdesc = apiDescription.resource(resourceName);
	$scope.fep = formElementProvider;
	$scope.model = resource.get().$object;
	// $interval(function() { console.log($scope.model); }, 500);

	$scope.updateResource = function() {
		resource.patch($scope.model);
	};
});
