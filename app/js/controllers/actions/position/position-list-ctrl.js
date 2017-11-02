'use strict';

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
	var teamsIdToName = preProcess.teamIdtoNames();
	//map id to teams (positions)
	Restangular.all(resourceName)
	.getList()
	.then(function(data) {	
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}	
		$scope.data = data;
		_.each($scope.data, function(element) {
			const name = preProcess.positionToString(teamsIdToName, element);
			element.attributes.name = formatTeamDisplayFilter(name, element.attributes.isLead);
			element.attributes.team = name;
			element.attributes.applicationForm = (element.relationships.applicationForm.data==null ? "None" : element.relationships.applicationForm);
		});
	});
	

}); //modular

//			element.attributes.name = formatTeamDisplayFilter(preProcess.positionToString(preProcess, element), element.attributes.isLead);
//teamsIdToName[element.relationships.team.data.id]