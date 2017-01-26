'use strict';

angular
.module('app.controllers')
.controller('PersonListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});


	var teamsIdToName = {};
	$scope.memberDetails = {};

	//mapping teamID to teamName
	Restangular.all('teams')
		.getList()
		.then(function(teams) {
			_.each(teams, function(element) {
				teamsIdToName[element.id] = element.attributes.name;
			});
		});


	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}
		//mapping memberID to name, position and display information
		_.each($scope.data, function(element) {
			Restangular.one("people/" + element.relationships.member.data.id)
			.get()
			.then(function(person) {
				Restangular.one("positions/" + element.relationships.position.data.id)
				.get()
				.then(function(position) {
					$scope.memberDetails[element.id] = {
						'name': person.attributes.name,
						'position': teamsIdToName[position.relationships.team.data.id] + (position.attributes.isLead ? " (Lead)" : ""),
						'display': person.attributes.name + " | " + teamsIdToName[position.relationships.team.data.id] + (position.attributes.isLead ? " (Lead)" : "")
					};
				});
			});
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
			//$scope.data = Restangular.all($scope.resourceName).getList().$object;
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
