using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PSIP
{
    public class MACK_TABLE_RECORD
    {
        public string MAC;
        public int Port;

        public bool show = true;

        public int timer = 60;
        public MACK_TABLE_RECORD(string MC, int P)
        {
            MAC = MC;
            Port = P;
        }

        public void ChangeTimer(int a)
        {
            timer = a;
        }
    }
   
}
