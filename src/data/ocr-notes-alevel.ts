// OCR A-Level Computer Science Revision Notes
// Extracted from compscitutoring-web for use in kingswood-cs-web
// Topics: Contemporary Processors, Software & Development, Exchanging Data, Data Types/Structures/Algorithms, Legal/Moral/Cultural/Ethical Issues, Computational Thinking, Problem Solving & Programming, Algorithms

export const OCR_ALEVEL_NOTES = {
  'ocr-1': {
    title: 'Contemporary Processors',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '⚙️ CPU Internal Components', body: 'The CPU contains: <strong>ALU</strong> (arithmetic and logic operations), <strong>CU</strong> (controls FDE cycle), <strong>registers</strong> (PC, MAR, MDR, CIR, ACC), <strong>cache</strong> (L1/L2/L3 SRAM). The <strong>system bus</strong> connects CPU to memory and I/O: <strong>data bus</strong> (bidirectional, carries data), <strong>address bus</strong> (unidirectional CPU→memory, carries addresses), <strong>control bus</strong> (bidirectional, carries control signals like read/write, clock).' },
      { type: 'keyterm', term: 'Bus Width', def: 'Number of parallel wires in a bus. A 32-bit address bus can address 2³² = 4GB of memory. A 64-bit data bus transfers 64 bits per cycle. Wider buses = faster data transfer and more addressable memory.' },
      { type: 'text', heading: '📈 CPU Performance', body: 'Factors: <strong>Clock speed</strong> (GHz), <strong>cores</strong> (parallel processing), <strong>cache size/levels</strong> (L1 fastest ~1ns, L3 ~10ns, RAM ~100ns), <strong>pipelining</strong> (overlaps FDE stages), <strong>branch prediction</strong> (speculatively executes likely path), <strong>word length</strong> (64-bit processes more per cycle than 32-bit).' },
      { type: 'text', heading: '🏗️ RISC vs CISC', body: '<strong>RISC</strong>: small instruction set, each executes in one cycle, load-store architecture, more registers, compiler does more work, easy to pipeline. Examples: ARM (mobile phones). <strong>CISC</strong>: large instruction set, complex multi-cycle instructions, operations directly on memory, hardware handles complexity. Examples: x86 (Intel/AMD desktops).' },
      { type: 'text', heading: '⛓️ Pipelining', body: 'Overlaps fetch, decode, execute of consecutive instructions. Throughput improves — one instruction completes per cycle in ideal conditions. Disrupted by <strong>data hazards</strong> (result needed before computed) and <strong>control hazards</strong> (branch/jump changes PC). Modern CPUs use out-of-order execution and speculative execution to mitigate these.' },
      { type: 'text', heading: '🖥️ Multiprocessing', body: '<strong>Symmetric multiprocessing (SMP)</strong>: multiple processors share one memory and OS — used in servers. <strong>Asymmetric</strong>: each processor has dedicated task. <strong>Multi-core</strong>: multiple cores on one chip, shared cache. <strong>Massively parallel</strong>: GPU has thousands of small cores — ideal for graphics and ML workloads.' },
      { type: 'tip', text: 'OCR often asks about the Harvard architecture. Key difference from von Neumann: separate memory and buses for instructions and data, so both can be fetched simultaneously — eliminates the von Neumann bottleneck.' },
    ]
  },

  'ocr-2': {
    title: 'Software & Software Development',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '🔤 Language Translation', body: '<strong>Assembler</strong>: assembly → machine code (one-to-one, fast). <strong>Compiler</strong>: translates whole program before execution — produces standalone executable, fast runtime, errors found at compile time. <strong>Interpreter</strong>: translates and executes line-by-line — no executable, easier to debug, slower runtime. <strong>JIT (Just-In-Time) compiler</strong>: compiles at runtime — used by Java (JVM) and C# — combines interpreter flexibility with compiled speed.' },
      { type: 'table', headers: ['Translator', 'Process', 'Advantages', 'Used for'], rows: [
        ['Assembler', 'Assembly → machine code', 'Fast, direct hardware control', 'Embedded systems'],
        ['Compiler', 'Whole program → executable', 'Fast runtime, distributable', 'C, C++, Go'],
        ['Interpreter', 'Line by line', 'Easy debugging, portable', 'Python, JavaScript (V8)'],
        ['JIT', 'Compile hot paths at runtime', 'Portable + near-compiled speed', 'Java, C#']
      ] },
      { type: 'text', heading: '🏗️ Software Development Methodologies', body: '<strong>Waterfall</strong>: sequential phases — clear milestones, poor for changing requirements. <strong>Agile (Scrum)</strong>: 2-week sprints, daily standups, backlog, working software each sprint — adapts to change. <strong>Extreme Programming (XP)</strong>: pair programming, test-first (TDD), continuous integration. <strong>Spiral</strong>: risk-driven iterations.' },
      { type: 'text', heading: '🧪 Testing', body: '<strong>Alpha testing</strong>: in-house testing by developers. <strong>Beta testing</strong>: limited release to real users. <strong>White-box</strong>: tests internal logic, code coverage. <strong>Black-box</strong>: tests from user perspective — inputs/outputs only. <strong>Regression testing</strong>: re-run tests after changes to ensure nothing broke.' },
      { type: 'text', heading: '📋 Types of Software', body: '<strong>System software</strong>: OS, utilities, device drivers, firmware. <strong>Application software</strong>: productivity, entertainment, specialised. <strong>Open source</strong>: free, inspectable, community-maintained. <strong>Closed source/proprietary</strong>: source code hidden, licensed. <strong>Malware</strong>: technically software, designed to harm.' },
      { type: 'tip', text: 'For OCR A Level, know the differences between compiler and interpreter in depth — advantages/disadvantages of each, and when each is used. JIT is a common higher-mark question.' },
    ]
  },

  'ocr-3': {
    title: 'Exchanging Data',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '📡 Communication Fundamentals', body: '<strong>Bandwidth</strong>: maximum data rate (bps). <strong>Latency</strong>: delay between send and receive. <strong>Serial transmission</strong>: bits sent one at a time — used for long distances (USB, SATA). <strong>Parallel</strong>: multiple bits simultaneously — fast over short distances but synchronisation issues. <strong>Synchronous</strong>: sender/receiver share clock signal. <strong>Asynchronous</strong>: start/stop bits delimit each byte.' },
      { type: 'text', heading: '🔒 Encryption', body: '<strong>Symmetric encryption</strong>: same key for encryption and decryption (AES). Fast, but key must be shared securely. <strong>Asymmetric encryption</strong>: public key encrypts, private key decrypts (RSA). Solves key distribution but slower. <strong>Digital signatures</strong>: sender encrypts a hash with their private key — receiver verifies with sender\'s public key. Provides authenticity and non-repudiation. <strong>Certificates</strong>: issued by Certificate Authorities (CA) to verify public keys.' },
      { type: 'worked', label: '✏️ How TLS (HTTPS) works', code: '1. Client sends supported cipher suites\n2. Server responds with certificate (public key)\n3. Client verifies certificate with trusted CA\n4. Key exchange: client generates pre-master secret,\n   encrypts with server\'s public key, sends it\n5. Server decrypts with private key\n6. Both derive symmetric session key\n7. All further data encrypted with session key (AES)' },
      { type: 'text', heading: '🌐 Networking Protocols', body: '<strong>TCP/IP stack</strong>: Application (HTTP, FTP, SMTP, DNS), Transport (TCP/UDP), Internet (IP), Link (Ethernet/Wi-Fi). <strong>TCP</strong>: reliable, ordered, error-checked, connection-oriented. <strong>UDP</strong>: fast, connectionless, no guarantee — used for streaming, DNS, VoIP. <strong>IP</strong>: routes packets using IP addresses. IPv4 (32-bit, ~4 billion addresses) → IPv6 (128-bit, 340 undecillion).' },
      { type: 'text', heading: '📦 Packet Switching & Routing', body: 'Data split into packets. Each packet independently routed — may take different paths, arrive out of order. TCP reassembles using sequence numbers. <strong>Routing algorithms</strong>: RIP (Routing Information Protocol — hop count), OSPF (Open Shortest Path First — uses Dijkstra\'s on the network graph).' },
      { type: 'tip', text: 'For the OCR A Level exam, the encryption question is reliably worth marks. Know: symmetric vs asymmetric, the role of public/private keys, digital signatures, and how TLS uses asymmetric to exchange a symmetric key.' },
    ]
  },

  'ocr-4': {
    title: 'Data Types, Data Structures & Algorithms',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '🗃️ Data Structures', body: '<strong>Array</strong>: fixed-size, indexed, random access O(1). <strong>Linked list</strong>: dynamic size, sequential access O(n), easy insert/delete. <strong>Stack</strong>: LIFO — push/pop/peek, used for call stack, undo operations, expression evaluation. <strong>Queue</strong>: FIFO — enqueue/dequeue, used for scheduling, buffers. <strong>Tree</strong>: hierarchical, BST for fast search O(log n). <strong>Hash table</strong>: key→value, O(1) average access, handles collisions via chaining or open addressing. <strong>Graph</strong>: vertices + edges, directed/undirected, weighted.' },
      { type: 'table', headers: ['Structure', 'Access', 'Insert', 'Delete', 'Use case'], rows: [
        ['Array', 'O(1)', 'O(n)', 'O(n)', 'Fixed-size indexed data'],
        ['Linked List', 'O(n)', 'O(1)*', 'O(1)*', 'Dynamic lists, queues'],
        ['Stack', 'O(1) top', 'O(1)', 'O(1)', 'Undo, call stack, parsing'],
        ['Queue', 'O(1) front', 'O(1)', 'O(1)', 'Scheduling, buffers'],
        ['Hash Table', 'O(1) avg', 'O(1) avg', 'O(1) avg', 'Fast lookup (dicts)'],
        ['BST', 'O(log n) avg', 'O(log n)', 'O(log n)', 'Sorted data, search']
      ] },
      { type: 'text', heading: '🌳 Trees', body: '<strong>Binary tree</strong>: each node has ≤2 children. <strong>BST (Binary Search Tree)</strong>: left < parent < right — O(log n) search if balanced. <strong>Tree traversals</strong>: in-order (L-Root-R, gives sorted BST), pre-order (Root-L-R, copies tree), post-order (L-R-Root, deletes tree/RPN evaluation). <strong>Heap</strong>: complete binary tree where parent ≥ children (max-heap) — used in priority queues and heapsort.' },
      { type: 'text', heading: '#️⃣ Hashing', body: 'A hash function maps a key to an array index. A good hash function distributes keys uniformly. <strong>Collision</strong>: two keys map to same index. Handled by: <strong>chaining</strong> (linked list at each slot) or <strong>open addressing</strong> (probe for next empty slot — linear probing, quadratic probing).' },
      { type: 'text', heading: '🔢 Numeric Representations', body: '<strong>Two\'s complement</strong>: standard signed integer representation. To negate: flip all bits + 1. Range for n bits: −2^(n−1) to 2^(n−1)−1. <strong>Floating point</strong>: sign bit + mantissa + exponent. Normalised: mantissa starts .1... (binary). Trade-off: more exponent bits → larger range; more mantissa bits → more precision.' },
      { type: 'worked', label: '✏️ Two\'s Complement: −5 in 8 bits', code: '5 in binary:    00000101\nFlip all bits:  11111010\nAdd 1:          11111011  ← this is −5\n\nVerify: 11111011\n= −128 + 64 + 32 + 16 + 8 + 2 + 1\n= −128 + 123 = −5 ✓' },
      { type: 'tip', text: 'Hash tables and their collision handling come up frequently. Know both chaining (linked lists) and open addressing (linear probing) — be able to trace through an insertion that causes a collision.' },
    ]
  },

  'ocr-5': {
    title: 'Legal, Moral, Cultural & Ethical Issues',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '⚖️ Computing Legislation', body: '<strong>Computer Misuse Act 1990</strong>: Section 1 — unauthorised access; Section 2 — unauthorised access with further intent; Section 3 — unauthorised modification (creating malware); Section 3A — supplying hacking tools. <strong>Data Protection Act 2018</strong>: implements GDPR in UK — 7 principles. <strong>Copyright Act 1988</strong>: software, music, writing. <strong>Investigatory Powers Act 2016</strong> ("Snoopers Charter"): bulk surveillance powers.' },
      { type: 'text', heading: '🌐 Ethical Frameworks', body: '<strong>Utilitarianism</strong>: an action is right if it maximises overall happiness — used to justify mass surveillance ("saves more lives"). <strong>Kantian/deontological ethics</strong>: actions are right or wrong regardless of consequences — "never treat people merely as means". Useful for analysing whether data collection is inherently wrong regardless of outcome.' },
      { type: 'text', heading: '🤖 AI Ethics', body: 'Key issues: <strong>Algorithmic bias</strong> — biased training data produces discriminatory outcomes (facial recognition worse for darker skin tones). <strong>Explainability</strong> — "black box" models can\'t be audited. <strong>Accountability</strong> — who is responsible when AI causes harm? <strong>Autonomous weapons</strong> — should machines make lethal decisions? <strong>Privacy</strong> — mass data collection enables manipulation.' },
      { type: 'text', heading: '👩‍💻 Professional Issues', body: 'Professional responsibility: <strong>BCS Code of Conduct</strong> — public interest, duty to employers/clients, professional competence, professional integrity. <strong>Whistleblowing</strong>: legal protections exist but vary. <strong>Intellectual property</strong>: copyright (automatic), patents (registered), trade secrets. <strong>Open source</strong> licensing: GPL (copyleft — derivatives must also be open source), MIT/BSD (permissive).' },
      { type: 'tip', text: 'For 8–12 mark "evaluate" questions on ethical issues, structure your answer: (1) define the issue, (2) present arguments for, (3) present arguments against, (4) provide a reasoned conclusion. Show you understand multiple perspectives.' },
    ]
  },

  'ocr-6': {
    title: 'Elements of Computational Thinking',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '🧠 The Four Pillars', body: '<strong>Abstraction</strong>: removing unnecessary detail — modelling only what matters. Levels: problem abstraction (what needs solving), data abstraction (hiding implementation), procedural abstraction (hiding implementation of subroutines). <strong>Decomposition</strong>: breaking into sub-problems — enables parallel development, testing, reuse. <strong>Pattern recognition</strong>: identifying reusable solutions — leads to design patterns, libraries. <strong>Algorithmic thinking</strong>: defining precise steps — leads to implementable code.' },
      { type: 'keyterm', term: 'Abstraction Layers', def: 'Computer systems use multiple abstraction layers: hardware → machine code → OS → programming language → application. Each layer hides complexity from the layer above. Programmers work at high levels without knowing hardware details.' },
      { type: 'text', heading: '🔢 Computability & Problem Classes', body: '<strong>Tractable problems</strong>: solvable in polynomial time — O(n^k). <strong>Intractable problems</strong>: only solvable in exponential time — O(k^n) — not practically solvable for large n. <strong>TSP</strong> (Travelling Salesman Problem) is intractable. <strong>Heuristic approaches</strong> find good-enough solutions for intractable problems (nearest-neighbour for TSP).' },
      { type: 'text', heading: '📊 Complexity Classes', body: '<strong>P</strong>: decision problems solvable in polynomial time. <strong>NP</strong>: problems whose solutions can be <em>verified</em> in polynomial time (but not necessarily solved quickly). <strong>NP-complete</strong>: hardest problems in NP — if any NP-complete problem is in P, then P=NP. The P vs NP question is one of the great unsolved problems in computer science. Believed (but not proved) that P≠NP.' },
      { type: 'tip', text: 'The P vs NP question comes up regularly. Remember: P ⊆ NP. All problems in P are also in NP. The question is whether NP is strictly larger than P. Current consensus: yes (P≠NP) but unproven.' },
    ]
  },

  'ocr-7': {
    title: 'Problem Solving & Programming',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '📋 Programming Concepts', body: 'OCR A Level expects fluency in a programming language. Key concepts: <strong>sequence, selection, iteration</strong> (the three constructs), <strong>subroutines</strong> (functions/procedures, parameters, return values), <strong>recursion</strong> (base case + recursive case), <strong>file handling</strong> (open/read/write/close), <strong>exception handling</strong> (try/except), <strong>OOP</strong> (classes, objects, inheritance, polymorphism, encapsulation).' },
      { type: 'text', heading: '🏛️ OOP in Depth', body: '<strong>Encapsulation</strong>: bundling data + methods, hiding internal state (private attributes). <strong>Inheritance</strong>: child class inherits parent\'s attributes/methods — promotes code reuse. <strong>Polymorphism</strong>: same method name, different behaviour in different classes (overriding). <strong>Abstraction</strong>: abstract classes/interfaces define contracts without implementation.' },
      { type: 'worked', label: '✏️ OOP Example: Shape hierarchy', code: 'class Shape:\n    def area(self):  # abstract\n        raise NotImplementedError\n\nclass Circle(Shape):\n    def __init__(self, r): self.r = r\n    def area(self): return 3.14 * self.r ** 2\n\nclass Rectangle(Shape):\n    def __init__(self, w, h): self.w=w; self.h=h\n    def area(self): return self.w * self.h\n\n# Polymorphism: same call, different behaviour\nshapes = [Circle(5), Rectangle(4, 6)]\nfor s in shapes:\n    print(s.area())  # 78.5, then 24' },
      { type: 'text', heading: '🔄 Recursion', body: 'A recursive function calls itself. Must have: a <strong>base case</strong> (stops recursion) and a <strong>recursive case</strong> (moves toward base case). Each call adds a stack frame — too many levels causes stack overflow. <strong>Tail recursion</strong> can be optimised by compilers to avoid stack growth. Recursion suits tree/graph traversal, divide-and-conquer algorithms.' },
      { type: 'tip', text: 'OCR often asks you to write recursive solutions to problems like factorial, Fibonacci, or binary search. Always write the base case FIRST, then the recursive case. Show clearly that the recursive case moves toward the base case.' },
    ]
  },

  'ocr-8': {
    title: 'Algorithms — OCR A Level',
    spec: 'OCR', level: 'alevel',
    sections: [
      { type: 'text', heading: '📊 Algorithm Complexity', body: 'Big O notation describes growth rate. Common complexities: O(1) constant — array access. O(log n) logarithmic — binary search. O(n) linear — linear search. O(n log n) — merge sort, quicksort. O(n²) quadratic — bubble sort, selection sort. O(2ⁿ) exponential — brute force problems. Rule: always use the DOMINANT term, drop constants (3n² + 5n → O(n²)).' },
      { type: 'text', heading: '🔃 Sorting Algorithms', body: '<strong>Bubble sort</strong>: O(n²) worst/avg, O(n) best. Simple, in-place, stable. <strong>Merge sort</strong>: O(n log n) always. Stable, needs O(n) extra space. Divide-and-conquer. <strong>Quicksort</strong>: O(n log n) avg, O(n²) worst. In-place, not stable — pivot choice matters. <strong>Insertion sort</strong>: O(n²) worst, O(n) best (nearly sorted). Good for small/nearly sorted data.' },
      { type: 'text', heading: '🌳 Graph Algorithms', body: '<strong>Dijkstra\'s</strong>: single-source shortest path in weighted non-negative graph. Greedy. O((V+E) log V) with priority queue. <strong>A*</strong>: Dijkstra + heuristic to focus search toward goal. <strong>Prim\'s MST</strong>: greedy, grows tree one edge at a time — picks cheapest edge connecting tree to unvisited node. <strong>Kruskal\'s MST</strong>: sort all edges, add if no cycle — uses union-find. <strong>DFS</strong>: uses stack, explores depth first. <strong>BFS</strong>: uses queue, explores breadth first (finds shortest path in unweighted graph).' },
      { type: 'worked', label: '✏️ Dijkstra\'s Step-by-Step', code: 'Graph: A-B(4), A-C(2), C-B(1), B-D(5), C-D(8)\nFind shortest path A→D\n\nInit:  A=0, B=∞, C=∞, D=∞, unvisited={A,B,C,D}\nVisit A: update B=4, C=2\nVisit C(min=2): update B=min(4, 2+1)=3, D=min(∞,2+8)=10\nVisit B(min=3): update D=min(10, 3+5)=8\nVisit D(min=8): done\nShortest A→D = 8 via A→C→B→D' },
      { type: 'tip', text: 'For Dijkstra\'s in the exam, always maintain a table showing current known distance and whether each node is visited. Update systematically — don\'t skip steps. Show the path as well as the distance.' },
    ]
  },
};

export type OCRAlevelTopic = typeof OCR_ALEVEL_NOTES[keyof typeof OCR_ALEVEL_NOTES];
