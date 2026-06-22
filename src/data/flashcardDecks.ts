// Flashcard decks for OCR GCSE J277 and OCR A Level H446
// Curated to match the actual OCR specifications only

export interface Flashcard {
  term: string;
  def: string;
  topic: string;
}

export interface FlashcardDeck {
  id: string;
  name: string;
  level: 'gcse' | 'alevel';
  topic: string;
  colour: string;
  cards: Flashcard[];
}

// ══════════════════════════════════════════════════════════════════
// OCR GCSE J277 DECKS
// ══════════════════════════════════════════════════════════════════

const GCSE_SYSTEMS_ARCHITECTURE: Flashcard[] = [
  { term: 'CPU', def: 'Central Processing Unit — fetches, decodes and executes instructions. Contains ALU, Control Unit and registers.', topic: 'Systems Architecture' },
  { term: 'ALU', def: 'Arithmetic Logic Unit — performs arithmetic (add, subtract) and logical (AND, OR, NOT, compare) operations.', topic: 'Systems Architecture' },
  { term: 'Control Unit', def: 'Fetches and decodes instructions, sends control signals to coordinate the FDE cycle and data movement.', topic: 'Systems Architecture' },
  { term: 'Fetch-Decode-Execute Cycle', def: 'The CPU cycle: Fetch instruction from memory → Decode it → Execute it. Repeats continuously.', topic: 'Systems Architecture' },
  { term: 'Program Counter (PC)', def: 'Register holding the memory address of the next instruction to be fetched. Increments after each fetch.', topic: 'Systems Architecture' },
  { term: 'Memory Address Register (MAR)', def: 'Holds the address of the memory location being read from or written to.', topic: 'Systems Architecture' },
  { term: 'Memory Data Register (MDR)', def: 'Holds the data being transferred to or from memory. Also called MBR.', topic: 'Systems Architecture' },
  { term: 'Accumulator (ACC)', def: 'Stores the result of calculations performed by the ALU.', topic: 'Systems Architecture' },
  { term: 'Cache Memory', def: 'Small, very fast memory inside/near the CPU storing recently used data. Reduces slow RAM accesses. L1 fastest, then L2, L3.', topic: 'Systems Architecture' },
  { term: 'Clock Speed', def: 'Number of FDE cycles per second (GHz). Higher = faster execution. Also increases power consumption and heat.', topic: 'Systems Architecture' },
  { term: 'Number of Cores', def: 'Each core can process instructions independently. More cores = more tasks simultaneously, improving multitasking.', topic: 'Systems Architecture' },
  { term: 'Von Neumann Architecture', def: 'Instructions and data share the same memory and bus. The stored-program concept — programs stored in memory and fetched like data.', topic: 'Systems Architecture' },
];

const GCSE_MEMORY_STORAGE: Flashcard[] = [
  { term: 'RAM', def: 'Random Access Memory — volatile primary storage holding currently running programs and data. Contents lost when power removed.', topic: 'Memory & Storage' },
  { term: 'ROM', def: 'Read Only Memory — non-volatile. Stores firmware/BIOS. Cannot normally be changed. Retains contents without power.', topic: 'Memory & Storage' },
  { term: 'Virtual Memory', def: 'Disk/SSD space used as extra RAM when RAM is full. Slower than real RAM. Allows programs larger than available RAM to run.', topic: 'Memory & Storage' },
  { term: 'HDD', def: 'Hard Disk Drive — magnetic, moving parts, cheap per GB, slower (~5ms access time). Can be damaged by shock.', topic: 'Memory & Storage' },
  { term: 'SSD', def: 'Solid State Drive — flash memory, no moving parts, expensive per GB, fast (~0.1ms access). Shock-resistant.', topic: 'Memory & Storage' },
  { term: 'Optical Storage', def: 'CD/DVD/Blu-ray — uses laser to read/write pits on disc. Portable, cheap. Slower than SSD/HDD. Good for distribution.', topic: 'Memory & Storage' },
  { term: 'Flash/USB Storage', def: 'Portable flash memory. Rewritable. Smaller capacity than HDD but convenient. Examples: USB drives, memory cards.', topic: 'Memory & Storage' },
  { term: 'Bit', def: 'Smallest unit of data: 0 or 1.', topic: 'Memory & Storage' },
  { term: 'Byte', def: '8 bits. Can store 2⁸ = 256 different values (0–255).', topic: 'Memory & Storage' },
  { term: 'Kilobyte (KB)', def: '1,024 bytes (2¹⁰).', topic: 'Memory & Storage' },
  { term: 'Megabyte (MB)', def: '1,024 KB = 1,048,576 bytes.', topic: 'Memory & Storage' },
  { term: 'Gigabyte (GB)', def: '1,024 MB.', topic: 'Memory & Storage' },
  { term: 'Terabyte (TB)', def: '1,024 GB.', topic: 'Memory & Storage' },
];

