// ═══════════════════════════════════════════════════════════════════
// OCR A Level Computer Science (H446) — full-spec notes, textbook depth
// One spec point per sub-section of the H446 specification, with worked
// examples, model exam answers and common-mistake callouts.
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
      examTip: 'Learn the registers (PC, MAR, MDR, CIR, ACC) and the EXACT register transfers in each stage of the FDE cycle — "describe the FDE cycle" is worth up to 6 marks and each correct transfer earns a mark.',
      sections: [
        t('The CPU and its components', 'The <strong>processor (CPU)</strong> fetches, decodes and executes instructions. The <strong>Control Unit (CU)</strong> coordinates and synchronises every operation, decodes instructions and manages the flow of data along the buses. The <strong>Arithmetic Logic Unit (ALU)</strong> performs all arithmetic (add, subtract, shift) and logic (AND, OR, comparisons). <strong>Registers</strong> are tiny, extremely fast storage locations inside the CPU. The <strong>clock</strong> generates regular pulses that synchronise operations — one or more pulses per stage.'),
        tbl(['Register', 'Full name', 'Role'],
          [['PC', 'Program Counter', 'Holds the address of the NEXT instruction to fetch'],
           ['MAR', 'Memory Address Register', 'Holds the address currently being read from / written to'],
           ['MDR', 'Memory Data Register', 'Holds the data/instruction just fetched, or about to be written'],
           ['CIR', 'Current Instruction Register', 'Holds the instruction now being decoded and executed'],
           ['ACC', 'Accumulator', 'Holds the working result of ALU operations']]),
        tbl(['Bus', 'Direction', 'Carries', 'Width affects'],
          [['Data bus', 'Bidirectional', 'Data and instructions between CPU and memory', 'Amount of data moved per transfer'],
           ['Address bus', 'Unidirectional (CPU → memory)', 'The memory address to access', 'Maximum addressable memory (2^width)'],
           ['Control bus', 'Bidirectional', 'Control/timing signals (read, write, clock, interrupt)', 'Coordination of components']]),
        w('FDE cycle — register transfer notation', '[PC]  → MAR          ; address of next instruction to MAR\n[MAR] → address bus\nmemory[MAR] → data bus → MDR   ; instruction fetched\n[MDR] → CIR          ; instruction moved to CIR\n[PC] + 1 → PC        ; PC incremented\n--- DECODE ---\nCU decodes the opcode in CIR, splits opcode/operand\n--- EXECUTE ---\nALU performs the operation, result → ACC\n(or data moved, or [operand] → PC for a branch)\n--- then check the interrupt register and repeat ---'),
        t('Von Neumann vs Harvard architecture', '<strong>Von Neumann</strong>: a single memory and single bus shared by instructions AND data. Simpler and cheaper, but the shared bus is the "von Neumann bottleneck" — the CPU cannot fetch an instruction and read/write data at the same time. <strong>Harvard</strong>: physically separate memories and buses for instructions and data, so both can be accessed simultaneously — faster, and used where speed is critical (embedded systems, DSPs). Many modern CPUs are a hybrid: von Neumann main memory but separate L1 instruction and data caches (a Harvard-style split).'),
        kt('Pipelining', 'Splitting instruction processing so the FDE stages of consecutive instructions overlap: while instruction n executes, n+1 is decoded and n+2 is fetched. This increases throughput (instructions completed per second) without raising the clock speed. A branch/jump can invalidate the partly-processed instructions, forcing a pipeline flush and a performance penalty — which is why branch prediction is used.'),
        tbl(['Performance factor', 'Why it helps', 'Limit / trade-off'],
          [['Clock speed', 'More FDE cycles per second', 'Heat and power rise sharply; physical limits'],
           ['Number of cores', 'Several instruction streams run in parallel', 'Only helps tasks that can be parallelised'],
           ['Cache size / levels', 'Fewer slow trips to main memory', 'Expensive; diminishing returns'],
           ['Word length / bus width', 'More data moved/processed per cycle', 'More complex, costly hardware']]),
        tip('Model answer for "why does adding cores not always double performance?": "A task only speeds up if it can be split into independent parts that run simultaneously. Many tasks have sequential sections where each step needs the previous result, so (by Amdahl\'s law) the sequential portion limits the overall speed-up; the OS also adds overhead coordinating the cores."'),
        err('Do not confuse increasing clock speed with pipelining. Clock speed makes each cycle faster; pipelining overlaps cycles so more instructions finish per unit time even at the SAME clock speed.'),
      ]
    },

    { id: '1.1.2', title: 'Types of Processor (CISC, RISC, GPU, Parallel)',
      examTip: 'Be ready to justify RISC for mobile devices (power efficiency, simpler pipelining) and GPUs for tasks like machine learning (massive data parallelism).',
      sections: [
        tbl(['Feature', 'CISC', 'RISC'],
          [['Instruction set', 'Large, complex, variable length', 'Small, simple, fixed length'],
           ['Cycles per instruction', 'Several (one instruction = much work)', 'Usually one'],
           ['Program size', 'Shorter (complex instructions)', 'Longer (more simple instructions)'],
           ['Hardware/compiler', 'Complex hardware; simpler compiler', 'Simple hardware; compiler does more work'],
           ['Pipelining', 'Harder (variable-length instructions)', 'Easier (uniform instructions)'],
           ['Power use', 'Higher', 'Lower — suits battery devices'],
           ['Typical use', 'Desktop/server (x86)', 'Mobile, embedded (ARM)']]),
        kt('GPU (Graphics Processing Unit)', 'A processor with thousands of small cores designed to apply the SAME operation to many data items simultaneously (SIMD). Originally for rendering pixels/vertices, now widely used for any highly parallel, data-heavy workload: machine learning, scientific simulation, image processing, cryptocurrency mining.'),
        kt('Parallel processing & Amdahl\'s law', 'Parallel processing splits a task across multiple cores running at the same time. Amdahl\'s law states the maximum speed-up is limited by the fraction of the task that MUST run sequentially: if 20% is sequential, the absolute best speed-up is 5×, no matter how many cores you add.'),
        tbl(['Architecture', 'Meaning', 'Example'],
          [['SISD', 'Single Instruction Single Data', 'Classic single-core CPU'],
           ['SIMD', 'Single Instruction Multiple Data', 'GPU; vector operations on arrays'],
           ['MISD', 'Multiple Instruction Single Data', 'Rare — fault-tolerant systems'],
           ['MIMD', 'Multiple Instruction Multiple Data', 'Multicore CPU; cluster of computers']]),
        t('When each wins', 'A high <strong>clock speed</strong> with few powerful cores suits inherently sequential, single-threaded tasks. A <strong>GPU (SIMD)</strong> wins when the same calculation is applied to huge amounts of independent data. A <strong>multicore CPU (MIMD)</strong> wins for several different concurrent tasks/threads.'),
        tip('"Why is a GPU better than a CPU for training a neural network?" Model answer: "Training applies the same arithmetic (matrix multiplications) to enormous amounts of independent data. A GPU has thousands of cores performing one instruction across many data items at once (SIMD), giving far higher throughput for this data-parallel work than a CPU\'s small number of general-purpose cores."'),
        err('"More cores is always faster" is wrong. State the condition: only tasks that decompose into independent parallel parts benefit; sequential tasks gain nothing and coordination adds overhead.'),
      ]
    },

    { id: '1.1.3', title: 'Input, Output & Storage Devices',
      sections: [
        t('Choosing a device', 'Justify a device choice against the scenario using: <strong>capacity</strong>, <strong>speed (access time / transfer rate)</strong>, <strong>portability</strong>, <strong>durability</strong> (moving parts?), <strong>reliability</strong>, <strong>power consumption</strong> and <strong>cost per GB</strong>. E.g. a laptop OS drive → SSD (fast, shock-resistant, low power); a large cold backup → magnetic HDD (cheap per GB).'),
        tbl(['Storage type', 'How it works', 'Pros', 'Cons'],
          [['Magnetic (HDD)', 'Read/write head over spinning magnetised platters', 'Very cheap per GB, high capacity', 'Slow, fragile moving parts, noisy'],
           ['Solid state (SSD/flash)', 'Charge stored in NAND flash cells, no moving parts', 'Fast, silent, shock-resistant, low power', 'Dearer per GB; finite write/erase cycles'],
           ['Optical (CD/DVD/Blu-ray)', 'Laser reads pits and lands on a reflective layer', 'Cheap, removable, good for archival/distribution', 'Low capacity, slow, scratch-prone']]),
        kt('RAM vs ROM', 'RAM is volatile (loses contents on power-off), read/write, and holds the running OS, programs and data. ROM is non-volatile, read-only (or rarely written), and holds firmware such as the bootstrap/BIOS needed to start the machine.'),
        kt('Virtual storage', 'Treating other storage as if it were RAM or local disk. <strong>Virtual memory</strong> uses secondary storage to extend RAM, paging inactive pages to disk so programs larger than physical RAM can run. <strong>Cloud/virtual storage</strong> stores data on remote servers accessed over a network.'),
        t('Disk thrashing', 'When physical RAM is too small for the active workload, the OS constantly swaps pages between RAM and disk. Because disk is far slower than RAM, the CPU spends most of its time waiting for paging rather than doing useful work — performance collapses. The fix is more RAM or fewer concurrent programs.'),
        tip('When asked to recommend storage, always TIE the property to the scenario: not "SSDs are fast" but "an SSD is best here because the device is portable and dropped frequently, so its lack of moving parts gives durability, and its fast access time improves boot and load times."'),
      ]
    },
  ]},

  // ══════════════ 1.2 SOFTWARE & SOFTWARE DEVELOPMENT ══════════════
  { id: 'ocr-2', number: '1.2', name: 'Software & Software Development', specPoints: [

    { id: '1.2.1', title: 'Operating Systems',
      examTip: 'Memory management (paging/segmentation/virtual memory) and scheduling algorithms are heavily examined — be able to compare scheduling algorithms and explain a downside of each.',
      sections: [
        t('Functions of an OS', 'The OS sits between hardware and software, managing resources and providing a consistent platform. Core jobs: <strong>memory management</strong>, <strong>processor scheduling</strong>, <strong>interrupt handling</strong>, <strong>file management</strong>, <strong>device management</strong> (via drivers), <strong>security/access control</strong> and providing a <strong>user interface</strong>.'),
        tbl(['Memory technique', 'How it works', 'Strength / weakness'],
          [['Paging', 'Memory divided into fixed-size pages loaded into any free frames', 'No external fragmentation; pages need not be contiguous'],
           ['Segmentation', 'Memory divided into variable-size logical segments (a whole module/array)', 'Matches program structure; can cause external fragmentation'],
           ['Virtual memory', 'Disk used as extra "RAM"; inactive pages swapped out', 'Runs large programs; too much swapping = thrashing']]),
        tbl(['Scheduling algorithm', 'Idea', 'Drawback'],
          [['Round robin', 'Each process gets a fixed time slice (quantum) in turn', 'Ignores priority; quantum size is a trade-off'],
           ['First come first served (FCFS)', 'Run in arrival order until each finishes', 'A long job delays all behind it (convoy effect)'],
           ['Shortest job first (SJF)', 'Run the shortest job next', 'Needs run-time estimate; long jobs may starve'],
           ['Shortest remaining time (SRT)', 'Pre-emptive SJF — switch if a shorter job arrives', 'Context-switch overhead; starvation'],
           ['Multi-level feedback queues', 'Several priority queues; jobs move between them', 'Complex to design and tune']]),
        kt('The goal of scheduling', 'Maximise CPU use and throughput, minimise response and wait time, and ensure fairness (no process starves). Scheduling matters because the CPU is far faster than I/O, so the OS interleaves processes to keep the CPU busy while others wait for I/O.'),
        kt('Interrupts & the ISR', 'An interrupt is a signal requesting CPU attention (I/O complete, hardware error, timer, software exception). At the end of each FDE cycle the CPU checks the interrupt register; if a pending interrupt has higher priority than the current task, the CPU pushes its registers/state onto the stack, loads the address of the matching Interrupt Service Routine, runs it, then pops the saved state and resumes.'),
        kt('Types of OS', 'Distributed (one OS spread over many networked machines sharing load), embedded (fixed, minimal, low-resource — e.g. a washing machine), multi-tasking (time-slices to appear simultaneous), multi-user (schedules resources between users), real-time (guarantees a response within a strict deadline — e.g. engine management, pacemaker).'),
        kt('BIOS, drivers & virtual machines', 'The <strong>BIOS</strong> runs first at power-on, performs the POST (power-on self test) and loads the bootloader/OS. <strong>Device drivers</strong> translate generic OS commands into the specific signals a hardware device understands. A <strong>virtual machine</strong> runs intermediate code on a software-emulated CPU, giving platform independence (e.g. Java bytecode) and sandboxed isolation, at the cost of speed.'),
        tip('Comparing scheduling algorithms: always pair a benefit with a specific drawback, e.g. "SJF minimises average waiting time but can starve long processes and requires the burst time to be known or estimated in advance."'),
      ]
    },

    { id: '1.2.2', title: 'Applications Generation & Translators',
      examTip: 'The stages of compilation and "compiler vs interpreter" are perennial questions — learn all four stages and give the executable/error-reporting differences.',
      sections: [
        kt('Applications vs utility software', 'Application software performs a user task (word processor, browser, game). Utility software maintains/optimises the system (disk defragmenter, backup, file compression, anti-malware, disk clean-up).'),
        kt('Open vs closed source', 'Open source: source code is freely available to view, modify and redistribute (Linux, Firefox) — benefits include community auditing and no licence fee, but support may be informal. Closed/proprietary: source is secret and used under licence (Windows, macOS) — benefits include dedicated support and accountability, but cost and no right to modify.'),
        tbl(['Translator', 'Translates', 'Output & speed', 'Errors', 'Source protection'],
          [['Compiler', 'Whole program → machine code once', 'Standalone executable; slow to compile, fast to run', 'Reported all together after compiling', 'Source not distributed'],
           ['Interpreter', 'One statement at a time, every run', 'No executable; slower execution', 'Stops at the first error (good for debugging)', 'Source usually distributed'],
           ['Assembler', 'Assembly mnemonics → machine code (1:1)', 'Fast, very low-level', 'Per instruction', 'N/A']]),
        w('The four stages of compilation', '1. LEXICAL ANALYSIS\n   - source code split into tokens\n   - whitespace and comments removed\n   - identifiers/keywords added to the symbol table\n2. SYNTAX ANALYSIS (parsing)\n   - tokens checked against the language grammar\n   - an abstract syntax tree (AST) is built\n   - syntax errors reported here\n3. CODE GENERATION\n   - object (machine) code produced from the AST\n4. OPTIMISATION\n   - code rearranged/reduced to run faster or use\n     less memory (e.g. removing redundant operations)'),
        kt('Linkers, loaders & libraries', 'A <strong>library</strong> is pre-written, pre-tested reusable code. A <strong>linker</strong> combines the compiled program with the library modules it uses — <em>static</em> linking copies them into the executable (larger but self-contained); <em>dynamic</em> linking loads shared libraries (DLLs) at run time (smaller, shareable, but the library must be present). A <strong>loader</strong> copies the executable into memory and prepares it to run.'),
        tip('"Why might a developer choose an interpreter during development but compile for release?" Model answer: "An interpreter stops at the first error and runs code immediately, making it faster to test and debug. For release, a compiler produces a fast standalone executable that runs without the source and does not need a translator installed on the user\'s machine."'),
        err('Java is not "compiled OR interpreted" — it is both: the compiler produces platform-independent bytecode, which the JVM (a virtual machine) then interprets/JIT-compiles. Mention bytecode when discussing portability.'),
      ]
    },

    { id: '1.2.3', title: 'Software Development Methodologies & Testing',
      examTip: 'Be able to recommend a methodology for a given scenario and justify it — the marks are in matching the methodology to the project\'s requirements stability.',
      sections: [
        tbl(['Methodology', 'Approach', 'Strengths', 'Weaknesses'],
          [['Waterfall', 'Strict sequential phases, sign-off each stage', 'Clear documentation; predictable; easy to manage', 'Inflexible; errors found late; user sees product only at end'],
           ['Agile (Scrum)', 'Iterative sprints; working software every 2–4 weeks', 'Flexible; constant user feedback; welcomes change', 'Less documentation; scope creep; harder to cost/timetable'],
           ['Extreme Programming (XP)', 'Agile + pair programming + test-first', 'Very high code quality; fast feedback', 'Labour-intensive; needs disciplined team'],
           ['Spiral', 'Iterative with risk analysis each loop', 'Risk-managed; suits large, high-risk projects', 'Expensive; complex; needs risk expertise'],
           ['RAD', 'Rapid prototyping + user evaluation', 'Fast; user-centred; good for unclear requirements', 'Not for large/complex systems; needs skilled team']]),
        kt('Agile values', 'Individuals and interactions over processes and tools; working software over comprehensive documentation; customer collaboration over contract negotiation; responding to change over following a plan.'),
        tbl(['Test type', 'What it checks', 'Run by'],
          [['Unit', 'A single function/module in isolation', 'Developer'],
           ['Integration', 'Modules working correctly together', 'Developer / QA'],
           ['System', 'The whole system against requirements', 'QA team'],
           ['Alpha', 'In-house testing before any release', 'Internal testers'],
           ['Beta', 'Limited release to real users', 'Selected end users'],
           ['Acceptance', 'System meets the client\'s requirements', 'Client / end user'],
           ['Regression', 'A change has not broken existing features', 'Automated suite']]),
        kt('Black-box vs white-box testing', 'Black-box: tests are designed from the specification (inputs → expected outputs) with no knowledge of the code. White-box: tests are designed from the code to exercise every path/branch. Choose test data that is normal/valid, boundary (just inside/outside limits) and erroneous/invalid.'),
        w('Choosing test data', 'A field accepts an exam mark 0–100.\n  Normal   : 47        (clearly valid)\n  Boundary : 0, 100    (lowest/highest valid)\n             -1, 101   (just-invalid boundaries)\n  Erroneous: "abc", 9999, blank  (wrong type/way out)\nGood test plans always include all three categories.'),
        tip('Recommending a methodology: "Agile suits this app because the client is unsure of the exact features and wants to refine them as they see prototypes; the iterative sprints allow requirements to change without restarting. Waterfall would risk building the wrong product because requirements are fixed only once at the start."'),
        err('Beta testing is NOT the same as acceptance testing. Beta = real users trial a near-finished product to find remaining bugs; acceptance = the client formally checks the system meets the agreed requirements before sign-off.'),
      ]
    },

    { id: '1.2.4', title: 'Types of Programming Language & Addressing',
      sections: [
        kt('Programming paradigms', 'Procedural: a sequence of instructions grouped into procedures/functions, executed in order. Object-oriented: data and the operations on it are bundled into objects. Assembly/low-level: human-readable mnemonics mapping 1:1 to machine code, giving fine hardware control. Declarative (e.g. functional/logic): describe WHAT result is wanted, not the step-by-step HOW.'),
        w('Little Man Computer (assembly)', 'INP        ; input a number into ACC\nSTA num    ; store ACC in memory location "num"\nINP        ; input a second number into ACC\nADD num    ; ACC = ACC + contents of num\nOUT        ; output the value in ACC\nHLT        ; stop\nnum DAT     ; reserve/label a data location\n\nKey idea: each mnemonic = one machine instruction\n(opcode + operand). This is procedural + low-level.'),
        tbl(['Addressing mode', 'The operand is…', 'Use / note'],
          [['Immediate', 'the actual value to use', 'Fastest — value is in the instruction'],
           ['Direct', 'the memory address of the value', 'One memory access to get the value'],
           ['Indirect', 'the address OF the address of the value', 'A pointer; enables flexible access'],
           ['Indexed', 'a base address, plus an index register', 'Perfect for arrays: base + i']]),
        w('Indexed addressing for an array', 'Array starts at address 200, index register IR.\nTo access array[3]:\n  effective address = 200 + 3 = 203\nIncrementing IR walks through the array — this is\nexactly how a FOR loop over an array is implemented\nin machine code.'),
        tip('Link addressing modes to high-level constructs in your answer: "indexed addressing computes base + index, which is how array[i] is located; indirect addressing uses a stored address (a pointer), which is how reference/pointer variables work."'),
      ]
    },
  ]},

  // ══════════════ 1.3 EXCHANGING DATA ══════════════
  { id: 'ocr-3', number: '1.3', name: 'Exchanging Data', specPoints: [

    { id: '1.3.1', title: 'Compression, Encryption & Hashing',
      examTip: 'The classic 6-marker: "Explain how HTTPS uses both asymmetric and symmetric encryption." Cover the handshake (asymmetric → exchange a session key) then bulk data (symmetric → speed).',
      sections: [
        tbl(['Compression', 'Description', 'Quality', 'Examples'],
          [['Lossless', 'Original reconstructed bit-for-bit', '100%', 'RLE, Huffman, ZIP, PNG, FLAC'],
           ['Lossy', 'Data permanently discarded for smaller size', 'Reduced', 'JPEG, MP3, AAC, H.264']]),
        kt('Run-length encoding (RLE)', 'Lossless: replaces a run of repeated values with a (count, value) pair. Excellent for images with large blocks of one colour (logos, icons); can INCREASE size for data with few repeats, since each non-repeat becomes a pair.'),
        w('RLE example', 'Pixel row: WWWWWWBBBWWWWWWWWWWWWB  (22 pixels)\nRLE:       6W 3B 12W 1B  → 4 pairs (8 values)\n→ much smaller than 22 values.\n\nWorst case: WBWBWB → 1W 1B 1W 1B 1W 1B\n→ 12 values vs 6 → BIGGER (no repeats to exploit).'),
        kt('Dictionary / Huffman coding', 'Lossless variable-length coding: frequent symbols get short bit-codes, rare symbols get long ones, derived from a frequency-ordered binary tree. The decoder needs the tree/dictionary. Used in ZIP/DEFLATE and inside JPEG and MP3.'),
        w('Huffman coding', 'Text "AAAABBBCCD"  freq: A=4 B=3 C=2 D=1\nBuild tree by repeatedly merging the two lowest:\n  (D1,C2)->3 ; (3,B3)->6 ; (6,A4)->10\nResulting codes (shorter for frequent):\n  A=0  B=10  C=110  D=111\nFixed 8-bit:   10 chars x 8 = 80 bits\nHuffman: 4(1)+3(2)+2(3)+1(3)=4+6+6+3 = 19 bits\nCompression ratio ≈ 4:1'),
        kt('Symmetric encryption', 'The SAME secret key encrypts and decrypts. Fast, so it is used for bulk data (AES). The weakness is key distribution — securely getting the shared key to the other party over an untrusted network.'),
        kt('Asymmetric (public-key) encryption', 'Each party has a public key (shared openly) and a private key (kept secret). Anything encrypted with the public key can only be decrypted with the matching private key. Solves key exchange and enables digital signatures, but is ~100–1000× slower than symmetric, so it is not used for bulk data.'),
        kt('Hashing & digital signatures', 'A hash function maps any input to a fixed-size digest — deterministic, fast, one-way and collision-resistant. Used for password storage (store the hash, never the password), file-integrity checks, and digital signatures: the sender signs the hash of a message with their private key; anyone can verify it with the sender\'s public key, proving authenticity and that the message was not altered.'),
        w('TLS handshake (HTTPS)', '1. Client → server: "hello", supported cipher suites\n2. Server → client: digital certificate (contains\n   server\'s PUBLIC key, signed by a CA)\n3. Client verifies the certificate via the CA\n4. A symmetric SESSION key is agreed using the\n   server\'s public key (asymmetric)\n5. All further data is encrypted with the fast\n   SYMMETRIC session key (AES)'),
        tip('Model answer for using both: "Asymmetric encryption securely establishes a shared symmetric session key without any pre-shared secret. Asymmetric is too slow for all the data, so once the key is agreed, fast symmetric encryption protects the actual traffic — giving both secure key exchange and high-speed bulk encryption."'),
        err('Hashing is NOT encryption. Encryption is reversible (with the key); hashing is one-way and cannot be reversed to recover the input — which is exactly why it is used to store passwords.'),
      ]
    },

    { id: '1.3.2', title: 'Databases & SQL',
      examTip: 'Normalisation to 3NF and writing correct SQL (SELECT…JOIN, INSERT, UPDATE, DELETE) appear most years. Learn the precise definition of each normal form.',
      sections: [
        kt('Flat file vs relational', 'A flat file stores everything in one table, causing data redundancy (repetition) and update/insertion/deletion anomalies. A relational database splits data into linked tables, each about one entity, removing redundancy and improving integrity and consistency.'),
        tbl(['Normal form', 'A table is in this form when…'],
          [['1NF', 'all values are atomic (no repeating groups), and each record is unique'],
           ['2NF', 'it is in 1NF AND every non-key attribute depends on the WHOLE primary key (no partial dependency)'],
           ['3NF', 'it is in 2NF AND no non-key attribute depends on another non-key attribute (no transitive dependency)']]),
        kt('Keys & referential integrity', 'A primary key uniquely identifies each record. A foreign key is a primary key of another table used to create a relationship. Referential integrity means every foreign key value must match an existing primary key — preventing "orphaned" records that reference something which does not exist.'),
        w('SQL — query, join and modify', "SELECT name, grade FROM Student\nWHERE grade >= 60\nORDER BY grade DESC;\n\n-- join two tables\nSELECT s.name, c.title\nFROM Student s\nINNER JOIN Class c ON s.classID = c.classID\nWHERE c.title = 'Computer Science';\n\nINSERT INTO Student (id, name, grade)\nVALUES (7, 'Sam', 72);\nUPDATE Student SET grade = 80 WHERE id = 7;\nDELETE FROM Student WHERE id = 7;"),
        kt('Transactions & ACID', 'A transaction is a group of operations treated as a single unit. ACID guarantees: <strong>Atomicity</strong> (all operations succeed or none do), <strong>Consistency</strong> (the database moves from one valid state to another), <strong>Isolation</strong> (concurrent transactions do not interfere — achieved by record locking), <strong>Durability</strong> (once committed, changes survive power loss/crash).'),
        w('Why atomicity matters', 'Bank transfer = two operations:\n  1. subtract £50 from account A\n  2. add £50 to account B\nIf the system crashes after step 1 only, £50 vanishes.\nWrapping both in ONE transaction means either BOTH\nhappen or NEITHER does — money is never lost.'),
        tip('Quote the rule when normalising: not "split the table" but "remove the partial dependency to reach 2NF" / "remove the transitive dependency to reach 3NF". Examiners award the precise terminology.'),
        err('A common SQL slip: forgetting the WHERE clause on UPDATE/DELETE. "DELETE FROM Student;" deletes EVERY record. Always include the condition that selects the intended rows.'),
      ]
    },

    { id: '1.3.3', title: 'Networks, Protocols & Layers',
      sections: [
        kt('LAN vs WAN', 'A LAN (Local Area Network) covers a small geographic area using infrastructure the owner controls (an office, a school). A WAN (Wide Area Network) connects LANs over a large area using third-party communication links — the internet is the largest WAN.'),
        kt('Packet switching vs circuit switching', 'Packet switching splits data into packets, each routed independently and reassembled in order at the destination — efficient (links are shared) and resilient (packets reroute around failures). Circuit switching reserves a dedicated path for the whole communication (traditional telephone calls) — guaranteed bandwidth but wasteful when idle.'),
        tbl(['Protocol', 'Layer', 'Purpose'],
          [['HTTP / HTTPS', 'Application', 'Transfer web pages; HTTPS adds TLS encryption'],
           ['FTP', 'Application', 'Transfer files between hosts'],
           ['SMTP', 'Application', 'Send email'],
           ['IMAP / POP3', 'Application', 'Retrieve email (IMAP keeps mail on server; POP3 downloads)'],
           ['DNS', 'Application', 'Resolve a domain name to an IP address'],
           ['TCP', 'Transport', 'Reliable, ordered, connection-oriented delivery'],
           ['UDP', 'Transport', 'Fast, connectionless, no delivery guarantee'],
           ['IP', 'Internet', 'Address and route packets across networks']]),
        t('Why use a layered model?', 'The TCP/IP stack (Application, Transport, Internet, Link) divides networking into layers, each with one responsibility. Benefits: each layer can be developed/changed independently (e.g. swap WiFi for Ethernet at the Link layer without touching HTTP), it standardises interfaces so products from different vendors interoperate, and it simplifies troubleshooting.'),
        kt('DNS resolution', 'When you type a domain, your computer queries DNS servers in a hierarchy (resolver → root → top-level-domain → authoritative) until it gets the matching IP address, which is then cached. Without DNS we would have to remember numeric IP addresses.'),
        kt('TCP/IP & sockets', 'A socket is a communication endpoint defined by an IP address + port number. A connection is uniquely identified by the four-tuple (client IP, client port, server IP, server port). Servers listen on well-known ports — 80 for HTTP, 443 for HTTPS.'),
        tip('"State TWO advantages of packet switching": (1) efficient use of the network because links are shared between many communications rather than reserved; (2) resilience — if a link fails, packets are rerouted along a different path so the communication continues.'),
      ]
    },

    { id: '1.3.4', title: 'Web Technologies',
      sections: [
        kt('HTML, CSS & JavaScript', 'HTML defines the structure/content of a page; CSS defines its presentation/style; JavaScript adds client-side interactivity and dynamic behaviour. Separating them keeps a site maintainable — one CSS file restyles every page consistently.'),
        tbl(['Processing', 'Runs', 'Pros', 'Cons'],
          [['Client-side (JS)', 'In the user\'s browser', 'Fast/responsive; reduces server load; instant validation feedback', 'Code is visible/editable; can be disabled; depends on the device'],
           ['Server-side', 'On the web server', 'Secure (code hidden); can access databases; consistent for all users', 'Adds server load; needs a network round-trip']]),
        t('Search engine indexing & PageRank', 'Search engines run <strong>web crawlers (spiders)</strong> that follow hyperlinks to discover pages and build an <strong>index</strong> mapping keywords to pages. <strong>PageRank</strong> measures a page\'s importance by the number AND quality of pages linking to it: a link from a high-ranked page passes more "authority" than one from a low-ranked page, and importance is shared out across each page\'s outbound links.'),
        w('PageRank formula (idea)', 'PR(A) = (1 - d) + d * Σ ( PR(Ti) / C(Ti) )\n  d      = damping factor (≈ 0.85)\n  Ti     = pages that link TO page A\n  PR(Ti) = PageRank of linking page Ti\n  C(Ti)  = number of outbound links on Ti\nStart all pages equal, then iterate until values\nstabilise. A page gains rank from being linked to\nby important pages that do not link to everything.'),
        tip('Validation should be done on BOTH sides: client-side for instant user feedback and reduced server load, server-side because client-side checks can be bypassed (the user can disable JavaScript or edit the request). State both for full marks.'),
      ]
    },
  ]},

  // ══════════════ 1.4 DATA TYPES, STRUCTURES & ALGORITHMS ══════════════
  { id: 'ocr-4', number: '1.4', name: 'Data Types, Structures & Boolean Algebra', specPoints: [

    { id: '1.4.1', title: 'Data Types & Number Representation',
      examTip: 'Two\'s complement, binary arithmetic and floating-point normalisation are calculation questions — practise converting BOTH ways and always show working for method marks.',
      sections: [
        kt('Primitive data types', 'Integer (whole numbers), real/float (with a fractional part), Boolean (True/False), character (a single symbol) and string (a sequence of characters). The type chosen fixes the operations allowed and the memory used.'),
        w('Two\'s complement (8-bit)', 'Represent -45:\n  +45      = 0010 1101\n  invert   = 1101 0010\n  add 1    = 1101 0011   → -45\nCheck place values (MSB is NEGATIVE):\n  1101 0011 = -128 +64 +16 +2 +1 = -45  ✓\n8-bit range: -128 (1000 0000) to +127 (0111 1111)'),
        w('Binary arithmetic & overflow', 'Add  0100 1111 (79)\n   + 0011 0001 (49)\n   = 1000 0000 (-128 in 2\'s complement!)\nThe true answer 128 does not fit in 8 bits, so the\nsign bit flips → OVERFLOW. Detect: adding two\npositives gives a negative (or two negatives give a\npositive).'),
        w('Floating point representation', 'Number = mantissa x 2^exponent, both in two\'s complement.\nNORMALISED form: mantissa starts 0.1… (positive) or\n1.0… (negative) to maximise precision.\n\nMantissa 0.1011, exponent 0011 (=3):\n  move binary point right 3 → 0101.1 = 5.5\n\nTrade-off: more mantissa bits = more PRECISION;\nmore exponent bits = greater RANGE.'),
        w('Hex, shifts and masks', 'Hex = binary in groups of 4 bits:\n  1011 0110 = B6\nLogical left shift by 1 = x2:\n  0001 0110 (22) << 1 = 0010 1100 (44)\nRight shift by 1 = ÷2 (integer):\n  0010 1100 (44) >> 1 = 0001 0110 (22)\nAND mask to test/clear bits:\n  1011 0110 AND 0000 1111 = 0000 0110 (low nibble)'),
        kt('Character sets', 'ASCII uses 7 bits (128 characters) — fine for English but cannot represent other scripts. Unicode (UTF-8/16/32) uses more bits to cover every language plus symbols and emoji, with UTF-8 being backwards-compatible with ASCII for the first 128 codes.'),
        err('The most common two\'s-complement error is forgetting that the most significant bit has a NEGATIVE place value (−128 for 8 bits). Always write the place values with the leftmost one negative before adding.'),
      ]
    },

    { id: '1.4.2', title: 'Data Structures (Stacks, Queues, Lists, Trees, Graphs)',
      examTip: 'You must be able to WRITE the push/pop and enqueue/dequeue algorithms with overflow/underflow checks, and trace tree traversals.',
      sections: [
        kt('Abstract Data Type (ADT)', 'A data type defined by its operations and behaviour, not its implementation — the user knows WHAT operations exist and what they do, not HOW they are coded. Examples: stack, queue, list, tree, graph, hash table, dictionary.'),
        w('Stack (LIFO) with overflow/underflow', 'push(item):\n  IF top = maxSize - 1 THEN\n    REPORT "stack overflow"\n  ELSE\n    top ← top + 1\n    stack[top] ← item\npop():\n  IF top = -1 THEN\n    REPORT "stack underflow"\n  ELSE\n    item ← stack[top]\n    top ← top - 1\n    RETURN item\nUses: the call stack, undo, backtracking, evaluating\nexpressions, converting infix → postfix.'),
        w('Circular queue (FIFO)', 'enqueue(item):\n  IF count = size THEN REPORT "queue full"\n  rear ← (rear + 1) MOD size\n  queue[rear] ← item ; count ← count + 1\ndequeue():\n  IF count = 0 THEN REPORT "queue empty"\n  item ← queue[front]\n  front ← (front + 1) MOD size ; count ← count - 1\n  RETURN item\nMOD wraps the pointers so freed slots are reused —\notherwise the queue "walks off" the end of the array.'),
        kt('Linked list', 'A dynamic sequence of nodes, each holding data and a pointer to the next node (a null pointer marks the end). Insertion/deletion is O(1) once the position is found (just repoint pointers), and it grows/shrinks at run time — but there is no random access (you must traverse from the head) and pointers use extra memory.'),
        kt('Graphs', 'A set of vertices (nodes) connected by edges, which may be directed and/or weighted. Stored as an <strong>adjacency matrix</strong> (V×V grid; O(V²) space, O(1) edge lookup — good for dense graphs) or an <strong>adjacency list</strong> (each vertex lists its neighbours; O(V+E) space — good for sparse graphs). Model real networks: roads, social links, the web.'),
        w('Binary search tree traversals', "Tree:        8\n           /   \\\n          3    10\n         / \\     \\\n        1   6    14\nIn-order  (L,Root,R): 1 3 6 8 10 14  ← SORTED order\nPre-order (Root,L,R): 8 3 1 6 10 14  ← copy/serialise\nPost-order(L,R,Root): 1 6 3 14 10 8  ← delete/evaluate"),
        kt('Hash table', 'Maps keys to values by passing the key through a hash function to compute an index — average O(1) insert/search. A collision (two keys hash to one index) is resolved by chaining (store a list at each slot) or open addressing (probe to the next free slot). A high load factor increases collisions, so the table is resized/rehashed.'),
        tip('When asked to choose a structure: a stack for anything LIFO (undo, function calls, backtracking); a queue for FIFO (print spooler, buffering); a hash table when fast key lookup matters; a BST when you need sorted order AND fast search.'),
      ]
    },

    { id: '1.4.3', title: 'Boolean Algebra & Logic',
      examTip: 'Simplification questions want the working shown line by line, naming the law used at each step — the final answer alone rarely gets full marks.',
      sections: [
        tbl(['Gate', 'Notation', 'Output is 1 when…'],
          [['AND', 'A.B', 'both inputs are 1'],
           ['OR', 'A+B', 'at least one input is 1'],
           ['NOT', 'NOT A', 'the input is 0'],
           ['XOR', 'A ⊕ B', 'the inputs are different'],
           ['NAND', 'NOT(A.B)', 'NOT both inputs are 1'],
           ['NOR', 'NOT(A+B)', 'both inputs are 0']]),
        tbl(['Law', 'Rule'],
          [['Commutative', 'A.B = B.A ; A+B = B+A'],
           ['Associative', '(A.B).C = A.(B.C)'],
           ['Distributive', 'A.(B+C) = A.B + A.C'],
           ['Absorption', 'A + A.B = A ; A.(A+B) = A'],
           ['Identity', 'A.1 = A ; A+0 = A'],
           ['Null', 'A.0 = 0 ; A+1 = 1'],
           ['Complement', 'A.(NOT A) = 0 ; A+(NOT A) = 1'],
           ['Double negation', 'NOT(NOT A) = A']]),
        w('De Morgan\'s laws', 'NOT(A AND B) = (NOT A) OR (NOT B)\nNOT(A OR B)  = (NOT A) AND (NOT B)\nMethod: "break the bar and swap the operator."\n\nUse them to push NOTs inward and to convert\nbetween AND/OR forms (useful for NAND/NOR circuits).'),
        w('Simplification (show every step)', 'Simplify:  A.B + A.(NOT B) + (NOT A).B\n= A.(B + NOT B) + (NOT A).B   [distributive]\n= A.(1)          + (NOT A).B   [complement]\n= A             + (NOT A).B    [identity]\n= A + B                        [absorption variant]\nFinal: A + B'),
        kt('Adders', 'A half adder adds two single bits, outputting SUM (A XOR B) and CARRY (A AND B). A full adder also takes a carry-in, so full adders can be chained to add multi-bit binary numbers — the carry-out of each bit feeds the carry-in of the next.'),
        kt('D-type flip-flop', 'An edge-triggered circuit that stores one bit: on the rising edge of the clock it copies input D to its output Q (and holds it until the next edge). Flip-flops are the building blocks of registers and memory, and synchronise data to the clock.'),
        err('De Morgan slip: students change the operator but forget to negate EACH variable (or vice-versa). NOT(A.B) is (NOT A)+(NOT B) — both the operator AND each term change.'),
      ]
    },
  ]},

  // ══════════════ 1.5 LEGAL, MORAL, CULTURAL & ETHICAL ══════════════
  { id: 'ocr-5', number: '1.5', name: 'Legal, Moral, Cultural & Ethical Issues', specPoints: [

    { id: '1.5.1', title: 'Computing Legislation',
      examTip: 'Name the Act AND a concrete obligation/offence under it. Vague references to "data laws" score nothing.',
      sections: [
        tbl(['Act', 'Covers', 'Key provisions'],
          [['Data Protection Act 2018 / UK GDPR', 'Storing & processing personal data', 'Data must be lawful, fair, accurate, minimal, secure; data-subject rights to access/erase'],
           ['Computer Misuse Act 1990', 'Hacking & malware', '3 offences: unauthorised access; unauthorised access with intent; unauthorised modification'],
           ['Copyright, Designs & Patents Act 1988', 'Ownership of original work', 'Protects software/media; illegal to copy or distribute without permission'],
           ['Regulation of Investigatory Powers Act 2000 (RIPA)', 'Surveillance & interception', 'Regulates lawful interception of communications by public bodies']]),
        kt('Data Protection principles', 'Personal data must be: processed lawfully, fairly and transparently; collected for specified, explicit purposes; adequate and limited to what is necessary; accurate and kept up to date; kept no longer than necessary; and kept secure against unauthorised access or loss.'),
        w('Applying the Computer Misuse Act', 'Scenario → offence:\n - Guessing a colleague\'s password to read their email\n   → unauthorised ACCESS (s.1)\n - Doing so to commit fraud\n   → unauthorised access WITH INTENT (s.2)\n - Planting ransomware that encrypts files\n   → unauthorised MODIFICATION (s.3)'),
        tip('Structure an "is this legal?" answer by: (1) name the relevant Act; (2) state the specific provision/offence; (3) apply it to the scenario; (4) conclude. This earns the application and conclusion marks, not just the recall mark.'),
      ]
    },

    { id: '1.5.2', title: 'Moral & Ethical Issues',
      examTip: 'Discussion questions need BOTH sides and a justified conclusion — a one-sided answer caps your marks.',
      sections: [
        tbl(['Ethical framework', 'Judges actions by', 'Computing example'],
          [['Consequentialism', 'Their outcomes (greatest good for the most people)', 'Do the benefits of mass data collection outweigh the privacy harm?'],
           ['Deontology', 'Fixed duties/rules of right and wrong', 'Never breach privacy, regardless of the benefit'],
           ['Virtue ethics', 'What a person of good character would do', 'Would a responsible professional build this surveillance tool?'],
           ['Social contract', 'Implicit agreements within society', 'Users trust their data will be protected — breaching that breaks the contract']]),
        t('Key ethical debates', '<strong>Automation & the workforce</strong> — AI/robotics removes some jobs while creating others, raising questions of retraining and inequality. <strong>Automated decision-making & AI</strong> — bias from skewed training data, lack of accountability, and "black box" opacity. <strong>Environmental impact</strong> — energy use of data centres and the growing problem of e-waste. <strong>Censorship & surveillance</strong> — monitoring online behaviour can improve safety but threatens privacy and free expression. <strong>The digital divide</strong> — unequal access by geography, wealth, age and nation has growing social consequences as services move online.'),
        tip('A strong discussion paragraph: state a benefit with an example, state a drawback/risk with an example, then give a reasoned judgement — e.g. "Monitoring can detect threats early, but blanket surveillance erodes privacy and can be misused; it is acceptable only if proportionate, targeted and transparent."'),
        err('"AI is biased" is not enough at A Level. Explain the mechanism: the AI learns patterns from historical data, so if that data reflects human bias (e.g. past hiring decisions), the model reproduces and can amplify it.'),
      ]
    },
  ]},

  // ══════════════ 2.1 ELEMENTS OF COMPUTATIONAL THINKING ══════════════
  { id: 'ocr-6', number: '2.1', name: 'Elements of Computational Thinking', specPoints: [

    { id: '2.1.1', title: 'Thinking Abstractly',
      sections: [
        t('Abstraction', 'Removing unnecessary detail so only what matters for the solution remains. <strong>Representational abstraction</strong> builds a simplified model of reality; <strong>abstraction by generalisation</strong> groups things by shared characteristics so one solution handles many cases. A London Underground map is an abstraction — connections and order of stops matter; real distances, road layout and scenery do not.'),
        kt('Why abstraction is essential', 'Real problems contain far too much detail to solve directly. Abstraction produces a manageable model, lets one solution apply to a whole class of problems, and hides complexity behind clean interfaces so layers can be built and changed independently.'),
        t('Layers of abstraction', 'Computing is built from stacked abstractions: a programmer uses a high-level language without thinking about machine code; the language uses the OS without thinking about the hardware; the hardware uses logic gates without thinking about electrons. Each layer trusts the one below to "just work".'),
        tip('For "explain the role of abstraction in this scenario", identify exactly what detail is being removed and WHY removing it makes the problem solvable or the model reusable.'),
      ]
    },

    { id: '2.1.2', title: 'Thinking Ahead',
      sections: [
        kt('Inputs, outputs & preconditions', 'Before designing a solution, identify the data needed (inputs), the results required (outputs), and the preconditions that must hold for the solution to work — e.g. binary search has the precondition that the list is already sorted.'),
        kt('Reusable components', 'Plan to use existing, tested components (libraries, functions, classes) rather than rewriting. This saves time, reduces bugs, and means improvements to the component benefit everywhere it is used.'),
        kt('Caching', 'Storing the results of expensive or frequently-needed operations so future requests are served instantly. Examples: a browser cache stores web resources; memoisation caches function results; a CPU cache stores recently used memory. The trade-off is memory use and keeping the cache up to date (cache invalidation).'),
        tip('"Identify the preconditions of this algorithm" means state exactly what must be true BEFORE it runs for it to produce a correct result (e.g. "the array is sorted in ascending order", "the divisor is non-zero").'),
      ]
    },

    { id: '2.1.3', title: 'Thinking Procedurally & Logically',
      sections: [
        t('Thinking procedurally', '<strong>Decomposition</strong> breaks a large problem into smaller sub-problems that can be solved independently. A <strong>top-down / modular</strong> design refines the problem into modules, each as a subroutine, then combines them. Benefits: work can be shared across a team, modules are reusable and individually testable, and the structure is easier to understand and maintain.'),
        t('Thinking logically', 'Identify the points in a problem where a decision must be made, the condition that drives each decision, and how each outcome changes the flow of the solution. Clear logical structure (sequence, selection, iteration) is what makes an algorithm correct, predictable and traceable.'),
        w('Decomposition example', 'Problem: build a quiz app\n  - display a question      (module)\n  - read and store the answer (module)\n  - check the answer / score  (module)\n  - move to the next question (module)\n  - show the final result     (module)\nEach module is designed, coded and tested on its own,\nthen assembled — top-down design.'),
        tip('A modular answer scores well: state that decomposition lets a team work in parallel, makes each part testable in isolation, and produces reusable subroutines.'),
      ]
    },

    { id: '2.1.4', title: 'Thinking Concurrently',
      sections: [
        kt('Concurrent processing', 'Carrying out more than one task in overlapping time periods. On a single core this is achieved by time-slicing (rapidly switching between tasks so they appear simultaneous); on multiple cores tasks genuinely execute in parallel.'),
        t('Benefits and drawbacks', 'Concurrency can reduce total run time for tasks that split into independent parts, and keeps a program responsive (e.g. the user interface stays usable while a download runs in the background). Drawbacks: not all problems can be split; results from separate parts may need recombining; and shared data must be synchronised to avoid <strong>race conditions</strong> (where the result depends on unpredictable timing) — adding complexity and overhead.'),
        w('Where concurrency helps vs not', 'HELPS: downloading 10 independent files\n  → 10 tasks run at once, finishing far sooner.\nDOES NOT HELP: computing the 100th Fibonacci number\n  by the simple recurrence\n  → each value needs the previous one, so the steps\n    must run in order — no parallelism possible.'),
        err('Concurrent does not automatically mean faster. If the task is inherently sequential, or the overhead of creating and coordinating tasks (and locking shared data) outweighs the work, concurrency can be slower.'),
      ]
    },
  ]},

  // ══════════════ 2.2 PROBLEM SOLVING & PROGRAMMING ══════════════
  { id: 'ocr-7', number: '2.2', name: 'Problem Solving & Programming', specPoints: [

    { id: '2.2.1', title: 'Programming Techniques',
      examTip: 'Recursion vs iteration comparisons are common — know that recursion uses the call stack and can overflow, while iteration is usually more memory-efficient.',
      sections: [
        kt('Sequence, selection, iteration', 'The three structured-programming constructs: sequence (statements in order), selection (IF / CASE choosing between paths) and iteration (count-controlled FOR, or condition-controlled WHILE / REPEAT-UNTIL). Any algorithm can be built from these three.'),
        kt('Local vs global scope', 'A local variable exists only within the subroutine that declares it and is destroyed when the subroutine ends; a global variable is accessible throughout the program. Prefer local variables: they prevent accidental name clashes and unintended side effects, and keep modules independent and reusable.'),
        kt('Parameters: by value vs by reference', 'Passing by value sends a COPY — changes inside the subroutine do not affect the original. Passing by reference sends the variable\'s location — the subroutine can change the caller\'s original value. A function returns a value; a procedure performs an action without necessarily returning one.'),
        w('Recursion: factorial + how the stack works', 'def factorial(n):\n    if n == 0:            # BASE CASE — stops recursion\n        return 1\n    return n * factorial(n - 1)   # RECURSIVE CASE\n\nfactorial(3):\n  factorial(3) waits for factorial(2)\n    factorial(2) waits for factorial(1)\n      factorial(1) waits for factorial(0)\n        factorial(0) = 1   ← base case, unwinds\n      = 1 * 1 = 1\n    = 2 * 1 = 2\n  = 3 * 2 = 6\nEach pending call is held on the CALL STACK; with no\nbase case (or too deep) the stack overflows.'),
        tbl(['', 'Recursion', 'Iteration'],
          [['Readability', 'Elegant for naturally recursive problems (trees, divide & conquer)', 'Clearer for simple repetition'],
           ['Memory', 'Uses the call stack — risk of stack overflow', 'Constant extra memory'],
           ['Speed', 'Function-call overhead', 'Generally faster'],
           ['Termination', 'Needs a base case', 'Needs a stopping condition']]),
        kt('Modularity & the IDE', 'Breaking a program into subroutines/modules aids development, testing and reuse. An IDE supports this with an editor, syntax highlighting, auto-complete, a debugger (breakpoints, step, variable watch), error diagnostics and a built-in run/translate tool.'),
        err('Every recursive routine MUST have a reachable base case that the recursive calls move towards; otherwise it recurses forever and overflows the call stack. Examiners look for you to identify the base case explicitly.'),
      ]
    },

    { id: '2.2.2', title: 'Object-Oriented Programming',
      examTip: 'Be ready to write a class with a constructor, private attributes and methods, and to define encapsulation, inheritance and polymorphism with an example of each.',
      sections: [
        kt('Class, object, attribute, method', 'A class is a template/blueprint defining attributes (data) and methods (behaviour). An object is an instance of a class with its own attribute values. The constructor initialises a new object\'s attributes when it is created.'),
        kt('Encapsulation', 'Bundling data and the methods that operate on it inside an object, and hiding the internal state behind private attributes accessed only through public getter/setter methods. This protects data integrity (values can be validated in setters) and lets the implementation change without breaking code that uses the object.'),
        kt('Inheritance', 'A subclass inherits the attributes and methods of a superclass (an IS-A relationship — a Dog IS-A Animal), reusing code and extending it. Avoid over-deep hierarchies, which become rigid and tightly coupled.'),
        kt('Polymorphism', 'The same method call behaves differently depending on the object\'s class. Achieved by overriding an inherited method — e.g. every Animal has speak(), but Dog.speak() returns "Woof" and Cat.speak() returns "Meow", and code can call speak() on any Animal without knowing its exact type.'),
        w('OOP example', "class Animal:\n    def __init__(self, name):\n        self.__name = name           # private (encapsulation)\n    def get_name(self):              # getter\n        return self.__name\n    def speak(self):\n        return '...'\n\nclass Dog(Animal):                   # inheritance\n    def speak(self):                 # polymorphism (override)\n        return 'Woof'\n\nfor a in [Dog('Rex'), Animal('Thing')]:\n    print(a.get_name(), a.speak())   # same call, different result"),
        tip('"Favour composition over inheritance": a HAS-A relationship (a Car HAS-A Engine object) is often more flexible than deep inheritance, because behaviours can be swapped at run time without rewriting class hierarchies.'),
        err('Encapsulation is more than "using a class". The key marks are for PRIVATE attributes and controlled access via methods — making attributes public defeats the purpose.'),
      ]
    },

    { id: '2.2.3', title: 'Computational Methods',
      sections: [
        kt('Problem recognition & decomposition', 'Recognising the features that make a problem amenable to a computational solution, then decomposing it into sub-problems and applying <strong>divide and conquer</strong> — repeatedly breaking the problem into smaller parts, solving them, and combining results (as in binary search and merge sort).'),
        tbl(['Method', 'What it is', 'Example use'],
          [['Backtracking', 'Build a solution incrementally; undo a choice that violates a constraint and try another', 'Sudoku, maze solving, the N-queens problem'],
           ['Heuristics', 'A practical "good enough" rule that finds acceptable solutions quickly when an exact one is too slow', 'Route finding, heuristic antivirus detection'],
           ['Data mining', 'Searching large data sets for patterns, trends and correlations', 'Recommendations, fraud detection, market analysis'],
           ['Performance modelling', 'Simulating a system under load before building it', 'Sizing servers; testing networks'],
           ['Visualisation', 'Presenting data/relationships graphically to aid understanding', 'Graphs, heat maps, dashboards'],
           ['Pipelining', 'The output of one processing stage feeds directly into the next', 'CPU instruction pipeline; data processing pipelines']]),
        kt('Abstraction in problem solving', 'Modelling only the relevant features of a real-world problem so it can be represented and solved computationally — the same skill that underpins simulations, where assumptions simplify reality enough to compute with.'),
        tip('For "why use a heuristic?": because the exact (optimal) algorithm is intractable — too slow for the input size — so a heuristic trades guaranteed optimality for a good-enough answer found in acceptable time.'),
      ]
    },
  ]},

  // ══════════════ 2.3 ALGORITHMS ══════════════
  { id: 'ocr-8', number: '2.3', name: 'Algorithms', specPoints: [

    { id: '2.3.1', title: 'Complexity & Big-O Notation',
      examTip: 'State the Big-O AND justify it in one line — e.g. "binary search is O(log n) because it halves the remaining items each comparison."',
      sections: [
        kt('Big-O notation', 'Describes how an algorithm\'s time (or space) requirement grows as the input size n grows, ignoring constants and lower-order terms. It expresses the worst-case order of growth, letting algorithms be compared independently of the hardware they run on.'),
        tbl(['Big-O', 'Name', 'n=10 → n=1000 work grows…', 'Example'],
          [['O(1)', 'Constant', 'no change', 'Array index; hash lookup (avg)'],
           ['O(log n)', 'Logarithmic', 'barely (≈ 3 → 10)', 'Binary search'],
           ['O(n)', 'Linear', '×100', 'Linear search'],
           ['O(n log n)', 'Linearithmic', '×~200', 'Merge sort, quicksort (avg)'],
           ['O(n²)', 'Quadratic', '×10,000', 'Bubble / insertion sort'],
           ['O(2ⁿ)', 'Exponential', 'astronomically', 'Naive recursive Fibonacci']]),
        kt('Time vs space complexity', 'Time complexity counts operations; space complexity counts extra memory used. There is often a trade-off: merge sort is O(n log n) time but needs O(n) extra space; bubble sort is slow at O(n²) time but uses only O(1) extra space. The right choice depends on which resource is scarce.'),
        w('Why order of growth matters', 'Suppose 1 operation = 1 microsecond, n = 1,000,000:\n  O(n)        ≈ 1 second\n  O(n log n)  ≈ 20 seconds\n  O(n²)       ≈ 11.5 DAYS\n  O(2ⁿ)       ≈ longer than the age of the universe\nThis is why an efficient algorithm matters far more\nthan a faster computer for large inputs.'),
        t('P, NP and intractability', '<strong>P</strong>: problems solvable in polynomial time. <strong>NP</strong>: problems where a proposed solution can be VERIFIED in polynomial time. <strong>NP-complete</strong> problems are the hardest in NP — if any one had a polynomial-time solution, all of NP would (the famous open question, P = NP?). Problems with no known efficient solution are <strong>intractable</strong>; in practice we attack them with heuristics and approximation algorithms.'),
        err('Big-O is about GROWTH, not absolute speed. An O(n²) algorithm can beat an O(n log n) one for small n; Big-O tells you what happens as n gets large.'),
      ]
    },

    { id: '2.3.2', title: 'Searching & Sorting Algorithms',
      examTip: 'Sorting/searching questions often ask for a full TRACE — show the list after every pass/comparison, not just the final result.',
      sections: [
        tbl(['Algorithm', 'Best', 'Avg / Worst', 'Space', 'Notes'],
          [['Linear search', 'O(1)', 'O(n)', 'O(1)', 'Works on any list, sorted or not'],
           ['Binary search', 'O(1)', 'O(log n)', 'O(1)', 'Sorted list only; halves each step'],
           ['Bubble sort', 'O(n)', 'O(n²)', 'O(1)', 'Simple; in place; slow on large lists'],
           ['Insertion sort', 'O(n)', 'O(n²)', 'O(1)', 'Efficient on nearly-sorted data'],
           ['Merge sort', 'O(n log n)', 'O(n log n)', 'O(n)', 'Divide & conquer; stable; needs extra space'],
           ['Quicksort', 'O(n log n)', 'O(n²) worst', 'O(log n)', 'Fast in practice; in place; pivot choice matters']]),
        w('Binary search trace: find 7 in [1,3,5,7,9,11,13]', 'low=0 high=6 mid=3 → list[3]=7  FOUND (1 comparison)\n\nfind 11:\n low=0 high=6 mid=3 → 7 < 11 → search right, low=4\n low=4 high=6 mid=5 → list[5]=11  FOUND (2 comparisons)\n\nfind 8 (absent):\n low=0 high=6 mid=3 → 7<8 → low=4\n low=4 high=6 mid=5 → 11>8 → high=4\n low=4 high=4 mid=4 → 9>8 → high=3\n low>high → NOT FOUND'),
        w('Bubble sort — first pass of [5,3,8,1]', '5 vs 3 → swap → [3,5,8,1]\n5 vs 8 → no swap → [3,5,8,1]\n8 vs 1 → swap → [3,5,1,8]  ← 8 now in final place\nPass 2: [3,5,1,8] → [3,1,5,8] → 5 placed\nPass 3: [3,1,5,8] → [1,3,5,8]\nPass 4: no swaps → SORTED (early exit optimisation)'),
        w('Merge sort: [4,2,7,1]', 'SPLIT: [4,2,7,1] → [4,2] [7,1] → [4][2] [7][1]\nMERGE: [4]+[2] = [2,4]   [7]+[1] = [1,7]\n       [2,4] + [1,7] → compare fronts: 1,2,4,7\n       = [1,2,4,7]  ✓'),
        tip('Justify a choice with BOTH efficiency and conditions: "use binary search — O(log n) — but only because the data is large AND already sorted; otherwise the cost of sorting first may outweigh the benefit, so linear search could be better for a one-off search of an unsorted list."'),
        err('Binary search on an UNSORTED list gives wrong results — it is not just slow, it is incorrect. Always state the precondition that the list must be sorted.'),
      ]
    },

    { id: '2.3.3', title: "Dijkstra's & A* Path-Finding",
      examTip: "A* is specific to OCR H446 — be able to explain f(n)=g(n)+h(n) and why an admissible heuristic guarantees the optimal path.",
      sections: [
        t("Dijkstra's shortest path", "Finds the shortest path from a start node to all others in a weighted graph with non-negative edge weights. It keeps a tentative shortest distance to every node (start = 0, others = ∞), repeatedly selects the unvisited node with the smallest tentative distance, marks it visited (its distance is now final), and <strong>relaxes</strong> its neighbours (updates a neighbour\'s distance if going via this node is shorter). It explores outward in all directions like a flood."),
        w("Dijkstra trace (start A)", "Graph: A-B=4, A-C=1, C-B=2, C-D=5, B-D=1\nInit: A=0, B=∞, C=∞, D=∞\nVisit A: B=4, C=1\nVisit C (smallest=1): B=min(4,1+2)=3, D=1+5=6\nVisit B (3): D=min(6,3+1)=4\nVisit D (4): done\nShortest A→D = 4  (A→C→B→D)"),
        t('A* search', 'Extends Dijkstra by adding a <strong>heuristic</strong> h(n) that estimates the cost from node n to the goal. Nodes are prioritised by f(n) = g(n) + h(n), where g(n) is the actual cost from the start so far. By steering exploration toward the goal, A* usually finds the shortest path while examining far fewer nodes than Dijkstra.'),
        kt('Admissible heuristic', 'A heuristic that NEVER overestimates the true remaining cost to the goal. If h is admissible, A* is guaranteed to find the optimal (shortest) path. Straight-line (Euclidean) distance is admissible for map navigation, because the real road route can never be shorter than the straight line.'),
        tbl(['Feature', "Dijkstra's", 'A*'],
          [['Priority', 'g(n) — cost from start', 'f(n) = g(n) + h(n)'],
           ['Heuristic', 'None', 'Required (admissible for optimality)'],
           ['Nodes explored', 'More — all directions', 'Fewer — guided toward the goal'],
           ['Needs domain knowledge?', 'No', 'Yes — to design a good heuristic'],
           ['Use case', 'Any non-negative weighted graph', 'Maps, games — where a heuristic exists']]),
        tip('"Why is A* usually faster than Dijkstra?" Model answer: "Dijkstra explores nodes purely by distance from the start, spreading in all directions. A* adds a heuristic estimate of the distance remaining to the goal, so it prioritises nodes that head towards the goal and therefore expands far fewer nodes, while still finding the optimal path provided the heuristic never overestimates."'),
      ]
    },
  ]},

  ]
};

