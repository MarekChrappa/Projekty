using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using PacketDotNet;
using SharpPcap;
using SharpPcap.WinPcap;

namespace PSIP
{
    public class Filter_Record
    {
        public string permit_deny;
        public string protocol;
        public string direction;

        public string MAC_destination;
        public string MAC_source;

        public string IP_destination;
        public string IP_source;

        public string Port;



        public Filter_Record(bool permit, int protocol_int, bool direction_bool, string MAC_dest, 
            string MAC_src, string IP_dest, string IP_src, int port)
        {

            if (port == 1)
                Port = "1";
            if (port == 2)
                Port = "2";
            if (port == 3)
                Port = "ANY";

            if (permit == true)
                permit_deny = "Permit";
            else
                permit_deny = "Deny";

            if (protocol_int == 2)
                protocol = "UDP";
            if (protocol_int == 1)
                protocol = "TCP";
            if (protocol_int == 3)
                protocol = "ICMP";
            if (protocol_int == 4)
                protocol = "ANY";

            if (direction_bool == true)
                direction = "IN";
            else
                direction = "OUT";

            if (MAC_dest.Length == 0)
                MAC_destination = "ANY";
            else
                MAC_destination = MAC_dest;

            if (MAC_src.Length == 0)
                MAC_source = "ANY";
            else
                MAC_source = MAC_src;

            if (IP_dest.Length == 0)
                IP_destination = "ANY";
            else
                IP_destination = IP_dest;

            if (IP_src.Length == 0)
                IP_source = "ANY";
            else
                IP_source = IP_src;

        }

    }
}