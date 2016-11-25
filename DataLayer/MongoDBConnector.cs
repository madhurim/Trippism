﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using MongoDB.Driver.Builders;
using DataLayer;
using System.Configuration;
using EmailService;

namespace DataLayer
{
    public class MongoDBConnector : INoSqlConnector<IMongoDatabase>
    {
        private MongoClient _mongoClient;
        MailgunEmail mail = new MailgunEmail();
        public IMongoDatabase connect()
        {
            _mongoClient = new MongoClient(ConfigurationManager.AppSettings["MongoDBServer"]);

            try
            {
                foreach (MongoServerInstance instance in _mongoClient.GetServer().Instances)//_mongoClient.GetServer().Instances)
                {
                    //instance.Ping();
                    // or you can try
                    if (instance.State == MongoServerState.Disconnected)
                    {
                        connectionFailMail("");
                        // send email
                        return null;
                    }
                }
                return _mongoClient.GetDatabase(ConfigurationManager.AppSettings["MongodbName"]);

            }
            catch (MongoConnectionException mex)
            {
                connectionFailMail(mex.ToString());
                return null;
            }
            catch (Exception ex)
            {
                connectionFailMail(ex.ToString());
                return null;
            }
        }

        public void connectionFailMail(string ErrorMessage)
        {
            List<string> listToaddress = new List<string>();
            listToaddress.Add("subham@trivenitechnologies.in");
            mail.SendComplexMessage("noreply@trippism.com", "MongoDB connection failed", listToaddress, "MongoDB is not connected. Please check your MongoDB connection. " + ErrorMessage);
        }
    }
}
