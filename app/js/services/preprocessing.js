angular
.module('app.services')
.factory('preProcess', function(Restangular, apiDescriptor) {
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
        positionToString: function(teamMap, element){
            return teamMap[element.relationships.team.data.id];
        }
    };
    
});

//positionToString(teamIdsToNames, position): string

 