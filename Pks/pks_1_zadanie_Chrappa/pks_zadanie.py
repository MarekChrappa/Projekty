from os import truncate
import sys
import scapy.all as scapy

class IPv4_stats: #class pre ulohu 3
   def __init__(self, IPG): 
      self.count = 1 
      self.IP_packets = 1
      self.IP = IPG
   def Number_packets(self):
      self.IP_packets = self.IP_packets + 1
class RamecINF:
   
   def __init__(self,cislo,frame,dlzka):
      self.use = 0
      self.cislo = cislo
      self.ramec = frame
      self.velkost = dlzka

      self.IPv4 = 0
      self.ethernetII = 0
      self.IEEE = 0
      self.sdp = 0
 
      self.prva_uroven = '' #ethernet II
      self.druha_uroven = '' # IPv4
      self.tretia_uroven = '' # UDP 
      self.stvrta_uroven  = ''  # SSH

      self.IP_des = ''
      self.IP_sour = ''

   def Dlzka(self):
          #velkost = len(ramec)
      if(self.velkost < 60):
         mvelkost = 64
      else:
         mvelkost = self.velkost + 4
      #RamecPocet[i-1].dlzka(velkost,mvelkost)

      self.dlzka_API = self.velkost
      self.dlzka_Medium = mvelkost  
   def MAC_address(self): #Zdrojová a cielova adresa
      
      zdroj = bytearray() 
      for b in range(6,12):       
         zdroj.append(self.ramec[b])
      help = zdroj.hex()

      ciel = bytearray()
      for b in range(6):  
         ciel.append(self.ramec[b])
      help2 = ciel.hex()

      self.Zdroj_Mac = help
      self.Ciel_Mac = help2

   def ethernetII_set(self):
      self.ethernetII = 1
      self.IEEE = 0
      self.prva_uroven = 'ethernet II'
   def ethernetII_protocol_set(self,a,b):
      self.ethernetII_protocol_name = a
      self.ethernetII_protocol_number = b
      self.druha_uroven = a

   def ARP_set(self,a,b,c,d,e):
      self.IP_sour = a
      self.IPv4_ip_source = a
      self.IP_des = b
      self.IPv4_ip_destination = b
      self.OP_code_number = c

      for x in range(len(ARP_op_number)):
         if(self.OP_code_number == ARP_op_number[x]):
            self.OP_code_name = ARP_op_name[x]

   def ICMP_set(self):
      self.ICMP_type = bytearray()
      self.ICMP_type.append(ramec[self.IPv4_len + 14])
      self.help_int = int.from_bytes(self.ICMP_type,"big")
      help = False
      print(self.help_int)
      for x in range(len(ICMP_number)):
         if(self.help_int == ICMP_number[x]):
            self.ICMP_type_name = ICMP_name[x]
            help = True
            break
      if(help == False):
         self.ICMP_type_name = "Neznamy"
   def TCP_protocol(self):
          
      help_int = int(str(int.from_bytes(self.source_port,"big")),base=16)
      help = 0
      self.flags = bytearray()
      self.flags.append(ramec[self.IPv4_len + 27])
   
      for x in range(len(TCP_port_number)):
         if(TCP_port_number[x] == help_int):
            help = 1 
            self.stvrta_uroven = TCP_port_name[x]
            break
      if(help == 0):
         help_int = int(str(int.from_bytes(self.destination_port,"big")),base=16)
         for x in range(len(TCP_port_number)):
            if(TCP_port_number[x] == help_int):
               help = 1     
               self.stvrta_uroven = TCP_port_name[x]
               break
      if(help == 0):
         self.stvrta_uroven = "Neznamy protokol"
   def UDP_protocol(self):
      help_int = int(str(int.from_bytes(self.source_port,"big")),base=16)
      
      help = 0
      
      for x in range(len(UDP_port_number)):
         if(UDP_port_number[x] == help_int):
            help = 1     
            self.stvrta_uroven = UDP_port_name[x]
            break
      if(help == 0):
         help_int = int(str(int.from_bytes(self.destination_port,"big")),base=16)
         #print(help_int)
         for x in range(len(UDP_port_number)):
            if(UDP_port_number[x] == help_int):
               help = 1     
               self.stvrta_uroven = UDP_port_name[x]
               break
      
   def ethernetII_protocol_IPv4(self,a,b,c,d,e,f):
      self.IPv4_len = c 
      self.IPv4_protocol_number = d 
      self.IPv4 = 1

      self.IPv4_ip_source = a
      self.IPv4_ip_destination = b

      self.IP_des = self.IPv4_ip_destination
      self.IP_sour = self.IPv4_ip_source

      self.IPv4_ip_source_hex = e
      self.IPv4_ip_destination_hex = f

      self.help = 0
      for x in range(len(IPv4_number)):
         if(IPv4_number[x] == self.IPv4_protocol_number):
            self.tretia_uroven = IPv4_name[x]
            self.help = 1
      if(self.help == 0):
         self.tretia_uroven = "Neznamy protokol"
      if(self.tretia_uroven == "TCP" or self.tretia_uroven == "UDP"):
   
         self.source_port = bytearray()
         self.destination_port = bytearray()

         self.S_D_ports()

      if(self.tretia_uroven == "TCP"):
            self.TCP_protocol()
      if(self.tretia_uroven == "UDP"):
            self.UDP_protocol()
   def S_D_ports(self):
      self.sdp = 1
      self.source_port = bytearray()
      self.destination_port = bytearray()

      self.source_port.append(ramec[self.IPv4_len + 14])
      self.source_port.append(ramec[self.IPv4_len + 15])
   
      self.destination_port.append(ramec[self.IPv4_len + 16])
      self.destination_port.append(ramec[self.IPv4_len + 17])

   def IEEE_protocol_set_3(self,a,b):
      self.tretia_uroven = a
      self.tretia_uroven_hex = b
   def IEEE_protocol_set_2(self,a,b):
      self.druha_uroven = a
      self.druha_uroven_hex = b
      
   def IEEE_set(self):
      self.ethernetII = 0
      self.IEEE = 1 
      self.prva_uroven = 'IEEE'
   def IEEE_protocol_set(self,a):
      self.IEEE_protocol = a
      self.prva_uroven = a
   
   def Print_TCP_UDP(self):
      print("Zdrojový port: ", int.from_bytes(self.source_port,"big"))
      print("Cielový port: ", int.from_bytes(self.destination_port,"big"))   
   def Print_IPv4(self):
      print("Zdrojová IP adresa: ",end="")
      for x in range(len(self.IPv4_ip_source)):
         print(self.IPv4_ip_source[x],end="")
      print("\nCielová IP adresa: ", end= "")
      for x in range(len(self.IPv4_ip_source)):
         print(self.IPv4_ip_destination[x],end="")
      print("")
   def Print_MAC_ADDRESS(self):
      print("Zdrojová MAC  adresa: ",end="" )
      for g in range(len(self.Ciel_Mac)):
         print(self.Ciel_Mac[g],end= "")
         if(g % 2 != 0):
            print(" ",end="")
      print("\nCieľová MAC  adresa: ",end="")
      for g in range(len(self.Zdroj_Mac)):
         print(self.Zdroj_Mac[g],end= "")
         if(g % 2 != 0):
            print(" ",end="")
      print("")
   def Print_RDP(self):
      print("\n//////////Zaciatok Ramca//////////")    
      print("Ramec: ", self.cislo)
      print("dĺžka rámca poskytnutá pcap API: ", self.dlzka_API)
      print("dĺžka rámca poskytnutá po mediu: ", self.dlzka_Medium)
   def Print_Hex_Ramec(self):
      print("\n")
      self.help = self.ramec.hex()
      for x in range(1,len(self.ramec)):
         if(x%2 != 0 ):
            print(self.help[x-1],end="")
         else:
            print(self.help[x-1],end=" ")

         if(x%16 == 0 and x != 0):
            print("     ",end=" ")    
         if(x%32 == 0 and x != 0):
            print("") 
      print(self.ramec[x],end=" ")
      print("\n//////////Koniec Ramca//////////\n")  
   def Print_urovne(self):
      print(self.prva_uroven)
      if self.druha_uroven != '':
         print(self.druha_uroven)
      if self.tretia_uroven != '':
         print(self.tretia_uroven)
      if self.tretia_uroven != '':
         print(self.stvrta_uroven)

