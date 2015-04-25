angular.module('app.services')
.provider('formElementProvider', function() {
	'use strict';

	var templates = {
		'String': function(field) {
			if(field && field.validation.allowedHtml) {
				return 'partials/inputs/tinymce-input.html';
			} else if(field && field.validation.oneOf) {
				return 'partials/inputs/enum-input.html';
			} else if(field && field.validation.maxlength && field.validation.maxlength > 140) {
				return 'partials/inputs/textarea-input.html';
			} else {
				return 'partials/inputs/default-input.html';
			}
		},
		'Link': function(field) {
			if(field.kind.isArray) {
				return 'partials/inputs/link-multiple-input.html';
			}
			else {
				return 'partials/inputs/link-input.html';
			}
		},
		'Date': 'partials/inputs/date-input.html',
		'Boolean': 'partials/inputs/boolean-input.html'
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
