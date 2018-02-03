'use strict';

angular
.module('app.controllers')
.controller('MainCtrl', function($scope, apiDescriptor) {
	apiDescriptor.then(function(apiDescription) {
		$scope.apidesc = apiDescription.data;
	});
});
