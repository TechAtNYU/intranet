'use strict';

angular
.module('app.controllers')
.controller('EventListCtrl', function($scope, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
	var resourceName = $stateParams.resourceName;
	var resourceId = $stateParams.id;
	$scope.resourceName = resourceName;
	apiDescriptor.then(function(apiDescription) {
		$scope.rdesc = apiDescription.resource(resourceName);
	});


	$scope.displayDate = function(date) {
		if (date == undefined) { return; };
		var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
		var year = parseInt(date.substring(0,4));
		var month = parseInt(date.substring(5, 7));
		return monthNames[month - 1] + " " + year;
	}

	var teamsIdToName = {};
	var venuesIdToName = {};
	var organizationIdToName = {};
	var personIdToName = {};
	$scope.eventRSVPCount = {};

	$scope.eventDetails = {
		venue : {},
		team 	: {},
		survey: {},
		feedback: {},
		coorganizers: {},
		presenters: {},
		addedBy: {},
		attendees: {},
		attendeesCount: {},
		teaches: {},
		date: {}
	};

	//mapping teamID to teamName
	Restangular.all('teams')
		.getList()
		.then(function(teams) {
			_.each(teams, function(element) {
				teamsIdToName[element.id] = element.attributes.name;
			});
		});

	//mapping venueID to venueName
	Restangular.all('venues')
		.getList()
		.then(function(teams) {
			_.each(teams, function(element) {
				venuesIdToName[element.id] = element.attributes.name;
			});
		});

	//mapping organization to organizationName
	Restangular.all('organizations')
		.getList()
		.then(function(organization) {
			_.each(organization, function(element) {
				organizationIdToName[element.id] = element.attributes.name;
			});
		});

	//mapping personID to personName
	Restangular.all('people')
		.getList()
		.then(function(person) {
			_.each(person, function(element) {
				personIdToName[element.id] = element.attributes.name;
			});
		});

	Restangular.all(resourceName)
	.getList()
	.then(function(data) {
		$scope.data = data;
		console.log($scope.data[0]);
		if (resourceId) {
			var index = _.findIndex($scope.data, {id: resourceId});
			$scope.model = $scope.data[index];
		}

		_.each($scope.data, function(element) {
			//mapping eventID to venue names
			if (element.relationships.venue.data != null) {
				$scope.eventDetails.venue[element.id] = venuesIdToName[element.relationships.venue.data.id];
			};//end

			//mapping eventID to team names
			if (element.relationships.teams.data.length > 0) {
				element.relationships.teams.data.forEach( team => {
					if ($scope.eventDetails.team[element.id] == undefined) {
						$scope.eventDetails.team[element.id] = teamsIdToName[team.id];
					} else {
						var string = $scope.eventDetails.team[element.id];
						string = string + ", " + teamsIdToName[team.id];
						$scope.eventDetails.team[element.id] = string;
					}
				});
			};//end

			//mapping eventID to survey URI
			if (element.relationships.survey.data != null) {
				Restangular.one("surveys/" + element.relationships.survey.data.id)
				.get()
				.then(function(survey) {
					$scope.eventDetails.survey[element.id] = survey.attributes.URI;
				});
			};//end

			//mapping eventID to co-organizers
			if (element.relationships.coorganizers.data != null) {
				element.relationships.coorganizers.data.forEach( organization => {
					if ($scope.eventDetails.coorganizers[element.id] == undefined) {
						$scope.eventDetails.coorganizers[element.id] = organizationIdToName[organization.id];
					} else {
						var string = $scope.eventDetails.coorganizers[element.id];
						string = string + ", " + organizationIdToName[organization.id];
						$scope.eventDetails.coorganizers[element.id] = string;
					}
				})
			};//end

			//mapping eventID to attendees & number of attendees
			$scope.eventDetails.attendeesCount[element.id] = element.relationships.attendees.data.length;
			if (element.relationships.attendees.data.length > 0) {
				element.relationships.attendees.data.forEach(response => {
					if ($scope.eventDetails.attendees[element.id] === undefined) {
						$scope.eventDetails.attendees[element.id] = personIdToName[response.id];
					} else {
						var string = $scope.eventDetails.attendees[element.id];
						string = string + ", " + personIdToName[response.id];
						$scope.eventDetails.attendees[element.id] = string;
					}
				});
			}//end

			//mapping eventID to number of RSVPs
			$scope.eventRSVPCount[element.id] = element.relationships.rsvps.data.length;

			//mapping eventID to feedback
			if (element.relationships.feedback.data.length > 0) {
				element.relationships.feedback.data.forEach(response => {
					Restangular.one("survey-responses/" + response.id)
					.get()
					.then(function(data) {
						if ($scope.eventDetails.feedback[element.id] == undefined) {
							$scope.eventDetails.feedback[element.id] = data.id;
						} else {
							var string = $scope.eventDetails.feedback[element.id];
							string = string + ", " + data.id;
							$scope.eventDetails.feedback[element.id] = string;
						}
					});
				})
			}//end

			//mapping eventID to teaches
			if (element.relationships.teaches.data.length > 0) {
				element.relationships.teaches.data.forEach(response => {
					Restangular.one("skills/" + response.id)
					.get()
					.then(function(data) {
						if ($scope.eventDetails.teaches[element.id] == undefined) {
							$scope.eventDetails.teaches[element.id] = data.attributes.name;
						} else {
							var string = $scope.eventDetails.teaches[element.id];
							string = string + ", " + data.attributes.name;
							$scope.eventDetails.teaches[element.id] = string;
						}
					});
				})
			}//end

			//mapping eventID to addedBy
			if (element.relationships.addedBy != null && element.relationships.addedBy.data != null ) {
				Restangular.one("people/" + element.relationships.addedBy.data.id)
				.get()
				.then(function(data) {
						$scope.eventDetails.addedBy[element.id] = data.attributes.name;
				});
			}

			//mapping eventID to presenters
			if (element.relationships.presenters.data.length > 0 ) {
				element.relationships.presenters.data.forEach(presenter => {
					Restangular.one("presenters/" + presenter.id)
					.get()
					.then(function(data) {
						if ($scope.eventDetails.presenters[element.id] == undefined) {
							$scope.eventDetails.presenters[element.id] = data.attributes.name;
						} else {
							var string = $scope.eventDetails.presenters[element.id];
							string = string + ", " + data.attributes.name;
							$scope.eventDetails.presenters[element.id] = string;
						}
					});
				})
			}
		});//end _.each()
	});

	$scope.updateSelection = function(newModelId) {
		var index =	_.findIndex($scope.data, {'id': newModelId});
		$scope.model = $scope.data[index];
		$state.transitionTo('list',
			{id: newModelId, resourceName: resourceName},
			{notify: false}
		);
	};

	$scope.deleteResource = function(id) {
		dataTransformer.deleteResource($scope.resourceName, id).then(function() {
			alert('Successfully deleted this entry');
			$scope.data = Restangular.all($scope.resourceName).getList().$object;
			$scope.model = {};
			$state.transitionTo('list',
				{resourceName: $scope.resourceName},
				{
					inherit: false,
					notify: false,
					reload: true
				}
			);
		});
	};
});
