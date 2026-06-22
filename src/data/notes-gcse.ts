// ═══════════════════════════════════════════════════════════════════
// GCSE Computer Science Notes — Spec-point level, textbook depth
// AQA 8525 · OCR J277 · Cambridge IGCSE 0478
// ═══════════════════════════════════════════════════════════════════
import type { ALevelBoard } from './notes-alevel';

const t = (heading: string, body: string) => ({ type:'text' as const, heading, body });
const kt = (term: string, def: string) => ({ type:'keyterm' as const, term, def });
const w = (label: string, code: string) => ({ type:'worked' as const, label, code });
const tip = (text: string) => ({ type:'tip' as const, text });
const err = (text: string) => ({ type:'mistake' as const, text });
const tbl = (headers: string[], rows: string[][]) => ({ type:'table' as const, headers, rows });

// ═══════════════════════════════════════════════════════════════════
// AQA GCSE (8525)
// ═══════════════════════════════════════════════════════════════════
const AQA_GCSE: ALevelBoard = {
  id: 'aqa-gcse', name: 'AQA GCSE (8525)',
  topics: [

  // ── 3.1 ALGORITHMS ───────────────────────────────────────────────
  { id:'ag-1', number:'3.1', name:'Fundamentals of Algorithms', specPoints: [

    { id:'3.1.1', title:'What is an Algorithm?',
      examTip:'An algorithm must be finite, unambiguous and effective — learn these three words exactly.',
      sections: [
        t('Definition and Properties','An <strong>algorithm</strong> is a precise, step-by-step set of instructions for solving a problem or completing a task. Three essential properties every algorithm must have: <strong>Finite</strong> — it must eventually stop. <strong>Unambiguous</strong> — every step is completely clear with no room for interpretation. <strong>Effective</strong> — it correctly solves the problem for all valid inputs.'),
        kt('Decomposition','Breaking a large, complex problem into smaller, more manageable sub-problems. Each sub-problem can be solved independently and the solutions combined. Example: "create a quiz app" decomposes into: display question, accept answer, check answer, update score, show result.'),
        kt('Abstraction','Removing unnecessary detail from a problem, keeping only what is relevant to the solution. A bus route map is an abstraction — it shows stops and connections but not buildings, road names or distances between stops.'),
        t('Representing Algorithms','Algorithms can be written as <strong>pseudocode</strong> (structured English-like code, language-independent) or drawn as <strong>flowcharts</strong> (visual diagrams using standard symbols). Both representations are used in AQA exams.'),
        tbl(['Flowchart symbol','Shape','Meaning'],
          [['Terminal','Oval','START or STOP'],
           ['Process','Rectangle','An action or calculation: total ← total + 1'],
           ['Decision','Diamond ◇','A yes/no question — two exits (YES and NO)'],
           ['Input/Output','Parallelogram','Data coming in or going out'],
           ['Flow arrow','→','Direction of execution']]),
        tip('When drawing a flowchart in an exam, every diamond (decision) must have exactly TWO exits labelled YES and NO. Every path must eventually reach STOP. Arrows must show direction.'),
        err('An algorithm is NOT the same as a program. An algorithm is the logical solution — independent of any programming language. A program is the algorithm expressed in a specific language (Python, Java, etc.).'),
      ]
    },

    { id:'3.1.2', title:'Searching Algorithms',
      examTip:'Binary search questions always ask you to show the middle element at each step — learn to calculate mid = (low + high) ÷ 2.',
      sections: [
        t('Linear Search','Checks each element one at a time from the start of the list until the target is found or the end is reached. Works on <strong>any list</strong> — sorted or unsorted. Simple to implement but slow for large lists.'),
        w('Linear Search Algorithm','SUBROUTINE linearSearch(list, target)\n  FOR i ← 0 TO LEN(list) - 1\n    IF list[i] == target THEN\n      RETURN i      // Found at index i\n    ENDIF\n  ENDFOR\n  RETURN -1         // Not found\nENDSUBROUTINE\n\nExample: search [4, 2, 7, 1, 9] for 7\n  Check list[0]=4 — no\n  Check list[1]=2 — no\n  Check list[2]=7 — YES! Return 2'),
        t('Binary Search','Works ONLY on <strong>sorted</strong> lists. Compares the target to the middle element; searches the left half if target is smaller, right half if larger. Halves the search space with each step — very fast.'),
        w('Binary Search Trace: find 7 in [1, 3, 5, 7, 9, 11, 13]','List:    1   3   5   7   9  11  13\nIndex:   0   1   2   3   4   5   6\n\nStep 1: low=0, high=6, mid=3\n        list[3]=7 — FOUND! Return 3\n(Only 1 comparison needed!)\n\nHarder example: find 11 in [1, 3, 5, 7, 9, 11, 13]\nStep 1: low=0, high=6, mid=3. list[3]=7. 11>7 → search right. low=4\nStep 2: low=4, high=6, mid=5. list[5]=11 — FOUND! Return 5\n(Only 2 comparisons for a 7-element list)'),
        tbl(['Feature','Linear Search','Binary Search'],
          [['Works on unsorted list?','YES','NO — must be sorted first'],
           ['Speed (worst case)','Checks every element (slow for large lists)','Halves the search space each step (fast for large sorted lists)'],
           ['1,000 items worst case','1,000 comparisons','~10 comparisons'],
           ['1,000,000 items','1,000,000 comparisons','~20 comparisons'],
           ['Best case','First element is target: 1 comparison','Middle element is target: 1 comparison'],
           ['When to use','Small or unsorted lists','Large sorted lists']]),
        tip('The key examiner phrase: binary search is faster for LARGE SORTED lists. Always mention BOTH conditions — large AND sorted.'),
        err('Binary search cannot be used on an unsorted list. If you need to use binary search but have an unsorted list, you must sort it first — but this has its own time cost.'),
      ]
    },

    { id:'3.1.3', title:'Sorting Algorithms',
      examTip:'Bubble sort exam questions always ask for a full trace of every pass. Show EVERY comparison and swap.',
      sections: [
        t('Bubble Sort','Repeatedly compares adjacent pairs of elements and swaps them if they are in the wrong order. After each complete pass, the largest unsorted element "bubbles" to its correct position at the right end. Stops when a complete pass makes no swaps (list is sorted). Simple but inefficient for large lists.'),
        w('Complete Bubble Sort Trace: [5, 3, 8, 1, 2]','Pass 1:\n  5 vs 3: 5>3, SWAP → [3, 5, 8, 1, 2]\n  5 vs 8: 5<8, no swap → [3, 5, 8, 1, 2]\n  8 vs 1: 8>1, SWAP → [3, 5, 1, 8, 2]\n  8 vs 2: 8>2, SWAP → [3, 5, 1, 2, 8]  ← 8 in final position\n\nPass 2:\n  3 vs 5: no swap → [3, 5, 1, 2, 8]\n  5 vs 1: SWAP → [3, 1, 5, 2, 8]\n  5 vs 2: SWAP → [3, 1, 2, 5, 8]  ← 5 in final position\n\nPass 3:\n  3 vs 1: SWAP → [1, 3, 2, 5, 8]\n  3 vs 2: SWAP → [1, 2, 3, 5, 8]  ← 3 in final position\n\nPass 4:\n  1 vs 2: no swap — no swaps this pass → SORTED! ✓'),
        kt('Bubble sort optimisation','After each pass, reduce the upper limit by 1 (the last element is already sorted). Also: if a complete pass makes NO swaps, the list is already sorted — stop early. This is an important efficiency improvement that can be mentioned in exam answers.'),
        t('Merge Sort','A divide-and-conquer algorithm. Recursively splits the list in half until single elements remain, then merges sorted sub-lists back together. Much more efficient than bubble sort for large lists because the number of operations grows much more slowly as the list gets longer.'),
        w('Merge Sort: [4, 2, 7, 1]','SPLIT phase:\n  [4, 2, 7, 1]\n  [4, 2]  [7, 1]\n  [4][2]  [7][1]\n\nMERGE phase:\n  [4] and [2]: compare 4 and 2 → take 2, then 4 → [2, 4]\n  [7] and [1]: compare 7 and 1 → take 1, then 7 → [1, 7]\n  [2,4] and [1,7]: compare 2 and 1 → take 1\n                   compare 2 and 7 → take 2\n                   compare 4 and 7 → take 4\n                   take 7\n                   → [1, 2, 4, 7] ✓'),
        tbl(['Feature','Bubble Sort','Merge Sort'],
          [['Efficiency','Slow for large lists — operations grow rapidly as list grows','Much faster for large lists — operations grow slowly as list grows'],
           ['Extra memory needed','No — sorts in place','Yes — needs extra space for merging'],
           ['100 items','~10,000 operations','~700 operations'],
           ['1,000 items','~1,000,000 operations','~10,000 operations'],
           ['Simple to code?','Yes','More complex (uses recursion)'],
           ['AQA requirement','Must trace step by step','Must trace split and merge']]),
        tip('For any bubble sort question: show EVERY comparison in EVERY pass, even when no swap occurs. Marks are given for each correct comparison result.'),
      ]
    },

    { id:'3.1.4', title:'Trace Tables',
      sections: [
        t('What is a Trace Table?','A trace table (dry run) manually tracks the value of each variable at each step of an algorithm. Used to: verify an algorithm is correct, find logic errors, and demonstrate understanding in exams. You create a column for each variable and a new row every time a variable changes value.'),
        w('Trace Table: Count positives in a list','Algorithm:\n  total ← 0\n  count ← 0\n  numbers ← [4, -2, 7, 0, 3]\n  FOR i ← 0 TO 4\n    IF numbers[i] > 0 THEN\n      total ← total + numbers[i]\n      count ← count + 1\n    ENDIF\n  ENDFOR\n  OUTPUT total, count\n\nTrace table:\n| i | numbers[i] | > 0? | total | count |\n|---|-----------|------|-------|-------|\n| 0 |     4     | YES  |   4   |   1   |\n| 1 |    -2     | NO   |   4   |   1   |\n| 2 |     7     | YES  |  11   |   2   |\n| 3 |     0     | NO   |  11   |   2   |\n| 4 |     3     | YES  |  14   |   3   |\n\nOutput: 14, 3'),
        w('Trace Table: WHILE loop with condition','Algorithm:\n  x ← 10\n  result ← 0\n  WHILE x > 0\n    result ← result + x\n    x ← x - 3\n  ENDWHILE\n  OUTPUT result\n\n|  x  | x>0? | result |\n|-----|------|--------|\n| 10  | YES  |   10   |\n|  7  | YES  |   17   |\n|  4  | YES  |   21   |\n|  1  | YES  |   22   |\n| -2  | NO   |   22   | ← loop ends\n\nOutput: 22'),
        tip('In a trace table exam question: (1) create a column for EVERY variable mentioned. (2) add a row EVERY TIME any variable changes. (3) if there is a condition, show whether it is true or false. (4) only show the final output at the very end.'),
        err('A common mistake is only showing rows where variables change. Show a row for EVERY iteration, even if some variables stay the same — the examiner needs to follow your trace step by step.'),
      ]
    },
  ]},

  // ── 3.2 PROGRAMMING ──────────────────────────────────────────────
  { id:'ag-2', number:'3.2', name:'Programming', specPoints: [

    { id:'3.2.1', title:'Variables, Constants & Data Types',
      sections: [
        t('Variables and Constants','A <strong>variable</strong> is a named storage location whose value can change during execution. A <strong>constant</strong> is a named value that is set once and never changes. Constants make code easier to read (use PI instead of 3.14159) and maintain (change the value in one place only).'),
        tbl(['Data type','What it stores','Example values','Notes'],
          [['Integer','Whole numbers','42, -7, 0','No decimal point'],
           ['Real (Float)','Numbers with decimals','3.14, -0.5, 2.0','Also called float or double'],
           ['Boolean','True or False only','True, False','Used in conditions'],
           ['String','Text (sequence of characters)','"Hello", "12A", ""','Always in quotes'],
           ['Character','A single character',"'A', '7', ' '",'Single quotes in some languages']]),
        kt('Type casting','Converting a value from one data type to another. INT("42") converts string "42" to integer 42. STR(99) converts integer 99 to string "99". Real(5) converts integer 5 to real 5.0. Needed when mixing types in expressions.'),
        w('Variables and Casting in AQA Pseudocode','name ← "Alice"\nage  ← 16\nscore ← 8.5\n\n// String concatenation requires casting:\nOUTPUT "Name: " + name\nOUTPUT "Age: " + STR(age)     // Must cast INT to STRING\nOUTPUT "Score: " + STR(score)  // Must cast REAL to STRING\n\n// Input always comes as string — cast if needed:\nINPUT ageInput\nage ← INT(ageInput)   // Convert input string to integer\n\n// Arithmetic with reals:\ntax  ← REAL(age) * 0.2  // Ensures decimal division'),
        tip('In AQA exams, INPUT always receives data as a string. If you need to do arithmetic with the input, you must cast it: age ← INT(INPUT()) or score ← REAL(INPUT()).'),
      ]
    },

    { id:'3.2.2', title:'Selection & Iteration',
      sections: [
        t('Selection: IF Statements','IF...THEN...ELSE...ENDIF allows the program to make decisions. Only the code in the branch matching the condition runs.'),
        w('IF Statement Examples','// Simple IF\nINPUT score\nIF score >= 50 THEN\n  OUTPUT "Pass"\nELSE\n  OUTPUT "Fail"\nENDIF\n\n// Multiple branches with ELIF\nIF score >= 70 THEN\n  OUTPUT "Grade A"\nELIF score >= 55 THEN\n  OUTPUT "Grade B"\nELIF score >= 40 THEN\n  OUTPUT "Grade C"\nELSE\n  OUTPUT "Grade U"\nENDIF\n// Only the FIRST true condition runs; rest are skipped'),
        t('Iteration: FOR, WHILE, REPEAT-UNTIL','<strong>FOR loop</strong>: use when you know in advance how many times to repeat. <strong>WHILE loop</strong>: use when you repeat until a condition becomes false — may run 0 times if condition is immediately false. <strong>REPEAT...UNTIL</strong>: always runs at least once — checks condition AFTER each iteration.'),
        w('Iteration Examples','// FOR — count 1 to 5\nFOR i ← 1 TO 5\n  OUTPUT i\nENDFOR\n// Outputs: 1 2 3 4 5\n\n// WHILE — input validation\nINPUT num\nWHILE num < 0 OR num > 100\n  OUTPUT "Enter a number between 0 and 100"\n  INPUT num\nENDWHILE\n// May run 0 times if first input is valid\n\n// REPEAT...UNTIL — menu\nREPEAT\n  OUTPUT "1. Start  2. Options  3. Quit"\n  INPUT choice\nUNTIL choice >= 1 AND choice <= 3\n// Always shows menu at least once'),
        tbl(['Loop type','Condition check','Minimum runs','Use when'],
          [['FOR','Before each iteration (implicit)','0 (if range is empty)','Number of iterations known in advance'],
           ['WHILE','Before each iteration','0 (condition may be false immediately)','Number of iterations unknown; may not run'],
           ['REPEAT...UNTIL','After each iteration','1 (always runs body once)','Must run at least once (e.g. input validation, menus)']]),
        tip('Input validation is a classic REPEAT...UNTIL use case: you always need to ask for input at least once, and you keep asking until the input is valid.'),
        err('WHILE and REPEAT...UNTIL look similar but the condition check timing is crucial. WHILE checks BEFORE (may run 0 times). REPEAT...UNTIL checks AFTER (always runs at least once). In the exam, choose based on whether the first run is always needed.'),
      ]
    },

    { id:'3.2.3', title:'Subroutines: Procedures & Functions',
      sections: [
        t('Why Use Subroutines?','A subroutine is a named block of code that performs a specific task and can be called from multiple places. Benefits: avoids repeating the same code (reuse), makes programs easier to read and understand, easier to test individual parts, and allows teams to work on different subroutines simultaneously.'),
        kt('Procedure','A subroutine that performs actions but does NOT return a value to the caller. Called as a statement on its own. Example: printReceipt() prints a receipt but does not produce a value for the rest of the program to use.'),
        kt('Function','A subroutine that performs actions AND returns a value using RETURN. Called within an expression. Example: calculateTax(amount) returns the calculated tax amount which can be used in a calculation.'),
        w('Procedure vs Function in AQA Pseudocode','// PROCEDURE — no return value\nSUBROUTINE greet(name)\n  OUTPUT "Hello, " + name + "!"\nENDSUBROUTINE\n\ngreet("Alice")   // Output: Hello, Alice!\ngreet("Bob")     // Reuse: Hello, Bob!\n\n// FUNCTION — returns a value\nSUBROUTINE calculateArea(width, height)\n  area ← width * height\n  RETURN area\nENDSUBROUTINE\n\nroomArea ← calculateArea(5, 3)    // roomArea = 15\nOUTPUT "Area is " + STR(calculateArea(4, 6)) // Area is 24\n// The RETURN value is used in the expression'),
        kt('Local variable','A variable declared inside a subroutine. Only accessible within that subroutine. Created when called, destroyed when it returns. Prevents accidental interference between subroutines.'),
        kt('Global variable','Declared outside all subroutines. Accessible from anywhere. Overusing globals makes programs hard to debug — any part of the program could accidentally change a global variable.'),
        w('Local vs Global Scope','totalScore ← 0  // GLOBAL — accessible everywhere\n\nSUBROUTINE addPoints(pts)\n  bonus ← pts * 2    // LOCAL — only exists here\n  totalScore ← totalScore + bonus  // Can access global\nENDSUBROUTINE\n\naddPoints(5)   // totalScore becomes 10\naddPoints(3)   // totalScore becomes 16\n\n// Cannot access bonus here — it is local to addPoints\n// OUTPUT bonus  ← This would cause an error'),
        tip('"State two advantages of using subroutines." Answer: "(1) Code reuse — the subroutine can be called multiple times without rewriting the code. (2) Easier debugging — each subroutine can be tested independently in isolation." Both are worth 1 mark each.'),
      ]
    },

    { id:'3.2.4', title:'Arrays & String Operations',
      sections: [
        t('Arrays','An array stores multiple values of the <strong>same data type</strong> under one name, accessed by an index. Arrays are <strong>zero-indexed</strong> in most languages and AQA pseudocode — the first element is at index 0. Arrays have a fixed size.'),
        w('Array Operations','scores ← [78, 65, 92, 41, 88]  // 5 elements, indices 0-4\n\nOUTPUT scores[0]   // 78 (first element)\nOUTPUT scores[4]   // 88 (last element)\nscores[2] ← 95     // Change element at index 2\n\n// Loop through entire array:\ntotal ← 0\nFOR i ← 0 TO 4\n  total ← total + scores[i]\nENDFOR\nOUTPUT total   // 361 (78+65+95+41+88)\n\n// Find maximum:\nmax ← scores[0]\nFOR i ← 1 TO 4\n  IF scores[i] > max THEN\n    max ← scores[i]\n  ENDIF\nENDFOR\nOUTPUT max   // 95'),
        t('String Operations','Strings are sequences of characters. You need to know these for the AQA exam:'),
        tbl(['Operation','Syntax','Example','Result'],
          [['Length','LEN(str)','LEN("Hello")','5'],
           ['Substring','SUBSTRING(str, start, length)','SUBSTRING("Computer", 0, 4)','Comp'],
           ['Upper case','UPPER(str)','UPPER("hello")','HELLO'],
           ['Lower case','LOWER(str)','LOWER("WORLD")','world'],
           ['Concatenation','str1 + str2','"Hello" + " World"','Hello World'],
           ['Character at index','str[i]','"Computer"[0]','C'],
           ['ASCII value','ASC(char)','ASC("A")','65'],
           ['Char from ASCII','CHR(n)','CHR(65)','A']]),
        w('String Operations Examples','name ← "Computer Science"\n\nOUTPUT LEN(name)              // 16\nOUTPUT UPPER(name)            // COMPUTER SCIENCE\nOUTPUT SUBSTRING(name, 0, 8)  // Computer (8 chars from index 0)\nOUTPUT name[0]                // C (character at index 0)\nOUTPUT ASC("A")   // 65\nOUTPUT ASC("a")   // 97 (lowercase has HIGHER ASCII)\nOUTPUT CHR(65)    // A\n\n// Checking if string contains a digit:\nFOR i ← 0 TO LEN(password) - 1\n  IF ASC(password[i]) >= 48 AND ASC(password[i]) <= 57 THEN\n    hasDigit ← TRUE\n  ENDIF\nENDFOR\n// Digit characters have ASCII 48 (\'0\') to 57 (\'9\')'),
        err('SUBSTRING takes three parameters: the string, the START INDEX, and the LENGTH (not the end index). SUBSTRING("Hello", 1, 3) = "ell" (3 characters starting at index 1), NOT "ello".'),
      ]
    },

    { id:'3.2.5', title:'File Handling',
      sections: [
        t('Why File Handling?','Variables and arrays are lost when a program ends. Files allow data to persist between runs of a program. Programs can save data to files (user records, scores, settings) and read data from files later.'),
        w('File Handling in AQA Pseudocode','// WRITING to a file\nOPEN "scores.txt" FOR WRITING\nWRITELINE("scores.txt", "Alice,92")\nWRITELINE("scores.txt", "Bob,78")\nCLOSE("scores.txt")\n\n// READING from a file\nOPEN "scores.txt" FOR READING\nWHILE NOT EOF("scores.txt")\n  line ← READLINE("scores.txt")\n  OUTPUT line\nENDWHILE\nCLOSE("scores.txt")\n\n// EOF = End Of File\n// Always CLOSE the file when finished\n\n// Python equivalent:\nwith open("scores.txt", "w") as f:\n    f.write("Alice,92\\n")\n    f.write("Bob,78\\n")\n\nwith open("scores.txt", "r") as f:\n    for line in f:\n        print(line.strip())'),
        tbl(['Mode','Purpose'],
          [['WRITING','Creates a new file or overwrites existing content'],
           ['READING','Reads existing content (error if file not found)'],
           ['APPENDING','Adds to end of existing file (creates if not found)']]),
        tip('Always CLOSE a file when you are finished with it. An unclosed file may not be saved properly and wastes system resources.'),
      ]
    },
  ]},

  // ── 3.3 DATA REPRESENTATION ─────────────────────────────────────
  { id:'ag-3', number:'3.3', name:'Fundamentals of Data Representation', specPoints: [

    { id:'3.3.1', title:'Binary & Hexadecimal',
      sections: [
        t('Why Binary?','All computer hardware uses binary because transistors (the basic electronic component) have two states: ON (1) and OFF (0). Every type of data — text, images, sound, video, programs — is ultimately stored and processed as sequences of 0s and 1s.'),
        tbl(['Unit','Bits','Values representable','Example values'],
          [['Bit','1','2','0 or 1'],
           ['Nibble','4','16','0–15'],
           ['Byte','8','256','0–255'],
           ['Kilobyte (KB)','8,192','—','≈ 1,000 bytes (1,024 exactly)'],
           ['Megabyte (MB)','—','—','≈ 1,000 KB'],
           ['Gigabyte (GB)','—','—','≈ 1,000 MB']]),
        w('Binary ↔ Denary Conversion','Binary → Denary:\nUse column values: 128  64  32  16   8   4   2   1\n\n10110101:\n  128  0  32  16   0   4   0   1 = 181\n\nDenary → Binary: 219\n  219 ≥ 128? YES → 1, remainder 91\n   91 ≥  64? YES → 1, remainder 27\n   27 ≥  32? NO  → 0\n   27 ≥  16? YES → 1, remainder 11\n   11 ≥   8? YES → 1, remainder 3\n    3 ≥   4? NO  → 0\n    3 ≥   2? YES → 1, remainder 1\n    1 ≥   1? YES → 1\nAnswer: 11011011\nCheck: 128+64+16+8+2+1 = 219 ✓'),
        w('Hexadecimal Conversion','Each hex digit = 4 binary bits (1 nibble)\n\nBinary → Hex:\n  11001010\n  1100 | 1010\n   12  |  10\n   C   |  A  → CA\n\nHex → Binary:\n  3F → 0011 | 1111 → 00111111\n\nHex → Denary:\n  B7 = (11×16) + 7 = 176 + 7 = 183\n\nDenary → Hex:\n  200 ÷ 16 = 12 r 8 → C8\n  Check: (12×16)+8 = 192+8 = 200 ✓\n\nHex digits: 0-9 then A=10, B=11, C=12, D=13, E=14, F=15'),
        tip('Hexadecimal is used as shorthand for binary because each hex digit represents exactly 4 binary bits. This makes it much easier to read and write binary data (e.g. memory addresses, colour codes, machine code).'),
      ]
    },

    { id:'3.3.2', title:'Binary Arithmetic & Overflow',
      sections: [
        t('Binary Addition Rules','Four rules: 0+0=0, 0+1=1, 1+0=1, 1+1=0 carry 1, 1+1+1=1 carry 1. Always work right to left. Show carry digits clearly — they are worth marks.'),
        w('Binary Addition Examples','  01101001  (105)\n+ 00110110  ( 54)\n──────────\n  10011111  (159)\n\nCheck: 105+54=159 ✓\n\nColumn by column (right to left):\nCol 1: 1+0=1\nCol 2: 0+1=1\nCol 3: 0+1=1\nCol 4: 1+0=1\nCol 5: 0+1=1\nCol 6: 1+1=0, carry 1\nCol 7: 1+0+carry(1)=0, carry 1\nCol 8: 0+0+carry(1)=1\n\nResult: 10011111 = 159 ✓'),
        kt('Overflow','Occurs when the result of a calculation is too large to fit in the available number of bits. For 8-bit unsigned numbers: max is 255. If a result would be 256 or larger, overflow occurs — the extra bit is lost and the result is WRONG. Example: 11111111 + 00000001 = (1)00000000 — overflow! The carry bit out of the MSB is lost.'),
        w("Two's Complement: Negative Numbers","To represent -5 in 8-bit two's complement:\n1. Write +5:       00000101\n2. Invert all bits: 11111010\n3. Add 1:           11111011 = -5\n\nVerify: using place values (-128,64,32,16,8,4,2,1)\n  -128+64+32+16+0+0+2+1 = -128+115 = -13? \nWait: 11111011 = -128+64+32+16+8+0+2+1 = -128+123 = -5 ✓\n\n8-bit two's complement range:\n  10000000 = -128 (most negative)\n  01111111 = +127 (most positive)\n  Range: -128 to +127"),
        tip('"State one advantage of two\'s complement over sign-magnitude for representing negative numbers." Answer: "Two\'s complement allows subtraction to be performed using the same addition circuitry as for positive numbers. The CPU does not need separate subtraction hardware."'),
      ]
    },

    { id:'3.3.3', title:'Character Encoding',
      sections: [
        t('ASCII','ASCII (American Standard Code for Information Interchange) maps characters to 7-bit numbers (8-bit extended ASCII = 256 characters). Every character on a keyboard has an ASCII code. Key values to memorise: A=65, a=97, 0=48, Space=32. Note: uppercase letters have LOWER codes than lowercase.'),
        tbl(['Character range','ASCII range','Notes'],
          [['Space','32',''],
           ['0–9 (digits)','48–57','0=48, 1=49, ... 9=57'],
           ['A–Z (uppercase)','65–90','A=65, B=66, ... Z=90'],
           ['a–z (lowercase)','97–122','a=97, b=98, ... z=122']]),
        kt('Unicode','Extends ASCII to support all world writing systems — over 1.1 million characters. The first 128 Unicode code points match ASCII exactly. UTF-8 uses 1–4 bytes per character. UTF-16 uses 2 or 4 bytes. Needed for any software used internationally.'),
        tbl(['Feature','ASCII','Unicode (UTF-8)'],
          [['Bits used','7 or 8','8 to 32 (1–4 bytes)'],
           ['Characters','128 or 256','1,100,000+'],
           ['Scripts','English/Latin only','All world scripts'],
           ['File size','Smaller','Larger (for non-ASCII)'],
           ['Compatibility','—','First 128 = ASCII']]),
        w('Using ASCII in Programs','password ← "Ab3!"\n\nFOR i ← 0 TO LEN(password) - 1\n  code ← ASC(password[i])\n  IF code >= 65 AND code <= 90 THEN\n    OUTPUT password[i] + " is uppercase"\n  ELIF code >= 97 AND code <= 122 THEN\n    OUTPUT password[i] + " is lowercase"\n  ELIF code >= 48 AND code <= 57 THEN\n    OUTPUT password[i] + " is a digit"\n  ELSE\n    OUTPUT password[i] + " is a special character"\n  ENDIF\nENDFOR'),
        tip('"Why does the same character take up different amounts of storage in ASCII versus Unicode?" Answer: "ASCII uses a fixed 7 or 8 bits per character. Unicode (UTF-8) uses 1–4 bytes depending on the character — common letters use 1 byte (same as ASCII), while less common characters use more bytes. This makes UTF-8 efficient for mostly-English text while supporting all world scripts."'),
      ]
    },

    { id:'3.3.4', title:'Images & File Sizes',
      sections: [
        t('How Images are Stored','Digital images are grids of <strong>pixels</strong> (picture elements). Each pixel stores a colour value as a binary number. The number of bits used per pixel is the <strong>colour depth</strong>. More bits = more possible colours = better quality = larger file size.'),
        tbl(['Colour depth','Bits per pixel','Colours available','Name'],
          [['1-bit','1','2','Black and white'],
           ['8-bit','8','256','Indexed colour'],
           ['16-bit','16','65,536','High colour'],
           ['24-bit','24','16,777,216','True Colour (8 bits each for R, G, B)']]),
        w('Image File Size Calculations','Formula: File size (bits) = width × height × colour depth\n\nExample 1: 640×480, 8-bit colour\n  Pixels = 640 × 480 = 307,200\n  Bits   = 307,200 × 8 = 2,457,600 bits\n  Bytes  = 2,457,600 ÷ 8 = 307,200 bytes\n  KB     = 307,200 ÷ 1024 = 300 KB\n\nExample 2: 1920×1080, 24-bit (True Colour)\n  Pixels = 1920 × 1080 = 2,073,600\n  Bits   = 2,073,600 × 24 = 49,766,400 bits\n  Bytes  = 49,766,400 ÷ 8 = 6,220,800 bytes\n  MB     = 6,220,800 ÷ 1,048,576 ≈ 5.93 MB\n\nRemember: ÷8 for bytes, ÷1024 for KB, ÷1024 for MB'),
        kt('Metadata','Additional data stored alongside the main content. An image file\'s metadata includes: width, height, colour depth, camera settings, date taken, GPS location. Metadata adds to the total file size but is small compared to the pixel data.'),
        tip('Always show your working in file size calculations. Method marks are available at each step. The most common mistake is forgetting to divide by 8 to convert bits to bytes.'),
        err('A common error: confusing image resolution (dimensions) with image quality (colour depth). Increasing colour depth adds more colours but does not make the image sharper. Increasing resolution (more pixels) makes it sharper but not more colourful.'),
      ]
    },

    { id:'3.3.5', title:'Sound & Compression',
      sections: [
        t('How Sound is Stored','Sound is analogue (continuous waves). To store digitally, the amplitude (volume) is measured at regular time intervals — this is called <strong>sampling</strong>. Two key properties: <strong>sample rate</strong> (samples per second, measured in Hz) and <strong>bit depth</strong> (bits per sample). Higher both = better quality = larger file.'),
        w('Audio File Size Calculation','Formula: size (bits) = sample rate × bit depth × duration × channels\n\nExample: 3-minute stereo recording, 44,100 Hz, 16-bit\n  = 44,100 × 16 × 180 × 2  (stereo = 2 channels)\n  = 44,100 × 16 = 705,600 bits/second/channel\n  × 2 channels = 1,411,200 bits/second\n  × 180 seconds = 254,016,000 bits\n  ÷ 8 = 31,752,000 bytes\n  ÷ 1,048,576 ≈ 30.3 MB uncompressed\n\nCD quality: 44,100 Hz, 16-bit, stereo'),
        tbl(['Feature','Higher value gives...','Lower value gives...'],
          [['Sample rate','Better quality (captures more of the sound wave)','Worse quality; may miss high frequencies'],
           ['Bit depth','More precise amplitude measurement; less noise','More noise/distortion'],
           ['Both combined','Larger file size, higher quality','Smaller file, lower quality']]),
        kt('Lossless compression','Reduces file size without losing any data — the original file can be perfectly reconstructed. PNG, ZIP, FLAC, RLE. Used where data must be preserved exactly: executable programs, text documents, medical images.'),
        kt('Lossy compression','Permanently removes some data to achieve greater compression. The original cannot be fully recovered. JPEG, MP3, H.264/MP4. The removed data is the least noticeable to human perception. Used where small quality reduction is acceptable: photos, music, video.'),
        w('Run-Length Encoding (RLE) — Lossless','Replaces sequences of repeated values with (count, value) pairs.\n\nExample image row:\n  RRRRRRBBBBWWWWWWWWWW  (20 pixels)\n\nUncompressed: 20 characters\nRLE encoded: (6,R)(4,B)(10,W) = 6 characters\nCompression ratio: 20:6 ≈ 3.3:1\n\nBest case: long runs of same colour (e.g. cartoons, logos)\nWorst case: every pixel different → file LARGER than original!\n  RBWRBWRBW → (1,R)(1,B)(1,W)(1,R)... = twice as big'),
        tip('"Why is lossy compression suitable for photos but not for a computer program?" Answer: "Photos contain small details that humans cannot easily perceive, so removing some data causes little noticeable difference in quality. Computer programs must be perfectly reconstructed to run correctly — any lost data would cause the program to crash or behave incorrectly."'),
      ]
    },
  ]},

  // ── 3.4 COMPUTER SYSTEMS ─────────────────────────────────────────
  { id:'ag-4', number:'3.4', name:'Computer Systems', specPoints: [

    { id:'3.4.1', title:'The CPU & FDE Cycle',
      examTip:'The most common 4-mark question: "Describe the roles of the ALU, Control Unit and registers." Learn one sentence per component.',
      sections: [
        t('CPU Components','The CPU has three main parts: <strong>ALU (Arithmetic Logic Unit)</strong> — performs all arithmetic calculations (add, subtract, multiply) and logical comparisons (AND, OR, NOT, greater than, equal to). <strong>Control Unit (CU)</strong> — fetches instructions from memory, decodes what they mean, and coordinates all other CPU components. <strong>Registers</strong> — tiny, ultra-fast storage locations inside the CPU for data currently being processed.'),
        tbl(['Register','Full name','Purpose'],
          [['PC','Program Counter','Holds the memory address of the NEXT instruction to be fetched. Incremented after each fetch.'],
           ['MAR','Memory Address Register','Holds the address of memory being read from or written to during the current operation.'],
           ['MDR','Memory Data Register','Temporarily holds data just fetched from memory, or data about to be written to memory.'],
           ['ACC','Accumulator','Holds the result of the most recent ALU calculation.']]),
        t('The FDE Cycle','The CPU continuously repeats three stages: <strong>Fetch</strong>: the next instruction is retrieved from RAM using the address in the PC; PC is incremented to point to the next instruction. <strong>Decode</strong>: the Control Unit reads the instruction to understand what operation is needed. <strong>Execute</strong>: the ALU carries out the operation, or data is moved, or the PC is updated for a jump/branch.'),
        tip('A 4-mark "describe the FDE cycle" answer: "(1) The address in the PC is copied to the MAR and memory is read — the instruction is loaded into the MDR, then the CIR. The PC is incremented to point to the next instruction. (2) The Control Unit decodes the instruction in the CIR. (3) The ALU executes the instruction and stores the result in the ACC."'),
      ]
    },

    { id:'3.4.2', title:'CPU Performance',
      sections: [
        t('Three Key Performance Factors','<strong>Clock speed (GHz)</strong>: the number of clock cycles per second. Each cycle, the CPU processes part of an instruction. Higher clock speed = more instructions per second. <strong>Number of cores</strong>: each core is an independent processor. A quad-core CPU can process four instructions simultaneously. Not all programs can use multiple cores equally. <strong>Cache size</strong>: cache is ultra-fast memory built into the CPU. The CPU checks cache before slower RAM. Larger cache = fewer slow RAM accesses.'),
        tbl(['Factor','Effect of increase','Limitation'],
          [['Clock speed','More instructions processed per second','Heat generation; physical limits of transistor switching speed'],
           ['Number of cores','Genuine parallel processing of independent tasks','Software must be written to use multiple cores (multithreading)'],
           ['Cache size','Less time waiting for data from slow RAM','Expensive; physically limited by chip size']]),
        kt('Embedded system','A computer system built into a dedicated device for one specific purpose. Uses a microcontroller, runs fixed software from ROM, typically has no keyboard or screen. Examples: washing machine, pacemaker, traffic light controller, car ABS brakes. Contrast with general-purpose computers that run many different programs.'),
        tip('"State three factors that affect CPU performance." This is a guaranteed 3-mark question. Answer: clock speed, number of cores, cache size. Each is 1 mark. For 6 marks (2 each), add: clock speed — more cycles per second means more instructions executed; cores — multiple cores allow parallel processing; cache — larger cache reduces time waiting for data from slower RAM.'),
      ]
    },

    { id:'3.4.3', title:'Memory & Storage',
      sections: [
        kt('RAM (Random Access Memory)','Volatile — loses data when power is removed. Fast. Holds currently-running programs and data. The more RAM a computer has, the more programs can run simultaneously without slowing down.'),
        kt('ROM (Read-Only Memory)','Non-volatile — retains data without power. Contains the BIOS/firmware — the startup instructions that run before the operating system loads. Cannot normally be modified.'),
        kt('Virtual memory','When RAM is full, the OS uses part of the hard disk as overflow RAM. Much slower than real RAM — causes slowdowns. Prevents crashes but reduces performance significantly.'),
        tbl(['Storage type','Technology','Speed','Capacity','Portable?','Fragile?'],
          [['HDD','Magnetic spinning platters','Slow','1–20 TB','No','Yes — moving parts'],
           ['SSD','Flash memory chips','Fast','128 GB–4 TB','Yes (external)','No'],
           ['Optical (CD/DVD)','Laser + disc','Slow','650 MB–100 GB','Yes','Scratches'],
           ['USB Flash','Flash memory','Medium','8 GB–2 TB','Yes','No']]),
        tip('"Explain why an SSD is preferable to an HDD for a laptop." Answer: "SSDs have no moving parts so they are not damaged by vibration or being dropped. They are also faster, use less power (extending battery life), and are lighter and smaller — all important for a portable device."'),
        err('SSD and RAM both use similar flash memory technology but are NOT interchangeable. RAM is volatile (loses data when off) and very fast. SSD is non-volatile (keeps data) and slower than RAM. They serve different purposes.'),
      ]
    },

    { id:'3.4.4', title:'Operating Systems & Utility Software',
      sections: [
        t('Operating System Functions','The OS acts as an intermediary between user/applications and hardware. Six main functions: <strong>Memory management</strong> — allocates RAM to programs. <strong>Process management</strong> — schedules CPU time. <strong>File management</strong> — organises files and folders. <strong>Device management</strong> — communicates with hardware via drivers. <strong>User interface</strong> — provides GUI or CLI. <strong>Security</strong> — manages accounts and permissions.'),
        tbl(['Utility software','Purpose'],
          [['Antivirus/anti-malware','Detects and removes malicious software'],
           ['Disk defragmenter','Reorganises HDD data into contiguous blocks (NOT for SSDs)'],
           ['Compression software','Reduces file sizes for storage or transfer'],
           ['Backup software','Creates copies of data to protect against loss'],
           ['Disk cleanup','Removes temporary files and cached data to free space'],
           ['Encryption software','Encrypts files/drives so data is unreadable without the key']]),
        tbl(['Interface type','Description','Advantages','Disadvantages'],
          [['GUI','Windows, icons, menus, pointer (WIMP)','Easy to use; visual; no commands to memorise','Uses more memory; slower for expert users'],
           ['CLI','Type text commands','Fast for experts; less memory; automatable via scripts','Must memorise commands; steep learning curve'],
           ['Touch','Finger gestures on screen','Intuitive; portable; no keyboard needed','Limited for complex tasks; screen gets dirty']]),
        tip('"Give two functions of an operating system." Classic 4-mark question. Answer: "(1) Memory management — the OS allocates portions of RAM to each running program, ensuring programs do not interfere with each other. (2) Process management — the OS uses scheduling to allocate CPU time between running processes, creating the appearance of multitasking."'),
      ]
    },
  ]},

  // ── 3.5 NETWORKS ────────────────────────────────────────────────
  { id:'ag-5', number:'3.5', name:'Fundamentals of Computer Networks', specPoints: [

    { id:'3.5.1', title:'Network Types & Benefits',
      sections: [
        kt('LAN (Local Area Network)','A network covering a small area — one building or campus. Owned by one organisation. Connected by physical cables (ethernet) or Wi-Fi. Fast speeds (100 Mbps to 10 Gbps).'),
        kt('WAN (Wide Area Network)','A network spanning large distances — cities, countries or globally. Uses public infrastructure (telecoms lines). Slower than LAN. The internet is the largest WAN.'),
        t('Benefits of Networking','Sharing resources (printers, files, internet connection), central data storage (easier backup, accessible from any device), communication (email, messaging, video calls), centralised software management (update once on server), shared internet access.'),
        tbl(['Feature','LAN','WAN'],
          [['Geographic area','Building or campus','Cities/countries/global'],
           ['Ownership','One organisation','Telecoms companies/shared'],
           ['Speed','Fast (100 Mbps–10 Gbps)','Slower (varies)'],
           ['Cost to set up','Moderate','High'],
           ['Example','School network','The internet']]),
        tip('"State two advantages of a network over standalone computers." Answer: "(1) Files can be stored centrally and accessed from any device on the network. (2) Hardware such as printers can be shared between users, reducing cost." Other valid answers: shared internet, centralised backup, easier software management.'),
      ]
    },

    { id:'3.5.2', title:'Network Topologies',
      sections: [
        tbl(['Topology','Description','Advantages','Disadvantages'],
          [['Star','All devices connect to a central switch','One cable failure only affects one device; easy to identify faults; fast','If central switch fails, entire network fails; more cable needed'],
           ['Bus','All devices on one shared cable','Simple; cheap; easy to add devices','One break kills the network; data collisions; slow under heavy load'],
           ['Mesh (full)','Every device connects to every other','Very resilient; no single point of failure','Very expensive; complex'],
           ['Ring','Devices in a circle; data travels one direction','Equal access; predictable performance','One break brings down network; hard to add devices']]),
        kt('Switch','A network device that connects devices within a LAN and sends data ONLY to the intended recipient device (using MAC addresses). More efficient than a hub (which sends to all devices). Operates at the data link layer.'),
        kt('Router','Connects different networks together and routes packets between them using IP addresses. Your home router connects your LAN to the internet (WAN). Operates at the network layer.'),
        tip('Star topology is by far the most common in practice and the most commonly examined. Know: one cable failure = one device affected (not the whole network). The central switch is the single point of failure for the entire network.'),
        err('Do not confuse a switch with a hub. A switch sends data only to the intended recipient (efficient). A hub sends data to ALL devices (inefficient, more collisions). Modern networks always use switches.'),
      ]
    },

    { id:'3.5.3', title:'Internet, DNS & Packet Switching',
      sections: [
        t('Internet vs World Wide Web','The <strong>Internet</strong> is the global physical network of cables, routers and servers. The <strong>World Wide Web</strong> is a service that runs ON TOP of the internet — the collection of websites and web pages. Other internet services: email, FTP, video streaming. The web is just one use of the internet.'),
        kt('DNS (Domain Name System)','Translates human-readable domain names (www.compscitutoring.com) into IP addresses (76.76.21.21) that computers use to route data. Like a phone book for the internet. Without DNS, you would need to memorise IP addresses.'),
        kt('Packet switching','Large data is divided into small <strong>packets</strong> for transmission. Each packet contains: source IP address, destination IP address, sequence number, and payload (data). Packets are routed independently and may take different routes. Reassembled at the destination using sequence numbers.'),
        t('How the Internet Works: Full Journey','1. You type compscitutoring.com. 2. Your computer sends a DNS query to find the IP address. 3. DNS responds with the IP (e.g. 76.76.21.21). 4. Your browser sends an HTTP/S request to that IP, broken into packets. 5. Packets travel through routers across the internet, each choosing the best route. 6. The web server receives all packets, reassembles them, and sends back the web page. 7. Your browser renders the page.'),
        tbl(['Protocol','Purpose'],
          [['HTTP','HyperText Transfer Protocol — transfers web pages'],
           ['HTTPS','HTTP + TLS encryption — secure web pages (padlock icon)'],
           ['FTP','File Transfer Protocol — transferring files between systems'],
           ['SMTP','Simple Mail Transfer Protocol — sending email'],
           ['IMAP','Internet Message Access Protocol — receiving email (server-based)'],
           ['POP3','Post Office Protocol — receiving email (downloads to device)']]),
        tip('"Describe the role of a router in a network." Answer: "A router connects different networks together and routes data packets between them. It reads the destination IP address of each packet and forwards it to the next appropriate router on the way to the destination. This process continues until the packet reaches its destination network."'),
      ]
    },
  ]},

  // ── 3.6 CYBER SECURITY ────────────────────────────────────────────
  { id:'ag-6', number:'3.6', name:'Cyber Security', specPoints: [

    { id:'3.6.1', title:'Social Engineering & Malware',
      sections: [
        tbl(['Attack','How it works','Target'],
          [['Phishing','Fake emails appearing to be from banks/companies; links to fake login pages','Passwords and financial data'],
           ['Spear phishing','Targeted phishing using personal information to seem more convincing','Specific individuals or organisations'],
           ['Vishing','Voice phishing — phone calls pretending to be tech support, banks, HMRC','Sensitive information, remote access'],
           ['Blagging (pretexting)','Creating a false scenario to manipulate someone into revealing information','Passwords, access credentials'],
           ['Shouldering','Physically watching someone enter a PIN or password','PINs, passwords']]),
        tbl(['Malware type','How it spreads','Main effect'],
          [['Virus','Attaches to files; spreads when files shared','Corrupts or deletes data'],
           ['Worm','Self-replicating; spreads automatically across networks','Consumes bandwidth; spreads malware'],
           ['Trojan','Disguises as legitimate software','Opens backdoor; steals data'],
           ['Ransomware','Encrypts victim\'s files','Demands payment for decryption key'],
           ['Spyware','Hidden in free software or malicious sites','Records keystrokes, passwords, browsing']]),
        kt('Brute force attack','Systematically trying every possible password combination until the correct one is found. Becomes impractical for long, complex passwords — a 12-character mixed-case+digits+symbols password could take centuries.'),
        kt('SQL injection','Inserting malicious SQL code into a website\'s input field (login form, search box) to manipulate the database. Can bypass authentication, extract all data, or delete tables. Prevented by input validation and parameterised queries.'),
        kt('Denial of Service (DoS)','Flooding a server with requests until it cannot respond to legitimate users. Distributed DoS (DDoS) uses thousands of compromised computers simultaneously — much harder to block.'),
        tip('"Describe how phishing works." Answer: "An attacker sends an email that appears to be from a trusted source (e.g. a bank). The email contains a link to a fake website that looks identical to the real site. When the victim enters their login details, the attacker captures them and can then access the real account."'),
      ]
    },

    { id:'3.6.2', title:'Protection Methods & Legislation',
      sections: [
        tbl(['Protection','What it does','Protects against'],
          [['Strong passwords + MFA','Long complex unique passwords; second verification factor','Brute force, stolen passwords'],
           ['Firewall','Monitors and filters network traffic by rules','Unauthorised access, some malware'],
           ['Anti-malware','Detects and removes known malicious software','Viruses, worms, trojans, spyware'],
           ['Encryption','Converts data to unreadable ciphertext without the key','Interception, data theft'],
           ['Regular updates/patches','Fixes known security vulnerabilities in software','Exploits targeting known weaknesses'],
           ['User education','Training to recognise phishing, social engineering','Social engineering (human factor)'],
           ['Access levels','Users only access what they need for their role','Insider threats, data exposure'],
           ['Penetration testing','Ethical hackers find vulnerabilities before attackers do','Unknown vulnerabilities']]),
        tbl(['Act','Year','Key offences'],
          [['Computer Misuse Act','1990','S1: Unauthorised computer access · S2: Access + intent to commit crime · S3: Unauthorised modification (installing malware)'],
           ['Data Protection Act / GDPR','1998/2018','Personal data must be: collected lawfully, for specified purpose, kept accurate, held only as long as necessary, kept secure'],
           ['Copyright, Designs & Patents Act','1988','Illegal to copy/distribute software without a licence (software piracy)']]),
        tip('"State one way a company could protect its network from malware." Answer: "Install and regularly update anti-malware software that scans files and programs for known malicious code and removes any threats it detects." Always give a description of HOW it protects — naming the protection alone is worth 1 mark; describing how it works is worth 2 marks.'),
      ]
    },
  ]},

  // ── 3.7 DATABASES & SQL ──────────────────────────────────────────
  { id:'ag-7', number:'3.7', name:'Relational Databases & SQL', specPoints: [

    { id:'3.7.1', title:'Relational Database Concepts',
      sections: [
        kt('Relational database','Data organised into related tables (relations). Each table stores data about one type of entity. Tables are linked via shared fields, eliminating data duplication.'),
        kt('Primary key','A field (or combination of fields) that uniquely identifies each record in a table. No two records can have the same primary key value, and it cannot be empty. Examples: StudentID, OrderNumber, ISBN.'),
        kt('Foreign key','A field in one table that references the primary key of another table, creating a link between them. Allows related data to be stored in separate tables without duplication.'),
        w('Relational Database Example','Table: STUDENTS\n╔═══════════╦══════════╦══════════╦═══════════╗\n║ StudentID ║ Name     ║ Form     ║ ClassCode ║\n╠═══════════╬══════════╬══════════╬═══════════╣\n║ S001      ║ Alice    ║ 10A      ║ CS1       ║\n║ S002      ║ Bob      ║ 10B      ║ CS2       ║\n╚═══════════╩══════════╩══════════╩═══════════╝\n     ↑ PRIMARY KEY        ↑ FOREIGN KEY\n\nTable: CLASSES\n╔═══════════╦══════════════╦══════════╗\n║ ClassCode ║ Subject      ║ Teacher  ║\n╠═══════════╬══════════════╬══════════╣\n║ CS1       ║ Computer Sci ║ Edgell   ║\n║ CS2       ║ Computer Sci ║ Edgell   ║\n╚═══════════╩══════════════╩══════════╝\n     ↑ PRIMARY KEY\n\nAdvantage: Teacher name stored once — change it once to update all'),
        tbl(['Advantage','Explanation'],
          [['No data duplication','Each piece of data stored once — updating it updates everywhere'],
           ['Data integrity','Foreign key constraints prevent orphaned records'],
           ['Flexible querying','SQL can combine tables in many ways'],
           ['Multi-user access','Multiple users can query simultaneously'],
           ['Easier maintenance','Structured, consistent data format']]),
        tip('"Give two advantages of a relational database over a flat-file database." Answer: "(1) Data is not duplicated — for example, a teacher\'s name is stored once in a teacher table rather than repeated for every class they teach. (2) Related data can be linked via foreign keys and queried together using JOIN, which is not possible with flat files."'),
      ]
    },

    { id:'3.7.2', title:'SQL Queries',
      sections: [
        w('SQL: SELECT, WHERE, ORDER BY','-- Basic query: get all students in form 10A\nSELECT Name, Form\nFROM Students\nWHERE Form = "10A"\nORDER BY Name ASC;\n\n-- All fields:\nSELECT *\nFROM Students;\n\n-- Multiple conditions:\nSELECT *\nFROM Students\nWHERE Form = "10A" AND ClassCode = "CS1";\n\n-- OR condition:\nSELECT Name, Form\nFROM Students\nWHERE Form = "10A" OR Form = "10B"\nORDER BY Form ASC, Name ASC;\n\n-- Not equal:\nSELECT *\nFROM Students\nWHERE ClassCode <> "CS1";'),
        w('SQL: INSERT, UPDATE, DELETE','-- Add a new student:\nINSERT INTO Students (StudentID, Name, Form, ClassCode)\nVALUES ("S003", "Charlie", "10A", "CS1");\n\n-- Update a record:\nUPDATE Students\nSET Form = "11A"\nWHERE StudentID = "S001";\n\n-- Remove a record:\nDELETE FROM Students\nWHERE StudentID = "S002";\n\n⚠ Always use WHERE with UPDATE and DELETE\n  or you will change/delete EVERY row in the table!'),
        tbl(['SQL keyword','Purpose','Example'],
          [['SELECT','Choose which fields to return','SELECT Name, Score'],
           ['FROM','Specify the table','FROM Results'],
           ['WHERE','Filter rows by condition','WHERE Score >= 80'],
           ['AND / OR','Combine conditions','WHERE Score >= 80 AND Subject = "CS"'],
           ['ORDER BY ASC','Sort ascending (A-Z, 0-9)','ORDER BY Name ASC'],
           ['ORDER BY DESC','Sort descending (Z-A, 9-0)','ORDER BY Score DESC'],
           ['INSERT INTO','Add a new row','INSERT INTO ... VALUES (...)'],
           ['UPDATE ... SET','Modify existing data','UPDATE ... SET Grade = "A"'],
           ['DELETE FROM','Remove rows','DELETE FROM Results WHERE Score < 40'],
           ['*','All fields','SELECT *'],
           ['<>','Not equal to','WHERE Grade <> "U"']]),
        tip('In SQL, text values go in speech marks (or single quotes). Numbers do NOT use quotes. The WHERE clause uses = (single equals) for comparison, not == as in Python. Always add ORDER BY when asked for results "in order" — forgetting this loses marks.'),
      ]
    },
  ]},

  // ── 3.8 ETHICS ──────────────────────────────────────────────────
  { id:'ag-8', number:'3.8', name:'Ethical, Legal, Cultural & Environmental Impacts', specPoints: [

    { id:'3.8.1', title:'Legislation',
      sections: [
        tbl(['Act','Year','What it covers'],
          [['Data Protection Act / GDPR','1998 / 2018','How personal data is collected, stored and used. 8 principles include: lawful purpose, kept accurate, stored securely, not kept longer than necessary.'],
           ['Computer Misuse Act','1990','Three offences: (1) Unauthorised access, (2) Access with intent to commit further crime, (3) Unauthorised modification. Penalties up to 10 years.'],
           ['Copyright, Designs & Patents Act','1988','Protects creators\' work. Illegal to copy, distribute or modify software without a licence. Software piracy is a criminal offence.']]),
        w('Data Protection Act — The 8 Principles','Personal data must be:\n1. Processed fairly and lawfully\n2. Obtained for specified, explicit and legitimate purposes\n3. Adequate, relevant and not excessive\n4. Accurate and kept up to date\n5. Not kept longer than necessary\n6. Processed in line with individuals\' rights\n7. Kept secure\n8. Not transferred outside the UK/EEA without adequate protection\n\nData subject rights:\n  ● Right to access their data (Subject Access Request)\n  ● Right to correct inaccurate data\n  ● Right to erasure ("right to be forgotten")\n  ● Right to object to processing'),
        tip('"Explain how the Computer Misuse Act protects individuals." Answer: "The Computer Misuse Act makes it a criminal offence to access a computer system without permission, or to damage data on a computer system. This means that if someone hacks into another person\'s accounts or installs malware on their computer, they can be prosecuted and face fines or imprisonment."'),
      ]
    },

    { id:'3.8.2', title:'Environmental & Cultural Impacts',
      sections: [
        t('Environmental Impact of Computing','Computing has significant environmental consequences: <strong>Energy consumption</strong> — data centres use ~1-2% of global electricity. A single Google search uses roughly the energy to boil a cup of tea. Globally, data centres emit as much CO₂ as the airline industry. <strong>E-waste</strong> — discarded electronics contain toxic materials (lead, mercury, cadmium). Over 50 million tonnes of e-waste per year globally. <strong>Manufacturing</strong> — producing devices requires rare earth metals mined with significant environmental damage.'),
        t('Positive Environmental Uses of Computing','Renewable energy management, smart grids, environmental monitoring sensors, reducing need for physical travel (video conferencing), precision agriculture reducing pesticide use, climate modelling and research.'),
        kt('Digital divide','The gap between those with access to digital technology and those without. Has multiple dimensions: economic (rich vs poor), geographic (urban vs rural), generational (young vs old), international (developed vs developing nations). As essential services move online, those without access face significant disadvantage.'),
        t('Cultural Impacts','Computing has transformed society: social media has changed how we communicate and form communities; online shopping has changed retail; streaming has disrupted music and film industries; remote working has changed workplace culture; automation has displaced some jobs while creating others. The pace of change creates challenges for workers needing to reskill.'),
        t('Evaluate vs Describe Questions','Questions asking you to "evaluate" require BOTH positive AND negative points plus a justified conclusion. Questions asking "discuss" also require balance. Questions asking "describe" need detail but not a judgement. Read the command word carefully — it determines how much to write and whether you need both sides.'),
        tip('"Evaluate the impact of increased use of cloud storage." Structure: advantage (e.g. access from any device), disadvantage (e.g. privacy concerns, requires internet), conclusion (e.g. "Overall, the benefits outweigh the risks for most users because..."). Three clear points for full marks.'),
      ]
    },
  ]},
  ]
};

