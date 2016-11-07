'use strict';

angular
.module('app.controllers')
.controller('MembershipEditCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;

	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	$scope.data = {};
	resource.get().then(function(data) {
		apiDescriptor.then(function(apiDescription) {
			$scope.rdesc = apiDescription.resource(resourceName);
			$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
		});
		$scope.model = dataTransformer.delink(data);
	});

	$scope.updateResource = function (model, rdesc) {
		dataTransformer.updateResource(model, rdesc, resource).then(function (data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id})
		});
	}

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};
});
