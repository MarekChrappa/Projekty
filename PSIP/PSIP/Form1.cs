using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Threading;
using PacketDotNet;
using SharpPcap;
using SharpPcap.WinPcap;

namespace PSIP
{
    public partial class Form1 : Form
    {
        int MAX_TIMER = 400;
        public Sniffer sniffer = new();
        public InternetSniffer internet_sniffer = new();

        public List <MACK_TABLE_RECORD>mac_table_records = new List<MACK_TABLE_RECORD>();
        public List<Filter_Record> filter_records = new List<Filter_Record>();
        public List<CDP_record> cdp_records = new List<CDP_record>();

        public MAC_TABLE mac_table = new MAC_TABLE();

        public Stats stats = new Stats();
        public WinPcapDeviceList devices = null;

        public WinPcapDevice devi1;
        public WinPcapDevice devi2;

        public int TIMER = 60;
        public int CDP_TIMER = 5;
        public int CDP_HOLD_TIMER = 60;

        public String NAME = "S1";


        //Filter:
        public string MAC_Dest_Address;
        public string MAC_Source_Address;

        public string IP_Dest_Address;
        public string IP_Source_Address;

        public bool permit;
        public bool direction_in;

        public int protocol;
        public int port;
        //Filter

        void UpdateLabels()
        {
            label16.Text = stats.Ethernet_Count_Internet_In.ToString();
            label21.Text = stats.Ethernet_Count_Internet_Out.ToString(); 
            label31.Text = stats.Ethernet_Count_Local_In.ToString();
            label36.Text = stats.Ethernet_Count_Local_Out.ToString();

            label15.Text = stats.IPv4_Count_Internet_In.ToString();
            label20.Text = stats.IPv4_Count_Internet_Out.ToString();
            label30.Text = stats.IPv4_Count_Local_In.ToString();
            label35.Text = stats.IPv4_Count_Local_Out.ToString();

            label14.Text = stats.IPv6_Count_Internet_In.ToString();
            label19.Text = stats.IPv6_Count_Internet_Out.ToString();
            label29.Text = stats.IPv6_Count_Local_In.ToString();
            label34.Text = stats.IPv6_Count_Local_Out.ToString();

            label13.Text = stats.UDP_Count_Internet_In.ToString();
            label18.Text = stats.UDP_Count_Internet_Out.ToString();
            label28.Text = stats.UDP_Count_Local_In.ToString();
            label33.Text = stats.UDP_Count_Local_Out.ToString();

            label12.Text = stats.TCP_Count_Internet_In.ToString();
            label17.Text = stats.TCP_Count_Internet_Out.ToString();
            label27.Text = stats.TCP_Count_Local_In.ToString();
            label32.Text = stats.TCP_Count_Local_Out.ToString();

            label41.Text = stats.Total_Internet_In.ToString();
            label40.Text = stats.Total_Internet_Out.ToString();
            label38.Text = stats.Total_Local_In.ToString();
            label37.Text = stats.Total_Local_Out.ToString();

            label48.Text = stats.ICMP_Count_Internet_In.ToString();
            label47.Text = stats.ICMP_Count_Internet_Out.ToString();
            label45.Text = stats.ICMP_Count_Local_In.ToString();
            label44.Text = stats.ICMP_Count_Local_Out.ToString();

            label51.Text = "Timer: " + TIMER + "s";
        }


        public Form1()
        {
            InitializeComponent();

            radioButton1.Checked = true;
            radioButton6.Checked = true;
            radioButton8.Checked = true;
            radioButton9.Checked = true;

            //textBox6.Text.Append("na");

            UpdateLabels();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            devices = sniffer.StartCapture();
            int i = 1;

            foreach (var dev in devices){
                listBox1.Items.Add(dev.Description);
                listBox2.Items.Add(dev.Description);
                Console.WriteLine(dev.Description);
                i++;
            }

            //devi1 = devices[6];
            //devi2 = devices[8];

            
        }

        void Send_CDP()
        {
            int Time = 0;
            while (true)
            {
                if(Time > CDP_TIMER)
                {
                    var s = CDP_build(NAME, "Port 1");
                    devi1.SendPacket(s);

                    var d = CDP_build(NAME, "Port 2");
                    devi2.SendPacket(d);
                    Time = 0;
                }

                listView1.Items.Clear();

                //var help = cdp_records;
                foreach (var f in cdp_records.ToList())
                {
                    if (f.timer == 0)
                        cdp_records.Remove(f);
                    else
                    {
                        f.timer--;

                        ListViewItem item = new ListViewItem(f.Name);
                        item.SubItems.Add(f.timer.ToString());
                        item.SubItems.Add(f.Port.ToString());
                        item.SubItems.Add(f.NP);


                        listView1.Items.Add(item);
                    }
                }

                //cdp_records = help;


                Time++;
                Thread.Sleep(1000);
            }
        }

