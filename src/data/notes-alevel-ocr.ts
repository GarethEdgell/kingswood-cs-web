// ═══════════════════════════════════════════════════════════════════
// OCR A Level Computer Science (H446) — full-spec notes, spec-point level
// One spec point per sub-section of the H446 specification.
// ═══════════════════════════════════════════════════════════════════
import type { ALevelBoard, Section } from './notes-alevel';

const t = (heading: string, body: string): Section => ({ type: 'text', heading, body });
const kt = (term: string, def: string): Section => ({ type: 'keyterm', term, def });
const w = (label: string, code: string): Section => ({ type: 'worked', label, code });
const tip = (text: string): Section => ({ type: 'tip', text });
const err = (text: string): Section => ({ type: 'mistake', text });
const tbl = (headers: string[], rows: string[][]): Section => ({ type: 'table', headers, rows });

export const OCR_ALEVEL: ALevelBoard = {
  id: 'ocr', name: 'OCR A Level (H446)',
  topics: [

  // ══════════════ 1.1 PROCESSORS, I/O & STORAGE ══════════════
  { id: 'ocr-1', number: '1.1', name: 'Characteristics of Contemporary Processors', specPoints: [

    { id: '1.1.1', title: 'Structure & Function of the Processor',
      examTip: 'Learn the registers (PC, MAR, MDR, CIR, ACC) and exactly what moves where in each stage of the FDE cycle.',
      sections: [
        t('The CPU and its components', 'The <strong>processor (CPU)</strong> fetches, decodes and executes instructions. Key parts: the <strong>Control Unit (CU)</strong> coordinates and times all operations and decodes instructions; the <strong>Arithmetic Logic Unit (ALU)</strong> performs calculations and logical comparisons; <strong>registers</strong> are tiny, ultra-fast storage inside the CPU; and the <strong>buses</strong> carry data, addresses and control signals.'),
        tbl(['Register', 'Full name', 'Role'],
          [['PC', 'Program Counter', 'Holds the address of the NEXT instruction'],
           ['MAR', 'Memory Address Register', 'Holds the address being read from / written to'],
           ['MDR', 'Memory Data Register', 'Holds data/instruction just fetched from or to be written to memory'],
           ['CIR', 'Current Instruction Register', 'Holds the instruction currently being decoded/executed'],
           ['ACC', 'Accumulator', 'Holds the result of ALU calculations']]),
        tbl(['Bus', 'Direction', 'Carries'],
          [['Data bus', 'Bidirectional', 'Data and instructions between CPU and memory'],
           ['Address bus', 'Unidirectional (CPU → memory)', 'The memory address to access — width sets max addressable memory'],
           ['Control bus', 'Bidirectional', 'Control/timing signals (read, write, interrupt, clock)']]),
        w('The Fetch–Decode–Execute cycle', 'FETCH\n  1. Address in PC copied to MAR\n  2. Instruction at memory[MAR] copied to MDR\n  3. Instruction copied from MDR to CIR\n  4. PC incremented to point at next instruction\nDECODE\n  5. Control Unit decodes the instruction in CIR\nEXECUTE\n  6. Instruction carried out (ALU calc, data moved,\n     or PC changed for a branch/jump)\n  7. Interrupt register checked — then repeat'),
        t('Von Neumann vs Harvard', '<strong>Von Neumann</strong>: instructions and data share one memory and one bus — simple and general-purpose, but the shared bus is a bottleneck. <strong>Harvard</strong>: separate memories and buses for instructions and data, so both can be accessed at once — faster, used in embedded systems and DSPs.'),
        kt('Pipelining', 'Overlapping the FDE stages of consecutive instructions: while one instruction executes, the next is decoded and a third is fetched. Increases throughput without raising clock speed. A branch can cause a pipeline flush, losing the partly-processed instructions.'),
        t('Factors affecting performance', '<strong>Clock speed</strong> (cycles per second) — more cycles = more instructions, but heat limits it. <strong>Number of cores</strong> — each core can execute a separate instruction stream in parallel. <strong>Cache size and levels</strong> (L1/L2/L3) — more cache means fewer slow trips to main memory. <strong>Word length and bus width</strong> also matter.'),
        tip('"Compare two CPUs" questions: never name just one factor. Discuss clock speed AND cores AND cache together — e.g. a high clock speed helps single-threaded tasks while more cores help parallel workloads.'),
      ]
    },

    { id: '1.1.2', title: 'Types of Processor (CISC, RISC, GPU, Parallel)',
      sections: [
        tbl(['Feature', 'CISC', 'RISC'],
          [['Instructions', 'Many, complex, variable length', 'Few, simple, fixed length'],
           ['Cycles per instruction', 'Several', 'Usually one'],
           ['Hardware', 'Complex; fewer instructions in a program', 'Simpler; more instructions but each is fast'],
           ['Pipelining', 'Harder (variable-length instructions)', 'Easier (uniform instructions)'],
           ['Example use', 'Traditional desktop x86', 'Mobile/embedded (ARM)']]),
        kt('GPU (Graphics Processing Unit)', 'A processor with thousands of small cores optimised for performing the same operation on many data items at once (SIMD). Originally for graphics, now widely used for machine learning, simulations and any highly parallel, data-heavy task.'),
        kt('Multicore & parallel systems', 'A multicore CPU has multiple complete cores on one chip, each able to run a separate thread — true parallel execution. Parallel processing splits a task across cores. Limited by Amdahl’s law: the sequential portion of a task caps the possible speed-up, and not all problems parallelise well.'),
        kt('SIMD vs MIMD', 'SIMD (Single Instruction Multiple Data): one instruction applied to many data items simultaneously — GPUs. MIMD (Multiple Instruction Multiple Data): different cores run different instructions on different data — multicore CPUs.'),
        tip('A task only benefits from more cores if it can be split into parts that run independently. Inherently sequential tasks (each step needs the previous result) gain little from extra cores.'),
      ]
    },

    { id: '1.1.3', title: 'Input, Output & Storage Devices',
      sections: [
        t('Choosing a device', 'Pick devices by <strong>capacity</strong>, <strong>speed</strong>, <strong>portability</strong>, <strong>durability</strong>, <strong>reliability</strong> and <strong>cost per GB</strong>, matched to the use case (e.g. fast SSD for an OS drive, cheap magnetic for backups).'),
        tbl(['Storage type', 'Technology', 'Pros', 'Cons'],
          [['Magnetic (HDD)', 'Spinning platters, moving head', 'Cheap per GB, high capacity', 'Slow, fragile (moving parts)'],
           ['Solid state (SSD/flash)', 'NAND flash, no moving parts', 'Fast, silent, shock-resistant, low power', 'Dearer per GB, limited write cycles'],
           ['Optical (CD/DVD/Blu-ray)', 'Laser reads pits/lands', 'Cheap, removable, archival', 'Low capacity, slow, easily scratched']]),
        kt('RAM vs ROM', 'RAM is volatile read/write working memory holding the running OS, programs and data. ROM is non-volatile read-only memory holding firmware/the bootstrap (BIOS) used at start-up.'),
        kt('Virtual storage', 'Using secondary storage as if it were extra RAM (virtual memory), or storing data on remote servers (cloud). Virtual memory lets a system run programs larger than physical RAM by paging data to disk — but excessive paging causes "disk thrashing" and slowdown.'),
      ]
    },
  ]},

  // ══════════════ 1.2 SOFTWARE & SOFTWARE DEVELOPMENT ══════════════
  { id: 'ocr-2', number: '1.2', name: 'Software & Software Development', specPoints: [

    { id: '1.2.1', title: 'Operating Systems',
      examTip: 'Memory management and interrupt/scheduling questions are common — know paging, segmentation and the main scheduling algorithms.',
      sections: [
        t('Functions of an OS', 'The OS manages hardware and provides a platform for software. Core jobs: <strong>memory management</strong>, <strong>processor (CPU) scheduling</strong>, <strong>interrupt handling</strong>, <strong>file management</strong>, <strong>device management</strong> (via drivers), <strong>security</strong> and providing a <strong>user interface</strong>.'),
        tbl(['Memory technique', 'How it works', 'Note'],
          [['Paging', 'Memory split into fixed-size pages; programs loaded into any free frames', 'Pages need not be contiguous'],
           ['Segmentation', 'Memory split into variable-size logical segments (e.g. a whole module)', 'Matches program structure'],
           ['Virtual memory', 'Disk used as extra RAM; inactive pages swapped out', 'Too much swapping = thrashing']]),
        tbl(['Scheduling algorithm', 'Idea', 'Drawback'],
          [['Round robin', 'Each process gets a fixed time slice in turn', 'Ignores priority'],
           ['First come first served', 'Run in arrival order', 'A long job blocks short ones'],
           ['Shortest job first', 'Run the shortest job next', 'Long jobs may starve; needs run-time estimate'],
           ['Shortest remaining time', 'Pre-emptive SJF', 'Overhead; starvation'],
           ['Multi-level feedback queues', 'Several queues with different priorities', 'Complex to tune']]),
        kt('Interrupt', 'A signal telling the CPU something needs attention (I/O finished, error, timer). At the end of each FDE cycle the CPU checks the interrupt register; if a higher-priority interrupt is pending it saves its state to the stack, runs the Interrupt Service Routine (ISR), then restores its state.'),
        kt('Types of OS', 'Distributed (one OS across many machines), embedded (fixed function, low resources), multi-tasking (time-slicing), multi-user (many users share one machine), real-time (guaranteed response within a deadline — e.g. car braking).'),
        kt('BIOS, device drivers & virtual machines', 'The <strong>BIOS</strong> runs at power-on, tests hardware (POST) and loads the OS. <strong>Device drivers</strong> are OS programs that translate generic commands into device-specific instructions. A <strong>virtual machine</strong> runs an intermediate code (e.g. bytecode) on a software-emulated processor, giving portability and isolation.'),
      ]
    },

    { id: '1.2.2', title: 'Applications Generation & Translators',
      sections: [
        kt('Applications vs utilities', 'Application software does a user task (word processor, browser). Utility software maintains the system (disk defragmenter, backup, compression, anti-malware).'),
        kt('Open vs closed source', 'Open source: source code is freely available, modifiable and redistributable (e.g. Linux). Closed/proprietary: source is secret, used under licence (e.g. Windows). Trade-offs cover cost, support, security visibility and the right to modify.'),
        tbl(['Translator', 'Translates', 'Speed / output', 'Error reporting'],
          [['Compiler', 'Whole high-level program → machine code at once', 'Slow to compile, fast to run; standalone executable', 'All errors after compiling'],
           ['Interpreter', 'One line at a time, each run', 'Slower to run; no executable', 'Stops at first error — good for debugging'],
           ['Assembler', 'Assembly language → machine code (1:1)', 'Fast; very low level', 'Per instruction']]),
        w('Stages of compilation', '1. LEXICAL ANALYSIS\n   Source split into tokens; whitespace/comments removed;\n   identifiers added to the symbol table.\n2. SYNTAX ANALYSIS (parsing)\n   Tokens checked against grammar rules; builds a\n   parse/abstract syntax tree; reports syntax errors.\n3. SEMANTIC / CODE GENERATION\n   Object (machine) code produced from the tree.\n4. OPTIMISATION\n   Code improved to run faster / use less memory.'),
        kt('Linkers, loaders & libraries', 'A <strong>library</strong> is pre-written, tested, reusable code. A <strong>linker</strong> combines compiled modules and library code into one executable (static linking) or links at run time (dynamic linking, DLLs). A <strong>loader</strong> places the executable into memory ready to run.'),
      ]
    },

    { id: '1.2.3', title: 'Software Development Methodologies & Testing',
      sections: [
        tbl(['Methodology', 'Approach', 'Best when'],
          [['Waterfall', 'Strict sequential phases', 'Requirements are fixed and well understood'],
           ['Agile', 'Iterative sprints, continuous feedback', 'Requirements will evolve; fast delivery needed'],
           ['Extreme Programming (XP)', 'Agile + pair programming, test-first', 'Quality-critical, small teams'],
           ['Spiral', 'Iterative with risk analysis each loop', 'Large, high-risk projects'],
           ['RAD', 'Rapid prototyping with user feedback', 'UI-heavy systems, unclear requirements']]),
        kt('Agile values', 'Individuals and interactions over processes; working software over documentation; customer collaboration over contracts; responding to change over following a plan.'),
        tbl(['Test type', 'What it checks', 'Run by'],
          [['Unit', 'One function/module in isolation', 'Developer'],
           ['Integration', 'Modules working together', 'Developer / QA'],
           ['System', 'Whole system vs requirements', 'QA team'],
           ['Alpha', 'In-house testing before release', 'Internal testers'],
           ['Beta', 'Limited real-user release', 'Selected users'],
           ['Acceptance', 'Meets the client’s needs', 'Client / end user']]),
        kt('Black-box vs white-box testing', 'Black-box: test inputs vs expected outputs with no knowledge of the code. White-box: tests designed from the internal code paths to exercise every branch. Use representative, boundary and erroneous test data.'),
        tip('"Why use Waterfall for a safety-critical system?" Because requirements are stable, full documentation is required at each stage, and formal sign-off reduces risk — there is no expectation of changing scope mid-project.'),
      ]
    },

    { id: '1.2.4', title: 'Types of Programming Language & Addressing',
      sections: [
        kt('Programming paradigms', 'Procedural: ordered instructions, procedures and functions. Object-oriented: data and behaviour bundled into objects. Assembly/low-level: human-readable mnemonics mapping 1:1 to machine code. Declarative/functional: describe WHAT, not HOW.'),
        w('Little Man Computer (assembly) example', 'INP        // input a number into ACC\nSTA num    // store ACC in variable num\nINP        // input second number\nADD num    // ACC = ACC + num\nOUT        // output the result\nHLT        // stop\nnum DAT     // data label'),
        tbl(['Addressing mode', 'Operand means', 'Example (LDA)'],
          [['Immediate', 'The operand IS the value', 'Load the literal value given'],
           ['Direct', 'The operand is the memory address of the value', 'Load from that address'],
           ['Indirect', 'The operand is the address of the address of the value', 'Follow the pointer, then load'],
           ['Indexed', 'Add an index register to the operand address', 'Base address + offset (arrays)']]),
        tip('Addressing modes are easiest to remember with arrays: indexed addressing = base address of the array + index, which is exactly how array[i] is found in memory.'),
      ]
    },
  ]},

  // ══════════════ 1.3 EXCHANGING DATA ══════════════
  { id: 'ocr-3', number: '1.3', name: 'Exchanging Data', specPoints: [

    { id: '1.3.1', title: 'Compression, Encryption & Hashing',
      examTip: 'Symmetric vs asymmetric encryption and the TLS handshake are classic OCR questions — learn why both are used together.',
      sections: [
        tbl(['Compression', 'Description', 'Quality', 'Examples'],
          [['Lossless', 'Original reconstructed exactly', '100%', 'RLE, Huffman, ZIP, PNG, FLAC'],
           ['Lossy', 'Some data permanently removed', 'Reduced', 'JPEG, MP3, H.264']]),
        kt('Run-length encoding (RLE)', 'Lossless: replaces runs of repeated values with (count, value) pairs. Great for large areas of one colour; can make data with few repeats bigger.'),
        kt('Dictionary (Huffman) coding', 'Lossless: frequent symbols get short bit codes, rare symbols long codes, built from a frequency tree. Used in ZIP/DEFLATE and within JPEG/MP3.'),
        kt('Symmetric encryption', 'One shared secret key encrypts and decrypts. Fast — good for bulk data (AES). Problem: securely sharing the key.'),
        kt('Asymmetric encryption', 'A public key (shared) encrypts; only the matching private key (secret) decrypts. Solves key exchange and enables digital signatures, but is slow — used to set up a symmetric session key, not for bulk data (RSA).'),
        kt('Hashing', 'A one-way function mapping data to a fixed-size digest. Deterministic, fast, irreversible, collision-resistant. Used for password storage, integrity checks and as keys in hash tables.'),
        tip('Why HTTPS uses both: asymmetric encryption securely exchanges a symmetric session key during the handshake; then fast symmetric encryption (AES) protects the actual data — giving security AND speed.'),
      ]
    },

    { id: '1.3.2', title: 'Databases & SQL',
      sections: [
        kt('Flat file vs relational', 'A flat file holds all data in one table — leads to redundancy and update/insert/delete anomalies. A relational database splits data into linked tables, removing redundancy and improving integrity.'),
        tbl(['Normal form', 'Rule'],
          [['1NF', 'No repeating groups; atomic values; each row unique'],
           ['2NF', 'In 1NF AND no partial dependency (non-key attributes depend on the WHOLE primary key)'],
           ['3NF', 'In 2NF AND no transitive dependency (non-key attributes depend on nothing but the key)']]),
        kt('Keys & referential integrity', 'A primary key uniquely identifies a record; a foreign key references a primary key in another table. Referential integrity means a foreign key must match an existing primary key (no "orphan" records).'),
        w('SQL examples', "SELECT name, grade FROM Student\nWHERE grade > 60\nORDER BY grade DESC;\n\nINSERT INTO Student (id, name, grade)\nVALUES (7, 'Sam', 72);\n\nUPDATE Student SET grade = 80 WHERE id = 7;\nDELETE FROM Student WHERE id = 7;\n\nSELECT s.name, c.title FROM Student s\nINNER JOIN Class c ON s.classId = c.id;"),
        kt('Transactions & ACID', 'A transaction is a set of operations treated as one unit. ACID: Atomicity (all-or-nothing), Consistency (rules preserved), Isolation (concurrent transactions don’t interfere — record locking), Durability (committed changes survive failure).'),
        err('Normalisation is not just "splitting tables". Each normal form has a precise rule — quote the rule (e.g. "remove partial dependencies for 2NF") rather than describing it vaguely.'),
      ]
    },

    { id: '1.3.3', title: 'Networks, Protocols & Layers',
      sections: [
        kt('LAN vs WAN', 'A LAN covers a small area on hardware the owner controls; a WAN connects LANs over a large area using third-party infrastructure (e.g. the internet).'),
        kt('Packet switching', 'Data split into packets, each routed independently and reassembled in order at the destination. Efficient (links shared) and resilient (reroute around failures). Contrasts with circuit switching (a dedicated path reserved for the whole call).'),
        tbl(['Protocol', 'Layer', 'Purpose'],
          [['HTTP/HTTPS', 'Application', 'Web pages; HTTPS adds TLS encryption'],
           ['FTP', 'Application', 'File transfer'],
           ['SMTP / IMAP', 'Application', 'Send / receive email'],
           ['DNS', 'Application', 'Domain name → IP address'],
           ['TCP', 'Transport', 'Reliable, ordered, connection-oriented'],
           ['UDP', 'Transport', 'Fast, connectionless, no guarantee'],
           ['IP', 'Internet/Network', 'Addressing and routing of packets']]),
        kt('Why layering (TCP/IP stack)', 'Splitting networking into layers means each layer has one job and can be changed independently. The four-layer TCP/IP model: Application, Transport, Internet, Link.'),
        kt('DNS & internet structure', 'The Domain Name System resolves human-readable domains to IP addresses via a hierarchy of DNS servers. The internet is a network of networks connected by routers; data crosses many hops between routers to its destination.'),
        kt('Network hardware', 'NIC (network access), switch (forwards frames by MAC within a LAN), router (routes packets between networks), WAP (wireless access). Client–server (central servers provide services) vs peer-to-peer (equal nodes share resources).'),
      ]
    },

    { id: '1.3.4', title: 'Web Technologies',
      sections: [
        kt('HTML, CSS & JavaScript', 'HTML structures content, CSS styles presentation, JavaScript adds client-side interactivity. Separating them keeps sites maintainable and consistent.'),
        kt('Client-side vs server-side processing', 'Client-side (JavaScript in the browser): fast, responsive, reduces server load, but is visible/editable and depends on the browser. Server-side: secure (code hidden), can access databases, consistent — but adds server load and a round-trip.'),
        t('Search engine indexing & PageRank', 'Search engines use <strong>web crawlers (spiders)</strong> to follow links and build an <strong>index</strong> of pages and keywords. <strong>PageRank</strong> ranks a page by the number and quality of pages linking to it — a link from a highly-ranked page counts for more, so importance flows through the link graph.'),
        w('PageRank idea', 'A page is "important" if important pages link to it.\nPR(A) = (1-d) + d * Σ ( PR(Ti) / C(Ti) )\n  d  = damping factor (~0.85)\n  Ti = pages linking to A\n  C(Ti) = number of outbound links on Ti\nImportance is shared out along each page’s links\nand iterated until the values stabilise.'),
      ]
    },
  ]},

  // ══════════════ 1.4 DATA TYPES, STRUCTURES & ALGORITHMS ══════════════
  { id: 'ocr-4', number: '1.4', name: 'Data Types, Structures & Boolean Algebra', specPoints: [

    { id: '1.4.1', title: 'Data Types & Number Representation',
      examTip: 'Two’s complement and floating-point normalisation come up most years — practise converting both ways under timed conditions.',
      sections: [
        kt('Primitive data types', 'Integer, real/float, Boolean, character and string. The chosen type determines the operations allowed and the memory used.'),
        w("Two’s complement (8-bit)", "Represent -45:\n  +45  = 0010 1101\n  invert = 1101 0010\n  add 1  = 1101 0011  → -45\n\nCheck: 1101 0011\n  = -128 + 64 + 16 + 2 + 1 = -45  ✓\nRange of 8-bit two’s complement: -128 to +127"),
        w('Floating point (sign · mantissa · exponent)', 'Normalised form keeps the mantissa starting 0.1xxx (positive) or 1.0xxx (negative) so precision is maximised.\n\nExample mantissa 0.1011, exponent 011 (=3):\n  shift point right 3 places → 0101.1\n  = 5.5 (denary)\n\nTrade-off: more mantissa bits = more PRECISION;\nmore exponent bits = larger RANGE.'),
        w('Hex & binary masks', 'Hex is shorthand for binary (1 hex digit = 4 bits):\n  1011 0110  →  B6\n\nBitwise mask to test a bit (AND):\n  value   1011 0110\n  mask    0000 0100\n  AND  =  0000 0100  → bit set\n\nLeft shift by 1 = multiply by 2:\n  0001 0110 (22) << 1 = 0010 1100 (44)'),
        kt('Character sets', 'ASCII (7-bit, 128 characters) covers English. Unicode (e.g. UTF-8/16) uses more bits to represent every language’s characters and emoji — solving ASCII’s limited range.'),
        err('Forgetting that two’s complement’s most significant bit has a NEGATIVE place value (-128 for 8 bits) is the most common conversion error.'),
      ]
    },

    { id: '1.4.2', title: 'Data Structures (Stacks, Queues, Lists, Trees, Graphs)',
      sections: [
        kt('Abstract Data Type (ADT)', 'A data type defined by its operations and behaviour, not its implementation — the user knows WHAT it does, not HOW. Examples: stack, queue, list, tree, graph, hash table.'),
        w('Stack (LIFO) using a pointer', 'push(x):\n  if top == maxSize - 1: ERROR "stack overflow"\n  top = top + 1\n  stack[top] = x\npop():\n  if top == -1: ERROR "stack underflow"\n  x = stack[top]\n  top = top - 1\n  return x\nUses: call stack, undo, expression evaluation, backtracking.'),
        w('Queue (FIFO) — circular', 'enqueue(x):\n  rear = (rear + 1) MOD size\n  queue[rear] = x; count = count + 1\ndequeue():\n  x = queue[front]\n  front = (front + 1) MOD size; count = count - 1\n  return x\nA circular queue reuses freed slots so the array does not "walk off" the end.'),
        kt('Linked list', 'Nodes each holding data and a pointer to the next node. Dynamic size; fast insertion/deletion (just repoint pointers); but no random access (must traverse) and uses extra memory for pointers.'),
        kt('Graphs', 'A set of vertices (nodes) connected by edges, which may be directed and/or weighted. Stored as an adjacency matrix (O(V²) space, O(1) edge lookup — good for dense graphs) or adjacency list (O(V+E) space — good for sparse graphs).'),
        w('Tree traversals (on a BST)', "Tree:       4\n          /   \\\n         2     6\n        / \\   / \\\n       1   3 5   7\nIn-order  (L,Root,R): 1 2 3 4 5 6 7  ← sorted!\nPre-order (Root,L,R): 4 2 1 3 6 5 7  ← copy/serialise\nPost-order(L,R,Root): 1 3 2 5 7 6 4  ← delete/evaluate"),
        kt('Hash table', 'A structure mapping keys to values using a hash function to compute an index. Average O(1) lookup. A collision (two keys → same index) is handled by chaining (a list at each slot) or open addressing (probe for the next free slot).'),
      ]
    },

    { id: '1.4.3', title: 'Boolean Algebra & Logic',
      examTip: 'Learn De Morgan’s laws and the standard simplification rules — most Boolean questions want a simplified expression with working shown.',
      sections: [
        tbl(['Gate', 'Symbol notation', 'Output is 1 when'],
          [['AND', 'A.B', 'both inputs are 1'],
           ['OR', 'A+B', 'at least one input is 1'],
           ['NOT', 'Ā', 'the input is 0'],
           ['XOR', 'A⊕B', 'inputs are different'],
           ['NAND', 'A.B (negated)', 'NOT both 1'],
           ['NOR', 'A+B (negated)', 'both inputs are 0']]),
        w("De Morgan’s laws", "NOT(A AND B) = (NOT A) OR (NOT B)\n  ‾‾‾‾‾‾‾‾\n  A.B       =  Ā + B̄\n\nNOT(A OR B)  = (NOT A) AND (NOT B)\n  ‾‾‾‾‾‾‾\n  A+B        =  Ā . B̄\n\nMethod: break the bar, swap AND↔OR."),
        tbl(['Law', 'Rule'],
          [['Commutative', 'A.B = B.A ; A+B = B+A'],
           ['Distributive', 'A.(B+C) = A.B + A.C'],
           ['Association', '(A.B).C = A.(B.C)'],
           ['Absorption', 'A + (A.B) = A ; A.(A+B) = A'],
           ['Identity', 'A.1 = A ; A+0 = A'],
           ['Double negation', 'NOT(NOT A) = A']]),
        kt('Adders & flip-flops', 'A half adder adds two bits giving sum and carry; a full adder also takes a carry-in, so full adders chain to add multi-bit numbers. A D-type flip-flop stores one bit, changing on a clock edge — the basis of registers and memory.'),
        w('Simplification example', 'Simplify  A.B + A.(NOT B)\n  = A.(B + NOT B)   [distributive]\n  = A.(1)           [B + NOT B = 1]\n  = A'),
      ]
    },
  ]},

  // ══════════════ 1.5 LEGAL, MORAL, CULTURAL & ETHICAL ══════════════
  { id: 'ocr-5', number: '1.5', name: 'Legal, Moral, Cultural & Ethical Issues', specPoints: [

    { id: '1.5.1', title: 'Computing Legislation',
      sections: [
        tbl(['Act', 'Covers', 'Key point'],
          [['Data Protection Act 2018 / UK GDPR', 'Storing & processing personal data', 'Lawful, fair, accurate, minimal, secure; data-subject rights'],
           ['Computer Misuse Act 1990', 'Hacking & malware', '3 offences: unauthorised access; access with intent; unauthorised modification'],
           ['Copyright, Designs & Patents Act 1988', 'Ownership of original work', 'Protects software, media; illegal to copy/distribute without permission'],
           ['Regulation of Investigatory Powers Act 2000 (RIPA)', 'Surveillance & interception', 'Governs lawful interception of communications by authorities']]),
        kt('Data Protection principles', 'Personal data must be: used lawfully and fairly; collected for specified purposes; adequate and limited to what is needed; accurate; kept no longer than necessary; and kept secure.'),
        tip('In exam answers, name the specific Act and at least one concrete obligation or offence under it — vague references to "data laws" gain no marks.'),
      ]
    },

    { id: '1.5.2', title: 'Moral & Ethical Issues',
      sections: [
        tbl(['Ethical framework', 'Judges actions by', 'Computing example'],
          [['Consequentialism', 'Their outcomes (greatest good)', 'Do data-collection benefits outweigh privacy harm?'],
           ['Deontology', 'Fixed rules of right/wrong', 'Never breach privacy, whatever the benefit'],
           ['Virtue ethics', 'What a person of good character would do', 'Would a professional build this surveillance tool?']]),
        t('Key ethical issues', '<strong>Computers in the workforce</strong> — automation displaces some jobs while creating others. <strong>Automated decision-making & AI</strong> — bias from training data, accountability and the "black box" transparency problem. <strong>Environmental effects</strong> — energy use and e-waste. <strong>Censorship & surveillance</strong> — monitoring behaviour vs privacy and free speech. <strong>The digital divide</strong> — unequal access to technology by geography, wealth and age.'),
        tip('Strong ethics answers give BOTH sides and reach a reasoned judgement — e.g. monitoring can improve security but erodes privacy; the question is whether it is proportionate and transparent.'),
      ]
    },
  ]},

  // ══════════════ 2.1 ELEMENTS OF COMPUTATIONAL THINKING ══════════════
  { id: 'ocr-6', number: '2.1', name: 'Elements of Computational Thinking', specPoints: [

    { id: '2.1.1', title: 'Thinking Abstractly',
      sections: [
        t('Abstraction', 'Removing unnecessary detail to focus only on what matters for the solution. <strong>Representational abstraction</strong> removes detail to form a model; <strong>abstraction by generalisation</strong> groups things by shared characteristics. A London Tube map is an abstraction — connections matter, real distances do not.'),
        kt('The need for abstraction', 'Real problems are too detailed to solve directly. Abstraction produces a manageable model, lets the same solution apply to many cases, and hides complexity behind clean interfaces.'),
      ]
    },

    { id: '2.1.2', title: 'Thinking Ahead',
      sections: [
        kt('Inputs, outputs & preconditions', 'Before solving, identify what data is needed (inputs), what must be produced (outputs), and the preconditions that must hold for the solution to work (e.g. a list must be sorted before binary search).'),
        kt('Reusable components & caching', 'Plan to reuse tested components (libraries, functions) rather than rewriting. Caching stores the results of expensive operations so repeated requests are served instantly (e.g. a web cache, or memoised function results).'),
        tip('"Identify the preconditions" is a recurring command word — state the conditions that MUST be true before the algorithm will work correctly.'),
      ]
    },

    { id: '2.1.3', title: 'Thinking Procedurally & Logically',
      sections: [
        t('Thinking procedurally', '<strong>Decomposition</strong> breaks a problem into smaller sub-problems; a <strong>top-down/modular</strong> design solves each as a module, then combines them. This enables parallel development, reuse and easier testing.'),
        t('Thinking logically', 'Identify the decision points in a problem, the conditions that drive each decision, and how the outcome of each decision changes the flow. Clear logical structure (conditions, branches, loops) makes an algorithm correct and traceable.'),
      ]
    },

    { id: '2.1.4', title: 'Thinking Concurrently',
      sections: [
        kt('Concurrent processing', 'Carrying out more than one task in overlapping time periods. On a single core this is achieved by rapidly switching between tasks (time-slicing); on multiple cores tasks genuinely run in parallel.'),
        t('Benefits & drawbacks', 'Concurrency can speed up tasks that split into independent parts and keeps a program responsive (e.g. UI stays usable while downloading). Drawbacks: not all problems can be parallelised, results may need recombining, and shared data needs careful synchronisation to avoid race conditions.'),
        err('Concurrent does not always mean faster: tasks where each step depends on the previous one cannot be parallelised, and the overhead of managing concurrency can outweigh the gains.'),
      ]
    },
  ]},

  // ══════════════ 2.2 PROBLEM SOLVING & PROGRAMMING ══════════════
  { id: 'ocr-7', number: '2.2', name: 'Problem Solving & Programming', specPoints: [

    { id: '2.2.1', title: 'Programming Techniques',
      sections: [
        kt('Sequence, selection, iteration', 'The three programming constructs: sequence (steps in order), selection (IF/CASE choosing a path), and iteration (count-controlled FOR or condition-controlled WHILE/REPEAT).'),
        kt('Local vs global scope', 'A local variable exists only inside the subroutine that declares it; a global variable is accessible everywhere. Prefer local variables — they avoid accidental clashes and side effects and make modules independent.'),
        kt('Parameters: by value vs by reference', 'By value passes a copy — the original is unchanged. By reference passes the location — the subroutine can change the original. Functions return a value; procedures perform an action.'),
        w('Recursion: factorial', 'def factorial(n):\n    if n == 0:        # base case\n        return 1\n    return n * factorial(n - 1)   # recursive case\nEvery recursion needs a base case to stop, otherwise\nit recurses forever and overflows the call stack.'),
        kt('Modularity & the IDE', 'Splitting a program into modules/subroutines aids development, testing and reuse. An IDE supports this with an editor, syntax highlighting, auto-complete, debugger, breakpoints, variable watches and a built-in run/translate tool.'),
      ]
    },

    { id: '2.2.2', title: 'Object-Oriented Programming',
      sections: [
        kt('Class, object, attribute, method', 'A class is a template; an object is an instance of it. Attributes store an object’s state; methods are its behaviours. The constructor initialises a new object.'),
        kt('Encapsulation', 'Bundling data with the methods that act on it and hiding internal state behind private attributes accessed via get/set methods — protecting data and allowing the implementation to change safely.'),
        kt('Inheritance & polymorphism', 'Inheritance lets a subclass reuse and extend a superclass (an IS-A relationship). Polymorphism lets the same method call behave differently depending on the object’s class (e.g. overriding a sound() method per animal).'),
        w('OOP example', "class Animal:\n    def __init__(self, name):\n        self.__name = name        # private attribute\n    def speak(self):\n        return '...'\n\nclass Dog(Animal):                # inheritance\n    def speak(self):              # polymorphism (override)\n        return 'Woof'\n\nprint(Dog('Rex').speak())   # Woof"),
        tip('"Favour composition over inheritance": a HAS-A relationship (Car HAS-A Engine) is often more flexible than deep inheritance hierarchies, which become rigid and tightly coupled.'),
      ]
    },

    { id: '2.2.3', title: 'Computational Methods',
      sections: [
        kt('Problem recognition & decomposition', 'Recognising the features that make a problem solvable by computer, then decomposing it and using <strong>divide and conquer</strong> (repeatedly halving the problem, as in binary search and merge sort).'),
        tbl(['Method', 'What it is', 'Example'],
          [['Backtracking', 'Build a solution step by step; undo a step that breaks a constraint', 'Sudoku, maze solving, N-queens'],
           ['Heuristics', 'A "good enough" rule that finds acceptable solutions fast', 'Route finding, antivirus detection'],
           ['Data mining', 'Finding patterns/correlations in large data sets', 'Recommendations, fraud detection'],
           ['Performance modelling', 'Simulating system behaviour under load before building', 'Server capacity planning'],
           ['Visualisation', 'Presenting data/relationships graphically', 'Graphs, heat maps'],
           ['Pipelining', 'Output of one stage feeds the next', 'CPU instruction pipeline']]),
        kt('Abstraction in problem solving', 'Modelling only the relevant features of a real problem so it can be represented and solved on a computer — the same skill that underpins simulations and algorithms.'),
      ]
    },
  ]},

  // ══════════════ 2.3 ALGORITHMS ══════════════
  { id: 'ocr-8', number: '2.3', name: 'Algorithms', specPoints: [

    { id: '2.3.1', title: 'Complexity & Big-O Notation',
      examTip: 'Be able to state and justify the Big-O of the standard searches and sorts — examiners want the order of growth AND a one-line reason.',
      sections: [
        kt('Big-O notation', 'Describes how an algorithm’s time or space requirement grows with input size n, ignoring constants and lower-order terms — the worst-case order of growth.'),
        tbl(['Big-O', 'Name', 'Example'],
          [['O(1)', 'Constant', 'Array index access; hash table lookup (avg)'],
           ['O(log n)', 'Logarithmic', 'Binary search'],
           ['O(n)', 'Linear', 'Linear search'],
           ['O(n log n)', 'Linearithmic', 'Merge sort, quicksort (avg)'],
           ['O(n²)', 'Quadratic', 'Bubble/insertion sort'],
           ['O(2ⁿ)', 'Exponential', 'Naive recursive Fibonacci; brute-force subsets']]),
        kt('Time vs space complexity', 'Time complexity measures operations; space complexity measures extra memory. There is often a trade-off — e.g. merge sort is O(n log n) time but needs O(n) extra space, while bubble sort is O(n²) time but O(1) space.'),
        t('P and NP', '<strong>P</strong>: solvable in polynomial time. <strong>NP</strong>: a proposed solution can be verified in polynomial time. <strong>NP-complete</strong> problems are the hardest in NP — if any one had a polynomial solution, all of NP would (the famous open question P = NP?). For intractable problems we use heuristics and approximations.'),
      ]
    },

    { id: '2.3.2', title: 'Searching & Sorting Algorithms',
      sections: [
        tbl(['Algorithm', 'Best', 'Average / Worst', 'Notes'],
          [['Linear search', 'O(1)', 'O(n)', 'Any list, sorted or not'],
           ['Binary search', 'O(1)', 'O(log n)', 'Sorted list only; halves each step'],
           ['Bubble sort', 'O(n)', 'O(n²)', 'Simple; in place; slow on big lists'],
           ['Insertion sort', 'O(n)', 'O(n²)', 'Good on nearly-sorted data'],
           ['Merge sort', 'O(n log n)', 'O(n log n)', 'Divide & conquer; needs O(n) space'],
           ['Quicksort', 'O(n log n)', 'O(n²) worst', 'Fast in practice; in place']]),
        w('Binary search trace: find 7 in [1,3,5,7,9,11,13]', 'low=0 high=6 mid=3 → list[3]=7  FOUND (1 comparison)\n\nfind 11:\n low=0 high=6 mid=3 → 7 < 11, search right, low=4\n low=4 high=6 mid=5 → list[5]=11  FOUND (2 comparisons)'),
        w('Merge sort: [4,2,7,1]', 'SPLIT: [4,2,7,1] → [4,2] [7,1] → [4][2] [7][1]\nMERGE: [4]+[2]=[2,4]   [7]+[1]=[1,7]\n       [2,4]+[1,7] = [1,2,4,7]  ✓'),
        tip('When asked which sort/search to use, justify with BOTH efficiency and conditions: e.g. "binary search — O(log n) — but only because the list is large AND already sorted."'),
      ]
    },

    { id: '2.3.3', title: "Dijkstra’s & A* Path-Finding",
      examTip: "A* is specific to OCR H446 — understand exactly how its heuristic improves on Dijkstra’s.",
      sections: [
        t("Dijkstra’s shortest path", "Finds the shortest path from a start node to all others in a weighted graph with non-negative weights. Keeps a tentative distance to every node, always finalises the nearest unvisited node, and relaxes its neighbours’ distances. Explores outward in all directions like a flood."),
        t('A* search', 'Extends Dijkstra’s with a <strong>heuristic</strong> h(n) estimating the cost from n to the goal, prioritising nodes by f(n) = g(n) + h(n) where g(n) is the actual cost so far. By aiming toward the goal it usually finds the shortest path while exploring far fewer nodes.'),
        kt('Admissible heuristic', 'A heuristic that never overestimates the true remaining cost. If h is admissible, A* is guaranteed to find the optimal path. Straight-line distance is admissible for map navigation because a road can never be shorter than the straight line.'),
        tbl(['Feature', "Dijkstra’s", 'A*'],
          [['Priority', 'g(n) — cost from start', 'f(n) = g(n) + h(n)'],
           ['Heuristic', 'None', 'Required (admissible for optimality)'],
           ['Nodes explored', 'More (all directions)', 'Fewer (guided to goal)'],
           ['Needs domain knowledge?', 'No', 'Yes — to design the heuristic']]),
      ]
    },
  ]},

  ]
};
