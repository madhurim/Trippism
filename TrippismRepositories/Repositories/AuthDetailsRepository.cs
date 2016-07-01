﻿using TrippismEntities;
using DataLayer;
using System;

namespace TrippismRepositories
{

    public class AuthDetailsRepository : IAuthDetailsRepository
    {
        //private IDBContext<AuthDetails> _iDBContext;
        private IDBContext _iDBContext;
        public AuthDetailsRepository(IDBContext iDBContext)
        {
            this._iDBContext = iDBContext;
        }


        public AuthDetails UpdateCustomer(AuthDetails authDetails)
        {
            var authInfo = _iDBContext.FindOne<AuthDetails>(a => a.Id == authDetails.Id);
            if (authInfo == null)
            {
                return null;
            }
            _iDBContext.Update<AuthDetails>(null, authInfo);
            return authInfo;
        }

        public AuthDetails AddCustomer(AuthDetails authDetails)
        {
            if (authDetails == null)
                return null;
            _iDBContext.Add<AuthDetails>(authDetails);
            return authDetails;
        }

        public AuthDetails FindCustomer(string userName)
        {
            var authDetails = _iDBContext.FindOne<AuthDetails>(x => x.UserName == userName);
            return authDetails;
        }


        public AuthDetails FindCustomer(Guid authId)
        {
            var authInfo = _iDBContext.FindOne<AuthDetails>(a => a.Id == authId);
            return authInfo;
        }
    }
}