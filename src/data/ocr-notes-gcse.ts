// OCR GCSE Computer Science Revision Notes
// Extracted from compscitutoring-web for use in kingswood-cs-web
// Topics: Systems Architecture, Algorithms, Programming Fundamentals

export const OCR_GCSE_NOTES = {
  'ocrg-1': {
    title: 'Systems Architecture',
    spec: 'OCR GCSE', level: 'gcse',
    sections: [
      { type: 'text', heading: '🖥️ The Purpose of the CPU',
        body: 'The CPU (Central Processing Unit) is the component that carries out the instructions of a program. It is sometimes called the "brain" of the computer. The CPU works by repeatedly fetching an instruction from memory, decoding what it means, and then executing it. This is the Fetch-Decode-Execute (FDE) cycle.' },
      { type: 'text', heading: '🔄 The Fetch-Decode-Execute Cycle in Detail',
        body: 'Every program instruction — from a simple addition to a complex graphics operation — is processed through the same three-stage cycle. The cycle happens billions of times per second in a modern processor. Registers are the small, ultra-fast storage locations inside the CPU that hold data during each stage of the cycle.' },
      { type: 'table', headers: ['Register', 'Full Name', 'What it holds'],
        rows: [
          ['PC', 'Program Counter', 'Address of the NEXT instruction to fetch. Increments after each fetch; updated by jump/branch instructions.'],
          ['MAR', 'Memory Address Register', 'Address of the memory location currently being read or written.'],
          ['MDR', 'Memory Data Register', 'Data just read FROM memory, or data about to be written TO memory.'],
          ['ACC', 'Accumulator', 'Holds the result of the most recent ALU operation (addition, subtraction, etc.)'],
          ['CIR', 'Current Instruction Register', 'Holds the instruction currently being decoded and executed by the Control Unit.'],
        ] },
      { type: 'worked', label: '✏️ FDE Cycle — Step-by-Step Walk-Through',
        code: 'FETCH:\n  1. PC contains 0x0010 (address of next instruction)\n  2. PC → MAR  (MAR now holds 0x0010)\n  3. Fetch instruction at memory[0x0010] → MDR\n  4. MDR → CIR (instruction copied into CIR)\n  5. PC = PC + 1 (now 0x0011, ready for next instruction)\n\nDECODE:\n  6. Control Unit reads CIR and identifies the operation\n     e.g. "ADD 5" means "add 5 to the accumulator"\n\nEXECUTE:\n  7. ALU performs ACC = ACC + 5\n  8. Result stored back in ACC\n\nCycle repeats from step 1 with updated PC.' },
      { type: 'text', heading: '⚡ What Affects CPU Performance?',
        body: 'Three key factors affect how fast a CPU processes instructions: <strong>Clock speed</strong>, <strong>Number of cores</strong>, and <strong>Cache size</strong>. Note: a faster clock speed does NOT automatically mean a faster computer overall — the type of workload matters.' },
      { type: 'table', headers: ['Factor', 'What it means', 'Effect on performance'],
        rows: [
          ['Clock speed (GHz)', 'Number of clock cycles per second. Each cycle, the CPU can process part of an instruction.', 'Higher = more instructions processed per second. But not all tasks use the full clock speed.'],
          ['Number of cores', 'Each core is an independent processing unit that can run instructions simultaneously.', 'More cores = more tasks handled at the same time (parallel processing). A quad-core is not 4× faster — some tasks cannot be parallelised.'],
          ['Cache size (L1/L2/L3)', 'Tiny, ultra-fast memory built into the CPU. CPU checks cache before slow RAM.', 'Larger cache = fewer slow RAM accesses. L1 cache is fastest and smallest (KB). L3 is slower but larger (MB).'],
        ] },
      { type: 'worked', label: '✏️ "State three factors that affect CPU performance" — Model Answer',
        code: '1. Clock speed — a higher clock speed means more clock cycles per second\n   so the CPU can execute more instructions per second.\n\n2. Number of cores — each core can process instructions independently,\n   allowing multiple tasks to run simultaneously (parallel processing).\n\n3. Cache size — a larger cache means the CPU finds recently-used data\n   faster without waiting for slower main memory (RAM) access.' },
      { type: 'text', heading: '💾 Von Neumann Architecture',
        body: 'Most computers use the <strong>Von Neumann architecture</strong>, designed by John von Neumann in 1945. Its key features: (1) Program instructions and data are stored together in the same main memory. (2) The CPU fetches instructions from memory one at a time. (3) A single bus (pathway) carries both data and instructions between memory and CPU. The disadvantage is the <strong>Von Neumann bottleneck</strong> — the bus is a bottleneck because the CPU can only fetch one instruction or one piece of data at a time.' },
      { type: 'keyterm', term: 'Embedded system',
        def: 'A computer system built into a specific device to perform one dedicated function. Unlike a general-purpose computer, an embedded system runs fixed software stored in ROM and has no keyboard or screen. Examples: washing machine, ABS brakes, smart thermostat, pacemaker, traffic lights.' },
      { type: 'tip', text: 'OCR exam question: "Describe the purpose of the accumulator." Answer: "The accumulator stores the result of calculations carried out by the ALU. For example, after an addition operation, the result is placed in the accumulator." Two sentences: what it stores + an example.' },
      { type: 'mistake', text: 'Many students write "the CPU stores programs" — it does not. The CPU PROCESSES instructions. Programs are stored in RAM (currently running) or secondary storage (HDD/SSD) when not in use.' },
    ]
  },

  'ocrg-7': {
    title: 'Algorithms',
    spec: 'OCR GCSE', level: 'gcse',
    sections: [
      { type: 'text', heading: '📋 Representing Algorithms', body: 'Algorithms are represented using flowcharts or pseudocode. The three fundamental constructs are: <strong>sequence</strong> (steps in order), <strong>selection</strong> (IF/ELSE decisions), and <strong>iteration</strong> (FOR/WHILE loops).' },
      { type: 'text', heading: '🔍 Searching', body: '<strong>Linear search</strong>: checks each element in turn. O(n). No pre-condition. Simple. <strong>Binary search</strong>: list MUST be sorted. Compares to middle element; search left or right half. O(log n). Significantly faster for large datasets.' },
      { type: 'worked', label: '✏️ Pseudocode: Binary Search', code: 'PROCEDURE binarySearch(list, target)\n  low ← 0\n  high ← length(list) - 1\n  WHILE low <= high\n    mid ← (low + high) DIV 2\n    IF list[mid] = target THEN\n      RETURN mid\n    ELSE IF list[mid] < target THEN\n      low ← mid + 1\n    ELSE\n      high ← mid - 1\n    ENDIF\n  ENDWHILE\n  RETURN -1  // not found\nENDPROCEDURE' },
      { type: 'text', heading: '🔃 Sorting', body: '<strong>Bubble sort</strong>: compare adjacent pairs, swap if out of order, repeat. Each pass puts the next largest in place. Simple but O(n²). <strong>Insertion sort</strong>: build sorted section from left; insert each new element into correct position by shifting. Also O(n²) but faster for nearly-sorted data. <strong>Merge sort</strong>: divide in half recursively, merge sorted halves. O(n log n) — more efficient but harder to implement.' },
      { type: 'text', heading: '📊 Efficiency', body: 'Big O tells us how time grows with input size n. O(log n) is extremely efficient (binary search: 1 billion items takes ~30 comparisons). O(n²) is slow for large data (1000 items → 1 million comparisons). Always choose O(n log n) over O(n²) for large datasets.' },
      { type: 'tip', text: 'The OCR GCSE exam often asks you to trace an algorithm and complete a trace table. Write out every variable for every step — don\'t skip ahead. Marks are awarded for each correct state, not just the final answer.' },
      { type: 'mistake', text: 'Merge sort is NOT on the OCR GCSE specification in the same depth as bubble sort. For OCR GCSE, focus on bubble sort and insertion sort. Merge sort is more relevant at A Level.' },
    ]
  },

  'ocrg-8': {
    title: 'Programming Fundamentals',
    spec: 'OCR GCSE', level: 'gcse',
    sections: [
      { type: 'text', heading: '🏗️ The Three Constructs', body: 'Every program is built from three constructs: <strong>Sequence</strong> — instructions executed in order. <strong>Selection</strong> — different code runs depending on a condition (IF/ELIF/ELSE). <strong>Iteration</strong> — code repeats (FOR count-controlled; WHILE condition-controlled).' },
      { type: 'worked', label: '✏️ Example: All Three Constructs', code: 'total = 0                    # sequence\nFOR i IN range(1, 6):        # iteration (count)\n    IF i % 2 == 0:           # selection\n        total = total + i    # sequence\nprint(total)                 # output 2+4 = 6' },
      { type: 'text', heading: '📦 Data Types', body: '<strong>Integer</strong>: whole number (5, -3, 0). <strong>Float/Real</strong>: decimal (3.14, -0.5). <strong>String</strong>: text ("hello", "42"). <strong>Boolean</strong>: True/False. <strong>Character</strong>: single character (\'a\').' },
      { type: 'keyterm', term: 'Casting', def: 'Converting between data types. int("5")→5, str(42)→"42", float("3.14")→3.14. Essential when combining user input (always string) with numbers.' },
      { type: 'text', heading: '🔤 String Operations', body: 'Key string operations: <strong>len(s)</strong> — length. <strong>s.upper()</strong>, <strong>s.lower()</strong> — case. <strong>s[0]</strong> — first character (index from 0). <strong>s[1:4]</strong> — slice. <strong>s + t</strong> — concatenation. <strong>str.split()</strong> — split into list.' },
      { type: 'text', heading: '📚 Arrays/Lists', body: 'Store multiple values. Access by index (starts at 0). In Python: my_list = [10, 20, 30]. my_list[0] = 10. For most algorithms: loop through with for i in range(len(list)):.' },
      { type: 'worked', label: '✏️ Finding Maximum in a List', code: 'scores = [45, 78, 23, 91, 56]\nhighest = scores[0]           # start with first\nFOR i IN range(1, len(scores)):\n    IF scores[i] > highest:\n        highest = scores[i]\nprint(highest)                # outputs 91' },
      { type: 'text', heading: '🔧 Subroutines', body: 'A subroutine (function/procedure) is a named block of code. <strong>Parameters</strong> pass data in. <strong>Return values</strong> send results back. Benefits: avoids repetition, easier to test, more readable.' },
      { type: 'tip', text: 'Always distinguish between a FUNCTION (returns a value) and a PROCEDURE (no return value). In Python, both use def, but procedures don\'t have a return statement.' },
      { type: 'mistake', text: 'list[1] gives the SECOND element, not the first. Python (and most languages) use zero-based indexing. list[0] is first, list[1] is second. This is a very common source of off-by-one errors.' },
    ]
  },
};

export type OCRGCSETopic = typeof OCR_GCSE_NOTES[keyof typeof OCR_GCSE_NOTES];
