'use strict';

// TODO: Determine how this data structure will be conveniently utilized!
//		Maybe something like: rbn.resource('people')('name')
// TODO: Determine a better functional way to define this without having
//		 to so carefully monitor its structure
// TODO: Determine if UNIFORM APPLICATION is actually necessary. We could just VARIABLE APPLICATION
//		 and specify DEFAULTS but not OPTIONS. I am going to do this for now just as I determine
//		 how to build the API around this object structure.

/**
 *	This defines the default behavior as well as the syntax that all custom behaviors must be in.
 *	There are the following allowed top level FUNCTIONALITIES:
 *
 *		display
 *
 *	Each top-level property defines a FUNCTIONALITY supported by the behavior, and is a hash that
 *	contains a set of sub-properties. These sub-properties define APPLICATIONS that the
 *	functionality applies to. An APPLICATION can take three forms:
 *
 *	- UNIFORM APPLICATION: A constant value or function.
 *	- VARIABLE APPLICATION: A hash with two properties: OPTIONS and DEFAULTS. It defines the
 *	  possible scenarios for the APPLICATION, which may have differing behavior.
 *		+ OPTIONS is an array of objects which define a 'when' function, which is predicate that is
 *		  used to determine if this option is applicable to this APPLICATION. Each option predicate
 * 		  in OPTIONS is evaluated in the order the array is defined, and the first to return true
 *		  becomes the definition of the APPLICATION.
 *		+ DEFAULTS is the fallthrough case. It is the definition of the APPLICATION if no predicate
 *		  of any option passes, or if no options are present.
 *	- They can be a hash containing further qualifying APPLICATIONS; a NESTED APPLICATION
 */
var DefaultBehavior = {
	// FUNCTIONALITY
	display: {
		// UNIFORM APPLICATION
		templateUrl: false, // by default we do not use a custom templateUrl for the whole resource
		// NESTED APPLICATION
		fields: { // Custom display definitions for fields
			// VARIABLE APPLICATION
			'String': {
				$options: [
					// We define the possible display methods of this field type.
					// They are evaluated eagerly and in definition order; the first one that
					// returns truthy for when() will be used.
					{
						// When this function is true, use this display
						when: function(field) { return field.validation.allowedHtml; },
						templateUrl: 'partials/inputs/tinymce-input.html'
					},
					{
						when: function(field) { return field.validation.oneOf; },
						templateUrl: 'partials/inputs/enum-input.html'
					},
					{
						when: function(field) {
							var acceptsLongValues = (field.validation.maxlength || 0) > 140;
							var acceptsEmailOrUrl = field.validation.url || field.validation.email;

							// For the rationale behind never giving email and url fields a
							// textarea, see https://github.com/TechAtNYU/intranet/issues/102
							return acceptsLongValues && !acceptsEmailOrUrl;
						},
						templateUrl: 'partials/inputs/textarea-input.html'
					},
				],
				$defaults: {
					templateUrl: 'partials/inputs/default-input.html'
					// toString implementation?
				}
			},
			// VARIABLE APPLICATION
			'Link': {
				$options: [
					{
						when: function(field) { return field.kind.isArray; },
						templateUrl: 'partials/inputs/link-multiple-input.html'
					}
				],
				$defaults: {
					templateUrl: 'partials/inputs/link-input.html'
				}
			},
			'Date': {
				defaults: {
					templateUrl: 'partials/inputs/date-input.html'
				}
			},
			'Boolean': {
				defaults: {
					templateUrl: 'partials/inputs/boolean-input.html'
				}
			},
			'Number': {
				defaults: {
					templateUrl: 'partials/inputs/number-input.html'
				}
			}
		}
	}
};
