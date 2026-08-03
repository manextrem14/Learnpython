
const LearnPage = (function() {
    'use strict';

    /* ─── State ─── */
    let currentLevel = 'beginner';
    let currentLessonId = null;
    let lessonsData = {};
    let pyodideReady = false;
    let pyodide = null;

    /* ─── Lesson Catalog ─── */
    const catalog = {
        beginner: [
            { id: 'b1', title: 'Introduction to Python', duration: '10 min', order: 1 },
            { id: 'b2', title: 'Variables and Data Types', duration: '15 min', order: 2 },
            { id: 'b3', title: 'Basic Operators', duration: '12 min', order: 3 },
            { id: 'b4', title: 'Strings and String Methods', duration: '18 min', order: 4 },
            { id: 'b5', title: 'Input and Output', duration: '12 min', order: 5 },
            { id: 'b6', title: 'Conditional Statements', duration: '20 min', order: 6 },
            { id: 'b7', title: 'Loops — For and While', duration: '22 min', order: 7 },
            { id: 'b8', title: 'Lists and Tuples', duration: '20 min', order: 8 },
            { id: 'b9', title: 'Dictionaries', duration: '18 min', order: 9 },
            { id: 'b10', title: 'Functions Basics', duration: '20 min', order: 10 },
            { id: 'b11', title: 'Function Arguments', duration: '18 min', order: 11 },
            { id: 'b12', title: 'Scope and Lifetime', duration: '15 min', order: 12 },
            { id: 'b13', title: 'List Comprehensions', duration: '15 min', order: 13 },
            { id: 'b14', title: 'Error Handling Basics', duration: '18 min', order: 14 },
            { id: 'b15', title: 'Modules and Imports', duration: '15 min', order: 15 }
        ],
        intermediate: [
            { id: 'i1', title: 'Object-Oriented Programming', duration: '25 min', order: 1 },
            { id: 'i2', title: 'Classes and Objects', duration: '22 min', order: 2 },
            { id: 'i3', title: 'Inheritance', duration: '20 min', order: 3 },
            { id: 'i4', title: 'Polymorphism', duration: '18 min', order: 4 },
            { id: 'i5', title: 'Encapsulation', duration: '18 min', order: 5 },
            { id: 'i6', title: 'File Reading and Writing', duration: '20 min', order: 6 },
            { id: 'i7', title: 'Working with CSV', duration: '18 min', order: 7 },
            { id: 'i8', title: 'JSON Data Handling', duration: '16 min', order: 8 },
            { id: 'i9', title: 'Exception Handling Deep Dive', duration: '22 min', order: 9 },
            { id: 'i10', title: 'Custom Exceptions', duration: '15 min', order: 10 },
            { id: 'i11', title: 'Iterators and Generators', duration: '20 min', order: 11 },
            { id: 'i12', title: 'Decorators', duration: '22 min', order: 12 },
            { id: 'i13', title: 'Lambda Functions', duration: '15 min', order: 13 },
            { id: 'i14', title: 'Map, Filter, and Reduce', duration: '18 min', order: 14 },
            { id: 'i15', title: 'Regular Expressions', duration: '20 min', order: 15 },
            { id: 'i16', title: 'Working with APIs', duration: '22 min', order: 16 },
            { id: 'i17', title: 'Datetime Module', duration: '16 min', order: 17 },
            { id: 'i18', title: 'Project — CLI Task Manager', duration: '30 min', order: 18 }
        ],
        advanced: [
            { id: 'a1', title: 'Advanced Decorators', duration: '25 min', order: 1 },
            { id: 'a2', title: 'Context Managers', duration: '20 min', order: 2 },
            { id: 'a3', title: 'Metaclasses', duration: '22 min', order: 3 },
            { id: 'a4', title: 'Descriptors', duration: '20 min', order: 4 },
            { id: 'a5', title: 'Multithreading', duration: '25 min', order: 5 },
            { id: 'a6', title: 'Multiprocessing', duration: '25 min', order: 6 },
            { id: 'a7', title: 'Asyncio Basics', duration: '22 min', order: 7 },
            { id: 'a8', title: 'Async and Await', duration: '24 min', order: 8 },
            { id: 'a9', title: 'Unit Testing with unittest', duration: '20 min', order: 9 },
            { id: 'a10', title: 'Pytest Framework', duration: '22 min', order: 10 },
            { id: 'a11', title: 'Performance Optimization', duration: '20 min', order: 11 },
            { id: 'a12', title: 'Memory Management', duration: '18 min', order: 12 },
            { id: 'a13', title: 'C Extensions Intro', duration: '20 min', order: 13 },
            { id: 'a14', title: 'Design Patterns in Python', duration: '25 min', order: 14 },
            { id: 'a15', title: 'Building a Web Scraper', duration: '28 min', order: 15 },
            { id: 'a16', title: 'Building an API Server', duration: '30 min', order: 16 },
            { id: 'a17', title: 'Final Project — Build a Game', duration: '40 min', order: 17 }
        ]
    };

    /* ─── Inline Lesson Content (Fallback) ─── */
    const lessonContentDB = {
        'b1': {
            title: 'Introduction to Python',
            intro: 'Python is a high-level, interpreted programming language known for its readability and versatility. i love mangos i know this is noting to do with python but i am writing this to fill the space',
            explanation: `
                <p>Python was created by Guido van Rossum and first released in 1991. It emphasizes code readability with its use of significant whitespace.</p>
                <p>Key characteristics of Python:</p>
                <ul style="margin:1rem 0; padding-left:1.5rem; color:var(--text-secondary);">
                    <li>Easy to read and write</li>
                    <li>Interpreted — no compilation needed</li>
                    <li>Dynamically typed</li>
                    <li>Garbage collected</li>
                    <li>Huge standard library</li>
                </ul>
                <p>Python uses indentation to define blocks of code, unlike many other languages that use braces.</p>
            `,
            examples: [
                {
                    title: 'Your First Python Program',
                    desc: 'The classic "Hello, World!" program in Python is just one line.',
                    code: 'print("Hello, World!")'
                },
                {
                    title: 'Using the Python Shell',
                    desc: 'You can use Python as a calculator directly in the interactive shell.',
                    code: '>>> 2 + 2\n4\n>>> 10 * 5\n50'
                }
            ],
            tips: [
                'Python is case-sensitive — "Print" and "print" are different.',
                'Use comments starting with # to document your code.',
                'Python 3 is the current standard. Avoid Python 2 tutorials.'
            ],
            mistakes: [
                { title: 'Forgetting indentation', desc: 'Python relies on indentation. Inconsistent spaces will cause an IndentationError.' },
                { title: 'Using Python 2 syntax', desc: 'print "hello" works in Python 2 but not Python 3. Always use print("hello").' }
            ],
            practice: {
                instruction: 'Write a program that prints "PythonLearn is awesome!" to the console.',
                starterCode: '# Write your code below\n',
                solution: 'print("PythonLearn is awesome!")'
            },
            challengeId: 'hello-world'
        },
        'b2': {
            title: 'Variables and Data Types',
            intro: 'Variables are containers for storing data values. Python has several built-in data types including integers, floats, strings, and booleans.',
            explanation: `
                <p>In Python, you do not need to declare the type of a variable. The type is inferred from the value assigned.</p>
                <p>Common data types:</p>
                <ul style="margin:1rem 0; padding-left:1.5rem; color:var(--text-secondary);">
                    <li><code>int</code> — Whole numbers like 42, -7</li>
                    <li><code>float</code> — Decimal numbers like 3.14, -0.5</li>
                    <li><code>str</code> — Text strings like "Hello"</li>
                    <li><code>bool</code> — True or False</li>
                </ul>
                <p>Use the <code>type()</code> function to check a variable's data type.</p>
            `,
            examples: [
                {
                    title: 'Creating Variables',
                    desc: 'Assign values to variables using the equals sign.',
                    code: 'name = "Alice"\nage = 25\npi = 3.14159\nis_student = True\n\nprint(type(name))  # <class \'str\'>\nprint(type(age))   # <class \'int\'>'
                },
                {
                    title: 'Multiple Assignment',
                    desc: 'Assign values to multiple variables in one line.',
                    code: 'x, y, z = 10, 20, 30\nprint(x, y, z)  # 10 20 30'
                }
            ],
            tips: [
                'Variable names should be descriptive: use "user_age" instead of "x".',
                'Variable names cannot start with a number.',
                'Use snake_case for variable names in Python.'
            ],
            mistakes: [
                { title: 'Using reserved keywords', desc: 'You cannot name a variable "class", "def", "if", or other reserved words.' },
                { title: 'Confusing = and ==', desc: 'A single = assigns a value. Double == compares values.' }
            ],
            practice: {
                instruction: 'Create three variables: name (your name), age (a number), and is_learning (True). Print all three.',
                starterCode: '# Create your variables here\n\n# Print them\n',
                solution: 'name = "Learner"\nage = 20\nis_learning = True\nprint(name, age, is_learning)'
            },
            challengeId: 'variables'
        },
        'b3': {
            title: 'Basic Operators',
            intro: 'Operators are used to perform operations on variables and values. Python supports arithmetic, comparison, logical, and assignment operators.',
            explanation: `
                <p>Arithmetic operators include <code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>, <code>//</code> (floor division), <code>%</code> (modulo), and <code>**</code> (exponentiation).</p>
                <p>Comparison operators return boolean values: <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>.</p>
            `,
            examples: [
                {
                    title: 'Arithmetic Operations',
                    desc: 'Basic math operations in Python.',
                    code: 'a = 17\nb = 5\n\nprint(a + b)   # 22\nprint(a - b)   # 12\nprint(a * b)   # 85\nprint(a / b)   # 3.4\nprint(a // b)  # 3\nprint(a % b)   # 2\nprint(a ** b)  # 1419857'
                }
            ],
            tips: [
                'Use // for integer division when you need a whole number result.',
                'The % operator is great for checking if a number is even or odd.',
                'Use ** for powers instead of importing math for simple cases.'
            ],
            mistakes: [
                { title: 'Integer division confusion', desc: 'In Python 3, 5 / 2 returns 2.5 (float). Use 5 // 2 to get 2 (int).' }
            ],
            practice: {
                instruction: 'Calculate the area of a rectangle with width 15 and height 8. Then calculate the perimeter. Print both results.',
                starterCode: 'width = 15\nheight = 8\n\n# Calculate area and perimeter\n',
                solution: 'width = 15\nheight = 8\narea = width * height\nperimeter = 2 * (width + height)\nprint("Area:", area)\nprint("Perimeter:", perimeter)'
            },
            challengeId: 'operators'
        }
    };

    /* ─── DOM References ─── */
    const els = {
        levelTabs: document.querySelectorAll('.level-tab'),
        lessonList: document.getElementById('lessonList'),
        lessonView: document.getElementById('lessonView'),
        emptyState: document.getElementById('emptyState'),
        lessonContent: document.getElementById('lessonContent'),
        lessonTitle: document.getElementById('lessonTitle'),
        lessonIntro: document.getElementById('lessonIntro'),
        lessonLevelBadge: document.getElementById('lessonLevelBadge'),
        durationText: document.getElementById('durationText'),
        lessonExplanation: document.getElementById('lessonExplanation'),
        lessonExamples: document.getElementById('lessonExamples'),
        lessonTips: document.getElementById('lessonTips'),
        lessonMistakes: document.getElementById('lessonMistakes'),
        lessonPractice: document.getElementById('lessonPractice'),
        practiceInstruction: document.getElementById('practiceInstruction'),
        practiceCode: document.getElementById('practiceCode'),
        practiceOutput: document.getElementById('practiceOutput'),
        outputBody: document.getElementById('outputBody'),
        prevLessonBtn: document.getElementById('prevLessonBtn'),
        nextLessonBtn: document.getElementById('nextLessonBtn'),
        prevLessonTitle: document.getElementById('prevLessonTitle'),
        nextLessonTitle: document.getElementById('nextLessonTitle'),
        markCompleteBtn: document.getElementById('markCompleteBtn'),
        progressBarMini: document.getElementById('progressBarMini'),
        searchInput: document.querySelector('.search-input'),
        startBeginnerBtn: document.getElementById('startBeginnerBtn'),
        sidebar: document.getElementById('learnSidebar')
    };

    /* ─── Pyodide Loader ─── */
    async function initPyodide() {
        if (pyodideReady) return;
        try {
            els.outputBody.textContent = 'Loading Python runtime...';
            els.practiceOutput.classList.remove('hidden');
            const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs');
            pyodide = await loadPyodide({ stdout: (text) => appendOutput(text), stderr: (text) => appendOutput(text, true) });
            pyodideReady = true;
            els.outputBody.textContent = 'Python runtime ready. You can run your code now.';
            setTimeout(() => els.practiceOutput.classList.add('hidden'), 2000);
        } catch (err) {
            console.error('Pyodide load failed:', err);
            els.outputBody.textContent = 'Failed to load Python runtime. Please check your connection.';
            els.practiceOutput.classList.remove('hidden');
        }
    }

    function appendOutput(text, isError = false) {
        const span = document.createElement('span');
        span.textContent = text + '\n';
        if (isError) span.style.color = 'var(--accent-red)';
        els.outputBody.appendChild(span);
    }

    /* ─── Level Switching ─── */
    function switchLevel(level) {
        currentLevel = level;
        els.levelTabs.forEach(tab => {
            const isActive = tab.dataset.level === level;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        });
        renderLessonList();
        updateProgressBar();
    }

    /* ─── Render Lesson List ─── */
    function renderLessonList(filter = '') {
        const lessons = catalog[currentLevel] || [];
        const lowerFilter = filter.toLowerCase();
        const progress = Storage.getProgress();

        els.lessonList.innerHTML = '';

        lessons.forEach((lesson, index) => {
            if (filter && !lesson.title.toLowerCase().includes(lowerFilter)) return;

            const isCompleted = Storage.isLessonComplete(lesson.id);
            const isActive = currentLessonId === lesson.id;

            const item = document.createElement('button');
            item.className = `lesson-item${isActive ? ' active' : ''}${isCompleted ? ' completed' : ''}`;
            item.setAttribute('data-id', lesson.id);
            item.setAttribute('data-level', currentLevel);
            item.innerHTML = `
                <span class="lesson-item-check">${isCompleted ? '✓' : '○'}</span>
                <div class="lesson-item-info">
                    <div class="lesson-item-title">${Utils.escapeHtml(lesson.title)}</div>
                    <div class="lesson-item-meta">${index + 1} · ${lesson.duration}</div>
                </div>
            `;
            item.addEventListener('click', () => loadLesson(lesson.id, currentLevel));
            els.lessonList.appendChild(item);
        });
    }

    /* ─── Update Mini Progress Bar ─── */
    function updateProgressBar() {
        const lessons = catalog[currentLevel] || [];
        const completed = lessons.filter(l => Storage.isLessonComplete(l.id)).length;
        const pct = lessons.length > 0 ? (completed / lessons.length) * 100 : 0;
        if (els.progressBarMini) {
            els.progressBarMini.style.setProperty('--progress', pct + '%');
        }
    }

    /* ─── Load Lesson Content ─── */
    async function loadLesson(lessonId, level) {
        currentLessonId = lessonId;
        currentLevel = level;

        Storage.setLastLesson(lessonId, level);

        // Update sidebar active state
        document.querySelectorAll('.lesson-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id === lessonId);
        });

        // Try fetching JSON first, fallback to inline DB
        let data = lessonContentDB[lessonId];
        if (!data) {
            try {
                const res = await fetch(`../lessons/${level}/${lessonId}.json`);
                if (res.ok) data = await res.json();
            } catch (e) {
                /* silent fail to fallback */
            }
        }

        if (!data) {
            data = generatePlaceholderLesson(lessonId, level);
        }

        renderLesson(data);
        updateNavButtons(lessonId, level);
        updateProgressBar();

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function generatePlaceholderLesson(id, level) {
        const meta = getLessonMeta(id, level);
        return {
            title: meta ? meta.title : 'Lesson',
            intro: 'This lesson content is loading or unavailable. Please try again later.',
            explanation: '<p>Content not available.</p>',
            examples: [],
            tips: ['Check your connection and try refreshing the page.'],
            mistakes: [],
            practice: { instruction: 'Practice area unavailable.', starterCode: '# unavailable', solution: '' },
            challengeId: null
        };
    }

    function getLessonMeta(id, level) {
        return (catalog[level] || []).find(l => l.id === id);
    }

    /* ─── Render Lesson ─── */
    function renderLesson(data) {
        els.emptyState.classList.add('hidden');
        els.lessonContent.classList.remove('hidden');

        els.lessonTitle.textContent = data.title;
        els.lessonIntro.textContent = data.intro || '';
        els.lessonLevelBadge.textContent = currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1);
        els.lessonLevelBadge.setAttribute('data-level', currentLevel);

        const meta = getLessonMeta(currentLessonId, currentLevel);
        els.durationText.textContent = meta ? meta.duration : '15 min';

        // Explanation
        els.lessonExplanation.innerHTML = data.explanation || '';

        // Examples
        els.lessonExamples.innerHTML = '';
        if (data.examples && data.examples.length) {
            data.examples.forEach(ex => {
                const block = document.createElement('div');
                block.className = 'example-item';
                block.innerHTML = `
                    <div class="example-title">${Utils.escapeHtml(ex.title)}</div>
                    <div class="example-desc">${Utils.escapeHtml(ex.desc)}</div>
                    <div class="code-block">
                        <div class="code-block-header">
                            <span class="code-block-lang">Python</span>
                            <button class="code-block-copy" data-code="${Utils.escapeHtml(ex.code)}">Copy</button>
                        </div>
                        <pre><code>${Utils.escapeHtml(ex.code)}</code></pre>
                    </div>
                `;
                els.lessonExamples.appendChild(block);
            });
        }

        // Copy buttons
        els.lessonExamples.querySelectorAll('.code-block-copy').forEach(btn => {
            btn.addEventListener('click', () => {
                Utils.copyToClipboard(btn.dataset.code);
                btn.textContent = 'Copied!';
                setTimeout(() => btn.textContent = 'Copy', 1500);
            });
        });

        // Tips
        els.lessonTips.innerHTML = '';
        if (data.tips && data.tips.length) {
            data.tips.forEach(tip => {
                const li = document.createElement('li');
                li.textContent = tip;
                els.lessonTips.appendChild(li);
            });
        }

        // Mistakes
        els.lessonMistakes.innerHTML = '';
        if (data.mistakes && data.mistakes.length) {
            data.mistakes.forEach(m => {
                const div = document.createElement('div');
                div.className = 'mistake-item';
                div.innerHTML = `
                    <div>
                        <div class="mistake-title">${Utils.escapeHtml(m.title)}</div>
                        <div class="mistake-desc">${Utils.escapeHtml(m.desc)}</div>
                    </div>
                `;
                els.lessonMistakes.appendChild(div);
            });
        }

        // Practice
        if (data.practice) {
            els.practiceInstruction.textContent = data.practice.instruction;
            els.practiceCode.value = data.practice.starterCode || '';
            els.practiceOutput.classList.add('hidden');
            els.outputBody.innerHTML = '';
            els.outputBody.className = 'output-body';
        }

        // Challenge link
        const challengeLink = document.getElementById('challengeLink');
        if (challengeLink && data.challengeId) {
            challengeLink.href = `challenge.html?id=${data.challengeId}`;
        }

        // Mark complete button state
        const isDone = Storage.isLessonComplete(currentLessonId);
        updateCompleteButton(isDone);

        // Init Pyodide if not ready
        if (!pyodideReady) initPyodide();
    }

    function updateCompleteButton(isDone) {
        if (!els.markCompleteBtn) return;
        if (isDone) {
            els.markCompleteBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Completed</span>
            `;
            els.markCompleteBtn.classList.add('completed');
        } else {
            els.markCompleteBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
                <span>Mark as Complete</span>
            `;
            els.markCompleteBtn.classList.remove('completed');
        }
    }

    /* ─── Navigation Buttons ─── */
    function updateNavButtons(currentId, level) {
        const lessons = catalog[level] || [];
        const idx = lessons.findIndex(l => l.id === currentId);

        if (els.prevLessonBtn) {
            if (idx > 0) {
                els.prevLessonBtn.disabled = false;
                els.prevLessonTitle.textContent = lessons[idx - 1].title;
                els.prevLessonBtn.onclick = () => loadLesson(lessons[idx - 1].id, level);
            } else {
                els.prevLessonBtn.disabled = true;
                els.prevLessonTitle.textContent = '—';
                els.prevLessonBtn.onclick = null;
            }
        }

        if (els.nextLessonBtn) {
            if (idx >= 0 && idx < lessons.length - 1) {
                els.nextLessonBtn.disabled = false;
                els.nextLessonTitle.textContent = lessons[idx + 1].title;
                els.nextLessonBtn.onclick = () => loadLesson(lessons[idx + 1].id, level);
            } else {
                els.nextLessonBtn.disabled = true;
                els.nextLessonTitle.textContent = '—';
                els.nextLessonBtn.onclick = null;
            }
        }
    }

    /* ─── Mark Complete Handler ─── */
    function handleMarkComplete() {
        if (!currentLessonId) return;
        Storage.markLessonComplete(currentLessonId, currentLevel);
        updateCompleteButton(true);
        renderLessonList(els.searchInput ? els.searchInput.value : '');
        App.toast('Lesson marked as complete!', 'success');
    }

    /* ─── Practice Execution ─── */
    async function runPracticeCode() {
        if (!pyodideReady) {
            App.toast('Python runtime is still loading...', 'info');
            return;
        }
        const code = els.practiceCode.value;
        els.outputBody.innerHTML = '';
        els.practiceOutput.classList.remove('hidden');
        els.outputBody.className = 'output-body';

        try {
            await pyodide.runPythonAsync(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
            `);
            await pyodide.runPythonAsync(code);
            const out = await pyodide.runPythonAsync('sys.stdout.getvalue()');
            const err = await pyodide.runPythonAsync('sys.stderr.getvalue()');
            els.outputBody.textContent = out + (err ? '\n' + err : '');
            if (err) els.outputBody.classList.add('error');
        } catch (err) {
            els.outputBody.textContent = err.message || String(err);
            els.outputBody.classList.add('error');
        }
    }

    async function checkPracticeSolution() {
        const data = lessonContentDB[currentLessonId];
        if (!data || !data.practice || !data.practice.solution) {
            App.toast('No solution available for this practice.', 'info');
            return;
        }
        if (!pyodideReady) {
            App.toast('Python runtime is still loading...', 'info');
            return;
        }

        const userCode = els.practiceCode.value.trim();
        const expected = data.practice.solution.trim();

        // Normalize whitespace for comparison
        const normalize = (s) => s.replace(/\s+/g, ' ').trim();
        const match = normalize(userCode) === normalize(expected);

        els.outputBody.innerHTML = '';
        els.practiceOutput.classList.remove('hidden');

        if (match) {
            els.outputBody.textContent = '✓ Correct! Your solution matches the expected answer.';
            els.outputBody.className = 'output-body success';
            App.toast('Correct solution!', 'success');
        } else {
            els.outputBody.textContent = 'Not quite right. Keep trying, or compare your output with the expected result.';
            els.outputBody.className = 'output-body error';
        }
    }

    /* ─── Search ─── */
    function handleSearch(e) {
        const val = e.target.value;
        renderLessonList(val);
    }

    /* ─── URL Params ─── */
    function handleUrlParams() {
        const params = Utils.parseQueryParams();
        if (params.level && catalog[params.level]) {
            switchLevel(params.level);
        }
        if (params.lesson) {
            const level = params.level || currentLevel;
            if (catalog[level] && catalog[level].find(l => l.id === params.lesson)) {
                loadLesson(params.lesson, level);
            }
        }
    }

    /* ─── Event Listeners ─── */
    function bindEvents() {
        els.levelTabs.forEach(tab => {
            tab.addEventListener('click', () => switchLevel(tab.dataset.level));
        });

        if (els.markCompleteBtn) {
            els.markCompleteBtn.addEventListener('click', handleMarkComplete);
        }

        if (els.searchInput) {
            els.searchInput.addEventListener('input', Utils.debounce(handleSearch, 200));
        }

        if (els.startBeginnerBtn) {
            els.startBeginnerBtn.addEventListener('click', () => {
                switchLevel('beginner');
                const first = catalog.beginner[0];
                if (first) loadLesson(first.id, 'beginner');
            });
        }

        document.getElementById('runPracticeBtn')?.addEventListener('click', runPracticeCode);
        document.getElementById('checkPracticeBtn')?.addEventListener('click', checkPracticeSolution);
        document.getElementById('resetPracticeBtn')?.addEventListener('click', () => {
            const data = lessonContentDB[currentLessonId];
            if (data && data.practice) {
                els.practiceCode.value = data.practice.starterCode || '';
            }
            els.practiceOutput.classList.add('hidden');
        });

        // Keyboard: Ctrl+Enter to run
        els.practiceCode?.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                runPracticeCode();
            }
        });

        // Mobile sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle && els.sidebar) {
            sidebarToggle.addEventListener('click', () => {
                els.sidebar.classList.toggle('open');
            });
        }
    }

    /* ─── Public Init ─── */
    function init() {
        bindEvents();
        switchLevel(currentLevel);
        handleUrlParams();

        // Resume last lesson
        const last = Storage.getLastLesson();
        if (last && !Utils.parseQueryParams().lesson) {
            if (catalog[last.level] && catalog[last.level].find(l => l.id === last.lessonId)) {
                switchLevel(last.level);
                loadLesson(last.lessonId, last.level);
            }
        }
    }

    return { init };
})();