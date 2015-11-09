angular.module('app.services')
.provider('formElementProvider', function() {
	'use strict';

	var useTextarea = function(field) {
		var acceptsLongValues = (field.validation.maxlength || 0) > 140;
		var acceptsEmailOrUrl = field.validation.url || field.validation.email;

		// For the rationale behind never giving email and url fields a
		// textarea, see https://github.com/TechAtNYU/intranet/issues/102
		return acceptsLongValues && !acceptsEmailOrUrl;
	};

	var templates = {
		'String': function(field) {
			if(field && field.validation.allowedHtml) {
				return 'partials/inputs/tinymce-input.html';
			} else if(field && field.validation.oneOf) {
				return 'partials/inputs/enum-input.html';
			} else if(field && useTextarea(field)) {
				return 'partials/inputs/textarea-input.html';
			} else {
				return 'partials/inputs/default-input.html';
			}
		},
		'Relationship': function(field) {
			if(field.kind['is-array']) {
				return 'partials/inputs/link-multiple-input.html';
			}
			else {
				return 'partials/inputs/link-input.html';
			}
		},
		'Date': 'partials/inputs/date-input.html',
		'Boolean': 'partials/inputs/boolean-input.html',
		'Number': 'partials/inputs/number-input.html'
	};

	return {
		$get: function() {
			return {
				getTemplateUrl: function(field) {
					var t = templates[field.kind['base-type']];
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