def ETHERTYPE(typ_int,i): #ETHERNET II PROTOKOL
   hh = False
   for g in range(len(ethertype_number)):
      if(typ_int == ethertype_number[g]):
         RamecPocet[i-1].ethernetII_protocol_set(ethertype_name[g],ethertype_number[g])
         help_name = ethertype_name[g]
         hh = True
         if typ_int == ethertype_number[0]:
            help_name = ethertype_name[0]
            Ipprotocol = bytearray()
            Ipprotocol.append(ramec[23])
            break
   
   if(hh == False):
      RamecPocet[i-1].ethernetII_protocol_set("Neznamy protokol",0)
      help_name = "Neznamy protokol"       
   #ARP
   if(help_name == 'ARP'):
          
      str = []
      str2 = []

      OP_code = bytearray()
      OP_code.append(ramec[20])
      OP_code.append(ramec[21])
      OP_code = int.from_bytes(OP_code,"big")

      ARP_ip_d = bytearray()
      ARP_ip_d.append(ramec[28])
      ARP_ip_d.append(ramec[29])
      ARP_ip_d.append(ramec[30])
      ARP_ip_d.append(ramec[31])

      for x in range(28,32):
         str.append(ramec[x])
         if(x!=31):
             str.append(".")

      ARP_ip_s = bytearray()
      ARP_ip_s.append(ramec[38])
      ARP_ip_s.append(ramec[39])
      ARP_ip_s.append(ramec[40])
      ARP_ip_s.append(ramec[41])

      for x in range(38,42):
         str2.append(ramec[x])
         if(x!=41):
             str2.append(".")
      RamecPocet[i-1].ARP_set(str,str2,OP_code,ARP_ip_s,ARP_ip_d)
   #IPv4
   if typ_int == ethertype_number[0]:
          
      
      str = []
      str2 = []
      help = 0 
      header = bytearray()
      header.append(ramec[14])
      header[0] = header[0] - 64

      headerlong = header[0] * 4
      IPV4_protocol = ramec[23]

      ip_s = bytearray()
      ip_s.append(ramec[26])
      ip_s.append(ramec[27])
      ip_s.append(ramec[28])
      ip_s.append(ramec[29])
      for x in range(26,30):
         str.append(ramec[x])
         if(x!=29):
             str.append(".")
      
      ip_d = bytearray()
      ip_d.append(ramec[30])
      ip_d.append(ramec[31])
      ip_d.append(ramec[32])
      ip_d.append(ramec[33])

      for x in range(30,34):
         str2.append(ramec[x])
         if(x!=33):
            str2.append(".")
      
      RamecPocet[i-1].ethernetII_protocol_IPv4(str,str2,headerlong,IPV4_protocol,ip_s,ip_d)
      
      if(len(IPv4_stats_g) == 0):
         IPv4_stats_g.append(IPv4_stats(str))
      else:
         for k in range(len(IPv4_stats_g)):
            if(str == IPv4_stats_g[k].IP): 
               IPv4_stats_g[k].Number_packets()
               help = 1
               break
         if(help == 0 ):
            IPv4_stats_g.append(IPv4_stats(str))

      for i in range(len(IPv4_number)):
         if(ramec[23] == IPv4_number[i]):
            #print("\n",IPv4_name[i])
            break     
