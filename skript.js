/**
 * Brain Game Utilities
 * Provides helper functions for the Brain Puzzle Game
 */

class GameUtilities {
    /**
     * Validate user answer against correct answer
     * @param {string} userAnswer - User's input
     * @param {string} correctAnswer - Expected answer
     * @returns {boolean} - True if answers match
     */
    static validateAnswer(userAnswer, correctAnswer) {
        if (!userAnswer || !correctAnswer) return false;
        return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }

    /**
     * Calculate accuracy percentage
     * @param {number} correct - Number of correct answers
     * @param {number} total - Total number of questions
     * @returns {number} - Accuracy percentage
     */
    static calculateAccuracy(correct, total) {
        if (total === 0) return 0;
        return Math.round((correct / total) * 100);
    }

    /**
     * Store game score in localStorage
     * @param {number} score - Player's score
     * @param {number} total - Total possible score
     */
    static saveScore(score, total) {
        const gameData = {
            score,
            total,
            date: new Date().toISOString()
        };
        localStorage.setItem('brainGameScore', JSON.stringify(gameData));
    }

    /**
     * Retrieve last game score from localStorage
     * @returns {object|null} - Game data or null if not found
     */
    static getLastScore() {
        const data = localStorage.getItem('brainGameScore');
        return data ? JSON.parse(data) : null;
    }

    /**
     * Format time elapsed
     * @param {number} seconds - Time in seconds
     * @returns {string} - Formatted time string
     */
    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    }
}

// Export for use in HTML
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameUtilities;
}