const GCSE_NETWORKS: Flashcard[] = [
  { term: 'LAN', def: 'Local Area Network — covers a small area (building/campus). Usually owned by one organisation. Fast and secure.', topic: 'Networks' },
  { term: 'WAN', def: 'Wide Area Network — covers large geographic areas. Uses public/leased infrastructure. The internet is the largest WAN.', topic: 'Networks' },
  { term: 'Router', def: 'Directs (routes) data packets between networks using IP addresses. Connects home/office network to the internet.', topic: 'Networks' },
  { term: 'Switch', def: 'Sends data to the correct device on a LAN using MAC addresses. More efficient than a hub as it doesn\'t broadcast to all.', topic: 'Networks' },
  { term: 'IP Address', def: 'Unique numerical label identifying a device on a network. IPv4: 32-bit (e.g. 192.168.1.1). IPv6: 128-bit. Used for routing.', topic: 'Networks' },
  { term: 'MAC Address', def: 'Unique hardware address built into a network interface card. 48-bit. Used within local networks to identify devices.', topic: 'Networks' },
  { term: 'DNS', def: 'Domain Name System — translates domain names (e.g. bbc.co.uk) into IP addresses so packets can be routed.', topic: 'Networks' },
  { term: 'Packet Switching', def: 'Data split into packets. Each routed independently across the network. Reassembled at destination. Efficient use of links.', topic: 'Networks' },
  { term: 'Star Topology', def: 'All devices connect to a central switch. If switch fails, whole network fails. If one cable fails, only that device is affected.', topic: 'Networks' },
  { term: 'Mesh Topology', def: 'Each device connects to several others. Highly resilient — multiple routes exist. Expensive to set up.', topic: 'Networks' },
  { term: 'HTTP/HTTPS', def: 'HyperText Transfer Protocol — for web pages. HTTPS adds TLS encryption and authentication. Port 80/443.', topic: 'Networks' },
  { term: 'Bandwidth', def: 'Maximum data transfer rate across a network connection. Measured in Mbps/Gbps. Higher = faster transfer.', topic: 'Networks' },
  { term: 'Wi-Fi', def: 'Wireless networking using radio waves. Devices connect to a wireless access point. Convenient but can be slower than wired.', topic: 'Networks' },
  { term: 'Ethernet', def: 'Wired networking standard. Uses copper/fibre cables. Faster and more reliable than Wi-Fi. Used in LANs.', topic: 'Networks' },
  { term: 'TCP/IP', def: 'Protocol suite for internet communication. TCP: reliable, ordered delivery. IP: addressing and routing. Split into 4 layers.', topic: 'Networks' },
];

const GCSE_SECURITY: Flashcard[] = [
  { term: 'Malware', def: 'Malicious software — designed to harm, disrupt or gain unauthorised access. Includes viruses, worms, ransomware, spyware, adware.', topic: 'Security' },
  { term: 'Virus', def: 'Malware that attaches to legitimate files. Spreads when infected files are shared. Requires user action to spread.', topic: 'Security' },
  { term: 'Worm', def: 'Self-replicating malware that spreads automatically across networks without user action.', topic: 'Security' },
  { term: 'Ransomware', def: 'Encrypts victim\'s files and demands payment for the decryption key. Makes data completely inaccessible.', topic: 'Security' },
  { term: 'Spyware', def: 'Secretly monitors user activity and collects data (keystrokes, passwords, browsing). Sends to attacker.', topic: 'Security' },
  { term: 'Phishing', def: 'Fake emails/websites tricking users into revealing passwords or personal data. Impersonates trusted organisations.', topic: 'Security' },
  { term: 'Brute Force Attack', def: 'Systematically tries every possible password until the correct one is found. Defeated by complex passwords and lockout policies.', topic: 'Security' },
  { term: 'SQL Injection', def: 'Malicious SQL inserted into an input field to manipulate a database query. Prevented by parameterised queries/input validation.', topic: 'Security' },
  { term: 'Social Engineering', def: 'Manipulating people (not systems) to reveal confidential information. Exploits human trust and psychology.', topic: 'Security' },
  { term: 'DDoS Attack', def: 'Distributed Denial of Service — botnet floods a server with traffic making it unavailable to legitimate users.', topic: 'Security' },
  { term: 'Firewall', def: 'Monitors and filters incoming/outgoing network traffic based on security rules. Can be hardware or software.', topic: 'Security' },
  { term: 'Encryption', def: 'Converts readable data (plaintext) into unreadable ciphertext using a key. Only decryptable with correct key.', topic: 'Security' },
  { term: 'Two-Factor Authentication', def: 'Login requires two proofs: something you know (password) + something you have (phone code) or something you are (biometric).', topic: 'Security' },
  { term: 'Penetration Testing', def: 'Authorised simulated attack to find security vulnerabilities before real attackers do. Also called ethical hacking.', topic: 'Security' },
];

const GCSE_SYSTEMS_SOFTWARE: Flashcard[] = [
  { term: 'Operating System', def: 'System software managing hardware resources, providing a user interface, managing files/processes and enabling applications to run.', topic: 'Systems Software' },
  { term: 'Utility Software', def: 'Programs that perform maintenance tasks. Examples: antivirus, disk defragmenter, file compression, backup software.', topic: 'Systems Software' },
  { term: 'Device Driver', def: 'Software allowing the OS to communicate with a specific hardware device. Translates OS commands to device-specific signals.', topic: 'Systems Software' },
  { term: 'Memory Management', def: 'OS function: allocates RAM to programs, moves data to virtual memory, prevents programs interfering with each other.', topic: 'Systems Software' },
  { term: 'Multitasking', def: 'OS ability to run multiple programs apparently simultaneously by rapidly switching between them.', topic: 'Systems Software' },
  { term: 'Compiler', def: 'Translates entire high-level source code to machine code BEFORE execution. Creates standalone executable. Fast at runtime.', topic: 'Systems Software' },
  { term: 'Interpreter', def: 'Translates and executes high-level code line by line AT runtime. No separate executable produced. Easier to debug.', topic: 'Systems Software' },
  { term: 'Assembler', def: 'Translates assembly language mnemonics into machine code. One assembly instruction → one machine code instruction.', topic: 'Systems Software' },
  { term: 'Machine Code', def: 'Binary instructions directly executed by the CPU. Specific to processor architecture. The lowest level of code.', topic: 'Systems Software' },
  { term: 'High-Level Language', def: 'Programming language close to human language. Easier to write and debug. Must be compiled or interpreted. Examples: Python, Java.', topic: 'Systems Software' },
];

