﻿(function () {
    'use strict';
    var serviceId = 'UtilFactory';
    angular.module('TrippismUIApp').factory(serviceId, ['$http', '$location', '$anchorScroll', '$rootScope', UtilFactory]);

    function UtilFactory($http, $location, $anchorScroll, $rootScope) {

        // Define the functions and properties to reveal.
        var service = {
            ReadAirportJson: ReadAirportJson,
            getIpinfo: getIpinfo,
            MapscrollTo: MapscrollTo,
            ReadStateJson: ReadStateJson,
            ReadAirlinesJson: ReadAirlinesJson
        };
        return service;

        function ReadStateJson() {
            var States = [];
            return $http.get('../app/Constants/State.json').then(function (_states) {
                return _states.data;
            });
        }
        function ReadAirportJson() {
            var AvailableCodes = [];
            return $http.get('../app/Constants/airports.json').then(function (_arrairports) {
                _arrairports = _arrairports.data;
                for (var i = 0; i < _arrairports.length; i++) {

                    if (_arrairports[i].Airports != undefined && _arrairports[i].Airports.length > 1) {
                        var objtopush = _.omit(_arrairports[i], "Airports");
                        objtopush['airport_Code'] = _arrairports[i].airport_CityCode;
                        objtopush['airport_FullName'] = _arrairports[i].airport_CityName + ", All Airports";

                        // For now get defalut first airport lat/long 
                        objtopush['airport_Lat'] = _arrairports[i].Airports[0].airport_Lat;
                        objtopush['airport_Lng'] = _arrairports[i].Airports[0].airport_Lng;//null;

                        objtopush['airport_IsMAC'] = true;
                        AvailableCodes.push(objtopush);
                    }
                    if (_arrairports[i].Airports != undefined) {
                        for (var cntAirport = 0; cntAirport < _arrairports[i].Airports.length ; cntAirport++) {
                            var objtopush = _.omit(_arrairports[i], "Airports");
                            objtopush['airport_Code'] = _arrairports[i].Airports[cntAirport].airport_Code;
                            objtopush['airport_FullName'] = _arrairports[i].Airports[cntAirport].airport_FullName;
                            objtopush['airport_Lat'] = _arrairports[i].Airports[cntAirport].airport_Lat;
                            objtopush['airport_Lng'] = _arrairports[i].Airports[cntAirport].airport_Lng;
                            objtopush['airport_IsMAC'] = false;

                            AvailableCodes.push(objtopush);
                        }
                    }

                }


                return AvailableCodes;
            });
        }

        function getIpinfo(AvailableCodes) {
            var url = "http://ipinfo.io?callback=JSON_CALLBACK";
            return $http.jsonp(url)
            .then(function (data) {
                data = data.data;
                var originairport = _.find(AvailableCodes, function (airport) { return airport.airport_CityName == data.city && airport.airport_CountryCode == data.country });
                if (originairport != null) {
                    return originairport;
                }
            });

        }

        function MapscrollTo(id) {
            var old = $location.hash();
            $location.hash(id);
            $anchorScroll();
            $location.hash(old);
            return;
        }

        function ReadAirlinesJson() {
            return $http.get('../app/Constants/airlines.json').then(function (_airlines) {
                return _airlines.data.response;
            });
        }
    }
})();