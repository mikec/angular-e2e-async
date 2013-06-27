'use strict';

// define our angular app module 'myApp'
// require the 'ngMockE2E' module (part of angular-mocks.js) 
// to help us fake a server response
var app = angular.module('myApp', ['ngMockE2E']);

// use the $httpBackend service to fake a server response
app.run(['$httpBackend', function($httpBackend) {

	// when there's a GET request to http://localhost/dataendpoint/ 
	// respond with {data:"some data from the server"}
	$httpBackend.whenGET('http://localhost/dataendpoint/').respond(function() {
		return [200, {data:'some data from the server'}];
	});

}]);

// create a new controller called 'myCtrl'
// and inject the $rootScope and $http services
app.controller('myCtrl', ['$scope', '$http', function($rootScope, $http) {
	
	// define the getData function, which will serve as
	// the handler for our button click event
	$rootScope.getData = function() {

		// make a GET request to 'http://localhost/dataendpoint/'
		$http.get('http://localhost/dataendpoint/').success(function(response) {

			// when we get a response from the server
			// add the response data to the root scope
			$rootScope.data = response.data;

			// emit an event to notify any listeners that the
			// request was successful.  our e2e test will be waiting for
			// this to happen before checking $rootScope.data
			$rootScope.$emit('$requestComplete');

		});
	}

}]);

// configure the $httpBackend service to delay all responses by 1 second
// so that we can simulate a real server request while testing.
// this technique is from http://endlessindirection.wordpress.com/2013/05/18/angularjs-delay-response-from-httpbackend/ 
app.config(function($provide) {
    $provide.decorator('$httpBackend', function($delegate) {
        var proxy = function(method, url, data, callback, headers) {
            var interceptor = function() {
                var _this = this,
                    _arguments = arguments;
                setTimeout(function() {
                    callback.apply(_this, _arguments);
                }, 1000);
            };
            return $delegate.call(this, method, url, data, interceptor, headers);
        };
        for(var key in $delegate) {
            proxy[key] = $delegate[key];
        }
        return proxy;
    });
});