        void ClearMac_table(int port)
        {
            foreach (var MAC in mac_table_records.ToList())
            {
                if (MAC.Port == port)
                { 
                    mac_table_records.Remove(MAC);
                }
            }
        }

        void Show_Mac_table()
        {
            while (true)
            {
                listBox3.Items.Clear();

                var help = mac_table_records;
                foreach(var f in mac_table_records.ToList())
                {
                    if (f.timer == 0)
                        help.Remove(f);
                    else
                    {
                        f.timer--;
                        listBox3.Items.Add("Port: " + f.Port.ToString() + " MAC: " + f.MAC + " " + f.timer.ToString() + "s");
                    }
                }

                mac_table_records = help;
                Thread.Sleep(1000);
            }
        }

        bool MAC_SAME(string a, int b) // false = treba pridat zaznam, true = treba ignorovat zaznam
        {

            if (mac_table_records.Count == 0)
                return false;

            foreach (var MAC in mac_table_records.ToList()){
                if (MAC.MAC.Equals(a)){
                    if (MAC.Port == b){
                        MAC.timer = TIMER;
                        return true;
                    }
                    mac_table_records.Remove(MAC);
                    return false;
                }
            }
            return false;
        }
        
        bool ACL_Filter(EthernetPacket packet, Filter_Record filter)
       {
            bool accept = true;

            if (filter.MAC_source == "ANY") // mac source any
                accept = true;
            else{
                if (packet.SourceHwAddress.ToString() != filter.MAC_source) // mac source
                    accept = false;
            }

            if(accept == true){
                if (filter.MAC_destination != "ANY") //mac source any
                {
                    if (packet.DestinationHwAddress.ToString() != filter.MAC_destination) //mac source
                        accept = false;
                }      
            }

            if (packet.Type == EthernetPacketType.IpV4 || packet.Type == EthernetPacketType.IpV6){
                IpPacket ipPacket = (IpPacket)packet.PayloadPacket;


                if (accept == true)
                {
                    if (filter.IP_source == "ANY")
                        accept = true;
                    else
                    {
                        if (ipPacket.SourceAddress.ToString() == filter.IP_source) // IP source
                            accept = true;
                        else
                            accept = false;
                    }
                }

                if(accept == true){
                    if (filter.IP_destination == "ANY")
                        accept = true;
                    else
                    {
                        if (ipPacket.DestinationAddress.ToString() == filter.IP_destination) // IP source
                            accept = true;
                        else
                            accept = false;
                    }
                }

                if (accept == true) //PROTOCOLS
                {
                    if (filter.protocol == "ANY")
                        accept = true;
                    
                    else
                    {
                        if (ipPacket.Protocol.ToString() == filter.protocol) // IP source
                            accept = true;
                        else
                            accept = false;
                    }
                }

            }
            else
                accept = false;

            return accept;
        }

        bool ACL(EthernetPacket packet, String Pport, String smer)
        {
            bool accept;
            bool send = true;
            //Console.WriteLine(packet.Bytes.ToString());
            if(filter_records.Count > 0)
            {
                foreach (var filter in filter_records)
                {

                    accept = ACL_Filter(packet, filter);

                    if (accept == true && filter.permit_deny == "Permit" 
                        && (filter.Port == Pport || filter.Port == "ANY") &&  (filter.direction == smer || filter.direction == "ANY")) 
                        send = true;


                    if (accept == true && filter.permit_deny == "Deny"
                        && (filter.Port == Pport || filter.Port == "ANY") && (filter.direction == smer || filter.direction == "ANY"))
                        return false;
                    /*
                    if (accept == false && filter.permit_deny == "Deny")
                        send = false; */
                    /*
                    if (accept == false && filter.permit_deny == "Permit")
                        send = false; */
                }

                return send;
            }
            else
                return true;
        }

        void MAC_Table_Add(EthernetPacket ethernetPacket, int port)
        {
            var a = ethernetPacket.SourceHwAddress.ToString();
            var b = ethernetPacket.DestinationHwAddress.ToString();

            if (b.Equals("FFFFFFFFFFFF") || a.Equals("000000000000"))
                return;

            MACK_TABLE_RECORD zaznam = new MACK_TABLE_RECORD(a, port);
            
            if (!MAC_SAME(a, port))
                mac_table_records.Add(zaznam);
        }