def IEEE_TYPE(typ_int): #IEEE PROTOKOL

   IEEE_type = bytearray()
   IEEE_type.append(ramec[14])
   IEEE_type.append(ramec[15])
   IEEE_type_int = int.from_bytes(IEEE_type,"big")

   for g in range(len(IEEE_number)):
      if(g == 2):
         IEEE_type_int = 0 
      if(IEEE_type_int == IEEE_number[g]):
         
         RamecPocet[i-1].IEEE_protocol_set(IEEE_name[g])
         if(RamecPocet[i-1].prva_uroven == "IEEE 802.3 LLC + SNAP"):
            help_protocol = bytearray()
            help_protocol.append(ramec[14])
            help_protocol_number = int.from_bytes(help_protocol,"big")
            helpp = 0 
            for g in range(len(LSAPs_number)):
               if(help_protocol_number == LSAPs_number[g]):
                  RamecPocet[i-1].IEEE_protocol_set_2(LSAPs_name[g],LSAPs_number[g])
                  helpp = 1
                  break
            if(helpp == 0):
                  RamecPocet[i-1].IEEE_protocol_set_2("Neznamy protokol",help_protocol_number) 
            help_protocol = bytearray()
            help_protocol.append(ramec[22])
            help_protocol.append(ramec[23])
            help_protocol_number = int.from_bytes(help_protocol,"big")
            helpp = 0
            for g in range(len(ethertype_number)):
                  if(help_protocol_number == ethertype_number[g]):     
                     RamecPocet[i-1].IEEE_protocol_set_3(ethertype_name[g],ethertype_number[g])
                     helpp = 1
                     break
            if(helpp == 0):
                  RamecPocet[i-1].IEEE_protocol_set_3("Neznamy protokol",help_protocol_number)
         elif (RamecPocet[i-1].prva_uroven == "IEEE 802.3 RAW"):
                  protokol = "IPX"
                  RamecPocet[i-1].IEEE_protocol_set_2(protokol,255)
                  break
         elif (RamecPocet[i-1].prva_uroven == "IEEE 802.3 LLC"):
               help_protocol = bytearray()
               help_protocol.append(ramec[14])
               help_protocol_number = int.from_bytes(help_protocol,"big")
               helpp = 0
               for g in range(len(LSAPs_number)):
                  if(help_protocol_number == LSAPs_number[g]):
                     RamecPocet[i-1].IEEE_protocol_set_2(LSAPs_name[g],LSAPs_number[g])
                     helpp = 1
                     break 
               if(helpp == 0):
                  RamecPocet[i-1].IEEE_protocol_set_2("Neznamy protokol",help_protocol_number) 
         break  

