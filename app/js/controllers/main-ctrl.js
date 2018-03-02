'use strict';

angular
.module('app.controllers')
.controller('MainCtrl', function($q, $scope, apiDescriptor, Restangular, preProcess) {
	apiDescriptor.then(function(apiDescription) {
		
		$scope.apidesc = apiDescription.data;
		$scope.eboard = preProcess.loadCurrentEBoard($scope, preProcess.objectIdtoName('teams'));

		$scope.relatedSites = [
			{	"name": "Tech@NYU",
				"links": {
					"Main": "https://techatnyu.org/",
				}
				
			},
			{	"name": "Intranet",
				"links": {
					"Main": "http://intranet.sexy/#/",
					"Staging": "http://intranet-staging.tnyu.org/#/",
				}
			},
			{	"name": "Calendar",
				"links": {
					"Main": "http://cal.techatnyu.org/",
				}
			},
			{	"name": "RSVP",
				"links": {
					"Main": "http://rsvp.techatnyu.org/",
					"Staging": "http://rsvp-staging.techatnyu.org/",
				}
			},
			{	"name": "Check-In",
				"links": {
					"Main": "http://checkin.techatnyu.org/#/",
					"Staging": "http://checkin-staging.techatnyu.org/#/",
				}
			},
			{	"name": "Discuss",
				"links": {
					"Main": "https://discuss.techatnyu.org/",
				}
			},
			];

		$scope.mainCard = [{	"name": "Events 🚀",
								"id": "events"
							}];

		$scope.subCards = [
			[{	"name": "Teams ⛹🏾",
				"id": "teams"
			},
			{	"name": "Membership 👥",
				"id": "membership"
			},
			{	"name": "Position 👮🏽",
				"id": "positions"
			}],
			[{	"name": "Venue 🏛",
				"id": "venues"
			},
			{	"name": "People 💃🏽",
				"id": "people"
			},
			{	"name": "Organizations 🏙",
				"id": "organizations"
			}]
		];
		$scope.otherResources = [
			{ 	"name": "Jobs",
				"id": "jobs"
			},
			{ 	"name": "Venues",
				"id": "venues"
			},
			{ 	"name": "Policy Proposals",
				"id": "policy-proposals"
			},
			{ 	"name": "Projects",
				"id": "projects"
			},
			{ 	"name": "Income",
				"id": "incomes"
			},
			{ 	"name": "Expense",
				"id": "expenses"
			},
			{ 	"name": "Reimbursement Requests",
				"id": "reimbursement-requests"
			},
			{ 	"name": "Sponsorship Packages",
				"id": "sponsorship-packages"
			},
			{ 	"name": "Surveys",
				"id": "surveys"
			},
			{ 	"name": "Applications",
				"id": "applications"
			},
			{ 	"name": "Skills",
				"id": "skills"
			},
			{ 	"name": "API Keys",
				"id": "api-keys"
			},
			{ 	"name": "Answers",
				"id": "answers"
			},
			{ 	"name": "Questions",
				"id": "questions"
			},
			{ 	"name": "Survey Responses",
				"id": "survey-responses"
			},
			{ 	"name": "School Attendances",
				"id": "school-attendances"
			},
			{ 	"name": "Presenters",
				"id": "presenters"
			},
			{ 	"name": "Related Clubs",
				"id": "related-clubs"
			},
			{ 	"name": "Sponsorship Purchases",
				"id": "sponsorship-purchases"
			}
		];
	});
});
