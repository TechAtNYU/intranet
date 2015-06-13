angular
.module('app.services')
.provider('resourceBehavior', function ResourceBehaviorProvider() {
	'use strict';

	var defaultBehavior = {};
	var customBehaviors = [];
	var actualBehaviors = [];

	var calculateActualBehaviors = function(defaultBehavior, customBehaviors) {
		if (customBehaviors) {
			return customBehaviors
				.map(function(customBehavior) {
					return angular.merge(customBehavior, defaultBehavior);
				});
		}

		return [];
	};

	this.setDefaultBehavior = function(defaults) {
		this.defaultBehavior = defaults;
		actualBehaviors = calculateActualBehaviors(this.defaultBehavior, this.customBehaviors);
	};

	this.setCustomBehaviors = function(customs) {
		this.customBehaviors = customs;
		actualBehaviors = calculateActualBehaviors(this.defaultBehavior, this.customBehaviors);
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