def Print_4a(help_kom_list):
   if(len(help_kom_list) > 20):
      for k in range(10):
             
         help_kom_list[k].Print_RDP()
         help_kom_list[k].Print_MAC_ADDRESS()
         help_kom_list[k].Print_urovne()
         help_kom_list[k].Print_IPv4()
         help_kom_list[k].Print_TCP_UDP()

         print(bin(int.from_bytes(help_kom_list[k].flags,"big")))
         help_kom_list[k].Print_Hex_Ramec()
         print("\n")   

      print("\n")

      for k in range(len(help_kom_list) - 10, len(help_kom_list)):
         help_kom_list[k].Print_RDP()
         help_kom_list[k].Print_MAC_ADDRESS()
         help_kom_list[k].Print_urovne()
         help_kom_list[k].Print_IPv4()
         help_kom_list[k].Print_TCP_UDP()

         print(bin(int.from_bytes(help_kom_list[k].flags,"big")))
         help_kom_list[k].Print_Hex_Ramec()
         print("\n")   
   else:    
      for k in range(len(help_kom_list)):
         help_kom_list[k].Print_RDP()
         help_kom_list[k].Print_MAC_ADDRESS()
         help_kom_list[k].Print_urovne()
         help_kom_list[k].Print_IPv4()
         help_kom_list[k].Print_TCP_UDP()

         print(bin(int.from_bytes(help_kom_list[k].flags,"big")))
         help_kom_list[k].Print_Hex_Ramec()
         print("\n")   
def Uloha_1_2():  #Vypisanie ulohy 1 a 2
   for x in range(len(RamecPocet)):
      RamecPocet[x].Print_RDP()
      RamecPocet[x].Print_MAC_ADDRESS()
      RamecPocet[x].Print_urovne()
      if(RamecPocet[x].druha_uroven == 'IPv4'):
         RamecPocet[x].Print_IPv4()
      if(RamecPocet[x].tretia_uroven == "TCP" or RamecPocet[x].tretia_uroven == "UDP"):
         RamecPocet[x].Print_TCP_UDP()
      RamecPocet[x].Print_Hex_Ramec()
   Uloha_3()   
def Uloha_3():    #Vypisanie ulohy 3
   print("/////////Uloha 3 //////////")
   print("IP adresy vysielajúcich uzlov:")
   for x in range(len(IPv4_stats_g)):
      for f in range(7):    
         print(IPv4_stats_g[x].IP[f],end="")
      print(" : ",IPv4_stats_g[x].IP_packets)

   biggest = 0
   for x in range(len(IPv4_stats_g )):
      if(int(IPv4_stats_g[x].IP_packets) > biggest):
         biggest = IPv4_stats_g[x].IP_packets 
         packets = x   
   print("\n")
   for f in range(7):    
      print(IPv4_stats_g[packets].IP[f],end="")   
   print(": ", IPv4_stats_g[packets].IP_packets)

   print("/////////Koniec ulohy 3 //////////")
