// ═══════════════════════════════════════════════════════════════════
// A Level Computer Science Notes — Spec-point level, textbook depth
// AQA 7517 · OCR H446 · Cambridge 9618
// ═══════════════════════════════════════════════════════════════════

export interface Section {
  type: 'text' | 'keyterm' | 'worked' | 'tip' | 'mistake' | 'table';
  heading?: string; body?: string;
  term?: string; def?: string;
  label?: string; code?: string;
  text?: string;
  headers?: string[]; rows?: string[][];
}
export interface ExamQ { q: string; marks: number; scheme: string[]; }
export interface SpecPoint { id: string; title: string; examTip?: string; sections: Section[]; exam?: ExamQ[]; }
export interface Topic { id: string; number: string; name: string; specPoints: SpecPoint[]; }
export interface ALevelBoard { id: string; name: string; topics: Topic[]; }

// ─── Shared content helpers ──────────────────────────────────────
const t = (heading: string, body: string): Section => ({ type:'text', heading, body });
const kt = (term: string, def: string): Section => ({ type:'keyterm', term, def });
const w = (label: string, code: string): Section => ({ type:'worked', label, code });
const tip = (text: string): Section => ({ type:'tip', text });
const err = (text: string): Section => ({ type:'mistake', text });
const tbl = (headers: string[], rows: string[][]): Section => ({ type:'table', headers, rows });

