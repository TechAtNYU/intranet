'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $interval, Restangular, apiDescription, formElementProvider) {
	$scope.data = {};

	var resourceName = $stateParams.resourceName, 
				resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.rdesc = apiDescription.resource(resourceName);
	$scope.fep = formElementProvider;

	// Fetch linked resources & 
	// store them in $scope.data for typeahead
	
	_.each($scope.rdesc.fields, function(field){

		var fieldName = field.kind.name,
				fieldResourceType = field.kind.targetType; 

		if((fieldName === 'Link') &&
			!(fieldResourceType in $scope.data)){
			$scope.data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
		} 
	});

	$scope.model = resource.get().$object;
	// $interval(function() { console.log($scope.model); }, 500);

	$scope.updateResource = function() {
		resource.patch($scope.model);
	};
});
