'use strict';

angular
.module('app.controllers')
.controller('EventListCtrl', function($scope, $sce, $rootScope, $stateParams,
		$state, Restangular, apiDescriptor, dataTransformer, preProcess) {
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

	var teamsIdToName = preProcess.objectIdtoName('teams');
	var venuesIdToName = preProcess.objectIdtoName('venues');
	var organizationIdToName = preProcess.objectIdtoName('organization');
	var personIdToName = preProcess.objectIdtoName('people');

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
		date: {},
		rsvps: {},
		rsvpCount: {},
		altRsvps: {},
		aims: {},
		categories: {},
		time : {}
	};

	//mapping personID to personName
	Restangular.all('people')
		.getList()
		.then(function(){
			Restangular.all(resourceName)
			.getList()
			.then(function(data) {
				$scope.data = data;
				if (resourceId) {
					var index = _.findIndex($scope.data, {id: resourceId});
					$scope.model = $scope.data[index];
				}

				_.each($scope.data, function(element) {
					element = preProcess.convertTimeAttributes(element);
					$scope.eventDetails.time[element.id] = {};
					$scope.eventDetails.time[element.id].start = preProcess.convertTimeToEST(element.attributes.startDateTime);
					$scope.eventDetails.time[element.id].end = preProcess.convertTimeToEST(element.attributes.endDateTime);
					//mapping eventID to venue names with links
					if (element.relationships.venue.data !== null) {
						var venueURL = "/#/r/venues/list/" + element.relationships.venue.data.id;
						var venueName = "unknown";

						if(venuesIdToName[element.relationships.venue.data.id] != undefined) {
							venueName = venuesIdToName[element.relationships.venue.data.id];
						}
						$scope.eventDetails.venue[element.id] = {
							'url': venueURL,
							'venue_name': venueName
						};
					}

					//mapping eventID to categories
					if (element.attributes.categories.length > 0) {
						element.attributes.categories.forEach(category => {
							if ($scope.eventDetails.categories[element.id] === undefined) {
								$scope.eventDetails.categories[element.id] = category;
							} else {
								var string = $scope.eventDetails.categories[element.id];
								string = string + ", " + category;
								$scope.eventDetails.categories[element.id] = string;
							}
						})
					}

					//mapping eventID to aims
					if (element.attributes.aims.length > 0) {
						$scope.eventDetails.aims[element.id] = element.attributes.aims.join(', ');
					}

					//mapping eventID to team names
					if (element.relationships.teams.data.length > 0) {
						var teamList = element.relationships.teams.data.map(team => teamsIdToName[team.id]);
						$scope.eventDetails.team[element.id] = teamList.join(', ');
					}

					//mapping eventID to survey URI
					if (element.relationships.survey.data !== null) {
						Restangular.one("surveys/" + element.relationships.survey.data.id)
						.get()
						.then(function(survey) {
							$scope.eventDetails.survey[element.id] = survey.attributes.URI;
						});
					}

					//mapping eventID to co-organizers
					if (element.relationships.coorganizers.data !== null) {
						var orgList = element.relationships.coorganizers.data.map(org => organizationIdToName[org.id]);
						$scope.eventDetails.coorganizers[element.id] = orgList.join(', ');
					}

					//mapping eventID to attendees & number of attendees
					$scope.eventDetails.attendeesCount[element.id] = element.relationships.attendees.data.length;
					if (element.relationships.attendees.data.length > 0) {
						var attendees = element.relationships.attendees.data.map(attendees => personIdToName[attendees.id]);
						$scope.eventDetails.attendees[element.id] = attendees.join(', ');
					}

					//mapping eventID to feedback
					if (element.relationships.feedback.data.length > 0) {
						var responses = []
						element.relationships.feedback.data.forEach(response => {
							Restangular.one("survey-responses/" + response.id)
							.get()
							.then(function(data) {
								responses.push(data.id);
								$scope.eventDetails.feedback[element.id] = responses.join(', ');
							});
						})
					}

					//mapping eventID to list and number of RSVPs
					$scope.eventDetails.rsvpCount[element.id] = element.relationships.rsvps.data.length;
					if (element.relationships.rsvps.data.length > 0) {
						var rsvpList = element.relationships.rsvps.data.map(person => personIdToName[person.id]);
						$scope.eventDetails.rsvps[element.id] = rsvpList.join(', ');
					}

					//mapping eventID to alt RSVP urls
					if (element.attributes.alternateRsvpUrls.length > 0) {
						var urls = element.attributes.alternateRsvpUrls.map(url => "<a href=" + url + "</a>" + url);
						$scope.eventDetails.altRsvps[element.id] = urls.join(', ');

					}

					//mapping eventID to teaches
					if (element.relationships.teaches.data.length > 0) {
						var teaches = [];
						element.relationships.teaches.data.forEach(response => {
							Restangular.one("skills/" + response.id)
							.get()
							.then(function(data) {
								teaches.push(data.attributes.name);
								$scope.eventDetails.teaches[element.id] = teaches.join(', ');
							});
						})
					}

					//mapping eventID to addedBy
					if (element.relationships.addedBy !== null && element.relationships.addedBy.data !== null ) {
						var id = element.relationships.addedBy.data.id
						$scope.eventDetails.addedBy[element.id] = personIdToName[id];
					}

					//mapping eventID to presenters
					if (element.relationships.presenters.data.length > 0 ) {
						var presenterList = [];
						element.relationships.presenters.data.forEach(presenter => {
							Restangular.one("presenters/" + presenter.id)
							.get()
							.then(function(data) {
								presenterList.push(data.attributes.name);
								$scope.eventDetails.presenters[element.id] = presenterList.join(', ');
							})
						});
					}
				})
			});
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

	$scope.getVenueLink = function(newModelId) {
		console.log(newModelId);
		var index =	_.findIndex($scope.data, {'id': newModelId});
		$scope.model = $scope.data[index];
		$state.transitionTo('list',
			{id: newModelId, resourceName: 'venue'},
			{notify: false}
		);
	}
});
