'use strict';

angular
.module('app.controllers')
.controller('MainCtrl', function($scope, apiDescription) {
	$scope.apidesc = apiDescription.data;
});