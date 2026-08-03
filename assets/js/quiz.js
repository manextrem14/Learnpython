

const QuizPage = (function() {
    'use strict';

    /* ─── State ─── */
    let currentQuizId = null;
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let selectedOption = null;
    let score = 0;
    let answers = []; // { questionIndex, selected, correct, correctIndex }

    /* ─── Quiz Catalog ─── */
    const quizzes = [
        {
            id: 'q1',
            title: 'Python Basics',
            level: 'beginner',
            description: 'Test your understanding of variables, data types, operators, and basic syntax.',
            questions: [
                {
                    question: 'What is the correct way to create a variable in Python?',
                    options: ['var x = 5', 'x = 5', 'int x = 5', 'let x = 5'],
                    correct: 1,
                    explanation: 'In Python, you simply assign a value using the equals sign. No keyword like var, let, or type declaration is needed.'
                },
                {
                    question: 'Which of the following is a valid string in Python?',
                    options: ['"Hello"', "'Hello'", 'Both are valid', 'Neither is valid'],
                    correct: 2,
                    explanation: 'Python allows both single and double quotes for strings. You can use whichever is more convenient.'
                },
                {
                    question: 'What does the // operator do?',
                    options: ['Division', 'Floor division', 'Comment', 'Exponentiation'],
                    correct: 1,
                    explanation: 'The // operator performs floor division, which rounds down to the nearest whole number. For example, 7 // 2 equals 3.'
                },
                {
                    question: 'What is the output of type(3.14)?',
                    options: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'double\'>'],
                    correct: 1,
                    explanation: '3.14 is a floating-point number, so type(3.14) returns <class \'float\'>.'
                },
                {
                    question: 'Which function is used to get user input?',
                    options: ['scan()', 'input()', 'read()', 'get()'],
                    correct: 1,
                    explanation: 'The input() function reads a line from input and returns it as a string.'
                }
            ]
        },
        {
            id: 'q2',
            title: 'Control Flow',
            level: 'beginner',
            description: 'If statements, loops, and logical operators.',
            questions: [
                {
                    question: 'What is the correct syntax for an if statement?',
                    options: ['if x > 5:', 'if (x > 5)', 'if x > 5 then:', 'if x > 5'],
                    correct: 0,
                    explanation: 'Python if statements end with a colon and do not require parentheses.'
                },
                {
                    question: 'Which loop is used when you know the number of iterations?',
                    options: ['while', 'for', 'do-while', 'loop'],
                    correct: 1,
                    explanation: 'The for loop is typically used when iterating over a known sequence or range.'
                },
                {
                    question: 'What does break do in a loop?',
                    options: ['Skips one iteration', 'Exits the loop entirely', 'Restarts the loop', 'Does nothing'],
                    correct: 1,
                    explanation: 'The break statement immediately terminates the loop and transfers execution to the statement following the loop.'
                },
                {
                    question: 'What is the output of bool(0)?',
                    options: ['True', 'False', 'Error', 'None'],
                    correct: 1,
                    explanation: 'In Python, 0 is considered falsy, so bool(0) returns False.'
                },
                {
                    question: 'What keyword is used with try for error handling?',
                    options: ['catch', 'except', 'error', 'finally'],
                    correct: 1,
                    explanation: 'Python uses except (not catch) to handle exceptions in a try block.'
                }
            ]
        },
        {
            id: 'q3',
            title: 'Data Structures',
            level: 'beginner',
            description: 'Lists, tuples, dictionaries, and sets.',
            questions: [
                {
                    question: 'Which data structure is mutable?',
                    options: ['Tuple', 'String', 'List', 'Set'],
                    correct: 2,
                    explanation: 'Lists are mutable in Python, meaning you can change their contents after creation.'
                },
                {
                    question: 'How do you access the value for key "name" in a dictionary d?',
                    options: ['d["name"]', 'd.name', 'd.get("name")', 'Both A and C'],
                    correct: 3,
                    explanation: 'Both d["name"] and d.get("name") work. get() returns None instead of raising an error if the key is missing.'
                },
                {
                    question: 'What is the result of len([1, 2, 3])?',
                    options: ['2', '3', '4', 'Error'],
                    correct: 1,
                    explanation: 'len() returns the number of items in the list, which is 3.'
                },
                {
                    question: 'Which method adds an item to the end of a list?',
                    options: ['add()', 'append()', 'push()', 'insert()'],
                    correct: 1,
                    explanation: 'The append() method adds a single item to the end of a list.'
                },
                {
                    question: 'What is the key characteristic of a set?',
                    options: ['Ordered', 'Mutable', 'No duplicates', 'Indexed'],
                    correct: 2,
                    explanation: 'Sets automatically remove duplicate values and do not allow duplicates.'
                }
            ]
        },
        {
            id: 'q4',
            title: 'Functions & OOP',
            level: 'intermediate',
            description: 'Function definitions, arguments, classes, and objects.',
            questions: [
                {
                    question: 'What does *args allow in a function?',
                    options: ['Keyword arguments', 'Variable positional arguments', 'Default values', 'Return multiple values'],
                    correct: 1,
                    explanation: '*args collects extra positional arguments into a tuple.'
                },
                {
                    question: 'What is the first parameter of an instance method typically called?',
                    options: ['self', 'this', 'cls', 'obj'],
                    correct: 0,
                    explanation: 'By convention, the first parameter of an instance method is called self, referring to the instance.'
                },
                {
                    question: 'What does @staticmethod do?',
                    options: ['Makes a method private', 'Creates a class method', 'Creates a method that does not use self', 'Makes it abstract'],
                    correct: 2,
                    explanation: '@staticmethod defines a method that does not receive the implicit self or cls argument.'
                },
                {
                    question: 'What is method overloading in Python?',
                    options: ['Built-in feature', 'Not directly supported', 'Requires @overload', 'Both B and C'],
                    correct: 3,
                    explanation: 'Python does not natively support method overloading by signature, but you can use @overload from typing or default arguments.'
                },
                {
                    question: 'What does __init__ represent?',
                    options: ['Destructor', 'Constructor', 'String representation', 'Iterator'],
                    correct: 1,
                    explanation: '__init__ is the initializer (constructor) called when a new instance is created.'
                }
            ]
        },
        {
            id: 'q5',
            title: 'File Handling & Modules',
            level: 'intermediate',
            description: 'Reading files, JSON, CSV, and importing modules.',
            questions: [
                {
                    question: 'Which mode opens a file for reading?',
                    options: ['w', 'r', 'a', 'x'],
                    correct: 1,
                    explanation: 'Mode "r" opens a file for reading (default).'
                },
                {
                    question: 'What does the with statement do with files?',
                    options: ['Copies the file', 'Ensures proper closure', 'Deletes after use', 'Locks the file'],
                    correct: 1,
                    explanation: 'The with statement creates a context manager that automatically closes the file, even if errors occur.'
                },
                {
                    question: 'Which module is used for JSON in Python?',
                    options: ['json', 'pickle', 'csv', 'xml'],
                    correct: 0,
                    explanation: 'The built-in json module provides methods like json.load() and json.dumps().'
                },
                {
                    question: 'How do you import only sqrt from math?',
                    options: ['import math.sqrt', 'from math import sqrt', 'import sqrt from math', 'include math.sqrt'],
                    correct: 1,
                    explanation: 'from math import sqrt imports only the sqrt function from the math module.'
                },
                {
                    question: 'What does json.dumps() do?',
                    options: ['Reads JSON from file', 'Parses JSON string', 'Converts Python object to JSON string', 'Validates JSON'],
                    correct: 2,
                    explanation: 'json.dumps() serializes a Python object into a JSON-formatted string.'
                }
            ]
        },
        {
            id: 'q6',
            title: 'Advanced Python',
            level: 'advanced',
            description: 'Decorators, generators, concurrency, and metaclasses.',
            questions: [
                {
                    question: 'What does yield do in a function?',
                    options: ['Returns and exits', 'Pauses and saves state', 'Raises an error', 'Imports a module'],
                    correct: 1,
                    explanation: 'yield turns a function into a generator, pausing execution and saving state between iterations.'
                },
                {
                    question: 'What is a decorator in Python?',
                    options: ['A design pattern', 'A function that wraps another function', 'A class attribute', 'A type of loop'],
                    correct: 1,
                    explanation: 'A decorator is a function that takes another function as input, extends its behavior, and returns a new function.'
                },
                {
                    question: 'What does asyncio provide?',
                    options: ['Multithreading', 'Multiprocessing', 'Asynchronous I/O', 'Memory management'],
                    correct: 2,
                    explanation: 'asyncio is a library for writing concurrent code using the async/await syntax, primarily for I/O-bound tasks.'
                },
                {
                    question: 'What is a metaclass?',
                    options: ['A class that inherits from another', 'A class that creates classes', 'A static method', 'A type of exception'],
                    correct: 1,
                    explanation: 'A metaclass is a class whose instances are classes. It controls class creation.'
                },
                {
                    question: 'What does the GIL stand for?',
                    options: ['Global Interpreter Lock', 'General Input Loop', 'Generic Interface Layer', 'Global Import List'],
                    correct: 0,
                    explanation: 'The Global Interpreter Lock (GIL) is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once.'
                }
            ]
        }
    ];

    /* ─── DOM References ─── */
    const els = {
        grid: document.getElementById('quizGrid'),
        listView: document.getElementById('quizListView'),
        activeView: document.getElementById('quizActiveView'),
        resultsView: document.getElementById('quizResultsView'),
        progressFill: document.getElementById('quizProgressFill'),
        counter: document.getElementById('quizCounter'),
        scoreLive: document.getElementById('quizScoreLive'),
        question: document.getElementById('quizQuestion'),
        options: document.getElementById('quizOptions'),
        explanation: document.getElementById('quizExplanation'),
        explanationStatus: document.getElementById('explanationStatus'),
        explanationText: document.getElementById('explanationText'),
        submitBtn: document.getElementById('submitAnswerBtn'),
        nextBtn: document.getElementById('nextQuestionBtn'),
        resultsTitle: document.getElementById('resultsTitle'),
        resultsScore: document.getElementById('resultsScore'),
        resultsPercentage: document.getElementById('resultsPercentage'),
        resultsMessage: document.getElementById('resultsMessage'),
        resultsBreakdown: document.getElementById('resultsBreakdown'),
        resultsIcon: document.getElementById('resultsIcon'),
        completedCount: document.getElementById('quizCompletedCount'),
        avgScore: document.getElementById('quizAvgScore'),
        totalQuestions: document.getElementById('quizTotalQuestions')
    };

    /* ─── Render Quiz Grid ─── */
    function renderGrid() {
        let completed = 0;
        let totalScore = 0;
        let totalQs = 0;

        els.grid.innerHTML = '';

        quizzes.forEach(qz => {
            const saved = Storage.getQuizScore(qz.id);
            totalQs += qz.questions.length;
            if (saved) {
                completed++;
                totalScore += Math.round((saved.score / saved.total) * 100);
            }

            const card = document.createElement('article');
            card.className = `quiz-card-item glass-card${saved ? ' completed' : ''}`;
            card.setAttribute('role', 'listitem');
            card.innerHTML = `
                <div class="quiz-card-header-row">
                    <span class="quiz-card-questions">${qz.questions.length} questions</span>
                    ${saved ? `<span class="quiz-card-best">Best: ${Math.round((saved.bestScore / saved.total) * 100)}%</span>` : ''}
                </div>
                <h3 class="quiz-card-title">${Utils.escapeHtml(qz.title)}</h3>
                <p class="quiz-card-desc">${Utils.escapeHtml(qz.description)}</p>
                <div class="quiz-card-footer">
                    <span class="quiz-card-level ${qz.level}">${qz.level}</span>
                    <span class="quiz-card-arrow" aria-hidden="true">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M4.167 10h11.666m0 0L10 4.167M15.833 10L10 15.833" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </span>
                </div>
            `;
            card.addEventListener('click', () => startQuiz(qz.id));
            els.grid.appendChild(card);
        });

        if (els.completedCount) els.completedCount.textContent = completed;
        if (els.avgScore) els.avgScore.textContent = completed > 0 ? Math.round(totalScore / completed) + '%' : '0%';
        if (els.totalQuestions) els.totalQuestions.textContent = totalQs;
    }

    /* ─── Start Quiz ─── */
    function startQuiz(id) {
        const qz = quizzes.find(q => q.id === id);
        if (!qz) return;

        currentQuizId = id;
        currentQuiz = qz;
        currentQuestionIndex = 0;
        score = 0;
        selectedOption = null;
        answers = [];

        els.listView.classList.add('hidden');
        els.resultsView.classList.add('hidden');
        els.activeView.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'instant' });

        renderQuestion();
    }

    /* ─── Render Question ─── */
    function renderQuestion() {
        const q = currentQuiz.questions[currentQuestionIndex];
        selectedOption = null;

        // Progress
        const pct = ((currentQuestionIndex) / currentQuiz.questions.length) * 100;
        els.progressFill.style.width = pct + '%';

        // Header
        els.counter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;
        els.scoreLive.textContent = `${score} / ${currentQuestionIndex}`;

        // Question
        els.question.innerHTML = q.question.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Options
        els.options.innerHTML = '';
        q.options.forEach((opt, i) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.setAttribute('role', 'radio');
            btn.setAttribute('aria-checked', 'false');
            btn.innerHTML = `
                <span class="quiz-option-marker">${String.fromCharCode(65 + i)}</span>
                <span class="quiz-option-text">${Utils.escapeHtml(opt).replace(/`([^`]+)`/g, '<code>$1</code>')}</span>
            `;
            btn.addEventListener('click', () => selectOption(i, btn));
            els.options.appendChild(btn);
        });

        // Reset UI
        els.explanation.classList.add('hidden');
        els.submitBtn.classList.remove('hidden');
        els.submitBtn.disabled = true;
        els.submitBtn.textContent = 'Submit Answer';
        els.nextBtn.classList.add('hidden');
    }

    /* ─── Select Option ─── */
    function selectOption(index, btnElement) {
        if (selectedOption !== null) return; // Already submitted
        selectedOption = index;

        // Update visual state
        Array.from(els.options.children).forEach((child, i) => {
            child.classList.toggle('selected', i === index);
            child.setAttribute('aria-checked', i === index ? 'true' : 'false');
        });

        els.submitBtn.disabled = false;
    }

    /* ─── Submit Answer ─── */
    function submitAnswer() {
        if (selectedOption === null) return;

        const q = currentQuiz.questions[currentQuestionIndex];
        const isCorrect = selectedOption === q.correct;

        if (isCorrect) score++;

        answers.push({
            questionIndex: currentQuestionIndex,
            selected: selectedOption,
            correct: isCorrect,
            correctIndex: q.correct
        });

        // Mark options
        Array.from(els.options.children).forEach((child, i) => {
            child.classList.add('disabled');
            child.disabled = true;
            if (i === q.correct) {
                child.classList.add('correct');
            } else if (i === selectedOption && !isCorrect) {
                child.classList.add('incorrect');
            }
        });

        // Show explanation
        els.explanation.classList.remove('hidden');
        els.explanation.className = 'quiz-explanation ' + (isCorrect ? 'correct-exp' : 'incorrect-exp');
        els.explanationStatus.textContent = isCorrect ? '✓ Correct' : '✗ Incorrect';
        els.explanationStatus.className = 'explanation-status ' + (isCorrect ? 'correct-text' : 'incorrect-text');
        els.explanationText.textContent = q.explanation;

        // Buttons
        els.submitBtn.classList.add('hidden');
        els.nextBtn.classList.remove('hidden');

        if (currentQuestionIndex === currentQuiz.questions.length - 1) {
            els.nextBtn.textContent = 'See Results';
        } else {
            els.nextBtn.textContent = 'Next Question';
        }

        // Update score display
        els.scoreLive.textContent = `${score} / ${currentQuestionIndex + 1}`;
    }

    /* ─── Next Question ─── */
    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex >= currentQuiz.questions.length) {
            showResults();
        } else {
            renderQuestion();
        }
    }

    /* ─── Show Results ─── */
    function showResults() {
        els.activeView.classList.add('hidden');
        els.resultsView.classList.remove('hidden');

        const total = currentQuiz.questions.length;
        const pct = Math.round((score / total) * 100);

        // Save score
        const answersData = answers.map(a => ({
            q: currentQuiz.questions[a.questionIndex].question,
            selected: currentQuiz.questions[a.questionIndex].options[a.selected],
            correct: currentQuiz.questions[a.questionIndex].options[a.correctIndex],
            isCorrect: a.correct
        }));
        Storage.saveQuizScore(currentQuizId, score, total, answersData);

        // Results UI
        els.resultsScore.textContent = `${score} / ${total}`;
        els.resultsPercentage.textContent = `${pct}%`;

        if (pct >= 90) {
            els.resultsIcon.textContent = '🏆';
            els.resultsTitle.textContent = 'Outstanding!';
            els.resultsMessage.textContent = 'Perfect mastery! You have an excellent grasp of this topic.';
        } else if (pct >= 70) {
            els.resultsIcon.textContent = '🎯';
            els.resultsTitle.textContent = 'Great Job!';
            els.resultsMessage.textContent = 'Solid understanding. Review the missed questions to reach perfection.';
        } else if (pct >= 50) {
            els.resultsIcon.textContent = '💪';
            els.resultsTitle.textContent = 'Good Effort';
            els.resultsMessage.textContent = 'You are getting there. Revisit the lessons and try again.';
        } else {
            els.resultsIcon.textContent = '📚';
            els.resultsTitle.textContent = 'Keep Learning';
            els.resultsMessage.textContent = 'This topic needs more study. Check the related lessons and come back.';
        }

        // Breakdown
        els.resultsBreakdown.innerHTML = '';
        answers.forEach((a, i) => {
            const q = currentQuiz.questions[a.questionIndex];
            const item = document.createElement('div');
            item.className = 'breakdown-item ' + (a.correct ? 'correct' : 'incorrect');
            item.innerHTML = `
                <span class="breakdown-marker">${a.correct ? '✓' : '✗'}</span>
                <div>
                    <div class="breakdown-text">${Utils.escapeHtml(q.question)}</div>
                    <div class="breakdown-answer">
                        ${a.correct ? 'Correct' : `Your answer: ${Utils.escapeHtml(q.options[a.selected])} · Correct: ${Utils.escapeHtml(q.options[a.correctIndex])}`}
                    </div>
                </div>
            `;
            els.resultsBreakdown.appendChild(item);
        });

        window.scrollTo({ top: 0, behavior: 'instant' });
    }

    /* ─── Retake Quiz ─── */
    function retakeQuiz() {
        if (currentQuizId) {
            startQuiz(currentQuizId);
        }
    }

    /* ─── Back to List ─── */
    function backToList() {
        els.resultsView.classList.add('hidden');
        els.activeView.classList.add('hidden');
        els.listView.classList.remove('hidden');
        currentQuizId = null;
        currentQuiz = null;
        renderGrid();
    }

    /* ─── Event Bindings ─── */
    function bindEvents() {
        if (els.submitBtn) els.submitBtn.addEventListener('click', submitAnswer);
        if (els.nextBtn) els.nextBtn.addEventListener('click', nextQuestion);
        document.getElementById('retakeQuizBtn')?.addEventListener('click', retakeQuiz);
        document.getElementById('backToQuizzesBtn')?.addEventListener('click', backToList);
    }

    /* ─── URL Params ─── */
    function handleUrlParams() {
        const params = Utils.parseQueryParams();
        if (params.quiz) {
            const qz = quizzes.find(q => q.id === params.quiz);
            if (qz) startQuiz(qz.id);
        }
    }

    /* ─── Public Init ─── */
    function init() {
        renderGrid();
        bindEvents();
        handleUrlParams();
    }

    return { init };
})();