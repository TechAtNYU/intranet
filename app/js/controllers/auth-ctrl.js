'use strict';

angular
.module('app.controllers')
.controller('AuthCtrl', function($scope, $location, Restangular) {
	Restangular.one('people/me')
		.get()
		.then(function(data) {
			$scope.user = data;
		})
		.catch(function(data) {
			var status = data.data.errors[0].status;
			if(status === '401') {
				$scope.signIn();
			}
		});

	$scope.signIn = function() {
		var url = 'https://api.tnyu.org/v2/auth/facebook?success=' + window.encodeURIComponent($location.absUrl());
		window.location = url;
	};

	$scope.signOut = function() {
		var url = 'https://api.tnyu.org/v2/auth/facebook/logout?success=' + window.encodeURIComponent($location.absUrl());
		// window.location = url;
		console.log(url);
	};
});