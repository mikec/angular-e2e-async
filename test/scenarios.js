'use strict';

describe('E2E testing of asynchronous processes using angular-scenario', function() {

	describe('click the \'get some data\' button', function() {

		beforeEach(function() {

			// navigate to the root
			browser().navigateTo('/');

			// click the 'get some data' button
			element('#getDataButton').click();

		});

		it('should display the data', function() {

			// wait for the angular event to notify 
			// after a successful response from the server.
			// if the event doesn't notify after 30 seconds
			// then timeout and fail the test.
			// 
			// waitForAngularEvent is a custom function that we added to
			// the angular scenario dsl (see scenario-async-helpers.js)
			waitForAngularEvent('$requestComplete', 30000);

			// verify the contents of <span> element that is
			// supposed to display the data we got from the server
			expect(element('#dataDisplay').html()).toBe('some data from the server');

		});

	});

});