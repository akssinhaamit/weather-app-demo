describe('weather service', function(){
   it('Return should respond with a promise object', function(){
      var service = {};
       angular.mock.module('weatherApp');
       angular.mock.inject(function(weatherService){
           service = weatherService;
       })
       console.log(expect(service.getWeather('London', 'c')));
      expect(service.getWeather('London', 'c')).not.toBeNull();
   });
});