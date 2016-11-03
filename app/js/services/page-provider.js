angular.module('app.services')
.provider('pageProvider', function() {

	var templates = {
		'__defaults__': {
			'edit': 'partials/actions/default/default-edit.html',
			'add': 'partials/actions/default/default-add.html',
			'list': 'partials/actions/default/default-list.html'
		},
		'events': {
			'add': 'partials/actions/event/event-add.html'
		},
		'memberships': {
			'add':'partials/actions/membership/membership-add.html',
			'edit':'partials/actions/membership/membership-edit.html',
			'list':'partials/actions/membership/membership-list.html'
		},
		'organizations': {
			'list': 'partials/actions/organization/organization-list.html'
		}
	}

	return {
		$get: function() {
			return {
				getTemplateUrl: function(action, resourceName) {
					var t = templates[resourceName] || templates['__defaults__'];
					t = t[action] || templates['__defaults__'][action];
					if (_.isFunction(t)) {
						return t(action);
					} else {
						return t;
					}
				}
			};
		}
	};

});