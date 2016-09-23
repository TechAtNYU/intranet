'use strict';

angular
.module('app.controllers')
.controller('EventAddCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		$scope.fieldOne = $scope.rdesc.attributes.fields[0];
		$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
	});

	var resourceName = $stateParams.resourceName;

	var resource = Restangular.all(resourceName);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.model = {attributes: {}};

	$scope.createResource = function (model, rdesc) {
		dataTransformer.createResource(model, rdesc, resource).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		})
	}

	//data: array of array type data
	//fieldResourceType: which field to grab
	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};
});