def Uloha_4_a(print_list,a):  #Vypisanie ulohy 4 a,b,c,d,e,f komunikacie
   
   print(len(print_list))
   if(len(print_list) == 0):
      print("Ziadnen ramec: ",a)
      return
   i = 1
   dobra_komunikacia = False
   zla_komunikacia = False
   for x in range(len(print_list)):
      help_kom_list = []
      
      if(print_list[x].use == 0):
         
         help_kom_list.append(print_list[x])

         for y in range(x+1,len(print_list)): 
            if(   print_list[y].use == 0   and ( (print_list[x].destination_port == print_list[y].destination_port and print_list[x].source_port == print_list[y].source_port)   
            or (print_list[x].destination_port == print_list[y].source_port and print_list[x].source_port == print_list[y].destination_port)) 
            and ( (print_list[x].IPv4_ip_source == print_list[y].IPv4_ip_source  and print_list[x].IPv4_ip_destination == print_list[y].IPv4_ip_destination ) or
            (print_list[x].IPv4_ip_source == print_list[y].IPv4_ip_destination  and print_list[x].IPv4_ip_destination == print_list[y].IPv4_ip_source))   ):  

               help_kom_list.append(print_list[y])
               print_list[y].use = 1
         print_list[x].use = 1

         if(len(help_kom_list) > 4):
         

            bin_flags_1 = bin(int.from_bytes(help_kom_list[0].flags,"big"))
            flags_len_1 = len(bin_flags_1)

            bin_flags_2 = bin(int.from_bytes(help_kom_list[1].flags,"big"))
            flags_len_2 = len(bin_flags_2)

            bin_flags_3 = bin(int.from_bytes(help_kom_list[2].flags,"big"))
            flags_len_3 = len(bin_flags_3)

            #zaciatok syn, syn ack, ack
            if( flags_len_1 > 3 and flags_len_2 > 6 and flags_len_2 > 6 and 
            int(bin_flags_1[flags_len_1-2]) == 1   and   ( int(bin_flags_2[flags_len_2-2]) == 1 and int(bin_flags_2[flags_len_2-5]) == 1 )   and int(bin_flags_3[flags_len_3-5]) == 1):

               cor_sent = False
               cor_recive = False

               bin_flags_4 = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 1].flags,"big"))
               flags_len_4 = len(bin_flags_4)

               bin_flags_3 = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 2].flags,"big"))
               flags_len_3 = len(bin_flags_3)

               bin_flags_2 = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 3].flags,"big"))
               flags_len_2 = len(bin_flags_2)

               bin_flags_1 = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 4].flags,"big"))
               flags_len_1 = len(bin_flags_1)
              
               if(flags_len_4 > 6 and int(bin_flags_4[flags_len_4-5]) == 1): #-1 ack
                  if(flags_len_3 > 3 and int(bin_flags_3[flags_len_3-1]) == 1): #-2fin
                     if(flags_len_2 > 6 and int(bin_flags_2[flags_len_2-5]) == 1): # -3ack
                        if(flags_len_1 > 3 and int(bin_flags_1[flags_len_1-1]) == 1): # -4fin  
                           cor_sent = True
                           cor_recive = True
                        elif (flags_len_2 > 3 and int(bin_flags_2[flags_len_2-1]) == 1): # -3fin
                           cor_sent = True
                           cor_recive = True
                  elif (flags_len_3 > 4 and int(bin_flags_3[flags_len_3-5]) == 1):# -2ack
                     if(flags_len_2 > 3 and int(bin_flags_2[flags_len_2-1]) == 1): # -3fin
                        if(flags_len_1 > 3 and int(bin_flags_1[flags_len_1-1]) == 1): # -4fin  
                           cor_sent = True
                           cor_recive = True
               #koniec R
               if(cor_recive == False or cor_sent == False):
                  bin_flags = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 1].flags,"big"))
                  flags_len = len(bin_flags_1)
                  if(flags_len > 4 and int(bin_flags[flags_len-3]) == 1):
                           cor_recive = True
                           cor_sent = True
                  else:
                     bin_flags = bin(int.from_bytes(help_kom_list[len(help_kom_list) - 2].flags,"big"))
                     flags_len = len(bin_flags_1)
                     if(flags_len > 4 and int(bin_flags[flags_len-3]) == 1):
                           cor_recive = True
                           cor_sent = True          
               #print(cor_sent,cor_recive)
               if(dobra_komunikacia == False and cor_sent == True and cor_recive == True):
                  dobra_komunikacia = True
                  print("Ukoncena komunikacia ", i)
                  print(len(help_kom_list))
                  Print_4a(help_kom_list)
               if(zla_komunikacia == False and (cor_sent == False or cor_recive == False)):
                  zla_komunikacia = True
                  print("Neukoncena komunikacia ", i)
                  print(len(help_kom_list))
                  Print_4a(help_kom_list)

         i = i + 1
      for x in range(len(print_list)):
         print_list[x].use = 0 
