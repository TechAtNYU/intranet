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
			$scope.statusField = $scope.rdesc.attributes.fields[18];
			$scope.statusFound = true;
		}
		//Need to make two rdsec so status data is properly created.
		$scope.rdescWithoutStatus = $scope.rdesc;
		$scope.rdescWithoutStatus.attributes.fields = $scope.rdesc.attributes.fields.filter((element) => {return element.name != "status";})
	//If not found, the page will load with the default field and submit button
		if($scope.statusFound){
			$scope.data = dataTransformer.loadLinkedData($scope.rdescWithoutStatus, $scope.refreshData);
		}
		else{
			$scope.data = dataTransformer.loadLinkedData($scope.rdesc, $scope.refreshData);
		}
	});

	$scope.createResourceTest = function(model, rdesc, statusField){
		dataTransformer.createResource(model, rdesc, resource).then(function(data) {
			$state.go('list', {resourceName: resourceName, selectionMode: 'single', id: data.id});
		})
	}

	$scope.createResource = function (model, rdesc, status) {
		if(statusFound){
			if(status == 0){
				model.attributes.status = "draft";
			}
			else if(status == 1){
				model.attributes.status = "announced";
			}
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
