var addListing = angular.module("jobs", [])
.controller("JobsBoard", function($scope) {
	
	$scope.test = "hello there";
	$scope.get = "AAAAA"
	
	
	
});

angular.bootstrap(document, ["jobs"]);