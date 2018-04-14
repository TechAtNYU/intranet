'use strict';

angular
.module('app.controllers')
.controller('VenuesListCtrl', function($scope, $rootScope, $stateParams, $state,
	Restangular, apiDescriptor, dataTransformer, preProcess, uiGmapGoogleMapApi) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	//Gmap origin setup
	$scope.map = { center: { latitude: 40.72, longitude: -73.98 }, zoom: 13 };
	$scope.options = { scrollwheel: false };
	$scope.allMarkers = [];
	var geocoder = new google.maps.Geocoder();

	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	var selectionMode = $stateParams.selectionMode;
	if (!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}

	var markers = [];
	$scope.selectionMode = selectionMode;
	Restangular.all(resourceName)
		.getList()
		.then(function(data) {
		$scope.data = data;

		if (resourceId) {
			$scope.model = _.find($scope.data, {id: resourceId});
		}

		$scope.organizations = {};
		//mapping venueID to organizations
		_.each($scope.data, function(element) {
			element = preProcess.convertTimeAttributes(element);
			geocoder.geocode( { 'address': element.attributes.address}, function(results, status) {
				if(status === 'OK'){
					markers.push({
						'id':
						{
							'latitude': results[0].geometry.location.lat(),
							'longitude': results[0].geometry.location.lng(),
							'title': element.attributes.name
						}
					});
				}
			});
			if (element.relationships.organization.data !== null) {
				Restangular.one("organizations/" + element.relationships.organization.data.id)
				.get()
				.then(org => {
					$scope.organizations[element.id] = org.attributes.name;
				});
			}
		})
		$scope.allMarkers = markers;
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
