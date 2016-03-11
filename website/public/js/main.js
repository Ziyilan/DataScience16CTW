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
	// $scope.contentTemplatePath = "views/loginPage.html"
	
	$http.get('/api/getUser')
		.success(function(user) {
			$scope.user = user;
			console.log(user)
			if (user) {
				$scope.contentTemplatePath = "views/question.html"
			} else {
				$scope.contentTemplatePath = "views/loginPage.html"
			}
		})
		.error(handleError);
});
