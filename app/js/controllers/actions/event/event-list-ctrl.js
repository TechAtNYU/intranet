'use strict';

angular
.module('app.controllers')
.controller('EventListCtrl', function($scope, $sce, $rootScope, $stateParams, $state, Restangular, apiDescriptor, dataTransformer) {
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
		categories: {}
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
		})
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
					//mapping eventID to venue names with links
					if (element.relationships.venue.data != null) {
						// !! change venueURL to the venue page once the venue override page is ready
						var venueURL = "https://api.tnyu.org/v3/venues/" + element.relationships.venue.data.id;
						$scope.eventDetails.venue[element.id] = "<a href=" + venueURL + ">" + venuesIdToName[element.relationships.venue.data.id] + "</a>";
					};//end

					//mapping eventID to categories
					if (element.attributes.categories.length > 0) {
						element.attributes.categories.forEach(category => {
							if ($scope.eventDetails.categories[element.id] == undefined) {
								$scope.eventDetails.categories[element.id] = category;
							} else {
								var string = $scope.eventDetails.categories[element.id];
								string = string + ", " + category;
								$scope.eventDetails.categories[element.id] = string;
							}
						})
					};//end

					//mapping eventID to aims
					if (element.attributes.aims.length > 0) {
						element.attributes.aims.forEach(aim => {
							if ($scope.eventDetails.aims[element.id] == undefined) {
								$scope.eventDetails.aims[element.id] = aim;
							} else {
								var string = $scope.eventDetails.aims[element.id];
								string = string + ", " + aim;
								$scope.eventDetails.aims[element.id] = string;
							}
						})
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
						element.relationships.attendees.data.forEach(data => {
							if ($scope.eventDetails.attendees[element.id] === undefined) {
								$scope.eventDetails.attendees[element.id] = personIdToName[data.id];
							} else {
								var string = $scope.eventDetails.attendees[element.id];
								string = string + ", " + personIdToName[data.id];
								$scope.eventDetails.attendees[element.id] = string;
							};
						});
					}//end

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

					//mapping eventID to list and number of RSVPs
					$scope.eventDetails.rsvpCount[element.id] = element.relationships.rsvps.data.length;
					if (element.relationships.rsvps.data.length > 0) {
						element.relationships.rsvps.data.forEach(data => {
							if ($scope.eventDetails.rsvps[element.id] == undefined) {
								$scope.eventDetails.rsvps[element.id] = personIdToName[data.id];
							} else {
								var string = $scope.eventDetails.rsvps[element.id];
								string = string + ", " + personIdToName[data.id];
								$scope.eventDetails.rsvps[element.id] = string;
							}
						})
					}//end

					//mapping eventID to alt RSVP urls
					if (element.attributes.alternateRsvpUrls.length > 0) {
						element.attributes.alternateRsvpUrls.forEach(url => {
							if ($scope.eventDetails.altRsvps[element.id] == undefined) {
								$scope.eventDetails.altRsvps[element.id] = "<a href=" + url + "</a>" + url;
							} else {
								var string = $scope.eventDetails.altRsvps[element.id];
								string = string + ", " + "<a href=" + url + "</a>" + url;
								$scope.eventDetails.altRsvps[element.id] = string;
							}
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
						Restangular.one("events/" + element.id + "?include=addedBy")
						.get()
						.then(function(data) {
							if (data.length > 0) {
								for (var i = 0; i < data.length; i ++) {
									if ($scope.eventDetails.addedBy[element.id] == undefined) {
										$scope.eventDetails.addedBy[element.id] = data[i].attributes.name;
									} else {
										var string = $scope.eventDetails.addedBy[element.id];
										string = string + ", " + data[i].attributes.name;
										$scope.eventDetails.addedBy[element.id] = string;
									}
								}
							}
						})
					}

					//mapping eventID to presenters
					if (element.relationships.presenters.data.length > 0 ) {
						Restangular.one("events/" + element.id + "?include=presenters")
						.get()
						.then(function(data) {
							if (data.length > 0) {
								for (var i = 0; i < data.length; i ++) {
									if ($scope.eventDetails.presenters[element.id] == undefined) {
										$scope.eventDetails.presenters[element.id] = data[i].attributes.name;
									} else {
										var string = $scope.eventDetails.presenters[element.id];
										string = string + ", " + data[i].attributes.name;
										$scope.eventDetails.presenters[element.id] = string;
									}
								}
							}
						})
					}
				});//end _.each()
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
});
