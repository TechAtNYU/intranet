'use strict';

angular
.module('app.controllers')
.controller('MainCtrl', function($q, $scope, apiDescriptor, Restangular, preProcess) {
	apiDescriptor.then(function(apiDescription) {
		
		$scope.apidesc = apiDescription.data;
		$scope.eboard = preProcess.loadCurrentEBoard($scope, preProcess.objectIdtoName('teams'));

		$scope.related_sites = [
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
		
		$scope.other_sites = [
			{	"name": "Ship",
				"links": {
					"Main": "http://ship.techatnyu.org/",
				}
			},
			{	"name": "Demo Days",
				"links": {
					"Main": "http://demodays.co/",
				}
			},
		];

		$scope.main_card = [
			{"name": "Events 🚀",
			"id": "events"
			}
		];

		$scope.sub_cards = [
			[{	"name": "Teams ⛹🏾",
				"id": "teams"
			},
			{	"name": "Memberships 👥",
				"id": "memberships"
			},
			{	"name": "Positions 👮🏽",
				"id": "positions"
			}],
			[{	"name": "Venues 🏛",
				"id": "venues"
			},
			{	"name": "People 💃🏽",
				"id": "people"
			},
			{	"name": "Organizations 🏙",
				"id": "organizations"
			}]
		];

		// collect the ids of all our resources
		var all_ids = $scope.apidesc.map(data => data.id)
		// get the ids of cards that are on the main and sub cards
		var ids_already_exist = $scope.main_card.concat($scope.sub_cards[0]).concat($scope.sub_cards[1]).map(data => data.id)
		// get the difference of those ids to display in the 'other resources' section without hardcoding them
		$scope.other_resource_ids = all_ids.filter(id => !ids_already_exist.includes(id));
		
		$scope.resource_name = function(resource_id) {
				return apiDescription.resource(resource_id).attributes.name.plural;
			}
		});	
	});
