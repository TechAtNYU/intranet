angular
.module('app.services')
.factory('preProcess', function(Restangular, apiDescriptor) {
	'use strict';
    return{
        position: function() {
            var teamsIdToName = {};
            Restangular.all('teams')
                .getList()
                .then(function(teams) {
                    _.each(teams, function(element) {
                        teamsIdToName[element.id] = element.attributes.name;
                    });
                });
            return teamsIdToName;
        }
    };
    
});

 