def Uloha_4_b(): # Uloha 4g
   
   if(len(TFTP_list) == 0):
      print("Ziadne TFTP ramec")
      return
   i = 1

   for m in range(len(TFTP_list)):   

      if(TFTP_list[m].use == 0):

         TFTP_number = TFTP_list[m].cislo 
         TFTP_kom_list = []
         TFTP_kom_list.append(TFTP_list[m])
         TFTP_list[m].use = 1

         help_ipS = TFTP_list[m].IPv4_ip_source
         help_ipD = TFTP_list[m].IPv4_ip_destination
         help_port = int.from_bytes(TFTP_list[m].source_port,"big")
         for x in range(TFTP_number,len(RamecPocet)):
            if( RamecPocet[x].use == 0 and RamecPocet[x].druha_uroven == "IPv4" and ( (help_ipS == RamecPocet[x].IPv4_ip_source  and help_ipD == RamecPocet[x].IPv4_ip_destination ) 
                  or(help_ipS == RamecPocet[x].IPv4_ip_destination  and help_ipD == RamecPocet[x].IPv4_ip_source))):
               if RamecPocet[x].sdp == 0:
                  RamecPocet[x].S_D_ports()
               if((help_port == int.from_bytes(RamecPocet[x].destination_port,"big") or help_port == int.from_bytes(RamecPocet[x].source_port,"big"))     ):  
                  RamecPocet[x].use = 1
                  TFTP_kom_list.append(RamecPocet[x])

         #print
         print("zaciatok komunikacie")
         if(len(TFTP_kom_list) > 20):
            for k in range(10):
               TFTP_kom_list[k].Print_RDP()
               TFTP_kom_list[k].Print_MAC_ADDRESS()
               print("\n",TFTP_kom_list[k].prva_uroven)
               print(TFTP_kom_list[k].druha_uroven)
               TFTP_kom_list[k].Print_IPv4()
               print(TFTP_kom_list[k].stvrta_uroven)
               print("port: ",int.from_bytes(TFTP_kom_list[k].source_port,"big"))
               print("port: ",int.from_bytes(TFTP_kom_list[k].destination_port,"big"))
               TFTP_kom_list[k].Print_Hex_Ramec()
               print("\n")
            for k in range(len(TFTP_kom_list) - 10, len(TFTP_kom_list)):
               TFTP_kom_list[k].Print_RDP()
               TFTP_kom_list[k].Print_MAC_ADDRESS()
               print("\n",TFTP_kom_list[k].prva_uroven)
               print(TFTP_kom_list[k].druha_uroven)
               TFTP_kom_list[k].Print_IPv4()
               print(TFTP_kom_list[k].stvrta_uroven)
               print("port: ",int.from_bytes(TFTP_kom_list[k].source_port,"big"))
               print("port: ",int.from_bytes(TFTP_kom_list[k].destination_port,"big"))
               TFTP_kom_list[k].Print_Hex_Ramec()
               print("\n")
         else:    
            for k in range(len(TFTP_kom_list)):
               TFTP_kom_list[k].Print_RDP()
               TFTP_kom_list[k].Print_MAC_ADDRESS()
               print("\n",TFTP_kom_list[k].prva_uroven)
               print(TFTP_kom_list[k].druha_uroven)
               TFTP_kom_list[k].Print_IPv4()
               print(TFTP_kom_list[k].stvrta_uroven)
               print("port: ",int.from_bytes(TFTP_kom_list[k].source_port,"big"))
               print("port: ",int.from_bytes(TFTP_kom_list[k].destination_port,"big"))
               TFTP_kom_list[k].Print_Hex_Ramec()
               print("\n")
   for x in range(len(RamecPocet)):
      RamecPocet[x].use = 0                   
def Uloha_4_c(): # Uloha 4h
   i = 1
   zoznam = []
   
   for y in range(len(ICMP_list)):
      if ICMP_list[y].use == 0:
         ICMP_list[y].use = 1    
         zoznam.append(ICMP_list[y])
         help_ip_sour = ICMP_list[y].IPv4_ip_source
         help_ip_des = ICMP_list[y].IPv4_ip_destination
         for x in range(y+1,len(ICMP_list)):
            if(   (help_ip_sour == ICMP_list[x].IPv4_ip_source and help_ip_des == ICMP_list[x].IPv4_ip_destination) or  (help_ip_sour == ICMP_list[x].IPv4_ip_destination and help_ip_des == ICMP_list[x].IPv4_ip_source)):
               ICMP_list[x].use = 1
               zoznam.append(ICMP_list[x])
         print("Komunikacia: ", i)
         i = i + 1
         for x in range(len(zoznam)):
            zoznam[x].Print_RDP()
            zoznam[x].Print_MAC_ADDRESS()
            zoznam[x].Print_urovne()
            zoznam[x].Print_IPv4()
            print("typ ICMP správy: ",zoznam[x].ICMP_type_name)
            zoznam[x].Print_Hex_Ramec()
   for x in range(len(ICMP_list)):
      ICMP_list[x].use = 0
