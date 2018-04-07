'use strict';

angular
.module('app.controllers')
.controller('EventEditCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {

	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	var resource = Restangular.one(resourceName, resourceId);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.statusFound = false;
	

	resource.get().then(function(data) {
		apiDescriptor.then(function(apiDescription) {
			$scope.rdesc = apiDescription.resource(resourceName);
			$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
			
			if($scope.rdesc.attributes.fields[18].name == "status"){
				$scope.statusFound = true;
			}
		});
		$scope.model = dataTransformer.delink(data);
		$scope.statusData = $scope.model.attributes.status;
	});

	$scope.updateResource = function (model, rdesc, statusData) {
		if(statusFound !=0){
			model.attributes.status = statusData;
		}
		dataTransformer.updateResource(model, rdesc, resource).then(function (data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id})
		});
	}

	$scope.refreshData = function(data, fieldResourceType) {
		data[fieldResourceType] = Restangular.all(fieldResourceType).getList().$object;
	};
});
