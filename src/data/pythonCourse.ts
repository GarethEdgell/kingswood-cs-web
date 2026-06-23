// ═══════════════════════════════════════════════════════════════════════
// Python Quest — gamified Python course for OCR GCSE J277 Component 02
// Covers only the practical programming skills on the OCR specification.
// Each challenge has deterministic expected output (with fixed inputs) so it
// can be auto-checked in the browser with Pyodide.
// ═══════════════════════════════════════════════════════════════════════

export interface Challenge {
  id: string;
  title: string;
  skill: string;        // OCR skill in plain English
  specRef: string;      // OCR J277 spec reference
  brief: string;        // what the student must do
  concept: string;      // short teaching note (HTML allowed)
  starter: string;      // starter code in the editor
  stdin?: string[];     // pre-fed inputs for input()
  expectedOutput: string;
  match?: 'exact' | 'contains';
  hints: string[];
  xp: number;
}

export interface World {
  id: string;
  name: string;
  emoji: string;
  colour: string;
  tagline: string;
  challenges: Challenge[];
}

export const PYTHON_WORLDS: World[] = [

  // ── WORLD 1 ─────────────────────────────────────────────────────────
  {
    id: 'w1', name: 'First Steps', emoji: '👣', colour: '#00d4ff',
    tagline: 'Output and variables',
    challenges: [
      {
        id: 'w1-1', title: 'Hello, World!', skill: 'Output text with print()', specRef: '2.2.1',
        brief: 'Make the program print exactly: Hello, World!',
        concept: '<code>print()</code> displays text on the screen. Text (a <strong>string</strong>) goes inside quotes.',
        starter: '# Print Hello, World!\n',
        expectedOutput: 'Hello, World!',
        hints: ['Use print() with the text inside quotes.', 'print("Hello, World!")'],
        xp: 10,
      },
      {
        id: 'w1-2', title: 'Storing Data', skill: 'Use a variable', specRef: '2.2.1',
        brief: 'Create a variable called name set to "Ada", then print it.',
        concept: 'A <strong>variable</strong> is a named box that stores a value. <code>name = "Ada"</code> puts "Ada" into the box called name.',
        starter: '# Make a variable then print it\n',
        expectedOutput: 'Ada',
        hints: ['First line: name = "Ada"', 'Second line: print(name) — no quotes around name'],
        xp: 10,
      },
      {
        id: 'w1-3', title: 'Joining Words', skill: 'Concatenate strings', specRef: '2.2.2',
        brief: 'Print the two words "Code" and "Master" joined with a space: Code Master',
        concept: 'Joining strings is called <strong>concatenation</strong>. Use <code>+</code> to join: <code>"a" + "b"</code> gives <code>"ab"</code>.',
        starter: 'first = "Code"\nsecond = "Master"\n# Print them with a space between\n',
        expectedOutput: 'Code Master',
        hints: ['Join with + and a space string: first + " " + second', 'print(first + " " + second)'],
        xp: 15,
      },
    ],
  },

  // ── WORLD 2 ─────────────────────────────────────────────────────────
  {
    id: 'w2', name: 'User Input', emoji: '⌨️', colour: '#7c3aed',
    tagline: 'Talking to the user',
    challenges: [
      {
        id: 'w2-1', title: 'Ask a Question', skill: 'Read input with input()', specRef: '2.2.1',
        brief: 'Ask for the user\'s name and greet them. With input "Sam", print: Hello Sam',
        concept: '<code>input()</code> reads a line the user types. Store it in a variable: <code>name = input()</code>.',
        starter: 'name = input()\n# Print Hello followed by the name\n',
        stdin: ['Sam'],
        expectedOutput: 'Hello Sam',
        hints: ['Join "Hello " and the name with +', 'print("Hello " + name)'],
        xp: 15,
      },
      {
        id: 'w2-2', title: 'Numbers from Text', skill: 'Cast a string to an integer', specRef: '2.2.2',
        brief: 'Read a number, double it, and print the result. With input "7", print: 14',
        concept: '<code>input()</code> always returns a <strong>string</strong>. To do maths you must <strong>cast</strong> it with <code>int()</code>: <code>n = int(input())</code>.',
        starter: 'n = input()\n# Cast n to an integer and print n doubled\n',
        stdin: ['7'],
        expectedOutput: '14',
        hints: ['Convert with int(): num = int(n)', 'print(int(n) * 2)'],
        xp: 20,
      },
      {
        id: 'w2-3', title: 'Decimal Numbers', skill: 'Cast to a real (float)', specRef: '2.2.2',
        brief: 'Read a price, add 1.50, and print it. With input "3.00", print: 4.5',
        concept: 'For decimals use <code>float()</code> instead of <code>int()</code>. A decimal number is called a <strong>real</strong> in OCR pseudocode.',
        starter: 'price = input()\n# Cast to float, add 1.50, print\n',
        stdin: ['3.00'],
        expectedOutput: '4.5',
        hints: ['Use float(): float(price) + 1.50', 'print(float(price) + 1.50)'],
        xp: 20,
      },
    ],
  },

  // ── WORLD 3 ─────────────────────────────────────────────────────────
  {
    id: 'w3', name: 'Maths Magic', emoji: '🔢', colour: '#00ff94',
    tagline: 'Arithmetic operators',
    challenges: [
      {
        id: 'w3-1', title: 'The Operators', skill: 'Use arithmetic operators', specRef: '2.2.2',
        brief: 'Print the result of 17 + 5 * 2 (Python does × before +). Answer: 27',
        concept: 'Python follows <strong>BIDMAS</strong>: <code>*</code> and <code>/</code> happen before <code>+</code> and <code>-</code>.',
        starter: '# Print the value of 17 + 5 * 2\n',
        expectedOutput: '27',
        hints: ['5 * 2 = 10 first, then 17 + 10', 'print(17 + 5 * 2)'],
        xp: 15,
      },
      {
        id: 'w3-2', title: 'Whole Division', skill: 'Use integer division (DIV) and modulo (MOD)', specRef: '2.2.2',
        brief: 'Print how many whole times 5 goes into 17, then the remainder. Output: 3 then 2 on separate lines.',
        concept: '<code>//</code> is <strong>integer division (DIV)</strong> — the whole number of times. <code>%</code> is <strong>modulo (MOD)</strong> — the remainder. <code>17 // 5 = 3</code>, <code>17 % 5 = 2</code>.',
        starter: '# Print 17 // 5 then 17 % 5\n',
        expectedOutput: '3\n2',
        hints: ['Two print statements', 'print(17 // 5)\nprint(17 % 5)'],
        xp: 20,
      },
      {
        id: 'w3-3', title: 'Area Calculator', skill: 'Combine input, casting and arithmetic', specRef: '2.2.2',
        brief: 'Read a width and height, print the area. With inputs "4" and "5", print: 20',
        concept: 'Real programs combine skills: read inputs, cast them, then calculate.',
        starter: 'width = int(input())\nheight = int(input())\n# Print the area\n',
        stdin: ['4', '5'],
        expectedOutput: '20',
        hints: ['Area = width × height', 'print(width * height)'],
        xp: 25,
      },
    ],
  },

  // ── WORLD 4 ─────────────────────────────────────────────────────────
  {
    id: 'w4', name: 'Decisions', emoji: '🔀', colour: '#fbbf24',
    tagline: 'Selection with if statements',
    challenges: [
      {
        id: 'w4-1', title: 'If This...', skill: 'Use an if statement', specRef: '2.2.1',
        brief: 'Read an age. If it is 18 or more, print: Adult. With input "20", print: Adult',
        concept: 'An <strong>if statement</strong> runs code only when a condition is True. Indent the line inside with spaces.',
        starter: 'age = int(input())\n# If age >= 18 print Adult\n',
        stdin: ['20'],
        expectedOutput: 'Adult',
        hints: ['if age >= 18:', 'Indent the print line:\n    print("Adult")'],
        xp: 20,
      },
      {
        id: 'w4-2', title: 'Else Branch', skill: 'Use if/else', specRef: '2.2.1',
        brief: 'Read a number. Print "Even" if it divides by 2, otherwise "Odd". With input "7", print: Odd',
        concept: 'Use <code>else</code> for the alternative. Test even with modulo: <code>n % 2 == 0</code>.',
        starter: 'n = int(input())\n# Print Even or Odd\n',
        stdin: ['7'],
        expectedOutput: 'Odd',
        hints: ['if n % 2 == 0:\n    print("Even")', 'else:\n    print("Odd")'],
        xp: 25,
      },
      {
        id: 'w4-3', title: 'Grade Boundaries', skill: 'Use if/elif/else and Boolean logic', specRef: '2.2.1',
        brief: 'Read a score. Print "Pass" if 40 or more AND less than 70, else "Other". With input "55", print: Pass',
        concept: 'Combine conditions with <code>and</code>, <code>or</code>, <code>not</code>. <code>score >= 40 and score < 70</code>.',
        starter: 'score = int(input())\n# Print Pass or Other\n',
        stdin: ['55'],
        expectedOutput: 'Pass',
        hints: ['if score >= 40 and score < 70:', 'print("Pass") indented, then else: print("Other")'],
        xp: 30,
      },
    ],
  },

  // ── WORLD 5 ─────────────────────────────────────────────────────────
  {
    id: 'w5', name: 'Loops', emoji: '🔁', colour: '#fb7185',
    tagline: 'Iteration',
    challenges: [
      {
        id: 'w5-1', title: 'Count to Five', skill: 'Use a count-controlled for loop', specRef: '2.2.1',
        brief: 'Use a for loop to print the numbers 1 to 5, each on its own line.',
        concept: 'A <strong>for loop</strong> repeats a set number of times. <code>range(1, 6)</code> gives 1,2,3,4,5 (the end is not included).',
        starter: '# Loop printing 1 to 5\nfor i in range(1, 6):\n    \n',
        expectedOutput: '1\n2\n3\n4\n5',
        hints: ['Inside the loop: print(i)', 'for i in range(1, 6):\n    print(i)'],
        xp: 25,
      },
      {
        id: 'w5-2', title: 'Times Table', skill: 'Use a for loop with calculation', specRef: '2.2.1',
        brief: 'Print the 3 times table from 3×1 to 3×5. Output: 3, 6, 9, 12, 15 each on its own line.',
        concept: 'You can calculate inside a loop using the loop variable.',
        starter: 'for i in range(1, 6):\n    # Print 3 times i\n    \n',
        expectedOutput: '3\n6\n9\n12\n15',
        hints: ['print(3 * i)', 'for i in range(1, 6):\n    print(3 * i)'],
        xp: 30,
      },
      {
        id: 'w5-3', title: 'Keep Going', skill: 'Use a condition-controlled while loop', specRef: '2.2.1',
        brief: 'Start at 10 and count DOWN to 1 using a while loop, each on its own line.',
        concept: 'A <strong>while loop</strong> repeats while a condition is True. Remember to change the variable or it loops forever!',
        starter: 'n = 10\nwhile n >= 1:\n    print(n)\n    # Make n smaller\n    \n',
        expectedOutput: '10\n9\n8\n7\n6\n5\n4\n3\n2\n1',
        hints: ['Reduce n by 1 each loop: n = n - 1', 'n = n - 1 (indented inside the while)'],
        xp: 35,
      },
    ],
  },

  // ── WORLD 6 ─────────────────────────────────────────────────────────
  {
    id: 'w6', name: 'Word Wizardry', emoji: '🔤', colour: '#38bdf8',
    tagline: 'String manipulation',
    challenges: [
      {
        id: 'w6-1', title: 'How Long?', skill: 'Find string length with len()', specRef: '2.2.2',
        brief: 'Read a word and print how many characters it has. With input "python", print: 6',
        concept: '<code>len(word)</code> returns the number of characters in a string.',
        starter: 'word = input()\n# Print its length\n',
        stdin: ['python'],
        expectedOutput: '6',
        hints: ['Use len(): len(word)', 'print(len(word))'],
        xp: 20,
      },
      {
        id: 'w6-2', title: 'SHOUTING', skill: 'Change case with .upper()', specRef: '2.2.2',
        brief: 'Read a word and print it in CAPITALS. With input "quiet", print: QUIET',
        concept: 'Strings have built-in tools: <code>.upper()</code>, <code>.lower()</code>. Use them like <code>word.upper()</code>.',
        starter: 'word = input()\n# Print it in uppercase\n',
        stdin: ['quiet'],
        expectedOutput: 'QUIET',
        hints: ['word.upper()', 'print(word.upper())'],
        xp: 20,
      },
      {
        id: 'w6-3', title: 'First Letter', skill: 'Access characters and slice strings', specRef: '2.2.2',
        brief: 'Read a name and print just its first letter. With input "Grace", print: G',
        concept: 'Each character has an index starting at 0. <code>word[0]</code> is the first character. Slicing <code>word[0:3]</code> gives the first three.',
        starter: 'name = input()\n# Print the first character\n',
        stdin: ['Grace'],
        expectedOutput: 'G',
        hints: ['Index 0 is the first letter: name[0]', 'print(name[0])'],
        xp: 25,
      },
    ],
  },

  // ── WORLD 7 ─────────────────────────────────────────────────────────
  {
    id: 'w7', name: 'Collections', emoji: '📦', colour: '#a78bfa',
    tagline: 'Lists (arrays)',
    challenges: [
      {
        id: 'w7-1', title: 'Make a List', skill: 'Create and index a list (array)', specRef: '2.2.2',
        brief: 'A list of scores is given. Print the FIRST score. Output: 42',
        concept: 'A <strong>list</strong> (called an <strong>array</strong> in OCR) holds many values. Access by index: <code>scores[0]</code> is the first.',
        starter: 'scores = [42, 17, 99, 6]\n# Print the first score\n',
        expectedOutput: '42',
        hints: ['First item is index 0', 'print(scores[0])'],
        xp: 25,
      },
      {
        id: 'w7-2', title: 'Add to the List', skill: 'Append to a list', specRef: '2.2.2',
        brief: 'Add the number 5 to the end of the list, then print the whole list. Output: [1, 2, 3, 5]',
        concept: 'Use <code>.append()</code> to add an item to the end: <code>nums.append(5)</code>.',
        starter: 'nums = [1, 2, 3]\n# Append 5 then print the list\n',
        expectedOutput: '[1, 2, 3, 5]',
        hints: ['nums.append(5)', 'then print(nums)'],
        xp: 30,
      },
      {
        id: 'w7-3', title: 'Total Up', skill: 'Loop through a list to total values', specRef: '2.2.1',
        brief: 'Add up all numbers in the list and print the total. Output: 60',
        concept: 'Loop through a list with <code>for n in nums:</code> and build up a running total.',
        starter: 'nums = [10, 20, 30]\ntotal = 0\n# Loop and add each to total, then print total\n',
        expectedOutput: '60',
        hints: ['for n in nums:\n    total = total + n', 'print(total) after the loop (not indented)'],
        xp: 35,
      },
    ],
  },

  // ── WORLD 8 ─────────────────────────────────────────────────────────
  {
    id: 'w8', name: 'Building Blocks', emoji: '🧱', colour: '#f59e0b',
    tagline: 'Subroutines & robust programs',
    challenges: [
      {
        id: 'w8-1', title: 'Your First Function', skill: 'Define and call a function with a return value', specRef: '2.2.1',
        brief: 'Write a function square(n) that returns n×n, then print square(6). Output: 36',
        concept: 'A <strong>function</strong> is a reusable named block. <code>def square(n):</code> defines it; <code>return</code> sends a value back.',
        starter: 'def square(n):\n    # return n times n\n    \n\nprint(square(6))\n',
        expectedOutput: '36',
        hints: ['Inside the function: return n * n', 'def square(n):\n    return n * n'],
        xp: 35,
      },
      {
        id: 'w8-2', title: 'Validation', skill: 'Validate input with a range check', specRef: '2.2.3',
        brief: 'Read an age. If between 0 and 120 print "Valid", else "Invalid". With input "200", print: Invalid',
        concept: '<strong>Validation</strong> checks data is sensible. A <strong>range check</strong> ensures a number is within allowed limits — part of writing <strong>robust programs</strong>.',
        starter: 'age = int(input())\n# Valid if 0 <= age <= 120, else Invalid\n',
        stdin: ['200'],
        expectedOutput: 'Invalid',
        hints: ['if age >= 0 and age <= 120:', 'print("Valid") else print("Invalid")'],
        xp: 35,
      },
      {
        id: 'w8-3', title: 'The Final Boss', skill: 'Combine everything: input, loop, list, function', specRef: '2.2.1',
        brief: 'Write a function biggest(nums) that returns the largest number in a list, then print biggest([4, 9, 2, 7]). Output: 9',
        concept: 'The exam rewards combining skills. Loop through the list, track the biggest value seen so far, and return it.',
        starter: 'def biggest(nums):\n    best = nums[0]\n    for n in nums:\n        # if n is bigger than best, update best\n        \n    return best\n\nprint(biggest([4, 9, 2, 7]))\n',
        expectedOutput: '9',
        hints: ['Inside the loop: if n > best:\n        best = n', 'Indent carefully — the if is inside the for'],
        xp: 50,
      },
    ],
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────
export function getAllChallenges(): Challenge[] {
  return PYTHON_WORLDS.flatMap(w => w.challenges);
}

export function totalXP(): number {
  return getAllChallenges().reduce((s, c) => s + c.xp, 0);
}

// Level thresholds — level up every 75 XP
export function levelFromXP(xp: number): { level: number; into: number; needed: number } {
  const per = 75;
  const level = Math.floor(xp / per) + 1;
  const into = xp % per;
  return { level, into, needed: per };
}

export const PY_RANKS = [
  'Novice', 'Apprentice', 'Coder', 'Developer', 'Engineer',
  'Architect', 'Hacker', 'Wizard', 'Legend', 'Grandmaster',
];

export function rankFromLevel(level: number): string {
  return PY_RANKS[Math.min(level - 1, PY_RANKS.length - 1)];
}