def Uloha_4_d(): # Uloha 4i
   pocet = 1
   
   if(len(ARP_list) == 0):
      print("Ziadne ARP ramce")
      return

   for x in range(len(ARP_list)):
      ARP_ramce = []
      if(ARP_list[x].use == 0 and ARP_list[x].OP_code_name == "Request"):
         ARP_list[x].use = 1
         ARP_ramce.append(ARP_list[x])
         number_of_requests = 1
         request = False
         for y in range(x+1,len(ARP_list)):
            if(ARP_list[y].use == 0 
            and ( (ARP_list[x].IP_sour == ARP_list[y].IP_sour and ARP_list[x].IP_des == ARP_list[y].IP_des and ARP_list[x].Zdroj_Mac == ARP_list[y].Zdroj_Mac and ARP_list[x].Ciel_Mac == ARP_list[y].Ciel_Mac) 
            or ARP_list[x].IP_sour == ARP_list[y].IP_des and ARP_list[x].IP_des == ARP_list[y].IP_sour)):

               if(ARP_list[y].OP_code_name == "Request"):
                  number_of_requests = number_of_requests + 1
                  ARP_ramce.append(ARP_list[y])
                  ARP_list[y].use = 1
               elif  (ARP_list[y].OP_code_name == "Reply" and number_of_requests > 0):
                  number_of_requests = number_of_requests - 1
                  request = True
                  ARP_ramce.append(ARP_list[y])
                  ARP_list[y].use = 1
                  break
      if len(ARP_ramce) == 1 or request == False:
         for x in range(len(ARP_ramce)):
            ARP_ramce[x].use = 0            
      elif(len(ARP_ramce) > 0):
         print("Komunikacia ",pocet)
         pocet = pocet + 1
         for i in range(len(ARP_ramce)): 
            ARP_ramce[i].Print_RDP()
            print(ARP_ramce[i].OP_code_name)
            if(ARP_ramce[i].OP_code_name == "Reply"):
               print("MAC  adresa: ",end="" )
               for g in range(len(ARP_ramce[i].Ciel_Mac)):
                  print(ARP_ramce[i].Ciel_Mac[g],end= "")
                  if(g % 2 != 0):
                     print(" ",end="")
               print("")
            for k in range(len(ARP_ramce[i].IP_sour)):
               print(ARP_list[i].IP_sour[k],end="")
            print("")
            for k in range(len(ARP_list[i].IP_sour)):
               print(ARP_ramce[i].IP_des[k],end="")
            print("")
            ARP_ramce[i].Print_MAC_ADDRESS()
            ARP_ramce[i].Print_urovne()
            ARP_ramce[i].Print_Hex_Ramec()  
   for i in range(len(ARP_list)): 
      if(ARP_list[i].use == 0):
         print("nedokoncena komunikacia")
         ARP_list[i].Print_RDP()
         print(ARP_list[i].OP_code_name)
         for k in range(len(ARP_list[i].IP_sour)):
            print(ARP_list[i].IP_sour[k],end="")
         print("")
         for k in range(len(ARP_list[i].IP_sour)):
            print(ARP_list[i].IP_des[k],end="")
         print("")
         ARP_list[i].Print_MAC_ADDRESS()
         ARP_list[i].Print_urovne()
         ARP_list[i].Print_Hex_Ramec() 
   for x in range(len(ARP_list)):
      ARP_list[x].use = 0
def load_list():
   protocol_file = open("protokols.txt", "r")
   print("otvorenie txt")

   line = protocol_file.readline()
   line = line.strip(line[-1])

   if(line == "#ethertypes"): #nacitavanie zo suboru
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#IEEEs"): #ethertypes   
         
         line = line.split("\t")
         ethertype_number.append(line[0])
         ethertype_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#LSAPs"): #IEEE
         
         line = line.split("\t")
         IEEE_number.append(line[0])
         IEEE_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#ARPs"): #LSAP  
         
         line = line.split("\t")
         LSAPs_number.append(line[0])
         LSAPs_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#IPv4s"): #ARP  
         
         line = line.split("\t")
         ARP_op_number.append(line[0])
         ARP_op_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#ICMPs"): #IPv4   
         
         line = line.split("\t")
         IPv4_number.append(line[0])
         IPv4_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#TCPs"): #ICMP  
         
         line = line.split("\t")
         ICMP_number.append(line[0])
         ICMP_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#UDPs"): #TCP
         
         line = line.split("\t")
         TCP_port_number.append(line[0])
         TCP_port_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])
      line = protocol_file.readline()
      line = line.strip(line[-1])
      while(line != "#END"): #UDP 
         
         line = line.split("\t")
         UDP_port_number.append(line[0])
         UDP_port_name.append(line[1])
         line = protocol_file.readline()
         line = line.strip(line[-1])    
      protocol_file.close()
      for x in range(len(ethertype_number)) :
         ethertype_number[x] = int(ethertype_number[x],base=16)
      for x in range(len(IEEE_number)):
         IEEE_number[x] = int(IEEE_number[x],base=16)
      for x in range(len(LSAPs_number)):
         LSAPs_number[x] = int(LSAPs_number[x],base=16)
      for x in range(len(ARP_op_number)):
         ARP_op_number[x] = int(ARP_op_number[x],base=16)
      for x in range(len(IPv4_number)):
         IPv4_number[x] = int(IPv4_number[x],base=16)
      for x in range(len(ICMP_number)):
         ICMP_number[x] = int(ICMP_number[x],base=16)
      for x in range(len(TCP_port_number)):    
         TCP_port_number[x] = int(TCP_port_number[x],base=16)
      for x in range(len(UDP_port_number)):
         UDP_port_number[x] = int(UDP_port_number[x],base=16)