const GCSE_ETHICAL: Flashcard[] = [
  { term: 'Computer Misuse Act 1990', def: 'UK law making three offences: (1) unauthorised access, (2) unauthorised access with intent to commit further crime, (3) unauthorised modification of data.', topic: 'Legal Issues' },
  { term: 'Data Protection Act / GDPR', def: 'Regulates how personal data is stored and used. Data must be: collected lawfully, kept accurate, stored securely, not kept longer than needed.', topic: 'Legal Issues' },
  { term: 'Copyright Law', def: 'Protects creators\' original works (software, music, images). Cannot copy, distribute or modify without permission.', topic: 'Legal Issues' },
  { term: 'Open Source', def: 'Software with freely available source code. Anyone can view, modify and distribute it. Usually free. Examples: Linux, Firefox.', topic: 'Ethics' },
  { term: 'Proprietary Software', def: 'Software owned by a company. Source code is not available. Requires purchase/licence. Examples: Microsoft Office, Photoshop.', topic: 'Ethics' },
  { term: 'Digital Divide', def: 'Gap between those with and without access to digital technology. Causes: cost, geography, age, disability. Creates inequality.', topic: 'Ethics' },
  { term: 'Privacy', def: 'Right to control your personal information. Threatened by data collection, surveillance, hacking and social media sharing.', topic: 'Ethics' },
  { term: 'Environmental Impact', def: 'Computing causes: energy use (data centres), e-waste from old devices, mining for rare metals. Offset by: paperless working, remote work.', topic: 'Ethics' },
];

const GCSE_ALGORITHMS: Flashcard[] = [
  { term: 'Algorithm', def: 'A precise, finite, unambiguous set of steps for solving a problem. Must terminate and produce a correct result.', topic: 'Algorithms' },
  { term: 'Decomposition', def: 'Breaking a complex problem into smaller, manageable sub-problems. Each solved independently then combined.', topic: 'Algorithms' },
  { term: 'Abstraction', def: 'Removing irrelevant detail to focus on essentials. E.g. a map ignores grass and buildings but shows roads and distances.', topic: 'Algorithms' },
  { term: 'Linear Search', def: 'Checks each element one by one from start. O(n) worst case. Works on unsorted data. Simple but slow for large lists.', topic: 'Algorithms' },
  { term: 'Binary Search', def: 'Halves search space each step. O(log n). Requires sorted list. Compare to middle; search left or right half.', topic: 'Algorithms' },
  { term: 'Bubble Sort', def: 'Repeatedly swaps adjacent elements if out of order. O(n²) worst, O(n) best (already sorted). Simple but inefficient for large data.', topic: 'Algorithms' },
  { term: 'Merge Sort', def: 'Divide-and-conquer: split in half recursively → sort each half → merge back. O(n log n) always. More efficient than bubble sort.', topic: 'Algorithms' },
  { term: 'Insertion Sort', def: 'Builds sorted array by inserting each element into correct position. O(n²) worst, O(n) best. Good for small or nearly-sorted data.', topic: 'Algorithms' },
  { term: 'Trace Table', def: 'Table tracking variable values as an algorithm executes line by line. Used to find logic errors (dry running).', topic: 'Algorithms' },
  { term: 'O(n)', def: 'Linear time complexity — time grows proportionally to input size. Example: linear search.', topic: 'Algorithms' },
  { term: 'O(n²)', def: 'Quadratic time complexity — time grows as square of input. Example: bubble sort. Much slower for large inputs.', topic: 'Algorithms' },
  { term: 'O(log n)', def: 'Logarithmic time complexity — halves problem each step. Example: binary search. Very efficient for large inputs.', topic: 'Algorithms' },
];

const GCSE_PROGRAMMING: Flashcard[] = [
  { term: 'Sequence', def: 'Executing instructions in order, one after another. The most basic programming construct.', topic: 'Programming' },
  { term: 'Selection', def: 'A decision — different code executes depending on a condition. Implemented with IF / ELSE IF / ELSE.', topic: 'Programming' },
  { term: 'Iteration', def: 'Repetition — a block of code runs multiple times. FOR (count-controlled) or WHILE (condition-controlled).', topic: 'Programming' },
  { term: 'Variable', def: 'Named memory location storing a value that can change during program execution.', topic: 'Programming' },
  { term: 'Constant', def: 'Named value that cannot change during execution. Improves readability. Example: PI = 3.14159.', topic: 'Programming' },
  { term: 'Integer', def: 'Whole number data type. No decimal point. Examples: -5, 0, 42, 1000.', topic: 'Data Types' },
  { term: 'Float/Real', def: 'Decimal number data type. Examples: 3.14, -0.5, 2.0.', topic: 'Data Types' },
  { term: 'String', def: 'Sequence of characters (text). Written in quotes. Not a number — "123" cannot be added to 456 without casting.', topic: 'Data Types' },
  { term: 'Boolean', def: 'Data type with only two values: True or False. Used in conditions and selection.', topic: 'Data Types' },
  { term: 'Casting', def: 'Converting a value from one data type to another. int("5")=5, str(42)="42", float("3.14")=3.14.', topic: 'Programming' },
  { term: 'Array', def: 'Stores multiple values of the same type. Accessed by index (0-based). Fixed size in most languages.', topic: 'Programming' },
  { term: 'Subroutine', def: 'Named reusable block of code. Avoids repetition. Can have parameters. A function returns a value; a procedure does not.', topic: 'Programming' },
  { term: 'Parameter', def: 'Variable in a subroutine definition that receives a value (argument) when the subroutine is called.', topic: 'Programming' },
  { term: 'Validation', def: 'Checking data is reasonable and within expected range before processing. Types: range, presence, type, length, format.', topic: 'Programming' },
  { term: 'Authentication', def: 'Verifying a user is who they claim to be. Usually username + password. Can include 2FA.', topic: 'Programming' },
  { term: 'MOD operator', def: 'Returns the remainder after integer division. 10 MOD 3 = 1. Used to check even/odd: n MOD 2 = 0 → even.', topic: 'Programming' },
];

