'use strict';

angular
.module('app.controllers')
.controller('EditCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	$scope.data = {};
	resource.get().then(function(data) {
		apiDescriptor.then(function(apiDescription) {
			$scope.rdesc = apiDescription.resource(resourceName);
			$scope.data = loadLinkedData($scope.rdesc);
		});
		$scope.model = dataTransformer.delink(data);
	});

	$scope.updateResource = function(model, rdesc) {
		var finalModel = dataTransformer.relink(angular.copy(Restangular.stripRestangular(model)), rdesc);

		console.log('Pre', finalModel);
		$scope.rdesc.attributes.fields.forEach(function(field) {
			if (field.validation.readOnly && field.name !== 'id') {
				delete finalModel.attributes[field.name];
			}
		});
		console.log('Post', finalModel);
		resource.patch(finalModel).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		}).catch(function(err) {
			alert('Could not submit to resource. API returned the following error: ' + err.data.errors[0].title);
		});
	};

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object; 
	};

	// Fetches linked resources and stores them in $scope.data for typeahead
	var loadLinkedData = function(rdesc) {
		var data = {};

		_.each(rdesc.attributes.fields, function(field){
			var fieldName = field.kind.name,
				fieldResourceType = field.kind.targetType; 

			if ((fieldName === 'Link') && !(fieldResourceType in data)) {
				$scope.refreshData(data, fieldResourceType);
			}
		});

		return data;
	};

	$scope.change = function(v) {
		console.log(v);
	};
});