// ── Exam-style practice questions + mark schemes, keyed by spec point ──
const EXAM: Record<string, { q: string; marks: number; scheme: string[] }[]> = {
  '1.1.1': [{ q: 'Describe the steps of the FETCH stage of the fetch–decode–execute cycle, naming the registers used.', marks: 4, scheme: [
    'The address in the PC is copied to the MAR', 'The instruction at that address is fetched from memory into the MDR', 'The instruction is copied from the MDR to the CIR', 'The PC is incremented to point at the next instruction'] }],
  '1.1.2': [{ q: 'Explain why a RISC processor is often chosen for a mobile phone.', marks: 3, scheme: [
    'RISC has a small set of simple instructions, each executing in (about) one cycle', 'Lower power consumption, extending battery life', 'Uniform instructions make pipelining easier / more efficient'] }],
  '1.1.3': [{ q: 'A photographer needs portable storage to carry on location. Recommend a storage type and justify your choice.', marks: 3, scheme: [
    'Solid-state / flash storage (SSD)', 'No moving parts, so it is durable / shock-resistant when carried around', 'Fast transfer rate and low power consumption'] }],
  '1.2.1': [{ q: 'Explain how the processor handles an interrupt.', marks: 4, scheme: [
    'The interrupt register is checked at the end of each FDE cycle', 'If a pending interrupt has higher priority, the current registers/state are pushed onto the stack', 'The matching Interrupt Service Routine (ISR) is located and executed', 'The saved state is popped from the stack and normal processing resumes'] }],
  '1.2.2': [{ q: 'Compare a compiler and an interpreter.', marks: 4, scheme: [
    'A compiler translates the whole program at once; an interpreter translates and runs one statement at a time', 'A compiler produces a standalone executable; an interpreter does not', 'A compiler reports all errors after compilation; an interpreter stops at the first error', 'Compiled code runs faster; an interpreter is more convenient for testing/debugging'] }],
  '1.2.3': [{ q: 'A company is building software whose requirements are likely to change during development. Recommend a methodology and justify it.', marks: 3, scheme: [
    'Agile (e.g. Scrum)', 'Iterative sprints allow requirements to change without restarting', 'Continuous customer feedback ensures the right product is built'] }],
  '1.2.4': [{ q: 'Explain the difference between immediate addressing and direct addressing.', marks: 2, scheme: [
    'Immediate: the operand is the actual value to be used', 'Direct: the operand is the memory address where the value is stored'] }],
  '1.3.1': [{ q: 'Explain why HTTPS uses both asymmetric and symmetric encryption.', marks: 4, scheme: [
    'Asymmetric encryption is used during the handshake to exchange a symmetric session key', 'This works securely without any pre-shared secret', 'Asymmetric encryption is slow, so it is not used for the bulk data', 'The fast symmetric session key then encrypts all the actual data transferred'] }],
  '1.3.2': [{ q: 'State what is meant by referential integrity and explain why it is important.', marks: 2, scheme: [
    'Every foreign key value must match an existing primary key in the related table', 'It prevents orphaned records that reference data which does not exist'] }],
  '1.3.3': [{ q: 'Give two advantages of packet switching over circuit switching.', marks: 2, scheme: [
    'Efficient use of the network — links are shared between many communications rather than reserved', 'Resilient — if a link fails, packets are rerouted along another path'] }],
  '1.3.4': [{ q: 'Explain why input validation should be carried out on both the client and the server.', marks: 3, scheme: [
    'Client-side gives the user instant feedback and reduces server load', 'Client-side checks can be bypassed (JavaScript disabled or the request edited)', 'Server-side validation guarantees the data is always checked / keeps the system secure'] }],
  '1.4.1': [{ q: 'Convert the denary value -45 to 8-bit two’s complement. Show your working.', marks: 3, scheme: [
    '+45 in binary = 0010 1101', 'Invert all the bits → 1101 0010', 'Add 1 → 1101 0011'] }],
  '1.4.2': [{ q: 'Describe how a stack handles the push and pop operations, including one error condition.', marks: 4, scheme: [
    'push adds an item to the top and increments the top/stack pointer', 'pop removes and returns the item from the top and decrements the pointer', 'A stack is Last-In-First-Out (LIFO)', 'Overflow occurs if push is attempted when full (or underflow if pop is attempted when empty)'] }],
  '1.4.3': [{ q: 'Simplify A.B + A.(NOT B), showing each step and naming the law used.', marks: 3, scheme: [
    'A.(B + NOT B)  — distributive law', 'B + NOT B = 1 — complement law', 'A.1 = A — identity law, so the answer is A'] }],
  '1.5.1': [{ q: 'A student logs into a teacher’s account without permission and changes a grade. State which Act applies and the offence(s) committed.', marks: 3, scheme: [
    'The Computer Misuse Act 1990', 'Unauthorised access to computer material (section 1)', 'Unauthorised modification of computer material (section 3) / access with intent'] }],
  '1.5.2': [{ q: 'Discuss one ethical concern of using AI to make hiring decisions.', marks: 4, scheme: [
    'Identifies the concern of bias / unfair discrimination', 'Explains the mechanism: the AI learns from historical data that may reflect human bias', 'States a consequence: candidates treated unfairly and decisions hard to challenge (black box)', 'Gives a balanced point or mitigation, e.g. human oversight / auditing the model'] }],
  '2.1.1': [{ q: 'Explain, using an example, what is meant by abstraction.', marks: 3, scheme: [
    'Removing unnecessary detail from a problem', 'Keeping only the detail relevant to the solution', 'A valid example, e.g. a Tube map shows connections/order but not real distances'] }],
  '2.1.2': [{ q: 'State what is meant by a precondition and give an example.', marks: 2, scheme: [
    'A condition that must be true before an algorithm will run / work correctly', 'A valid example, e.g. the list must be sorted before a binary search'] }],
  '2.1.3': [{ q: 'Give two benefits of decomposing a problem into separate modules.', marks: 2, scheme: [
    'Different people/teams can work on modules in parallel', 'Modules can be reused and tested individually / are easier to maintain'] }],
  '2.1.4': [{ q: 'Explain why some tasks cannot benefit from concurrent processing.', marks: 2, scheme: [
    'The steps are sequential/dependent — each step needs the result of the previous one', 'So they must run in order; parallelism is impossible (and coordination overhead may outweigh any gain)'] }],
  '2.2.1': [{ q: 'Compare recursion and iteration in terms of memory use.', marks: 3, scheme: [
    'Recursion stores each unfinished call on the call stack', 'This risks a stack overflow if the recursion is too deep', 'Iteration uses (roughly) constant extra memory, so is more memory-efficient'] }],
  '2.2.2': [{ q: 'Explain what is meant by polymorphism, using an example.', marks: 3, scheme: [
    'The same method call behaves differently depending on the object’s class', 'Achieved by overriding an inherited method', 'A valid example, e.g. Dog.speak() returns “Woof” and Cat.speak() returns “Meow”, both called via Animal'] }],
  '2.2.3': [{ q: 'Explain why a heuristic might be used instead of an exact algorithm.', marks: 2, scheme: [
    'The exact (optimal) algorithm is intractable / too slow for the size of input', 'A heuristic finds a good-enough solution in an acceptable amount of time'] }],
  '2.3.1': [{ q: 'State the Big-O time complexity of binary search and justify it.', marks: 2, scheme: [
    'O(log n)', 'Because it halves the number of items still to be searched at each comparison'] }],
  '2.3.2': [{ q: 'Explain why binary search cannot be used on the list [4, 1, 7, 3].', marks: 2, scheme: [
    'The list is not sorted', 'Binary search relies on order to decide which half to discard, so on unsorted data it gives incorrect results'] }],
  '2.3.3': [{ q: 'Explain why A* usually explores fewer nodes than Dijkstra’s algorithm.', marks: 3, scheme: [
    'A* uses a heuristic that estimates the remaining cost from a node to the goal', 'It prioritises nodes by f(n) = g(n) + h(n), steering the search towards the goal', 'So it expands fewer nodes, while still finding the optimal path if the heuristic is admissible'] }],
};

for (const topic of OCR_ALEVEL.topics)
  for (const sp of topic.specPoints)
    if (EXAM[sp.id]) sp.exam = EXAM[sp.id];