const GCSE_DATA_REP: Flashcard[] = [
  { term: 'Binary', def: 'Base-2 number system using only 0 and 1. All computer data stored as binary.', topic: 'Data Representation' },
  { term: 'Hexadecimal', def: 'Base-16. Digits 0–9, A–F. Each hex digit = 4 bits (one nibble). Compact way to represent binary. Used for colours and memory addresses.', topic: 'Data Representation' },
  { term: 'Two\'s Complement', def: 'Method for representing negative integers in binary. To negate: flip all bits then add 1. 8-bit range: -128 to +127.', topic: 'Data Representation' },
  { term: 'ASCII', def: '7/8-bit character encoding. A=65, a=97, 0=48. Covers English characters only.', topic: 'Data Representation' },
  { term: 'Unicode', def: 'International encoding — up to 32 bits. Covers 1M+ characters including all world scripts, symbols and emoji.', topic: 'Data Representation' },
  { term: 'Pixel', def: 'Smallest element of a digital image (picture element). Each pixel stores a colour value in binary.', topic: 'Data Representation' },
  { term: 'Colour Depth', def: 'Bits per pixel. 1-bit: 2 colours; 8-bit: 256 colours; 24-bit (True Colour): 16.7M colours. More bits = larger file.', topic: 'Data Representation' },
  { term: 'Image File Size', def: 'Width × Height (pixels) × Colour Depth (bits) ÷ 8 = bytes. Higher resolution or colour depth = larger file.', topic: 'Data Representation' },
  { term: 'Sample Rate', def: 'Number of audio samples per second (Hz). 44,100 Hz = CD quality. Higher = better quality + larger file.', topic: 'Data Representation' },
  { term: 'Bit Depth (Audio)', def: 'Bits per audio sample. 16-bit (CD) = 65,536 volume levels. Higher bit depth = wider dynamic range + larger file.', topic: 'Data Representation' },
  { term: 'Lossy Compression', def: 'Permanently removes data to reduce file size. Quality reduced. Cannot be reversed. Examples: JPEG, MP3.', topic: 'Data Representation' },
  { term: 'Lossless Compression', def: 'Reduces file size without losing any data. Original perfectly reconstructed. Examples: PNG, ZIP, RLE.', topic: 'Data Representation' },
  { term: 'Run-Length Encoding (RLE)', def: 'Lossless compression storing runs of identical values as (count, value). E.g. AAABBC → (3,A)(2,B)(1,C). Best for images with large uniform areas.', topic: 'Data Representation' },
  { term: 'Binary Addition', def: '0+0=0, 0+1=1, 1+1=10 (write 0, carry 1), 1+1+1=11 (write 1, carry 1). Overflow occurs when result exceeds bit limit.', topic: 'Data Representation' },
  { term: 'Overflow', def: 'When the result of a calculation is too large to fit in the allocated number of bits. The extra bits are lost, causing an incorrect result.', topic: 'Data Representation' },
];

const GCSE_BOOLEAN_LOGIC: Flashcard[] = [
  { term: 'AND gate', def: 'Output is 1 only when ALL inputs are 1. Truth table: 0,0→0; 0,1→0; 1,0→0; 1,1→1.', topic: 'Boolean Logic' },
  { term: 'OR gate', def: 'Output is 1 when ANY input is 1. Truth table: 0,0→0; 0,1→1; 1,0→1; 1,1→1.', topic: 'Boolean Logic' },
  { term: 'NOT gate', def: 'Inverts the input. Also called inverter. 0→1, 1→0. Single input, single output.', topic: 'Boolean Logic' },
  { term: 'NAND gate', def: 'NOT AND — output is 0 only when ALL inputs are 1. Inverse of AND. Universal gate.', topic: 'Boolean Logic' },
  { term: 'NOR gate', def: 'NOT OR — output is 1 only when ALL inputs are 0. Inverse of OR. Universal gate.', topic: 'Boolean Logic' },
  { term: 'XOR gate', def: 'Exclusive OR — output is 1 when inputs are DIFFERENT. 0,0→0; 0,1→1; 1,0→1; 1,1→0.', topic: 'Boolean Logic' },
  { term: 'Truth Table', def: 'Table showing output for every possible combination of inputs. For n inputs, there are 2ⁿ rows.', topic: 'Boolean Logic' },
  { term: 'Boolean Expression', def: 'Mathematical expression using AND (·), OR (+), NOT (¬ or \'). E.g. A · (B + ¬C).', topic: 'Boolean Logic' },
  { term: 'De Morgan\'s Law', def: '¬(A·B) = ¬A+¬B and ¬(A+B) = ¬A·¬B. Allows conversion between NAND/NOR and AND/OR/NOT expressions.', topic: 'Boolean Logic' },
];

// ══════════════════════════════════════════════════════════════════
// OCR A LEVEL H446 DECKS
// ══════════════════════════════════════════════════════════════════

