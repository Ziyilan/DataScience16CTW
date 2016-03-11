var app = angular.module('dozeoff', ["ngRoute"]);

var handleError = function(err) {
	console.log("Error: "+ err)
}

// Remove the ugly Facebook appended hash
// <https://github.com/jaredhanson/passport-facebook/issues/12>
if (window.location.hash && window.location.hash === "#_=_") {
    if (window.history && history.pushState) {
        window.history.pushState("", document.title, window.location.pathname);
    } else {
    // Prevent scrolling by storing the page's current scroll offset
    var _scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    };
    window.location.hash = "";
    // Restore the scroll offset, should be flicker free
    document.body.scrollTop = _scroll.top;
    document.body.scrollLeft = _scroll.left;
    }
}

app.config(function ($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl : "../views/dozeoff.html",
		controller: "mainController"
	});
	$locationProvider.html5Mode(true);
});

app.controller("mainController", function ($scope, $http) {
	$scope.contentTemplatePath = "";
	$scope.answers = {};
	$scope.results = {};
	
	$http.get('/api/getUser')
		.success(function(user) {
			$scope.user = user;
			console.log(user)
			if (user) {
				$scope.contentTemplatePath = "views/q1.html"
			} else {
				$scope.contentTemplatePath = "views/loginPage.html"
			}
		})
		.error(handleError);

	var isInt = function(n) {
	   return n % 1 === 0;
	}

	var getPercentile = function(callbackFunc) {
		if (isInt($scope.answers.sleep)) {
			// If this is an int, then add decimal places
			$scope.answers.sleep.toFized(1);
		}
		var url = 'https://dozeoff-python-server.herokuapp.com/percentile/' + $scope.answers.sleep;
	    $http({
	        method: 'GET',
	        url: url
	    })
		    .success(function(data){
		        // With the data succesfully returned, call our callback
		        callbackFunc(data);
		    })
		    .error(handleError);
	}

	var getDemogrpahics = function(callbackFunc) {
		var url = 'https://dozeoff-python-server.herokuapp.com/api/'
				  + $scope.answers.age + '/'
				  + $scope.answers.sex + '/'
				  + $scope.answers.married + '/'
				  + $scope.answers.children + '/'
				  + $scope.answers.employment;
	    $http({
	        method: 'GET',
	        url: url
	    })
		    .success(function(data){
		        // With the data succesfully returned, call our callback
		        callbackFunc(data);
		    })
		    .error(handleError);
	}

	$scope.nextQues = function() {
		if ($scope.contentTemplatePath == "views/q1.html") {
			$scope.contentTemplatePath = "views/q2.html"
		}
		else if ($scope.contentTemplatePath == "views/q2.html") {
			$scope.contentTemplatePath = "views/q3.html"
		}
		else if ($scope.contentTemplatePath == "views/q3.html") {
			$scope.contentTemplatePath = "views/q4.html"
		}
		else if ($scope.contentTemplatePath == "views/q4.html") {
			$scope.contentTemplatePath = "views/q5.html"
		}
		else if ($scope.contentTemplatePath == "views/q5.html") {
			$scope.contentTemplatePath = "views/q6.html"
		}
		else if ($scope.contentTemplatePath == "views/q6.html") {
			// Get the results and display them
			// $http.get('https://dozeoff-python-server.herokuapp.com/percentile/7.6')
			// 	.success(function(data) {
			// 		$scope.results = data;
			// 		console.log(data)
			// 		$scope.contentTemplatePath = "views/results.html"
			// 	})
			// 	.error(handleError);
			$scope.contentTemplatePath = "views/results.html"
			getPercentile(function (dataResp) {
				console.log('percentile: '+dataResp);
				$scope.results.percentile = dataResp;
			});
			getDemogrpahics(function (dataResp) {
				console.log('demo sleep: '+dataResp);
				$scope.results.demoSleep = dataResp;
			});
		}
		console.log($scope.answers)
	};
	$scope.prevQues = function() {
		if ($scope.contentTemplatePath == "views/q2.html") {
			$scope.contentTemplatePath = "views/q1.html"
		}
		else if ($scope.contentTemplatePath == "views/q3.html") {
			$scope.contentTemplatePath = "views/q2.html"
		}
		else if ($scope.contentTemplatePath == "views/q4.html") {
			$scope.contentTemplatePath = "views/q3.html"
		}
		else if ($scope.contentTemplatePath == "views/q5.html") {
			$scope.contentTemplatePath = "views/q4.html"
		}
		else if ($scope.contentTemplatePath == "views/q6.html") {
			$scope.contentTemplatePath = "views/q5.html"
		}
		else if ($scope.contentTemplatePath == "views/results.html") {
			$scope.contentTemplatePath = "views/q5.html"
		}
		console.log($scope.answers)
	};
});
