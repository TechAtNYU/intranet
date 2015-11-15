'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	var selectionMode = $stateParams.selectionMode;
	if(!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}
	$scope.selectionMode = selectionMode;
	Restangular.all(resourceName).getList().then(function(data) {
		$scope.data = data;
		if(resourceId) {
			$scope.model = _.find($scope.data, {id: resourceId});
		}
	});

	$scope.updateSelection = function(newModelId) {
		// $state.go("list", {id: newModelId});
		$state.transitionTo('list', 
			{id: newModelId}, 
			{ 
				location: true, 
				inherit: true, 
				relative: $state.$current, 
				notify: false 
			});
	};

	$scope.deleteResource = function(id) {
		console.log("deleteResource", resourceName, id)
		Restangular.one(resourceName, id).remove()
			.then(function() {
				console.log("success")
				alert('Successfully deleted this entry');
				$scope.data = Restangular.all(resourceName).getList().$object;
			}).catch(function() {
				console.log("can not delete")
				alert('Could not delete the entry');
			});
	};
});
