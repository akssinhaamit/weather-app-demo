var app = angular.module('weatherApp', []);
app.controller('weatherCtrl', ['$scope', 'weatherService', function($scope, weatherService) {
    $scope.degree = 'c';
  function fetchWeather(location, degree) {
      if (angular.isUndefined(location) || location == null || location == '') return $scope.info = false;
    weatherService.getWeather(location, degree).then(function(data){
      $scope.place = data;
        $scope.info = true;
        $scope.location = location;
        $scope.degree = degree;
    }); 
  }
  $scope.findWeatherWithF= function(location) {
    $scope.place = '';
      console.log("The incoming location is :" + location);
    fetchWeather(location, 'f');
  };
     $scope.findWeatherWithC= function(location) {
    $scope.place = '';
      console.log("The incoming location is :" + location);
    fetchWeather(location, 'c');
  };
  $scope.findWeather = function(location) {
      if (angular.isUndefined(location) || location == null || location == '') return $scope.info = false;
    // do somethings with newVal
      $scope.place = '';
      console.log("The incoming location is :" + location);
    fetchWeather(location,$scope.degree);
  };
}]);

app.factory('weatherService', ['$http', '$q', function ($http, $q){
  function getWeather (location, degree) {
    var deferred = $q.defer();
    $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+location+'%22)%20and%20u%3D%22'+degree+'%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys')
      .success(function(data){
        deferred.resolve(data.query.results.channel);
      })
      .error(function(err){
        console.log('Error retrieving markets');
        deferred.reject(err);
      });
    return deferred.promise;
  }
  
  return {
    getWeather: getWeather
  };
}]);

app.directive('ngAutocomplete', function($parse) {
    return {

      scope: {
        details: '=',
        ngAutocomplete: '=',
        options: '='
      },

      link: function(scope, element, attrs, model) {

        //options for autocomplete
        var opts

        //convert options provided to opts
        var initOpts = function() {
          opts = {}
          if (scope.options) {
            if (scope.options.types) {
              opts.types = []
              opts.types.push(scope.options.types)
            }
            if (scope.options.bounds) {
              opts.bounds = scope.options.bounds
            }
            if (scope.options.country) {
              opts.componentRestrictions = {
                country: scope.options.country
              }
            }
          }
        }
        initOpts()

        //create new autocomplete
        //reinitializes on every change of the options provided
        var newAutocomplete = function() {
          scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
          google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
            scope.$apply(function() {
//              if (scope.details) {
                scope.details = scope.gPlace.getPlace();
//              }
              scope.ngAutocomplete = element.val();
            });
          })
        }
        newAutocomplete()

        //watch options provided to directive
        scope.watchOptions = function () {
          return scope.options
        };
        scope.$watch(scope.watchOptions, function () {
          initOpts()
          newAutocomplete()
          element[0].value = '';
          scope.ngAutocomplete = element.val();
        }, true);
      }
    };
  });