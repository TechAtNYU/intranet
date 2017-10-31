'use strict';

angular
.module('app.controllers')
.controller('PositionListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	console.log("this is position");
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});
	// PositionID -> Team ID -> Team Name
	var teamsIdToName = {};


	//map id to teams (positions)
	Restangular.all('teams')
		.getList()
		.then(function(teams) {
			_.each(teams, function(element) {
				teamsIdToName[element.id] = element.attributes.name;
			});
			Restangular.all(resourceName)
			.getList()
			.then(function(data) {	
				if (resourceId) {
					var index = _.findIndex($scope.data, {id: resourceId});
					$scope.model = $scope.data[index];
				}	
				$scope.data = data;
				_.each($scope.data, function(element) {
					element.attributes.name = teamsIdToName[element.relationships.team.data.id] + (element.attributes.isLead ? " Lead" : "");
					element.attributes.team = teamsIdToName[element.relationships.team.data.id];
					element.attributes.applicationForm = (element.relationships.applicationForm.data==null ? "None" : element.relationships.applicationForm);
				});
			});
		});
	

}); //modular
