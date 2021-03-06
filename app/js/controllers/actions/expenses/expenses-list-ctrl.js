'use strict';

angular
.module('app.controllers')
.controller('ExpensesListCtrl', function($scope, $filter, $rootScope, $stateParams, 
	$state, Restangular, apiDescriptor, dataTransformer, preProcess) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	$scope.reimbursing = {};

	$scope.displayDate = preProcess.displayDate($filter);

	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;

		if (resourceId) {
			$scope.model = _.find($scope.data, {id: resourceId});
		}

		_.each($scope.data, function(element) {
			element = preProcess.convertTimeAttributes(element);	
		//mapping expenseID to reimbursementID
			if (element.relationships.reimbursementFor.data !== null) {
				const url = "https://api.tnyu.org/v3/reimbursement-requests/" + element.relationships.reimbursementFor.data.id;
				$scope.reimbursing[element.id] = "<a href=" + url + ">" + url + "</a>";
			}
		});
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
