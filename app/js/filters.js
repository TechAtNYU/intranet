'use strict';

angular.module('app.filters', []).
filter('interpolate', function(version) {
	return function(text) {
		return String(text).replace(/\%VERSION\%/mg, version);
	};
}).
filter('formatTeamDisplay', function() {
	return function(teamName, isLead) {
		return `${teamName} ${(isLead ? '- Lead' : '')}`;
	};
});
