﻿using System;
using Xunit;
using Moq;
using TrippismApi.Areas.Sabre.Controllers;
using TrippismApi.TraveLayer;
using TraveLayer.CustomTypes.Sabre.Response;
using System.Threading.Tasks;
using System.Web;
using TraveLayer.CustomTypes.Sabre.ViewModels;
using System.Net.Http;
using System.Net;


namespace TrippismTests
{
    
    public class LeadFareCalendarTest
    {
        [Fact]
        public void LeadFareCalendarGet()
        {
           /* var config = new HttpConfiguration();
            config.Routes.MapHttpRoute(name: "Default",
              routeTemplate: "api/{controller}/{action}/{id}",
              defaults: new { id = RouteParameter.Optional }); // <1>

            config.MessageHandlers.Add(new BasicAuthHttpMessageHandler()); // <2>

            var server = new HttpServer(config);

            var client = new HttpClient(server); // <3>

            var task = client.GetAsync("http://test.com/issues"); // <4>
            task.Wait();

            var response = task.Result;

            Assert.AreEqual(HttpStatusCode.Unauthorized, response.StatusCode); // <5>*/
        }
    }
}