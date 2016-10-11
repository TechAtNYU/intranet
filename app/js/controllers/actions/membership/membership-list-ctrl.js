'use strict';

angular
.module('app.controllers')
.controller('MembershipListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
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
	var teamsMap = {};
	$scope.rolesMap = {};
	$scope.details = {};
	$scope.selectionMode = selectionMode;
	Restangular.all('teams')
		.getList()
		.then(function(teams) {
			_.each(teams, function(element) {
				teamsMap[element.id] = element.attributes.name;
			});
		});
	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = dataTransformer.delink($scope.data[index]);
		}
		_.each($scope.data, function(element) {
			Restangular.one("people/" + element.relationships.member.data.id)
			.get()
			.then(function(person) {
				Restangular.one("positions/" + element.relationships.position.data.id + "?include=team")
				.get()
				.then(function(position) {
					$scope.rolesMap[element.id] = person.attributes.name + " | " +teamsMap[position.relationships.team.data.id] + (position.attributes.isLead ? " (Lead)" : "");
					$scope.details[element.id] = {
						'name': person.attributes.name,
						'position': teamsMap[position.relationships.team.data.id] + (position.attributes.isLead ? " (Lead)" : "")
					};
				});
			});
		});
	});


	$scope.updateSelection = function(newModelId) {
		var index =	_.findIndex($scope.data, {'id': newModelId});
		$scope.model = $scope.data[index];
		// console.log(newModelId);
		// console.log($scope.data);
		// $state.go("list", {'id': newModelId});
		$state.transitionTo('list',
			{id: newModelId, resourceName: resourceName},
			{notify: false}
		);
	};


	$scope.deleteResource = function(id) {
		dataTransformer.deleteResource($scope.resourceName, id).then(function() {
			alert('Successfully deleted this entry');
			$scope.data = Restangular.all($scope.resourceName).getList().$object;
			console.log($scope.data);
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