const ALEVEL_PROCESSORS: Flashcard[] = [
  { term: 'Harvard Architecture', def: 'Separate memory and buses for instructions and data. Avoids Von Neumann bottleneck; simultaneous fetch possible. Used in microcontrollers and DSPs.', topic: 'Processors' },
  { term: 'Von Neumann Bottleneck', def: 'CPU and memory share a single bus — memory is much slower than CPU. Cache mitigates this.', topic: 'Processors' },
  { term: 'Pipelining', def: 'Overlapping fetch, decode, execute stages of different instructions simultaneously to increase CPU throughput. Hazards: data, control, structural.', topic: 'Processors' },
  { term: 'RISC', def: 'Reduced Instruction Set Computer. Small set of simple instructions, each taking one clock cycle. Easier to pipeline. Examples: ARM processors.', topic: 'Processors' },
  { term: 'CISC', def: 'Complex Instruction Set Computer. Large set including complex multi-cycle instructions. Fewer instructions needed per program. Example: x86.', topic: 'Processors' },
  { term: 'Superscalar', def: 'CPU with multiple execution units that can execute several instructions simultaneously within one clock cycle.', topic: 'Processors' },
  { term: 'Interrupt', def: 'Signal to CPU to pause current execution and handle a higher-priority event. Types: hardware (I/O), software, timer, power failure.', topic: 'Processors' },
  { term: 'Interrupt Service Routine (ISR)', def: 'Program that handles a specific interrupt. CPU saves state, runs ISR, then restores and resumes original program.', topic: 'Processors' },
  { term: 'GPU', def: 'Graphics Processing Unit. Thousands of small parallel cores ideal for graphics rendering, AI training and scientific simulation.', topic: 'Processors' },
  { term: 'Multiprocessor', def: 'System with multiple CPUs sharing memory. Provides true parallel execution for different tasks.', topic: 'Processors' },
  { term: 'Multicore', def: 'Single CPU chip containing multiple independent cores. Each core can process different instructions simultaneously.', topic: 'Processors' },
  { term: 'Clock Speed', def: 'CPU cycles per second (GHz). One cycle = minimum time for one operation. More cycles = more instructions per second.', topic: 'Processors' },
];

const ALEVEL_SOFTWARE_DEV: Flashcard[] = [
  { term: 'Waterfall Model', def: 'Sequential development: requirements → design → implementation → testing → maintenance. Each phase complete before next. Inflexible to change.', topic: 'Software Development' },
  { term: 'Agile Development', def: 'Iterative, flexible approach. Short sprints delivering working software. Customer feedback shapes each iteration. Examples: Scrum, XP.', topic: 'Software Development' },
  { term: 'Spiral Model', def: 'Risk-driven iterative model. Each loop: determine objectives → identify/resolve risks → develop/test → plan next iteration.', topic: 'Software Development' },
  { term: 'Extreme Programming (XP)', def: 'Agile methodology: pair programming, test-driven development, continuous integration, simple design, frequent small releases.', topic: 'Software Development' },
  { term: 'Interpreter', def: 'Translates and executes source code line by line at runtime. No standalone executable. Easier debugging. Slower execution.', topic: 'Software Development' },
  { term: 'Compiler', def: 'Translates entire source code to machine code before execution. Creates standalone executable. Fast at runtime. Harder to debug.', topic: 'Software Development' },
  { term: 'Bytecode', def: 'Intermediate representation compiled from source code then interpreted by a virtual machine (JVM). Platform-independent. Example: Java.', topic: 'Software Development' },
  { term: 'IDE', def: 'Integrated Development Environment. Provides code editor, debugger, compiler/interpreter, syntax highlighting, autocomplete in one tool.', topic: 'Software Development' },
  { term: 'Version Control', def: 'Tracks changes to code over time. Allows rollback, branching, merging. Examples: Git, SVN. Essential for team development.', topic: 'Software Development' },
  { term: 'Test-Driven Development', def: 'Write failing tests first, then write minimum code to pass them. Ensures code is testable and meets requirements.', topic: 'Software Development' },
  { term: 'Alpha Testing', def: 'Testing by developers/internal testers before release. Finds major bugs. Controlled environment.', topic: 'Software Development' },
  { term: 'Beta Testing', def: 'Testing by a limited group of real users before full release. Finds real-world bugs and usability issues.', topic: 'Software Development' },
  { term: 'OOP', def: 'Object-Oriented Programming. Models programs as interacting objects. Key concepts: classes, objects, encapsulation, inheritance, polymorphism.', topic: 'Software Development' },
  { term: 'Encapsulation', def: 'Bundling data (attributes) and methods within a class, restricting direct access to internal state via access modifiers.', topic: 'Software Development' },
  { term: 'Inheritance', def: 'A subclass automatically acquires attributes and methods from a superclass. Enables code reuse and hierarchical relationships.', topic: 'Software Development' },
  { term: 'Polymorphism', def: 'Same method name behaves differently depending on the object calling it. Achieved via overriding or overloading.', topic: 'Software Development' },
];

