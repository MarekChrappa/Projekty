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
    public class Stats
    {
        public int Ethernet_Count_Internet_In = 0;
        public int Ethernet_Count_Internet_Out = 0;

        public int Ethernet_Count_Local_In = 0;
        public int Ethernet_Count_Local_Out = 0;


        public int IPv4_Count_Internet_In = 0;
        public int IPv4_Count_Internet_Out = 0;

        public int IPv4_Count_Local_In = 0;
        public int IPv4_Count_Local_Out = 0;


        public int IPv6_Count_Internet_In = 0;
        public int IPv6_Count_Internet_Out = 0;

        public int IPv6_Count_Local_In = 0;
        public int IPv6_Count_Local_Out = 0;


        public int UDP_Count_Internet_In = 0;
        public int UDP_Count_Internet_Out = 0;

        public int UDP_Count_Local_In = 0;
        public int UDP_Count_Local_Out = 0;


        public int TCP_Count_Internet_In = 0;
        public int TCP_Count_Internet_Out = 0;

        public int TCP_Count_Local_In = 0;
        public int TCP_Count_Local_Out = 0;

        public int ICMP_Count_Internet_In = 0;
        public int ICMP_Count_Internet_Out = 0;

        public int ICMP_Count_Local_In = 0;
        public int ICMP_Count_Local_Out = 0;

        public int Total_Internet_In = 0;
        public int Total_Internet_Out = 0;

        public int Total_Local_In = 0;
        public int Total_Local_Out = 0;

        public void Add_Stats(Packet packet, int dev, bool dev_in)
        {

            if (dev == 1 && dev_in == true)
                Total_Internet_In++;
            if (dev == 1 && dev_in == false)
                Total_Internet_Out++;
            if (dev == 2 && dev_in == true)
                Total_Local_In++;
            if (dev == 2 && dev_in == false)
                Total_Local_Out++;

            var sendpacket = packet;
            if (sendpacket.GetType() == typeof(EthernetPacket))
            {
                if (dev == 1 && dev_in == true)
                    Ethernet_Count_Internet_In++;
                if (dev == 2 && dev_in == true)
                    Ethernet_Count_Local_In++;
                if (dev == 1 && dev_in == false)
                    Ethernet_Count_Internet_Out++;
                if (dev == 2 && dev_in == false)
                    Ethernet_Count_Local_Out++;

                EthernetPacket ethernetPacket = (EthernetPacket)sendpacket;


                if (ethernetPacket.Type == EthernetPacketType.IpV4 || ethernetPacket.Type == EthernetPacketType.IpV6)
                {
                    if (ethernetPacket.Type == EthernetPacketType.IpV4)
                    {

                        if (dev == 1 && dev_in == true)
                            IPv4_Count_Internet_In++;
                        if (dev == 1 && dev_in == false)
                            IPv4_Count_Internet_Out++;
                        if (dev == 2 && dev_in == true)
                            IPv4_Count_Local_In++;
                        if (dev == 2 && dev_in == false)
                            IPv4_Count_Local_Out++;
                    }
                    else
                    {

                        if (dev == 1 && dev_in == true)
                            IPv6_Count_Internet_In++;
                        if (dev == 1 && dev_in == false)
                            IPv6_Count_Internet_Out++;
                        if (dev == 2 && dev_in == true)
                            IPv6_Count_Local_In++;
                        if (dev == 2 && dev_in == false)
                            IPv6_Count_Local_Out++;
                    }

                    IpPacket ipPacket = (IpPacket)ethernetPacket.PayloadPacket;

                    if (ipPacket.Protocol == IPProtocolType.TCP)
                    {

                        if (dev == 1 && dev_in == true)
                            TCP_Count_Internet_In++;
                        if (dev == 1 && dev_in == false)
                            TCP_Count_Internet_Out++;
                        if (dev == 2 && dev_in == true)
                            TCP_Count_Local_In++;
                        if (dev == 2 && dev_in == false)
                            TCP_Count_Local_Out++;
                    }
                    if (ipPacket.Protocol == IPProtocolType.UDP)
                    {
                        if (dev == 1 && dev_in == true)
                            UDP_Count_Internet_In++;
                        if (dev == 1 && dev_in == false)
                            UDP_Count_Internet_Out++;
                        if (dev == 2 && dev_in == true)
                            UDP_Count_Local_In++;
                        if (dev == 2 && dev_in == false)
                            UDP_Count_Local_Out++;
                    }
                    if (ipPacket.Protocol == IPProtocolType.ICMP)
                    {
                        if (dev == 1 && dev_in == true)
                            ICMP_Count_Internet_In++;
                        if (dev == 1 && dev_in == false)
                            ICMP_Count_Internet_Out++;
                        if (dev == 2 && dev_in == true)
                            ICMP_Count_Local_In++;
                        if (dev == 2 && dev_in == false)
                            ICMP_Count_Local_Out++;
                    }
                }
            }
        }

        public void Reset_stats()
        {

            Ethernet_Count_Internet_In = 0;
            Ethernet_Count_Internet_Out = 0;

            Ethernet_Count_Local_In = 0;
            Ethernet_Count_Local_Out = 0;


            IPv4_Count_Internet_In = 0;
            IPv4_Count_Internet_Out = 0;

            IPv4_Count_Local_In = 0;
            IPv4_Count_Local_Out = 0;


            IPv6_Count_Internet_In = 0;
            IPv6_Count_Internet_Out = 0;

            IPv6_Count_Local_In = 0;
            IPv6_Count_Local_Out = 0;


            UDP_Count_Internet_In = 0;
            UDP_Count_Internet_Out = 0;

            UDP_Count_Local_In = 0;
            UDP_Count_Local_Out = 0;


            TCP_Count_Internet_In = 0;
            TCP_Count_Internet_Out = 0;

            TCP_Count_Local_In = 0;
            TCP_Count_Local_Out = 0;

            ICMP_Count_Internet_In = 0;
            ICMP_Count_Internet_Out = 0;

            ICMP_Count_Local_In = 0;
            ICMP_Count_Local_Out = 0;

            Total_Internet_In = 0;
            Total_Internet_Out = 0;

            Total_Local_In = 0;
            Total_Local_Out = 0;

        }
    }
}