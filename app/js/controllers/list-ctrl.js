'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, Restangular, apiDescriptor) {
	var resourceName = $stateParams.resourceName;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	var selectionMode = $stateParams.selectionMode;
	if(!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}
	$scope.selectionMode = selectionMode;
	$scope.data = Restangular.all(resourceName).getList().$object;
	// $scope.model = {};
});