        public static byte[] Combine(byte[] first, byte[] second)
        {
            byte[] ret = new byte[first.Length + second.Length];
            Buffer.BlockCopy(first, 0, ret, 0, first.Length);
            Buffer.BlockCopy(second, 0, ret, first.Length, second.Length);
            return ret;
        }

        Packet CDP_build(String name, String port)
        {

            byte[] dp = new byte[] { 0, 8, 32, 64,20,20 };
            byte[] sp = new byte[] { 0x1, 0x0, 0x0c , 0xcc, 0xcc,0xcc };

            byte[] Name = Encoding.ASCII.GetBytes(name);
            byte[] Port = Encoding.ASCII.GetBytes(port);

            byte[] packet = new byte[] { 
                sp[0], sp[1], sp[2], sp[3], sp[4], sp[5], // source mac  
                dp[0], dp[1], dp[2], dp[3], dp[4], dp[5], // dest mac
                
                
                0, 0, //length                                                                    //
                170, 170, 3, //protocols
                0,0, 12, //org code
                32,0, // PID CDP

            };

            byte[] cdp = new byte[] {                                                                             
                2, //version
                180,// TTL
                0x0, 0x0, //checksum
            };


            byte[] type1 = new byte[]{
                0x0,0x1,            //type
                0x0,0x0,            //length                                                     //
            };
            type1 = Combine(type1, Name);


            int lt = type1.Length;
            type1[3] = (byte)lt;

            byte[] type2 = new byte[]{
                0x0,0x3,            //type
                0x0,0x0,            //length                                                     //
            };
            type2 = Combine(type2, Port);


            int lt2 = type2.Length;
            type2[3] = (byte)lt2;

            byte[] type3 = new byte[]
            {
                0x0,0x4,           //type
                0x0,0x8,            //lenght
                0x0,0x0,0x0,0x8    //capabilities                                                   //
            };

            cdp = Combine(cdp, type1);
            cdp = Combine(cdp, type2);
            cdp = Combine(cdp, type3);

            var CheckSum = PacketDotNet.Utils.ChecksumUtils.OnesComplementSum(cdp);
            packet = Combine(packet, cdp);


            byte[] intBytes = BitConverter.GetBytes(packet.Length - 14);
            Array.Reverse(intBytes);
            byte[] length = intBytes;

            byte[] intBytes2 = BitConverter.GetBytes(CheckSum);
            Array.Reverse(intBytes2);
            byte[] result = intBytes2;


            packet[12] = length[2];
            packet[13] = length[3];

            packet[24] = result[2];
            packet[25] = result[3];

            LinkLayers link = new LinkLayers();
            Packet packt = Packet.ParsePacket(LinkLayers.Ethernet, packet); 
            return packt;
           
        }

        public byte[] AddByteToArray(byte[] bArray, byte newByte)
        {
            byte[] newArray = new byte[bArray.Length + 1];
            bArray.CopyTo(newArray, 1);
            newArray[0] = newByte;
            return newArray;
        }

        void CDP(EthernetPacket packet, int p)
        {
            bool gn = false;
            bool gp = false;

            String Name = "";
            String Port = "";

            int start = 26;

            byte[] packet_bytes = packet.Bytes;

            while(gn != true || gp != true)
            {
                byte[] vs = new byte[]
                {
                    packet_bytes[start + 2], packet_bytes[start + 3]
                };


                var lenght = (short)(vs[0] << 8 | vs[1]);
                int end = start + lenght;
                //Console.WriteLine(lenght);


                if (packet_bytes[start + 1] == 0x1)
                {
                    byte[] name = new byte[lenght - 4];

                    for (int i = 0; i < lenght - 4; i++){
                        name[i] = packet_bytes[start + 4 + i];
                    }

                    Name = System.Text.Encoding.Default.GetString(name);
                    //Console.WriteLine(Name);
                    gn = true;
                }

                if (packet_bytes[start + 1] == 0x3)
                {
                    byte[] type = new byte[lenght - 4];

                    for (int i = 0; i < lenght - 4; i++){
                        type[i] = packet_bytes[start + 4 + i];
                    }

                    Port = System.Text.Encoding.Default.GetString(type);
                    //Console.WriteLine(Port);
                    gp = true;
                }

                start = end;
                //Console.WriteLine(start);
            }

            CDP_record cDP_Record = new CDP_record(Name, Port, p);

            bool add = true;

            if(cdp_records.Count > 0)
            {
                foreach(CDP_record cdp in cdp_records.ToList())
                {
                    if (cdp.Name == cDP_Record.Name)
                    {
                        add = false;
                        cdp.timer = CDP_HOLD_TIMER;
                    }
                }
            }
            if(add)
                cdp_records.Add(cDP_Record);

           

        }

