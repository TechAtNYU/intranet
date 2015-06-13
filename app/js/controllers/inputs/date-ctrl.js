'use strict';

angular
.module('app.controllers')
.controller('DateCtrl', function($scope) {
	$scope.toggleOpen = function($event) {
		$event.preventDefault();
		$event.stopPropagation();

		$scope.opened = !$scope.opened;
	};
});
