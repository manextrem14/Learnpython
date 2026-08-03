
const FinishPage = (function() {
    'use strict';

    function init() {
        const progress = Storage.getProgress();
        const quizScores = Storage.getQuizScores();

        // Count completed lessons
        const lessonCount = progress.completedLessons ? progress.completedLessons.length : 0;

        // Count completed challenges
        const challengeCount = progress.completedChallenges ? progress.completedChallenges.length : 0;

        // Total points
        const points = progress.totalPoints || 0;

        // Count quizzes taken
        const quizCount = Object.keys(quizScores).length;

        // Update DOM
        const statLessons = document.getElementById('statLessons');
        const statChallenges = document.getElementById('statChallenges');
        const statPoints = document.getElementById('statPoints');
        const statQuizzes = document.getElementById('statQuizzes');

        if (statLessons) statLessons.textContent = lessonCount;
        if (statChallenges) statChallenges.textContent = challengeCount;
        if (statPoints) statPoints.textContent = points;
        if (statQuizzes) statQuizzes.textContent = quizCount;

        // Animate counters
        animateCounter(statLessons, lessonCount);
        animateCounter(statChallenges, challengeCount);
        animateCounter(statPoints, points);
        animateCounter(statQuizzes, quizCount);
    }

    function animateCounter(el, target) {
        if (!el || target === 0) return;
        const duration = 1500;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(target * eased);
            if (progress < 1) requestAnimationFrame(update);
            else el.textContent = target;
        }

        requestAnimationFrame(update);
    }

    return { init };
})();