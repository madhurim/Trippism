﻿(function () {
    'use strict';
    var serviceId = 'WeatherFactory';
    angular.module('TrippismUIApp').factory(serviceId, ['$http', '$rootScope', WeatherFactory]);

    function WeatherFactory($http, $rootScope) {
        var service = {
            GetData: GetData,
        };
        return service;

        function serialize(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    var propval = encodeURIComponent(obj[p]);
                    if (propval != "undefined" && propval != "null" && propval != '')
                        str.push(encodeURIComponent(p) + "=" + propval);
                }
            return str.join("&");
        }

        function GetData(data) {
            var testURL = '?' + serialize(data);

            var url = $rootScope.apiURLForWeather + testURL;
            return $http.get(url)
                .then(function (data) {
                    return data.data;
                }, function (e) {
                    return e;
                });
        }
    }
})();