// ═══════════════════════════════════════════════════════════════════
// AQA A LEVEL (7517)
// ═══════════════════════════════════════════════════════════════════
const AQA_ALEVEL: ALevelBoard = {
  id: 'aqa', name: 'AQA A Level (7517)',
  topics: [

  // ── 3.1 FUNDAMENTALS OF PROGRAMMING ──────────────────────────────
  { id:'aqa-1', number:'3.1', name:'Fundamentals of Programming', specPoints: [

    { id:'3.1.1', title:'Programming Constructs & Recursion',
      examTip:'Recursion questions almost always appear — always identify the base case and recursive case explicitly.',
      sections: [
        t('Sequence, Selection and Iteration','The three basic programming constructs can model any algorithm. <strong>Sequence</strong>: instructions execute one after another. <strong>Selection</strong>: IF/ELIF/ELSE branches based on a condition. <strong>Iteration</strong>: FOR loops (definite) and WHILE loops (indefinite) repeat blocks of code. These are sufficient to express any computable algorithm (structured theorem).'),
        kt('Recursion','A subroutine that calls itself as part of its own definition. Every recursive solution must have a <strong>base case</strong> (a condition where the function returns without a recursive call) and a <strong>recursive case</strong> (the call to itself on a simpler version of the problem).'),
        t('How Recursion Works','Each recursive call creates a new <strong>stack frame</strong> on the call stack, storing local variables and the return address. When the base case is reached, the stack unwinds. If the base case is never reached, a <strong>stack overflow</strong> occurs. The maximum recursion depth depends on stack size.'),
        w('Recursive Factorial','def factorial(n):\n    if n == 0:          # Base case\n        return 1\n    return n * factorial(n - 1)  # Recursive case\n\n# factorial(4) calls:\n# 4 * factorial(3)\n# 4 * 3 * factorial(2)\n# 4 * 3 * 2 * factorial(1)\n# 4 * 3 * 2 * 1 * factorial(0)\n# 4 * 3 * 2 * 1 * 1 = 24'),
        w('Recursive Fibonacci with Trace','def fib(n):\n    if n <= 1:        # Base case\n        return n\n    return fib(n-1) + fib(n-2)  # Recursive case\n\n# fib(4):\n#   fib(3) + fib(2)\n#   (fib(2)+fib(1)) + (fib(1)+fib(0))\n#   ((fib(1)+fib(0))+1) + (1+0)\n#   ((1+0)+1) + 1 = 3\n\n# Inefficient: same values recalculated many times\n# Solution: memoisation (cache results)'),
        tbl(['Feature','Recursion','Iteration'],
          [['Code length','Often shorter, more elegant','Longer but explicit'],
           ['Memory','Stack frame per call — risk of overflow','Constant memory'],
           ['Performance','Slower (function call overhead)','Faster'],
           ['Natural fit','Tree traversal, divide-and-conquer','Counting, accumulation'],
           ['Base case','Essential — prevents infinite recursion','Loop condition prevents infinite loop']]),
        tip('To explain recursion in an exam: (1) state the base case and what it returns, (2) state the recursive case and how it simplifies the problem, (3) explain that the stack unwinds when the base case is reached. Three sentences scores full marks.'),
        err('A common mistake is writing a recursive function with no base case, or a base case that is never reached. Always trace through your recursive function to verify it terminates.'),
      ]
    },

    { id:'3.1.2', title:'Subroutines, Parameters & Scope',
      examTip:'Know the difference between passing by value vs by reference — a classic 2-mark question.',
      sections: [
        t('Procedures and Functions','A <strong>procedure</strong> performs actions but does not return a value to the caller. A <strong>function</strong> performs actions AND returns a value. Both can take parameters. The key exam distinction: if a subroutine has a return statement with a value, it is a function; otherwise it is a procedure.'),
        kt('Parameter passing by value','A <strong>copy</strong> of the argument\'s value is passed into the subroutine. Changes to the parameter inside the subroutine do not affect the original variable. Safe — cannot accidentally modify the caller\'s data.'),
        kt('Parameter passing by reference','The <strong>memory address</strong> of the variable is passed. Changes inside the subroutine directly modify the original variable. Used when the subroutine needs to modify the caller\'s data or when passing large data structures (avoids copying).'),
        w('By Value vs By Reference','# By value (Python — all primitives pass by value)\ndef double(x):\n    x = x * 2      # Only changes local copy\n    return x\n\na = 5\nresult = double(a)\nprint(a)       # Still 5 — unchanged\nprint(result)  # 10\n\n# By reference (simulated with mutable objects)\ndef append_item(lst, item):\n    lst.append(item)   # Modifies the original list\n\nmy_list = [1, 2, 3]\nappend_item(my_list, 4)\nprint(my_list)  # [1, 2, 3, 4] — list was modified'),
        kt('Local variable','Declared inside a subroutine. Only accessible within that subroutine. Created when the subroutine is called, destroyed when it returns. Using local variables prevents unintended side effects.'),
        kt('Global variable','Declared outside all subroutines. Accessible from anywhere in the program. Should be used sparingly — makes programs harder to debug and maintain, as any subroutine could modify the value unexpectedly.'),
        tbl(['Aspect','Local variable','Global variable'],
          [['Scope','Within its subroutine only','Entire program'],
           ['Lifetime','Created/destroyed with subroutine','Exists for program\'s lifetime'],
           ['Access','Only the subroutine that declares it','Any subroutine'],
           ['Risk','None — contained','Can be accidentally modified anywhere'],
           ['Best practice','Preferred for most variables','Use sparingly for constants']]),
        tip('Exam question: "Give one advantage of using local variables." Answer: "Local variables are only accessible within the subroutine that declares them, so they cannot be accidentally modified by other parts of the program, making the code easier to debug."'),
      ]
    },

    { id:'3.1.3', title:'Object-Oriented Programming',
      examTip:'OOP questions are worth 6–8 marks. Always cover encapsulation, inheritance and polymorphism with specific examples.',
      sections: [
        t('The Four Pillars of OOP','OOP organises programs around <strong>objects</strong> (instances of classes) rather than procedures. The four core principles: <strong>Encapsulation</strong> — bundling data and methods, hiding internal details. <strong>Inheritance</strong> — subclasses inherit attributes and methods from a parent class. <strong>Polymorphism</strong> — different classes can share the same method name but implement it differently. <strong>Abstraction</strong> — exposing only what is necessary, hiding complexity.'),
        kt('Class','A blueprint/template for creating objects. Defines what attributes (data) and methods (behaviours) objects of that type will have. A class is not an object — it is the definition from which objects are created.'),
        kt('Object / Instance','A specific realisation of a class. When you instantiate a class (call the constructor), an object is created in memory with its own copy of the class\'s attributes.'),
        kt('Encapsulation','Keeping an object\'s data (attributes) private and only accessible through defined methods (getters/setters). This protects data integrity — you cannot directly set a student\'s age to -5 if the setter validates the input.'),
        kt('Inheritance','A subclass (child class) automatically has all the attributes and methods of its superclass (parent class), and can add new ones or override existing ones. Promotes code reuse — common behaviour defined once in the parent.'),
        kt('Polymorphism','The ability for different classes to use the same method name. A <code>speak()</code> method on Animal, Dog and Cat all work differently but are called identically. Enables writing generic code that works with multiple object types.'),
        w('OOP in Python — Full Example','class Animal:\n    def __init__(self, name, age):\n        self.__name = name     # Private (encapsulated)\n        self.__age  = age\n\n    def get_name(self):         # Getter\n        return self.__name\n\n    def speak(self):            # Base method\n        return "..."\n\nclass Dog(Animal):              # Inherits from Animal\n    def __init__(self, name, age, breed):\n        super().__init__(name, age)   # Call parent constructor\n        self.__breed = breed\n\n    def speak(self):            # Override (polymorphism)\n        return f"{self.get_name()} says: Woof!"\n\nclass Cat(Animal):\n    def speak(self):            # Different implementation\n        return f"{self.get_name()} says: Meow!"\n\n# Polymorphism in action:\nanimals = [Dog("Rex", 3, "Lab"), Cat("Whiskers", 5)]\nfor a in animals:\n    print(a.speak())  # Calls correct version automatically'),
        tbl(['Concept','Definition','Why it matters'],
          [['Encapsulation','Private data + public methods','Protects data integrity; controls access'],
           ['Inheritance','Child class gets parent\'s attributes/methods','Code reuse; reduces duplication'],
           ['Polymorphism','Same method name, different behaviour','Generic code; extensibility'],
           ['Abstraction','Hide implementation details','Simpler interface; separation of concerns']]),
        tip('Exam answer for "explain polymorphism with an example": "Polymorphism allows different classes to implement the same method name differently. For example, Animal, Dog and Cat can all have a speak() method, but Dog returns \'Woof\' and Cat returns \'Meow\'. Code that calls speak() on any Animal object will automatically call the correct version."'),
        err('Do not confuse class and object. A class is a definition (like a recipe); an object is an instance (like the actual cake). You can create many objects from one class.'),
      ]
    },

    { id:'3.1.4', title:'Exception Handling',
      sections: [
        t('What is an Exception?','An <strong>exception</strong> is an error that occurs during program execution (a runtime error) that disrupts normal flow. Without exception handling, the program crashes and shows an error message. With exception handling, you can catch the error, show a friendly message, and continue running.'),
        kt('try...except block','The try block contains code that might raise an exception. If an exception occurs, execution jumps immediately to the matching except block. If no exception occurs, the except block is skipped.'),
        w('Exception Handling Patterns','# Basic try/except\ntry:\n    age = int(input("Enter age: "))\n    print(f"Age: {age}")\nexcept ValueError:\n    print("Please enter a whole number")\n\n# Multiple exception types\ntry:\n    result = 10 / int(input("Divisor: "))\nexcept ValueError:\n    print("Not a valid number")\nexcept ZeroDivisionError:\n    print("Cannot divide by zero")\n\n# finally — always runs\ntry:\n    f = open("data.txt")\n    data = f.read()\nexcept FileNotFoundError:\n    print("File not found")\nfinally:\n    f.close()   # Always closes file, even on error\n\n# else — runs only if no exception\ntry:\n    x = int(input())\nexcept ValueError:\n    print("Invalid")\nelse:\n    print(f"Valid number: {x}")   # Only runs if no error'),
        tbl(['Clause','When it runs'],
          [['try','Always — contains code that might fail'],
           ['except','Only if the try block raises a matching exception'],
           ['else','Only if the try block completed WITHOUT raising an exception'],
           ['finally','Always — whether or not an exception occurred; used for cleanup']]),
        tip('Exception handling makes programs <strong>robust</strong> — they do not crash when given unexpected input. This is a key component of defensive programming.'),
        err('"Catching" an exception with a bare except: (no type) catches ALL exceptions including system ones like KeyboardInterrupt. Always catch specific exception types where possible.'),
      ]
    },

    { id:'3.1.5', title:'File Handling',
      sections: [
        t('Why File Handling?','Data stored in variables is lost when a program ends. Files allow data to <strong>persist</strong> between runs. Programs can read data from files (configuration, saved games, databases) and write data back (logs, user data, results).'),
        kt('Text file','A file where data is stored as readable characters. Each line ends with a newline character. Simplest form — can be opened in a text editor. Examples: .txt, .csv, .json files.'),
        w('File Operations in Python','# WRITING to a file (creates or overwrites)\nwith open("scores.txt", "w") as f:\n    f.write("Alice,92\\n")\n    f.write("Bob,78\\n")\n# File automatically closed when \'with\' block ends\n\n# APPENDING (adds to end, does not overwrite)\nwith open("scores.txt", "a") as f:\n    f.write("Charlie,85\\n")\n\n# READING all lines\nwith open("scores.txt", "r") as f:\n    for line in f:\n        name, score = line.strip().split(",")\n        print(f"{name}: {score}")\n\n# READ entire file as string\nwith open("scores.txt", "r") as f:\n    content = f.read()\n\n# READ into a list of lines\nwith open("scores.txt", "r") as f:\n    lines = f.readlines()'),
        tbl(['Mode','Meaning','Behaviour if file exists'],
          [['"r"','Read only','Error if file not found'],
           ['"w"','Write (overwrite)','Creates new or clears existing'],
           ['"a"','Append','Adds to end, creates if needed'],
           ['"r+"','Read and write','Error if file not found']]),
        tip('Always use the <code>with open(...) as f:</code> pattern. It automatically closes the file even if an exception occurs, preventing resource leaks.'),
      ]
    },
  ]},

  // ── 3.2 PROBLEM SOLVING & THEORY OF COMPUTATION ──────────────────
  { id:'aqa-2', number:'3.2', name:'Problem Solving & Theory of Computation', specPoints: [

    { id:'3.2.1', title:'Abstraction and Decomposition',
      sections: [
        t('Computational Thinking','Computational thinking is the process of formulating a problem in a way that a computer can solve it. The key techniques are: <strong>abstraction</strong>, <strong>decomposition</strong>, <strong>algorithmic thinking</strong> and <strong>pattern recognition</strong>.'),
        kt('Abstraction','Removing unnecessary detail from a problem, focusing only on what is relevant to the solution. A map is an abstraction — it omits buildings but preserves roads. OOP uses abstraction through class interfaces. Crucially, choosing the right level of abstraction is a key design skill.'),
        kt('Decomposition','Breaking a complex problem into smaller, more manageable sub-problems. Each sub-problem can be solved independently. The solutions are then combined. This enables parallel development, easier testing and clearer code structure.'),
        kt('Pattern recognition','Identifying similarities between problems or between parts of the same problem. Recognising that a new problem is similar to one already solved allows reuse of existing algorithms and solutions.'),
        w('Decomposing a Student Grade System','PROBLEM: Create a system to track student exam grades\n\nDecomposition:\n1. Student management\n   1.1 Add student\n   1.2 Remove student\n   1.3 Look up student\n\n2. Grade entry\n   2.1 Record exam result\n   2.2 Validate grade (0-100)\n   2.3 Store with timestamp\n\n3. Analytics\n   3.1 Calculate class average\n   3.2 Find highest/lowest\n   3.3 Generate grade distribution\n\n4. Output\n   4.1 Display individual report\n   4.2 Export class summary\n\nEach sub-problem can now be coded and tested separately.'),
        tip('In an exam question asking you to apply decomposition, draw a hierarchy or numbered list. Show at least two levels of decomposition. Full marks require showing that each sub-problem is small enough to code as a single module or function.'),
      ]
    },

    { id:'3.2.2', title:'Finite State Machines (FSMs)',
      examTip:'Always include: circle for state, arrow for transition, label with input symbol, double circle for accept state, incoming arrow for start state.',
      sections: [
        t('What is an FSM?','A <strong>Finite State Machine</strong> (also called Finite State Automaton, FSA) is a mathematical model of computation. It consists of: a finite set of <strong>states</strong>, an <strong>alphabet</strong> of input symbols, a <strong>transition function</strong> mapping (state, input) → next state, a <strong>start state</strong> and one or more <strong>accept/final states</strong>.'),
        t('How an FSM Works','The machine starts in the start state. For each symbol in the input string, it follows the transition from the current state. If after consuming all input the machine is in an accept state, the string is <strong>accepted</strong>; otherwise it is <strong>rejected</strong>.'),
        tbl(['Component','Notation','Description'],
          [['State','Circle','A configuration of the machine'],
           ['Start state','Arrow → circle','Where the machine begins'],
           ['Accept state','Double circle','Indicates the string is accepted if machine ends here'],
           ['Transition','Labelled arrow','Moves between states when a symbol is read'],
           ['Alphabet','Σ (sigma)','The set of valid input symbols']]),
        w('FSM Example: Accept strings of even number of 1s','States: q0 (start, accept), q1 (reject)\nAlphabet: {0, 1}\n\nTransition table:\n| State | Input 0 | Input 1 |\n|-------|---------|----------|\n| q0    | q0      | q1       |\n| q1    | q1      | q0       |\n\nTest "1011":\n  q0 →(1)→ q1 →(0)→ q1 →(1)→ q0 →(1)→ q1\n  Ends in q1 (not accept state) → REJECTED\n  (Has 3 ones — odd number)\n\nTest "1100":\n  q0 →(1)→ q1 →(1)→ q0 →(0)→ q0 →(0)→ q0\n  Ends in q0 (accept state) → ACCEPTED\n  (Has 2 ones — even number)'),
        kt('Mealy machine','An FSM with output — the output depends on both the current state AND the input symbol. Used to model systems that produce output (e.g. vending machines).'),
        kt('Moore machine','An FSM with output — the output depends only on the current state (not the input). Output is associated with states, not transitions.'),
        tip('When drawing an FSM in an exam: (1) identify how many states are needed, (2) draw start arrow, (3) draw accept state(s) with double circle, (4) label every arrow with the input symbol that causes that transition, (5) every state must have a defined transition for every symbol in the alphabet.'),
        err('A common error: forgetting to draw transitions for all symbols from all states. An FSM must have a complete transition function — a transition for every (state, symbol) pair.'),
      ]
    },

    { id:'3.2.3', title:'Turing Machines',
      examTip:'AQA uses Turing machines to illustrate computability — focus on what they represent theoretically, not just how they work mechanically.',
      sections: [
        t('The Turing Machine Concept','Proposed by Alan Turing in 1936, a Turing machine is a mathematical model of computation. It consists of: an <strong>infinite tape</strong> divided into cells (each holds one symbol), a <strong>read/write head</strong> that can move left or right, a <strong>finite set of states</strong>, and a <strong>transition function</strong> defining the next action. Despite its simplicity, any computation that can be done on any computer can be done on a Turing machine.'),
        kt('Church-Turing Thesis','The hypothesis that any function that is computable (by any algorithm on any computer) can be computed by a Turing machine. This defines the limits of what is computably possible — if a Turing machine cannot compute something, no computer can.'),
        t('How a Turing Machine Operates','At each step: (1) read the symbol under the head, (2) look up the transition function for (current state, symbol), (3) write a symbol (may be the same), (4) move head left or right, (5) change to a new state. The machine halts when it enters a designated halt state.'),
        w('Turing Machine for Recognising 0ⁿ1ⁿ','Recognises strings with n zeros followed by n ones (e.g. 0011, 000111)\n\nStrategy:\n- Mark a 0 with X, scan right to find a 1, mark it with Y\n- Return left, find next 0, mark it X, find next 1, mark Y\n- Repeat until all 0s matched with 1s\n- Accept if only X and Y remain\n\nStates: q0 (scan right for 1), q1 (scan left for 0),\n        q2 (check done), qaccept, qreject\n\nKey transitions:\n  (q0, 0) → (q0, 0, R)   [keep scanning right]\n  (q0, X) → (q0, X, R)   [skip marked symbols]\n  (q0, 1) → (q1, Y, L)   [found a 1, mark it]\n  (q1, 0) → (q1, 0, L)   [scan left]\n  (q1, X) → (q0, X, R)   [found leftmost 0]'),
        kt('Universal Turing Machine','A Turing machine that can simulate any other Turing machine. It reads the description of a TM and its input from the tape, and simulates that TM. This is the theoretical basis for the stored-program computer — a machine that can run any program.'),
        tip('The key exam point about Turing machines is not how they work mechanically but what they represent: (1) they define the boundary between computable and uncomputable problems, (2) the UTM provides the theoretical basis for general-purpose computers.'),
      ]
    },

    { id:'3.2.4', title:'Regular Expressions',
      sections: [
        t('What are Regular Expressions?','A <strong>regular expression</strong> (regex) is a notation for describing patterns in strings. They are used for: validating input formats (email, phone numbers), searching text, and defining the lexical structure of programming languages. Regular expressions are equivalent to finite state machines — every regex corresponds to an FSM.'),
        tbl(['Symbol','Meaning','Example','Matches'],
          [['a','Literal character a','cat','cat'],
           ['|','OR (alternation)','cat|dog','cat or dog'],
           ['*','Zero or more repetitions','ab*','a, ab, abb, abbb...'],
           ['+','One or more repetitions','ab+','ab, abb, abbb... (not a)'],
           ['?','Zero or one (optional)','ab?','a or ab'],
           ['.','Any single character','a.c','abc, a1c, a_c...'],
           ['^','Start of string','^Hello','String starts with Hello'],
           ['$','End of string','end$','String ends with end'],
           ['[abc]','Character class','[aeiou]','Any vowel'],
           ['[a-z]','Character range','[a-z]','Any lowercase letter'],
           ['[^abc]','NOT these chars','[^0-9]','Any non-digit'],
           ['(ab)','Grouping','(ab)+','ab, abab, ababab...']]),
        w('Regular Expressions: Exam Examples','# Email format (simplified)\n[a-zA-Z0-9]+@[a-zA-Z]+\\.[a-zA-Z]{2,4}\n\n# UK postcode\n[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}\n\n# Binary strings of even length (divisible by 2)\n(00|01|10|11)*\n\n# Strings starting with a and ending with b\na.*b\n\n# Integers (one or more digits)\n[0-9]+\nor  \\d+\n\n# Strings over {a,b} with at least one a\n[ab]*a[ab]*'),
        kt('Regular language','A language (set of strings) that can be described by a regular expression and recognised by an FSM. Regular languages are the simplest class in the Chomsky hierarchy of formal languages.'),
        tip('To write a regex for an unknown pattern: (1) describe the pattern in words first, (2) translate each part to regex symbols, (3) test with valid and invalid examples.'),
      ]
    },

    { id:'3.2.5', title:'The Halting Problem & Decidability',
      sections: [
        t('The Halting Problem','Proposed by Turing in 1936: given any program P and input I, is there an algorithm that can determine whether P will eventually halt (stop) or run forever? Turing proved the answer is <strong>NO</strong> — no such general algorithm can exist. This is one of the most profound results in computer science.'),
        t('Proof by Contradiction (Sketch)','Assume a halting algorithm H(P, I) exists. Construct a program D that takes a program as input: if H says P(P) halts, D loops forever; if H says P(P) loops, D halts. Now run D on D: if H says D(D) halts, D loops — contradiction. If H says D(D) loops, D halts — contradiction. Therefore H cannot exist.'),
        kt('Decidable problem','A problem for which an algorithm always terminates with a correct YES or NO answer for every valid input. Example: "Is this number prime?" is decidable.'),
        kt('Undecidable problem','A problem for which no algorithm can always give a correct answer. The Halting Problem is undecidable. An algorithm for it either fails on some inputs, runs forever, or gives wrong answers.'),
        kt('Semi-decidable','A problem where an algorithm can confirm YES if the answer is yes, but may run forever if the answer is no. The Halting Problem is semi-decidable (a universal TM will halt on inputs that halt).'),
        tbl(['Type','Definition','Example'],
          [['Decidable','Algorithm always halts with correct answer','Is n prime? Is x in this sorted list?'],
           ['Undecidable','No algorithm exists for all inputs','Does this program halt? Is this program correct?'],
           ['Semi-decidable','Halts and says yes if yes; may loop if no','Halting problem (one direction)']]),
        tip('The exam point: "Why is the Halting Problem significant?" Answer: it proves there are problems that computers fundamentally cannot solve — no matter how powerful the hardware or how clever the software. There are inherent limits to computation.'),
      ]
    },

    { id:'3.2.6', title:'Tractable & Intractable Problems',
      sections: [
        t('Big O Notation Recap','Big O describes how an algorithm\'s runtime (or memory) grows as the input size n increases. It ignores constants and lower-order terms — only the dominant term matters.'),
        tbl(['Notation','Name','Example','Practical for n=1,000,000'],
          [['O(1)','Constant','Array index lookup','Instant'],
           ['O(log n)','Logarithmic','Binary search','~20 operations'],
           ['O(n)','Linear','Linear search','1,000,000 operations'],
           ['O(n log n)','Linearithmic','Merge sort','~20,000,000'],
           ['O(n²)','Quadratic','Bubble sort','10¹² — very slow'],
           ['O(2ⁿ)','Exponential','Brute-force TSP','Astronomically slow'],
           ['O(n!)','Factorial','All permutations','Impossible in practice']]),
        kt('Tractable problem','A problem for which a polynomial-time algorithm exists — O(nᵏ) for some constant k. Practical for large inputs. Examples: sorting (O(n log n)), shortest path in a graph (Dijkstra\'s: O(n²) or O(n log n)).'),
        kt('Intractable problem','A problem for which no polynomial-time algorithm is known. The best known algorithms are exponential or worse, making them impractical for large inputs. Example: Travelling Salesman Problem (TSP) — finding the shortest route visiting n cities has O(n!) brute-force complexity.'),
        kt('NP and NP-Complete','<strong>P</strong>: problems solvable in polynomial time. <strong>NP</strong>: problems where a solution can be <em>verified</em> in polynomial time, even if finding it takes longer. <strong>NP-Complete</strong>: the hardest problems in NP; if any NP-Complete problem has a polynomial solution, all do (the P=NP question).'),
        t('Heuristic Approaches','For intractable problems, <strong>heuristics</strong> find good-but-not-necessarily-optimal solutions quickly. Example: the nearest-neighbour heuristic for TSP finds a short route (but not guaranteed shortest) in O(n²). Used in route planning, scheduling, AI game playing.'),
        w('TSP Complexity','Travelling Salesman Problem:\n  Find the shortest route visiting n cities exactly once\n\nBrute force: check all permutations\n  n cities → (n-1)! routes to check\n  10 cities → 362,880 routes\n  20 cities → 1.2 × 10¹⁷ routes (at 1B checks/sec: 4 years)\n  30 cities → effectively impossible\n\nNearest-neighbour heuristic O(n²):\n  - Start at city A\n  - Always go to nearest unvisited city\n  - 30 cities → 900 steps (instant)\n  - Result: a good (not perfect) route\n\nTrade-off: optimality vs practicality'),
        tip('"State why the TSP is intractable." Answer: "The only known exact algorithms for TSP have factorial or exponential time complexity. As n increases, the computation time grows so rapidly that exact solutions are only feasible for small values of n. For large n, heuristic algorithms that find near-optimal (but not guaranteed optimal) solutions must be used instead."'),
      ]
    },
  ]},

  // ── 3.3 DATA REPRESENTATION ─────────────────────────────────────
  { id:'aqa-3', number:'3.3', name:'Data Representation', specPoints: [

    { id:'3.3.1', title:'Number Systems',
      sections: [
        t('Binary, Denary and Hexadecimal','Computers use binary (base 2) internally. Denary (base 10) is our everyday number system. Hexadecimal (base 16) is used as compact binary shorthand. All three represent the same values — they are different notations.'),
        w('Conversion Between Bases','Binary → Denary: 10110101\n  128+32+16+4+1 = 181\n\nDenary → Binary: 181\n  181÷2=90 r1, 90÷2=45 r0, 45÷2=22 r1, 22÷2=11 r0\n  11÷2=5 r1, 5÷2=2 r1, 2÷2=1 r0, 1÷2=0 r1\n  Read remainders upward: 10110101 ✓\n\nBinary → Hex: group nibbles\n  10110101 → 1011|0101 → B|5 → B5\n\nHex → Binary: expand each digit\n  B5 → 1011|0101 → 10110101'),
        tbl(['Number','Binary','Hex','Denary'],
          [['0','0000','0','0'],['5','0101','5','5'],['10','1010','A','10'],
           ['15','1111','F','15'],['16','0001 0000','10','16'],['255','1111 1111','FF','255']]),
      ]
    },

    { id:'3.3.2', title:"Two's Complement & Binary Arithmetic",
      examTip:"Two's complement allows CPUs to perform subtraction using the same circuit as addition — a key design insight.",
      sections: [
        t("Two's Complement","The standard way computers represent signed integers. For an n-bit number, the most significant bit (MSB) has a place value of <strong>−2^(n-1)</strong> instead of +2^(n-1). This allows both positive and negative numbers and lets subtraction be done as addition."),
        w("Converting to Two's Complement","To represent -5 in 8-bit two's complement:\n  Step 1: Write +5 in binary:  00000101\n  Step 2: Invert all bits:      11111010\n  Step 3: Add 1:                11111011\n  \n  Verify: -128+64+32+16+8+2+1 = -128+123 = -5 ✓\n\nRange for 8-bit two's complement:\n  Most negative: 10000000 = -128\n  Most positive: 01111111 = +127\n  Range: -128 to +127 (256 values)\n\nFor n bits: range = -2^(n-1) to +2^(n-1)-1"),
        w("Subtraction via Addition","8 - 3 = 8 + (-3)\n  +8 = 00001000\n  -3 = 11111101  (two's complement of 3)\n\n    00001000\n  + 11111101\n  ──────────\n  100000101  (9-bit result)\n\n  Discard the overflow bit (carry out of MSB)\n  Result: 00000101 = 5 ✓\n\nThis is why CPUs only need one adder circuit."),
        tbl(['n bits','Range','Formula'],
          [['4','−8 to +7','−2³ to 2³−1'],
           ['8','−128 to +127','−2⁷ to 2⁷−1'],
           ['16','−32,768 to +32,767','−2¹⁵ to 2¹⁵−1'],
           ['32','−2,147,483,648 to +2,147,483,647','−2³¹ to 2³¹−1']]),
        tip("Overflow in two's complement: if you add two positive numbers and get a negative result (or two negatives and get positive), overflow has occurred. In 8-bit: 127 + 1 = 10000000 = -128 (overflow)."),
      ]
    },

    { id:'3.3.3', title:'Floating-Point Representation',
      examTip:'Normalisation is the key A Level concept — know what it is, why it is done, and what underflow means.',
      sections: [
        t('Why Floating-Point?','Integers cannot represent very large numbers or fractions. Floating-point notation (like scientific notation) allows a wide range of values. A floating-point number has two parts: a <strong>mantissa</strong> (the significant digits) and an <strong>exponent</strong> (the power of the base).'),
        t('Binary Floating-Point Format','In binary floating-point: value = mantissa × 2^exponent. Both mantissa and exponent are stored as binary signed integers. A common format: 8-bit mantissa + 4-bit exponent (simplified; real-world uses IEEE 754 with 32 or 64 bits).'),
        w('Floating-Point Examples','Format: 8-bit mantissa (two\'s complement) | 4-bit exponent\n\nExample: 0.10110000 | 0011\n  Mantissa: 0.10110000₂ = 0.6875\n  Exponent: 0011₂ = 3\n  Value: 0.6875 × 2³ = 5.5\n\nExample: Represent 22.5\n  22.5 = 10110.1 in binary\n  Normalise: 0.10110100 × 2^5\n  Mantissa: 0.10110100\n  Exponent: 0101 (=5)\n  Stored: 01011010 | 0101'),
        kt('Normalised form','A floating-point number is normalised when the mantissa is in the range [0.5, 1.0) for positive numbers (i.e. the first bit after the binary point is 1). This ensures maximum precision — no leading zeros waste bits. For positive normalised: mantissa starts 0.1... For negative: mantissa starts 1.0...'),
        kt('Underflow','Occurs when a number is too small (close to zero) to be represented. The exponent would need to be smaller than the minimum value storable, so the result is rounded to zero. Different from overflow (too large).'),
        tbl(['Feature','More mantissa bits','More exponent bits'],
          [['Effect on precision','Higher — more significant digits','No effect on precision'],
           ['Effect on range','Smaller range for exponent','Larger range of representable magnitudes'],
           ['Trade-off','Lose range','Lose precision']]),
        tip('"Explain normalisation." Answer: "Normalisation ensures the mantissa is in its standard form (first bit after the binary point is 1 for positive, 0 for negative). This maximises precision because no bits are wasted on leading zeros, allowing the most significant digits to be stored."'),
        err('Underflow ≠ overflow. Underflow: number too small (too close to zero). Overflow: number too large (magnitude exceeds maximum). Both are important — ask "which direction" in the exam.'),
      ]
    },

    { id:'3.3.4', title:'Character Encoding & Compression',
      sections: [
        t('ASCII and Unicode','<strong>ASCII</strong>: 7-bit encoding, 128 characters. Covers English letters, digits, punctuation. Extended ASCII uses 8 bits (256 characters) for accented letters. <strong>Unicode</strong>: variable-length encoding covering over 1.1 million characters. UTF-8 uses 1–4 bytes: the first 128 code points are identical to ASCII. Essential for international software.'),
        kt('Huffman coding','A lossless compression algorithm. Symbols that occur most frequently are given shorter bit codes; rare symbols get longer codes. Results in shorter average code length than fixed-length encoding. Used in ZIP, JPEG (for the lossless parts), DEFLATE.'),
        w('Building a Huffman Tree','Characters and frequencies: A:5, B:2, C:3, D:1\n\n1. Create leaf nodes, ordered by frequency:\n   D(1) B(2) C(3) A(5)\n\n2. Combine two lowest: D+B → node(3)\n   node(3) C(3) A(5)\n\n3. Combine two lowest: node(3)+C(3) → node(6)\n   A(5) node(6)\n\n4. Combine: A+node(6) → root(11)\n\nAssign 0=left, 1=right:\n  A → 0 (1 bit)\n  C → 10 (2 bits)\n  B → 110 (3 bits)\n  D → 111 (3 bits)\n\nFixed length (2 bits each): 11 chars × 2 = 22 bits\nHuffman: 5×1+3×2+2×3+1×3 = 5+6+6+3 = 20 bits (9% saving)\n\nLarger frequency differences → greater compression'),
        kt('Run-length encoding (RLE)','Replaces consecutive repeated values with a (count, value) pair. Best for data with long runs of identical values (bitmap images with solid areas). Worst case: every symbol different → encoded file is larger than original.'),
        tbl(['Compression type','Data loss','Can restore original?','Use cases'],
          [['Lossless (Huffman, RLE)','None','Yes — exactly','Text, executables, medical images, archiving'],
           ['Lossy (JPEG, MP3)','Some detail removed','No — permanently lost','Photos, music, video (where small quality loss acceptable)']]),
      ]
    },
  ]},

  // ── 3.4 SYSTEMS SOFTWARE ─────────────────────────────────────────
  { id:'aqa-4', number:'3.4', name:'Systems Software', specPoints: [

    { id:'3.4.1', title:'Operating Systems — Types & Functions',
      examTip:'The five OS functions come up every year. Learn the acronym PMIFS: Process, Memory, I/O, File, Security management.',
      sections: [
        t('What is an Operating System?','The OS is system software that acts as an interface between user programs and hardware. Without the OS, every application would need to include its own drivers and manage hardware directly. The OS abstracts hardware complexity and provides services to applications via system calls.'),
        tbl(['OS Type','Description','Examples'],
          [['Batch','Jobs queued and run without user interaction; output collected later','Early mainframes, payroll processing'],
           ['Multi-tasking / Time-sharing','Multiple processes sharing CPU time; user appears to have full CPU','Windows, macOS, Linux'],
           ['Real-time (RTOS)','Guaranteed response within a hard time deadline; correctness depends on timing','Aircraft control, pacemakers, industrial robots'],
           ['Distributed','Processes spread across multiple networked machines; appear as one system','Hadoop cluster, supercomputers'],
           ['Embedded','Dedicated, minimal OS for a specific device','Washing machines, routers, smart TVs'],
           ['Network OS','Manages network resources; allows file/printer sharing over a network','Windows Server, Novell NetWare']]),
        tbl(['OS Function','What it does','Why needed'],
          [['Process management','Creates, schedules and terminates processes; handles multitasking','Multiple programs must share one CPU fairly and safely'],
           ['Memory management','Allocates RAM to processes; protects processes from each other; manages virtual memory','Prevents one program overwriting another; allows programs larger than RAM'],
           ['I/O management','Provides standard interface to hardware via device drivers','Hides hardware differences; allows programs to work with any printer/disk'],
           ['File management','Creates, deletes, reads, writes files; manages directories; permissions','Persistent, organised storage; multi-user access control'],
           ['Security management','Authentication, authorisation, access control','Prevents unauthorised access to data and resources']]),
        kt('System call','The mechanism by which a user program requests a service from the OS kernel. Examples: open(filename), read(fd, buffer), write(fd, data), fork(), exit(). System calls switch the CPU from user mode to kernel mode, execute the privileged OS routine, then return to user mode.'),
        tip('"Describe how an operating system manages multiple processes appearing to run simultaneously on a single-core CPU." Answer: "The OS scheduler rapidly switches the CPU between processes (context switching). Each process runs for a short time slice, then the CPU switches to the next. The OS saves the state (registers, PC) of each process before switching and restores it when the process resumes. This happens so fast (thousands of times per second) that processes appear to run simultaneously."'),
      ]
    },

    { id:'3.4.2', title:'Process Scheduling & Management',
      examTip:'Know at least three scheduling algorithms and their advantages/disadvantages.',
      sections: [
        kt('Process','A program in execution. Each process has: a process ID (PID), a state (new, ready, running, waiting, terminated), a program counter, register values, memory allocation, and open files. The OS process control block (PCB) stores this information.'),
        tbl(['Process State','Meaning','Transition to'],
          [['New','Being created','Ready (once admitted)'],
           ['Ready','Waiting for CPU time','Running (when scheduler selects it)'],
           ['Running','Currently executing on CPU','Ready (time slice expired) or Waiting (I/O needed) or Terminated (finished)'],
           ['Waiting / Blocked','Waiting for I/O or event','Ready (when I/O completes)'],
           ['Terminated','Finished; resources being freed','(end)']]),
        tbl(['Scheduling Algorithm','Method','Advantage','Disadvantage'],
          [['First Come First Served (FCFS)','Processes run in arrival order; non-preemptive','Simple','Convoy effect: short jobs wait for long ones'],
           ['Shortest Job First (SJF)','Shortest estimated burst time runs first','Optimal average wait time (non-preemptive)','Requires knowing burst time; starvation of long jobs'],
           ['Round Robin','Each process gets equal time slice (quantum); preemptive','Fair; responsive for interactive systems','More context switches; quantum choice critical'],
           ['Priority Scheduling','Highest priority runs first; can be preemptive','Important processes get CPU','Starvation of low-priority processes; aging solves this'],
           ['Multilevel Queue','Separate queues for different process types','Efficient for mixed workloads','Complex to configure']]),
        kt('Context switch','Saving the state (registers, PC, stack pointer) of the currently running process to its PCB and loading the saved state of the next process. Context switches have overhead — the CPU does no useful work during the switch itself. Frequent context switches reduce throughput.'),
        kt('Deadlock','A state where two or more processes are each waiting for a resource held by the other, and none can proceed. Necessary conditions (all four must hold): <strong>mutual exclusion</strong>, <strong>hold and wait</strong>, <strong>no preemption</strong>, <strong>circular wait</strong>. Prevention removes at least one condition.'),
        tip('"Explain the difference between a process and a thread." Answer: "A process is a complete, independent execution environment with its own memory space, file handles and resources. A thread is a unit of execution within a process — threads share the process\'s memory and resources but have their own stack and registers. Multiple threads in one process can communicate easily (shared memory) but a bug in one thread can corrupt another. Multiple processes are more isolated but communication requires inter-process communication (IPC)."'),
      ]
    },

    { id:'3.4.3', title:'Virtual Machines & Virtualisation',
      sections: [
        kt('Virtual machine (VM)','Software that emulates a complete computer system. A <strong>hypervisor</strong> (virtual machine monitor) runs on the host machine and manages multiple VMs. Each VM has its own OS, virtual CPU, memory and storage, all abstracted from the underlying hardware. Examples: VMware, VirtualBox, Hyper-V.'),
        tbl(['VM Benefit','Explanation'],
          [['Isolation','A crash or security breach in one VM cannot affect others'],
           ['Consolidation','Multiple VMs on one physical server — better hardware utilisation'],
           ['Snapshots','Save the VM state and roll back to it (useful for testing)'],
           ['Portability','A VM image can be moved to any compatible host'],
           ['Testing','Run multiple OS versions for compatibility testing without multiple machines'],
           ['Cloud computing','Cloud providers run thousands of VMs on shared infrastructure']]),
        kt('Containerisation','A lighter-weight alternative to VMs. Containers share the host OS kernel but have isolated user space (files, processes, networking). Much faster to start and uses less memory than VMs. Docker is the dominant container platform. Containers package an application with all its dependencies for consistent deployment across environments.'),
        t('Bytecode & the JVM','Java compiles source code to <strong>bytecode</strong> — an intermediate, machine-independent representation. The <strong>Java Virtual Machine</strong> (JVM) interprets or JIT-compiles bytecode at runtime on any platform. "Write once, run anywhere." Python uses a similar approach (.pyc bytecode). The VM provides a portable, sandboxed execution environment.'),
      ]
    },

    { id:'3.4.4', title:'Translation Software — Compilers, Interpreters & Assemblers',
      examTip:'Know the specific stages of compilation — a 4-mark question often asks for all four in order.',
      sections: [
        tbl(['Translator','Input','Output','Translation','Execution'],
          [['Assembler','Assembly language (.asm)','Machine code','One-to-one (mostly)','Directly by CPU'],
           ['Compiler','High-level source code','Machine code executable','Whole program at once','Direct (fast)'],
           ['Interpreter','High-level source code','(none — executes directly)','Line by line at runtime','Slow (re-translated each run)'],
           ['JIT Compiler','Bytecode','Machine code','Compiles hot paths at runtime','Near-compiled speed']]),
        tbl(['Compilation Stage','Description','Output'],
          [['Lexical analysis','Tokenise source code: remove whitespace/comments; group characters into tokens (keywords, identifiers, literals, operators)','Token stream'],
           ['Syntax analysis','Parse token stream against the grammar; build an Abstract Syntax Tree (AST); report syntax errors','Abstract Syntax Tree (AST)'],
           ['Semantic analysis','Check meaning: type checking; undeclared variables; scope; type inference; annotate AST','Annotated AST'],
           ['Intermediate code generation','Produce platform-independent intermediate representation (IR): three-address code, bytecode, or SSA form','Intermediate code (IR)'],
           ['Optimisation','Improve IR: remove dead code; loop unrolling; constant folding; inlining; strength reduction','Optimised IR'],
           ['Code generation','Translate IR to target machine code; register allocation; instruction selection','Executable machine code']]),
        tbl(['Feature','Compiler','Interpreter'],
          [['Execution speed','Fast (machine code runs directly)','Slow (re-translates each statement at runtime)'],
           ['Error reporting','All errors reported before execution','Errors found at runtime during execution'],
           ['Portability','Machine-code tied to one CPU type','Source runs on any platform with an interpreter'],
           ['Distribution','Distribute compiled binary (source hidden)','Must distribute source code (or bytecode)'],
           ['Development speed','Compile-edit-run cycle slower','Immediate feedback; good for scripting'],
           ['Examples','C, C++, Rust, Go','Python, JavaScript, Ruby, Bash']]),
        tip('"Describe the role of the lexical analyser." Answer: "The lexical analyser (lexer) reads the source code character by character and groups characters into tokens — the smallest meaningful units of the language. It removes whitespace and comments, identifies keywords (if, while), identifiers (variable names), literals (42, \'hello\'), and operators (+, =). It outputs a flat stream of tokens that the parser can then analyse."'),
      ]
    },

    { id:'3.4.5', title:'Memory Management — Paging, Segmentation & Virtual Memory',
      sections: [
        kt('Paging','Divides physical memory (RAM) into fixed-size blocks called <strong>frames</strong> and divides a program\'s virtual address space into same-size <strong>pages</strong>. The OS maintains a <strong>page table</strong> mapping each virtual page to a physical frame. Pages from different processes can be interleaved — no need for contiguous memory allocation.'),
        kt('Page fault','Occurs when a program accesses a virtual page not currently in RAM. The OS halts the process, loads the required page from disk (swap space), updates the page table, and resumes the process. Frequent page faults cause <strong>thrashing</strong> — the CPU spends more time swapping than executing.'),
        kt('Segmentation','Divides memory into logical segments (code, data, stack, heap) of variable size, matching the program\'s logical structure. Each segment has a base address and limit. Provides better logical protection (code segment is read-only) but suffers from external fragmentation.'),
        tbl(['Feature','Paging','Segmentation'],
          [['Block size','Fixed (e.g. 4 KB)','Variable (logical size of segment)'],
           ['Fragmentation','Internal (unused space within a page)','External (gaps between variable-size segments)'],
           ['Structure','No logical meaning to page divisions','Matches program structure (code, data, stack)'],
           ['Protection','Per-page permissions','Per-segment (code read-only; stack read/write)'],
           ['Used in','Most modern OSes','x86 (combined with paging)']]),
        tip('"Explain why virtual memory allows programs larger than physical RAM to run." Answer: "The OS divides the program into pages. Only the currently active pages need to be in RAM; the rest are stored on disk in swap space. As the program accesses different pages, the OS loads them from disk and removes unused pages. The program uses virtual addresses translated by the page table — it appears to have access to a large contiguous address space, even though only a fraction is in RAM at any time."'),
      ]
    },
  ]},

  // ── 3.5 ARCHITECTURE ──────────────────────────────────────────────
  { id:'aqa-5', number:'3.5', name:'Computer Organisation & Architecture', specPoints: [

    { id:'3.5.1', title:'FDE Cycle & Registers',
      sections: [
        t('The Fetch-Decode-Execute Cycle','Every instruction in every program is processed through this repeating cycle. Billions of cycles happen per second in a modern CPU.'),
        tbl(['Stage','Actions','Registers used'],
          [['Fetch','PC → MAR; memory[MAR] → MDR; MDR → CIR; PC ← PC+1','PC, MAR, MDR, CIR'],
           ['Decode','CU decodes instruction in CIR','CIR, CU'],
           ['Execute','ALU performs operation; result → ACC; or branch updates PC','ACC, ALU, MAR, MDR, PC']]),
        tbl(['Register','Full name','Purpose'],
          [['PC','Program Counter','Address of NEXT instruction to fetch'],
           ['MAR','Memory Address Register','Address to read/write from memory'],
           ['MDR','Memory Data Register','Data read from or to be written to memory'],
           ['CIR','Current Instruction Register','Instruction being decoded and executed'],
           ['ACC','Accumulator','Holds ALU calculation results']]),
        tip('For a 6-mark FDE cycle question, describe each stage with the register transfers. For each stage, name the register, state what data it holds, and describe what happens to it.'),
      ]
    },

    { id:'3.5.2', title:'CPU Performance & Architecture Styles',
      examTip:'CISC vs RISC is frequently asked — learn the key differences clearly.',
      sections: [
        t('Performance Factors','Three main factors: <strong>Clock speed</strong> (GHz) — cycles per second; more = faster. <strong>Number of cores</strong> — independent processors; allows parallel execution. <strong>Cache size</strong> — closer/faster memory; larger cache → fewer slow RAM accesses. Secondary factors: word length (bits processed per cycle), bus width (data transfer rate).'),
        t('CISC vs RISC','<strong>CISC</strong> (Complex Instruction Set Computer): many complex multi-cycle instructions; single instruction can perform multiple operations; hardware decodes complex instructions; x86 architecture (Intel/AMD). <strong>RISC</strong> (Reduced Instruction Set Computer): small set of simple single-cycle instructions; compiler generates more instructions; simpler hardware; ARM architecture (phones, Apple Silicon).'),
        tbl(['Feature','CISC','RISC'],
          [['Instruction count','Large, complex set','Small, simple set'],
           ['Cycles per instruction','Multiple (variable)','One (usually)'],
           ['Pipelining','Harder (variable length instructions)','Easier (uniform)'],
           ['Compiler complexity','Simpler compiler','More complex compiler'],
           ['Hardware complexity','More complex decoder','Simpler'],
           ['Memory access','Can access memory in many instructions','Load/store only'],
           ['Examples','x86 (Intel, AMD)','ARM, RISC-V, MIPS']]),
        kt('Pipelining','Overlapping multiple FDE cycles simultaneously. While instruction 3 is executing, instruction 4 is being decoded, and instruction 5 is being fetched. Increases throughput (instructions completed per second) without increasing clock speed. Hazards (data, control, structural) can disrupt the pipeline.'),
        kt('GPU','Graphics Processing Unit — specialised processor with thousands of simple cores optimised for parallel operations. GPUs excel at performing the same operation on many data elements simultaneously (SIMD). Used for graphics rendering, machine learning, scientific computing.'),
        tip('"Explain why GPUs are better than CPUs for training neural networks." Answer: "Neural network training requires the same mathematical operations (matrix multiplication) applied to millions of data points simultaneously. A GPU has thousands of cores that can perform these parallel operations concurrently, whereas a CPU has a few powerful cores better suited to sequential tasks."'),
      ]
    },
  ]},

  // ── 3.6 COMMUNICATION & NETWORKING ──────────────────────────────
  { id:'aqa-6', number:'3.6', name:'Communication & Networking', specPoints: [

    { id:'3.6.1', title:'TCP/IP Model & Protocols',
      sections: [
        t('The TCP/IP Four-Layer Model','The TCP/IP model describes how data is sent across networks. Data is encapsulated as it travels down the layers on the sender side, and de-encapsulated as it goes up on the receiver side.'),
        tbl(['Layer','Role','Key protocols'],
          [['Application','User-facing services','HTTP, HTTPS, FTP, SMTP, DNS, SSH'],
           ['Transport','End-to-end delivery, error checking, ports','TCP, UDP'],
           ['Internet','Logical addressing and routing','IPv4, IPv6, ICMP'],
           ['Link (Network access)','Physical transmission on local link','Ethernet, Wi-Fi, ARP']]),
        kt('TCP vs UDP','<strong>TCP</strong>: connection-oriented, reliable, ordered, error-checked, flow-controlled. Uses a three-way handshake (SYN, SYN-ACK, ACK). Slower but guaranteed delivery. Used for: web, email, file transfer. <strong>UDP</strong>: connectionless, unreliable, no ordering guarantee, minimal overhead. Fast but no delivery guarantee. Used for: streaming, DNS, VoIP, online gaming.'),
        tbl(['Feature','TCP','UDP'],
          [['Connection','Established before data (3-way handshake)','None — sends directly'],
           ['Reliability','Guaranteed delivery and ordering','No guarantees'],
           ['Error checking','Yes — retransmits lost packets','Minimal'],
           ['Speed','Slower (overhead)','Faster'],
           ['Use cases','HTTP, email, file transfer','DNS, streaming, gaming, VoIP']]),
        tip('"Why does video streaming use UDP rather than TCP?" Answer: "UDP has lower overhead and no retransmission of lost packets. In streaming, a slightly degraded video frame is preferable to stopping playback to wait for a retransmitted packet, which would cause more disruptive buffering. The real-time nature of streaming makes delivery speed more important than perfect reliability."'),
      ]
    },

    { id:'3.6.2', title:'Routing & Security',
      sections: [
        kt('Routing algorithm','An algorithm used by routers to determine the best path for packets through a network. Two main approaches: <strong>distance-vector</strong> (each router knows distance to neighbours, shares table with neighbours — simple but slow convergence) and <strong>link-state</strong> (each router knows entire network topology, calculates shortest paths — faster convergence, more complex).'),
        kt('Public key cryptography','Uses two mathematically linked keys: a <strong>public key</strong> (shared openly) and a <strong>private key</strong> (kept secret). Data encrypted with the public key can only be decrypted by the private key. Used for: secure key exchange (HTTPS), digital signatures.'),
        w('HTTPS/TLS Handshake','1. Client → Server: "Hello, I want to connect securely"\n2. Server → Client: sends digital certificate (contains public key)\n3. Client: verifies certificate with Certificate Authority (CA)\n4. Client: generates random session key, encrypts with server\'s public key\n5. Server: decrypts session key with private key\n6. Both now share the session key — use fast symmetric encryption\n\nWhy two stages?\n  Asymmetric (RSA): secure key exchange but slow\n  Symmetric (AES): fast but same key needed by both sides\n  Solution: use RSA to securely share an AES session key'),
        kt('Digital signature','Created by encrypting a hash of the message with the <strong>sender\'s private key</strong>. Anyone can verify using the sender\'s public key. Proves authenticity (only the owner has the private key) and integrity (hash detects tampering).'),
        tbl(['Concept','Key used','Purpose'],
          [['Encryption (sending)','Recipient\'s public key','Only recipient can decrypt (privacy)'],
           ['Decryption (receiving)','Own private key','Decrypt message sent to you'],
           ['Digital signature (signing)','Own private key','Prove message is from you'],
           ['Signature verification','Sender\'s public key','Verify message is authentic and unchanged']]),
        tip('"Explain how a digital certificate proves a website\'s identity." Answer: "A digital certificate is issued by a trusted Certificate Authority (CA) and contains the website\'s public key and identity details. The CA signs the certificate with their private key. Browsers verify the signature using the CA\'s public key (built into the browser), confirming the website is who it claims to be and that the public key belongs to them."'),
      ]
    },
  ]},

  // ── 3.7 DATABASES ─────────────────────────────────────────────────
  { id:'aqa-7', number:'3.7', name:'Fundamentals of Databases', specPoints: [

    { id:'3.7.1', title:'Relational Databases & Normalisation',
      examTip:'Normalisation to 3NF is a classic exam question — always justify each step with the dependency removed.',
      sections: [
        kt('First Normal Form (1NF)','Each attribute contains only atomic (indivisible) values — no repeating groups or multi-valued attributes. Each row is unique (has a primary key).'),
        kt('Second Normal Form (2NF)','Must be in 1NF. Every non-key attribute is <strong>fully functionally dependent</strong> on the entire primary key (not just part of it). Only relevant for tables with composite primary keys — if PK is single-attribute, 2NF is automatically satisfied.'),
        kt('Third Normal Form (3NF)','Must be in 2NF. There are <strong>no transitive dependencies</strong> — non-key attributes do not depend on other non-key attributes. Every non-key attribute depends only on the primary key.'),
        w('Normalisation Worked Example','UNNORMALISED:\nORDER(OrderID, CustomerID, CustomerName, CustomerEmail,\n      ProductID, ProductName, ProductPrice, Quantity)\n\nISSUES:\n  CustomerName depends on CustomerID (not full PK)\n  ProductName/Price depend on ProductID (not full PK)\n  CustomerEmail depends on CustomerID (transitive)\n\n1NF: Already atomic, add OrderID as PK\n  ORDER(OrderID, CustomerID, CustomerName, CustomerEmail,\n        ProductID, ProductName, ProductPrice, Quantity)\n\n2NF: Remove partial dependencies:\n  CUSTOMER(CustomerID*, CustomerName, CustomerEmail)\n  PRODUCT(ProductID*, ProductName, ProductPrice)\n  ORDER_ITEM(OrderID*, ProductID*, Quantity)\n  ORDER(OrderID*, CustomerID→CUSTOMER)\n\n3NF: Remove transitive dependencies:\n  (CustomerEmail depends on CustomerID, which is already in CUSTOMER)\n  → Already in 3NF after 2NF in this example\n\nResult: 4 tables, each with only direct dependencies on PK'),
        tbl(['Normal Form','Removes','Condition'],
          [['1NF','Repeating groups, non-atomic values','Atomic values; unique rows'],
           ['2NF','Partial dependencies','No attribute depends on PART of composite PK'],
           ['3NF','Transitive dependencies','No non-key attribute depends on another non-key attribute']]),
        tip('Normalisation exam strategy: (1) Identify all functional dependencies, (2) Find the primary key, (3) Check each non-key attribute — what does it depend on? (4) Move any attribute that depends on non-primary-key attributes to a new table with that attribute as the foreign key.'),
      ]
    },

    { id:'3.7.2', title:'SQL & ACID Properties',
      sections: [
        w('Advanced SQL','-- Aggregate functions\nSELECT AVG(score), MAX(score), COUNT(*)\nFROM results\nWHERE subject = "CS";\n\n-- GROUP BY with HAVING\nSELECT subject, AVG(score) AS avg_score\nFROM results\nGROUP BY subject\nHAVING AVG(score) > 70\nORDER BY avg_score DESC;\n\n-- JOIN (combine tables)\nSELECT s.name, r.subject, r.score\nFROM students s\nJOIN results r ON s.studentID = r.studentID\nWHERE r.score >= 80;\n\n-- Subquery\nSELECT name FROM students\nWHERE studentID IN (\n    SELECT studentID FROM results\n    WHERE score = (SELECT MAX(score) FROM results)\n);'),
        kt('ACID properties','Properties that guarantee database transactions are processed reliably. <strong>A</strong>tomicity: a transaction is all-or-nothing — if any part fails, the entire transaction is rolled back. <strong>C</strong>onsistency: a transaction brings the database from one valid state to another. <strong>I</strong>solation: concurrent transactions do not interfere with each other. <strong>D</strong>urability: once committed, a transaction persists even if the system crashes.'),
        tbl(['Property','Meaning','Example'],
          [['Atomicity','All or nothing','Bank transfer: debit AND credit must both succeed or both fail'],
           ['Consistency','Valid state → valid state','Cannot withdraw more than balance (constraint enforced)'],
           ['Isolation','Concurrent transactions independent','Two transfers running simultaneously do not corrupt each other'],
           ['Durability','Committed = permanent','Power cut after COMMIT does not lose the transaction']]),
        kt('Record locking','A concurrency control mechanism. When a transaction reads or writes a record, it is locked, preventing other transactions from accessing it simultaneously. <strong>Deadlock</strong> occurs if two transactions each wait for the other to release a lock.'),
        tip('"Explain why ACID properties are important in a banking system." Answer: "Atomicity ensures that a transfer is either completed fully or not at all — money cannot disappear. Consistency ensures account balances never go below zero. Isolation prevents two simultaneous transactions on the same account corrupting each other. Durability ensures that once a transaction is confirmed, it is permanently recorded even after a system failure."'),
      ]
    },
  ]},

  // ── 3.8b OOP ─────────────────────────────────────────────────────
  { id:'aqa-10', number:'3.10', name:'Object-Oriented Programming', specPoints: [

    { id:'3.10.1', title:'OOP Concepts — Encapsulation, Inheritance & Polymorphism',
      examTip:'Be able to write a full class hierarchy in Python including __init__, @property, and method override.',
      sections: [
        tbl(['OOP Concept','Definition','Why it matters'],
          [['Encapsulation','Bundling data (attributes) and methods together; hiding internal state (private attributes); exposing controlled interface','Hides implementation detail; changes to internals don\'t break code using the class'],
           ['Inheritance','A subclass inherits attributes and methods from a parent class (IS-A relationship)','Code reuse; extend functionality without modifying parent'],
           ['Polymorphism','Different classes can respond to the same method call in different ways','Write code that works with any object sharing an interface; extensible designs'],
           ['Abstraction','Hiding complexity behind a simple interface; show only what\'s necessary','Users of a class don\'t need to know internal implementation'],
           ['Overriding','A subclass provides its own version of a method inherited from a parent','Specialise behaviour for a subclass without changing parent']]),
        w('Class Hierarchy in Python','class Animal:\n    def __init__(self, name, sound):\n        self._name = name      # Protected (convention: _)\n        self.__sound = sound   # Private (name-mangling: __)\n\n    @property\n    def name(self):\n        return self._name\n\n    def speak(self):\n        return f"{self._name} says {self._Animal__sound}"\n\n    def __str__(self):\n        return f"Animal({self._name})"\n\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name, "woof")\n        self._breed = breed\n\n    def speak(self):           # Override\n        return f"{self._name} barks! ({self._breed})"  # Polymorphism\n\n    def fetch(self, item):\n        return f"{self._name} fetches the {item}"\n\n\nclass GoldenRetriever(Dog):\n    def fetch(self, item):\n        return super().fetch(item) + " and drops it gently"\n\n\n# Polymorphism in action:\nanimals = [Animal("Cat", "meow"), Dog("Rex", "Labrador"), GoldenRetriever("Buddy", "Golden")]\nfor a in animals:\n    print(a.speak())  # Different output, same method call'),
        kt('Constructor','The <code>__init__</code> method in Python — called automatically when an object is instantiated. Sets up the initial state of the object (assigns attribute values). In a subclass, <code>super().__init__()</code> calls the parent\'s constructor.'),
        kt('Class vs instance variable','A <strong>class variable</strong> is shared by all instances of the class (defined at class level). An <strong>instance variable</strong> is unique to each object (defined in __init__ using self). Class variables are accessed via the class name; instance variables via self.'),
        tip('"Explain the difference between overloading and overriding." Answer: "Method overriding occurs in inheritance — a subclass provides its own implementation of a method defined in the parent class, replacing the parent\'s version when called on a subclass object. Method overloading (not natively supported in Python) is defining multiple methods with the same name but different parameter signatures in the same class."'),
      ]
    },

    { id:'3.10.2', title:'Design Patterns & UML Class Diagrams',
      sections: [
        kt('UML class diagram','A standardised diagram showing classes, their attributes and methods, and relationships. Notation: class name (top box), attributes with type (middle box), methods with parameters and return type (bottom box). Relationships: solid arrow = inheritance, dashed arrow = dependency, diamond = aggregation/composition.'),
        w('Reading UML Class Notation','┌─────────────────────────┐\n│         BankAccount      │  ← Class name\n├─────────────────────────┤\n│ - balance: float        │  ← Private attribute\n│ + owner: str            │  ← Public attribute\n│ # account_no: int       │  ← Protected attribute\n├─────────────────────────┤\n│ + deposit(amt: float)   │  ← Public method\n│ + withdraw(amt: float): bool │\n│ + get_balance(): float  │\n└─────────────────────────┘\n        △\n        │ (inheritance)\n┌──────────────────────┐\n│   SavingsAccount     │\n├──────────────────────┤\n│ - interest_rate: float│\n├──────────────────────┤\n│ + add_interest()     │\n└──────────────────────┘'),
        t('Association, Aggregation and Composition','<strong>Association</strong>: two classes know about each other (use each other\'s objects). <strong>Aggregation</strong> (HAS-A, weak): class A contains class B, but B can exist without A (e.g. University HAS-A Student — student exists without the university). <strong>Composition</strong> (HAS-A, strong): class A contains class B, B cannot exist without A (e.g. House HAS-A Room — rooms don\'t exist without the house). Composition is shown with a filled diamond, aggregation with an empty diamond.'),
      ]
    },
  ]},

  // ── 3.9 FUNCTIONAL PROGRAMMING ──────────────────────────────────
  { id:'aqa-9', number:'3.9', name:'Functional Programming', specPoints: [

    { id:'3.9.1', title:'Functional Programming Concepts',
      examTip:'The key contrast with imperative programming: functions have no side effects and variables are immutable.',
      sections: [
        t('What is Functional Programming?','Functional programming (FP) is a paradigm where programs are built from <strong>pure functions</strong> — functions that always produce the same output for the same input and have no side effects (they do not modify any state outside themselves). FP treats computation as the evaluation of mathematical functions.'),
        kt('Pure function','A function that: (1) always returns the same output for the same input (referential transparency), and (2) has no observable side effects (does not modify global state, I/O, or other external state). Pure functions are predictable and easy to test.'),
        kt('Immutability','In FP, data cannot be modified after creation. Instead of changing a variable, you create a new value. This eliminates an entire class of bugs caused by unexpected state changes and makes concurrent code safer.'),
        kt('First-class function','Functions treated as values — they can be assigned to variables, passed as arguments, and returned from other functions. Required for higher-order functions and functional programming patterns.'),
        tbl(['Feature','Imperative/OOP','Functional'],
          [['State','Mutable variables change over time','Immutable — create new values'],
           ['Loops','FOR/WHILE loops','Recursion, map, filter, fold'],
           ['Side effects','Common and expected','Avoided (pure functions)'],
           ['Focus','How to do it (steps)','What to compute (expressions)'],
           ['Debugging','State can be anywhere','Predictable — same input → same output']]),
        tip('"Give two advantages of functional programming." Answer: "(1) Pure functions always produce the same output for the same input, making programs easier to test — you do not need to set up global state. (2) Immutability eliminates a whole class of bugs caused by unexpected changes to shared state, making concurrent/parallel programs safer."'),
      ]
    },

    { id:'3.9.2', title:'Higher-Order Functions: Map, Filter, Fold',
      sections: [
        kt('Higher-order function','A function that takes one or more functions as arguments, or returns a function as its result. Examples: map, filter, fold (reduce).'),
        kt('Map','Applies a function to every element of a list, returning a new list of the same length. Does not modify the original.'),
        kt('Filter','Applies a predicate function to every element, returning a new list containing only elements where the predicate returns True.'),
        kt('Fold/Reduce','Reduces a list to a single value by repeatedly applying a combining function. Takes a function, an initial accumulator value, and a list.'),
        w('Map, Filter, Fold in Python and Haskell','# Python functional style\nnumbers = [1, 2, 3, 4, 5]\n\n# Map: double each number\ndoubled = list(map(lambda x: x * 2, numbers))\n# [2, 4, 6, 8, 10]\n\n# Filter: keep only even numbers\nevens = list(filter(lambda x: x % 2 == 0, numbers))\n# [2, 4]\n\n# Reduce (fold): sum all numbers\nfrom functools import reduce\ntotal = reduce(lambda acc, x: acc + x, numbers, 0)\n# 0+1=1, 1+2=3, 3+3=6, 6+4=10, 10+5=15 → 15\n\n# Combining them:\nresult = reduce(lambda a,x: a+x,\n         filter(lambda x: x%2==0,\n         map(lambda x: x**2, numbers)), 0)\n# Squares: [1,4,9,16,25] → evens: [4,16] → sum: 20'),
        kt('Lambda (anonymous function)','A function defined inline without a name. Used when a function is needed only once, typically as an argument to map/filter/fold. In Python: <code>lambda x: x * 2</code>. In Haskell: <code>\\x -> x * 2</code>.'),
        kt('Partial application','Creating a new function by fixing one or more arguments of an existing function. The result is a new function waiting for the remaining arguments. Useful for creating specialised functions from general ones.'),
        w('Partial Application','# Python (using functools.partial)\nfrom functools import partial\n\ndef power(base, exponent):\n    return base ** exponent\n\nsquare = partial(power, exponent=2)  # Fix exponent=2\ncube   = partial(power, exponent=3)\n\nprint(square(4))   # 16\nprint(cube(3))     # 27\n\n# Or with lambda:\nsquare = lambda x: power(x, 2)\n\n# Haskell (currying is built-in)\nadd :: Int -> Int -> Int\nadd x y = x + y\nadd5 = add 5   -- Partially apply with 5\nadd5 3         -- Returns 8'),
        tip('"Explain how map differs from a loop." Answer: "Map applies a function to each element of a list and returns a new list, without modifying the original. It is a declarative expression of transformation. A loop explicitly iterates, requires managing an index or counter, typically modifies a mutable list, and is imperative. Map is a higher-level abstraction that is more concise and avoids side effects."'),
      ]
    },
  ]},

  // ── 3.12 ALGORITHMS ──────────────────────────────────────────────
  { id:'aqa-12', number:'3.12', name:'Algorithms', specPoints: [

    { id:'3.12.1', title:'Data Structures',
      examTip:'Know the abstract operations (push/pop for stack, enqueue/dequeue for queue) and their time complexities.',
      sections: [
        tbl(['Structure','LIFO/FIFO','Operations','Time complexity','Use cases'],
          [['Stack','LIFO (last in, first out)','push, pop, peek, isEmpty','O(1) all','Call stack, undo, bracket matching, DFS'],
           ['Queue','FIFO (first in, first out)','enqueue, dequeue, front, isEmpty','O(1) all','BFS, print queue, scheduling'],
           ['Linked list','N/A','insert, delete, traverse, search','O(1) insert/delete, O(n) search','Dynamic size, frequent insertion/deletion'],
           ['Binary search tree','N/A','insert, delete, search, traverse','O(log n) average, O(n) worst','Sorted data, fast search'],
           ['Hash table','N/A','insert, delete, lookup','O(1) average','Dictionaries, caches, sets'],
           ['Graph','N/A','add vertex/edge, traverse, find path','Varies','Networks, maps, dependency graphs']]),
        w('Stack Implementation','class Stack:\n    def __init__(self):\n        self._data = []\n\n    def push(self, item):\n        self._data.append(item)   # O(1)\n\n    def pop(self):\n        if self.is_empty():\n            raise IndexError("Stack is empty")\n        return self._data.pop()   # O(1)\n\n    def peek(self):\n        return self._data[-1]     # O(1), no removal\n\n    def is_empty(self):\n        return len(self._data) == 0\n\n# Use: bracket matching\ndef balanced(s):\n    stack = Stack()\n    pairs = {")":"(", "]":"[", "}":"{"}\n    for ch in s:\n        if ch in "([{":\n            stack.push(ch)\n        elif ch in ")]}":\n            if stack.is_empty() or stack.pop() != pairs[ch]:\n                return False\n    return stack.is_empty()'),
      ]
    },

    { id:'3.12.2', title:'Graph Traversals: DFS & BFS',
      sections: [
        kt('Depth-first search (DFS)','Explores as far as possible down each branch before backtracking. Implemented using a <strong>stack</strong> (or recursion). Used for: detecting cycles, topological sort, maze solving, finding connected components.'),
        kt('Breadth-first search (BFS)','Explores all neighbours of the current node before going deeper. Implemented using a <strong>queue</strong>. Finds the shortest path in an unweighted graph. Used for: shortest path, social network distance, level-order tree traversal.'),
        w('DFS and BFS on a Graph','Graph:\nA — B — C\n|       |\nD — E — F\n\nDFS from A (using stack, visit order may vary):\n  Visit A → push B, D\n  Visit D → push E  \n  Visit E → push F\n  Visit F → push C\n  Visit C → push B (already visited)\n  Visit B\n  Order: A, D, E, F, C, B (one possible order)\n\nBFS from A (using queue):\n  Visit A → queue B, D\n  Visit B → queue C (D already queued)\n  Visit D → queue E\n  Visit C → queue F\n  Visit E (F already queued)\n  Visit F\n  Order: A, B, D, C, E, F (level by level)'),
        tbl(['Feature','DFS','BFS'],
          [['Data structure','Stack (or recursion)','Queue'],
           ['Explores','Deep first, then backtrack','Level by level (breadth first)'],
           ['Shortest path (unweighted)','NOT guaranteed','YES — always finds shortest'],
           ['Memory','O(depth of graph)','O(width of graph)'],
           ['Use cases','Cycle detection, topological sort','Shortest path, social networks']]),
      ]
    },

    { id:'3.12.3', title:"Dijkstra's Shortest Path Algorithm",
      examTip:"Always show your working table in the exam — marks are awarded for each correct step, not just the final answer.",
      sections: [
        t("Dijkstra's Algorithm","Finds the shortest path from a source vertex to all other vertices in a weighted graph with <strong>non-negative edge weights</strong>. Uses a greedy approach: always process the unvisited vertex with the smallest known distance."),
        w("Dijkstra's — Step-by-Step","Graph (weighted):\nA-B:4, A-C:2, B-C:1, B-D:5, C-D:8, C-E:10, D-E:2\n\nFind shortest paths from A:\n\n| Node | Distance | Via | Visited |\n|------|----------|-----|--------|\n|  A   |    0     |  -  |  YES   |\n|  B   |    4     |  A  |        |\n|  C   |    2     |  A  |        |\n|  D   |    ∞     |  -  |        |\n|  E   |    ∞     |  -  |        |\n\nVisit C (smallest unvisited, dist=2):\n  B via C: 2+1=3 < 4 → update B to 3 via C\n  D via C: 2+8=10 → update D to 10 via C\n  E via C: 2+10=12 → update E to 12 via C\n\nVisit B (dist=3):\n  D via B: 3+5=8 < 10 → update D to 8 via B\n\nVisit A\'s remaining... Visit D (dist=8):\n  E via D: 8+2=10 < 12 → update E to 10 via D\n\nFinal shortest distances from A:\n  A=0, B=3, C=2, D=8, E=10\n  Shortest path to E: A→C→B→D→E (10)"),
        tbl(['Step','Action'],
          [['Initialise','Distance to source = 0; all others = ∞; all unvisited'],
           ['Select','Choose unvisited vertex with smallest current distance'],
           ['Update','For each neighbour: if dist[current]+weight < dist[neighbour], update'],
           ['Mark visited','Mark current vertex as visited (will not be revisited)'],
           ['Repeat','Until destination reached or all vertices visited']]),
        tip("Dijkstra's works only with <strong>non-negative weights</strong>. For graphs with negative weights, use Bellman-Ford. In an exam, always present your work as a table showing distances and the via-vertex at each step."),
      ]
    },

    { id:'3.12.4', title:'Sorting Algorithms & Complexity',
      sections: [
        tbl(['Algorithm','Best','Average','Worst','Space','Stable?','Notes'],
          [['Bubble sort','O(n)','O(n²)','O(n²)','O(1)','Yes','Simple; slow for large n; optimisation: stop if no swaps'],
           ['Insertion sort','O(n)','O(n²)','O(n²)','O(1)','Yes','Good for nearly-sorted data; used in practice for small arrays'],
           ['Merge sort','O(n log n)','O(n log n)','O(n log n)','O(n)','Yes','Guaranteed O(n log n); needs extra memory; divide and conquer'],
           ['Quicksort','O(n log n)','O(n log n)','O(n²)','O(log n)','No','Fast in practice; worst case with bad pivot; in-place'],
           ['Heap sort','O(n log n)','O(n log n)','O(n log n)','O(1)','No','Guaranteed O(n log n) and in-place, but slower than quicksort in practice']]),
        w('Quicksort — Partition Step','def quicksort(arr, low, high):\n    if low < high:\n        pivot_idx = partition(arr, low, high)\n        quicksort(arr, low, pivot_idx - 1)\n        quicksort(arr, pivot_idx + 1, high)\n\ndef partition(arr, low, high):\n    pivot = arr[high]   # Choose last element as pivot\n    i = low - 1         # Index of smaller element\n    for j in range(low, high):\n        if arr[j] <= pivot:\n            i += 1\n            arr[i], arr[j] = arr[j], arr[i]  # Swap\n    arr[i+1], arr[high] = arr[high], arr[i+1]\n    return i + 1\n\n# Example: [3,6,8,10,1,2,1], pivot=1\n# After partition: [1,1,2,3,6,8,10] with pivot at index 1'),
        tip('When asked "which sorting algorithm would you choose for this scenario?" — if the list is nearly sorted: insertion sort (O(n) best case). If n is large and memory is limited: quicksort. If stability is required: merge sort. If guaranteed O(n log n) is needed: merge sort or heap sort.'),
      ]
    },

    { id:'3.12.5', title:'Dynamic Programming & Greedy Algorithms',
      sections: [
        kt('Dynamic programming (DP)','An optimisation technique for problems with <strong>overlapping subproblems</strong> and <strong>optimal substructure</strong>. Store solutions to subproblems (memoisation or bottom-up table) so they are computed only once. Transforms exponential-time recursive solutions into polynomial-time ones.'),
        tbl(['DP Approach','Description','When to use'],
          [['Top-down (memoisation)','Recursive solution + cache results of subproblems','When recursion is natural; not all subproblems needed'],
           ['Bottom-up (tabulation)','Iterative; fill a table from smallest subproblems up','When all subproblems needed; avoids recursion overhead']]),
        w('Dynamic Programming — Coin Change','# Find minimum coins to make amount n (classic DP problem)\n# Coins: [1, 5, 10, 25] (unlimited supply)\n\ndef min_coins(coins, amount):\n    # dp[i] = min coins to make amount i\n    dp = [float(\'inf\')] * (amount + 1)\n    dp[0] = 0  # Base case: 0 coins to make amount 0\n\n    for i in range(1, amount + 1):\n        for coin in coins:\n            if coin <= i:\n                dp[i] = min(dp[i], dp[i - coin] + 1)\n\n    return dp[amount]\n\nprint(min_coins([1,5,10,25], 41))  # 3 coins: 25+10+5+1? No: 25+10+5+1=41... \n# Actually: 25+16=25+10+5+1 = 4 coins. Greedy gives 25+10+5+1=4.\n# DP confirms: dp[41] = 4\n\n# Why not greedy? With coins [1,3,4], amount=6:\n#   Greedy: 4+1+1 = 3 coins\n#   DP optimal: 3+3 = 2 coins'),
        kt('Greedy algorithm','Makes locally optimal choices at each step, hoping to reach a global optimum. Works correctly for some problems (Dijkstra\'s, Huffman coding, minimum spanning tree) but NOT for others (coin change with arbitrary denominations, 0/1 knapsack). Greedy is faster (O(n log n) typically) but only applicable when the greedy property holds: a locally optimal choice leads to a globally optimal solution.'),
        w("Greedy vs DP — When Greedy Fails","# Coins problem: denominations [1, 3, 4], target = 6\n\n# GREEDY approach:\ncoin = 4  # largest ≤ 6\nremaining = 2\ncoin = 1  # largest ≤ 2\nremaining = 1\ncoin = 1  # largest ≤ 1\n# Result: 4+1+1 = 3 coins  ← NOT optimal!\n\n# DYNAMIC PROGRAMMING:\n# dp[0]=0, dp[1]=1, dp[2]=2, dp[3]=1, dp[4]=1,\n# dp[5]=2, dp[6]=2\n# 3+3 = 2 coins  ← OPTIMAL\n\n# Greedy works for standard coins (1,5,10,25) but\n# NOT for arbitrary denominations — always verify!"),
        tip('"Explain the difference between divide-and-conquer and dynamic programming." Answer: "Both break problems into subproblems. Divide-and-conquer subproblems are independent — merge sort divides, sorts each half independently, then merges. Dynamic programming subproblems overlap — the same subproblems recur many times. DP stores solutions to avoid recomputation. Merge sort does not need to store sorted subarrays because they are only used once."'),
      ]
    },

    { id:'3.12.6', title:'Complexity — Big-O Notation',
      examTip:'Be able to identify the Big-O complexity of algorithms and explain what the notation means.',
      sections: [
        t('What is Big-O Notation?','Describes how the running time (or space) of an algorithm grows as the input size n grows, ignoring constants and lower-order terms. Measures worst-case performance (usually). Allows comparison of algorithms regardless of hardware.'),
        tbl(['Notation','Name','Example','Description'],
          [['O(1)','Constant','Array access arr[i]','Same time regardless of n'],
           ['O(log n)','Logarithmic','Binary search','Halves problem each step; n=1M → 20 steps'],
           ['O(n)','Linear','Linear search, single loop','Proportional to n'],
           ['O(n log n)','Linearithmic','Merge sort, quicksort (avg)','n iterations each doing log n work'],
           ['O(n²)','Quadratic','Bubble sort, nested loops','Doubles n → 4× time'],
           ['O(2ⁿ)','Exponential','Naïve recursion (Fibonacci)','Each extra element doubles time'],
           ['O(n!)','Factorial','Brute-force TSP','Completely infeasible beyond n≈15']]),
        w('Identifying Big-O from Code','# O(1): direct access, single calculation\ndef get_first(arr): return arr[0]\n\n# O(n): one loop over n elements\ndef linear_search(arr, x):\n    for item in arr:\n        if item == x: return True\n    return False\n\n# O(n²): nested loops over same n\ndef bubble_sort(arr):\n    for i in range(len(arr)):\n        for j in range(len(arr)-1):\n            if arr[j] > arr[j+1]: arr[j],arr[j+1]=arr[j+1],arr[j]\n\n# O(log n): halving search space\ndef binary_search(arr, x):\n    lo, hi = 0, len(arr)-1\n    while lo <= hi:\n        mid = (lo+hi)//2\n        if arr[mid]==x: return mid\n        elif arr[mid]<x: lo=mid+1\n        else: hi=mid-1\n\n# O(n log n): loop + binary op inside\nimport heapq\ndef heapsort(arr):    # O(n log n)\n    heapq.heapify(arr)           # O(n)\n    return [heapq.heappop(arr) for _ in range(len(arr))]  # n × O(log n)'),
        tip('"A database holds 1 million records. Compare the maximum number of comparisons needed for a linear search vs a binary search." Answer: "Linear search: up to 1,000,000 comparisons — O(n). Binary search: up to log₂(1,000,000) ≈ 20 comparisons — O(log n). Binary search requires the data to be sorted but is far more efficient for large datasets."'),
      ]
    },
  ]},

  // ── 3.8, 3.10, 3.11 (concise coverage) ──────────────────────────
  { id:'aqa-8', number:'3.8', name:'Big Data', specPoints: [
    { id:'3.8.1', title:'Big Data Characteristics & Processing',
      sections: [
        t('The Three Vs','Big data is defined by three characteristics: <strong>Volume</strong> — data is too large for traditional databases (petabytes+). <strong>Velocity</strong> — data arrives at high speed and must be processed quickly (social media streams, sensor data). <strong>Variety</strong> — data comes in many formats: structured (SQL tables), semi-structured (JSON, XML) and unstructured (images, video, text).'),
        kt('Distributed processing','Processing data across many machines in a cluster. Essential for big data — no single machine can store or process petabytes. The cluster appears as one system. Hadoop and Spark are leading frameworks.'),
        kt('MapReduce','A programming model for processing big data in parallel. <strong>Map phase</strong>: divide data into chunks; each worker processes its chunk independently and produces key-value pairs. <strong>Reduce phase</strong>: combine results from all workers with the same key. Handles failures automatically.'),
        w('MapReduce Word Count Example','Input: "the cat sat on the mat the cat"\n\nMAP (each worker gets a chunk):\n  Worker 1: "the cat sat" → (the,1),(cat,1),(sat,1)\n  Worker 2: "on the mat" → (on,1),(the,1),(mat,1)\n  Worker 3: "the cat"    → (the,1),(cat,1)\n\nSHUFFLE: group by key:\n  the: [1,1,1], cat: [1,1], sat: [1], on: [1], mat: [1]\n\nREDUCE (sum each group):\n  the:3, cat:2, sat:1, on:1, mat:1'),
        kt('Graph database','A database designed to represent and query relationships efficiently. Data stored as nodes and edges. Better than relational databases for highly connected data (social networks, fraud detection, recommendation engines). Examples: Neo4j.'),
      ]
    },
  ]},

  { id:'aqa-11', number:'3.11', name:'Consequences of Digital Technology', specPoints: [
    { id:'3.11.1', title:'Legislation & Professional Ethics',
      sections: [
        tbl(['Act','Year','Key provisions'],
          [['Computer Misuse Act','1990','S1: Unauthorised access; S2: Unauthorised access + intent to commit crime; S3: Unauthorised modification (installing malware, deleting files). Max 10 years.'],
           ['Data Protection Act / GDPR','1998/2018','8 principles: fair/lawful, specified purpose, adequate, accurate, time-limited, secure, rights-respecting, no overseas transfer without protection'],
           ['Copyright, Designs & Patents Act','1988','Protects software, music, books, films. Illegal to copy/distribute without licence. Software piracy is a criminal offence.']]),
        kt('BCS Code of Conduct','The British Computer Society (BCS) code for professional computing. Key principles: act in the public interest, professional competence, professional development, integrity. Used in AQA exam scenarios about professional decision-making.'),
        tip('"A company asks a developer to build software that collects user data without consent. Using the BCS Code of Conduct, explain what the developer should do." Answer: "The developer should refuse, as building such software would violate the principle of acting in the public interest and would contravene GDPR. The developer has a professional duty to uphold legal and ethical standards, even if this conflicts with employer instructions."'),
      ]
    },
  ]},

  ]
};

