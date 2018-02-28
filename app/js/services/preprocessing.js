angular
.module('app.services')
.factory('preProcess', function($filter, Restangular, formatTeamDisplayFilter) {
	'use strict';
    return{
        displayDate: function(filter) {
                return function(date){
                    return filter('date')(date, 'MMMM yyyy');
                }
        },
        objectIdtoName: function(name){
            var objectIdToName = {};
            Restangular.all(name)
                .getList()
                .then(function(objectName) {
                    _.each(objectName, function(element) {
                        objectIdToName[element.id] = element.attributes.name;
                    });
                });
            return objectIdToName;
        },
        positionToString: function(teamMap, element, includeLead){
            if(includeLead){
                return formatTeamDisplayFilter(teamMap[element.relationships.team.data.id], element.attributes.isLead);
            }
            else{
                return formatTeamDisplayFilter(teamMap[element.relationships.team.data.id], false);
            }
        },
        loadCurrentEBoard: function(){
            Restangular.all('teams')
            .getList()
            .then(function(data) {
                const memberDetails = [];
                //mapping memberID to name, position and display information
                _.each(data, function(element) {
                    Restangular.one("people/" + element.relationships.member.data.id)
                    .get()
                    .then(function(person) {
                        Restangular.one("positions/" + element.relationships.position.data.id)
                        .get()
                        .then(function(position) {
                            memberDetails.push({
                                'id': element.id,
                                'display': person.attributes.name + " | " + preProcess.positionToString(teamsIdToName, position, true),
                                'name': person.attributes.name,
                    'team': preProcess.positionToString(teamsIdToName, position, false),
                                'position': preProcess.positionToString(teamsIdToName, position, true),
                                'isActive': element.attributes.isActive,
                    'isLead': position.attributes.isLead,
                                'startDate': element.attributes.startDate,
                                'endDate': element.attributes.endDate
                            });
                        });
                    });
                });
            });
        }
    };
});