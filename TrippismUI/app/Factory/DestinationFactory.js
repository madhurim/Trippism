﻿(function () {
    'use strict';
    var serviceId = 'DestinationFactory';
    angular.module('TrippismUIApp').factory(serviceId, ['$http', '$rootScope', DestinationFactory]);

    function DestinationFactory($http, $rootScope) {
        
        // Define the functions and properties to reveal.
        var service = {
            findDestinations: findDestinations,
            fareforecast: fareforecast,
            SeasonalityHistorySearch: SeasonalityHistorySearch,
        };
        return service;

        function serialize(obj) {
            var str = [];
            for (var p in obj)
                if (obj.hasOwnProperty(p)) {
                    var propval = encodeURIComponent(obj[p]);
                    if (propval != "undefined"  && propval != "null" &&  propval != '') 
                        str.push(encodeURIComponent(p) + "=" + propval);
                }
            return str.join("&");
        }
        function findDestinations(data) {
            var testURL = 'Destinations?' + serialize(data);
            debugger;
            var buildURL = 'Destinations?';
            if (data.Origin == undefined) {
                buildURL = buildURL + 'Origin=' + data.Origin;
                data.Origin = "";
            }
                    

            if (data.DepartureDate == undefined) {
                buildURL = buildURL + '&departuredate=' + data.DepartureDate;
                data.DepartureDate = "";
            }  
            if (data.ReturnDate == undefined) {
                buildURL = buildURL + '&ReturnDate=' + data.ReturnDate;
                data.ReturnDate = "";
            }
            if (data.Lengthofstay == undefined) {data.Lengthofstay = "";}
            if (data.Earliestdeparturedate == undefined) {data.Earliestdeparturedate = "";}
            if (data.Latestdeparturedate == undefined) {data.Latestdeparturedate = "";}
            if (data.Theme == undefined) {data.Theme = "";}
            if (data.Location == undefined) { data.Location = ""; }
            if (data.Minfare == undefined) { data.Minfare = ""; }
            if (data.Maxfare == undefined) { data.Maxfare = ""; }
            if (data.PointOfSaleCountry == undefined) { data.PointOfSaleCountry = ""; }
            if (data.Region == undefined) { data.Region = ""; }
            if (data.TopDestinations == undefined) { data.TopDestinations = ""; }

            var url = $rootScope.apiURL + 'Destinations?' +
                 'Origin=' + data.Origin +
                 '&departuredate=' + data.DepartureDate +
                 '&ReturnDate=' + data.ReturnDate +
                 '&Lengthofstay=' + data.Lengthofstay +
                 '&Latestdeparturedate=' + data.Latestdeparturedate +
                 '&Theme=' + data.Theme +
                 '&Location=' + data.Location +
                 '&Minfare=' + data.Minfare +
                 '&Maxfare=' + data.Maxfare +
                 '&Region=' + data.Region +
                 '&TopDestinations=' + data.TopDestinations +
                 '&Earliestdeparturedate=' + data.Earliestdeparturedate;
                
                var RequestedURL = $rootScope.apiURL + testURL;
                return $http.get(RequestedURL)
                .then(function (data) {
                    return data.data;
                }, function (e) {
                    return e;
                });
        }
        function SeasonalityHistorySearch(searchdata) {
            

            var url = $rootScope.apiURL + 'Seasonality?' +
             'Destination=' + searchdata.Destination;
            return $http.get(url)
                .then(function (data) {
                    return data.data;
                }, function (e) {
                    return e;
                });
        }

        function fareforecast(data) {
            //var url = $rootScope.apiURL + '/api/FareForecast/Get?Origin=' + data.Origin + '&EarliestDepartureDate='
            // + data.EarliestDepartureDate + '&LatestDepartureDate=' + data.LatestDepartureDate + '&Destination=' + data.Destination + '&lengthofstay=' + data.LengthOfStay ;
            var url = $rootScope.apiURL + 'FareForecast/Get?Origin=' + data.Origin + '&DepartureDate='
             + data.EarliestDepartureDate + '&ReturnDate=' + data.LatestDepartureDate + '&Destination=' + data.Destination ;
            return $http.get(url)
                .then(function (data) {
                    return data.data;
                }, function (e) {
                    return e;
                });
        }
    }
})();