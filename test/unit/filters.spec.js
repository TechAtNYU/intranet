'use strict';

describe('filter', function() {
	console.log("Invoked");
	beforeEach(module('app.filters'));

	/* Get rid of this/ update in accordance with filters.js! */
	describe('interpolate filter', function() {
		beforeEach(module(function($provide) {
			$provide.value('version', 'TEST_VER');
		}));

	it('should replace VERSION', inject(function(interpolateFilter) {
			expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
		}));
	});

});