const ALEVEL_EXCHANGING_DATA: Flashcard[] = [
  { term: 'Compression', def: 'Reducing file size. Lossy (irreversible, e.g. JPEG, MP3) or Lossless (reversible, e.g. PNG, ZIP). Reduces storage and transmission time.', topic: 'Exchanging Data' },
  { term: 'Run-Length Encoding', def: 'Lossless: stores runs of identical values as (count, value). E.g. AAAA → (4,A). Best on images with large uniform areas.', topic: 'Exchanging Data' },
  { term: 'Huffman Coding', def: 'Lossless compression assigning shorter codes to frequent characters. Builds a binary tree; variable-length codes. Optimal prefix code.', topic: 'Exchanging Data' },
  { term: 'Symmetric Encryption', def: 'Same key for encryption and decryption. Fast. Problem: securely sharing the key. Example: AES.', topic: 'Exchanging Data' },
  { term: 'Asymmetric Encryption', def: 'Public key encrypts; private key decrypts. No private key exchange needed. Slower. Example: RSA. Used in HTTPS.', topic: 'Exchanging Data' },
  { term: 'Digital Signature', def: 'Sender encrypts hash of message with their private key. Receiver decrypts with sender\'s public key. Proves authenticity and integrity.', topic: 'Exchanging Data' },
  { term: 'Digital Certificate', def: 'Issued by Certificate Authority. Contains website\'s public key and identity. Verifies you\'re talking to the real server. Used in HTTPS.', topic: 'Exchanging Data' },
  { term: 'Hashing', def: 'One-way function producing fixed-length hash from any input. Same input → same hash. Tiny change → completely different hash. Cannot reverse.', topic: 'Exchanging Data' },
  { term: 'TCP/IP Model', def: 'Four layers: Application (HTTP, FTP), Transport (TCP/UDP, port numbers), Internet (IP, routing), Link (physical/MAC addresses).', topic: 'Exchanging Data' },
  { term: 'Packet', def: 'Unit of data for transmission. Contains header (source/dest IP, port, sequence number) and payload (data). Also may have trailer (checksum).', topic: 'Exchanging Data' },
  { term: 'Circuit Switching', def: 'Dedicated connection established before data transfer. Telephone networks. Guaranteed bandwidth but wastes capacity when idle.', topic: 'Exchanging Data' },
  { term: 'Packet Switching', def: 'Data split into independent packets each routed separately. Efficient use of network. No dedicated path. Used by internet.', topic: 'Exchanging Data' },
  { term: 'SMTP', def: 'Simple Mail Transfer Protocol — sends emails between servers. Port 25. POP3/IMAP for receiving email.', topic: 'Exchanging Data' },
  { term: 'FTP', def: 'File Transfer Protocol — transfers files between client and server. Port 20/21. SFTP adds encryption.', topic: 'Exchanging Data' },
];

const ALEVEL_DATA_TYPES: Flashcard[] = [
  { term: 'Stack', def: 'LIFO structure. Operations: push, pop, peek, isEmpty. Used for function calls (call stack), undo operations, expression evaluation.', topic: 'Data Types & Structures' },
  { term: 'Queue', def: 'FIFO structure. Operations: enqueue, dequeue, isEmpty. Used for print queues, CPU scheduling, breadth-first search.', topic: 'Data Types & Structures' },
  { term: 'Linked List', def: 'Dynamic structure where each node holds data and a pointer to the next node. No contiguous memory needed. O(n) search.', topic: 'Data Types & Structures' },
  { term: 'Binary Search Tree', def: 'Left child < parent < right child. O(log n) search in balanced tree. Can degenerate to O(n) if unbalanced.', topic: 'Data Types & Structures' },
  { term: 'Hash Table', def: 'Maps keys to values using a hash function. Average O(1) lookup, insert, delete. Collisions resolved by chaining or open addressing.', topic: 'Data Types & Structures' },
  { term: 'Graph', def: 'Set of vertices (nodes) connected by edges. Can be directed/undirected, weighted/unweighted. Used for networks, maps, social connections.', topic: 'Data Types & Structures' },
  { term: 'Adjacency Matrix', def: '2D array where [i][j] = 1 (or weight) if edge exists between i and j. O(1) edge check but O(V²) space.', topic: 'Data Types & Structures' },
  { term: 'Adjacency List', def: 'Each vertex stores a list of its neighbours. Space-efficient for sparse graphs: O(V+E) space.', topic: 'Data Types & Structures' },
  { term: 'Dijkstra\'s Algorithm', def: 'Finds shortest path from source to all nodes in a weighted graph. Greedy algorithm using a priority queue. Non-negative weights only.', topic: 'Data Types & Structures' },
  { term: 'DFS', def: 'Depth-First Search — explores as deep as possible using a stack/recursion. Used for cycle detection, topological sort, maze solving.', topic: 'Data Types & Structures' },
  { term: 'BFS', def: 'Breadth-First Search — explores level by level using a queue. Finds shortest path in unweighted graphs.', topic: 'Data Types & Structures' },
  { term: 'Pre-order Traversal', def: 'Root → Left → Right. Used to copy or serialise a tree.', topic: 'Data Types & Structures' },
  { term: 'In-order Traversal', def: 'Left → Root → Right. Gives BST values in ascending sorted order.', topic: 'Data Types & Structures' },
  { term: 'Post-order Traversal', def: 'Left → Right → Root. Used to delete a tree or evaluate expression trees.', topic: 'Data Types & Structures' },
  { term: 'Floating Point', def: 'Represents real numbers as mantissa × 2^exponent. More exponent bits = bigger range. More mantissa bits = more precision.', topic: 'Data Types & Structures' },
  { term: 'Normalised Floating Point', def: 'Mantissa begins with 0.1 (positive) or 1.0 (negative) in binary. Maximises precision by avoiding leading zeros.', topic: 'Data Types & Structures' },
];

