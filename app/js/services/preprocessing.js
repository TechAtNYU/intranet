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
				prettifyDate: function(date) {
					if (date == undefined) { return; };
					var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
					var year = parseInt(date.substring(0, 4));
					var month = parseInt(date.substring(5, 7));
					var day = parseInt(date.substring(8, 10));
					return monthNames[month - 1] + " " + day + ", "+ year;
				}
    };
});
