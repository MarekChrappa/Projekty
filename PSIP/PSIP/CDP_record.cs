using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSIP
{
    public class CDP_record
    {

        public string Name;
        public string NP;
        public int Port;

        public bool show = true;

        public int timer = 60;

        public CDP_record(string n, string P, int port)
        {
            Name = n;
            NP = P;
            Port = port;
        }

        public void ChangeTimer(int a)
        {
            timer = a;
        }
    }
}
