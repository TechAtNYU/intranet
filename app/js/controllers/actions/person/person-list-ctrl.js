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

	var selectionMode = $stateParams.selectionMode;
	if (!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}

	// var currentEmployer = '';
	// var schools = '';
	// var roles = {};
	// var skills = {};
	// var wantsToLearn = {};

	//image URL to render a link!

	$scope.selectionMode = selectionMode;
	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}

		//mapping personID to name, position and display information
		_.each($scope.data, function(person) {
			//getting currentEmployer
			if (person.relationships.currentEmployer.data != null) {
				Restangular.one("organizations/" + person.relationships.currentEmployer.data.id)
				.get()
				.then(function(org) {
					// console.log(org.attributes.name);
					// console.log(org.attributes.url); //some URLs are undefined...
				});
			}

			//getting schools
			var schools = '';
			if (person.relationships.schools.data != null && person.relationships.schools.data.length > 0) {
				person.relationships.schools.data.forEach(function(school) {
					Restangular.one("school-attendances/" + school.id)
					.get()
					.then(function(data) {
						if (schools.length === 0) {
							schools = data.attributes.schoolName;
						} else {
							schools = schools + ", " + data.attributes.schoolName;
						}
						// console.log(schools);
					});
				})
			};

			//get skills
			var skills = '';
			if (person.relationships.skills.data != null && person.relationships.skills.data.length > 0) {
				person.relationships.skills.data.forEach(function(skill) {
					Restangular.one("skills/" + skill.id)
					.get()
					.then(function(data) {
						if (skills.length === 0) {
							skills = data.attributes.name;
						} else {
							skills = skills + ", " + data.attributes.name;
						}
						// console.log(skills);
					});
				});
			}

			//get wantsToLearn
			var learn = '';
			if (person.relationships.wantsToLearn.data != null && person.relationships.wantsToLearn.data.length > 0) {
				person.relationships.wantsToLearn.data.forEach(function(name) {
					Restangular.one("skills/" + name.id)
					.get()
					.then(function(data) {
						if (learn.length === 0) {
							learn = data.attributes.name;
						} else {
							learn = learn + ", " + data.attributes.name;
						}
						// console.log(learn);
					});
				});
			}

		});//end for each loop
	});


	$scope.updateSelection = function(newModelId) {
		// $state.go("list", {id: newModelId});
		$state.transitionTo('list',
			{id: newModelId},
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