// ═══════════════════════════════════════════════════════════════════
// OCR A LEVEL (H446) — full-spec board, kept in its own module
// ═══════════════════════════════════════════════════════════════════
import { OCR_ALEVEL } from './notes-alevel-ocr';

// ═══════════════════════════════════════════════════════════════════
// CAMBRIDGE A LEVEL (9618)
// ═══════════════════════════════════════════════════════════════════
const CAM_ALEVEL: ALevelBoard = {
  id: 'cambridge', name: 'Cambridge A Level (9618)',
  topics: [

  { id:'cam-3', number:'3', name:'Hardware', specPoints: [
    { id:'3.1', title:'Processor Fundamentals',
      sections: [
        t('The Cambridge Instruction Set','Cambridge 9618 requires knowledge of assembly language with specific instructions. The instruction set includes: data movement (LDM, LDD, STO), arithmetic (ADD, SUB, INC, DEC), bitwise (AND, OR, XOR, LSL, LSR), branch (JMP, JPE, JPN, CMP), I/O (IN, OUT) and END.'),
        tbl(['Instruction','Operation'],
          [['LDM #n','Load immediate value n into ACC'],
           ['LDD addr','Load value from memory address into ACC'],
           ['STO addr','Store ACC value to memory address'],
           ['ADD addr/n','Add memory value or immediate to ACC'],
           ['SUB addr/n','Subtract memory value or immediate from ACC'],
           ['CMP addr/n','Compare ACC with value (sets flags)'],
           ['JPE addr','Jump to address if last comparison was equal'],
           ['JPN addr','Jump to address if last comparison was not equal'],
           ['JMP addr','Unconditional jump'],
           ['AND addr/n','Bitwise AND with ACC'],
           ['OR addr/n','Bitwise OR with ACC'],
           ['XOR addr/n','Bitwise XOR with ACC'],
           ['LSL n','Logical shift left n bits'],
           ['LSR n','Logical shift right n bits'],
           ['IN','Input from keyboard into ACC'],
           ['OUT','Output ACC to display'],
           ['END','Stop program']]),
        w('Cambridge Assembly Example','// Multiply two numbers (repeated addition)\n// Inputs: NUM1 and NUM2 stored in memory\n// Output: RESULT\n\n        LDD NUM2      // ACC = NUM2 (counter)\n        CMP #0        // Compare with 0\n        JPE DONE      // If 0, skip loop\nLOOP:   ADD NUM1      // Add NUM1 to running total\n        STO RESULT    // Store result\n        LDD NUM2      // Load counter\n        SUB #1        // Decrement counter\n        STO NUM2      // Store back\n        CMP #0        // Check if done\n        JPN LOOP      // If not zero, repeat\nDONE:   LDD RESULT    // Load final result\n        OUT           // Output result\n        END\nNUM1:   10\nNUM2:   5\nRESULT: 0'),
      ]
    },
    { id:'3.2', title:'Memory, Cache & Virtual Memory',
      sections: [
        t('Memory Hierarchy','From fastest/smallest/most expensive to slowest/largest/cheapest: Registers → L1 Cache → L2 Cache → L3 Cache → RAM → SSD → HDD. The principle of locality: programs tend to access the same or nearby memory locations repeatedly (temporal and spatial locality). Cache exploits this to speed up execution.'),
        kt('Cache hit / cache miss','A <strong>cache hit</strong> occurs when the required data is found in cache — very fast access. A <strong>cache miss</strong> occurs when data must be fetched from slower RAM — cache is loaded with the new block. The cache hit rate is the proportion of accesses that are hits. Higher hit rate → better performance.'),
        kt('Virtual memory','Using disk space as an extension of RAM. The OS uses a <strong>page table</strong> to map virtual addresses (used by programs) to physical addresses (in RAM). When a program accesses a page not currently in RAM (page fault), the OS loads it from disk, possibly swapping another page out. Virtual memory allows programs larger than physical RAM but causes slowdown when page faults are frequent (thrashing).'),
        tbl(['Memory type','Location','Size','Speed','Volatile'],
          [['Registers','Inside CPU','Bytes','Fastest','Yes'],
           ['L1 Cache','On CPU die','~32 KB','Very fast','Yes'],
           ['L2 Cache','On CPU die','~256 KB','Fast','Yes'],
           ['L3 Cache','On CPU die (shared)','~8 MB','Moderate','Yes'],
           ['RAM','Separate chips','GB','Slow','Yes'],
           ['SSD','Storage device','TB','Very slow','No'],
           ['HDD','Storage device','TB','Slowest','No']]),
      ]
    },
  ]},

  { id:'cam-1', number:'1', name:'Data Representation', specPoints: [
    { id:'1.1', title:'Number Systems & Representation',
      sections: [
        t('Binary Fractions','Binary fractions use negative powers of 2 after the binary point. Position values: ...8, 4, 2, 1 . 1/2, 1/4, 1/8, 1/16...'),
        w('Binary Fraction Conversion','0.1101₂ = 1×(1/2) + 1×(1/4) + 0×(1/8) + 1×(1/16)\n        = 0.5 + 0.25 + 0 + 0.0625\n        = 0.8125\n\n0.6 in binary (may not terminate exactly):\n  0.6 × 2 = 1.2 → bit = 1, remainder 0.2\n  0.2 × 2 = 0.4 → bit = 0, remainder 0.4\n  0.4 × 2 = 0.8 → bit = 0, remainder 0.8\n  0.8 × 2 = 1.6 → bit = 1, remainder 0.6\n  0.6 × 2 = 1.2 → repeating!\n  0.6₁₀ ≈ 0.1001₂ (repeating — cannot be stored exactly)\n  This explains floating-point rounding errors!'),
        kt('Floating-point rounding errors','Because some decimal fractions (like 0.1 or 0.6) cannot be represented exactly in binary, floating-point arithmetic can produce small errors. Example: 0.1 + 0.2 ≠ 0.3 exactly in most programming languages. Critical in financial and scientific computing.'),
      ]
    },
    { id:'1.2', title:'Multimedia Representation',
      sections: [
        t('Image File Sizes','Uncompressed image size = width × height × colour depth (in bits). True Colour (24-bit): 8 bits each for R, G, B → 16,777,216 colours. Metadata (image header) adds to file size but is small relative to pixel data.'),
        w('Audio File Size Calculation','Formula: size (bits) = sample rate × bit depth × duration × channels\n\nExample: 44,100 Hz, 16-bit, stereo, 3 minutes\n  = 44,100 × 16 × 180 × 2\n  = 254,016,000 bits\n  = 31,752,000 bytes ≈ 30.3 MB\n\nCompressed (MP3 ~128kbps):\n  = 128,000 × 180 = 23,040,000 bits = 2.88 MB\n  Compression ratio: 30.3 / 2.88 ≈ 10.5:1'),
        kt('MIDI','Musical Instrument Digital Interface — stores musical instructions (notes, instruments, tempo) rather than audio samples. File sizes are tiny (KB rather than MB). Audio output depends on the synthesiser playing it back. Contrast with WAV/MP3 which store actual sound waves.'),
      ]
    },
  ]},

  { id:'cam-9', number:'19', name:'Algorithms & Data Structures', specPoints: [
    { id:'19.1', title:'Searching & Sorting Algorithms',
      sections: [
        t('Linear Search','Checks each element sequentially. O(n) worst case. Works on any list (sorted or not). Simple to implement.'),
        t('Binary Search','Works only on sorted lists. O(log n) — halves search space each step. For 1 million items: at most 20 comparisons. Requires random access to elements (arrays, not linked lists).'),
        w('Binary Search Implementation','def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target:\n            return mid          # Found\n        elif arr[mid] < target:\n            low = mid + 1       # Search right half\n        else:\n            high = mid - 1      # Search left half\n    return -1   # Not found\n\n# Works for: sorted lists, no duplicates (or first occurrence)\n# Cambridge 9618 also requires trace table for binary search'),
        t('Bubble Sort (Cambridge style)','Cambridge exams often ask for a complete trace showing each comparison and swap. Key: after k passes, the last k elements are in their final position. Optimisation: if no swaps in a pass, the list is sorted — stop early (best case O(n)).'),
      ]
    },
    { id:'19.2', title:'Linked Lists & Trees',
      sections: [
        kt('Singly linked list','A sequence of nodes where each node contains data and a pointer to the next node. Allows O(1) insertion/deletion at any position (given the pointer), but O(n) search. No wasted space — grows/shrinks dynamically.'),
        w('Linked List Operations','class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n\n    def insert_front(self, data):\n        new_node = Node(data)\n        new_node.next = self.head\n        self.head = new_node   # O(1)\n\n    def delete(self, data):\n        curr = self.head\n        if curr and curr.data == data:\n            self.head = curr.next\n            return\n        while curr.next:\n            if curr.next.data == data:\n                curr.next = curr.next.next  # Skip node\n                return\n            curr = curr.next\n\n    def traverse(self):\n        curr = self.head\n        while curr:\n            print(curr.data, end=" → ")\n            curr = curr.next\n        print("None")'),
        tbl(['Operation','Array','Linked List'],
          [['Access by index','O(1)','O(n)'],
           ['Search','O(n)','O(n)'],
           ['Insert at front','O(n) — shift elements','O(1)'],
           ['Insert at end','O(1) amortised','O(n) unless tail pointer kept'],
           ['Delete','O(n) — shift elements','O(1) given predecessor'],
           ['Memory','Fixed size (or dynamic resize)','Dynamic — exactly as needed']]),
      ]
    },
  ]},

  { id:'cam-4', number:'4', name:'Processor Fundamentals', specPoints: [
    { id:'4.1', title:'Interrupts & the Interrupt Service Routine',
      sections: [
        t('What is an Interrupt?','A signal to the CPU that an event requires immediate attention. After each FDE cycle, the CPU checks an interrupt flag register. Types: <strong>hardware interrupts</strong> (I/O device complete, hardware error, real-time clock), <strong>software interrupts</strong> (exceptions like divide-by-zero, system calls requesting OS services).'),
        w('Interrupt Handling Sequence','1. Current instruction finishes executing\n2. CPU checks interrupt flag register\n3. Interrupt pending? If yes:\n   a. Save program counter to stack\n   b. Save all registers (context) to stack\n   c. Load ISR address into PC (from interrupt vector table)\n   d. Execute ISR (handle the interrupt)\n   e. Restore all registers from stack\n   f. Restore PC from stack\n   g. Resume interrupted program from where it left off\n\nInterrupt vector table:\n  Maps interrupt number → ISR address\n  Stored in fixed memory locations\n  Different ISRs for different interrupt types'),
        kt('Maskable vs non-maskable interrupt','A <strong>maskable</strong> interrupt can be temporarily disabled by the CPU (set the interrupt enable flag to 0). Used when executing a critical section of code. A <strong>non-maskable interrupt</strong> (NMI) cannot be disabled — used for catastrophic events (hardware failure, power loss). The CPU must respond immediately regardless of what it is doing.'),
      ]
    },

    { id:'4.2', title:'Assembly Language & the Cambridge Instruction Set',
      examTip:'Cambridge exams frequently ask you to trace assembly programs step-by-step — show register values at each line.',
      sections: [
        tbl(['Instruction','Operation','Example'],
          [['LDM #n','Load immediate value n into ACC','LDM #5  → ACC=5'],
           ['LDD addr','Load from memory address into ACC','LDD X   → ACC=contents of X'],
           ['STO addr','Store ACC to memory address','STO X   → X=ACC'],
           ['ADD addr','ACC = ACC + contents of addr','ADD Y   → ACC=ACC+Y'],
           ['ADD #n','ACC = ACC + immediate n','ADD #10'],
           ['SUB addr','ACC = ACC - contents of addr','SUB Z'],
           ['INC reg','Increment register by 1','INC ACC'],
           ['DEC reg','Decrement register by 1','DEC IX'],
           ['CMP addr/n','Compare ACC with value (sets flags)','CMP #0'],
           ['JMP addr','Unconditional jump to address','JMP LOOP'],
           ['JPE addr','Jump if last comparison equal','JPE EQUAL'],
           ['JPN addr','Jump if last comparison not equal','JPN NOTDONE'],
           ['AND #n','Bitwise AND ACC with n','AND #00001111  (mask lower nibble)'],
           ['OR #n','Bitwise OR ACC with n','OR #11110000'],
           ['XOR #n','Bitwise XOR ACC with n','XOR #11111111  (flip all bits)'],
           ['LSL n','Logical shift left n bits (multiply by 2ⁿ)','LSL 2  → ×4'],
           ['LSR n','Logical shift right n bits (divide by 2ⁿ)','LSR 1  → ÷2'],
           ['IN','Read keyboard value into ACC','IN'],
           ['OUT','Output ACC to display','OUT'],
           ['END','Terminate program','END']]),
        w('Tracing Assembly — Counting Loop','// Count down from 5 to 1, outputting each value\n        LDM #5        // ACC = 5\n        STO COUNT     // COUNT = 5\nLOOP:   LDD COUNT     // ACC = COUNT\n        CMP #0        // Compare with 0\n        JPE DONE      // If 0, exit\n        OUT           // Output current count\n        LDD COUNT\n        SUB #1        // Decrement\n        STO COUNT\n        JMP LOOP\nDONE:   END\nCOUNT:  0             // Variable storage\n\nTrace:\n  Iteration 1: ACC=5, output 5, COUNT becomes 4\n  Iteration 2: ACC=4, output 4, COUNT becomes 3\n  Iteration 3: ACC=3, output 3, COUNT becomes 2\n  Iteration 4: ACC=2, output 2, COUNT becomes 1\n  Iteration 5: ACC=1, output 1, COUNT becomes 0\n  Iteration 6: ACC=0, CMP #0 → equal → JPE DONE → halt\n  Outputs: 5 4 3 2 1'),
        tip('"The instruction LSL 3 is used on ACC = 00000101 (decimal 5). What is the result?" Answer: "00101000 = decimal 40. Shifting left by 3 multiplies by 2³ = 8. 5 × 8 = 40. Bits shifted out of the MSB are lost (overflow)."'),
      ]
    },
  ]},

  { id:'cam-6', number:'6', name:'Hardware Devices', specPoints: [
    { id:'6.1', title:'Input, Output & Storage Devices',
      sections: [
        tbl(['Device type','Examples','Technology','Characteristic'],
          [['Input','Keyboard, mouse, touchscreen, microphone, scanner, barcode reader, webcam','Electrical, optical, acoustic','Converts real-world signals to digital data'],
           ['Output','Monitor (LCD, OLED), printer (inkjet, laser), speakers, projector','Optical, electrical, mechanical','Converts digital data to real-world signals'],
           ['Primary storage','RAM (DRAM), ROM, cache (SRAM)','Electronic (capacitors, transistors)','Volatile (RAM); fast; directly addressable by CPU'],
           ['Secondary storage','HDD, SSD, USB flash, optical disc (CD/DVD/Blu-ray)','Magnetic, flash, optical','Non-volatile; persistent; slower than RAM'],
           ['Tertiary/backup','Magnetic tape, cloud storage','Magnetic, network','Very large capacity; slow access; offline backup']]),
        tbl(['Storage Type','Technology','Speed','Capacity','Volatile?','Moveable?'],
          [['SRAM (cache)','Flip-flops (transistors)','Fastest','KB-MB','Yes','No'],
           ['DRAM (RAM)','Capacitors','Fast','GB','Yes','No'],
           ['Flash (SSD/USB)','NAND flash cells','Fast','GB-TB','No','Yes'],
           ['HDD','Magnetic platters, spinning','Slower','TB','No','Yes'],
           ['Optical disc','Laser read/write','Slow','25 GB (Blu-ray)','No','Yes'],
           ['Magnetic tape','Magnetic coating','Very slow (sequential)','Hundreds of TB','No','Yes']]),
        kt('Solid state drive (SSD)','Uses NAND flash memory — electrons trapped in floating-gate transistors represent bits. No moving parts → faster, quieter, shock-resistant. Disadvantage: limited write cycles (each cell wears out after ~3,000–100,000 writes); more expensive per GB than HDD. Modern SSDs use wear-levelling algorithms to distribute writes evenly.'),
        tip('"Explain why magnetic tape is still used for data backup despite being slow." Answer: "Magnetic tape has extremely high capacity (hundreds of TB per cartridge) at very low cost per GB. For archival backup of very large datasets that are written once and rarely accessed (cold storage), the slow sequential access speed is acceptable. Tape is also offline — disconnected from the network — providing protection against ransomware attacks that might encrypt or delete online backups."'),
      ]
    },
  ]},

  { id:'cam-7', number:'7', name:'Object-Oriented Programming (9618)', specPoints: [
    { id:'7.1', title:'OOP in Cambridge 9618 (Python & Pseudocode)',
      examTip:'Cambridge asks for UML diagrams AND pseudocode/Python implementations — know both.',
      sections: [
        w('Cambridge 9618 OOP Example','# Cambridge-style OOP: Bank Account hierarchy\nclass Account:\n    def __init__(self, account_no, owner, balance=0):\n        self.__account_no = account_no  # Private\n        self._owner = owner              # Protected\n        self._balance = balance\n\n    def deposit(self, amount):\n        if amount > 0:\n            self._balance += amount\n\n    def withdraw(self, amount):\n        if 0 < amount <= self._balance:\n            self._balance -= amount\n            return True\n        return False\n\n    def get_balance(self):\n        return self._balance\n\n    def __str__(self):\n        return f"Account {self.__account_no}: {self._owner} £{self._balance:.2f}"\n\n\nclass SavingsAccount(Account):\n    def __init__(self, account_no, owner, balance, rate):\n        super().__init__(account_no, owner, balance)\n        self.__rate = rate\n\n    def add_interest(self):\n        interest = self._balance * self.__rate / 100\n        self._balance += interest\n        return interest\n\n    def __str__(self):\n        return super().__str__() + f" (Savings, {self.__rate}% rate)"\n\n\n# Usage:\nacc = SavingsAccount("SA001", "Alice", 1000, 2.5)\nacc.deposit(500)\nacc.add_interest()  # 1500 * 0.025 = £37.50 added\nprint(acc)          # Account SA001: Alice £1537.50 (Savings, 2.5% rate)'),
        tbl(['OOP Concept','Cambridge Exam Requirement'],
          [['Class definition','Write a class with __init__, instance attributes, and methods'],
           ['Encapsulation','Use _ (protected) and __ (private) prefixes; access via methods'],
           ['Inheritance','Use super().__init__(); call parent methods'],
           ['Polymorphism','Override methods in subclass; same method name, different behaviour'],
           ['UML diagram','Draw class diagram with attributes, methods, and inheritance arrow'],
           ['Instantiation','Demonstrate creating objects and calling methods']]),
      ]
    },
  ]},

  { id:'cam-8', number:'8', name:'Algorithm Design & Problem Solving (9618)', specPoints: [
    { id:'8.1', title:'Pseudocode Conventions — Cambridge 9618',
      examTip:"Cambridge has very specific pseudocode syntax — marks are lost for using Python syntax in a pseudocode question.",
      sections: [
        w('Cambridge Pseudocode Reference','// Assignment\nx ← 5\nname ← "Alice"\n\n// Arithmetic\nresult ← (a + b) * c / d\nremainder ← x MOD 3\nquotient ← x DIV 3\n\n// Selection\nIF score >= 70 THEN\n    grade ← "A"\nELSEIF score >= 60 THEN\n    grade ← "B"\nELSE\n    grade ← "C"\nENDIF\n\n// Count-controlled loop\nFOR i ← 1 TO 10\n    OUTPUT i\nNEXT i\n\n// Condition-controlled loops\nWHILE count < 10 DO\n    count ← count + 1\nENDWHILE\n\nREPEAT\n    INPUT x\nUNTIL x > 0\n\n// Arrays (1-indexed in Cambridge)\nDECLARE scores : ARRAY[1:30] OF INTEGER\nscores[1] ← 85\n\n// 2D arrays\nDECLARE grid : ARRAY[1:8, 1:8] OF INTEGER\ngrid[3, 4] ← 1\n\n// Procedures and functions\nPROCEDURE Greet(name : STRING)\n    OUTPUT "Hello " & name\nENDPROCEDURE\n\nFUNCTION Max(a : INTEGER, b : INTEGER) RETURNS INTEGER\n    IF a > b THEN RETURN a ELSE RETURN b\n    ENDIF\nENDFUNCTION\n\n// String operations\nLENGTH("hello")    // 5\nUCASE("hello")     // "HELLO"\nLCASE("HI")        // "hi"\nMID("hello", 2, 3) // "ell" (pos 2, length 3)\nCONCAT("ab","cd")  // "abcd"'),
        tip('"What is the difference between PROCEDURE and FUNCTION in Cambridge pseudocode?" Answer: "A PROCEDURE performs actions but does not return a value — it uses OUTPUT to produce results. A FUNCTION computes and returns a value using RETURN — it is called as part of an expression, e.g. result ← Max(a, b). Both can receive parameters; procedures use BYREF if they need to modify the caller\'s variables."'),
      ]
    },
    { id:'8.2', title:'Stacks & Queues — Implementation',
      sections: [
        w('Stack using Array (Cambridge pseudocode)','// Stack: LIFO, implemented with array + pointer\nDECLARE stack : ARRAY[1:100] OF INTEGER\nDECLARE top : INTEGER\ntop ← 0   // Empty stack\n\nPROCEDURE Push(item : INTEGER)\n    IF top = 100 THEN\n        OUTPUT "Stack overflow"\n    ELSE\n        top ← top + 1\n        stack[top] ← item\n    ENDIF\nENDPROCEDURE\n\nFUNCTION Pop() RETURNS INTEGER\n    IF top = 0 THEN\n        OUTPUT "Stack underflow"\n        RETURN -1\n    ELSE\n        Pop ← stack[top]\n        top ← top - 1\n    ENDIF\nENDFUNCTION\n\nFUNCTION Peek() RETURNS INTEGER\n    IF top > 0 THEN\n        Peek ← stack[top]  // Do NOT decrement top\n    ENDIF\nENDFUNCTION'),
        w('Queue using Array (Circular)','// Queue: FIFO, circular array to avoid wastage\nDECLARE queue : ARRAY[1:MAX] OF INTEGER\nDECLARE front, back, count : INTEGER\nfront ← 1 : back ← 0 : count ← 0\n\nPROCEDURE Enqueue(item : INTEGER)\n    IF count = MAX THEN\n        OUTPUT "Queue full"\n    ELSE\n        back ← (back MOD MAX) + 1  // Wrap around\n        queue[back] ← item\n        count ← count + 1\n    ENDIF\nENDPROCEDURE\n\nFUNCTION Dequeue() RETURNS INTEGER\n    IF count = 0 THEN\n        OUTPUT "Queue empty"\n        RETURN -1\n    ELSE\n        Dequeue ← queue[front]\n        front ← (front MOD MAX) + 1\n        count ← count - 1\n    ENDIF\nENDFUNCTION'),
        tip('"Why use a circular queue rather than a linear queue?" Answer: "In a linear queue, dequeuing moves the front pointer forward but does not free the vacated spaces — eventually the back pointer reaches the end of the array and no more items can be added, even though the front is empty space. A circular queue wraps the back pointer back to the start of the array using modulo arithmetic, reusing the freed space. This avoids wasted memory without needing to shift all elements after each dequeue."'),
      ]
    },
  ]},

  ]
};

// ═══════════════════════════════════════════════════════════════════
// Export
// ═══════════════════════════════════════════════════════════════════
export const ALEVEL_NOTES: ALevelBoard[] = [AQA_ALEVEL, OCR_ALEVEL, CAM_ALEVEL];
