using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PacketDotNet;
using SharpPcap;
using SharpPcap.WinPcap;
using SharpPcap.LibPcap;

namespace PSIP
{
    public class MAC_TABLE
    {
        public bool See_Mac_table(EthernetPacket ethernetPacket, int port, List<MACK_TABLE_RECORD> mac_table_records)
        {
            var a = ethernetPacket.DestinationHwAddress.ToString();

            foreach (var mac in mac_table_records)
            {
                if (mac.Port == port && mac.MAC == a)
                {
                    //Console.WriteLine("som tu");
                    return false;
                }
                    
                
            }

            return true;
        }
    }
}
