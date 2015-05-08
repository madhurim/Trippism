﻿
(function () {
    'use strict';
    var controllerId = 'DestinationController';
    angular.module('TrippismUIApp').controller(controllerId,
        ['$scope', '$rootScope', '$modal', '$http', 'DestinationFactory', DestinationController]);

    function DestinationController($scope, $rootScope, $modal, $http, DestinationFactory) {


        $scope.hasError = false;
        $scope.Location = "";
        $scope.lat = "0";
        $scope.lng = "0";
        $scope.accuracy = "0";

        $scope.model = { destinationMap: undefined };
        $scope.myMarkers = [];

        $scope.mapOptions = {
            center: new google.maps.LatLng($scope.lat, $scope.lng),
            zoom: 3,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

    
        $http.get('../app/Constants/airports.json').success(function (_arrairports) {
            
            $scope.Listairports = _arrairports;
            //var originairport = _.find(_arrairports, function (airport) { return airport.iso == data.country && airport.status == 1 && airport.size == "medium"; });

        });

        $scope.showPosition = function (position, destinations) {

            var latlng = new google.maps.LatLng($scope.lat, $scope.lng);
            $scope.model.destinationMap.setCenter(latlng);

            for (var x = 0; x < destinations.length; x++) {
                var dest = destinations[x];
                // By Using Google API for getting Airport may not be accurate
                $http({ method: 'GET', url: 'http://maps.googleapis.com/maps/api/geocode/json?address=' + destinations[x] + ' airport&sensor=false' }).
                    success(function (data, status) {

                        if (data.results[0] != undefined) {
                            if (_.contains(data.results[0].types, "airport")) {
                                var p = data.results[0].geometry.location;
                                console.log(p);
                                var latlng = new google.maps.LatLng(p.lat, p.lng);
                                var contentString = '<div id="content">' + data.results[0].address_components[0].short_name + '</div>';
                                var infowindow = new google.maps.InfoWindow({
                                    content: contentString,
                                    maxWidth: 200
                                });
                                var marker = new google.maps.Marker({
                                    position: latlng,
                                    map: $scope.model.destinationMap,
                                    title: data.results[0].address_components[0].short_name,
                                    animation: google.maps.Animation.DROP,
                                });
                                google.maps.event.addListener(marker, 'click', function () {
                                    infowindow.open($scope.model.destinationMap, marker);
                                });
                                $scope.myMarkers.push(new google.maps.Marker(marker));
                            }
                        }
                    });
            }
        }

        function ConvertToRequiredDate(dt) {
            dt = new Date(dt);
            var curr_date = ('0' + dt.getDate()).slice(-2);
            var curr_month = ('0' + (dt.getMonth() + 1)).slice(-2);
            var curr_year = dt.getFullYear();
            var _date = curr_year + "-" + curr_month + "-" + curr_date;
            return _date;
        }

        $scope.formats = ['yyyy-MM-dd', 'dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        var dt = new Date();
        dt.setHours(0, 0, 0, 0)
        var Todt = new Date();
        Todt.setDate(Todt.getDate() + 5); // add default from 5 days
        Todt.setHours(0, 0, 0, 0)

        $scope.ToDate = ConvertToRequiredDate(Todt);
        $scope.FromDate = ConvertToRequiredDate(dt);

        $scope.minTodayDate = new Date();
        $scope.minFromDate = new Date();
        $scope.minFromDate = $scope.minFromDate.setDate($scope.minFromDate.getDate() + 1);


        function daydiff(first, second) {
            return Math.round((second - first) / (1000 * 60 * 60 * 24));
        }

        $scope.datedifff = daydiff(dt, Todt);

        $scope.ToDate = ConvertToRequiredDate(Todt);
        $scope.FromDate = ConvertToRequiredDate(dt);

        $scope.$watch(function (scope) { return scope.FromDate },
              function (newValue, oldValue) {

                  /* If from date is greater than to date */
                  var newDt = new Date(newValue);
                  newDt.setHours(0, 0, 0, 0);
                  var todate = new Date($scope.ToDate);
                  todate.setHours(0, 0, 0, 0);

                  if (newDt >= todate) {
                      $scope.ToDate = ConvertToRequiredDate(newDt.setDate(newDt.getDate() + 1))
                  }
                  /**/

                  //SET MINIMUN SELECTED DATE for TODATE
                  $scope.minFromDate = new Date(newValue);
                  $scope.minFromDate = $scope.minFromDate.setDate($scope.minFromDate.getDate() + 1);

                  // Calculate datediff
                  $scope.datedifff = daydiff(new Date(newValue).setHours(0, 0, 0, 0), new Date($scope.ToDate).setHours(0, 0, 0, 0));

              }
       );
        $scope.$watch(function (scope) { return scope.ToDate },
              function (newValue, oldValue) {
                  $scope.datedifff = daydiff(new Date($scope.FromDate).setHours(0, 0, 0, 0), new Date(newValue).setHours(0, 0, 0, 0));
              }
       );

        $scope.Origin = '';
        $scope.Destination = '';
        $scope.AvailableThemes =
                [
                    { id: "BEACH", value: "BEACH" },
                    { id: "CARIBBEAN", value: "CARIBBEAN" },
                    { id: "DISNEY", value: "DISNEY" },
                    { id: "GAMBLING", value: "GAMBLING" },
                    { id: "HISTORIC", value: "HISTORIC" },
                    { id: "MOUNTAINS", value: "MOUNTAINS" },
                    { id: "NATIONAL-PARKS", value: "NATIONAL-PARKS" },
                    { id: "OUTDOORS", value: "OUTDOORS" },
                    { id: "ROMANTIC", value: "ROMANTIC" },
                    { id: "SHOPPING", value: "SHOPPING" },
                    { id: "SKIING", value: "SKIING" },
                    { id: "THEME-PARK", value: "THEME-PARK" }
                ];
        $scope.AvailableRegions = [
                {id : 'Africa', value :'Africa'},
                {id : 'Asia Pacific', value :'Asia Pacific'},
                {id : 'Europe', value :'Europe'},
                {id : 'Latin America', value :'Latin America'},
                {id : 'Middle East', value :'Middle East'},
                { id: 'North America', value: 'North America' },
        ];
        

        function getIpinfo() {
            var url = "http://ipinfo.io?callback=JSON_CALLBACK";
            $http.jsonp(url)
           .success(function (data) {

               $http.get('../app/Constants/airports.json').success(function (_arrairports) {
                   var originairport = _.find(_arrairports, function (airport) { return airport.iso == data.country && airport.status == 1 && airport.size == "medium"; });
                   $scope.Origin = originairport.iata;
                   $scope.CalledOnPageLoad = true;
                   $scope.findDestinations('Top10');
               });
           });
        }
        getIpinfo();


        $scope.faresList = [];
        $scope.forecastfareList = [];
        $rootScope.apiURL = 'http://localhost:14606';

        $scope.findDestinations = findDestinations;
        $scope.fareforecast = fareforecast;

        function fareforecast(rate) {
            rate.Origin = $scope.Origin;
            var datatopost = {
                Origin: rate.Origin,
                EarliestDepartureDate: ConvertToRequiredDate(rate.DepartureDateTime),
                LatestDepartureDate: ConvertToRequiredDate(rate.ReturnDateTime),
                Destination: rate.DestinationLocation,
                LengthOfStay: "4"
            };
            DestinationFactory.fareforecast(datatopost).then(function (data) {
                $scope.forecastfareList = angular.copy(data.FareData);
                var modalInstance = $modal.open({
                    templateUrl: 'myModalContent.html',
                    controller: 'ModalInstanceCtrl',
                    resolve: {
                        items: function () { return $scope.forecastfareList; },
                        Origin: function () { return $scope.Origin; },
                        Destination: function () { return datatopost.Destination; }
                    }
                });
                modalInstance.result.then(function (selectedItem) {
                    $scope.selected = selectedItem;
                });
            });
        }

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.openFromDate = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.openedFromDate = true;
        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.LoadingText = "Loading..";
        $scope.SearchbuttonText = "Get Destinations (All)";
        $scope.SearchbuttonTo10Text = "Top 10";
        $scope.SearchbuttonCheapestText = "Top 10 Cheapest";
        $scope.SearchbuttonIsLoading = false;
        $scope.SearchbuttonTop10IsLoading = false;
        $scope.SearchbuttonChepestIsLoading = false;

        function findDestinations(buttnText) {

             if ($scope.CalledOnPageLoad != true) {
            if ($scope.frmdestfinder.$invalid) {
                $scope.hasError = true;
                return;
            }
             }

            $scope.faresList = [];
            if (buttnText == 'All') { $scope.SearchbuttonIsLoading = true; $scope.SearchbuttonText = $scope.LoadingText; }
            else if (buttnText == 'Top10') { $scope.SearchbuttonTop10IsLoading = true; $scope.SearchbuttonTo10Text = $scope.LoadingText; }
            else if (buttnText == 'Cheapest') { $scope.SearchbuttonChepestIsLoading = true; $scope.SearchbuttonCheapestText = $scope.LoadingText; }
            var data = {
                "Origin": $scope.Origin,
                "DepartureDate": ConvertToRequiredDate($scope.FromDate),
                "ReturnDate": ConvertToRequiredDate($scope.ToDate),
                "Lengthofstay": $scope.datedifff,
                "Earliestdeparturedate": ConvertToRequiredDate($scope.FromDate),
                "Latestdeparturedate": ConvertToRequiredDate($scope.ToDate),
                "Theme": ($scope.Theme != undefined ) ? $scope.Theme.id  : "",
                "Location": $scope.Location,
                "Minfare": $scope.Minfare,
                "Maxfare": $scope.Maxfare,
                "PointOfSaleCountry": $scope.PointOfSaleCountry,
                "Region": ($scope.Region != undefined ) ? $scope.Region.id  : "",
                "TopDestinations": $scope.TopDestinations,
                "Destination": $scope.Destination

            };
            DestinationFactory.findDestinations(data).then(function (data) {
                $scope.SearchbuttonText = "Get Destinations (All)";
                $scope.SearchbuttonTo10Text = "Top 10";
                $scope.SearchbuttonCheapestText = "Top 10 Cheapest";
                $scope.SearchbuttonIsLoading = false;
                $scope.SearchbuttonTop10IsLoading = false;
                $scope.SearchbuttonChepestIsLoading = false;

                if (data != null) {
                    displayDestinations(buttnText, data.FareInfo);
                    

                    //var result = JSON.parse(data);
                    //var objects = JSON.parse(result.Response);
                    //if (objects.FareInfo != undefined) {
                    //    console.log(objects);
                    //    displayDestinations(buttnText, objects.FareInfo);
                    //    console.log(objects.FareInfo);
                    //}
                }
            });
            if ($scope.CalledOnPageLoad)
                $scope.CalledOnPageLoad = false;


        }
        var GetUniqueDestinations = function (destinations) {
            return _.pluck(destinations, "DestinationLocation");
        }

        function DrawMaps(pdestinations) {
            var destinations = GetUniqueDestinations(pdestinations);
            $scope.showPosition('', destinations);
        }

        function displayDestinations(buttnText, destinations) {
            if (buttnText == 'All') {
                $scope.faresList = angular.copy(destinations);
                DrawMaps(_.uniq($scope.faresList, function (destination) { return destination.DestinationLocation; }))
            }

            else if (buttnText == 'Top10') {
                if (destinations.length > 0) {
                    for (var i = 0; i < 10; i++)
                        if (destinations[i] != undefined) { $scope.faresList.push(destinations[i]); }
                }
                DrawMaps(_.uniq($scope.faresList, function (destination) { return destination.DestinationLocation; }))
            }
            else if (buttnText == 'Cheapest') {
                if (destinations.length > 0) {
                    var sortedObjs = _.filter(destinations, function (item) {
                        return item.LowestFare !== 'N/A';
                    });
                    sortedObjs = _(sortedObjs).sortBy(function (obj) { return parseInt(obj.LowestFare, 10) })
                    for (var i = 0; i < 10; i++)
                        if (sortedObjs[i] != undefined)
                            $scope.faresList.push(sortedObjs[i]);
                }
                DrawMaps(_.uniq($scope.faresList, function (destination) { return destination.DestinationLocation; }))
            }
        }
    }

    angular.module('TrippismUIApp').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items, Origin, Destination) {
        $scope.forecastfareList = items;
        $scope.Origin = Origin;
        $scope.Destination = Destination;
        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });



})();