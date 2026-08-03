
const EditorPage = (function() {
    'use strict';

    /* ─── State ─── */
    let autoSaveTimer = null;
    let isRunning = false;
    const defaultCode = `\
# Welcome to the PythonLearn Editor!
# Write your code below and click Run to execute it.

name = "PythonLearn"
version = 3.12

print(f"Welcome to {name}!")
print(f"Running Python {version} in your browser.")

# Try some math
print("\\nSome calculations:")
print("2 + 2 =", 2 + 2)
print("10 * 5 =", 10 * 5)
print("2 ** 8 =", 2 ** 8)

# Try a loop
print("\\nCounting to 5:")
for i in range(1, 6):
    print(f"  {i}")

print("\\nHappy coding!")
`;

    /* ─── DOM References ─── */
    const els = {
        editor: document.getElementById('codeEditor'),
        lineNumbers: document.getElementById('lineNumbers'),
        outputBody: document.getElementById('outputBody'),
        outputLoader: document.getElementById('outputLoader'),
        outputMeta: document.getElementById('outputMeta'),
        saveStatus: document.getElementById('saveStatus'),
        runBtn: document.getElementById('runBtn'),
        resetBtn: document.getElementById('resetBtn'),
        clearOutputBtn: document.getElementById('clearOutputBtn')
    };

    /* ─── Line Numbers ─── */
    function updateLineNumbers() {
        if (!els.editor || !els.lineNumbers) return;
        const lines = els.editor.value.split('\n').length;
        els.lineNumbers.innerHTML = '';
        for (let i = 1; i <= lines; i++) {
            const span = document.createElement('span');
            span.textContent = i;
            els.lineNumbers.appendChild(span);
        }
    }

    function syncScroll() {
        if (!els.editor || !els.lineNumbers) return;
        els.lineNumbers.scrollTop = els.editor.scrollTop;
    }

    /* ─── Tab Handling ─── */
    function handleTab(e) {
        if (e.key !== 'Tab') return;
        e.preventDefault();

        const start = els.editor.selectionStart;
        const end = els.editor.selectionEnd;
        const value = els.editor.value;
        const tab = '    ';

        if (e.shiftKey) {
            // Outdent
            const before = value.substring(0, start);
            const after = value.substring(end);
            const lineStart = before.lastIndexOf('\n') + 1;
            const line = value.substring(lineStart, end);
            if (line.startsWith(tab)) {
                els.editor.value = before.substring(0, lineStart) + line.substring(4) + after;
                els.editor.selectionStart = start - 4;
                els.editor.selectionEnd = end - 4;
            } else if (line.startsWith(' ')) {
                const spaces = line.match(/^ +/)[0].length;
                const remove = Math.min(spaces, 4);
                els.editor.value = before.substring(0, lineStart) + line.substring(remove) + after;
                els.editor.selectionStart = start - remove;
                els.editor.selectionEnd = end - remove;
            }
        } else {
            // Indent
            els.editor.value = value.substring(0, start) + tab + value.substring(end);
            els.editor.selectionStart = els.editor.selectionEnd = start + 4;
        }

        triggerAutoSave();
    }

    /* ─── Auto Save ─── */
    function triggerAutoSave() {
        if (autoSaveTimer) clearTimeout(autoSaveTimer);
        setSaveStatus('saving');

        autoSaveTimer = setTimeout(() => {
            const code = els.editor.value;
            Storage.saveEditorCode(code, 'editor');
            setSaveStatus('saved');
            updateLineNumbers();
        }, 800);
    }

    function setSaveStatus(status) {
        if (!els.saveStatus) return;
        els.saveStatus.className = 'toolbar-status ' + status;
        if (status === 'saving') els.saveStatus.textContent = 'Saving...';
        if (status === 'saved') els.saveStatus.textContent = 'Saved';
    }

    /* ─── Load Saved Code ─── */
    function loadSavedCode() {
        const saved = Storage.getEditorCode('editor');
        if (saved && saved.trim()) {
            els.editor.value = saved;
        } else {
            els.editor.value = defaultCode;
        }
        updateLineNumbers();
        setSaveStatus('saved');
    }

    /* ─── Run Code ─── */
    async function runCode() {
        if (isRunning) return;
        isRunning = true;

        const code = els.editor.value;
        const startTime = performance.now();

        // UI state
        els.outputBody.innerHTML = '';
        els.outputLoader.classList.remove('hidden');
        els.runBtn.disabled = true;
        els.runBtn.innerHTML = `
            <div class="spinner" style="width:14px;height:14px;border-width:2px;"></div>
            <span>Running...</span>
        `;

        // Ensure Pyodide is loaded
        if (!PyodideRuntime.isReady()) {
            els.outputBody.innerHTML = '<div class="output-line">Loading Python runtime...</div>';
        }

        try {
            const result = await PyodideRuntime.run(code);
            const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);

            els.outputLoader.classList.add('hidden');

            if (result.stdout) {
                result.stdout.split('\n').forEach(line => {
                    if (line || result.stdout.endsWith('\n')) {
                        appendOutputLine(line);
                    }
                });
            }

            if (result.stderr) {
                result.stderr.split('\n').forEach(line => {
                    if (line) appendOutputLine(line, 'error');
                });
            }

            if (result.error && !result.stderr) {
                appendOutputLine(result.error, 'error');
            }

            els.outputMeta.textContent = `Executed in ${elapsed}s · ${result.success ? 'Success' : 'Error'}`;
            els.outputMeta.style.color = result.success ? 'var(--accent-green)' : 'var(--accent-red)';

        } catch (err) {
            els.outputLoader.classList.add('hidden');
            appendOutputLine('Failed to execute: ' + (err.message || String(err)), 'error');
            els.outputMeta.textContent = 'Execution failed';
            els.outputMeta.style.color = 'var(--accent-red)';
        }

        // Restore button
        isRunning = false;
        els.runBtn.disabled = false;
        els.runBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>Run</span>
        `;
    }

    function appendOutputLine(text, type = '') {
        const line = document.createElement('span');
        line.className = 'output-line' + (type ? ' ' + type : '');
        line.textContent = text;
        els.outputBody.appendChild(line);
        els.outputBody.scrollTop = els.outputBody.scrollHeight;
    }

    /* ─── Reset Code ─── */
    function resetCode() {
        Modal.create({
            title: 'Reset Editor',
            content: 'This will restore the default starter code. Your current code will be lost. Are you sure?',
            confirmText: 'Reset',
            cancelText: 'Cancel',
            onConfirm: () => {
                els.editor.value = defaultCode;
                Storage.saveEditorCode('', 'editor');
                updateLineNumbers();
                clearOutput();
                setSaveStatus('saved');
                App.toast('Editor reset to default code', 'info');
            }
        });
    }

    /* ─── Clear Output ─── */
    function clearOutput() {
        els.outputBody.innerHTML = '<div class="output-placeholder">Click "Run" to execute your code. Output will appear here.</div>';
        els.outputMeta.textContent = '';
    }

    /* ─── Keyboard Shortcuts ─── */
    function handleKeydown(e) {
        // Ctrl/Cmd + Enter = Run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode();
            return;
        }

        // Ctrl/Cmd + S = Save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            Storage.saveEditorCode(els.editor.value, 'editor');
            setSaveStatus('saved');
            App.toast('Code saved', 'success');
            return;
        }

        // Ctrl/Cmd + Shift + R = Reset
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            resetCode();
            return;
        }

        // Tab handling
        handleTab(e);
    }

    /* ─── Event Bindings ─── */
    function bindEvents() {
        if (els.editor) {
            els.editor.addEventListener('input', () => {
                updateLineNumbers();
                triggerAutoSave();
            });
            els.editor.addEventListener('scroll', syncScroll);
            els.editor.addEventListener('keydown', handleKeydown);
        }

        if (els.runBtn) els.runBtn.addEventListener('click', runCode);
        if (els.resetBtn) els.resetBtn.addEventListener('click', resetCode);
        if (els.clearOutputBtn) els.clearOutputBtn.addEventListener('click', clearOutput);
    }

    /* ─── Public Init ─── */
    function init() {
        loadSavedCode();
        bindEvents();

        // Pre-load Pyodide in background
        if (!PyodideRuntime.isReady() && !PyodideRuntime.isLoading()) {
            PyodideRuntime.load().then(() => {
                App.toast('Python runtime ready', 'success', 2000);
            }).catch(() => {
                App.toast('Failed to load Python runtime', 'error', 5000);
            });
        }
    }

    return { init };
})();