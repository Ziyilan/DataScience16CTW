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
/* It's technically good practice to use the Angular service wrappers for
	globals like window and document -- they're just called $window and $document.
	The reason: if you're testing your Angular code out-of-browser, it's possible to
	"mock" of those services (create fake ones which behave properly for the tests), while
	it's not possible to "mock" global variables. Doesn't really matter in this context, though --
	they behave the same way in the browser.
 */

app.config(function ($routeProvider, $locationProvider) {
	$routeProvider.when("/", {
		templateUrl : "../views/dozeoff.html",
		controller: "mainController"
	});
	$locationProvider.html5Mode(true);
});

app.controller("mainController", function ($scope, $http) {
	// This controller could use a bit of modularization -- it's doing at least
	// two things (drawing the graphs, driving the view). I'll write a comment in the
	// pull request about one way you could do this :)
	$scope.contentTemplatePath = "";
	$scope.times = {};
	$scope.users = {};
	$scope.twotes = {};
	$scope.answers = {};
	// FOR DEV, prefill answers so it goes quicker
	// $scope.answers = {
	// 	age: 20,
	// 	sex: "1",
	// 	married: "0",
	// 	children: "0",
	// 	employment: "6",
	// 	sleep: 7.2
	// };
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

	var getTwotes = function() {
		$http.get('/api/getTwotes')
			.success(function(twotes) {
				$scope.twotes = twotes;
				console.log('got all twotes')
			})
			.error(handleError);
	}
	getTwotes();

	var startDrawing = function() {
		google.charts.load('current', {packages: ['corechart', 'bar']});
		google.charts.setOnLoadCallback(drawBoth);
	}

	var drawBoth = function() {
		drawBasic();
		// drawPie();
	}

	var drawBasic = function() {
		var data1 = google.visualization.arrayToDataTable([
			['Person', 'Hour', { role: 'style' }],
			['How Much You Sleep', Number($scope.answers.sleep), '#1A8763'],
			['How Much Sleep People in Your Demographics Get', Number($scope.results.demoSleep), '#5C3292'],
			['How Much Sleep The Average Person Gets', 7, '#5C3292'], // why is data hard-coded?
			['How Much Sleep You Should Get', 8, '#5C3292']
		]);
		var data2 = new google.visualization.DataTable();
		data2.addColumn('string', 'Hour of Sleeping');
		data2.addColumn('number', 'Percentage');
		data2.addRows([
		  ['Less than 5', 12.89],
		  ['6 Hours', 21.94],
		  ['7 Hours', 24],
		  ['8 Hours', 28.93],
		  ['9 Hours', 4.79],
		  ['More than 10 Hours', 7.45]
		]);

		var options1 = {
			chartArea: {width: '50%'},
			hAxis: {
				title: 'Sleep Duration',
				minValue: 0
			},
		};
		var options2 = {'title':'How Many Hours Do People Sleep in USA',
		               'width':400,
		               'height':300};

		var chart1 = new google.visualization.BarChart(document.getElementById('bar_chart_div'));
		chart1.draw(data1, options1);
		var chart2 = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
		chart2.draw(data2, options2);
	}

	var drawPie = function() {
	  // Create the data table.
	  var data2 = new google.visualization.DataTable();
	  data2.addColumn('string', 'Hour of Sleeping');
	  data2.addColumn('number', 'Percentage');
	  data2.addRows([
	    ['Less than 5', 12.89],
	    ['6 Hours', 21.94],
	    ['7 Hours', 24],
	    ['8 Hours', 28.93],
	    ['9 Hours', 4.79],
	    ['More than 10 Hours', 7.45] // why is this data hard-coded? could it be sourced from somewhere?
	  ]);
	  // Set chart options
	  var options2 = {'title':'How Many Hours Do People Sleep in USA',
	                 'width':400,
	                 'height':300};
	  // Instantiate and draw our chart, passing in some options.
	  var chart2 = new google.visualization.PieChart(document.getElementById('pie_chart_div'));
	  chart2.draw(data, options);
	}

	var isInt = function(n) {
	   return n % 1 === 0;
	}

	var getPercentile = function(callbackFunc) {
		if (isInt($scope.answers.sleep)) {
			// If this is an int, then add decimal places
			$scope.answers.sleep += ".0";
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

	var getNYTimesSleepDep = function() {
		$http.get('/searchSleepDep')
			.success(function(url) {
				console.log(url)
				$scope.times.url = url.slice(7,-1);
			})
			.error(handleError);
	}
	var getNYTimesOverSleep = function() {
		$http.get('/searchOverSleep')
			.success(function(url) {
				console.log(url)
				$scope.times.url = url.slice(7,-1);
			})
			.error(handleError);
	}

	// Taken from http://stackoverflow.com/questions/24457962/linking-to-external-url-with-different-domain-from-within-an-angularjs-partial
	$scope.linkModelFunc = function (url){
	  console.log('link model function');
	  window.open(url);
	}

	$scope.nextQues = function() {
		// FOR DEV, skip to q6
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
			$scope.contentTemplatePath = "views/results.html"
			getPercentile(function (dataResp) {
				console.log('percentile: '+dataResp);
				$scope.results.percentile = dataResp;
				$scope.results.numPeople = Math.floor((1 - Number(dataResp)/100) * 318000000)
				getDemogrpahics(function (dataResp) {
					console.log('demo sleep: '+dataResp);
					$scope.results.demoSleep = Math.round(dataResp * 100)/100;
					startDrawing();
				});
			});
			if ($scope.answers.sleep > 8) {
				$scope.times.message = "Learn More About Over-Sleeping"
				getNYTimesOverSleep();
			} else {
				$scope.times.message = "Learn More About Sleep Deprivation"
				getNYTimesSleepDep();
			}
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
			$scope.contentTemplatePath = "views/q6.html"
		}
		else if ($scope.contentTemplatePath == "views/twoter.html") {
			$scope.contentTemplatePath = "views/results.html"
		}
		console.log($scope.answers)
	};

	$scope.gotoBoard = function() {
		$scope.contentTemplatePath = "views/twoter.html"
	};

	$scope.newTwote = function(text) {
		$http.post('/newTwote', {twoteText:text})
			.success(function(thisTwote) {
				console.log('got new twote: '+thisTwote.text)
				getTwotes();
			})
			.error(handleError);
	}
});
