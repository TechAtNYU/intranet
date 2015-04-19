'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, Restangular, apiDescriptor) {

	// Determine resourceName 
	var resourceName = $stateParams.resourceName;
	$scope.resourceName = resourceName;

	// Determine resourceDescription 
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});

	// Determine selectionMode 
	var selectionMode = $stateParams.selectionMode;

	// TODO: Consider saving this boolean expression's value  
	// within a descriptive variable name 
	// as it is long & (to me) its purpose is unclear 
	// e.g. something like "selectionModeIsUnset"
	// Also: is it possible to formulate this to 
	// just have it be 'multiple' by default? 
	// var selectionMode = <expressions> || 'multiple';
	// Maybe not: this seemingly tests for 'otherStrings'
	if(!selectionMode || 
		(selectionMode !== 'single ' && 
		 selectionMode !== 'multiple')) {

		selectionMode = 'multiple';
	}

	$scope.selectionMode = selectionMode;

	// Fetch data 
	$scope.data = []; 

	$scope.fetchIndex = function(){
		$scope.data = Restangular.all(resourceName).getList().$object;
	};

	$scope.fetchIndex();

	// The delete action 
	$scope.deleteResource = function(id) {
		Restangular.one(resourceName, id).remove()
			.then(function() {
				alert('Successfully deleted this entry');
			}).catch(function() {
				alert('Could not delete the entry');
			}).finally(function(){
				$scope.fetchIndex();  	
			});
	};
});