#definovanie poli
ethertype_number = [] 
ethertype_name = []
IEEE_number = []
IEEE_name = []

LSAPs_name = []
LSAPs_number = []

IPv4_number = []
IPv4_name = []
ICMP_number = []
ICMP_name = []

TCP_port_number = []
TCP_port_name = []
UDP_port_number = []
UDP_port_name = []
ARP_op_number = []
ARP_op_name = []

RamecPocet = []
IPv4_stats_g = []

#Uloha 4 TCP
HTTP_list = []
HTTPS_list = []
TELNET_list = []
SSH_list = []
FTP_R_list = []
FTP_D_list = []
#Uloha 4 UDP
TFTP_list = []
ICMP_list = []
#Uloha 4 ARP
ARP_list = []

load_list()   #nacitanie protokolov do zoznamov
fff = "eth-8.pcap"
pcap = scapy.rdpcap(fff) #otvorenie suboru
print("file: ",fff)
i = 1


for pkt in pcap:
      
   ramec = scapy.raw(pkt)
   RamecPocet.append(RamecINF(i,ramec,len(ramec)))
   
   RamecPocet[i-1].Dlzka()        #dlžka rámca
   RamecPocet[i-1].MAC_address()  #Zdrojová a cielova adresa
   
   #Ethernet type
   typ = bytearray()
   typ.append(ramec[12])
   typ.append(ramec[13])
   typ_int = int.from_bytes(typ,"big")
   
   #Druh ethernetII
   if(typ_int >= 1536):
      RamecPocet[i-1].ethernetII_set()
      ETHERTYPE(typ_int,i)
   else:
      RamecPocet[i-1].IEEE_set()
      IEEE_TYPE(typ_int) 

   # Rozdelovanie ramcov do zoznamov podla kategorii
   if(RamecPocet[i-1].stvrta_uroven == "HTTP"):
      HTTP_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "HTTPS"):
      HTTPS_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "SSH"):
      SSH_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "TELNET"):
      TELNET_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "FTP-DATA"):
      FTP_D_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "FTP-CONTROL"):
      FTP_R_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].stvrta_uroven == "TFTP"):
      TFTP_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].tretia_uroven == "ICMP"):
      RamecPocet[i-1].ICMP_set()
      ICMP_list.append(RamecPocet[i-1])
   if(RamecPocet[i-1].druha_uroven == "ARP"):
      ARP_list.append(RamecPocet[i-1])

   i = i + 1
print("ready to go\n")
#path = 'file.txt'
#sys.stdout = open(path,'w')

s = input() #menu
while (s != 'K'):
   if(s == 'a'):
      Uloha_1_2()
   elif(s == 'b'):   
      Uloha_4_a(HTTP_list,"HTTP")
   elif(s == 'c'):   
      Uloha_4_a(HTTPS_list,"HTTPS")
   elif(s == 'd'):   
      Uloha_4_a(SSH_list,"SSH")
   elif(s == 'e'):   
      Uloha_4_a(TELNET_list,"TELNET")
   elif(s == 'f'):   
      Uloha_4_a(FTP_D_list,"FTP-DATA")
   elif(s == 'g'):   
      Uloha_4_a(FTP_R_list,"FTP-CONTROL")
   elif(s == 'h'):   #TFTP 
      Uloha_4_b()
   elif(s == 'i'):   #ICMP
      Uloha_4_c()
   elif(s == 'j'): #arp  
      Uloha_4_d()
      
   s = input()