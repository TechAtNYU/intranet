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

	$scope.deleteResource = function(id) {
		Restangular.one(resourceName, id).remove()
			.then(function() {
				alert('Successfully deleted this entry');
			}).catch(function() {
				alert('Could not delete the entry');
			});

		$scope.data = Restangular.all(resourceName).getList().$object;
	};
});