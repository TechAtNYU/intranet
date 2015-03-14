'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, Restangular) {
	var resourceName = $stateParams.resourceName;
	$scope.resourceName = resourceName;
	var selectionMode = $stateParams.selectionMode;
	if(!selectionMode || (selectionMode !== 'single ' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}
	$scope.selectionMode = selectionMode;
	$scope.models = Restangular.all(resourceName).getList().$object;
});