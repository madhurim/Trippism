﻿// Generated by Xamasoft JSON Class Generator
// http://www.xamasoft.com/json-class-generator

using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace TraveLayer.CustomTypes.Sabre
{

    class AdvancedCalendar
    {
        public class Day
        {
            public string Date { get; set; }
        }

        public class DayOrDaysRange
        {
            public Day Day { get; set; }
        }

        public class DepartureDates
        {
            public List<DayOrDaysRange> dayOrDaysRange { get; set; }
        }

        public class DestinationLocation
        {
            public string LocationCode { get; set; }
        }

        public class OriginLocation
        {
            public string LocationCode { get; set; }
        }

        public class OriginDestinationInformation
        {
            public DepartureDates DepartureDates { get; set; }
            public DestinationLocation DestinationLocation { get; set; }
            public OriginLocation OriginLocation { get; set; }
            public int RPH { get; set; }
        }

        public class CompanyName
        {
            public string Code { get; set; }
        }

        public class RequestorID
        {
            public CompanyName CompanyName { get; set; }
            public string ID { get; set; }
            public string Type { get; set; }
        }

        public class Source
        {
            public RequestorID RequestorID { get; set; }
        }

        public class POS
        {
            public List<Source> Source { get; set; }
        }

        public class RequestType
        {
            public string Name { get; set; }
        }

        public class IntelliSellTransaction
        {
            public RequestType RequestType { get; set; }
        }

        public class TPAExtensions
        {
            public IntelliSellTransaction IntelliSellTransaction { get; set; }
        }

        public class PassengerTypeQuantity
        {
            public string Code { get; set; }
            public int Quantity { get; set; }
        }

        public class AirTravelerAvail
        {
            public List<PassengerTypeQuantity> PassengerTypeQuantity { get; set; }
        }

        public class TravelerInfoSummary
        {
            public List<AirTravelerAvail> AirTravelerAvail { get; set; }
        }

        public class OTAAirLowFareSearchRQ
        {
            public List<OriginDestinationInformation> OriginDestinationInformation { get; set; }
            public POS POS { get; set; }
            public TPAExtensions TPA_Extensions { get; set; }
            public TravelerInfoSummary TravelerInfoSummary { get; set; }
        }

        public class AdvancedCalendar
        {
            public OTAAirLowFareSearchRQ OTA_AirLowFareSearchRQ { get; set; }
        }
    }

}
