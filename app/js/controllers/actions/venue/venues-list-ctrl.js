'use strict';

angular
.module('app.controllers')
.controller('VenuesListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	var selectionMode = $stateParams.selectionMode;
	if (!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}

	$scope.selectionMode = selectionMode;
	Restangular.all(resourceName).getList().then(function(data) {
		$scope.data = data;

		if (resourceId) {
			$scope.model = _.find($scope.data, {id: resourceId});
			console.log($scope.model);
		}
	});

	$scope.updateSelection = function(newModelId) {
	 		var index =	_.findIndex($scope.data, {'id': newModelId});
	 		$scope.model = $scope.data[index];
	 		$state.transitionTo('list',
	 			{id: newModelId, resourceName: resourceName},
	 			{notify: false}
	 		);
	 };

	$scope.deleteResource = function(id) {
		dataTransformer.deleteResource($scope.resourceName, id).then(function() {
			alert('Successfully deleted this entry');
			$scope.data = Restangular.all($scope.resourceName).getList().$object;
			$scope.model = {};
			$state.transitionTo('list',
				{resourceName: $scope.resourceName},
				{
					inherit: false,
					notify: false,
					reload: true
				}
			);
		});
	};
});