const ALEVEL_LEGAL_ETHICAL: Flashcard[] = [
  { term: 'Computer Misuse Act 1990', def: 'UK law: (1) unauthorised access, (2) unauthorised access with intent to commit further crime, (3) unauthorised modification of computer material.', topic: 'Legal & Ethical' },
  { term: 'Data Protection Act / GDPR', def: 'Regulates personal data: collect lawfully, keep accurate, store securely, limited retention. Rights: access, rectification, erasure, portability.', topic: 'Legal & Ethical' },
  { term: 'Copyright', def: 'Automatic legal protection for original creative works. Prevents copying, distribution or modification without permission.', topic: 'Legal & Ethical' },
  { term: 'Digital Divide', def: 'Gap between those with and without access to digital technology. Causes: cost, geography, age, disability. Reinforces existing inequalities.', topic: 'Legal & Ethical' },
  { term: 'Net Neutrality', def: 'Principle that ISPs must treat all internet traffic equally — no throttling or preferential treatment for specific services.', topic: 'Legal & Ethical' },
  { term: 'AI Ethics', def: 'Issues: bias in training data, lack of transparency (black box), job displacement, autonomous weapons, privacy, accountability.', topic: 'Legal & Ethical' },
  { term: 'Open Source', def: 'Source code freely available to inspect, modify and redistribute. Promotes transparency, community development and security review.', topic: 'Legal & Ethical' },
];

const ALEVEL_COMPUTATIONAL_THINKING: Flashcard[] = [
  { term: 'Abstraction', def: 'Removing irrelevant detail to create a model of a problem. Levels: problem, algorithm, program, machine code.', topic: 'Computational Thinking' },
  { term: 'Decomposition', def: 'Breaking a complex problem into smaller sub-problems each solved independently. Foundation of structured and OOP design.', topic: 'Computational Thinking' },
  { term: 'Tractable Problem', def: 'Solvable in polynomial time O(nᵏ) — practically solvable for large inputs. Examples: sorting, searching.', topic: 'Computational Thinking' },
  { term: 'Intractable Problem', def: 'No known polynomial-time algorithm. Impractical for large inputs. Example: Travelling Salesman Problem O(n!).', topic: 'Computational Thinking' },
  { term: 'Heuristic', def: 'Method that finds a good (not necessarily optimal) solution to an intractable problem within reasonable time. Example: nearest neighbour for TSP.', topic: 'Computational Thinking' },
  { term: 'Backtracking', def: 'Algorithm that tries paths and undoes (backtracks) when a dead end is reached. Used for constraint satisfaction: Sudoku, N-Queens.', topic: 'Computational Thinking' },
  { term: 'Dynamic Programming', def: 'Solves overlapping subproblems once and stores results (memoisation/tabulation). Guarantees global optimum. Example: knapsack, Fibonacci.', topic: 'Computational Thinking' },
  { term: 'Divide and Conquer', def: 'Divides problem into independent subproblems, solves each recursively, combines results. Example: merge sort, binary search.', topic: 'Computational Thinking' },
  { term: 'Greedy Algorithm', def: 'Makes locally optimal choice at each step hoping for global optimum. Fast but not always optimal. Examples: Dijkstra\'s, Prim\'s, Kruskal\'s.', topic: 'Computational Thinking' },
  { term: 'Turing Machine', def: 'Theoretical model with infinite tape, read/write head and state transition table. Defines limits of computability.', topic: 'Computational Thinking' },
  { term: 'Halting Problem', def: 'Turing proved no algorithm can determine whether any arbitrary program will halt. Undecidable problem — limits of computation.', topic: 'Computational Thinking' },
];

const ALEVEL_ALGORITHMS: Flashcard[] = [
  { term: 'O(1)', def: 'Constant time — independent of input size. Example: array index access, hash table lookup.', topic: 'Algorithms' },
  { term: 'O(log n)', def: 'Logarithmic — halves problem each step. Example: binary search, balanced BST search. Very efficient.', topic: 'Algorithms' },
  { term: 'O(n)', def: 'Linear — proportional to input size. Example: linear search, traversing a linked list.', topic: 'Algorithms' },
  { term: 'O(n log n)', def: 'Linearithmic. Example: merge sort, quicksort (average case), heapsort. Efficient for sorting.', topic: 'Algorithms' },
  { term: 'O(n²)', def: 'Quadratic — nested loops. Example: bubble sort, insertion sort (worst), selection sort. Impractical for large inputs.', topic: 'Algorithms' },
  { term: 'O(2ⁿ)', def: 'Exponential — doubles with each added element. Example: recursive Fibonacci without memoisation. Intractable for large n.', topic: 'Algorithms' },
  { term: 'Merge Sort', def: 'Divide-and-conquer: split recursively, sort each half, merge. O(n log n) always. Stable. O(n) extra space.', topic: 'Algorithms' },
  { term: 'Quicksort', def: 'Choose pivot, partition around it, recurse on both sides. O(n log n) average, O(n²) worst (bad pivot). In-place but not stable.', topic: 'Algorithms' },
  { term: 'Prim\'s Algorithm', def: 'Greedy MST algorithm. Start at any node; repeatedly add cheapest edge connecting tree to new vertex. Result: n−1 edges.', topic: 'Algorithms' },
  { term: 'Kruskal\'s Algorithm', def: 'Greedy MST algorithm. Sort all edges by weight; add edges that don\'t form a cycle. Uses union-find structure.', topic: 'Algorithms' },
  { term: 'A* Search', def: 'Dijkstra\'s + heuristic. f(n) = g(n) + h(n). Explores fewer nodes when heuristic is admissible. Optimal pathfinding.', topic: 'Algorithms' },
  { term: 'Memoisation', def: 'Cache function call results so they aren\'t recalculated. Converts O(2ⁿ) recursion to O(n). Top-down dynamic programming.', topic: 'Algorithms' },
];

