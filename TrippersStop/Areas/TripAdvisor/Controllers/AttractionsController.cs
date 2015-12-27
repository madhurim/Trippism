﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using Trippism.Areas.TripAdvisor.Models;
using TrippismApi.TraveLayer;

namespace Trippism.Areas.TripAdvisor.Controllers
{
    /// <summary>
    /// When specifying a Lat/Long point, returns a list of 10 properties found within a given distance from that point. If there are more than 10 properties within the radius requested, the 10 nearest properties will be returned.   In lieu of lat long, can specify a location ID and the output will return nearest POIs
    /// </summary>
    public class AttractionsController : ApiController
    {
        const string TrippismKey = "Trippism.TripAdvisor.Attractions.";
        readonly ITripAdvisorAPIAsyncCaller _apiCaller;
        readonly ICacheService _cacheService;

        /// <summary>
        /// Set Api caller and Cache service
        /// </summary>
        public AttractionsController(ITripAdvisorAPIAsyncCaller apiCaller, ICacheService cacheService)
        {
            _apiCaller = apiCaller;
            _cacheService = cacheService;
        }
        private string APIPropertiesUrl
        {
            get
            {
                return ConfigurationManager.AppSettings["TripAdvisorPropertiesUrl"];
            }
        }

        private string APIAttractions
        {
            get
            {
                return ConfigurationManager.AppSettings["TripAdvisorAttractionsUrl"];
            }
        }


        /// <summary>
        /// The response provides all available attractions
        /// </summary>
        //[ResponseType(typeof(TripWeather))]
        [Route("api/tripadvisor/properties")]
        [HttpGet]
        public async Task<IHttpActionResult> GetProperties([FromUri]PropertiesRequest propertiesRequest)
        {
            return await Task.Run(() =>
            { return GetTripAdvisorProperties(propertiesRequest); });
        }

        /// <summary>
        /// The response provides top 10 attractions
        /// </summary>
        //[ResponseType(typeof(TripWeather))]
        [Route("api/tripadvisor/attractions")]
        [HttpGet]
        public async Task<IHttpActionResult> GetAttractions([FromUri]AttractionsRequest attractionsRequest)
        {
            return await Task.Run(() =>
            { return GetMapAttractions(attractionsRequest); });
        }

        private IHttpActionResult GetMapAttractions(AttractionsRequest attractionsRequest)
        {
            string urlAPI = GetApiURL(attractionsRequest);
            return Ok("TBD");
        }


        private IHttpActionResult GetTripAdvisorProperties(PropertiesRequest propertiesRequest)
        {
            string urlAPI = GetApiURL(propertiesRequest);
            return Ok("TBD");
        }
        private string GetAttractionsApiURL(AttractionsRequest attractionsRequest)
        {
            StringBuilder apiUrl = new StringBuilder();
            apiUrl.Append(GetApiURL(attractionsRequest));
            if (!string.IsNullOrWhiteSpace(attractionsRequest.SubCategory))
                apiUrl.Append("&subcategory=" + attractionsRequest.SubCategory);
            return apiUrl.ToString();
        }
        private string GetApiURL(PropertiesRequest propertiesRequest)
        {
            string location = string.Join(",", propertiesRequest.Latitude, propertiesRequest.Longitude);
            StringBuilder apiUrl = new StringBuilder(string.Format(APIPropertiesUrl, location));
            apiUrl.Append("?key={0}");
            if (!string.IsNullOrWhiteSpace(propertiesRequest.Locale))
                apiUrl.Append("&lang=" + propertiesRequest.Locale);
            if (!string.IsNullOrWhiteSpace(propertiesRequest.Currency))
                apiUrl.Append("&lang=" + propertiesRequest.Locale);
            if (!string.IsNullOrWhiteSpace(propertiesRequest.LengthUnit))
                apiUrl.Append("&lang=" + propertiesRequest.Locale);
            if (!string.IsNullOrWhiteSpace(propertiesRequest.Distance))
                apiUrl.Append("&lang=" + propertiesRequest.Locale);
            return apiUrl.ToString();
        }
    }
}
