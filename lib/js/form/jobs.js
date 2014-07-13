var addListing = angular.module("jobs", [])
.controller("JobsBoard", function($scope) {
	
	$scope.categories = ["Design", "Engineering", "Business Development", "Other"];
	$scope.levels = ["Full-Time", "Part-Time", "Contract", "Paid Internship"];
	
	$scope.currentTitle = "";
	$scope.currentDescription = "";
	$scope.currentCategory = "";
	$scope.currentLevel = "";

	$scope.currentApp = "";
	$scope.currentCompany = "";
	$scope.currentCompanyURL = "";
	$scope.currentCompanyDescription = "";
	$scope.currentCompanyPaid = "";
	
	$scope.preview = false;

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
	
	$scope.doPreview = function(set, listing) {
		$scope.preview = set;
		
		if (listing == undefined) {
			return;
		}
		
		var selected = $scope.pendingList[listing];
		
		$scope.currentTitle = selected.positionTitle;
		$scope.currentDescription = selected.description;
		$scope.currentApp = selected.applicationUrl;
		$scope.currentCategory = selected.category;
		$scope.currentLevel = selected.positionLevel;

		$scope.currentCompany = selected.company.name;
		$scope.currentCompanyURL = selected.company.url;
		$scope.currentCompanyDescription = selected.company.description;
	}
	
});

angular.bootstrap(document, ["jobs"]);