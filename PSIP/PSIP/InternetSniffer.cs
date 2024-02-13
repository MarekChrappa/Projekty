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
    public class InternetSniffer
    {
        public int Length;
        public bool error = false;

        public List<Packet> RawPack1 = new List<Packet>();

        public bool help1 = false;
        public bool help2 = false;

        public byte[] bytes = null;


        public DateTime Time;

        public void StartSnifingInternet(WinPcapDevice device)
        {
            //RawPack1.Clear();

            device.OnPacketArrival +=
                new PacketArrivalEventHandler(device_OnPacketArrival);

            device.Open(OpenFlags.NoCaptureLocal , 2);
            device.StartCapture();

        }


        public void device_OnPacketArrival(object sender, CaptureEventArgs e)
        { 

            Packet rawPacket = Packet.ParsePacket(e.Packet.LinkLayerType, e.Packet.Data);
            RawPack1.Add(rawPacket);
            //Console.WriteLine("net");
            var a = rawPacket.GetType();
            EthernetPacket packt = (EthernetPacket)rawPacket;
        }

    }
}