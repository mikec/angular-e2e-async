'use strict';

// add waitForAngularEvent function to the scenario dsl.
angular.scenario.dsl('waitForAngularEvent', function() {

  // waitForAngularEvent will take an event name and a timeout.
  // [eventName] is the name of the angular event to wait for.
  // [timeout] is the amount of time to wait before failing.
  return function(eventName, timeout) {

    // set the message that will be displayed while the test is waiting
    var waitingMessage = 'waiting for ' + eventName + ' event';

    // return a future action that will be resolved when the angular event notifies
    // or waitForAngularEvent times out ... whichever comes first
    return this.addFutureAction(waitingMessage, function(appWindow, $document, done) {

      // set a timeout
      var timeoutObj = setTimeout(function() {
        // if the timeout is exceeded, fail the test
        done(eventName + ' timed out!');
      }, timeout);

      // get the $injector service from the $document object in our angular app.
      // use $injector to invoke a function with $rootScope injected
      $document.injector().invoke(function($rootScope) {

        // create an event handler for the [eventName] event
        $rootScope.$on(eventName, function() {

          // when the event occurs, clear the timeout to
          // make sure that it won't cause the test to fail
          clearTimeout(timeoutObj);

          // successfully resolve the future action
          done(null, true);

        });

      });

    });
  };
});

