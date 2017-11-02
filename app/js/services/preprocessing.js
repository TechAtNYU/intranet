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