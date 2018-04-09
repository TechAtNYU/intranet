'use strict';

angular
.module('app.controllers')
.controller('EventAddCtrl', function($scope, $rootScope, $stateParams, $state,
		$interval, Restangular, apiDescriptor, formElementProvider, dataTransformer) {

	var resourceName = $stateParams.resourceName;
	var resource = Restangular.all(resourceName);

	$scope.fep = formElementProvider;

	$scope.data = {};
	$scope.model = {attributes: {}};
	//boolean used for html
	$scope.statusFound = false;

	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
		//In case status field is not found
		if($scope.rdesc.attributes.fields[18].name == "status"){
			$scope.statusFound = true;
		}

		$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
	});

	$scope.createResource = function (model, rdesc, statusOption) {
		if($scope.statusFound){
			model.attributes.status = statusOption;
		}
		else{
			model.attributes.status = "draft";
		}
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
