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
    public class Sniffer
    {
        public int Length;
        public string stats;

        public List<Packet> RawPack1 = new List<Packet>();

        public byte[] bytes = null;

        public bool help1 = false;
        public bool help2 = false;

        public DateTime Time;

        public WinPcapDeviceList StartCapture()
        {
            var devices = WinPcapDeviceList.Instance;
            return devices;
        }

        public void StartSnifing(WinPcapDevice device)
        {
            //RawPack1.Clear();

            device.OnPacketArrival +=
                new PacketArrivalEventHandler(device_OnPacketArrival);

            device.Open(OpenFlags.NoCaptureLocal, 2);
            device.StartCapture();

        }

        public void device_OnPacketArrival(object sender, CaptureEventArgs e)
        {
            Packet rawPacket = Packet.ParsePacket(e.Packet.LinkLayerType, e.Packet.Data);
            //Console.WriteLine("local");
            RawPack1.Add(rawPacket);
        }
    }
}