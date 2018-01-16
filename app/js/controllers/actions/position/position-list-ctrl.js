angular
.module('app.controllers')
.controller('PositionListCtrl', function($scope, $rootScope, $stateParams,
		$state, formatTeamDisplayFilter, Restangular, apiDescriptor, dataTransformer, preProcess) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});
	// PositionID -> Team ID -> Team Name
	var teamsIdToName = preProcess.objectIdtoName('teams');
	Restangular.all(resourceName)
	.getList()
	.then(function(data) {	
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}	
		$scope.data = data;
		_.each($scope.data, function(element) {
			element.attributes.responsibilities = element.attributes.responsibilities.length == 0 ? "None" : element.attributes.responsibilities.join(' ')
			element.attributes.name = preProcess.positionToString(teamsIdToName, element, true);
			element.attributes.team = preProcess.positionToString(teamsIdToName, element, false);
			element.attributes.applicationForm = (element.relationships.applicationForm.data == null ? "None" : element.relationships.applicationForm);
		});
	});

	$scope.updateSelection = function(resourceId) {
		var index =	_.findIndex($scope.data, {'id': resourceId});
		$scope.model = $scope.data[index];
		$state.transitionTo('list',
			{id: resourceId, resourceName: resourceName},
			{notify: false}
		);
	};

	$scope.deleteResource = function(id) {
		dataTransformer.deleteResource($scope.resourceName, id).then(function() {
			alert('Successfully deleted this entry');			
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
