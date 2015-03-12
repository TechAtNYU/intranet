'use strict';

angular
.module('app.controllers')
.controller('PresenterAddCtrl', function($scope, $modalInstance, $http, Restangular) {
	$scope.companies = Restangular.all('organizations').getList().$object;
	$scope.skills = Restangular.all('skills').getList().$object;

	Restangular.all('people').getList()
		.then(function(data) {
			$scope.schools = 
				_(data)
					.pluck('schools') // Extract schools arrays from people
					.flatten() // Flatten school arrays into one big array
					.unique() // Remove duplicates
					.without(null) // Remove the null value (which will be present from people with no school)
					.map(function(school) { // Put into structure required by multi-select
						return { name: school };
					})
					.value(); // Extract real value
		});
		
	$scope.formData = {};
	
	function serializeData(data) {
		var result = {};
		result.links = {
			'presenters.currentEmployer': { type: 'organizations' },
			'presenters.skills': { type: 'skills' }
		};

		result.presenters = {};

		for(var key in data) {
			result.presenters[key] = data[key];
		}

		delete result.presenters.currentEmployer;

		result.presenters.links = {
			currentEmployer: data.currentEmployer,
			skills: $scope.selectedSkills
		};

		console.log('JSON Presenter', result);
		return result;
	}

	$scope.submitPresenter = function() {
		var formData = serializeData($scope.formData);
		Restangular.all('presenters').post(formData)
			.then(function(createdObject) {
				$modalInstance.close(createdObject);
			});
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
});