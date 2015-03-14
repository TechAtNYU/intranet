'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, Restangular) {
	$scope.name = 'Presenters';

	var resourceName = $stateParams.resourceName;
	var selectionMode = $stateParams.selectionMode;
	if(!selectionMode || (selectionMode !== 'single' && selectionMode !== 'multiple')) {
		selectionMode = 'multiple';
	}
	$scope.selectionMode = selectionMode;
	$scope.models = Restangular.all(resourceName).getList().$object;
});