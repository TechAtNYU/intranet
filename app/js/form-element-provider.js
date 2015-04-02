angular.module('app.services')
.provider('formElementProvider', function() {
	'use strict';

	var templates = {
		'String': 'partials/inputs/default-input.html',
		'Date': 'partials/inputs/date-input.html',
		'Link': 'partials/inputs/link-input.html'
	};

	return {
		$get: function() {
			return {
				getTemplateUrl: function(kind) {
					return templates[kind] || templates['String'];
				}
			};
		}
	};
});