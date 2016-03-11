var app = angular.module('dozeoff', ["ngRoute"]);

var handleError = function(err) {
	console.log("Error: "+ err)
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
	$scope.contentTemplatePath = "views/loginPage.html"
});
