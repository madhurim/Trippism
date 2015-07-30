﻿angular.module('TrippismUIApp').directive('googleattractionInfo',
                                            ['$compile',
                                                '$q',
                                                'GoogleAttractionFactory', '$timeout',
    function ($compile, $q, GoogleAttractionFactory, $timeout) {
        return {
            restrict: 'E',
            scope: { googleattractionParams: '=', isOpen: '=' },
            templateUrl: '/app/Views/Partials/GoogleAttractionPartial.html',
            controller: function ($scope) {
                $scope.RenderMap = RenderMap;
                $scope.googleattractionsMap = undefined;
                $scope.AttractionMarkers = [];
                $scope.bounds = new google.maps.LatLngBounds();
                $scope.MapLoaded = false;
                

                $scope.FittoScreen = function () {
                    
                    google.maps.event.trigger($scope.googleattractionsMap, 'resize');
                    var latlng = new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng);
                    $scope.googleattractionsMap.setCenter(latlng);
                    $scope.googleattractionsMap.fitBounds($scope.bounds);

                };


                //$scope.$on('ViewTab', function (event, args) {
                    
                //    if ($scope.MapLoaded) {
                        
                //        $timeout(function () {
                //            $scope.googleattractionsMap.setCenter(new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng));
                //        }, 1000, false);
                //    }
                //});


                $scope.attractionmapOptions = {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 2,
                    minZoom: 2,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };
                $scope.GoogleAttractionDisplay = function () {
                    $scope.quantity = 20;
                };
                $scope.$watchGroup(['googleattractionParams', 'isOpen'], function (newValue, oldValue, $scope) {
                    $scope.loadgoogleattractionInfo();
                    //if ($scope.googleattractionsMap != undefined) {

                        //$timeout(function () {
                        //    $scope.FittoScreen();
                        //    $scope.googleattractionsMap.panTo(new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng));
                            
                        //}, 1000, false);


                    // }
                    
                    

                });

                $scope.loadgoogleattractionInfo = function () {
                    if (!$scope.MapLoaded) {
                        $scope.googleattractionInfoLoaded = false;
                        $scope.googleattractionInfoNoDataFound = false;
                        $scope.googleattractionData = "";
                        if ($scope.googleattractionParams != undefined) {
                            var data = {
                                "Latitude": $scope.googleattractionParams.DestinationairportName.airport_Lat,//$scope.googleattractionParams.airport_Lat,
                                "Longitude": $scope.googleattractionParams.DestinationairportName.airport_Lng //$scope.googleattractionParams.airport_Lng
                            };
                            if ($scope.googleattractionInfoLoaded == false) {

                                $scope.attractionmapOptions = {
                                    center: new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng),
                                    zoom: 1,
                                    minZoom: 10,
                                    backgroundColor: "#BCCFDE",
                                    mapTypeId: google.maps.MapTypeId.ROADMAP
                                };

                                if ($scope.googleattractionData == "") {
                                    $scope.googleattractionpromise = GoogleAttractionFactory.googleAttraction(data).then(function (data) {
                                        if (data.status == 404) {
                                            $scope.googleattractionInfoNoDataFound = true;
                                            return;
                                        }
                                        RenderMap(data.results);
                                        $scope.MapLoaded = true;
                                        $scope.googleattractionData = data;
                                        $scope.quantity = 5;
                                        $scope.googleattractionInfoLoaded = true;
                                    });
                                }
                            }

                        }
                    }
                };

                function RenderMap(maps) {
                    
                    if (maps != undefined && maps.length > 0) {
                        $scope.InfoWindow;
                        selected = maps;
                        for (var x = 0; x < maps.length; x++) {
                            var icon = new google.maps.MarkerImage(
                                             maps[x].icon,
                                            
    new google.maps.Size(71, 71),
    new google.maps.Point(0, 0),
    new google.maps.Point(17, 34),
    new google.maps.Size(25, 25));
           

                            var latlng1 = new google.maps.LatLng(maps[x].geometry.location.lat, maps[x].geometry.location.lng);
                            var marker = new MarkerWithLabel({
                                position: latlng1,
                                map: $scope.googleattractionsMap,
                                title: '' + maps[x].name + '',
                                labelAnchor: new google.maps.Point(12, 35),
                                labelInBackground: false,
                                animation: google.maps.Animation.DROP,
                                CustomMarkerInfo: maps[x],
                                labelStyle: { opacity: 0.75 },
                                icon: icon,//'app/Styles/images/mapicon.png'

                                //icon: 'https://mts.googleapis.com/vt/icon/name=icons/spotlight/spotlight-waypoint-b.png&text=' + maps[x].name + '&psize=8&font=fonts/Roboto-Regular.ttf&color=ff000033&ax=44&ay=48&scale=1',
                            });

                            $scope.bounds.extend(marker.position);

                            var contentString = '<div style="min-width:100px;padding-top:5px;" id="content">' +
                                             '<div class="col-sm-12 padleft0"><strong>'
                                               + maps[x].name + '</strong></div>' +
                                               '<br /><div class="col-sm-12 padleft0 word-wrap">' + maps[x].vicinity + '</div>' +
                                       '</div> ';

                            $scope.InfoWindow = new google.maps.InfoWindow();

                            google.maps.event.addListener(marker, 'click', (function (marker, contentString, infowindow) {
                                return function () {
                                    if ($scope.InfoWindow) $scope.InfoWindow.close();
                                    $scope.InfoWindow = new google.maps.InfoWindow({ content: contentString, maxWidth: 500 });
                                    $scope.InfoWindow.open($scope.googleattractionsMap, marker);
                                };
                            })(marker, contentString, $scope.InfoWindow));
                            $scope.AttractionMarkers.push(marker);
                        }
                        
                        //$timeout(function () {
                        //  alert('time oput called');
                        
                        google.maps.event.addListenerOnce($scope.googleattractionsMap, 'idle', function () {
                            $scope.FittoScreen();
                        });
                        
                        $timeout(function () {
                            $scope.googleattractionsMap.setCenter(new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng));
                        }, 1000, false);
                        //$scope.googleattractionsMap.panTo(new google.maps.LatLng($scope.googleattractionParams.DestinationairportName.airport_Lat, $scope.googleattractionParams.DestinationairportName.airport_Lng));


                    }
                };
            },
            link: function (scope, elem, attrs) {

            }
        }
    }]);


