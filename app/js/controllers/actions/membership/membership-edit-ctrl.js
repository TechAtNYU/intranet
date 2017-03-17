'use strict';

angular
.module('app.controllers')
.controller('MembershipEditCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	$scope.data = {};
	resource.get().then(function(data) {
		apiDescriptor.then(function(apiDescription) {
			$scope.rdesc = apiDescription.resource(resourceName);
			$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
		});
		$scope.model = dataTransformer.delink(data);
	});

	let teamsIdToName = {};
	$scope.positionIdToName = {};
	//mapping teamID to teamName
	Restangular.one('teams')
	.getList()
	.then(function(teams) {
		_.each(teams, function(element) {
			teamsIdToName[element.id] = element.attributes.name;
		});

		//mapping positionID to names
		Restangular.one('positions')
		.getList()
		.then( position => {
			_.each(position, function(element) {
				const isLead = element.attributes.isLead;
				const teamName = teamsIdToName[element.relationships.team.data.id];
				$scope.positionIdToName[element.id] = `${teamName} ${(isLead ? '- Lead' : '')}`;
			});
		});
	});

	$scope.updateResource = function (model, rdesc) {
		dataTransformer.updateResource(model, rdesc, resource).then(function (data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id})
		});
	}

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};
});
