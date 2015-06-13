angular
.module('app.services')
.provider('resourceBehavior', function ResourceBehaviorProvider() {
	'use strict';

	var defaultBehavior = {};
	var customBehaviors = [];
	var actualBehaviors = [];

	var calculateActualBehaviors = function(defaultBehavior, customBehaviors) {
		if (customBehaviors) {
			return customBehaviors.map(function(customBehavior) {
					return angular.merge(customBehavior, defaultBehavior);
				});
		}

		return [];
	};

	this.setDefaultBehavior = function(defaults) {
		defaultBehavior = defaults;
		actualBehaviors = calculateActualBehaviors(defaultBehavior, customBehaviors);
	};

	this.setCustomBehaviors = function(customs) {
		customBehaviors = customs;
		actualBehaviors = calculateActualBehaviors(defaultBehavior, customBehaviors);
	};

	this.$get = function() {
		return {
			resource: function(resourceName) {
				if (actualBehaviors[resourceName]) {
					return actualBehaviors[resourceName];
				} else {
					return defaultBehavior;
				}
			}
		};
	};
});
