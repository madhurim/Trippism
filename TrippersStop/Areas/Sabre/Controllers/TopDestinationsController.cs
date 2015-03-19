﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using TraveLayer.CustomTypes.Sabre;
using TrippersStop.TraveLayer;
using TrippersStop.Helper;

namespace TrippersStop.Areas.Sabre.Controllers
{
    public class TopDestinationsController : ApiController
    {
        // GET api/lookup
        [HttpGet]
        public HttpResponseMessage Get()
        {
            string url = string.Format("v1/lists/top/destinations");
            return GetResponse(url);
        }
        public HttpResponseMessage GetTopDestinationByTheme(string origin, string theme, string region)
        {
            string url = string.Format("v1/lists/top/destinations?origin={0}&theme={1}&region={2}", origin, theme, region);
            return GetResponse(url);
        }
        public HttpResponseMessage GetTopDestinationByairportCode(string airportCode)
        {
            string url = string.Format("v1/lists/top/destinations?origin={0}", airportCode);
            return GetResponse(url);
        }
        public HttpResponseMessage GetTopDestinationByCountryCode(string countryCode)
        {
            string url = string.Format("v1/lists/top/destinations?origincountry={0}", countryCode);
            return GetResponse(url);
        }

        public HttpResponseMessage GetTopDestinationByDestinationType(string origin ,string destinationType)
        {
            string url = string.Format("v1/lists/top/destinations?origin={0}&destinationtype={1}", origin,destinationType);
            return GetResponse(url);
        }

        public HttpResponseMessage GetTopDestinations(int number)
        {
            string url = string.Format("v1/lists/top/destinations?topdestinations={0}", number);
            return GetResponse(url);
        }
        public HttpResponseMessage GetTopDestinationsByDestinationCountry(string destinationcountry)
        {
            string url = string.Format("v1/lists/top/destinations?destinationcountry={0}", destinationcountry);
            return GetResponse(url);
        }

        public HttpResponseMessage GetTopDestinationsByRegion(string region)
        {
            string url = string.Format("v1/lists/top/destinations?region={0}", region);
            return GetResponse(url);
        }
        private HttpResponseMessage GetResponse(string url)
        {
            string result = APIHelper.GetDataFromSabre(url);
            HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.OK, result);
            return response;
        }
    }
}