        void Sietove_rozhranie1_internet()
        {
            WinPcapDevice device = devi2;

            int timer = 0;
            int f = 0;

            while (true)
            {
                bool ping = false;
                bool send = true;

                if (internet_sniffer.RawPack1.Count > 0)
                {

                    var sendpacket = internet_sniffer.RawPack1[0];
                    internet_sniffer.RawPack1.RemoveAt(0);
                    

                    if(sendpacket.GetType() == typeof(EthernetPacket))
                    {
                        EthernetPacket ethernetpacket = (EthernetPacket)sendpacket ;

                        var a = ethernetpacket.SourceHwAddress.ToString();
                        var b = ethernetpacket.DestinationHwAddress.ToString();

                        if (a == "005079666803")
                        {
                            timer = 0;
                            device.SendPacket(sendpacket);
                            ping = true;
                        }

                        
                    }
                    
                    if(ping == false) 
                    {
                        stats.Add_Stats(sendpacket, 1, true);

                        if (sendpacket.GetType() == typeof(EthernetPacket))
                        {
                            EthernetPacket ethernetPacket = (EthernetPacket)sendpacket;
                            

                            
                            if (send == true)
                            {
                                if (ethernetPacket.DestinationHwAddress.ToString() == "01000ccccccc"){
                                    CDP(ethernetPacket,1);
                                    send = false;
                                }
                            }

                            if (ethernetPacket.DestinationHwAddress.ToString() == "01000CCCCCCC")
                            {
                                CDP(ethernetPacket, 1);
                                send = false;
                            }
                            else
                            {

                                MAC_Table_Add(ethernetPacket, 1);
                                send = mac_table.See_Mac_table(ethernetPacket, 1, mac_table_records);

                            }
                        }

                        
                        if (filter_records.Count > 0 && send == true)
                        {

                            
                            if (sendpacket.GetType() == typeof(EthernetPacket))
                            {
                                EthernetPacket ethernetPacket = (EthernetPacket)sendpacket;
                                send = ACL(ethernetPacket, "1", "IN");

                                if(send == true)
                                    send = ACL(ethernetPacket, "2", "OUT");
                            }

                        }
                       

                        if (send == true)
                        {
                            stats.Add_Stats(sendpacket, 2, false);
                            device.SendPacket(sendpacket);
                        }
                    }
                }

                //timer++;

                if (timer == MAX_TIMER)
                {
                    //Console.WriteLine("removeport1");
                    //Console.WriteLine(mac_table_records.Count);
                    ClearMac_table(1);
                    timer = 0;
                }

                UpdateLabels();
                Thread.Sleep(10);
            }
        }

        void Sietove_rozhranie2()
        {
            WinPcapDevice device = devi1;
            int timer = 0;


            while (true)
            {
                bool send = true;
                bool ping = false;

                if (sniffer.RawPack1.Count > 0)
                {
                    
                    var sendpacket = sniffer.RawPack1[0];
                    sniffer.RawPack1.RemoveAt(0);


                    if (sendpacket.GetType() == typeof(EthernetPacket))
                    {
                        EthernetPacket ethernetpacket = (EthernetPacket)sendpacket;

                        var a = ethernetpacket.SourceHwAddress.ToString();

                        if (a == "005079666804")
                        {
                            timer = 0;
                            device.SendPacket(sendpacket);
                            

                            ping = true;
                        }
                    }
                    if (ping == false)
                    {
                        stats.Add_Stats(sendpacket, 2, true);
                        if (sendpacket.GetType() == typeof(EthernetPacket))
                        {

                            EthernetPacket ethernetPacket = (EthernetPacket)sendpacket;

                            //Console.WriteLine(ethernetPacket.DestinationHwAddress.ToString());
                            if (ethernetPacket.DestinationHwAddress.ToString() == "01000CCCCCCC")
                            {
                                CDP(ethernetPacket,2);
                                send = false;
                            }
                            else
                            {
                                
                                MAC_Table_Add(ethernetPacket, 2);
                                send = mac_table.See_Mac_table(ethernetPacket, 2, mac_table_records);

                            }
                            
                        }

                        if (filter_records.Count > 0 && send == true)
                        {


                            if (sendpacket.GetType() == typeof(EthernetPacket))
                            {
                                EthernetPacket ethernetPacket = (EthernetPacket)sendpacket;
                                send = ACL(ethernetPacket, "2", "IN");

                                if (send == true)
                                    send = ACL(ethernetPacket, "1", "OUT");
                            }

                        }

                        if (send == true)
                        {
                            stats.Add_Stats(sendpacket, 1, false);
                            device.SendPacket(sendpacket);
                        }

                        
                    }
                }

                //timer++;

                if (timer == MAX_TIMER)
                {
                    //macdeleteport
                    ClearMac_table(2);
                    //Console.WriteLine("removeport2");
                    timer = 0;
                }

                UpdateLabels();
                Thread.Sleep(10);
            }
        }

