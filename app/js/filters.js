'use strict';

angular.module('app.filters', []).
filter('interpolate', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
}).
//Adds lead string to team position
filter('formatTeamDisplay', function() {
	return function(teamName, isLead) {
		return `${teamName} ${(isLead ? '- Lead' : '')}`;
	};
});
