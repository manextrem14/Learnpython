
const ChallengePage = (function() {
    'use strict';

    
    let currentChallengeId = null;
    let currentChallenge = null;

    
    const challenges = [
        {
            id: 'hello-world',
            title: 'Hello, World!',
            difficulty: 'easy',
            points: 50,
            tags: ['Basics', 'Output'],
            description: 'Write a program that prints "Hello, World!" to the console.',
            instructions: '<p>Write a Python program that outputs exactly:</p><pre>Hello, World!</pre><p>Use the <code>print()</code> function.</p>',
            starterCode: '# Write your code here\n',
            expectedOutput: 'Hello, World!\n',
            hints: ['Use the print() function.', 'The text must match exactly, including capitalization.'],
            testFn: (stdout) => stdout.trim() === 'Hello, World!'
        },
        {
            id: 'fizzbuzz',
            title: 'FizzBuzz Classic',
            difficulty: 'easy',
            points: 100,
            tags: ['Loops', 'Conditionals'],
            description: 'Print numbers 1 to 100. For multiples of 3 print "Fizz", for 5 print "Buzz", for both print "FizzBuzz".',
            instructions: '<p>Write a program that prints the numbers from 1 to 100. But for multiples of three print "Fizz" instead of the number and for the multiples of five print "Buzz". For numbers which are multiples of both three and five print "FizzBuzz".</p><p>Each value should be on its own line.</p>',
            starterCode: 'for i in range(1, 101):\n    # Your code here\n    print(i)\n',
            expectedOutput: '1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n',
            hints: ['Use the modulo operator % to check for multiples.', 'Check for FizzBuzz first, then Fizz, then Buzz.'],
            testFn: (stdout) => {
                const lines = stdout.trim().split('\n');
                if (lines.length !== 100) return false;
                return lines.every((line, i) => {
                    const n = i + 1;
                    if (n % 15 === 0) return line === 'FizzBuzz';
                    if (n % 3 === 0) return line === 'Fizz';
                    if (n % 5 === 0) return line === 'Buzz';
                    return line === String(n);
                });
            }
        },
        {
            id: 'palindrome',
            title: 'Palindrome Checker',
            difficulty: 'medium',
            points: 250,
            tags: ['Strings', 'Functions'],
            description: 'Create a function that checks if a string is a palindrome, ignoring case and non-alphanumeric characters.',
            instructions: '<p>Write a function <code>is_palindrome(text)</code> that returns <code>True</code> if the given string is a palindrome, and <code>False</code> otherwise.</p><p>A palindrome reads the same forwards and backwards. Ignore case and non-alphanumeric characters.</p><p>Test your function by calling it with "A man a plan a canal Panama" and "hello".</p>',
            starterCode: 'def is_palindrome(text):\n    # Your code here\n    pass\n\n# Test cases\nprint(is_palindrome("A man a plan a canal Panama"))\nprint(is_palindrome("hello"))\n',
            expectedOutput: 'True\nFalse\n',
            hints: ['Remove non-alphanumeric characters and convert to lowercase.', 'Compare the string with its reverse.'],
            testFn: (stdout) => stdout.trim() === 'True\nFalse'
        },
        {
            id: 'factorial',
            title: 'Factorial Calculator',
            difficulty: 'easy',
            points: 75,
            tags: ['Math', 'Recursion'],
            description: 'Write a function that calculates the factorial of a number using recursion.',
            instructions: '<p>Write a function <code>factorial(n)</code> that returns the factorial of n using recursion.</p><p>Remember: factorial(0) = 1, and factorial(n) = n * factorial(n-1).</p><p>Print factorial(5) and factorial(7).</p>',
            starterCode: 'def factorial(n):\n    # Your code here\n    pass\n\nprint(factorial(5))\nprint(factorial(7))\n',
            expectedOutput: '120\n5040\n',
            hints: ['Base case: if n is 0 or 1, return 1.', 'Recursive case: return n * factorial(n - 1).'],
            testFn: (stdout) => stdout.trim() === '120\n5040'
        },
        {
            id: 'sum-list',
            title: 'Sum of List',
            difficulty: 'easy',
            points: 50,
            tags: ['Lists', 'Functions'],
            description: 'Write a function that returns the sum of all numbers in a list without using the built-in sum().',
            instructions: '<p>Write a function <code>list_sum(numbers)</code> that returns the sum of all elements in a list. Do not use the built-in <code>sum()</code> function.</p><p>Print list_sum([1, 2, 3, 4, 5]) and list_sum([10, -5, 3]).</p>',
            starterCode: 'def list_sum(numbers):\n    # Your code here\n    pass\n\nprint(list_sum([1, 2, 3, 4, 5]))\nprint(list_sum([10, -5, 3]))\n',
            expectedOutput: '15\n8\n',
            hints: ['Initialize a total variable to 0.', 'Loop through each number and add it to total.'],
            testFn: (stdout) => stdout.trim() === '15\n8'
        },
        {
            id: 'bst',
            title: 'Binary Search Tree',
            difficulty: 'hard',
            points: 500,
            tags: ['Data Structures', 'OOP'],
            description: 'Implement a binary search tree with insert, search, and in-order traversal methods.',
            instructions: '<p>Create a <code>Node</code> class and a <code>BST</code> class with <code>insert(val)</code>, <code>search(val)</code>, and <code>inorder()</code> methods.</p><p>Insert 5, 3, 7, 1, 4, 6, 8. Print the inorder traversal and search results for 4 and 10.</p>',
            starterCode: 'class Node:\n    def __init__(self, val):\n        self.val = val\n        self.left = None\n        self.right = None\n\nclass BST:\n    def __init__(self):\n        self.root = None\n    \n    def insert(self, val):\n        # Your code here\n        pass\n    \n    def search(self, val):\n        # Your code here\n        pass\n    \n    def inorder(self):\n        # Your code here\n        pass\n\ntree = BST()\nfor val in [5, 3, 7, 1, 4, 6, 8]:\n    tree.insert(val)\n\nprint(tree.inorder())\nprint(tree.search(4))\nprint(tree.search(10))\n',
            expectedOutput: '[1, 3, 4, 5, 6, 7, 8]\nTrue\nFalse\n',
            hints: ['In insert, traverse left if val < node.val, right otherwise.', 'Inorder traversal: left, current, right (recursive).'],
            testFn: (stdout) => stdout.trim() === '[1, 3, 4, 5, 6, 7, 8]\nTrue\nFalse'
        },
        {
            id: 'fibonacci',
            title: 'Fibonacci Sequence',
            difficulty: 'easy',
            points: 75,
            tags: ['Math', 'Loops'],
            description: 'Generate the first n numbers of the Fibonacci sequence.',
            instructions: '<p>Write a function <code>fibonacci(n)</code> that returns a list of the first n Fibonacci numbers.</p><p>The sequence starts: 0, 1, 1, 2, 3, 5, 8...</p><p>Print fibonacci(10).</p>',
            starterCode: 'def fibonacci(n):\n    # Your code here\n    pass\n\nprint(fibonacci(10))\n',
            expectedOutput: '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]\n',
            hints: ['Start with a list containing [0, 1].', 'Each new number is the sum of the previous two.'],
            testFn: (stdout) => stdout.trim() === '[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]'
        },
        {
            id: 'anagram',
            title: 'Anagram Checker',
            difficulty: 'medium',
            points: 200,
            tags: ['Strings', 'Sorting'],
            description: 'Check if two strings are anagrams of each other.',
            instructions: '<p>Write a function <code>is_anagram(s1, s2)</code> that returns <code>True</code> if the two strings are anagrams (contain the same letters in any order), ignoring case and spaces.</p><p>Test with "listen" and "silent", and "hello" and "world".</p>',
            starterCode: 'def is_anagram(s1, s2):\n    # Your code here\n    pass\n\nprint(is_anagram("listen", "silent"))\nprint(is_anagram("hello", "world"))\n',
            expectedOutput: 'True\nFalse\n',
            hints: ['Remove spaces and convert to lowercase.', 'Sort both strings and compare.'],
            testFn: (stdout) => stdout.trim() === 'True\nFalse'
        },
        {
            id: 'prime-sieve',
            title: 'Prime Number Sieve',
            difficulty: 'medium',
            points: 250,
            tags: ['Math', 'Algorithms'],
            description: 'Find all prime numbers up to n using the Sieve of Eratosthenes.',
            instructions: '<p>Implement the Sieve of Eratosthenes to find all prime numbers up to n.</p><p>Write a function <code>sieve(n)</code> that returns a list of primes up to n (inclusive).</p><p>Print sieve(30).</p>',
            starterCode: 'def sieve(n):\n    # Your code here\n    pass\n\nprint(sieve(30))\n',
            expectedOutput: '[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]\n',
            hints: ['Create a boolean array of size n+1, all True.', 'Mark multiples of each prime starting from 2 as False.'],
            testFn: (stdout) => stdout.trim() === '[2, 3, 5, 7, 11, 13, 17, 19, 23, 29]'
        },
        {
            id: 'word-count',
            title: 'Word Frequency',
            difficulty: 'medium',
            points: 200,
            tags: ['Dictionaries', 'Strings'],
            description: 'Count the frequency of each word in a sentence.',
            instructions: '<p>Write a function <code>word_count(text)</code> that returns a dictionary with each word as a key and its frequency as the value. Ignore case and punctuation.</p><p>Test with: "The quick brown fox jumps over the lazy dog. The fox was quick!"</p>',
            starterCode: 'def word_count(text):\n    # Your code here\n    pass\n\nsentence = "The quick brown fox jumps over the lazy dog. The fox was quick!"\nprint(word_count(sentence))\n',
            expectedOutput: "{'the': 3, 'quick': 2, 'brown': 1, 'fox': 2, 'jumps': 1, 'over': 1, 'lazy': 1, 'dog': 1, 'was': 1}\n",
            hints: ['Convert to lowercase and remove punctuation.', 'Split by spaces and count occurrences with a dictionary.'],
            testFn: (stdout) => stdout.trim().toLowerCase().includes("'the': 3") && stdout.trim().toLowerCase().includes("'quick': 2")
        },
        {
            id: 'decorator',
            title: 'Timing Decorator',
            difficulty: 'hard',
            points: 400,
            tags: ['Decorators', 'Advanced'],
            description: 'Create a decorator that measures and prints the execution time of a function.',
            instructions: '<p>Write a decorator <code>@timer</code> that wraps a function and prints how long it took to execute in milliseconds.</p><p>Apply it to a function that sleeps for 0.1 seconds and returns "Done".</p>',
            starterCode: 'import time\n\ndef timer(func):\n    # Your code here\n    pass\n\n@timer\ndef slow_function():\n    time.sleep(0.1)\n    return "Done"\n\nprint(slow_function())\n',
            expectedOutput: 'Done\n',
            hints: ['Use time.time() to record start and end.', 'Use functools.wraps to preserve function metadata.'],
            testFn: (stdout) => stdout.trim().includes('Done')
        }
    ];

    
    const els = {
        grid: document.getElementById('challengeGrid'),
        listView: document.getElementById('challengeListView'),
        solveView: document.getElementById('challengeSolveView'),
        difficultyFilter: document.getElementById('difficultyFilter'),
        statusFilter: document.getElementById('statusFilter'),
        searchInput: document.getElementById('challengeSearch'),
        completedCount: document.getElementById('completedCount'),
        totalPoints: document.getElementById('totalPoints'),
        pendingCount: document.getElementById('pendingCount'),
        solveTitle: document.getElementById('solveTitle'),
        solveDifficulty: document.getElementById('solveDifficulty'),
        solvePoints: document.getElementById('solvePoints'),
        solveInstructions: document.getElementById('solveInstructions'),
        solveExpected: document.getElementById('solveExpected'),
        hintsList: document.getElementById('hintsList'),
        solveTextarea: document.getElementById('solveTextarea'),
        solveLineNumbers: document.getElementById('solveLineNumbers'),
        solveOutputBody: document.getElementById('solveOutputBody'),
        solveOutputPanel: document.getElementById('solveOutputPanel')
    };

   
    function renderGrid() {
        const diffFilter = els.difficultyFilter ? els.difficultyFilter.value : 'all';
        const statusFilter = els.statusFilter ? els.statusFilter.value : 'all';
        const search = els.searchInput ? els.searchInput.value.toLowerCase() : '';

        els.grid.innerHTML = '';

        let completed = 0;
        let points = 0;
        let pending = 0;

        challenges.forEach(ch => {
            const isCompleted = Storage.isChallengeComplete(ch.id);
            if (isCompleted) {
                completed++;
                points += ch.points;
            } else {
                pending++;
            }

            // Filters
            if (diffFilter !== 'all' && ch.difficulty !== diffFilter) return;
            if (statusFilter === 'completed' && !isCompleted) return;
            if (statusFilter === 'pending' && isCompleted) return;
            if (search && !ch.title.toLowerCase().includes(search) && !ch.description.toLowerCase().includes(search)) return;

            const card = document.createElement('article');
            card.className = `challenge-card glass-card${isCompleted ? ' completed' : ''}`;
            card.setAttribute('role', 'listitem');
            card.innerHTML = `
                <div class="challenge-card-header">
                    <span class="difficulty-badge ${ch.difficulty}">${ch.difficulty}</span>
                    <span class="challenge-card-points">${ch.points} pts</span>
                </div>
                <h3 class="challenge-card-title">${Utils.escapeHtml(ch.title)}</h3>
                <p class="challenge-card-desc">${Utils.escapeHtml(ch.description)}</p>
                <div class="challenge-card-footer">
                    <div class="challenge-card-tags">
                        ${ch.tags.map(t => `<span class="tag">${Utils.escapeHtml(t)}</span>`).join('')}
                    </div>
                    <span class="challenge-card-arrow" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            `;
            card.addEventListener('click', () => openChallenge(ch.id));
            els.grid.appendChild(card);
        });

        if (els.completedCount) els.completedCount.textContent = completed;
        if (els.totalPoints) els.totalPoints.textContent = points;
        if (els.pendingCount) els.pendingCount.textContent = pending;
    }

    
    function openChallenge(id) {
        const ch = challenges.find(c => c.id === id);
        if (!ch) return;

        currentChallengeId = id;
        currentChallenge = ch;

        // Populate solve view
        els.solveTitle.textContent = ch.title;
        els.solveDifficulty.textContent = ch.difficulty;
        els.solveDifficulty.className = 'solve-difficulty ' + ch.difficulty;
        els.solvePoints.textContent = ch.points + ' pts';
        els.solveInstructions.innerHTML = ch.instructions;
        els.solveExpected.textContent = ch.expectedOutput;

        // Hints
        els.hintsList.innerHTML = '';
        ch.hints.forEach((hint, i) => {
            const div = document.createElement('div');
            div.className = 'hint-item';
            div.innerHTML = `<div class="hint-content">${Utils.escapeHtml(hint)}</div>`;
            div.addEventListener('click', () => div.classList.add('revealed'));
            els.hintsList.appendChild(div);
        });

        // Load saved or starter code
        const saved = Storage.getEditorCode('challenge_' + id);
        els.solveTextarea.value = saved || ch.starterCode;
        updateSolveLineNumbers();

        // Clear output
        els.solveOutputBody.innerHTML = '';
        els.solveOutputBody.className = 'solve-output-body';

        // Switch views
        els.listView.classList.add('hidden');
        els.solveView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    
    function backToList() {
        els.solveView.classList.add('hidden');
        els.listView.classList.remove('hidden');
        currentChallengeId = null;
        currentChallenge = null;
        window.scrollTo({ top: 0, behavior: 'instant' });
        renderGrid();
    }

    
    function updateSolveLineNumbers() {
        if (!els.solveTextarea || !els.solveLineNumbers) return;
        const lines = els.solveTextarea.value.split('\n').length;
        els.solveLineNumbers.innerHTML = '';
        for (let i = 1; i <= lines; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            els.solveLineNumbers.appendChild(span);
        }
    }

    function syncSolveScroll() {
        if (els.solveLineNumbers && els.solveTextarea) {
            els.solveLineNumbers.scrollTop = els.solveTextarea.scrollTop;
        }
    }

    
    async function runSolution() {
        if (!currentChallenge) return;
        const code = els.solveTextarea.value;

        els.solveOutputBody.innerHTML = '<div class="output-line">Running...</div>';
        els.solveOutputBody.className = 'solve-output-body';

        try {
            const result = await PyodideRuntime.run(code);

            els.solveOutputBody.innerHTML = '';
            if (result.stdout) {
                result.stdout.split('\n').forEach(line => {
                    if (line || result.stdout.endsWith('\n')) {
                        const span = document.createElement('span');
                        span.className = 'output-line';
                        span.textContent = line;
                        els.solveOutputBody.appendChild(span);
                    }
                });
            }
            if (result.stderr) {
                result.stderr.split('\n').forEach(line => {
                    if (line) {
                        const span = document.createElement('span');
                        span.className = 'output-line error';
                        span.textContent = line;
                        els.solveOutputBody.appendChild(span);
                    }
                });
            }
            if (result.error && !result.stderr) {
                const span = document.createElement('span');
                span.className = 'output-line error';
                span.textContent = result.error;
                els.solveOutputBody.appendChild(span);
            }
        } catch (err) {
            els.solveOutputBody.innerHTML = `<span class="output-line error">Execution failed: ${Utils.escapeHtml(err.message || String(err))}</span>`;
        }
    }

    
    async function submitSolution() {
        if (!currentChallenge) return;
        const code = els.solveTextarea.value;

        els.solveOutputBody.innerHTML = '<div class="output-line">Checking solution...</div>';

        try {
            const result = await PyodideRuntime.run(code);
            const stdout = result.stdout || '';
            const passed = currentChallenge.testFn(stdout);

            els.solveOutputBody.innerHTML = '';

            if (passed) {
                els.solveOutputBody.className = 'solve-output-body success';
                els.solveOutputBody.innerHTML = `<span class="output-line success">✓ Challenge completed! You earned ${currentChallenge.points} points.</span>`;

                if (!Storage.isChallengeComplete(currentChallengeId)) {
                    Storage.markChallengeComplete(currentChallengeId, currentChallenge.points);
                    App.toast(`Challenge completed! +${currentChallenge.points} points`, 'success');
                } else {
                    App.toast('Correct solution!', 'success');
                }
            } else {
                els.solveOutputBody.className = 'solve-output-body error';
                els.solveOutputBody.innerHTML = `<span class="output-line error">✗ Output does not match expected result. Keep trying!</span>`;

                // Show expected vs actual
                const actualDiv = document.createElement('div');
                actualDiv.style.marginTop = '8px';
                actualDiv.innerHTML = `
                    <div style="color:var(--text-tertiary);font-size:11px;margin-bottom:4px;">Your output:</div>
                    <pre style="background:var(--bg-elevated);padding:8px;border-radius:4px;font-size:12px;overflow-x:auto;">${Utils.escapeHtml(stdout || '(empty)')}</pre>
                `;
                els.solveOutputBody.appendChild(actualDiv);
            }
        } catch (err) {
            els.solveOutputBody.className = 'solve-output-body error';
            els.solveOutputBody.innerHTML = `<span class="output-line error">Error: ${Utils.escapeHtml(err.message || String(err))}</span>`;
        }
    }

    
    function resetSolution() {
        if (!currentChallenge) return;
        els.solveTextarea.value = currentChallenge.starterCode;
        Storage.saveEditorCode('', 'challenge_' + currentChallengeId);
        els.solveOutputBody.innerHTML = '';
        els.solveOutputBody.className = 'solve-output-body';
        updateSolveLineNumbers();
    }

    
    function autoSave() {
        if (!currentChallengeId) return;
        Storage.saveEditorCode(els.solveTextarea.value, 'challenge_' + currentChallengeId);
    }

    
    function handleTab(e) {
        if (e.key !== 'Tab') return;
        e.preventDefault();
        const ta = els.solveTextarea;
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const tab = '    ';

        if (e.shiftKey) {
            const before = ta.value.substring(0, start);
            const after = ta.value.substring(end);
            const lineStart = before.lastIndexOf('\n') + 1;
            const line = ta.value.substring(lineStart, end);
            if (line.startsWith(tab)) {
                ta.value = before.substring(0, lineStart) + line.substring(4) + after;
                ta.selectionStart = start - 4;
                ta.selectionEnd = end - 4;
            }
        } else {
            ta.value = ta.value.substring(0, start) + tab + ta.value.substring(end);
            ta.selectionStart = ta.selectionEnd = start + 4;
        }
        autoSave();
    }

    
    function bindEvents() {
        if (els.difficultyFilter) els.difficultyFilter.addEventListener('change', renderGrid);
        if (els.statusFilter) els.statusFilter.addEventListener('change', renderGrid);
        if (els.searchInput) els.searchInput.addEventListener('input', Utils.debounce(renderGrid, 200));

        document.getElementById('backToListBtn')?.addEventListener('click', backToList);
        document.getElementById('runSolutionBtn')?.addEventListener('click', runSolution);
        document.getElementById('submitSolutionBtn')?.addEventListener('click', submitSolution);
        document.getElementById('resetSolutionBtn')?.addEventListener('click', resetSolution);
        document.getElementById('clearSolveOutput')?.addEventListener('click', () => {
            els.solveOutputBody.innerHTML = '';
            els.solveOutputBody.className = 'solve-output-body';
        });

        if (els.solveTextarea) {
            els.solveTextarea.addEventListener('input', () => {
                updateSolveLineNumbers();
                autoSave();
            });
            els.solveTextarea.addEventListener('scroll', syncSolveScroll);
            els.solveTextarea.addEventListener('keydown', handleTab);
            els.solveTextarea.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    runSolution();
                }
            });
        }
    }

    
    function handleUrlParams() {
        const params = Utils.parseQueryParams();
        if (params.id) {
            const ch = challenges.find(c => c.id === params.id);
            if (ch) openChallenge(ch.id);
        }
    }

    
    function init() {
        renderGrid();
        bindEvents();
        handleUrlParams();

        // Preload Pyodide
        if (!PyodideRuntime.isReady() && !PyodideRuntime.isLoading()) {
            PyodideRuntime.load();
        }
    }

    return { init };
})();s