angular.module('app.services')
.provider('pageProvider', function() {

	var templates = {
		'__defaults__': {
			'edit': 'partials/actions/default/default-edit.html',
			'add': 'partials/actions/default/default-add.html',
			'list': 'partials/actions/default/default-list.html'
		},
		'events': {
			'add': 'partials/actions/event/event-add.html',
			'list': 'partials/actions/event/event-list.html'
		},
		'memberships': {
			'add':'partials/actions/membership/membership-add.html',
			'edit':'partials/actions/membership/membership-edit.html',
			'list':'partials/actions/membership/membership-list.html'
		},
		'organizations': {
			'list': 'partials/actions/organization/organization-list.html',
			'add': 'partials/actions/event/event-add.html'
		},
		'positions': {
			'list': 'partials/actions/position/position-list.html',
		},
		'people': {
			'add':'partials/actions/person/person-add.html',
			'edit':'partials/actions/person/person-edit.html',
			'list': 'partials/actions/person/person-list.html'
		},
		'jobs': {
			'add':'partials/actions/jobs/jobs-add.html',
			'edit':'partials/actions/jobs/jobs-edit.html',
			'list': 'partials/actions/jobs/jobs-list.html'
		},
		'venues': {
			'add':'partials/actions/venues/venues-add.html',
			'edit':'partials/actions/venues/venues-edit.html',
			'list': 'partials/actions/venues/venues-list.html'
		},
		'expenses': {
			'add':'partials/actions/expenses/expenses-add.html',
			'edit':'partials/actions/expenses/expenses-edit.html',
			'list': 'partials/actions/expenses/expenses-list.html'
		},
		'incomes': {
			'add':'partials/actions/incomes/incomes-add.html',
			'edit':'partials/actions/incomes/incomes-edit.html',
			'list': 'partials/actions/incomes/incomes-list.html'
		},
		'reimbursement-requests': {
			'add':'partials/actions/reimbursements/reimbursements-add.html',
			'edit':'partials/actions/reimbursements/reimbursements-edit.html',
			'list': 'partials/actions/reimbursements/reimbursements-list.html'
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