        //TIMER BUTTONS and clearing mac_table
        private void button3_Click(object sender, EventArgs e){ mac_table_records.Clear();}
        private void button4_Click(object sender, EventArgs e){TIMER += 10;}
        private void button5_Click(object sender, EventArgs e){TIMER -= 10;}
        private void button6_Click(object sender, EventArgs e){TIMER += 5;}
        private void button7_Click(object sender, EventArgs e){TIMER -= 5;}
        private void button9_Click(object sender, EventArgs e){TIMER += 1;}
        private void button8_Click(object sender, EventArgs e){TIMER -= 1;}

        private void Show_Filters()
        {
            Filter_Table_box.Items.Clear();

            foreach(var record in filter_records)
            {
                ListViewItem item = new ListViewItem(record.permit_deny);
                item.SubItems.Add(record.direction);
                item.SubItems.Add(record.Port);
                item.SubItems.Add(record.MAC_source);
                item.SubItems.Add(record.MAC_destination);
                item.SubItems.Add(record.IP_source);
                item.SubItems.Add(record.IP_destination);
                item.SubItems.Add(record.protocol);

                Filter_Table_box.Items.Add(item);
            }

        }

        private void add_filter_button_Click(object sender, EventArgs e)
        {
            MAC_Source_Address = textBox1.Text;
            MAC_Dest_Address = textBox2.Text;

            IP_Source_Address = textBox3.Text;
            IP_Dest_Address = textBox4.Text;


            if (radioButton1.Checked == true)
                permit = true;
            else
                permit = false;

            if (radioButton8.Checked == true)
                direction_in = true;
            else
                direction_in = false;

            if (radioButton12.Checked == true)
                port = 1;
            if (radioButton11.Checked == true)
                port = 2;
            if (radioButton9.Checked == true)
                port = 3;

            if (radioButton3.Checked == true)
                protocol = 1;
            if (radioButton4.Checked == true)
                protocol = 2;
            if (radioButton5.Checked == true)
                protocol = 3;
            if (radioButton6.Checked == true)
                protocol = 4;

            Filter_Record record = new Filter_Record(permit,protocol,direction_in, MAC_Dest_Address, 
                MAC_Source_Address, IP_Dest_Address, IP_Source_Address,port);

            filter_records.Add(record);
            Show_Filters();
        }

        private void button11_Click(object sender, EventArgs e)
        {
            var help = textBox5.Text;
            int delete_record = Int32.Parse(help);
            if (filter_records.Count != 0 && filter_records.Count >= delete_record )
                filter_records.RemoveAt(delete_record);

            textBox5.Clear();
            Show_Filters();
        }

        private void button2_Click(object sender, EventArgs e)
        {
            stats.Reset_stats();
        }

        private void button10_Click(object sender, EventArgs e)
        {
            NAME = textBox6.Text;
        }

        private void listBox1_SelectedIndexChanged(object sender, EventArgs e)
        {
            int i = listBox1.SelectedIndex;
            label56.Text = "Port1 ready";
            devi1 = devices[i];
        }

        private void listBox2_SelectedIndexChanged(object sender, EventArgs e)
        {
            int i = listBox2.SelectedIndex;
            label57.Text = "Port2 ready";
            devi2 = devices[i];
        }

        private void button12_Click(object sender, EventArgs e)
        {
            internet_sniffer.StartSnifingInternet(devi1);
            sniffer.StartSnifing(devi2);

            label58.Text = "SWITCH IS ON";

            //dev1
            Thread t = new Thread(Sietove_rozhranie1_internet);
            t.Start();

            //dev2
            Thread b = new Thread(Sietove_rozhranie2);
            b.Start();

            Thread c = new Thread(Show_Mac_table);
            c.Start();

            Thread d = new Thread(Send_CDP);
            d.Start();
        }

        private void button13_Click(object sender, EventArgs e)
        {
            CDP_TIMER = int.Parse(textBox8.Text);
        }
        private void textBox7_TextChanged(object sender, EventArgs e)
        {
            CDP_HOLD_TIMER = int.Parse(textBox7.Text);
        }
    }
}