// ═══════════════════════════════════════════════════════════════════════
// Python Quest: A Level — gamified Python for OCR A Level H446
// Covers the practical programming and algorithm content of the OCR A Level
// specification (Component 01 §1.4.2 data structures; Component 02 §2.2
// programming techniques & §2.3 algorithms). Every challenge has a
// deterministic expected output so it can be auto-checked in the browser.
// Re-uses the Challenge / World types and XP helpers from pythonCourse.ts.
// ═══════════════════════════════════════════════════════════════════════

import type { World, Challenge } from './pythonCourse';

export const PYTHON_ALEVEL_WORLDS: World[] = [

  // ── WORLD 1 ─────────────────────────────────────────────────────────
  {
    id: 'a1', name: 'Functions & Modularity', emoji: '🧩', colour: '#00d4ff',
    tagline: 'Subroutines, parameters and scope',
    challenges: [
      {
        id: 'a1-1', title: 'Functions that Return', skill: 'Define a function with parameters and a return value', specRef: '2.2.1',
        brief: 'Write a function add(a, b) that returns their sum, then print add(8, 5). Output: 13',
        concept: 'A <strong>function</strong> is a named, reusable subroutine. Parameters receive arguments; <code>return</code> sends a value back to the caller. OCR distinguishes <strong>functions</strong> (return a value) from <strong>procedures</strong> (do not).',
        starter: 'def add(a, b):\n    # return the sum of a and b\n    \n\nprint(add(8, 5))\n',
        expectedOutput: '13',
        hints: ['Inside the function write: return a + b', 'def add(a, b):\n    return a + b'],
        xp: 20,
      },
      {
        id: 'a1-2', title: 'Default Parameters', skill: 'Use default parameter values', specRef: '2.2.1',
        brief: 'Write greet(name, greeting="Hello") that returns "greeting, name". Print greet("Ada"). Output: Hello, Ada',
        concept: 'A <strong>default parameter</strong> is used when no argument is supplied. <code>def greet(name, greeting="Hello")</code> lets you call <code>greet("Ada")</code> or <code>greet("Ada", "Hi")</code>.',
        starter: 'def greet(name, greeting="Hello"):\n    # return the greeting and name joined with ", "\n    \n\nprint(greet("Ada"))\n',
        expectedOutput: 'Hello, Ada',
        hints: ['Use an f-string: f"{greeting}, {name}"', 'return f"{greeting}, {name}"'],
        xp: 25,
      },
      {
        id: 'a1-3', title: 'Local vs Global Scope', skill: 'Understand variable scope and the global keyword', specRef: '2.2.1',
        brief: 'Make increment() change the GLOBAL count. After two calls, print count. Output: 2',
        concept: 'A variable assigned inside a subroutine is <strong>local</strong> by default. To modify a <strong>global</strong> variable from inside, declare <code>global count</code> first — otherwise Python raises an error.',
        starter: 'count = 0\n\ndef increment():\n    # one line so this updates the global count\n    count = count + 1\n\nincrement()\nincrement()\nprint(count)\n',
        expectedOutput: '2',
        hints: ['Add a line before count = count + 1', 'def increment():\n    global count\n    count = count + 1'],
        xp: 30,
      },
    ],
  },

  // ── WORLD 2 ─────────────────────────────────────────────────────────
  {
    id: 'a2', name: 'Recursion', emoji: '🌀', colour: '#7c3aed',
    tagline: 'Functions that call themselves',
    challenges: [
      {
        id: 'a2-1', title: 'Recursive Factorial', skill: 'Write a recursive function with a base case', specRef: '2.2.1',
        brief: 'Write recursive factorial(n) and print factorial(5). Output: 120',
        concept: '<strong>Recursion</strong> is when a function calls itself. Every recursion needs a <strong>base case</strong> to stop. <code>factorial(0) = 1</code>; otherwise <code>n × factorial(n-1)</code>.',
        starter: 'def factorial(n):\n    if n == 0:\n        return 1\n    # otherwise return n times factorial of n-1\n    \n\nprint(factorial(5))\n',
        expectedOutput: '120',
        hints: ['The recursive case: return n * factorial(n - 1)', 'def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)'],
        xp: 30,
      },
      {
        id: 'a2-2', title: 'Fibonacci', skill: 'Recursion with two base cases', specRef: '2.2.1',
        brief: 'Write recursive fib(n) where fib(0)=0, fib(1)=1. Print fib(10). Output: 55',
        concept: 'Some problems need more than one base case. The Fibonacci sequence: each term is the sum of the previous two. <code>fib(n) = fib(n-1) + fib(n-2)</code>.',
        starter: 'def fib(n):\n    if n == 0:\n        return 0\n    if n == 1:\n        return 1\n    # return the sum of the two previous terms\n    \n\nprint(fib(10))\n',
        expectedOutput: '55',
        hints: ['return fib(n - 1) + fib(n - 2)', 'The sequence is 0,1,1,2,3,5,8,13,21,34,55 — so fib(10) = 55'],
        xp: 35,
      },
      {
        id: 'a2-3', title: 'Recursive List Sum', skill: 'Recurse over a data structure', specRef: '2.2.1',
        brief: 'Write recursive sum_list(items) that totals a list. Print sum_list([3, 1, 4, 1, 5]). Output: 14',
        concept: 'Recursion can process structures: the total of a list is the first item plus the total of the rest. Base case: an empty list sums to 0.',
        starter: 'def sum_list(items):\n    if items == []:\n        return 0\n    # first item + sum of the rest (items[1:])\n    \n\nprint(sum_list([3, 1, 4, 1, 5]))\n',
        expectedOutput: '14',
        hints: ['return items[0] + sum_list(items[1:])', 'items[1:] is everything except the first element'],
        xp: 40,
      },
    ],
  },

  // ── WORLD 3 ─────────────────────────────────────────────────────────
  {
    id: 'a3', name: 'Searching', emoji: '🔍', colour: '#00ff94',
    tagline: 'Linear and binary search',
    challenges: [
      {
        id: 'a3-1', title: 'Linear Search', skill: 'Implement a linear search returning an index', specRef: '2.3.1',
        brief: 'Return the index of target 9 in [5, 3, 9, 1, 7] using linear search. Output: 2',
        concept: '<strong>Linear search</strong> checks each item in turn until it finds the target. Worst case it inspects every element — time complexity <code>O(n)</code>.',
        starter: 'data = [5, 3, 9, 1, 7]\ntarget = 9\n\nfor i in range(len(data)):\n    # if this item equals target, print i and stop\n    \n',
        expectedOutput: '2',
        hints: ['if data[i] == target:', '    print(i)\n    break'],
        xp: 30,
      },
      {
        id: 'a3-2', title: 'Binary Search', skill: 'Implement an iterative binary search', specRef: '2.3.1',
        brief: 'Find target 7 in the SORTED list [1, 3, 5, 7, 9, 11] with binary search. Output: 3',
        concept: '<strong>Binary search</strong> only works on sorted data. It repeatedly halves the search range by comparing the middle element — time complexity <code>O(log n)</code>.',
        starter: 'data = [1, 3, 5, 7, 9, 11]\ntarget = 7\nlow = 0\nhigh = len(data) - 1\n\nwhile low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n        print(mid)\n        break\n    elif data[mid] < target:\n        # search the upper half\n        \n    else:\n        # search the lower half\n        \n',
        expectedOutput: '3',
        hints: ['Upper half: low = mid + 1', 'Lower half: high = mid - 1'],
        xp: 40,
      },
      {
        id: 'a3-3', title: 'Not Found', skill: 'Handle the absent case in binary search', specRef: '2.3.1',
        brief: 'Binary search for 4 in [1, 3, 5, 7, 9, 11]. It is not present — print -1. Output: -1',
        concept: 'A robust search reports failure. When the range collapses (<code>low &gt; high</code>) the target is not in the list, so return a sentinel value such as <code>-1</code>.',
        starter: 'data = [1, 3, 5, 7, 9, 11]\ntarget = 4\nlow = 0\nhigh = len(data) - 1\nfound = -1\n\nwhile low <= high:\n    mid = (low + high) // 2\n    if data[mid] == target:\n        found = mid\n        break\n    elif data[mid] < target:\n        low = mid + 1\n    else:\n        high = mid - 1\n\n# print found\n',
        expectedOutput: '-1',
        hints: ['Just add: print(found)', 'found stays -1 because 4 is never the middle element'],
        xp: 35,
      },
    ],
  },

  // ── WORLD 4 ─────────────────────────────────────────────────────────
  {
    id: 'a4', name: 'Sorting', emoji: '🗂️', colour: '#fbbf24',
    tagline: 'Bubble, insertion and merge sort',
    challenges: [
      {
        id: 'a4-1', title: 'Bubble Sort', skill: 'Implement bubble sort', specRef: '2.3.1',
        brief: 'Sort [5, 2, 9, 1] ascending with bubble sort and print it. Output: [1, 2, 5, 9]',
        concept: '<strong>Bubble sort</strong> repeatedly steps through the list, swapping adjacent items that are out of order, until no swaps are needed. Time complexity <code>O(n²)</code>.',
        starter: 'data = [5, 2, 9, 1]\nn = len(data)\n\nfor i in range(n):\n    for j in range(n - 1 - i):\n        if data[j] > data[j + 1]:\n            # swap data[j] and data[j + 1]\n            \n\nprint(data)\n',
        expectedOutput: '[1, 2, 5, 9]',
        hints: ['Pythonic swap: data[j], data[j + 1] = data[j + 1], data[j]', 'Indent the swap inside the if'],
        xp: 35,
      },
      {
        id: 'a4-2', title: 'Insertion Sort', skill: 'Implement insertion sort', specRef: '2.3.1',
        brief: 'Sort [8, 3, 5, 1] ascending with insertion sort and print it. Output: [1, 3, 5, 8]',
        concept: '<strong>Insertion sort</strong> builds a sorted section at the front, inserting each new item into its correct place by shifting larger items right. Efficient on nearly-sorted data.',
        starter: 'data = [8, 3, 5, 1]\n\nfor i in range(1, len(data)):\n    key = data[i]\n    j = i - 1\n    while j >= 0 and data[j] > key:\n        data[j + 1] = data[j]\n        j = j - 1\n    # place key in the gap at j + 1\n    \n\nprint(data)\n',
        expectedOutput: '[1, 3, 5, 8]',
        hints: ['After the while loop: data[j + 1] = key', 'This line is inside the for loop but outside the while'],
        xp: 40,
      },
      {
        id: 'a4-3', title: 'Merge Sort', skill: 'Implement recursive merge sort', specRef: '2.3.1',
        brief: 'Sort [4, 1, 7, 3, 2] with merge sort and print it. Output: [1, 2, 3, 4, 7]',
        concept: '<strong>Merge sort</strong> is a <strong>divide-and-conquer</strong> algorithm: split the list in half, recursively sort each half, then merge them. Time complexity <code>O(n log n)</code>.',
        starter: 'def merge_sort(lst):\n    if len(lst) <= 1:\n        return lst\n    mid = len(lst) // 2\n    left = merge_sort(lst[:mid])\n    right = merge_sort(lst[mid:])\n    merged = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            merged.append(left[i]); i += 1\n        else:\n            merged.append(right[j]); j += 1\n    # add any remaining items from left and right\n    \n    return merged\n\nprint(merge_sort([4, 1, 7, 3, 2]))\n',
        expectedOutput: '[1, 2, 3, 4, 7]',
        hints: ['Append the leftovers: merged += left[i:] + right[j:]', 'left[i:] is whatever is still unmerged from the left half'],
        xp: 50,
      },
    ],
  },

  // ── WORLD 5 ─────────────────────────────────────────────────────────
  {
    id: 'a5', name: 'Stacks & Queues', emoji: '📚', colour: '#fb7185',
    tagline: 'LIFO and FIFO data structures',
    challenges: [
      {
        id: 'a5-1', title: 'Push & Pop', skill: 'Use a list as a stack (LIFO)', specRef: '1.4.2',
        brief: 'Push 1, 2, 3 onto a stack, pop once, then print the stack. Output: [1, 2]',
        concept: 'A <strong>stack</strong> is <strong>LIFO</strong> (last in, first out). <code>append()</code> pushes onto the top; <code>pop()</code> removes the top item.',
        starter: 'stack = []\nstack.append(1)\nstack.append(2)\nstack.append(3)\n# pop the top item off the stack\n\nprint(stack)\n',
        expectedOutput: '[1, 2]',
        hints: ['stack.pop() removes and returns the last item', 'Just call stack.pop() on its own line'],
        xp: 30,
      },
      {
        id: 'a5-2', title: 'Peek', skill: 'Inspect the top of a stack without removing it', specRef: '1.4.2',
        brief: 'Print the top item of the stack [10, 20, 30] without removing it. Output: 30',
        concept: '<strong>Peek</strong> reads the top of the stack without popping it. The top is the last element — index <code>-1</code>.',
        starter: 'stack = [10, 20, 30]\n# print the top item without removing it\n',
        expectedOutput: '30',
        hints: ['The last element is stack[-1]', 'print(stack[-1])'],
        xp: 25,
      },
      {
        id: 'a5-3', title: 'Enqueue & Dequeue', skill: 'Use a list as a queue (FIFO)', specRef: '1.4.2',
        brief: 'Enqueue 1, 2, 3, dequeue once, then print the queue. Output: [2, 3]',
        concept: 'A <strong>queue</strong> is <strong>FIFO</strong> (first in, first out). Enqueue with <code>append()</code>; dequeue the front with <code>pop(0)</code>.',
        starter: 'queue = []\nqueue.append(1)\nqueue.append(2)\nqueue.append(3)\n# dequeue the FRONT item\n\nprint(queue)\n',
        expectedOutput: '[2, 3]',
        hints: ['pop(0) removes the first item (the front of the queue)', 'queue.pop(0)'],
        xp: 30,
      },
    ],
  },

  // ── WORLD 6 ─────────────────────────────────────────────────────────
  {
    id: 'a6', name: 'Object-Oriented', emoji: '🏛️', colour: '#38bdf8',
    tagline: 'Classes, encapsulation, inheritance',
    challenges: [
      {
        id: 'a6-1', title: 'A Class & Object', skill: 'Define a class with __init__ and a method', specRef: '1.2.4',
        brief: 'Define class Dog with a name and a speak() method returning "name says Woof". Print Dog("Rex").speak(). Output: Rex says Woof',
        concept: 'A <strong>class</strong> is a template; an <strong>object</strong> is an instance of it. <code>__init__</code> is the constructor; <code>self</code> refers to the current object. Attributes store state; methods are its behaviours.',
        starter: 'class Dog:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        # return "<name> says Woof"\n        \n\nprint(Dog("Rex").speak())\n',
        expectedOutput: 'Rex says Woof',
        hints: ['Use an f-string with self.name: f"{self.name} says Woof"', 'return f"{self.name} says Woof"'],
        xp: 35,
      },
      {
        id: 'a6-2', title: 'Encapsulation', skill: 'Update object state through a method', specRef: '1.2.4',
        brief: 'Class Account starts with balance 100. deposit(50), then print the balance. Output: 150',
        concept: '<strong>Encapsulation</strong> bundles data with the methods that change it, so state is updated only through a controlled interface (here, <code>deposit</code>) rather than directly.',
        starter: 'class Account:\n    def __init__(self, balance):\n        self.balance = balance\n    def deposit(self, amount):\n        # increase self.balance by amount\n        \n\nacc = Account(100)\nacc.deposit(50)\nprint(acc.balance)\n',
        expectedOutput: '150',
        hints: ['self.balance = self.balance + amount', 'Or shorthand: self.balance += amount'],
        xp: 40,
      },
      {
        id: 'a6-3', title: 'Inheritance & Overriding', skill: 'Subclass a parent and override a method', specRef: '1.2.4',
        brief: 'Cat inherits from Animal but overrides sound() to return "Meow". Print Cat().sound(). Output: Meow',
        concept: '<strong>Inheritance</strong> lets a subclass reuse a parent\'s code. <strong>Overriding</strong> replaces an inherited method — a form of <strong>polymorphism</strong>, where the same call behaves differently per class.',
        starter: 'class Animal:\n    def sound(self):\n        return "..."\n\nclass Cat(Animal):\n    # override sound() to return "Meow"\n    \n\nprint(Cat().sound())\n',
        expectedOutput: 'Meow',
        hints: ['Define a method with the same name:', 'class Cat(Animal):\n    def sound(self):\n        return "Meow"'],
        xp: 45,
      },
    ],
  },

  // ── WORLD 7 ─────────────────────────────────────────────────────────
  {
    id: 'a7', name: 'Trees, Graphs & Hashing', emoji: '🌳', colour: '#a78bfa',
    tagline: 'Non-linear data structures',
    challenges: [
      {
        id: 'a7-1', title: 'Hash Function', skill: 'Write a simple hash function', specRef: '1.4.2',
        brief: 'Hash the key "cat" into a table of size 10 using (sum of character codes) MOD size. Output: 2',
        concept: 'A <strong>hash table</strong> maps keys to indices using a <strong>hash function</strong>. <code>ord(c)</code> gives a character\'s code; summing them and taking <code>MOD size</code> keeps the index in range.',
        starter: 'key = "cat"\nsize = 10\ntotal = 0\nfor c in key:\n    total = total + ord(c)\n# print total MOD size\n',
        expectedOutput: '2',
        hints: ['Use the modulo operator: total % size', 'print(total % size) — ord values are 99+97+116 = 312, and 312 % 10 = 2'],
        xp: 35,
      },
      {
        id: 'a7-2', title: 'In-Order Traversal', skill: 'Traverse a binary tree recursively', specRef: '1.4.2',
        brief: 'In-order traverse the given binary tree and print values space-separated. Output: 3 4 5 8',
        concept: 'A <strong>binary search tree</strong> stores each node with a left and right child. An <strong>in-order</strong> traversal (left → node → right) visits the values in sorted order.',
        starter: 'tree = {"value": 5,\n        "left": {"value": 3, "left": None,\n                 "right": {"value": 4, "left": None, "right": None}},\n        "right": {"value": 8, "left": None, "right": None}}\n\nout = []\ndef in_order(node):\n    if node is None:\n        return\n    in_order(node["left"])\n    # record this node, then recurse right\n    \n    in_order(node["right"])\n\nin_order(tree)\nprint(" ".join(str(v) for v in out))\n',
        expectedOutput: '3 4 5 8',
        hints: ['Append the current value between the two recursive calls: out.append(node["value"])', 'Order matters: left subtree, then this node, then right subtree'],
        xp: 45,
      },
      {
        id: 'a7-3', title: 'Graph Neighbours', skill: 'Represent a graph as an adjacency list', specRef: '1.4.2',
        brief: 'A graph is stored as an adjacency list (a dictionary). Print the neighbours of node "A". Output: [\'B\', \'C\']',
        concept: 'A <strong>graph</strong> can be stored as an <strong>adjacency list</strong>: a dictionary mapping each node to a list of the nodes it connects to. Look up a node\'s neighbours by key.',
        starter: 'graph = {\n    "A": ["B", "C"],\n    "B": ["D"],\n    "C": ["D"],\n    "D": []\n}\n# print the neighbours of "A"\n',
        expectedOutput: "['B', 'C']",
        hints: ['Index the dictionary by key: graph["A"]', 'print(graph["A"])'],
        xp: 35,
      },
    ],
  },

  // ── WORLD 8 ─────────────────────────────────────────────────────────
  {
    id: 'a8', name: 'Algorithm Mastery', emoji: '⚡', colour: '#f59e0b',
    tagline: 'Combine everything',
    challenges: [
      {
        id: 'a8-1', title: 'Quicksort', skill: 'Implement recursive quicksort', specRef: '2.3.1',
        brief: 'Sort [3, 6, 1, 8, 2] with quicksort and print it. Output: [1, 2, 3, 6, 8]',
        concept: '<strong>Quicksort</strong> is divide-and-conquer: pick a <strong>pivot</strong>, partition the rest into items smaller and larger than it, then recursively sort each partition. Average time <code>O(n log n)</code>.',
        starter: 'def quicksort(lst):\n    if len(lst) <= 1:\n        return lst\n    pivot = lst[0]\n    rest = lst[1:]\n    smaller = [x for x in rest if x <= pivot]\n    larger = [x for x in rest if x > pivot]\n    # return sorted smaller + pivot + sorted larger\n    \n\nprint(quicksort([3, 6, 1, 8, 2]))\n',
        expectedOutput: '[1, 2, 3, 6, 8]',
        hints: ['Recurse on both partitions and rejoin with the pivot in a list', 'return quicksort(smaller) + [pivot] + quicksort(larger)'],
        xp: 50,
      },
      {
        id: 'a8-2', title: 'Binary Search Tree Class', skill: 'Build a BST class with insert and in-order', specRef: '1.4.2',
        brief: 'Insert 5, 3, 8, 1, 4 into a BST, then print an in-order traversal. Output: 1 3 4 5 8',
        concept: 'A proper <strong>BST class</strong> ties together OOP and recursion: inserts place smaller values left and larger values right, so an in-order walk always yields sorted output.',
        starter: 'class Node:\n    def __init__(self, value):\n        self.value = value\n        self.left = None\n        self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n    def insert(self, value):\n        self.root = self._insert(self.root, value)\n    def _insert(self, node, value):\n        if node is None:\n            return Node(value)\n        if value < node.value:\n            node.left = self._insert(node.left, value)\n        else:\n            node.right = self._insert(node.right, value)\n        return node\n    def in_order(self, node, out):\n        if node is None:\n            return\n        # left subtree, then this value, then right subtree\n        \n\ntree = BST()\nfor v in [5, 3, 8, 1, 4]:\n    tree.insert(v)\nresult = []\ntree.in_order(tree.root, result)\nprint(" ".join(str(x) for x in result))\n',
        expectedOutput: '1 3 4 5 8',
        hints: ['Three lines in in_order: recurse left, append value, recurse right', 'self.in_order(node.left, out)\nout.append(node.value)\nself.in_order(node.right, out)'],
        xp: 60,
      },
      {
        id: 'a8-3', title: 'Final Boss: Breadth-First Traversal', skill: 'Traverse a graph with a queue (BFS)', specRef: '2.3.1',
        brief: 'Breadth-first traverse the graph from "A" and print the order visited. Output: A B C D',
        concept: '<strong>Breadth-first search</strong> uses a <strong>queue</strong> to explore a graph level by level: dequeue a node, visit it, then enqueue its unvisited neighbours. It combines graphs, queues and iteration.',
        starter: 'graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}\nvisited = []\nqueue = ["A"]\n\nwhile queue:\n    node = queue.pop(0)\n    if node not in visited:\n        visited.append(node)\n        # enqueue each neighbour that has not been visited\n        \n\nprint(" ".join(visited))\n',
        expectedOutput: 'A B C D',
        hints: ['Loop over graph[node] and append unvisited ones to the queue', 'for n in graph[node]:\n    if n not in visited:\n        queue.append(n)'],
        xp: 75,
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────
export function getAllALevelChallenges(): Challenge[] {
  return PYTHON_ALEVEL_WORLDS.flatMap(w => w.challenges);
}
