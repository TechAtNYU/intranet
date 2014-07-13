var addListing = angular.module("jobs", [])
.controller("JobsBoard", function($scope) {
	
	$scope.positionTitle = "Hacker in Residence";
	$scope.positionDescription = "You get to build cool stuff every day for the rest of your life! Congrats!";
	$scope.positionCategory = "Engineering";
	$scope.categories = ["Design", "Engineering", "Business Development", "Other"];
	$scope.positionLevel = "Full-Time";
	$scope.levels = ["Full-Time", "Part-Time", "Contract", "Paid Internship"];

	$scope.applicationURL = "http://techatnyu.org";
	$scope.company = "tech@NYU";
	$scope.companyURL = "http://techatnyu.org";
	$scope.companyDescription = "tech@NYU is the coolest"
	
	$scope.pendingList = [
		{
			positionTitle: "Hacker in Residence",
			description: "You get to build cool stuff every day for the rest of your life! Congrats!",
			category: "Engineering",
			positionLevel: "Full-Time",
			applicationUrl: "http://techatnyu.org/cool",
			company: {
				name: "tech@NYU",
				url: "http://techatnyu.org",
				description: "tech@NYU is the coolest"
			}
		},
		{
			positionTitle: "Businessman",
			description: "I'm late for business",
			category: "Business Development",
			positionLevel: "Part-Time",
			applicationUrl: "http://techatnyu.org/cool",
			company: {
				name: "tech@NYU",
				url: "http://techatnyu.org",
				description: "tech@NYU is the coolest"
			}
		},
		{
			positionTitle: "Other",
			description: "You get to build cool stuff every day for the rest of your life! Congrats!",
			category: "Engineering",
			positionLevel: "Full-Time",
			applicationUrl: "http://techatnyu.org/cool",
			company: {
				name: "tech@NYU",
				url: "http://techatnyu.org",
				description: "tech@NYU is the coolest"
			}
		}
	]
	
});

angular.bootstrap(document, ["jobs"]);