angular
.module('app.services')
.factory('preProcess', function(Restangular, formatTeamDisplayFilter) {
	'use strict';
    return{
        teamIdtoNames: function() {
            var teamsIdToName = {};
            Restangular.all('teams')
                .getList()
                .then(function(teams) {
                    _.each(teams, function(element) {
                        teamsIdToName[element.id] = element.attributes.name;
                    });
                });
            return teamsIdToName;
        },
        venueIdToNames: function() {
            var venuesIdToName = {};
            Restangular.all('venues')
                .getList()
                .then(function(teams) {
                    _.each(teams, function(element) {
                        venuesIdToName[element.id] = element.attributes.name;
                    });
                });
            return venuesIdToName;
        },
        positionToString: function(teamMap, element, includeLead){
            if(includeLead){
                return formatTeamDisplayFilter(teamMap[element.relationships.team.data.id], element.attributes.isLead);
            }
            else{
                return formatTeamDisplayFilter(teamMap[element.relationships.team.data.id], false);
            }
        }
    };
});