// ═══════════════════════════════════════════════════════════════════
// OCR GCSE (J277)
// ═══════════════════════════════════════════════════════════════════
const OCR_GCSE: ALevelBoard = {
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
      t('Linear Search','Checks each element one at a time from the start. Works on ANY list — sorted or unsorted. Simple but slow for large lists — in the worst case, every element must be checked.'),
      w('Linear Search Trace','Search for 7 in [4, 2, 7, 1, 9, 3]\n\n  Check 4 — no\n  Check 2 — no\n  Check 7 — YES! Found at index 2\n\nWorst case (not in list):\n  Search for 5 in [4, 2, 7, 1, 9, 3]\n  Check all 6 elements — not found\n  6 comparisons needed = n comparisons'),
      t('Binary Search','Works ONLY on SORTED lists. Compares target to middle element; searches left half if target is smaller, right half if larger. Each comparison halves the remaining search space, making it much faster than linear search for large sorted lists.'),
      w('Binary Search Trace: Find 7 in [1, 3, 5, 7, 9, 11, 13]','low=0, high=6, mid=3 → list[3]=7 → FOUND! (1 comparison)\n\nHarder: Find 11 in [1, 3, 5, 7, 9, 11, 13, 15]\nStep 1: low=0, high=7, mid=3 → list[3]=7. 11>7 → right. low=4\nStep 2: low=4, high=7, mid=5 → list[5]=11 → FOUND! (2 comparisons)\n\nWith 1,000,000 items:\n  Linear search: up to 1,000,000 comparisons\n  Binary search: at most 20 comparisons (log₂ 1,000,000 ≈ 20)'),
      tbl(['Feature','Linear Search','Binary Search'],
        [['Works on unsorted list?','YES','NO — must be sorted'],
         ['Worst case comparisons','All elements (slow for large lists)','Halves each step (~10 for 1,000 items, ~20 for 1,000,000)'],
         ['n = 1,000 (worst case)','1,000 comparisons','~10 comparisons'],
         ['n = 1,000,000 (worst case)','1,000,000 comparisons','~20 comparisons'],
         ['Simple to implement?','Yes','Slightly more complex']]),
      tip('"Why would binary search be unsuitable to use on a phonebook?" — This is a trick question: a phonebook IS sorted, so binary search IS suitable. If the question said "an unsorted list of contacts", the answer would be: "Binary search requires the list to be sorted in order. An unsorted list cannot be searched using binary search."'),
    ]
  },

  { id:'2.1.4', title:'Bubble Sort and Merge Sort',
    sections: [
      t('Bubble Sort','Repeatedly compares adjacent pairs and swaps them if out of order. After each pass, the largest unsorted element has "bubbled" to its correct position. Stops when a pass makes no swaps. Simple to understand and trace, but slow for large lists.'),
      w('Bubble Sort — Full Trace on [5, 3, 8, 1]','Pass 1:\n  5 vs 3: 5>3, SWAP → [3, 5, 8, 1]\n  5 vs 8: ok  → [3, 5, 8, 1]\n  8 vs 1: 8>1, SWAP → [3, 5, 1, 8]  ← 8 now in position\n\nPass 2:\n  3 vs 5: ok  → [3, 5, 1, 8]\n  5 vs 1: 5>1, SWAP → [3, 1, 5, 8]  ← 5 now in position\n\nPass 3:\n  3 vs 1: 3>1, SWAP → [1, 3, 5, 8]  ← 3 now in position\n\nPass 4:\n  No swaps → SORTED ✓\n\nKey: if a whole pass makes NO swaps, stop immediately (optimisation).'),
      t('Merge Sort','Divide-and-conquer algorithm. Recursively splits list into halves until single elements remain, then merges sorted pairs back together. Much more efficient than bubble sort for large lists because the number of operations grows much more slowly as the list gets longer. Requires extra memory for the merging step.'),
      w('Merge Sort — Trace on [4, 2, 7, 1]','SPLIT phase:\n  [4, 2, 7, 1]\n  [4, 2]     [7, 1]\n  [4] [2]    [7] [1]\n\nMERGE phase:\n  Merge [4] and [2]: compare → take 2, take 4 → [2, 4]\n  Merge [7] and [1]: compare → take 1, take 7 → [1, 7]\n  Merge [2,4] and [1,7]: compare 2 and 1 → take 1\n                          compare 2 and 7 → take 2\n                          compare 4 and 7 → take 4\n                          take 7\n                          → [1, 2, 4, 7] ✓'),
      tbl(['Feature','Bubble Sort','Merge Sort'],
        [['Efficiency','Slow for large lists — operations grow rapidly','Much faster for large lists — operations grow slowly'],
         ['Early stop possible?','Yes — if a full pass makes no swaps','No — always splits and merges fully'],
         ['Memory','Sorts in place — no extra memory needed','Needs extra memory for merging'],
         ['Stability','Stable (preserves order of equal elements)','Stable'],
         ['Practical use','Teaching; small lists only','Large datasets; guaranteed performance']]),
      tip('For bubble sort questions: show EVERY comparison in EVERY pass, even if no swap occurs. The marks are at each step. For merge sort: show the split tree clearly, then show each merge step with the comparisons made.'),
    ]
  },

  { id:'2.1.5', title:'Efficiency and Trace Tables',
    sections: [
      t('Algorithm Efficiency','Efficiency describes how quickly an algorithm\'s workload grows as the size of the input increases. For GCSE, the key comparison is between searching and sorting algorithms — you need to be able to state which is more efficient and <strong>why</strong>, using the number of comparisons needed as evidence.'),
      tbl(['Algorithm','Efficiency','Key evidence'],
        [['Linear search','Slow for large lists','Must check every element in the worst case: 1,000,000 items → up to 1,000,000 comparisons'],
         ['Binary search','Fast for large sorted lists','Halves the search space each step: 1,000,000 items → at most 20 comparisons'],
         ['Bubble sort','Slow for large lists','Each pass compares most elements: grows rapidly with list size'],
         ['Merge sort','Much faster for large lists','Splits and merges efficiently: far fewer operations than bubble sort for large n']]),
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

const CAM_IGCSE: ALevelBoard = {
  id: 'cam-gcse', name: 'Cambridge IGCSE (0478)',
  topics: [

  // ══════════════════════════════════════════════════════════════════
  // 1 — DATA REPRESENTATION
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-1', number:'1', name:'Data Representation', specPoints: [

    { id:'1.1', title:'Number Systems',
      examTip:'Show every step of conversions. "183 in binary" with no working = 0 marks even if correct.',
      sections: [
        t('Binary, Denary, Hexadecimal','Computers use binary (base 2) because transistors have two states: ON (1) and OFF (0). Denary (base 10) is our everyday system. Hexadecimal (base 16) is shorthand for binary — each hex digit exactly represents 4 binary bits (one nibble).'),
        tbl(['Base','Name','Digits used','Cambridge use'],
          [['2','Binary','0,1','Internal computer storage and processing'],
           ['10','Denary','0–9','Human-readable numbers'],
           ['16','Hexadecimal','0–9 then A–F','Shorthand for binary, colour codes, memory addresses']]),
        w('All Conversion Methods','BINARY → DENARY: use column values (128,64,32,16,8,4,2,1)\n  10110111 = 128+32+16+4+2+1 = 183\n\nDENARY → BINARY: subtract largest fitting column value\n  183 → 128 ✓(r55) → 64 ✗ → 32 ✓(r23) → 16 ✓(r7)\n  → 8 ✗ → 4 ✓(r3) → 2 ✓(r1) → 1 ✓\n  Answer: 10110111\n\nBINARY → HEX: group into nibbles from right\n  10110111 → 1011|0111 → B|7 → B7\n\nHEX → DENARY:\n  B7 = (11×16) + (7×1) = 176 + 7 = 183\n\nDENARY → HEX:\n  183 ÷ 16 = 11 remainder 7 → B7\n  Verify: (11×16) + 7 = 183 ✓'),
        t('Binary Addition','Four rules: 0+0=0, 0+1=1, 1+0=1, 1+1=10 (carry 1). Show carry digits explicitly — they earn marks. Overflow occurs when the result exceeds the number of bits available.'),
        w('Binary Addition with Carry','  01101001  (105)\n+ 00110110  ( 54)\n─────────\n  10011111  (159)\n\nCarry digits: 0 0 1 1 1 1 0 0\nCheck: 105 + 54 = 159 ✓\n\nOverflow example (8-bit):\n  11111111 (255)\n+ 00000001 (  1)\n─────────\n 100000000  → result needs 9 bits — OVERFLOW!'),
        t("Two's Complement (Negative Numbers)","Cambridge requires representing negative integers using two's complement.\nSteps: (1) write positive version, (2) invert all bits, (3) add 1.\nThe MSB (leftmost bit) is the sign bit: 0 = positive, 1 = negative.\n8-bit range: -128 to +127."),
        w("Two's Complement Examples","Represent -45 in 8-bit two's complement:\n  +45 = 00101101\n  Invert: 11010010\n  Add 1: 11010011  ← this is -45\n\nVerify: -128+64+0+16+0+0+2+1 = -128+83 = -45 ✓\n\nSubtraction using two's complement:\n  74 - 45 = 74 + (-45)\n  01001010 (74)\n+ 11010011 (-45)\n─────────\n 100011101\n  Ignore carry: 00011101 = 29 ✓"),
      ]
    },

    { id:'1.2', title:'Character Encoding',
      sections: [
        t('ASCII and Unicode','ASCII (American Standard Code for Information Interchange): 7-bit code, 128 characters (A=65, a=97, 0=48). Sufficient for English but not other scripts.\nUnicode: variable-width (UTF-8, UTF-16, UTF-32). UTF-8 uses 1–4 bytes. Covers 140,000+ characters from all world scripts, emoji, and symbols.'),
        tbl(['Feature','ASCII','Unicode (UTF-8)'],
          [['Bits per character','7 (extended 8)','8 to 32 (variable)'],
           ['Characters covered','128','Over 140,000'],
           ['Languages','English only','All world scripts'],
           ['Backward compatible','N/A','Yes — first 128 same as ASCII'],
           ['Memory','Less','More (especially non-Latin)']]),
        tip('Cambridge exam question: "Why do websites use Unicode rather than ASCII?" — because users worldwide may use non-English characters that ASCII cannot represent.'),
      ]
    },

    { id:'1.3', title:'Images, Sound & Compression',
      examTip:'File size formulae: image = W×H×colour_depth (bits); sound = sample_rate×bit_depth×duration×channels (bits). Always ÷8 for bytes, ÷1024 for KB.',
      sections: [
        t('Image Representation','Images are stored as a grid of pixels. Each pixel has a colour value. Colour depth = bits per pixel. More bits = more colours but larger file.\n1-bit: 2 colours (black/white)\n8-bit: 256 colours\n24-bit: 16.7 million colours (true colour — 8 bits each for R, G, B)'),
        w('Image File Size Calculation','Formula: size (bits) = width × height × colour depth\n\nExample: 1920 × 1080 image, 24-bit colour\n  = 1920 × 1080 × 24\n  = 49,766,400 bits\n  = 49,766,400 ÷ 8 = 6,220,800 bytes\n  = 6,220,800 ÷ 1024 = 6,075 KB ≈ 5.93 MB'),
        t('Sound Representation','Sound is analogue (continuous). ADC (Analogue-to-Digital Converter) converts it to digital by:\n1. Sampling: measuring amplitude at regular intervals (sample rate in Hz)\n2. Quantisation: rounding each sample to nearest value (bit depth)\nHigher sample rate + higher bit depth = better quality + larger file.'),
        w('Sound File Size Calculation','Formula: size (bits) = sample rate × bit depth × duration × channels\n\nExample: CD quality, 3 minutes, stereo\n  = 44,100 Hz × 16 bits × 180 s × 2 channels\n  = 254,016,000 bits ÷ 8 = 31,752,000 bytes ≈ 30.3 MB\n\nMP3 compression (~10:1 ratio) ≈ 3 MB'),
        tbl(['','Lossless','Lossy'],
          [['Data loss','None — perfectly reconstructed','Permanently removed'],
           ['File size reduction','Moderate (e.g. 2:1)','High (e.g. 10:1 for MP3)'],
           ['Quality','Identical to original','Reduced (perceptibly or not)'],
           ['Examples','PNG, GIF, FLAC, ZIP, RLE','JPEG, MP3, AAC, H.264'],
           ['Best for','Text, programs, medical','Photos, music, video streams']]),
        t('Run-Length Encoding (RLE)','Lossless compression. Replaces consecutive repeated values with (count, value) pairs.\nEffective for images with large uniform colour areas (e.g. logos, flags).\nIneffective for photos with few repeating pixels.'),
        w('RLE Example','Original pixel row: RRRRRRGGGGBBBBBBBBB\nRLE encoded: (6,R)(4,G)(9,B)\nOriginal: 19 values → Encoded: 6 values = 68% smaller\n\nWorse case (no repeats):\nRGBRGBRGB → (1,R)(1,G)(1,B)(1,R)... → bigger than original!'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 2 — COMMUNICATION & INTERNET TECHNOLOGIES
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-2', number:'2', name:'Communication & Internet Technologies', specPoints: [

    { id:'2.1', title:'Networks — Types & Topologies',
      sections: [
        tbl(['','LAN','WAN'],
          [['Geographic scope','Single site (building/campus)','Multiple sites, cities, countries'],
           ['Ownership','Owned by one organisation','Leased infrastructure (ISP)'],
           ['Speed','High (Gbps typical)','Lower (varies widely)'],
           ['Cost','Hardware only','Ongoing rental/leasing fees'],
           ['Example','School network','The Internet']]),
        tbl(['Topology','Advantages','Disadvantages'],
          [['Star','One device fails → rest unaffected; easy to add devices','Single point of failure: switch/hub; more cable'],
           ['Bus','Simple, cheap, easy to set up','One break kills the whole network; slower with more devices; security risk'],
           ['Ring','Equal access; no collisions (token)','One break can stop network; fault-finding difficult'],
           ['Mesh','Highly resilient; multiple paths','Very expensive; complex setup']]),
        tip('Cambridge loves star topology questions. Key answer: "If one cable or device fails, only that device is affected — the rest of the network continues working." Contrast with bus where one break = total failure.'),
      ]
    },

    { id:'2.2', title:'Network Hardware & Protocols',
      sections: [
        tbl(['Device','Role'],
          [['Router','Directs packets between networks; connects LAN to internet; assigns IP addresses (DHCP)'],
           ['Switch','Connects devices within a LAN; sends data only to intended recipient (unlike hub)'],
           ['Access point','Provides wireless (Wi-Fi) connectivity to a wired LAN'],
           ['Firewall','Monitors and filters incoming/outgoing traffic; blocks unauthorised access'],
           ['NIC (Network Interface Card)','Enables a device to connect to a network; has a unique MAC address']]),
        t('MAC vs IP Addresses','MAC address: 48-bit physical address burned into NIC hardware. Unique globally. Used within LAN. Format: 6 pairs of hex digits e.g. 00:1A:2B:3C:4D:5E.\nIP address: logical address assigned by router. Can change. Used for routing across networks. IPv4: 32-bit (192.168.1.1). IPv6: 128-bit.'),
        tbl(['Protocol','Purpose'],
          [['TCP/IP','Core internet protocol suite. IP: routing/addressing. TCP: reliable ordered delivery.'],
           ['HTTP','Transfers web pages from server to browser (plain text)'],
           ['HTTPS','HTTP + TLS encryption — secure web traffic'],
           ['FTP','File transfer between systems'],
           ['SMTP','Sending email from client to server'],
           ['IMAP','Accessing email on server (keeps mail on server)'],
           ['POP3','Downloads email to client (removes from server)'],
           ['DNS','Domain name → IP address lookup (e.g. google.com → 142.250.200.46)']]),
        t('Packet Switching','Data is divided into packets. Each packet: header (source IP, destination IP, sequence number) + payload. Packets travel independently across the network, possibly via different routes, and are reassembled at the destination. Efficient: multiple packets share network links simultaneously.'),
      ]
    },

    { id:'2.3', title:'The Internet & World Wide Web',
      sections: [
        t('Internet vs World Wide Web','Internet: global network of networks — the physical infrastructure (cables, routers, servers).\nWorld Wide Web (WWW): a service running on the internet — web pages and hyperlinks accessed via HTTP/HTTPS. Other internet services: email, FTP, video streaming, VoIP.'),
        t('URLs and DNS','URL (Uniform Resource Locator): web address — protocol + domain + path.\nhttps://www.school.edu/cs/notes.html\n→ HTTPS protocol, www.school.edu domain, /cs/notes.html path\n\nDNS (Domain Name System): translates domain names to IP addresses. Hierarchical system of servers. Your device asks local DNS resolver → root server → TLD server → authoritative server.'),
        t('Cloud Computing','Cloud: storing data and running software on remote servers accessed via the internet rather than local hardware.\nAdvantages: access anywhere, automatic backups, lower hardware cost, scalable.\nDisadvantages: requires internet connection, privacy/security concerns, ongoing subscription costs, vendor lock-in.'),
        tip('Cambridge often asks: "What is the difference between the Internet and the World Wide Web?" Internet = network infrastructure. WWW = web pages accessed via HTTP on the internet. Not the same thing!'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 3 — HARDWARE
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-3', number:'3', name:'Hardware', specPoints: [

    { id:'3.1', title:'The CPU — Architecture & FDE Cycle',
      examTip:'For FDE cycle questions: name the register, state what data it holds, and describe what happens at each stage. 2 marks per stage.',
      sections: [
        t('CPU Components','The CPU (Central Processing Unit) consists of:\n• ALU (Arithmetic Logic Unit): performs arithmetic (+,-,×,÷) and logical operations (AND, OR, NOT, comparisons)\n• Control Unit (CU): fetches, decodes and executes instructions; coordinates all components\n• Registers: tiny, ultra-fast storage inside the CPU\n• Cache: small, fast memory between CPU and RAM'),
        tbl(['Register','Full Name','What it stores'],
          [['PC','Program Counter','Address of the NEXT instruction to fetch'],
           ['MAR','Memory Address Register','Address of memory being read or written'],
           ['MDR','Memory Data Register','Data just read from or about to be written to memory'],
           ['CIR','Current Instruction Register','Instruction currently being decoded and executed'],
           ['ACC','Accumulator','Result of the last ALU calculation']]),
        w('Fetch-Decode-Execute Cycle','FETCH:\n  1. Contents of PC copied to MAR\n  2. Instruction at memory[MAR] fetched into MDR\n  3. MDR → CIR (instruction now in CPU)\n  4. PC incremented (ready for next instruction)\n\nDECODE:\n  5. CU decodes instruction in CIR\n     (interprets opcode + operand)\n\nEXECUTE:\n  6. ALU performs arithmetic/logic, or data moved,\n     or branch updates PC, or I/O performed\n  7. Result stored in ACC or memory via MAR/MDR'),
        tbl(['Factor','Effect on performance'],
          [['Clock speed (GHz)','More cycles per second → faster execution; more heat generated'],
           ['Number of cores','Each core executes independently → parallel processing; multi-threaded programs benefit most'],
           ['Cache size','Larger cache → more data accessible at CPU speed → fewer slow RAM accesses'],
           ['Word length','Wider word → more data processed per instruction (e.g. 64-bit vs 32-bit)']]),
      ]
    },

    { id:'3.2', title:'Memory & Storage',
      sections: [
        tbl(['','RAM','ROM'],
          [['Full name','Random Access Memory','Read-Only Memory'],
           ['Volatile?','Yes — loses data when powered off','No — retains data without power'],
           ['Readable?','Yes','Yes'],
           ['Writable?','Yes','No (or very slowly — flash)'],
           ['Contains','Running OS, programs and data','Boot instructions, firmware, BIOS'],
           ['Speed','Fast','Fast (read)']]),
        t('Cache Memory','Hierarchy from fastest/smallest to slowest/largest:\nRegisters → L1 cache (on-chip, ~32KB) → L2 cache (on-chip, ~256KB) → L3 cache (shared, ~8MB) → RAM → SSD → HDD\n\nWhen CPU needs data: checks cache first (cache hit = fast), then RAM (cache miss = slower), then storage.'),
        tbl(['Storage Type','Technology','Speed','Persistent?','Typical Use'],
          [['SSD','NAND flash chips','Very fast','Yes','OS, programs, files'],
           ['HDD','Spinning magnetic platters','Slower','Yes','Bulk storage, backups'],
           ['USB flash','NAND flash','Fast','Yes','Portable file transfer'],
           ['Optical (CD/DVD/Blu-ray)','Laser read/write','Slow','Yes','Media distribution, archiving'],
           ['Magnetic tape','Sequential magnetic strips','Very slow','Yes','Long-term bulk backup']]),
        t('Virtual Memory','When RAM is full, the OS uses part of the HDD/SSD as virtual memory (swap space). Pages of RAM are swapped out to disk to free space for active processes. Much slower than RAM — excessive swapping causes "thrashing" and slows the system significantly.'),
      ]
    },

    { id:'3.3', title:'Input, Output & Peripherals',
      sections: [
        tbl(['Category','Examples','How they work'],
          [['Direct input','Keyboard, mouse, touchscreen, microphone, camera, barcode reader','Convert physical input to digital signals the CPU can process'],
           ['Sensor input','Temperature, light, sound, pressure, humidity sensors','Convert analogue measurements to digital values'],
           ['Soft-copy output','Monitor, projector, speakers','Display/play digital data without physical form'],
           ['Hard-copy output','Inkjet printer, laser printer','Produce physical output on paper/material']]),
        t('Inkjet vs Laser Printers','Inkjet: liquid ink fired through nozzles, excellent for photos, slow for high volume, low initial cost but expensive ink.\nLaser: toner (dry powder) fused by heat, fast for documents, high initial cost but cheaper per page, not ideal for high-quality photos.'),
        t('Actuators','Output devices that cause physical movement: motors, solenoids, heating elements. Used in embedded systems and robotics. Controlled by digital signals from a microcontroller.'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 4 — PROCESSOR FUNDAMENTALS (Cambridge Assembly Language)
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-4', number:'4', name:'Processor Fundamentals', specPoints: [

    { id:'4.1', title:'Cambridge Assembly Language',
      examTip:'Cambridge has a specific instruction set. Memorise LDM, LDD, STO, ADD, SUB, CMP, JPE, JPN, JMP, AND, OR, XOR, LSL, LSR, IN, OUT, END.',
      sections: [
        tbl(['Instruction','Operation','Example'],
          [['LDM #n','Load immediate value n into ACC','LDM #5 → ACC = 5'],
           ['LDD addr','Load value at memory address into ACC','LDD 100 → ACC = contents of mem[100]'],
           ['STO addr','Store ACC value into memory address','STO 100 → mem[100] = ACC'],
           ['ADD addr/n','ACC = ACC + value/number','ADD #10 → ACC = ACC + 10'],
           ['SUB addr/n','ACC = ACC - value/number','SUB 100 → ACC = ACC - mem[100]'],
           ['INC/DEC reg','Increment or decrement register by 1','INC ACC → ACC = ACC + 1'],
           ['CMP addr/n','Compare ACC with value (sets flags)','CMP #0'],
           ['JPE addr','Jump to address if last CMP was equal','JPE DONE'],
           ['JPN addr','Jump if last CMP was NOT equal','JPN LOOP'],
           ['JMP addr','Unconditional jump','JMP START'],
           ['AND/OR/XOR addr/n','Bitwise operation on ACC','AND #11110000'],
           ['LSL/LSR n','Logical shift left/right n bits','LSL 2 (multiply by 4)'],
           ['IN','Read keyboard value into ACC','IN'],
           ['OUT','Output ACC to display','OUT'],
           ['END','Stop program','END']]),
        w('Assembly Counting Loop','// Count from 1 to 5 and output each value\n        LDM #1        // ACC = 1 (start value)\n        STO COUNT     // store in COUNT\nLOOP:   LDD COUNT     // load current count\n        CMP #6        // compare with 6\n        JPE DONE      // if ACC=6, we\'ve gone past 5, stop\n        OUT           // output current value\n        ADD #1        // increment\n        STO COUNT     // store back\n        JMP LOOP      // repeat\nDONE:   END\nCOUNT:  1             // variable storage'),
        t('Interrupts','An interrupt is a signal to the CPU to suspend current execution and handle an urgent event. Types: hardware interrupts (I/O complete, hardware failure), software interrupts (exceptions, system calls).\nProcess: current state saved (registers pushed to stack) → ISR (Interrupt Service Routine) executed → state restored → original program resumes.'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 5 — SYSTEM SOFTWARE
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-5', number:'5', name:'System Software', specPoints: [

    { id:'5.1', title:'Operating Systems',
      sections: [
        t('What the OS Does','The OS is software that manages the computer\'s hardware and provides services to application programs. Without the OS, programs would each need to directly control hardware — impossible to maintain.\n\nThe five main functions of an OS:',),
        tbl(['Function','Description'],
          [['Memory management','Allocates RAM to processes; protects processes from each other; manages virtual memory'],
           ['Process management','Schedules which process uses the CPU; handles multitasking; creates/terminates processes'],
           ['Device management','Provides device drivers as standard interfaces; handles I/O requests'],
           ['File management','Creates/deletes/reads/writes files; manages directory structure; controls access permissions'],
           ['Security','Authentication (login), authorisation (file permissions), audit logging']]),
        tbl(['OS Type','Description','Examples'],
          [['Batch','Jobs queued and processed without user interaction','Early IBM mainframes, payroll processing'],
           ['Multi-tasking','Multiple processes share CPU (time-sliced)','Windows, macOS, Linux'],
           ['Real-time (RTOS)','Guaranteed response within a time deadline','Aircraft controls, pacemakers, anti-lock brakes'],
           ['Distributed','Processes across multiple networked machines','Scientific computing clusters'],
           ['Embedded','Lightweight OS for dedicated device','Washing machine, router, ATM'],
           ['Networked','Provides resources (files, printers) over a network','Windows Server, Novell NetWare']]),
        t('Process Scheduling','The OS scheduler decides which process runs. Common algorithms:\n• Round Robin: each process gets equal time slices in rotation — fair, prevents starvation\n• Priority: higher-priority processes run first — risk of low-priority starvation\n• FCFS: First Come First Served — simple, but long jobs block short ones (convoy effect)'),
      ]
    },

    { id:'5.2', title:'Utility Software & Translation',
      sections: [
        tbl(['Utility Software','Purpose'],
          [['Disk defragmenter','Rearranges fragmented files on HDD so they are stored contiguously → faster access (SSDs don\'t fragment)'],
           ['Antivirus','Scans for known malware signatures; heuristic analysis for unknown threats; quarantines/removes threats'],
           ['Firewall','Monitors network traffic; blocks unauthorised connections based on rules'],
           ['Disk formatter','Prepares storage for use; creates file system structure (FAT32, NTFS, ext4)'],
           ['Compression tool','Reduces file size using algorithms (ZIP, RAR); lossless'],
           ['Backup software','Copies files automatically; full/incremental/differential backup types']]),
        tbl(['Translator','Input','Output','When executed'],
          [['Assembler','Assembly language','Machine code','Translated once then run directly'],
           ['Compiler','High-level source code','Machine code executable','Translated once; runs fast; source not needed'],
           ['Interpreter','High-level source code','Executes directly','Translated line by line at runtime; slower; source needed']]),
        t('Compiler vs Interpreter','Compiler: translates entire program before execution. Result runs fast. Errors found at compile time. Source code not needed to run program. Platform-specific output.\nInterpreter: translates and executes line by line. Slower execution. Errors found at runtime (stops at first error). Cross-platform (just need the interpreter). Good for scripting and development.'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 6 — SECURITY, PRIVACY & DATA INTEGRITY
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-6', number:'6', name:'Security, Privacy & Data Integrity', specPoints: [

    { id:'6.1', title:'Cybersecurity Threats',
      sections: [
        tbl(['Threat','Description','Example'],
          [['Phishing','Deceptive email/website impersonating trusted source to steal credentials','Fake bank email asking you to "verify" your login'],
           ['Malware','Software designed to harm: virus, worm, Trojan, ransomware, spyware','Ransomware encrypts files and demands payment'],
           ['Virus','Attaches to legitimate files; spreads when file is opened/shared','Email attachment infects and self-replicates'],
           ['Worm','Self-replicates across networks without user action','Spreads through network vulnerabilities automatically'],
           ['Trojan','Appears legitimate but contains malicious payload','Game download that installs a keylogger'],
           ['Brute force','Systematically tries all possible passwords','Dictionary attack using millions of common passwords'],
           ['SQL injection','Malicious SQL inserted into input fields to manipulate database','Username: \' OR 1=1; -- (bypasses login)'],
           ['DoS/DDoS','Floods server with requests to make it unavailable','Botnet sends millions of requests to crash a website'],
           ['Social engineering','Manipulating people to reveal confidential information','Pretending to be IT support to get passwords']]
        ),
      ]
    },

    { id:'6.2', title:'Protection Methods & Encryption',
      sections: [
        tbl(['Protection Method','What it protects against'],
          [['Strong passwords + MFA','Brute force, credential theft'],
           ['Firewall (hardware/software)','Unauthorised network access, port scanning'],
           ['Anti-malware software','Viruses, worms, Trojans, ransomware'],
           ['Software updates/patches','Known vulnerabilities being exploited'],
           ['Access levels/permissions','Insider threats, accidental data modification'],
           ['Encryption (at rest + in transit)','Data interception, eavesdropping'],
           ['Biometric authentication','Stolen passwords, unauthorised access'],
           ['Penetration testing','Unknown vulnerabilities'],
           ['User education & training','Phishing, social engineering']]),
        t('Symmetric vs Asymmetric Encryption','Symmetric: same key used to encrypt and decrypt. Fast. Problem: how to securely share the key.\nExamples: AES, DES.\n\nAsymmetric: public key encrypts (share freely), private key decrypts (keep secret). Solves key distribution problem but slower.\nExamples: RSA. Used in: HTTPS (TLS handshake), digital signatures.\n\nIn practice: asymmetric used to exchange a symmetric session key, then symmetric used for bulk data.'),
        t('Data Integrity','Data integrity: ensuring data has not been corrupted or altered in transit.\nMethods:\n• Checksums: simple sum of data values; detect transmission errors\n• Parity bits: extra bit making total 1s even (even parity) or odd; detects single-bit errors\n• Hash functions: one-way mathematical function producing fixed-size digest; used to verify file integrity (MD5, SHA-256)'),
        tip('"Explain how a hash function can be used to verify file integrity." Answer: "Hash the file before and after transmission/storage. Compare the two hash values. If they match, the file is unchanged. Even a single bit change produces a completely different hash."'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 7 — ETHICS & OWNERSHIP
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-7', number:'7', name:'Ethics & Ownership', specPoints: [

    { id:'7.1', title:'Intellectual Property & Licensing',
      sections: [
        tbl(['Type','Who can use it','Cost','Source code'],
          [['Commercial/proprietary software','Only licensed users','Paid (usually)','Closed — not available'],
           ['Freeware','Anyone','Free','Closed'],
           ['Shareware','Anyone (limited time/features)','Free trial, then paid','Closed'],
           ['Open source','Anyone','Usually free','Open — can view and modify'],
           ['Public domain','Anyone','Free','May be open']]),
        t('Copyright and Plagiarism','Copyright: automatic legal protection for original creative work. Software is copyright by default from creation. Copying/distributing without permission is illegal.\nPlagiarism: presenting someone else\'s work as your own — academic misconduct.\n\nCreative Commons licences allow creators to specify permitted uses: attribution required (CC BY), no commercial use (CC NC), share-alike (CC SA), no derivatives (CC ND).'),
        t('Digital Divide','The gap between those with and without access to digital technology and the internet. Dimensions: geographic (rural/urban), economic (rich/poor countries), generational (older vs younger), disability. Consequences: unequal access to education, employment, healthcare, government services.'),
      ]
    },

    { id:'7.2', title:'Environmental & Social Impact',
      sections: [
        t('Environmental Impact','Positive: remote working reduces commuting emissions; precision agriculture reduces waste; smart grids optimise energy use; climate modelling improves forecasts.\nNegative: data centres consume 1–2% of global electricity; manufacturing devices requires rare earth metals and pollutes; e-waste contains toxic materials (lead, mercury, cadmium); rapid upgrade cycles increase waste.'),
        t('AI and Automation','AI increasingly automates tasks: manufacturing, data entry, customer service, medical diagnosis, legal research.\nIssues: job displacement (short-term pain); potential for new roles (long-term); algorithmic bias (trained on biased data produces biased decisions); privacy (facial recognition, surveillance); autonomous weapons; accountability when AI makes harmful decisions.'),
        tbl(['Stakeholder','Interest'],
          [['Governments','Regulation, tax revenue, national security'],
           ['Businesses','Profit, efficiency, competitive advantage'],
           ['Employees','Job security, working conditions'],
           ['Consumers','Privacy, price, functionality, safety'],
           ['Society','Fairness, equality, environmental impact'],
           ['Academics','Responsible development, safety research']]),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 8 — DATABASES & DATA MODELLING
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-8', number:'8', name:'Databases & Data Modelling', specPoints: [

    { id:'8.1', title:'Database Concepts',
      sections: [
        t('Why Databases?','Flat files store all data in a single table — problems: data redundancy (same data repeated), update anomalies (must update in multiple places), inconsistency.\n\nRelational databases solve these by splitting data into related tables, linked by keys. Reduces redundancy; changes in one table propagate automatically via foreign keys.'),
        tbl(['Term','Definition'],
          [['Table (relation)','Grid of rows (records) and columns (fields)'],
           ['Record (row/tuple)','One complete entry in a table'],
           ['Field (column/attribute)','One piece of information stored for every record'],
           ['Primary key','Unique identifier for each record — cannot be NULL, never repeated'],
           ['Foreign key','Field in one table that references the primary key of another — creates a relationship'],
           ['Entity','A real-world "thing" that the database stores information about (e.g. Student, Course)']]),
        t('Entity-Relationship Diagrams','ERDs show entities and the relationships between them.\nRelationship types:\n• One-to-one (1:1): one teacher has one classroom\n• One-to-many (1:M): one teacher has many students\n• Many-to-many (M:M): students take many courses; courses have many students → needs a junction table'),
      ]
    },

    { id:'8.2', title:'SQL',
      examTip:'Cambridge SQL: always write complete statements. SELECT * is acceptable. Use = not == for equality. Strings in single quotes.',
      sections: [
        w('SQL Queries','-- Select all records\nSELECT * FROM Students;\n\n-- Select specific fields with condition\nSELECT Name, Score\nFROM Students\nWHERE Score > 70\nORDER BY Score DESC;\n\n-- Join two tables\nSELECT Students.Name, Courses.CourseName\nFROM Students\nJOIN Enrolments ON Students.StudentID = Enrolments.StudentID\nJOIN Courses ON Enrolments.CourseID = Courses.CourseID\nWHERE Courses.CourseName = \'Computer Science\';\n\n-- Insert a record\nINSERT INTO Students (StudentID, Name, Score)\nVALUES (1042, \'Alice\', 92);\n\n-- Update a record\nUPDATE Students\nSET Score = 95\nWHERE StudentID = 1042;\n\n-- Delete a record\nDELETE FROM Students\nWHERE StudentID = 1042;'),
        tbl(['Clause','Purpose'],
          [['SELECT fields','Choose which fields to display'],
           ['FROM table','Which table to query'],
           ['WHERE condition','Filter rows (=, <>, <, >, <=, >=, AND, OR, NOT)'],
           ['ORDER BY field ASC/DESC','Sort results'],
           ['JOIN ... ON','Combine tables'],
           ['INSERT INTO ... VALUES','Add new record'],
           ['UPDATE ... SET','Modify existing record'],
           ['DELETE FROM','Remove records']]),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 9 — BOOLEAN LOGIC
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-9', number:'9', name:'Boolean Logic', specPoints: [

    { id:'9.1', title:'Logic Gates & Truth Tables',
      examTip:'For complex circuit truth tables: add a column for each gate\'s output. Cambridge awards marks for correct intermediate columns even if the final answer is wrong.',
      sections: [
        tbl(['Gate','Symbol','Operation','Rule'],
          [['NOT','Ā or ¬A','Inverts input','0→1, 1→0'],
           ['AND','A·B or A AND B','Output 1 only if ALL inputs are 1','1 only when A=1 AND B=1'],
           ['OR','A+B or A OR B','Output 1 if ANY input is 1','0 only when both are 0'],
           ['NAND','NOT(A·B)','Opposite of AND','0 only when A=1 AND B=1'],
           ['NOR','NOT(A+B)','Opposite of OR','1 only when both are 0'],
           ['XOR','A⊕B','1 when inputs DIFFER','0 when inputs are the same']]),
        w('Complete Truth Table','A | B | NOT A | A AND B | A OR B | A XOR B | A NAND B\n0 | 0 |   1   |    0    |    0   |    0    |    1\n0 | 1 |   1   |    0    |    1   |    1    |    1\n1 | 0 |   0   |    0    |    1   |    1    |    1\n1 | 1 |   0   |    1    |    1   |    0    |    0'),
        t("De Morgan's Laws","NOT(A AND B) = (NOT A) OR (NOT B)\nNOT(A OR B) = (NOT A) AND (NOT B)\n\nMemory trick: 'Break the bar, flip the operator'\n→ Remove the NOT from the bracket, change AND↔OR, add NOT to each variable."),
        w('Boolean Expression → Logic Circuit','Expression: X = (A AND B) OR (NOT C)\n\nStep 1: Identify gates needed:\n  Gate 1 (AND): inputs A, B → output P\n  Gate 2 (NOT): input C → output Q\n  Gate 3 (OR): inputs P, Q → output X\n\nStep 2: Truth table has 3 inputs → 2³ = 8 rows'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 10 — ALGORITHM DESIGN & PROBLEM SOLVING
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-10', number:'10', name:'Algorithm Design & Problem Solving', specPoints: [

    { id:'10.1', title:'Computational Thinking & Representation',
      sections: [
        tbl(['Concept','Definition','Example'],
          [['Decomposition','Breaking a complex problem into smaller sub-problems','A game → graphics, physics, audio, input, AI (separate modules)'],
           ['Abstraction','Removing unnecessary detail; focusing on what matters','Map showing roads but not individual buildings'],
           ['Pattern recognition','Identifying similarities or common structures','Recognising that all sorting algorithms compare and rearrange'],
           ['Algorithm design','Creating a step-by-step solution before coding','Pseudocode or flowchart before writing Python']]),
        tbl(['Flowchart symbol','Meaning'],
          [['Oval','Start / End (terminator)'],
           ['Rectangle','Process / instruction'],
           ['Diamond','Decision (Yes/No branch)'],
           ['Parallelogram','Input or Output'],
           ['Arrow','Flow of control']]),
      ]
    },

    { id:'10.2', title:'Searching & Sorting Algorithms',
      examTip:'For binary search: show each step with low, high, mid. For bubble sort: show every comparison, not just swaps. Cambridge awards marks for process, not just results.',
      sections: [
        t('Linear Search','Check each element in sequence from start to end until target found or list exhausted.\nBest case: target is the first element — 1 comparison.\nWorst case: target is last or not present — every element is checked.\nWorks on any list (sorted or unsorted). Simple but slow for large datasets.'),
        t('Binary Search','Requires sorted list. Repeatedly halve the search space:\n1. Find middle element\n2. If middle = target: found\n3. If target < middle: search left half\n4. If target > middle: search right half\n5. Repeat until found or no elements left\n\nFor 1,000,000 items: at most 20 comparisons — far fewer than linear search!'),
        w('Binary Search Trace','List: [3, 7, 12, 19, 24, 31, 45, 58, 67, 82]\nFind: 31\n\nStep 1: low=0, high=9, mid=4 → list[4]=24. 31>24 → search right\nStep 2: low=5, high=9, mid=7 → list[7]=58. 31<58 → search left\nStep 3: low=5, high=6, mid=5 → list[5]=31. Found! ✓\n\nOnly 3 comparisons vs up to 10 for linear search'),
        t('Bubble Sort','Compare adjacent pairs. Swap if out of order. Repeat until no swaps made in a full pass (sorted).\nAfter each pass: the largest unsorted element is in its correct position.\nSimple to trace and understand. Good for small or nearly-sorted lists.\nOptimisation: if no swaps in a pass → already sorted → stop early (important efficiency improvement to mention in exam answers).'),
        w('Bubble Sort Trace','Sort [5, 2, 8, 1, 4]:\n\nPass 1: [2,5,8,1,4]→[2,5,1,8,4]→[2,5,1,4,8] (8 in position)\nPass 2: [2,1,5,4,8]→[2,1,4,5,8] (5 in position)\nPass 3: [1,2,4,5,8] (no swaps — sorted!)\n\n3 passes, 8 comparisons'),
        t('Merge Sort','Divide-and-conquer. Split list in half recursively until single elements, then merge sorted halves.\nMuch more efficient than bubble sort for large datasets — the number of operations grows slowly as list size increases. Requires extra memory for merging.\nStable sort (preserves order of equal elements).'),
      ]
    },

    { id:'10.3', title:'Cambridge Pseudocode',
      examTip:'Cambridge 0478 has SPECIFIC pseudocode conventions. Using Python syntax in a pseudocode answer can lose marks.',
      sections: [
        w('Cambridge Pseudocode Reference','// Assignment\nx ← 5\nname ← "Alice"\n\n// Selection\nIF score >= 70 THEN\n    OUTPUT "Pass"\nELSEIF score >= 50 THEN\n    OUTPUT "Merit"\nELSE\n    OUTPUT "Fail"\nENDIF\n\n// Count-controlled loop\nFOR i ← 1 TO 10\n    OUTPUT i\nNEXT i\n\n// Condition-controlled loops\nWHILE count < 10 DO\n    count ← count + 1\nENDWHILE\n\nREPEAT\n    INPUT x\nUNTIL x > 0\n\n// 1D Array (1-indexed in Cambridge!)\nDECLARE scores : ARRAY[1:30] OF INTEGER\nscores[1] ← 85\n\n// Procedure & Function\nPROCEDURE Greet(name : STRING)\n    OUTPUT "Hello " & name\nENDPROCEDURE\n\nFUNCTION Square(n : INTEGER) RETURNS INTEGER\n    RETURN n * n\nENDFUNCTION'),
        tbl(['Cambridge convention','NOT Python'],
          [['x ← 5','x = 5'],
           ['OUTPUT x','print(x)'],
           ['INPUT x','x = input()'],
           ['// or // comment','# comment'],
           ['x ← x + 1 or INC x','x += 1'],
           ['ARRAY[1:10]','Starts at index 1, not 0'],
           ['& for string concat','"Hello" + " " + name'],
           ['MOD for remainder','%'],
           ['DIV for integer division','//']]),
        t('String Functions in Cambridge','LENGTH("Hello") → 5\nUCASE("hello") → "HELLO"\nLCASE("HI") → "hi"\nSUBSTRING("Computer", 1, 4) → "Comp"  (1-indexed, length not end pos)\nNote: SUBSTRING(str, start, length) — start position is 1-based!'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 11 — PROGRAMMING
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-11', number:'11', name:'Programming', specPoints: [

    { id:'11.1', title:'Data Types & Variables',
      sections: [
        tbl(['Data type','Description','Example values','Cambridge keyword'],
          [['Integer','Whole numbers (positive, negative, zero)','42, -7, 0','INTEGER'],
           ['Real/Float','Decimal numbers','3.14, -0.5, 100.0','REAL'],
           ['Char','Single character','"A", "9", " "','CHAR'],
           ['String','Sequence of characters','"Hello", "abc123"','STRING'],
           ['Boolean','True or False only','TRUE, FALSE','BOOLEAN'],
           ['Array','Fixed-size collection of same-type values','[1,2,3,4,5]','ARRAY[1:n] OF type']]),
        t('Type Casting','Converting between types: INT_TO_REAL(5) → 5.0, REAL_TO_INT(3.7) → 3 (truncates), NUM_TO_STRING(42) → "42", STRING_TO_NUM("42") → 42.\n\nCambridge also uses: input always returns STRING — you must convert numbers explicitly.'),
      ]
    },

    { id:'11.2', title:'Selection, Iteration & Subroutines',
      sections: [
        t('CASE Statement','Alternative to nested IF for multiple values of same variable.',),
        w('CASE Example','CASE OF day\n    1 : OUTPUT "Monday"\n    2 : OUTPUT "Tuesday"\n    3 : OUTPUT "Wednesday"\n    4 : OUTPUT "Thursday"\n    5 : OUTPUT "Friday"\n    OTHERWISE : OUTPUT "Weekend"\nENDCASE'),
        t('Choosing the Right Loop','FOR: use when number of iterations is known in advance (counting loops)\nWHILE: use when condition checked before loop starts (may run 0 times)\nREPEAT-UNTIL: condition checked after loop (always runs at least once — like a "do-while")'),
        t('Procedures vs Functions','PROCEDURE: performs a task, no return value. Called as a statement.\nFUNCTION: performs a task AND returns a value. Called inside an expression.\n\nBoth can take PARAMETERS (formal parameters in definition) and be called with ARGUMENTS (actual values passed).\n\nBy VALUE: copy of argument passed — changes inside don\'t affect original.\nBy REFERENCE (BYREF): address passed — changes inside DO affect original.'),
      ]
    },

    { id:'11.3', title:'Arrays & File Handling',
      sections: [
        w('Array Operations in Cambridge Pseudocode','// 1D array — stores 5 scores\nDECLARE scores : ARRAY[1:5] OF INTEGER\nscores[1] ← 85\nscores[2] ← 72\n\n// Find total using loop\ntotal ← 0\nFOR i ← 1 TO 5\n    total ← total + scores[i]\nNEXT i\nOUTPUT total / 5  // average\n\n// 2D array — 3×3 grid\nDECLARE grid : ARRAY[1:3, 1:3] OF INTEGER\ngrid[2, 3] ← 7  // row 2, column 3'),
        w('File Handling in Cambridge Pseudocode','// Writing to a file\nOPENFILE "results.txt" FOR WRITE\nWRITEFILE "results.txt", "Alice,92"\nWRITEFILE "results.txt", "Bob,87"\nCLOSEFILE "results.txt"\n\n// Reading from a file\nOPENFILE "results.txt" FOR READ\nWHILE NOT EOF("results.txt") DO\n    READFILE "results.txt", line\n    OUTPUT line\nENDWHILE\nCLOSEFILE "results.txt"'),
        tip('Cambridge file handling uses OPENFILE, READFILE, WRITEFILE, CLOSEFILE, and EOF() function. Remember: always CLOSEFILE when done. EOF() returns TRUE when end of file is reached.'),
      ]
    },
  ]},

  // ══════════════════════════════════════════════════════════════════
  // 12 — SOFTWARE DEVELOPMENT
  // ══════════════════════════════════════════════════════════════════
  { id:'cg-12', number:'12', name:'Software Development', specPoints: [

    { id:'12.1', title:'Program Development Lifecycle',
      sections: [
        tbl(['Stage','Activities'],
          [['Analysis','Define the problem; identify inputs, outputs and processes; stakeholder requirements'],
           ['Design','Algorithm design (flowcharts, pseudocode); data structures; user interface design; test plan'],
           ['Coding','Write source code based on design; documentation (comments, variable naming)'],
           ['Testing','Test against plan; find and fix errors; verify it meets requirements'],
           ['Evaluation','Does it solve the problem efficiently? Feedback from users; identify improvements']]),
        tbl(['Error type','Description','Example'],
          [['Syntax error','Code violates language grammar rules; caught at compile/parse time','Missing colon, wrong indentation, unclosed bracket'],
           ['Logic error','Code runs but produces wrong output; hardest to find','Using > instead of >=; wrong formula'],
           ['Runtime error','Code crashes during execution','Dividing by zero; accessing array out of bounds']]),
        t('Testing Types','White-box testing: tester knows the internal code structure; tests specific paths through the code.\nBlack-box testing: tester only knows inputs and expected outputs; treats program as a "black box".\nTrace tables: manually track variable values through code, line by line, to find logic errors.\nTest data: Normal (valid), Boundary (edge of valid range), Invalid/Erroneous (should be rejected).'),
      ]
    },

    { id:'12.2', title:'IDE & Program Documentation',
      sections: [
        tbl(['IDE Feature','Purpose'],
          [['Code editor','Syntax highlighting, auto-indentation, code completion'],
           ['Debugger','Set breakpoints; step through code; inspect variable values at runtime'],
           ['Translator built-in','Compile or interpret directly from IDE'],
           ['Error diagnostics','Underlines errors, suggests fixes, shows line numbers'],
           ['Version control integration','Track changes; collaborate; roll back to earlier version']]),
        t('Documentation','Internal documentation: comments inside the code explaining what and why; meaningful variable/function names; consistent formatting.\nExternal documentation: user manual (how to use the software); technical manual (for developers maintaining the software); installation guide.\n\nGood documentation reduces maintenance cost significantly — a program may be maintained for 10+ years after it was written.'),
      ]
    },
  ]},

  ]
};

export const GCSE_NOTES: ALevelBoard[] = [AQA_GCSE, OCR_GCSE, CAM_IGCSE];
