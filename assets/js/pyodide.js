

const PyodideRuntime = (function() {
    'use strict';

    let pyodide = null;
    let ready = false;
    let loading = false;
    const callbacks = [];

    /* ─── Load Runtime ─── */
    async function load() {
        if (ready) return pyodide;
        if (loading) {
            return new Promise((resolve) => callbacks.push(resolve));
        }

        loading = true;

        try {
            const { loadPyodide } = await import('https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.mjs');
            pyodide = await loadPyodide({
                stdout: (text) => {
                    if (typeof PyodideRuntime.onStdout === 'function') {
                        PyodideRuntime.onStdout(text);
                    }
                },
                stderr: (text) => {
                    if (typeof PyodideRuntime.onStderr === 'function') {
                        PyodideRuntime.onStderr(text);
                    }
                }
            });

            ready = true;
            loading = false;

            // Flush queued callbacks
            callbacks.forEach(cb => cb(pyodide));
            callbacks.length = 0;

            if (typeof PyodideRuntime.onReady === 'function') {
                PyodideRuntime.onReady(pyodide);
            }

            return pyodide;
        } catch (err) {
            loading = false;
            ready = false;
            console.error('Pyodide failed to load:', err);
            if (typeof PyodideRuntime.onError === 'function') {
                PyodideRuntime.onError(err);
            }
            throw err;
        }
    }

    /* ─── Execute Code ─── */
    async function run(code) {
        if (!ready || !pyodide) {
            await load();
        }

        // Reset output capture buffers
        await pyodide.runPythonAsync(`
import sys
from io import StringIO
_stdout = StringIO()
_stderr = StringIO()
sys.stdout = _stdout
sys.stderr = _stderr
        `);

        let error = null;
        try {
            await pyodide.runPythonAsync(code);
        } catch (err) {
            error = err;
        }

        const stdout = await pyodide.runPythonAsync('_stdout.getvalue()');
        const stderr = await pyodide.runPythonAsync('_stderr.getvalue()');

        // Restore standard streams
        await pyodide.runPythonAsync(`
sys.stdout = __import__('sys').__stdout__
sys.stderr = __import__('sys').__stderr__
        `);

        return {
            stdout,
            stderr,
            error: error ? (error.message || String(error)) : null,
            success: !error
        };
    }

    /* ─── Status ─── */
    function isReady() {
        return ready;
    }

    function isLoading() {
        return loading;
    }

    /* ─── Public API ─── */
    return {
        load,
        run,
        isReady,
        isLoading,
        getInstance() { return pyodide; },
        onReady: null,
        onError: null,
        onStdout: null,
        onStderr: null
    };
})();