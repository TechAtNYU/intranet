angular.module('app.services')
.provider('formElementProvider', function() {
	'use strict';

	var templates = {
		'String': 'partials/fields/default-input.html',
		'Date': 'partials/fields/date-input.html',
		'Link': 'partials/fields/link-input.html'
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