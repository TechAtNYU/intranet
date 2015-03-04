'use strict';

angular
.module('app.controllers')
.controller('VenueAddCtrl', function($scope, $modalInstance, $http, Restangular) {
	// Get the list of all organizations, and unwrap the resulting promise
	// into a plain object that our view can use
	$scope.companies = Restangular.all('organizations').getList().$object;
	$scope.showAddCompanyForm = false;

	$scope.addCompany = function() {
		$scope.showAddCompanyForm = true;
	};

	function serializeData(data) {
		var result = {};
		result.links = {};
		result.links['venues.organization'] = {};
		result.links['venues.organization'].type = 'organizations';

		result.venues = {};

		for(var key in data) {
			result.venues[key] = data[key];
		}

		delete result.venues.organization;

		result.venues.links = {};
		result.venues.links.organization = data.organization;

		console.log('JSON Venue', result);
		return result;
	}

	$scope.formData = {};

	$scope.submitVenue = function() {
		var formData = serializeData($scope.formData);
		Restangular.all('venues').post(formData).then(function(createdObject) {
			$modalInstance.close(createdObject);
		});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});