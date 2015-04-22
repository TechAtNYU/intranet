'use strict';

angular
.module('app.controllers')
.controller('DateCtrl', function($scope) {
	$scope.open = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = true;
	};
});