﻿angular.module('TrippismUIApp').directive('weatherInfo', ['$compile', 'WeatherFactory', 'UtilFactory', function ($compile, WeatherFactory, UtilFactory) {
    return {
        restrict: 'E',
        scope: {
            weatherParams: '=',
            isOpen: '='
        },
        templateUrl: '/app/Views/Partials/WeatherPartial.html',
        link: function (scope, elem, attrs) {
            // scope.$watch('weatherParams',
            //  function (newValue, oldValue) {
            //      if (newValue != oldValue)
            //          scope.WeatherRangeInfo();
            //  }
            //);

            scope.$watchGroup(['weatherParams', 'isOpen'], function (newValue, oldValue, scope) {
                if (scope.isOpen == true) {
                    if (newValue != oldValue)
                        scope.WeatherRangeInfo();
                }
                else {
                    scope.WeatherData = "";
                }
            });

            UtilFactory.ReadStateJson().then(function (data) {
                scope.StateList = data;
            });

            scope.WeatherRangeInfo = function () {
                scope.WeatherInfoLoaded = false;
                scope.WeatherInfoNoDataFound = false;
                scope.HighTempratureC = "0";
                scope.HighTempratureF = "0";
                scope.LowTempratureC = "0";
                scope.LowTempratureF = "0";
                if (scope.weatherParams != undefined) {
                    var statedata = _.find(scope.StateList, function (state) { return state.CityName == scope.weatherParams.DestinationairportName.airport_CityName });
                    if (statedata == undefined) {
                        scope.WeatherData = "";
                        scope.WeatherInfoNoDataFound = true;
                    }
                    else {
                        scope.WeatherData = "";
                        var data = {
                            "State": statedata.StateName,
                            "City": statedata.CityName,//scope.weatherParams.DestinationairportName.airport_CityName,
                            "DepartDate": scope.weatherParams.Fareforecastdata.DepartureDate,
                            "ReturnDate": scope.weatherParams.Fareforecastdata.ReturnDate
                        };

                        if (scope.WeatherInfoLoaded == false) {
                            if (scope.WeatherData == "") {
                                scope.Weatherpromise = WeatherFactory.GetData(data).then(function (data) {
                                    scope.WeatherInfoLoaded = false;
                                    if (data.status == 404)
                                        scope.WeatherInfoNoDataFound = true;
                                    scope.WeatherData = data;
                                });
                            }
                        }
                    }
                    scope.WeatherInfoLoaded = true;
                }
            };

            scope.$watch('WeatherData', function (newValue, oldValue) {
                if (newValue != oldValue)
                    DisplayChart();
            })

            function DisplayChart() {
                var allData = [];
                if (scope.WeatherData != undefined && scope.WeatherData != "") {
                    scope.HighTempratureC = scope.WeatherData.TempHighAvg.Avg.C;
                    scope.HighTempratureF = scope.WeatherData.TempHighAvg.Avg.F;
                    scope.LowTempratureC = scope.WeatherData.TempLowAvg.Avg.C;
                    scope.LowTempratureF = scope.WeatherData.TempLowAvg.Avg.F;
                    for (i = 0; i < scope.WeatherData.WeatherChances.length; i++) {
                        var datas = {
                            name: scope.WeatherData.WeatherChances[i].Name,
                            y: scope.WeatherData.WeatherChances[i].Percentage
                        };
                        allData.push(datas);
                    }

                    $('#weatherChart').highcharts({
                        chart: {
                            type: 'column',
                            
                        },
                        title: {
                            text: 'Weather fore cast'
                        },
                        xAxis: {
                            type: 'category',
                            title: {
                                text: 'Weather Type'
                            }
                        },
                        yAxis: {
                            title: {
                                text: 'Percentage'
                            }

                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            series: {
                                borderWidth: 0,
                                dataLabels: {
                                    enabled: true,
                                    format: '{point.y:.1f}%'
                                }
                            }
                        },

                        tooltip: {
                            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
                        },

                        series: [{
                            name: "Temprature",
                            colorByPoint: false,
                            data: allData
                        }]
                    });


               
                }
            }
        }
    }
}]);