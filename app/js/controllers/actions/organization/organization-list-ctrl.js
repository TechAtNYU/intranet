'use strict';

angular
.module('app.controllers')
.controller('OrganizationListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	//maps organizationID to an array of liaison details object
	var orgIdToLiaisons = {};
	//maps organizationID to the information to display
	$scope.liaisonsDisplay = {};

	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		};

		//mapping organizationID to every liaison in it
		_.each($scope.data, function(element) {
					//loop through every liaison in the organization
					_.each(element.relationships.liaisons.data, function(liaison) {
						Restangular.one("people/" + liaison.id)
						.get()
						.then(function(person) {
							var details = {
								'name': person.attributes.name
							}

							if (orgIdToLiaisons[element.id] == null) {
								orgIdToLiaisons[element.id] = [details];
							} else {
								orgIdToLiaisons[element.id].push(details);
							}

							//generating display text
							var displayText = "";
							for (var i = 0; i < orgIdToLiaisons[element.id].length; i++) {
								if (i == 0) {
										displayText = orgIdToLiaisons[element.id][i].name;
								} else {
									displayText = displayText + ", " + orgIdToLiaisons[element.id][i].name;
									$scope.liaisonsDisplay[element.id] = displayText;
								}
							}
						});
					});//end individual liaison loop
			})
		});//end Restangular function call

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
