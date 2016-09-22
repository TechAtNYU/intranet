angular.module('app.services')
.provider('pageProvider', function() {

	var templates = {
		'Default': {
			'edit': 'partials/actions/default-edit.html',
			'add': 'partials/actions/default-add.html',
			'list': 'partials/actions/default-list.html'
		}
	}

	return {
		$get: function() {
			return {
				getTemplateUrl: function(action, resourceName) {
					var t = templates[resourceName] || templates['Default'];
					t = t[action];
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