const ALEVEL_PROGRAMMING: Flashcard[] = [
  { term: 'Recursion', def: 'A subroutine that calls itself. Must have a base case (stops recursion) and recursive case (moves toward base case). Uses call stack.', topic: 'Programming' },
  { term: 'Stack Frame', def: 'Memory allocated on the call stack for each function call. Stores local variables, return address and parameters. Freed on return.', topic: 'Programming' },
  { term: 'Stack Overflow', def: 'Occurs when too many nested function calls exhaust the call stack. Common with infinite recursion (missing base case).', topic: 'Programming' },
  { term: 'Passing by Value', def: 'A copy of the argument is passed. Changes inside the subroutine do not affect the original variable.', topic: 'Programming' },
  { term: 'Passing by Reference', def: 'The memory address is passed. Changes inside the subroutine DO affect the original variable.', topic: 'Programming' },
  { term: 'Higher-Order Function', def: 'A function that takes other functions as arguments or returns a function. Examples: map, filter, fold/reduce.', topic: 'Programming' },
  { term: 'Lambda / Anonymous Function', def: 'A function defined without a name, usually passed as an argument. Example: lambda x: x * 2.', topic: 'Programming' },
  { term: 'Pure Function', def: 'Always returns the same output for the same inputs and has no side effects. Core concept in functional programming.', topic: 'Programming' },
  { term: 'Immutability', def: 'Once created, a value cannot be changed. New data structures created instead of modifying existing ones. Core to functional programming.', topic: 'Programming' },
  { term: 'Tail Recursion', def: 'Recursive call is the last operation. Compilers can optimise to avoid stack growth. Equivalent to iteration.', topic: 'Programming' },
];

// ══════════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════════

export const FLASHCARD_DECKS: FlashcardDeck[] = [
  // OCR GCSE J277
  { id: 'gcse-systems-architecture', name: 'Systems Architecture', level: 'gcse', topic: '1.1', colour: '#00d4ff', cards: GCSE_SYSTEMS_ARCHITECTURE },
  { id: 'gcse-memory-storage', name: 'Memory & Storage', level: 'gcse', topic: '1.2', colour: '#00d4ff', cards: GCSE_MEMORY_STORAGE },
  { id: 'gcse-networks', name: 'Networks & Protocols', level: 'gcse', topic: '1.3', colour: '#00d4ff', cards: GCSE_NETWORKS },
  { id: 'gcse-security', name: 'Network Security', level: 'gcse', topic: '1.4', colour: '#00d4ff', cards: GCSE_SECURITY },
  { id: 'gcse-systems-software', name: 'Systems Software', level: 'gcse', topic: '1.5', colour: '#00d4ff', cards: GCSE_SYSTEMS_SOFTWARE },
  { id: 'gcse-ethical', name: 'Ethical, Legal & Cultural Issues', level: 'gcse', topic: '1.6', colour: '#00d4ff', cards: GCSE_ETHICAL },
  { id: 'gcse-algorithms', name: 'Algorithms', level: 'gcse', topic: '2.1', colour: '#7c3aed', cards: GCSE_ALGORITHMS },
  { id: 'gcse-programming', name: 'Programming Fundamentals', level: 'gcse', topic: '2.2', colour: '#7c3aed', cards: GCSE_PROGRAMMING },
  { id: 'gcse-data-rep', name: 'Data Representation', level: 'gcse', topic: '2.4', colour: '#7c3aed', cards: GCSE_DATA_REP },
  { id: 'gcse-boolean', name: 'Boolean Logic', level: 'gcse', topic: '2.4', colour: '#7c3aed', cards: GCSE_BOOLEAN_LOGIC },

  // OCR A Level H446
  { id: 'alevel-processors', name: 'Contemporary Processors', level: 'alevel', topic: '1.1', colour: '#a78bfa', cards: ALEVEL_PROCESSORS },
  { id: 'alevel-software-dev', name: 'Software & Software Development', level: 'alevel', topic: '1.2', colour: '#a78bfa', cards: ALEVEL_SOFTWARE_DEV },
  { id: 'alevel-exchanging-data', name: 'Exchanging Data', level: 'alevel', topic: '1.3', colour: '#a78bfa', cards: ALEVEL_EXCHANGING_DATA },
  { id: 'alevel-data-types', name: 'Data Types, Structures & Algorithms', level: 'alevel', topic: '1.4', colour: '#a78bfa', cards: ALEVEL_DATA_TYPES },
  { id: 'alevel-legal', name: 'Legal, Moral, Cultural & Ethical Issues', level: 'alevel', topic: '1.5', colour: '#a78bfa', cards: ALEVEL_LEGAL_ETHICAL },
  { id: 'alevel-computational-thinking', name: 'Elements of Computational Thinking', level: 'alevel', topic: '2.1', colour: '#00ff94', cards: ALEVEL_COMPUTATIONAL_THINKING },
  { id: 'alevel-algorithms', name: 'Problem Solving & Algorithms', level: 'alevel', topic: '2.2/2.3', colour: '#00ff94', cards: ALEVEL_ALGORITHMS },
  { id: 'alevel-programming', name: 'Programming Techniques', level: 'alevel', topic: '2.2', colour: '#00ff94', cards: ALEVEL_PROGRAMMING },
];

// Legacy support — flat object for the existing Flashcards.svelte component
export const FLASHCARD_DECKS_LEGACY: Record<string, { term: string; def: string; topic: string }[]> = Object.fromEntries(
  FLASHCARD_DECKS.map(d => [d.name, d.cards])
);
