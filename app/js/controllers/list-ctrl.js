'use strict';

angular
.module('app.controllers')
.controller('ListCtrl', function($scope, $rootScope, $stateParams, Restangular) {
	$scope.name = 'Presenters';

	var resourceName = $stateParams.resourceName;
	
	$scope.selectionMode = selectionMode;
	$scope.models = Restangular.all(resourceName).getList().$object;
});