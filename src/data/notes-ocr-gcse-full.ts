// OCR GCSE J277 — Comprehensive notes, spec-point level
// All 11 topics, textbook depth
import type { ALevelBoard } from './notes-alevel';

const t = (h: string, b: string) => ({ type:'text' as const, heading:h, body:b });
const kt = (term: string, def: string) => ({ type:'keyterm' as const, term, def });
const w = (label: string, code: string) => ({ type:'worked' as const, label, code });
const tip = (text: string) => ({ type:'tip' as const, text });
const err = (text: string) => ({ type:'mistake' as const, text });
const tbl = (headers: string[], rows: string[][]) => ({ type:'table' as const, headers, rows });

export const OCR_GCSE_FULL: ALevelBoard = {
  id: 'ocr-gcse', name: 'OCR GCSE (J277)',
  topics: [

// ══════════════════════════════════════════════════════════════
// 1.1 SYSTEMS ARCHITECTURE
// ══════════════════════════════════════════════════════════════
{ id:'og-1', number:'1.1', name:'Systems Architecture', specPoints: [

  { id:'1.1.1', title:'CPU Components',
    examTip:'Three components always: ALU, Control Unit, Registers. Each carries 2 marks — name + purpose.',
    sections: [
      t('The Central Processing Unit','The CPU is the component that carries out program instructions. It has three main parts working together continuously. Without the CPU, no computation is possible — every program, every game, every website you use runs as instructions executing inside a CPU.'),
      kt('ALU — Arithmetic Logic Unit','Performs ALL arithmetic calculations (addition, subtraction, multiplication, division) and ALL logical comparisons (AND, OR, NOT, greater than, equal to). The ALU is where the actual computation happens.'),
      kt('Control Unit (CU)','Co-ordinates every other component. Fetches instructions from memory, decodes what they mean, and tells the ALU and other parts what to do. Acts as the "director" of the CPU.'),
      kt('Registers','Tiny, ultra-fast storage locations INSIDE the CPU. Much faster than RAM. Hold data that is currently being processed. Key registers: PC, MAR, MDR, ACC, CIR.'),
      tbl(['Register','Full name','What it holds'],
        [['PC','Program Counter','Address of the NEXT instruction to fetch. Auto-increments after each fetch.'],
         ['MAR','Memory Address Register','Address of memory location currently being read or written.'],
         ['MDR','Memory Data Register','Data just fetched from memory, or data about to be written to memory.'],
         ['ACC','Accumulator','Result of the most recent ALU calculation.'],
         ['CIR','Current Instruction Register','The instruction currently being decoded and executed.']]),
      tip('"Describe the role of the ALU": "The ALU performs all arithmetic calculations such as addition and subtraction, and all logical comparisons such as AND, OR and NOT. It is the part of the CPU where actual calculations take place."'),
      err('Do not say "the CPU stores data" — it processes data. Data is stored in RAM or secondary storage. The CPU only holds a tiny amount of data in its registers during processing.'),
    ]
  },

  { id:'1.1.2', title:'The Fetch-Decode-Execute Cycle',
    examTip:'Know the REGISTERS used at each stage — PC, MAR, MDR, CIR. Most 4-mark FDE questions want register names.',
    sections: [
      t('The FDE Cycle','Every single instruction in every program is processed through this three-stage cycle, repeating billions of times per second. Understanding this is fundamental to understanding how computers work.'),
      tbl(['Stage','What happens','Registers involved'],
        [['FETCH','The address in the PC is copied to the MAR. The instruction at that memory address is read into the MDR, then copied into the CIR. The PC is incremented to point to the next instruction.','PC, MAR, MDR, CIR'],
         ['DECODE','The Control Unit reads the instruction in the CIR and works out what operation is needed and what data it uses.','CIR, CU'],
         ['EXECUTE','The ALU performs the required operation (e.g. addition). The result goes into the ACC. If it is a branch/jump instruction, the PC is updated.','ALU, ACC, MDR']]),
      w('FDE Cycle Step-by-Step Walk-Through','Suppose the next instruction is stored at memory address 0x0008:\n\nFETCH:\n  1. PC contains 0x0008 (address of next instruction)\n  2. PC → MAR  (MAR now holds 0x0008)\n  3. Memory at address 0x0008 is read → MDR\n  4. MDR → CIR  (instruction copied to CIR)\n  5. PC = PC + 1  (now 0x0009, pointing to next instruction)\n\nDECODE:\n  6. Control Unit reads CIR\n  7. Identifies instruction as "ADD 5" (add 5 to accumulator)\n\nEXECUTE:\n  8. ALU: ACC = ACC + 5\n  9. Result stored in ACC\n\nCycle restarts — fetch instruction at 0x0009'),
      tip('The most commonly examined register is the PC (Program Counter). Know that it holds the address of the NEXT instruction — not the current one — and that it auto-increments after each fetch.'),
      err('A very common mistake: saying the PC "stores the current instruction". The PC stores the ADDRESS of the NEXT instruction. The CIR holds the current instruction being executed.'),
    ]
  },

  { id:'1.1.3', title:'CPU Performance Factors',
    sections: [
      t('Three Key Performance Factors','Three factors directly affect how fast a CPU can process instructions. Understanding why each one matters — not just naming them — is essential for exam questions.'),
      tbl(['Factor','What it means','Effect on performance'],
        [['Clock speed (GHz)','Number of clock cycles per second. Each cycle, the CPU can perform part of an instruction.','Higher clock speed → more instructions per second. BUT heat generation and power consumption increase.'],
         ['Number of cores','Each core is an independent processor on the same chip. Multiple cores can process different instructions simultaneously.','More cores → genuine parallel processing. BUT software must be written to use multiple cores. A quad-core is NOT automatically 4x faster.'],
         ['Cache size','Tiny, ultra-fast memory built into (or very close to) the CPU. Stores recently-used data. CPU checks cache before accessing slower RAM.','Larger cache → fewer slow RAM accesses. L1 cache is fastest and smallest (~32 KB). L3 is largest and slowest but still faster than RAM.']]),
      w('Three-Mark Answer: "State three factors that affect CPU performance"','1. Clock speed — a higher clock speed means the CPU performs more cycles per second,\n   so it can execute more instructions per second.\n\n2. Number of cores — multiple cores allow genuine parallel processing of\n   independent tasks or program threads simultaneously.\n\n3. Cache size — a larger cache means the CPU is more likely to find\n   recently-used data in fast cache rather than accessing slower RAM.'),
      kt('Embedded system','A computer built into a specific device to perform one dedicated function. Runs fixed software stored in ROM. Typically has no keyboard or screen. Examples: washing machine controller, pacemaker, car ABS brakes, microwave, traffic lights, smart thermostat.'),
      tip('"Give one difference between a general-purpose computer and an embedded system." Answer: "A general-purpose computer can run many different programs, whereas an embedded system runs a single fixed program permanently stored in ROM and is dedicated to one specific task."'),
    ]
  },

]}, // end 1.1


// ══════════════════════════════════════════════════════════════
// 1.2 MEMORY AND STORAGE
// ══════════════════════════════════════════════════════════════
{ id:'og-2', number:'1.2', name:'Memory & Storage', specPoints: [

  { id:'1.2.1', title:'Primary Storage: RAM, ROM and Cache',
    sections: [
      t('Primary vs Secondary Storage','Primary storage is directly accessible by the CPU — it holds programs and data currently in use. It is fast but limited in size. Secondary storage (HDD, SSD, USB) holds data permanently but is slower.'),
      tbl(['Type','Volatile?','Speed','Read/Write?','Used for'],
        [['RAM','YES — lost when off','Fast','Read and Write','Currently running programs and open files'],
         ['ROM','NO — permanent','Fast','Read only','BIOS/firmware — startup instructions'],
         ['Cache','YES','Very fast','Read and Write','Recently-used CPU data (between CPU and RAM)'],
         ['Virtual memory','NO (on HDD/SSD)','Very slow','Read and Write','Overflow when RAM is full']]),
      kt('RAM — Random Access Memory','Volatile primary storage. Holds the operating system, currently running applications, and data being worked on. More RAM = more programs can run simultaneously without the computer slowing down. Data is lost when power is removed.'),
      kt('ROM — Read-Only Memory','Non-volatile primary storage. Contains the BIOS/firmware — the startup instructions that run before the operating system loads. Cannot be modified under normal circumstances. Data is retained without power.'),
      kt('Cache memory','Ultra-fast memory between the CPU and RAM. The CPU checks L1 cache first, then L2, then L3, then RAM. A "cache hit" means data is found quickly in cache; a "cache miss" means the CPU must wait for data from slower RAM. Larger cache = higher hit rate = better performance.'),
      tip('"Explain why cache memory improves CPU performance." Answer: "Cache memory stores recently or frequently used data very close to the CPU. When the CPU needs data, it checks the cache first. If found (a cache hit), data is returned much faster than if the CPU had to access slower RAM, reducing the time the CPU spends waiting."'),
      err('RAM and SSD both use electronic storage but are NOT the same. RAM is volatile (temporary) and very fast. SSD is non-volatile (permanent) and slower than RAM. They serve completely different roles.'),
    ]
  },

  { id:'1.2.2', title:'Virtual Memory and Storage Calculations',
    sections: [
      kt('Virtual memory','When RAM is full, the OS moves unused data temporarily to a section of the hard disk/SSD called the "swap file" or "page file". This prevents crashes but is MUCH slower than real RAM, causing noticeable slowdowns.'),
      t('Why Virtual Memory is Slow','Accessing RAM takes nanoseconds (~10 ns). Accessing an HDD takes milliseconds (~10 ms). An SSD is faster but still ~50-100 μs. Virtual memory on an HDD is up to 1 million times slower than RAM access. When virtual memory is heavily used, the computer "thrashes" — becomes very slow.'),
      tbl(['Storage unit','Exact value','Approximate'],
        [['Kilobyte (KB)','1,024 bytes','~1,000 bytes'],
         ['Megabyte (MB)','1,048,576 bytes','~1,000 KB'],
         ['Gigabyte (GB)','1,073,741,824 bytes','~1,000 MB'],
         ['Terabyte (TB)','1,099,511,627,776 bytes','~1,000 GB']]),
      w('File Size Calculations','Image file size formula:\n  Size (bits) = width × height × colour depth\n\nExample: 800×600 image, 24-bit colour:\n  Pixels = 800 × 600 = 480,000\n  Bits   = 480,000 × 24 = 11,520,000 bits\n  Bytes  = 11,520,000 ÷ 8 = 1,440,000 bytes\n  MB     = 1,440,000 ÷ 1,048,576 ≈ 1.37 MB\n\nSound file size formula:\n  Size (bits) = sample rate × bit depth × duration × channels\n\nExample: 44,100 Hz, 16-bit, stereo, 60 seconds:\n  = 44,100 × 16 × 60 × 2 = 84,672,000 bits\n  = 84,672,000 ÷ 8 = 10,584,000 bytes ≈ 10.1 MB'),
      tip('"Explain why a computer might slow down when running many programs." Answer: "When all RAM is in use, the operating system uses virtual memory — moving some data to the hard disk. Accessing data from the hard disk (virtual memory) is much slower than accessing RAM, so the computer noticeably slows down."'),
    ]
  },

  { id:'1.2.3', title:'Secondary Storage Types',
    sections: [
      tbl(['Type','Technology','Speed','Capacity','Cost/GB','Fragile?','Use cases'],
        [['HDD (Hard Disk Drive)','Magnetic spinning disk','Slow','1–20+ TB','Very cheap','Yes — moving parts','Desktop/server storage, backups'],
         ['SSD (Solid State Drive)','Flash memory chips','Fast','128 GB–4 TB','More expensive','No','OS drive, gaming, laptops'],
         ['Optical (CD/DVD/Blu-ray)','Laser reads/writes pits','Slow','700 MB–100 GB','Very cheap','Scratches','Distributing media, archiving'],
         ['USB Flash / Memory card','Flash memory','Medium','8 GB–2 TB','Cheap','No','Portable file transfer, cameras']]),
      t('Choosing the Right Storage','When evaluating storage for a scenario, consider: capacity needed, speed required, portability, reliability, cost, and physical durability. There is rarely one "correct" answer — the best choice depends on the specific use case.'),
      w('Exam Scenario Questions','Scenario: A photographer needs to transfer photos between studio computers\nBest: USB flash drive — portable, fast enough, large enough capacity\n\nScenario: A hospital storing millions of patient records (no portability needed)\nBest: HDD — very large capacity, cheap per GB, reliable in fixed installation\n\nScenario: A laptop used for video editing\nBest: SSD — fast access times, physically robust (no moving parts = handles movement), lighter weight\n\nScenario: Software company distributing games to shops\nBest: Optical (Blu-ray) — cheap per unit, read-only prevents tampering, widely compatible'),
      tip('Always justify your storage choice with the specific reason why that type suits the scenario. "USB flash drive because it is portable" scores more than just "USB flash drive".'),
      err('Do NOT say SSD is a type of RAM. Both use flash memory but SSD is non-volatile secondary storage. RAM is volatile primary storage. They are completely different components serving different purposes.'),
    ]
  },

]}, // end 1.2


// ══════════════════════════════════════════════════════════════
// 1.3 COMPUTER NETWORKS, CONNECTIONS AND PROTOCOLS
// ══════════════════════════════════════════════════════════════
{ id:'og-3', number:'1.3', name:'Computer Networks, Connections & Protocols', specPoints: [

  { id:'1.3.1', title:'Network Types: PAN, LAN and WAN',
    sections: [
      tbl(['Type','Coverage area','Ownership','Speed','Example'],
        [['PAN (Personal Area Network)','Very small — personal space (~10 m)','Individual','Moderate','Bluetooth devices: phone + headphones, smartwatch + phone'],
         ['LAN (Local Area Network)','Building or campus','One organisation','Very fast (100 Mbps–10 Gbps)','School network, home network, office network'],
         ['WAN (Wide Area Network)','Cities, countries, globally','Telecoms companies / shared','Slower (varies)','The internet; a bank\'s network connecting branches']]),
      t('Benefits of Networking','Connecting devices to a network allows: sharing of resources (printers, internet connection, files); centralised data storage (easier backup, accessible from any device); communication (email, video calls, messaging); centralised software management (install/update once for all users).'),
      tip('"State two advantages of networking computers in a school." Good answers include: (1) Files saved centrally are accessible from any computer in the school. (2) Printers can be shared across the network, reducing the number needed. (3) Software can be installed and updated centrally on the server, affecting all machines.'),
    ]
  },

  { id:'1.3.2', title:'Network Topologies',
    sections: [
      t('What is a Network Topology?','A topology describes how devices (nodes) are physically or logically connected in a network. The choice of topology affects cost, reliability and performance.'),
      tbl(['Topology','Description','Advantages','Disadvantages'],
        [['Star','All devices connect to a central switch/hub','Fast; one cable failure only affects one device; easy to identify and isolate faults; easy to add new devices','If central switch fails, entire network fails; more cable required than bus'],
         ['Bus','All devices share one central cable (backbone)','Simple; cheap; easy to extend by adding to the cable','One cable break brings down the entire network; data collisions as all share the cable; slow under heavy traffic'],
         ['Mesh (full)','Every device directly connected to every other','Very resilient — multiple paths exist; no single point of failure','Very expensive (many cables); complex to set up and manage'],
         ['Ring','Devices in a circle; data travels in one direction','Predictable performance; no collisions; all devices have equal access','One break brings down the entire network; difficult to add new devices']]),
      tip('"Give one advantage of a star topology over a bus topology." Answer: "In a star topology, if one cable fails, only the device connected by that cable is affected, whereas in a bus topology a single cable fault brings down the entire network."'),
      err('Do not confuse the physical topology (how cables are actually laid) with the logical topology (how data flows). A modern Ethernet network uses a star physical topology with a switch at the centre, even if it uses a logical bus protocol underneath.'),
    ]
  },

  { id:'1.3.3', title:'Network Hardware',
    sections: [
      tbl(['Device','Function','Layer','Uses addresses'],
        [['NIC (Network Interface Card)','Hardware in every networked device; enables connection to network; has a unique MAC address','Link (Data Link)','MAC address'],
         ['Switch','Connects devices within a LAN; sends data ONLY to intended recipient using MAC address table; much more efficient than a hub','Link (Data Link)','MAC address'],
         ['Router','Connects different networks together; routes packets between networks using IP addresses; your home router connects LAN to internet (WAN)','Network','IP address'],
         ['Wireless Access Point (WAP)','Allows wireless devices to connect to a wired network; acts as a bridge between Wi-Fi and Ethernet','Link','MAC address'],
         ['Hub (obsolete)','Sends all data to ALL devices; inefficient; causes collisions; replaced by switches','Link','None']]),
      t('Switch vs Router: The Key Distinction','A switch works WITHIN a network (LAN), sending data between devices on the same network using MAC addresses. A router connects DIFFERENT networks together, routing data between them using IP addresses. Your home Wi-Fi router does both: it acts as a switch for your LAN and routes traffic to/from the internet.'),
      w('Scenario: Home Network Explanation','Your home network:\n  Devices (phone, laptop, TV) → connect to Router via Wi-Fi\n  Router → routes all internet traffic to/from your ISP\n  ISP → connects you to the wider internet (a WAN)\n\nWhen you visit compscitutoring.com:\n  1. Your device sends a request to the router\n  2. Router routes the request out to the internet\n  3. The request reaches Vercel\'s servers\n  4. Vercel sends the webpage back via the router\n  5. Router forwards it to your device'),
      tip('"Describe the role of a router." Answer: "A router connects different networks together and routes data packets between them. It reads the destination IP address in each packet and decides the best path to forward it to, whether to a device on the local network or to another router on the way to the destination."'),
    ]
  },

  { id:'1.3.4', title:'Client-Server and Peer-to-Peer Networks',
    sections: [
      tbl(['Feature','Client-Server','Peer-to-Peer (P2P)'],
        [['Central server?','Yes — dedicated server provides services','No — all devices are equal (peers)'],
         ['Control','Centralised — administrator manages everything','Decentralised — each device manages itself'],
         ['Security','Better — centralised control of access','Weaker — each device responsible for own security'],
         ['Cost','High — requires expensive server hardware','Low — uses existing devices'],
         ['Reliability','Single server failure can affect all users','No single point of failure'],
         ['Management','Easy — change settings once on server','Hard — must update each device separately'],
         ['Best for','Schools, businesses, large organisations','Small home networks, file sharing (BitTorrent)']]),
      tip('"Give two advantages of a client-server network over a peer-to-peer network." Answer: "(1) In a client-server network, all data is stored centrally on the server, making backup easier and data accessible from any client device. (2) Security is better as the administrator controls access permissions centrally, rather than each device managing its own security."'),
    ]
  },

  { id:'1.3.5', title:'The Internet and the World Wide Web',
    sections: [
      kt('The Internet','The global physical network of networks — the infrastructure of cables, routers and servers connecting billions of devices worldwide. It is NOT the same as the World Wide Web.'),
      kt('The World Wide Web (WWW)','A SERVICE that runs on top of the internet. The collection of websites and web pages that can be accessed via HTTP/HTTPS. Just one of many internet services.'),
      t('Other Internet Services (not the WWW)','Email (uses SMTP, IMAP, POP3), file transfer (FTP), video streaming, online gaming, and VoIP (voice calls over internet) all use the internet but are NOT the World Wide Web. The web is only the HTTP-based service of web pages.'),
      kt('DNS — Domain Name System','A distributed database that translates human-readable domain names (like compscitutoring.com) into numerical IP addresses (like 76.76.21.21) that computers use to route data. Without DNS, you would need to memorise IP addresses for every website.'),
      w('What Happens When You Type a URL','1. Your browser sends a DNS query: "What IP address is compscitutoring.com?"\n2. A DNS server looks up the domain and responds: "76.76.21.21"\n3. Your browser sends an HTTP/S GET request to 76.76.21.21\n4. The web server receives and processes the request\n5. The server sends back the HTML, CSS and JavaScript as packets\n6. Your browser receives the packets, reassembles them, and displays the page'),
      tip('The most common exam mistake: confusing the Internet and the WWW. The internet is the physical infrastructure. The WWW is a service using that infrastructure. "The internet is the network of networks; the World Wide Web is the collection of web pages accessed via that network using HTTP."'),
    ]
  },

  { id:'1.3.6', title:'Protocols and the TCP/IP Model',
    sections: [
      kt('Protocol','A set of agreed rules that defines how devices communicate. Without protocols, devices from different manufacturers could not exchange data. Protocols define: format of data, speed of transmission, error checking, and how connections are established and ended.'),
      tbl(['Layer','Role','Key Protocols'],
        [['Application','User-facing services and communication','HTTP, HTTPS, FTP, SMTP, IMAP, POP3, DNS'],
         ['Transport','End-to-end data delivery; error checking; port numbers','TCP (reliable), UDP (fast)'],
         ['Internet','Logical addressing and routing between networks','IPv4, IPv6'],
         ['Link (Network Access)','Physical transmission on local network','Ethernet, Wi-Fi (802.11)']]),
      tbl(['Protocol','Full name','Purpose'],
        [['HTTP','HyperText Transfer Protocol','Transfer web pages between server and browser'],
         ['HTTPS','HTTP Secure','HTTP with TLS encryption — secure web browsing'],
         ['FTP','File Transfer Protocol','Upload and download files between systems'],
         ['SMTP','Simple Mail Transfer Protocol','Sending email from client to mail server'],
         ['IMAP','Internet Message Access Protocol','Accessing email stored on a mail server (server-based)'],
         ['POP3','Post Office Protocol v3','Downloading email from server to local device'],
         ['TCP','Transmission Control Protocol','Reliable, ordered, error-checked delivery (slower)'],
         ['UDP','User Datagram Protocol','Fast, connectionless delivery — no guarantee (faster)']]),
      tip('"State one reason why HTTPS is preferred over HTTP for online banking." Answer: "HTTPS uses TLS encryption to encrypt all data between the browser and the server. This means that if the data is intercepted, it cannot be read by attackers, protecting sensitive information like account details and passwords."'),
    ]
  },

  { id:'1.3.7', title:'Packet Switching and IP Addressing',
    sections: [
      kt('Packet switching','Large data is broken into small packets for transmission. Each packet contains: a header (source IP, destination IP, sequence number, protocol) and the payload (chunk of data). Packets travel independently, possibly by different routes, and are reassembled at the destination using sequence numbers.'),
      t('Advantages of Packet Switching','(1) Efficient use of network links — many packets from different communications share the same physical links. (2) Resilient — if one router fails, packets are rerouted through other paths. (3) Scales well — the internet uses packet switching globally.'),
      kt('IP address','A unique numerical address assigned to every device on a network. Used by routers to route packets to the correct destination. IPv4: four numbers 0-255 separated by dots (e.g. 192.168.1.1) — 32-bit, ~4.3 billion addresses. IPv6: longer hexadecimal format — 128-bit, vastly more addresses.'),
      kt('MAC address','A hardware address burned into the NIC (Network Interface Card) at manufacture. Globally unique (in theory). Used within a LAN by switches to deliver data to the correct device. Cannot be changed (unlike IP addresses). Format: 6 pairs of hex digits (e.g. 00:1A:2B:3C:4D:5E).'),
      tbl(['Feature','MAC address','IP address'],
        [['Layer','Data Link (Layer 2)','Network (Layer 3)'],
         ['Purpose','Identify device within a LAN','Identify device across different networks'],
         ['Used by','Switches','Routers'],
         ['Changeable?','No (hardware-burned)','Yes (assigned by network)'],
         ['Format','6 pairs hex: 00:1A:2B:3C:4D:5E','IPv4: 192.168.1.1']]),
      tip('"Describe the difference between a MAC address and an IP address." Answer: "A MAC address is a hardware address burned into the network card, unique to the device, and used by switches to deliver data within a local network. An IP address is a logical address assigned by the network, used by routers to route packets across different networks and can change."'),
    ]
  },

  { id:'1.3.8', title:'Wired vs Wireless Networks',
    sections: [
      tbl(['Feature','Wired (Ethernet)','Wireless (Wi-Fi)'],
        [['Speed','Very fast (up to 10 Gbps)','Slower (up to ~1 Gbps)'],
         ['Reliability','Very reliable — stable connection','Can drop; affected by interference, walls, distance'],
         ['Security','More secure — physical access required','Less secure — signal can be intercepted'],
         ['Mobility','None — device must be cabled','Full mobility within range'],
         ['Setup cost','Higher — cables needed throughout','Lower — just add access points'],
         ['Best for','Desktops, servers, gaming consoles','Laptops, smartphones, tablets']]),
      tip('"Give one advantage and one disadvantage of using a wireless network." Advantage: "Users can move around freely within the network area without being limited by a physical cable." Disadvantage: "Wireless signals can be intercepted by anyone within range if not properly encrypted, making it less secure than a wired network."'),
    ]
  },

]}, // end 1.3


// ══════════════════════════════════════════════════════════════
// 1.4 NETWORK SECURITY
// ══════════════════════════════════════════════════════════════
{ id:'og-4', number:'1.4', name:'Network Security', specPoints: [

  { id:'1.4.1', title:'Network Threats and Malware',
    sections: [
      t('Why Network Security Matters','Any device on a network is potentially accessible to attackers. Networks carry sensitive data. A breach can result in financial loss, identity theft, reputational damage and disruption of services. Security requires multiple layers of protection.'),
      tbl(['Malware type','How it spreads','Main effect'],
        [['Virus','Attaches to legitimate files; spreads when files are shared','Corrupts or deletes files; damages system'],
         ['Worm','Replicates and spreads automatically across networks — no host file needed','Consumes bandwidth; can carry payloads'],
         ['Trojan Horse','Disguises itself as legitimate software; installed by user','Opens backdoor; steals data; installs other malware'],
         ['Ransomware','Usually delivered via phishing email or drive-by download','Encrypts user\'s files; demands payment for decryption key'],
         ['Spyware','Hidden in free software or via drive-by download','Records keystrokes, passwords, browsing history']]),
      tbl(['Attack type','How it works','Target'],
        [['Phishing','Fake emails appearing to be from trusted sources; links to fake websites that steal credentials','Passwords, financial data'],
         ['Brute force','Systematically trying every possible password combination','Login credentials'],
         ['Denial of Service (DoS)','Flooding a server with requests until it cannot serve legitimate users','Server availability'],
         ['SQL injection','Inserting malicious SQL code into a web form input to manipulate the database','Database contents'],
         ['Man-in-the-middle','Intercepting communication between two parties without their knowledge','Data in transit']]),
      tip('"Describe how ransomware works." Answer: "Ransomware is malware that, once installed on a system (typically via a phishing email), encrypts the user\'s files making them inaccessible. The attacker then demands a ransom payment in exchange for the decryption key. Even paying does not guarantee files will be restored."'),
    ]
  },

  { id:'1.4.2', title:'Identifying Vulnerabilities',
    sections: [
      t('How Networks Become Vulnerable','Networks are vulnerable when: software has unpatched security bugs, users choose weak passwords, staff are not trained to recognise social engineering, devices are not properly secured, data is transmitted without encryption.'),
      kt('Social engineering','Manipulating people rather than hacking systems directly. Relies on human psychology. Examples: phishing (fake emails), vishing (phone calls pretending to be tech support/bank), shouldering (watching someone enter a PIN), blagging (creating a false story to gain trust).'),
      kt('Penetration testing','Ethical hackers (pen testers) are hired to deliberately try to break into a system to find weaknesses before real attackers do. The findings are reported to the organisation so vulnerabilities can be fixed.'),
      t('Common Vulnerabilities','(1) Unpatched software — manufacturers release patches for known security holes; failing to apply them leaves known vulnerabilities open. (2) Weak passwords — easily guessed or brute-forced. (3) Misconfigured firewalls — allowing traffic that should be blocked. (4) Human error — staff clicking phishing links or sharing passwords.'),
    ]
  },

  { id:'1.4.3', title:'Prevention Methods',
    sections: [
      tbl(['Method','How it works','Protects against'],
        [['Firewall','Software or hardware that monitors all network traffic based on rules; blocks unauthorised connections','Unauthorised network access; some malware'],
         ['Strong passwords','Long, complex, unique passwords for each account; use a password manager','Brute force attacks; stolen credential attacks'],
         ['Multi-factor authentication (MFA)','Requires two or more verification steps (password + phone code + fingerprint)','Stolen passwords — attacker needs the second factor too'],
         ['Encryption','Converts data to unreadable ciphertext; only decryptable with the correct key','Interception of data in transit or stolen storage'],
         ['Anti-malware software','Scans files and processes for known malicious patterns; removes threats','Viruses, worms, trojans, ransomware, spyware'],
         ['Software updates and patches','Fix known security vulnerabilities in software','Exploits targeting known weaknesses'],
         ['User education and training','Train staff to recognise phishing, social engineering, safe practices','Social engineering attacks (the human is the weakest link)'],
         ['Access levels (permissions)','Users only have access to the data and systems they need for their role','Insider threats; limiting damage from compromised accounts']]),
      w('Exam Question: "Describe two measures to protect against unauthorised network access"','1. Firewall (1 mark)\n   A firewall monitors all incoming and outgoing network traffic and\n   blocks any connections that do not match its security rules. This\n   prevents unauthorised users from accessing the internal network. (1 mark)\n\n2. Strong passwords with multi-factor authentication (1 mark)\n   Requiring complex unique passwords makes brute-force attacks\n   impractical. Adding MFA means even if a password is stolen, the\n   attacker cannot access the account without the second factor\n   such as a code sent to a phone. (1 mark)'),
      tip('For any "describe how X protects against Y" question: name the measure, explain HOW it works mechanically, then state specifically what threat it prevents. Three components = full marks.'),
    ]
  },

]}, // end 1.4


// ══════════════════════════════════════════════════════════════
// 1.5 SYSTEMS SOFTWARE
// ══════════════════════════════════════════════════════════════
{ id:'og-5', number:'1.5', name:'Systems Software', specPoints: [

  { id:'1.5.1', title:'Operating System Functions',
    examTip:'"State four functions of an operating system" is a common 4-mark question — learn six to be safe.',
    sections: [
      t('What is an Operating System?','An operating system (OS) is system software that acts as an intermediary between users/applications and the hardware. Without an OS, every program would need to control hardware directly in machine code. The OS abstracts the hardware complexity.'),
      tbl(['Function','What the OS does','Example'],
        [['Memory management','Allocates RAM to running programs; manages virtual memory; prevents programs from interfering with each other\'s memory','Chrome gets 2 GB, Word gets 500 MB'],
         ['Process management','Schedules CPU time between running processes using algorithms; enables multitasking','Round-robin: each process gets a time slice'],
         ['File management','Organises files in a hierarchical folder structure; controls read/write/execute permissions','C:\\Users\\Student\\Documents'],
         ['Device management','Communicates with hardware via device drivers; manages input/output operations','Printer driver converts print job to printer commands'],
         ['User interface','Provides GUI (windows, icons, menus, pointer) or CLI (text commands) for user interaction','Windows desktop, Linux terminal'],
         ['Security','Manages user accounts; controls login; enforces file permissions; manages updates','Admin vs standard user accounts']]),
      w('Model 4-Mark Answer: OS Functions','1. Memory management — the OS allocates portions of RAM to each running\n   program, ensuring programs cannot access each other\'s memory space.\n\n2. Process management — the OS uses scheduling algorithms to share CPU\n   time between running processes, creating the appearance of multitasking.\n\n3. File management — the OS organises files in a hierarchical folder\n   structure and controls which users can read, write or execute each file.\n\n4. Device management — the OS communicates with hardware components\n   via device drivers, managing input and output operations.'),
    ]
  },

  { id:'1.5.2', title:'Utility Software and User Interfaces',
    sections: [
      t('Utility Software','Utility programs perform specific maintenance and optimisation tasks to keep the computer running efficiently.'),
      tbl(['Utility','What it does','When to use'],
        [['Anti-malware/Antivirus','Scans for and removes malicious software using signature databases','Continuously (real-time); scheduled weekly scans'],
         ['Disk defragmenter (HDD only)','Reorganises fragmented data on an HDD so files are stored in contiguous sectors — faster access','When HDD performance is degrading (NOT for SSDs)'],
         ['File compression','Reduces file sizes using algorithms for storage or transfer','Before emailing large files; to save storage space'],
         ['Backup software','Creates copies of data to external storage or cloud','Regularly scheduled — protects against data loss'],
         ['Disk cleanup','Removes temporary files, cached data, old downloads to free space','When storage is running low']]),
      tbl(['Interface type','Description','Advantages','Disadvantages'],
        [['GUI (Graphical)','Windows, icons, menus, pointer (WIMP)','Intuitive; no commands to memorise; visual feedback; multi-tasking','Requires more memory; slower for expert users'],
         ['CLI (Command-Line)','User types text commands','Faster for experts; less memory needed; scriptable/automatable; fine control','Steep learning curve; must memorise commands'],
         ['Touch interface','Finger gestures on screen','Natural; no peripherals needed; portable','Limited for complex tasks; screen smudging']]),
      tip('"Explain why defragmentation improves HDD performance but should not be used on SSDs." Answer: "On an HDD, files can be stored in fragments across the disk. The read head must physically move to different locations, slowing access. Defragmentation reorganises files into contiguous sectors, reducing head movement. On an SSD there are no moving parts — all locations are accessed equally fast, so defragmentation provides no benefit and causes unnecessary write operations that wear out the SSD faster."'),
      err('CRITICAL: Defragmentation is for HDDs ONLY. Never recommend defragmenting an SSD — it causes wear without benefit. This is one of the most commonly asked exam traps.'),
    ]
  },

]}, // end 1.5


// ══════════════════════════════════════════════════════════════
// 1.6 ETHICAL, LEGAL, CULTURAL AND ENVIRONMENTAL CONCERNS
// ══════════════════════════════════════════════════════════════
{ id:'og-6', number:'1.6', name:'Ethical, Legal, Cultural & Environmental Concerns', specPoints: [

  { id:'1.6.1', title:'Data Protection Act and GDPR',
    sections: [
      t('Why Legislation is Needed','Without legal protection, organisations could misuse personal data freely — selling it, sharing it without consent, or keeping it insecure. UK legislation creates enforceable obligations and rights.'),
      kt('Data Protection Act 2018 / GDPR','UK law governing how personal data must be handled. Applies to any organisation that collects or processes personal data about individuals. Gives individuals rights over their data.'),
      tbl(['Principle','Meaning'],
        [['Lawful, fair and transparent','Data must be collected with a legitimate reason; individuals must be informed'],
         ['Purpose limitation','Data can only be used for the specific purpose it was collected for'],
         ['Data minimisation','Only collect data that is actually needed — not more than necessary'],
         ['Accuracy','Data must be kept accurate and up to date'],
         ['Storage limitation','Data must not be kept longer than necessary'],
         ['Integrity and confidentiality','Data must be kept secure against loss, damage or unauthorised access'],
         ['Accountability','Organisations must demonstrate they follow the principles']]),
      t('Individual Rights under GDPR','Data subjects (people whose data is held) have: the right to access their data (Subject Access Request); the right to correct inaccurate data; the right to erasure ("right to be forgotten"); the right to object to how their data is processed.'),
      tip('"A company stores customer data. State two obligations under the Data Protection Act." Answer: "(1) The data must be kept secure to prevent unauthorised access or loss. (2) Data should only be kept for as long as it is needed for the original purpose."'),
    ]
  },

  { id:'1.6.2', title:'Computer Misuse Act and Copyright',
    sections: [
      tbl(['Act','Year','Key offences/provisions'],
        [['Computer Misuse Act (CMA)','1990','S1: Unauthorised access to a computer system (e.g. using someone else\'s login). S2: Unauthorised access with intent to commit further offences (e.g. hacking a bank to commit fraud). S3: Unauthorised modification of computer material (e.g. installing malware, deleting data). Penalties up to 10 years.'],
         ['Copyright, Designs and Patents Act (CDPA)','1988','Protects creators\' intellectual property. Makes it illegal to copy, distribute or use software, music, films or books without a licence. Software piracy — installing or distributing software without paying for a licence — is a criminal offence.']]),
      w('Apply the CMA to Scenarios','Scenario: Alice guesses Bob\'s password and reads his emails\n→ S1: Unauthorised access\n\nScenario: Charlie hacks into a bank\'s network intending to transfer money\n→ S2: Unauthorised access with intent to commit further crime (fraud)\n\nScenario: Diana installs malware on a company\'s computers, deleting files\n→ S3: Unauthorised modification of computer material\n\nScenario: Ed downloads a paid game from an illegal torrent site\n→ Copyright, Designs and Patents Act (piracy)'),
      tip('"Describe one offence under the Computer Misuse Act." Answer: "Section 1 makes it an offence to access a computer system without authorisation. For example, if someone guesses or steals another person\'s password and uses it to log into their account, this is unauthorised access and is a criminal offence."'),
    ]
  },

  { id:'1.6.3', title:'Environmental Impact of Computing',
    sections: [
      t('Energy Consumption','Data centres that power the internet, cloud services and streaming consume approximately 1-2% of global electricity. A single Google search uses roughly the energy equivalent of lighting a 60W bulb for 17 seconds. Globally, data centres emit as much CO₂ as the airline industry. Cryptocurrency mining is particularly energy-intensive.'),
      t('E-Waste (Electronic Waste)','Discarded electronics — computers, phones, tablets — often contain toxic materials (lead, mercury, cadmium, arsenic). Globally, over 50 million tonnes of e-waste are generated per year. Much is illegally exported to developing countries where it is unsafely processed. Rapid upgrade cycles mean devices are discarded after just 2-3 years.'),
      t('Manufacturing Impact','Producing a single smartphone requires mining rare earth metals (coltan, gold, cobalt) with significant environmental damage. Manufacturing a laptop produces as much CO₂ as running it for several years.'),
      t('Positive Environmental Uses of Computing','Smart energy grids reduce waste. Environmental monitoring using sensor networks. Precision agriculture reduces pesticide use. Remote working and video conferencing reduce transport emissions. Climate modelling and research. However, computing\'s carbon footprint must be weighed against these benefits.'),
      tip('For evaluate questions about environmental impact, structure your answer: (1) negative impact — energy consumption/carbon emissions, (2) another negative — e-waste/toxic materials, (3) positive — computing\'s role in environmental solutions, (4) conclusion with justification. 6 marks requires all four elements.'),
    ]
  },

  { id:'1.6.4', title:'Cultural Impact and the Digital Divide',
    sections: [
      kt('Digital divide','The gap between those who have access to digital technology and the internet, and those who do not. Operates at multiple levels: between rich and poor within a country, between urban and rural areas, between different generations, and between developed and developing nations.'),
      t('Consequences of the Digital Divide','As more essential services move online (banking, government services, job applications, education), those without access are increasingly disadvantaged. During COVID-19, students without internet access or devices fell behind in remote learning. Online job applications exclude those without digital skills.'),
      t('Cultural Changes from Computing','Social media has transformed communication, community formation and political discourse. Online shopping has disrupted traditional retail. Streaming services have changed the music and film industries. Automation and AI are changing the nature of work — displacing some roles while creating others. Global connectivity has spread cultures but also homogenised them.'),
      t('Ethical Issues','(1) Privacy: devices constantly collect location, usage and behaviour data. (2) Surveillance: CCTV, facial recognition and internet monitoring raise civil liberties concerns. (3) AI bias: AI systems trained on biased data can discriminate (recruitment algorithms disadvantaging women; facial recognition less accurate for non-white faces). (4) Autonomous decision-making: who is responsible when an AI system makes a harmful decision?'),
      tip('"Discuss the impact of the digital divide on individuals." Structure: people without access cannot access online banking, government services, remote education, job opportunities (1 mark each). Conclude: the divide increases social and economic inequality. For "evaluate" questions, also include benefits of digital access and possible solutions.'),
    ]
  },

]}, // end 1.6


// ══════════════════════════════════════════════════════════════
// 2.1 ALGORITHMS
// ══════════════════════════════════════════════════════════════
{ id:'og-7', number:'2.1', name:'Algorithms', specPoints: [

  { id:'2.1.1', title:'Computational Thinking',
    sections: [
      kt('Decomposition','Breaking a large, complex problem into smaller, more manageable sub-problems. Each sub-problem can be solved independently, then the solutions combined. This makes programming large systems feasible — different programmers can work on different sub-problems simultaneously.'),
      kt('Abstraction','Removing unnecessary detail from a problem, retaining only what is relevant to the solution. A weather app abstracts away the complex physics of atmospheric systems, showing only temperature and rainfall. A class in OOP abstracts away the implementation details.'),
      kt('Algorithmic thinking','Developing a precise, step-by-step solution that can be expressed as an algorithm and eventually coded. Involves identifying inputs and outputs, breaking into steps, defining conditions and repetition, and verifying correctness.'),
      w('Applying Computational Thinking: Online Shop','DECOMPOSITION — break "create an online shop" into:\n  1. User accounts (register, login, profile)\n  2. Product catalogue (display, search, filter)\n  3. Shopping cart (add, remove, update quantities)\n  4. Payment processing (card, PayPal)\n  5. Order management (confirmation, tracking, returns)\n\nABSTRACTION — the payment page hides:\n  The complex banking protocols\n  The encryption and security mechanisms\n  The fraud detection algorithms\n  Showing only: card number, expiry date, CVV\n\nALGORITHMIC THINKING — "Add item to cart":\n  INPUT: productID, quantity\n  IF product exists AND quantity > 0:\n    IF product already in cart: update quantity\n    ELSE: add new entry to cart\n  RETURN updated cart'),
      tip('"Explain how abstraction was used in designing a map app." Answer: "Abstraction was used to remove unnecessary details from the real world. The map app does not show individual buildings, trees or grass — it shows only roads, place names and points of interest that are relevant to navigation. This simplification makes the app easier to use and the underlying data smaller."'),
    ]
  },

  { id:'2.1.2', title:'Representing Algorithms: Flowcharts and Pseudocode',
    sections: [
      tbl(['Symbol','Shape','Meaning'],
        [['Terminal','Oval / rounded rectangle','START or STOP of the algorithm'],
         ['Process','Rectangle','An action or calculation: e.g. total ← total + 1'],
         ['Decision','Diamond ◇','A YES/NO question — two exits labelled YES and NO'],
         ['Input/Output','Parallelogram (slanted rectangle)','Data coming IN (user input) or going OUT (display result)'],
         ['Flow arrow','→','Shows direction of flow — connects all symbols']]),
      t('Pseudocode Conventions (OCR)','OCR uses its own pseudocode style. Key conventions: assignment uses ← (e.g. count ← 0); output uses print(); input uses x = input(); IF/ELIF/ELSE/ENDIF structure; FOR i = 0 TO n-1 for loops; WHILE/ENDWHILE for while loops; subroutines defined with def name():; arrays use square brackets.'),
      w('Convert Between Flowchart and Pseudocode','Algorithm: find if a number is positive, negative, or zero\n\nPseudocode:\n  number = int(input("Enter a number: "))\n  if number > 0:\n    print("Positive")\n  elif number < 0:\n    print("Negative")\n  else:\n    print("Zero")\n\nFlowchart equivalent:\n  OVAL: START\n  PARALLELOGRAM: INPUT number\n  DIAMOND: number > 0?\n    YES → PARALLELOGRAM: OUTPUT "Positive" → OVAL: STOP\n    NO → DIAMOND: number < 0?\n      YES → PARALLELOGRAM: OUTPUT "Negative" → OVAL: STOP\n      NO → PARALLELOGRAM: OUTPUT "Zero" → OVAL: STOP'),
      tip('Every diamond in a flowchart MUST have exactly two exits — YES and NO. Every path must eventually reach STOP. Forgetting to label the exits or having paths that loop back incorrectly are common errors.'),
    ]
  },

  { id:'2.1.3', title:'Linear and Binary Search',
    sections: [
      t('Linear Search','Checks each element one at a time from the start. Works on ANY list — sorted or unsorted. Simple but slow for large lists. Time complexity: O(n) — in the worst case, checks every element.'),
      w('Linear Search Trace','Search for 7 in [4, 2, 7, 1, 9, 3]\n\n  Check 4 — no\n  Check 2 — no\n  Check 7 — YES! Found at index 2\n\nWorst case (not in list):\n  Search for 5 in [4, 2, 7, 1, 9, 3]\n  Check all 6 elements — not found\n  6 comparisons needed = n comparisons'),
      t('Binary Search','Works ONLY on SORTED lists. Compares target to middle element; searches left half if target is smaller, right half if larger. Much faster than linear search for large lists. Time complexity: O(log₂ n).'),
      w('Binary Search Trace: Find 7 in [1, 3, 5, 7, 9, 11, 13]','low=0, high=6, mid=3 → list[3]=7 → FOUND! (1 comparison)\n\nHarder: Find 11 in [1, 3, 5, 7, 9, 11, 13, 15]\nStep 1: low=0, high=7, mid=3 → list[3]=7. 11>7 → right. low=4\nStep 2: low=4, high=7, mid=5 → list[5]=11 → FOUND! (2 comparisons)\n\nWith 1,000,000 items:\n  Linear search: up to 1,000,000 comparisons\n  Binary search: at most 20 comparisons (log₂ 1,000,000 ≈ 20)'),
      tbl(['Feature','Linear Search','Binary Search'],
        [['Works on unsorted list?','YES','NO — must be sorted'],
         ['Comparisons (worst case)','n (all elements)','log₂ n'],
         ['n = 1,000 (worst case)','1,000 comparisons','~10 comparisons'],
         ['n = 1,000,000 (worst case)','1,000,000 comparisons','~20 comparisons'],
         ['Simple to implement?','Yes','Slightly more complex']]),
      tip('"Why would binary search be unsuitable to use on a phonebook?" — This is a trick question: a phonebook IS sorted, so binary search IS suitable. If the question said "an unsorted list of contacts", the answer would be: "Binary search requires the list to be sorted in order. An unsorted list cannot be searched using binary search."'),
    ]
  },

  { id:'2.1.4', title:'Bubble Sort and Merge Sort',
    sections: [
      t('Bubble Sort','Repeatedly compares adjacent pairs and swaps them if out of order. After each pass, the largest unsorted element has "bubbled" to its correct position. Stops when a pass makes no swaps. Simple but inefficient: O(n²) worst case.'),
      w('Bubble Sort — Full Trace on [5, 3, 8, 1]','Pass 1:\n  5 vs 3: 5>3, SWAP → [3, 5, 8, 1]\n  5 vs 8: ok  → [3, 5, 8, 1]\n  8 vs 1: 8>1, SWAP → [3, 5, 1, 8]  ← 8 now in position\n\nPass 2:\n  3 vs 5: ok  → [3, 5, 1, 8]\n  5 vs 1: 5>1, SWAP → [3, 1, 5, 8]  ← 5 now in position\n\nPass 3:\n  3 vs 1: 3>1, SWAP → [1, 3, 5, 8]  ← 3 now in position\n\nPass 4:\n  No swaps → SORTED ✓\n\nKey: if a whole pass makes NO swaps, stop immediately (optimisation).'),
      t('Merge Sort','Divide-and-conquer algorithm. Recursively splits list into halves until single elements remain, then merges sorted pairs back together. Always O(n log n) — much more efficient than bubble sort for large lists, but requires extra memory.'),
      w('Merge Sort — Trace on [4, 2, 7, 1]','SPLIT phase:\n  [4, 2, 7, 1]\n  [4, 2]     [7, 1]\n  [4] [2]    [7] [1]\n\nMERGE phase:\n  Merge [4] and [2]: compare → take 2, take 4 → [2, 4]\n  Merge [7] and [1]: compare → take 1, take 7 → [1, 7]\n  Merge [2,4] and [1,7]: compare 2 and 1 → take 1\n                          compare 2 and 7 → take 2\n                          compare 4 and 7 → take 4\n                          take 7\n                          → [1, 2, 4, 7] ✓'),
      tbl(['Feature','Bubble Sort','Merge Sort'],
        [['Time complexity (worst)','O(n²)','O(n log n)'],
         ['Best case (optimised)','O(n) — already sorted','O(n log n)'],
         ['Memory','O(1) — sorts in place','O(n) — needs extra space'],
         ['Stability','Stable (preserves order of equal elements)','Stable'],
         ['Practical use','Teaching; small lists only','Large datasets; guaranteed performance']]),
      tip('For bubble sort questions: show EVERY comparison in EVERY pass, even if no swap occurs. The marks are at each step. For merge sort: show the split tree clearly, then show each merge step with the comparisons made.'),
    ]
  },

  { id:'2.1.5', title:'Efficiency and Trace Tables',
    sections: [
      t('Algorithm Efficiency','Efficiency describes how an algorithm\'s resource usage (time or memory) grows as the input size n increases. More efficient algorithms scale better to large inputs.'),
      tbl(['Complexity','Grows as...','Example'],
        [['O(1)','Constant — does not grow','Array index access'],
         ['O(n)','Linear — proportional to n','Linear search'],
         ['O(n²)','Quadratic — grows rapidly','Bubble sort'],
         ['O(log n)','Logarithmic — grows slowly','Binary search']]),
      t('Trace Tables','A trace table manually tracks variable values at each step of an algorithm — used to verify correctness, find errors, and demonstrate understanding in exams.'),
      w('Trace Table: Find the maximum in a list','Algorithm:\n  numbers ← [3, 8, 2, 9, 1]\n  max_val ← numbers[0]\n  FOR i = 1 TO 4\n    IF numbers[i] > max_val THEN\n      max_val ← numbers[i]\n  print(max_val)\n\nTrace table:\n|  i  | numbers[i] | > max_val? | max_val |\n|-----|-----------|------------|--------|\n|  —  |     —      |     —      |    3   |\n|  1  |     8      |   YES      |    8   |\n|  2  |     2      |   NO       |    8   |\n|  3  |     9      |   YES      |    9   |\n|  4  |     1      |   NO       |    9   |\nOutput: 9'),
      tip('Trace table rules: (1) one column per variable, (2) one row per change, (3) show condition result (YES/NO), (4) show OUTPUT on its own row at the end. Missing any of these loses marks.'),
    ]
  },

]}, // end 2.1


// ══════════════════════════════════════════════════════════════
// 2.2 PROGRAMMING FUNDAMENTALS
// ══════════════════════════════════════════════════════════════
{ id:'og-8', number:'2.2', name:'Programming Fundamentals', specPoints: [

  { id:'2.2.1', title:'Variables, Constants and Data Types',
    sections: [
      kt('Variable','A named storage location whose value can change during program execution. Must be declared with a name and given a value before use.'),
      kt('Constant','A named value that is set once and never changes during program execution. Using constants makes programs easier to read (PI instead of 3.14159) and maintain (change in one place only).'),
      tbl(['Data type','What it stores','Examples','In Python'],
        [['Integer','Whole numbers (positive, negative, zero)','42, -7, 0, 1000','age = 16'],
         ['Float / Real','Numbers with decimal points','3.14, -0.5, 2.0','height = 1.75'],
         ['Boolean','True or False only','True, False','passed = True'],
         ['String','Sequence of characters in quotes','"Hello", "12A", ""','name = "Alice"'],
         ['Character','A single character','\'A\', \'7\', \' \'','grade = \'A\'  # use str in Python']]),
      kt('Type casting / conversion','Converting a value from one data type to another. int("42") converts string to integer. str(99) converts integer to string. float("3.14") converts string to float. Essential when mixing data types.'),
      w('Common Type Conversion Mistakes','# User input is ALWAYS a string — must convert if arithmetic needed:\nage_str = input("Enter age: ")   # "16" as a string\nage = int(age_str)              # 16 as an integer\nnext_year = age + 1             # 17 — works correctly\n\n# Without conversion:\nwrong = age_str + 1             # ERROR: cannot add string and int\n\n# Concatenation vs addition — type matters:\nresult1 = "3" + "5"    # "35"  (string concatenation)\nresult2 = 3 + 5        # 8     (integer addition)'),
    ]
  },

  { id:'2.2.2', title:'Selection and Iteration',
    sections: [
      t('Selection: IF Statements','IF/ELIF/ELSE allows a program to make decisions and execute different code paths based on conditions. Only ONE branch executes — the first condition that is True.'),
      w('Selection Examples','# Simple IF-ELSE\nif score >= 50:\n    print("Pass")\nelse:\n    print("Fail")\n\n# Multi-branch IF-ELIF-ELSE\nif score >= 70:\n    print("Distinction")\nelif score >= 55:\n    print("Merit")\nelif score >= 40:\n    print("Pass")\nelse:\n    print("Fail")\n# Only the FIRST true condition runs — rest are SKIPPED'),
      t('Iteration: FOR and WHILE Loops','FOR loops: use when the number of iterations is known in advance. WHILE loops: use when repeating until a condition becomes false — may run zero times. Nested loops: a loop inside another loop — inner loop runs completely for each iteration of outer loop.'),
      w('Iteration Examples','# FOR loop — known count\nfor i in range(1, 6):    # 1, 2, 3, 4, 5\n    print(i * 2)\n\n# WHILE loop — unknown count\npassword = ""\nwhile password != "secret123":\n    password = input("Enter password: ")\nprint("Access granted")\n\n# Nested loops — multiplication table\nfor row in range(1, 4):\n    for col in range(1, 4):\n        print(row * col, end=" ")\n    print()    # newline after each row\n# Outputs:\n# 1 2 3\n# 2 4 6\n# 3 6 9'),
      tbl(['Loop','Condition checked','Minimum runs','Use when'],
        [['FOR','Before each iteration','0 (if range empty)','Number of iterations known'],
         ['WHILE','Before each iteration','0 (may not run)','Unknown iterations; may not run'],
         ['do-while (Python: while True + break)','After each iteration','1 (always runs once)','Must run at least once (e.g. menus, input validation)']]),
      tip('Input validation is a classic use case for a loop that must run at least once: "REPEAT: ask for input UNTIL input is valid." In Python, use while True: ... if valid: break'),
    ]
  },

  { id:'2.2.3', title:'Subroutines, Functions and Scope',
    sections: [
      t('Why Use Subroutines?','Subroutines (procedures and functions) avoid repeating code, make programs easier to read and test, allow different people to work on different parts, and enable code reuse across multiple programs.'),
      kt('Procedure (void function)','A subroutine that performs actions but does NOT return a value to the caller. Called as a statement.'),
      kt('Function','A subroutine that performs actions AND returns a value using a return statement. Called within an expression.'),
      w('Procedure vs Function','# Procedure — no return value\ndef display_grade(score):\n    if score >= 70:\n        print("Distinction")\n    elif score >= 40:\n        print("Pass")\n    else:\n        print("Fail")\n\ndisplay_grade(65)   # Output: Pass\n\n# Function — returns a value\ndef calculate_grade(score):\n    if score >= 70:\n        return "Distinction"\n    elif score >= 40:\n        return "Pass"\n    else:\n        return "Fail"\n\nresult = calculate_grade(65)   # result = "Pass"\nprint(f"Grade: {result}")'),
      kt('Local variable','Declared inside a subroutine. Only accessible within that subroutine. Created when called, destroyed when subroutine returns. Prevents accidental interference between subroutines.'),
      kt('Global variable','Declared outside all subroutines. Accessible everywhere. Should be used sparingly — makes debugging difficult because any part of the program could modify it.'),
      w('Scope Example','total = 0   # GLOBAL — accessible everywhere\n\ndef add_score(score):\n    bonus = score * 2   # LOCAL — only exists here\n    global total        # declare intent to modify global\n    total = total + bonus\n\nadd_score(5)    # total = 10\nadd_score(3)    # total = 16\n# Cannot access "bonus" here — it is local to add_score\nprint(total)    # 16'),
    ]
  },

  { id:'2.2.4', title:'Arrays, Strings and File Handling',
    sections: [
      t('Arrays (Lists in Python)','An array stores multiple values of the same type under one name, accessed by index. Zero-indexed — first element is at index 0. Fixed size in many languages (Python lists are dynamic).'),
      w('Array Operations','scores = [78, 65, 92, 41, 88]  # 1D array\n\n# Access\nprint(scores[0])    # 78 (first)\nprint(scores[-1])   # 88 (last)\n\n# Modify\nscores[2] = 95      # change index 2\n\n# Iterate\nfor i in range(len(scores)):\n    print(scores[i])\n\n# 2D array (grid)\ngrid = [[1,2,3],[4,5,6],[7,8,9]]\nprint(grid[1][2])   # 6 (row 1, column 2)\n\nfor row in range(3):\n    for col in range(3):\n        print(grid[row][col], end=" ")\n    print()'),
      tbl(['String operation','Python syntax','Example → Result'],
        [['Length','len(s)','len("Hello") → 5'],
         ['Uppercase','s.upper()','   "hello".upper() → "HELLO"'],
         ['Substring/Slice','s[start:end]','   "Computer"[0:4] → "Comp"'],
         ['Character at index','s[i]','   "Hello"[0] → "H"'],
         ['ASCII code','ord(c)','   ord("A") → 65'],
         ['Char from code','chr(n)','   chr(65) → "A"'],
         ['Find','s.find(sub)','   "Hello".find("ll") → 2'],
         ['Split','s.split(sep)','   "a,b,c".split(",") → ["a","b","c"]'],
         ['Concatenation','s1 + s2','   "Hi" + " there" → "Hi there"']]),
      w('File Handling in Python','# Writing to a file\nwith open("grades.txt", "w") as f:\n    f.write("Alice,92\\n")\n    f.write("Bob,78\\n")\n\n# Reading from a file\nwith open("grades.txt", "r") as f:\n    for line in f:\n        data = line.strip().split(",")\n        print(f"Student: {data[0]}, Grade: {data[1]}")\n\n# Appending to a file (does not overwrite)\nwith open("grades.txt", "a") as f:\n    f.write("Charlie,85\\n")'),
      tip('"Give two reasons to use a 2D array." Answer: "(1) A 2D array can store tabular data naturally — e.g. a seating plan where each cell [row][column] represents one seat. (2) It allows the entire grid to be processed using nested loops, making the code more organised than using many separate variables."'),
    ]
  },

]}, // end 2.2


// ══════════════════════════════════════════════════════════════
// 2.3 PRODUCING ROBUST PROGRAMS
// ══════════════════════════════════════════════════════════════
{ id:'og-9', number:'2.3', name:'Producing Robust Programs', specPoints: [

  { id:'2.3.1', title:'Error Types and Input Validation',
    sections: [
      tbl(['Error type','When it occurs','Example','Detection'],
        [['Syntax error','When code is parsed/compiled — before running','Missing colon in Python: if x > 0','Immediately — IDE underlines it'],
         ['Runtime error','While the program is running','Division by zero: x = 10/0','Program crashes during execution'],
         ['Logic error','Program runs without crashing but gives wrong output','Using + instead of * in a calculation','Only detected by testing with known outputs']]),
      w('Examples of Each Error Type','# Syntax error — Python cannot parse this:\nif age >= 18    # Missing colon\n    print("Adult")\n\n# Runtime error — crashes during execution:\nnumbers = [1, 2, 3]\nprint(numbers[10])   # IndexError: list index out of range\n\n# Logic error — runs but wrong answer:\ndef average(a, b):\n    return a + b    # Should be (a + b) / 2\nprint(average(4, 6))  # Prints 10 instead of 5'),
      kt('Input validation','Checking that user input meets specified criteria BEFORE processing. Prevents runtime errors and ensures data integrity. Types: range check (age must be 0-120), type check (must be integer), length check (password 8-20 chars), presence check (field not empty), format check (email contains @).'),
      w('Input Validation — Complete Example','def get_valid_age():\n    while True:\n        try:\n            age = int(input("Enter age (0-120): "))\n            if 0 <= age <= 120:\n                return age\n            else:\n                print("Age must be between 0 and 120")\n        except ValueError:\n            print("Please enter a whole number")\n\nage = get_valid_age()\nprint(f"Valid age: {age}")'),
      tip('"What is the difference between validation and verification?" Answer: "Validation checks whether data is acceptable — for example, checking that an age is between 0 and 120. Verification checks whether data was entered correctly — for example, asking a user to type their email address twice to confirm they typed it accurately."'),
    ]
  },

  { id:'2.3.2', title:'Testing and Debugging',
    sections: [
      tbl(['Test data type','Description','Example (testing age 11-18 range)'],
        [['Normal / valid','Data that should be accepted and processed correctly','14, 16, 11, 18'],
         ['Boundary / extreme','Values at the exact edges of the acceptable range','11 and 18 (valid); 10 and 19 (invalid boundary)'],
         ['Invalid / erroneous','Data that should be rejected — wrong type or out of range','-5, 25, "hello", 16.5']]),
      w('Designing a Test Plan','Program: accepts exam score 0-100\n\n| Test | Input | Expected output | Type |\n|------|-------|-----------------|------|\n|  1   |  75   | "Valid"         | Normal |\n|  2   |   0   | "Valid"         | Boundary (lower) |\n|  3   | 100   | "Valid"         | Boundary (upper) |\n|  4   |  -1   | "Invalid"       | Boundary (just below) |\n|  5   | 101   | "Invalid"       | Boundary (just above) |\n|  6   | "abc" | "Invalid"       | Erroneous (wrong type) |\n|  7   |  50.5 | "Invalid"       | Erroneous (decimal)'),
      kt('Black-box testing','Tests the program based only on its inputs and expected outputs — without any knowledge of the internal code. Tests that the program DOES WHAT IT SHOULD. Typically done by users/testers, not the developer.'),
      kt('White-box testing','Tests with full knowledge of the code structure. Aims to test every possible path through the code. Typically done by the developer. Ensures all branches and conditions have been exercised.'),
      t('Debugging Techniques','(1) Trace through manually — use a trace table to follow code step by step. (2) Add print statements — temporarily print variable values at key points to see what is happening. (3) Use an IDE debugger — set breakpoints, step through code line by line, inspect variable values at each step. (4) Rubber duck debugging — explain the code step by step (even to an inanimate object) — this often reveals the logic error.'),
      tip('"Describe two features of maintainable code." Answer: "(1) Meaningful variable names — using studentAge instead of a makes the purpose of each variable obvious, so other programmers can understand the code without additional explanation. (2) Comments — brief explanations of complex sections allow future programmers to understand the purpose of the code without reading every line."'),
    ]
  },

]}, // end 2.3


// ══════════════════════════════════════════════════════════════
// 2.4 BOOLEAN LOGIC
// ══════════════════════════════════════════════════════════════
{ id:'og-10', number:'2.4', name:'Boolean Logic', specPoints: [

  { id:'2.4.1', title:'AND, OR and NOT Gates',
    sections: [
      t('Boolean Algebra Basics','Boolean logic deals with values that are either TRUE (1) or FALSE (0). All digital computing is based on Boolean logic — every transistor is a Boolean switch. Logic gates are the physical implementation of Boolean operations.'),
      tbl(['Gate','Symbol','Operation','Output 1 when...'],
        [['AND','A · B','Both inputs must be 1 for output to be 1','BOTH A and B are 1'],
         ['OR','A + B','At least one input must be 1 for output to be 1','Either A or B (or both) are 1'],
         ['NOT','Ā or ¬A','Inverts the single input','A is 0']]),
      w('AND, OR, NOT Truth Tables','AND:\n| A | B | A AND B |\n|---|---|---------|\n| 0 | 0 |    0    |\n| 0 | 1 |    0    |\n| 1 | 0 |    0    |\n| 1 | 1 |    1    |\n\nOR:\n| A | B | A OR B |\n|---|---|--------|\n| 0 | 0 |   0    |\n| 0 | 1 |   1    |\n| 1 | 0 |   1    |\n| 1 | 1 |   1    |\n\nNOT:\n| A | NOT A |\n|---|-------|\n| 0 |   1   |\n| 1 |   0   |'),
      tip('Memory aid: AND is like multiplication (0×anything=0, 1×1=1). OR is like addition but capped at 1. NOT simply flips. The only time AND gives 1 is when BOTH inputs are 1.'),
    ]
  },

  { id:'2.4.2', title:'NAND, NOR, XOR and Complex Circuits',
    sections: [
      w('Complete Truth Table — All 6 Gates','| A | B | AND | OR | NOT A | NAND | NOR | XOR |\n|---|---|-----|----|-------|------|-----|-----|\n| 0 | 0 |  0  |  0 |   1   |  1   |  1  |  0  |\n| 0 | 1 |  0  |  1 |   1   |  1   |  0  |  1  |\n| 1 | 0 |  0  |  1 |   0   |  1   |  0  |  1  |\n| 1 | 1 |  1  |  1 |   0   |  0   |  0  |  0  |\n\nMemory aids:\n  NAND: opposite of AND (only 0 when BOTH are 1)\n  NOR: opposite of OR (only 1 when BOTH are 0)\n  XOR: 1 when inputs are DIFFERENT (same→0, different→1)'),
      kt('NAND gate','NOT (A AND B). A universal gate — any logic circuit can be built using only NAND gates. Output is only 0 when BOTH inputs are 1.'),
      kt('NOR gate','NOT (A OR B). Also a universal gate. Output is only 1 when BOTH inputs are 0.'),
      kt('XOR gate','eXclusive OR. Output is 1 only when inputs are DIFFERENT. Used in binary addition circuits: 1 XOR 1 = 0 (with carry), 0 XOR 1 = 1.'),
      t('Building Truth Tables from Complex Expressions','For expressions like Q = (A AND B) OR (NOT C): add intermediate columns for each sub-expression. With 3 inputs (A, B, C): 2³ = 8 rows needed. Column order: A, B, C, NOT C, A AND B, final Q.'),
      w('Complex Expression — Build the Truth Table','Q = (A AND B) OR (NOT C)\n\n| A | B | C | NOT C | A AND B | Q |\n|---|---|---|-------|---------|---|\n| 0 | 0 | 0 |   1   |    0    | 1 |\n| 0 | 0 | 1 |   0   |    0    | 0 |\n| 0 | 1 | 0 |   1   |    0    | 1 |\n| 0 | 1 | 1 |   0   |    0    | 0 |\n| 1 | 0 | 0 |   1   |    0    | 1 |\n| 1 | 0 | 1 |   0   |    0    | 0 |\n| 1 | 1 | 0 |   1   |    1    | 1 |\n| 1 | 1 | 1 |   0   |    1    | 1 |'),
      err('XOR and OR are NOT the same. OR gives 1 when either OR BOTH inputs are 1. XOR gives 1 ONLY when exactly ONE input is 1. When A=1 AND B=1: OR gives 1, XOR gives 0.'),
    ]
  },

  { id:'2.4.3', title:'Boolean Algebra and De Morgan\'s Laws',
    sections: [
      tbl(['Law','Expression','Simplified','Notes'],
        [['Identity','A AND 1','A','AND with 1 has no effect'],
         ['Identity','A OR 0','A','OR with 0 has no effect'],
         ['Annulment','A AND 0','0','AND with 0 always gives 0'],
         ['Annulment','A OR 1','1','OR with 1 always gives 1'],
         ['Idempotent','A AND A','A','ANDing with itself'],
         ['Idempotent','A OR A','A','ORing with itself'],
         ['Double negation','NOT(NOT A)','A','Two NOTs cancel']]),
      kt("De Morgan's First Law","NOT(A AND B) = (NOT A) OR (NOT B). Breaking the AND gate: remove the NOT wrapper, flip AND to OR, add NOT to each input."),
      kt("De Morgan's Second Law","NOT(A OR B) = (NOT A) AND (NOT B). Breaking the OR gate: remove the NOT wrapper, flip OR to AND, add NOT to each input."),
      w("De Morgan's Laws — Worked Simplification","Simplify: NOT(A AND B) OR C\n\nStep 1: Apply De Morgan's first law to NOT(A AND B):\n  NOT(A AND B) = (NOT A) OR (NOT B)\n\nStep 2: Substitute:\n  (NOT A) OR (NOT B) OR C\n\nVerify with A=1, B=1, C=0:\n  Original: NOT(1 AND 1) OR 0 = NOT(1) OR 0 = 0 OR 0 = 0\n  Simplified: NOT(1) OR NOT(1) OR 0 = 0 OR 0 OR 0 = 0 ✓"),
      tip('"Break the bar" memory trick: NOT(A AND B) → remove the NOT, flip AND↔OR, add NOT to each variable: (NOT A) OR (NOT B). Works both ways. NOT(A OR B) → (NOT A) AND (NOT B).'),
    ]
  },

]}, // end 2.4


// ══════════════════════════════════════════════════════════════
// 2.5 PROGRAMMING LANGUAGES AND IDEs
// ══════════════════════════════════════════════════════════════
{ id:'og-11', number:'2.5', name:'Programming Languages & IDEs', specPoints: [

  { id:'2.5.1', title:'High-Level vs Low-Level Languages',
    sections: [
      tbl(['Feature','High-level (Python, Java)','Low-level (Assembly, Machine code)'],
        [['Readability','English-like; easy to read and write','Cryptic; very hard to understand'],
         ['Portability','Runs on different hardware (with translator)','CPU-specific; not portable'],
         ['Execution speed','Slightly slower (translation overhead)','Fastest — no translation needed'],
         ['Memory control','Limited — managed by language runtime','Full direct control of memory'],
         ['Development time','Faster — fewer lines of code needed','Much slower — everything explicit'],
         ['Error detection','Better error messages; easier debugging','Very difficult to debug'],
         ['Use cases','Web, apps, data science, AI, GCSE/A Level','OS kernels, device drivers, embedded systems']]),
      kt('Machine code','Binary instructions (0s and 1s) directly executed by the CPU. Every CPU architecture has its own machine code. No translation needed — fastest possible execution. Impossible for humans to write for anything complex.'),
      kt('Assembly language','Uses mnemonic codes (MOV, ADD, JMP, SUB) instead of binary. One-to-one correspondence with machine code — one assembly instruction = one machine code instruction. Translated by an assembler. Still processor-specific.'),
      tip('"Give two reasons why high-level languages are preferred over low-level languages for most programming." Answer: "(1) High-level languages use English-like syntax, making programs easier to read, write and maintain than low-level languages which use cryptic codes or binary. (2) High-level code is portable — the same code can run on different hardware with the appropriate translator, whereas low-level code is specific to one CPU architecture."'),
    ]
  },

  { id:'2.5.2', title:'Translators: Compilers and Interpreters',
    sections: [
      tbl(['Feature','Compiler','Interpreter'],
        [['Translation','Translates entire program at once before running','Translates and executes one line at a time'],
         ['Output','Creates a standalone executable file (.exe)','No separate output file — translates fresh each time'],
         ['Speed (running)','Fast — code already translated to machine code','Slower — translates during execution'],
         ['Error reporting','All errors found before any code runs','Stops at the first error encountered'],
         ['Development cycle','Slower — must compile before testing','Faster — change and run immediately'],
         ['Distribution','Can distribute executable without source code','Usually requires source code (or bytecode)'],
         ['Examples','C, C++, Java (to bytecode), Go','Python, JavaScript, Ruby']]),
      kt('Assembler','Translates assembly language into machine code. One-to-one translation. Used for low-level programming.'),
      w('Compiler vs Interpreter — Exam Scenarios','Q: "A game developer is releasing a finished game to the public.\n    Should they use a compiled or interpreted language?"\nA: Compiled. The compiled executable runs faster, and they can\n   distribute it without revealing the source code.\n\nQ: "A Python developer is testing a new function during development.\n    Why is the interpreted nature of Python useful here?"\nA: Because Python is interpreted, the developer can make a change\n   to a single function and immediately run and test it without\n   waiting for a full compilation. Errors are also reported at the\n   specific line where they occur.'),
      tip('"Compare a compiler and an interpreter." Answer: "A compiler translates the entire program into machine code before execution, creating an executable file that runs quickly. An interpreter translates and executes the program line by line each time it runs, which is slower but makes development faster as changes can be tested immediately without recompiling."'),
    ]
  },

  { id:'2.5.3', title:'IDE Features and Their Benefits',
    sections: [
      tbl(['Feature','What it does','Benefit to developer'],
        [['Code editor','Specialised text area for writing code','Dedicated environment with programming-specific features'],
         ['Syntax highlighting','Colours different elements (keywords, strings, comments) in different colours','Makes code easier to read; helps spot syntax errors quickly'],
         ['Auto-completion','Suggests completions as you type; shows available methods and parameters','Faster typing; reduces spelling mistakes in code'],
         ['Error highlighting','Underlines syntax errors in real time as you type','Catch and fix errors before running; learn correct syntax'],
         ['Debugger with breakpoints','Pause execution at specified lines; inspect variable values interactively','Find and fix logic errors; understand program flow step by step'],
         ['Run/Execute button','Run the program directly within the IDE','Test code instantly without switching to a terminal'],
         ['Version control integration','Connect to Git; commit, push, pull without leaving the IDE','Track changes; collaborate; roll back errors']]),
      w('Exam Answer: "Describe two features of an IDE that help a programmer"','1. Syntax highlighting (1 mark)\n   The IDE displays different parts of code in different colours —\n   for example, keywords in blue, strings in green, comments in grey.\n   This makes code easier to read and helps the programmer quickly\n   spot if they have mistyped a keyword. (1 mark for description)\n\n2. Debugger with breakpoints (1 mark)\n   The programmer can set breakpoints — specific lines where the\n   program pauses execution. At each pause, they can inspect the\n   current value of every variable, making it much easier to find\n   logic errors by seeing exactly what the program is doing at each\n   step. (1 mark for description)'),
      tip('"Explain how auto-completion in an IDE helps programmers." Answer: "Auto-completion suggests completions for variable names, function names and method names as the programmer types. This reduces spelling mistakes in code (which cause syntax errors), speeds up development, and shows the programmer what parameters a function expects, reducing time spent reading documentation."'),
    ]
  },

]}, // end 2.5

]};
