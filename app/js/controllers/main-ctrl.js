'use strict';

angular
.module('app.controllers')
.controller('MainCtrl', function($scope, apiDescriptor, Restangular) {
	apiDescriptor.then(function(apiDescription) {
		$scope.apidesc = apiDescription.data;
		//console.log(preProcess.loadCurrentEBoard());
		$scope.relatedSites = [
			{	"name": "Tech@NYU",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Intranet",
				"mainLink": "https://intranet.sexy/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Calendar",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "RSVP",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Check-In",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Mailtrain",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Mosaico",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			},
			{	"name": "Discuss",
				"mainLink": "https://techatnyu.org/",
				"prodLink": 'https://www.prodink.com',
				"stagingLink": "https://www.staginglink.com"
			}
			];
		$scope.mainCard = [{	"name": "Events 🚀",
							"listLink": "/events/list/",
							"addLink": "/events/add"}];
		$scope.subCards = [
			[{	"name": "Teams ⛹🏾",
			"listLink": "/teams/list/",
			"addLink": "/teams/add"
			},
			{	"name": "Membership 👥",
				"listLink": "/membership/list/",
				"addLink": "/membership/add"
			},
			{	"name": "Position 👮🏽",
				"listLink": "/positions/list/",
				"addLink": "/positions/add"
			}],
			[{	"name": "Venue 🏛",
				"listLink": "/venues/list/",
				"addLink": "/venues/add"
			},
			{	"name": "People 💃🏽",
				"listLink": "/people/list/",
				"addLink": "/people/add"
			},
			{	"name": "Organizations 🏙",
				"listLink": "/organizations/list/",
				"addLink": "/organizations/add"
			}]
		];
		$scope.otherResources = [
			{ 	"name": "Jobs",
				"listLink": "/jobs/list/"
			},
			{ 	"name": "Venues",
				"listLink": "/venues/list/"
			},
			{ 	"name": "Policy Proposals",
				"listLink": "/policy-proposals/list/"
			},
			{ 	"name": "Projects",
				"listLink": "/projects/list/"
			},
			{ 	"name": "Income",
				"listLink": "/incomes/list/"
			},
			{ 	"name": "Expense",
				"listLink": "/expenses/list"
			},
			{ 	"name": "Reimbursement Requests",
				"listLink": "/reimbursement-requests/list/"
			},
			{ 	"name": "Sponsorship Packages",
				"listLink": "/sponsorship-packages/list/"
			},
			{ 	"name": "Surveys",
				"listLink": "/surveys/list/"
			},
			{ 	"name": "Applications",
				"listLink": "/applications/list/"
			},
			{ 	"name": "Skills",
				"listLink": "/skills/list/"
			},
			{ 	"name": "API Keys",
				"listLink": "/api-keys/list/"
			},
			{ 	"name": "Answers",
				"listLink": "/answers/list/"
			},
			{ 	"name": "Questions",
				"listLink": "/questions/list/"
			},
			{ 	"name": "Survey Responses",
				"listLink": "/survey-responses/list/"
			},
			{ 	"name": "School Attendances",
				"listLink": "/school-attendances/list/"
			},
			{ 	"name": "Presenters",
				"listLink": "/presenters/list/"
			},
			{ 	"name": "Related Clubs",
				"listLink": "/related-clubs/list/"
			},
			{ 	"name": "Sponsorship Purchases",
				"listLink": "/sponsorship-purchases/list/"
			}
		];
	});
});
