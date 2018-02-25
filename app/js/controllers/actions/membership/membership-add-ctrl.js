'use strict';

angular
.module('app.controllers')
.controller('MembershipAddCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, formatTeamDisplayFilter, Restangular, apiDescriptor, formElementProvider, dataTransformer) {


	var resourceName = $stateParams.resourceName;

	var resource = Restangular.all(resourceName);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.model = {attributes: {}};

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
				$scope.positionIdToName[element.id] = formatTeamDisplayFilter(teamName, isLead);
				$scope.refreshData($scope.data, $scope.rdesc.attributes.fields[1].kind['target-type']);
			});
		});
	});


	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
	});

	$scope.createResource = function (model, rdesc) {
		dataTransformer.createResource(model, rdesc, resource).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		});
	}

	//data: array of array type data
	//fieldResourceType: which field to grab
	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};
});
