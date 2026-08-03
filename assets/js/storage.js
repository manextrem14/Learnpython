
const Storage = (function() {
    'use strict';

    /* ─── Keys ─── */
    const KEYS = {
        PROGRESS: 'pythonlearn_progress',
        SETTINGS: 'pythonlearn_settings',
        EDITOR: 'pythonlearn_editor',
        CHALLENGES: 'pythonlearn_challenges',
        QUIZZES: 'pythonlearn_quizzes',
        LAST_LESSON: 'pythonlearn_last_lesson',
        THEME: 'pythonlearn_theme',
        VISITED: 'pythonlearn_visited'
    };

    /* ─── Helpers ─── */
    function get(key, fallback = null) {
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (e) {
            console.warn('Storage read error:', e);
            return fallback;
        }
    }

    function set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.warn('Storage write error:', e);
            return false;
        }
    }

    function remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    /* ─── Progress ─── */
    function getProgress() {
        return get(KEYS.PROGRESS, {
            completedLessons: [],
            completedChallenges: [],
            quizScores: {},
            totalPoints: 0,
            startedAt: new Date().toISOString()
        });
    }

    function saveProgress(progress) {
        return set(KEYS.PROGRESS, progress);
    }

    function markLessonComplete(lessonId, level) {
        const p = getProgress();
        const entry = { id: lessonId, level, completedAt: new Date().toISOString() };
        const exists = p.completedLessons.find(l => l.id === lessonId);
        if (!exists) {
            p.completedLessons.push(entry);
            saveProgress(p);
            dispatchEvent(new CustomEvent('progress:lesson', { detail: entry }));
        }
        return p;
    }

    function isLessonComplete(lessonId) {
        return getProgress().completedLessons.some(l => l.id === lessonId);
    }

    function getCompletedLessonsCount(level = null) {
        const p = getProgress();
        if (!level) return p.completedLessons.length;
        return p.completedLessons.filter(l => l.level === level).length;
    }

    /* ─── Challenges ─── */
    function getChallengeProgress() {
        return get(KEYS.CHALLENGES, {});
    }

    function saveChallengeProgress(data) {
        return set(KEYS.CHALLENGES, data);
    }

    function markChallengeComplete(challengeId, points) {
        const cp = getChallengeProgress();
        if (!cp[challengeId]) {
            cp[challengeId] = { completedAt: new Date().toISOString(), points };
            saveChallengeProgress(cp);
            const p = getProgress();
            p.completedChallenges.push(challengeId);
            p.totalPoints = (p.totalPoints || 0) + points;
            saveProgress(p);
            dispatchEvent(new CustomEvent('progress:challenge', { detail: { id: challengeId, points } }));
        }
        return cp;
    }

    function isChallengeComplete(challengeId) {
        return !!getChallengeProgress()[challengeId];
    }

    /* ─── Quizzes ─── */
    function getQuizScores() {
        return get(KEYS.QUIZZES, {});
    }

    function saveQuizScore(quizId, score, total, answers) {
        const qs = getQuizScores();
        const previous = qs[quizId];
        qs[quizId] = {
            score,
            total,
            answers,
            attemptedAt: new Date().toISOString(),
            bestScore: previous ? Math.max(previous.bestScore || 0, score) : score
        };
        set(KEYS.QUIZZES, qs);
        dispatchEvent(new CustomEvent('progress:quiz', { detail: { quizId, score, total } }));
        return qs[quizId];
    }

    function getQuizScore(quizId) {
        return getQuizScores()[quizId] || null;
    }

    /* ─── Editor ─── */
    function getEditorCode(key = 'default') {
        const codes = get(KEYS.EDITOR, {});
        return codes[key] || '';
    }

    function saveEditorCode(code, key = 'default') {
        const codes = get(KEYS.EDITOR, {});
        codes[key] = code;
        return set(KEYS.EDITOR, codes);
    }

    /* ─── Last Lesson ─── */
    function setLastLesson(lessonId, level) {
        return set(KEYS.LAST_LESSON, { lessonId, level, timestamp: new Date().toISOString() });
    }

    function getLastLesson() {
        return get(KEYS.LAST_LESSON, null);
    }

    /* ─── Settings ─── */
    function getSettings() {
        return get(KEYS.SETTINGS, {
            fontSize: 14,
            lineNumbers: true,
            wordWrap: true,
            autoSave: true,
            tabSize: 4,
            minimap: false
        });
    }

    function saveSettings(settings) {
        return set(KEYS.SETTINGS, { ...getSettings(), ...settings });
    }

    /* ─── Theme ─── */
    function getTheme() {
        return get(KEYS.THEME, 'dark');
    }

    function setTheme(theme) {
        return set(KEYS.THEME, theme);
    }

    /* ─── First Visit ─── */
    function isFirstVisit() {
        const visited = get(KEYS.VISITED, false);
        if (!visited) set(KEYS.VISITED, true);
        return !visited;
    }

    /* ─── Reset ─── */
    function resetAll() {
        Object.values(KEYS).forEach(remove);
        dispatchEvent(new CustomEvent('progress:reset'));
    }

    function exportData() {
        const data = {};
        Object.values(KEYS).forEach(key => {
            const val = localStorage.getItem(key);
            if (val) data[key] = JSON.parse(val);
        });
        return JSON.stringify(data, null, 2);
    }

    function importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(data).forEach(([key, value]) => {
                if (Object.values(KEYS).includes(key)) {
                    set(key, value);
                }
            });
            dispatchEvent(new CustomEvent('progress:import'));
            return true;
        } catch (e) {
            return false;
        }
    }

    /* ─── Public API ─── */
    return {
        getProgress,
        saveProgress,
        markLessonComplete,
        isLessonComplete,
        getCompletedLessonsCount,

        getChallengeProgress,
        saveChallengeProgress,
        markChallengeComplete,
        isChallengeComplete,

        getQuizScores,
        saveQuizScore,
        getQuizScore,

        getEditorCode,
        saveEditorCode,

        setLastLesson,
        getLastLesson,

        getSettings,
        saveSettings,

        getTheme,
        setTheme,

        isFirstVisit,
        resetAll,
        exportData,
        importData,

        KEYS
    };
})();