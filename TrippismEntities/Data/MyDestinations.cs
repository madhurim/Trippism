﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrippismEntities
{
    public class MyDestinations : EntityBase
    {
        public Guid CustomerGuid { get; set; }
        public string Destination { get; set; }
        public Boolean LikeStatus { get; set; }
    }
}
