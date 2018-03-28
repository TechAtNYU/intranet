'use strict';

angular
.module('app.controllers')
.controller('PersonListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer, preProcess) {
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

	$scope.personIDtoAttr = {};

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
			person = preProcess.changeDate(person);
			var personData= {};
			//getting roles
			if (person.attributes.roles != null && person.attributes.roles.length > 0) {
				personData.roles = person.attributes.roles.join(', ');
			}

			//getting currentEmployer
			if (person.relationships.currentEmployer.data != null) {
				Restangular.one("organizations/" + person.relationships.currentEmployer.data.id)
				.get()
				.then(function(org) {
					personData.currentEmployer= org.attributes.name;
				});
			}

			//getting schools
			var schools = [];
			if (person.relationships.schools.data != null && person.relationships.schools.data.length > 0) {
				person.relationships.schools.data.forEach(function(school) {
					Restangular.one("school-attendances/" + school.id)
					.get()
					.then(function(data) {
						schools.push(data.attributes.schoolName);
						personData.schools = schools.join(', ');
					});
				})
			};

			//get skills
			var skills = [];
			if (person.relationships.skills.data != null && person.relationships.skills.data.length > 0) {
				person.relationships.skills.data.forEach(function(skill) {
					Restangular.one("skills/" + skill.id)
					.get()
					.then(function(data) {
						skills.push(data.attributes.name);
						personData.skills = skills.join(', ');
					});
				});
			}

			//get wantsToLearn
			var learn = [];
			if (person.relationships.wantsToLearn.data != null && person.relationships.wantsToLearn.data.length > 0) {
				person.relationships.wantsToLearn.data.forEach(function(name) {
					Restangular.one("skills/" + name.id)
					.get()
					.then(function(data) {
						learn.push(data.attributes.name);
						personData.learn = learn.join(', ');
					});
				});
			}

			//get wantsToHire
			var hire = [];
			if (person.relationships.wantsToHire.data != null && person.relationships.wantsToHire.data.length > 0) {
				person.relationships.wantsToHire.data.forEach(function(name) {
					Restangular.one("skills/" + name.id)
					.get()
					.then(function(data) {
						hire.push(data.attributes.name);
						personData.wantsToHire = hire.join(', ');
					});
				});
			}

			//get image url
			var imgURL = '';
			if (person.attributes.imgUrl != null || person.attributes.imgUrl != undefined) {
				var url = person.attributes.imgUrl;
				imgURL = "<a href=\"" + url + "\">" + url + "</a>";
				personData.imgURL = imgURL;
			}

			$scope.personIDtoAttr[person.id] = personData;
		});//end for each loop
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
