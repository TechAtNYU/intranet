'use strict';

angular
.module('app.controllers')
.controller('JobsListCtrl', function($scope, $sce, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer, preProcess) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	$scope.expiredOrNot = function(date){
    const d1 = new Date();
    const d2 = new Date(date);
		return (d1 <= d2) ? "Active" : "Expired";
	}

	var selectionMode = $stateParams.selectionMode;
	if (!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}

	$scope.jobIDtoAttr = {};

	$scope.selectionMode = selectionMode;
	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}

		_.each($scope.data, job => {
			//store all attributes for each job
			const attributes = {};
			//storing employer
			Restangular.one("organizations/" + job.relationships.employer.data.id)
			.get()
			.then(function(employer) {
				attributes['employer'] = employer.attributes.name;
				attributes['display'] = job.attributes.positionTitle + ' @ ' + employer.attributes.name;
			}).then( ()=> {
				//storing url
				if (job.attributes.applicationUrl !== undefined) {
					const url = job.attributes.applicationUrl;
					attributes['url'] = '<a href=' + url + '>' + url + '</a>';
				} else {
					attributes['url'] = '';
				}
				//add expire date
				const expireDate = job.attributes.expiresAt;
				attributes['expireDate'] = expireDate;
				//formate date
				const expireDisplay = preProcess.prettifyDate(expireDate);
				attributes['expireDisplay'] = expireDisplay;
				//storing categories
				const categories = job.attributes.categories;
				attributes['categories'] = categories.join(', ');
				//storing desired skills
				if (job.relationships.desiredSkills.data.length > 0) {
					let skills = [];
					job.relationships.desiredSkills.data.forEach(data => {
						Restangular.one("skills/" + data.id)
						.get()
						.then(skill => {
								skills.push(skill.attributes.name);
								attributes['skills'] = skills.join(', ');
							});
						});
					}
					$scope.jobIDtoAttr[job.id] = attributes;
			}
			);
		});
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
