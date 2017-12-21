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
        }
    };
});