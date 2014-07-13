var addListing = angular.module("jobs", [])
.controller("JobsBoard", function($scope) {
	
	$scope.positionTitle = "Hacker in Residence";
	$scope.positionDescription = "You get to build cool stuff every day for the rest of your life! Congrats!";
	$scope.currentCategory = "Engineering";
	$scope.categories = ["Design", "Engineering", "Business Development", "Other"];
	$scope.positionLevel = "Full-Time";
	$scope.levels = ["Full-Time", "Part-Time", "Contract", "Paid Internship", "Unpaid"];

	$scope.applicationURL = "http://techatnyu.org";
	$scope.company = "tech@NYU";
	$scope.companyURL = "http://techatnyu.org";
	$scope.companyDescription = "tech@NYU is the coolest"
	
});

angular.bootstrap(document, ["jobs"]);