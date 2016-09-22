'use strict';

angular
.module('app.controllers')
.controller('DefaultAddCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.data = loadLinkedData($scope.rdesc);
	});

	var resourceName = $stateParams.resourceName;

	var resource = Restangular.all(resourceName);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.model = {attributes: {}};

	$scope.createResource = function(model, rdesc) {
		var finalModel = dataTransformer.relink(angular.copy(Restangular.stripRestangular(model)), rdesc);
		finalModel.type = rdesc.id;

		resource.post(finalModel).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		}).catch(function(err) {
			alert('Could not submit to resource. API returned the following error: ' + err.data.errors[0].title);
		});
	};

	//data: array of array type data
	//fieldResourceType: which field to grab
	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};

	// Fetches linked resources &
	// store them in $scope.data for typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.attributes.fields, function(field) {
			var fieldName = field.kind['base-type'];
			var fieldResourceType = field.kind['target-type'];

			if (fieldName === 'Relationship' && !(fieldResourceType in data)) {
				$scope.refreshData(data, fieldResourceType);
			}
		});

		return data;
	};
});
