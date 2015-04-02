'use strict';

angular
.module('app.controllers')
.controller('AddCtrl', function($scope, $rootScope, $stateParams, Restangular, apiDescription, formElementProvider) {
	var resourceName = $stateParams.resourceName, 
		resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);
	$scope.rdesc = apiDescription.resource(resourceName);
	$scope.fep = formElementProvider;
	$scope.model = resource.get().$object;
	// $interval(function() { console.log($scope.model); }, 500);

	// FAKE, but more or less like this...  
	$scope.updateResource = function() {
		console.log($scope.model);
		resource.patch($scope.model);
	};
});