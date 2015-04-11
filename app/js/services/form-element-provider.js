angular.module('app.services')
.provider('formElementProvider', function() {
	'use strict';

	var templates = {
		'String': function(field) {
			if(field && field.validation.allowedHtml) {
				return 'partials/inputs/tinymce-input.html';
			} else {
				return 'partials/inputs/default-input.html';
			}
		},
		'Date': 'partials/inputs/date-input.html',
		'Link': 'partials/inputs/link-input.html'
	};

	return {
		$get: function() {
			return {
				getTemplateUrl: function(field) {
					var t = templates[field.kind.name];
					if(_.isFunction(t)) {
						return t(field);
					} else {
						return t || templates['String']();
					}
				}
			};
		}
	};
});