﻿angular.module('TrippismUIApp').directive('farerangeInfo', ['$compile', '$timeout', '$filter', '$rootScope', 'FareRangeFactory',
    function ($compile, $timeout, $filter, $rootScope, FareRangeFactory) {
    return {
        restrict: 'E',
        scope: {
            farerangeParams: '=', isOpen: '=', 
           // mailfarerangeData: '=',
            showChart: '='
        },
        templateUrl: '/app/Views/Partials/FareRangePartial.html',
        link: function (scope, elem, attrs) {
            scope.formats = Dateformat();
            scope.format = scope.formats[5];
            scope.$watchGroup(['farerangeParams', 'isOpen','showChart'], function (newValue, oldValue, scope) {

                //Add Scope For Chart

                if (scope.farerangeParams != undefined) {
                    scope.DepartDate = $filter('date')(scope.farerangeParams.Fareforecastdata.DepartureDate, scope.format, null);
                    scope.ReturnDate = $filter('date')(scope.farerangeParams.Fareforecastdata.ReturnDate, scope.format, null);
                    scope.chartHeight = 400;
                    scope.TabIndex = "farerange" + scope.farerangeParams.tabIndex;
                    var mapHTML = "";
                    if (scope.farerangeParams.tabIndex == 999)
                        mapHTML = "<div id='" + scope.TabIndex + "' class='farerangeinmaindiv' ></div>";
                    else
                        mapHTML = "<div id='" + scope.TabIndex + "'></div>";
                    elem.append($compile(mapHTML)(scope));
                    if (scope.farerangeParams.tabIndex == 999)
                        document.getElementById(scope.TabIndex).innerHTML = ""; 
                }


                if (scope.isOpen == true) {
                  //  if (newValue != oldValue || (newValue == null && newValue == null))
                        scope.loadfareRangeInfo();
                } else {
                    scope.fareRangeData = "";
                    scope.mailfarerangeData = "";
                }
            });
            scope.loadingFareRange = true;
            scope.$parent.divFareRange = false;
            scope.$watch('fareRangeInfoLoaded',
              function (newValue) {
                  scope.loadingFareRange = angular.copy(!newValue);
                  scope.$parent.divFareRange = newValue;
              }
            );

            // scope.$watch('farerangeParams',
            //  function (newValue, oldValue) {
            //      if (newValue != oldValue)
            //          scope.loadfareRangeInfo();
            //  }
            //);

            scope.loadfareRangeInfo = function () {
                scope.fareRangeInfoLoaded = false;
                scope.fareRangeInfoNoDataFound = false;
                scope.fareRangeData = "";
                scope.mailfarerangeData = "";
                if (scope.farerangeParams != undefined) {
                    var data = {
                        "Origin": scope.farerangeParams.Fareforecastdata.Origin,
                        "Destination": scope.farerangeParams.Fareforecastdata.Destination,
                        "EarliestDepartureDate": scope.farerangeParams.Fareforecastdata.DepartureDate,
                        "LatestDepartureDate": scope.farerangeParams.Fareforecastdata.ReturnDate,
                        "Lengthofstay": 4
                    };
                    if (scope.fareRangeInfoLoaded == false) {
                        if (scope.fareRangeData == "") {
                            scope.farerangepromise = FareRangeFactory.fareRange(data).then(function (data) {
                                scope.FareRangeLoading = false;
                                if (data.status == 404) {
                                    
                                    scope.fareRangeInfoNoDataFound = true;
                                    $rootScope.$broadcast('divFareRangeEvent', false, scope.Seasonalityresult);
                                    return;
                                }
                                scope.fareRangeData = data;
                                scope.mailfarerangeData = data;
                                scope.fareRangeInfoLoaded = true;
                                $rootScope.$broadcast('divFareRangeEvent', true, scope.Seasonalityresult);
                            });
                        }
                    }
                    //scope.fareRangeInfoLoaded = true;
                }
            };

            scope.$watch('fareRangeData', function (newValue, oldValue) {
                if (newValue != oldValue) {
                    if (scope.showChart == true) {
                        DisplayChart();
                    }
                }
            })

            scope.Chart = [];
            function DisplayChart() {
                var chartData1 = [];
                var chartData2 = [];
                var chartData3 = [];
                var startdate;
                if (scope.fareRangeData != undefined && scope.fareRangeData != "") {
                    for (i = 0; i < scope.fareRangeData.FareData.length; i++) {
                        var DepartureDate = new Date(scope.fareRangeData.FareData[i].DepartureDateTime);
                        if (i == 0)
                        { startdate = Date.UTC(DepartureDate.getFullYear(), DepartureDate.getMonth(), DepartureDate.getDate()); }
                       
                        var utcdate = Date.UTC(DepartureDate.getFullYear(), DepartureDate.getMonth(), DepartureDate.getDate());
                        var serise1 = {
                            x: utcdate,
                            y: scope.fareRangeData.FareData[i].MaximumFare,
                            z: scope.fareRangeData.FareData[i].MaximumFare
                        };
                        var serise2 = {
                            x: utcdate,
                            y: scope.fareRangeData.FareData[i].MinimumFare,
                            z: scope.fareRangeData.FareData[i].MinimumFare
                        };
                        var serise3 = {
                            x: utcdate,
                            y: scope.fareRangeData.FareData[i].MedianFare,
                            z: scope.fareRangeData.FareData[i].MedianFare
                        };
                        chartData1.push(serise1);
                        chartData2.push(serise2);
                        chartData3.push(serise3);
                    }
                    //   }

                   
                    var options = {
                        chart: {
                            height: scope.chartHeight,
                            type: 'line',
                            renderTo: scope.TabIndex,
                        },
                        title: {
                            text: ''
                        },
                        xAxis: {
                            type: 'datetime',
                            labels:{ rotation : -45
                            },
                            dateTimeLabelFormats: {
                                day: '%Y-%m-%e',
                                month: '%e. %b',
                                year: '%b'
                            },
                            title: {
                                text: scope.farerangeParams.Fareforecastdata.DepartureDate + ' To ' + scope.farerangeParams.Fareforecastdata.ReturnDate
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Fare Rate in $'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}$</b><br/>',
                            formatter: function () {
                                return '<span style="font-size:11px">' + this.series.name + '</span><br><b>' +
                                    Highcharts.dateFormat('%Y-%m-%e', new Date(this.x)) + ',' + this.y + ' $.';
                            }
                        },
                        series: [{
                            name:"Maximum Fare",
                            data: chartData1,
                            pointStart: startdate,
                            color: 'red',
                            pointInterval: 24 * 3600 * 1000 // one day
                        }, {
                            name :"Minimum Fare",
                            data: chartData2,
                            pointStart: startdate,
                            color: 'green',
                            pointInterval: 24 * 3600 * 1000 // one day
                        },
                        {
                            name :"Median Fare",
                            data: chartData3,
                            pointStart: startdate,
                            color: 'yellow',
                            pointInterval: 24 * 3600 * 1000 // one day
                        }]
                    };

                    $timeout(function () {
                        scope.Chart = new Highcharts.Chart(options);
                    }, 0, false);
                }
            }
        }
    }
}]);
