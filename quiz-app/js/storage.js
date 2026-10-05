// QuizStorage: Manages persistence for OCP Java 21 Quiz App via localStorage

const QuizStorage = (function() {
  const KEYS = {
    THEME: 'ocp21_theme',
    BOOKMARKS: 'ocp21_bookmarks',
    MISTAKES: 'ocp21_mistakes',
    PRACTICE: 'ocp21_practice',
    EXAM_HISTORY: 'ocp21_exam_history'
  };

  function safeGet(key, defaultValue) {
    try {
      if (typeof localStorage === 'undefined') return defaultValue;
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      return JSON.parse(raw);
    } catch (e) {
      console.warn(`Storage get error for ${key}:`, e);
      return defaultValue;
    }
  }

  function safeSet(key, value) {
    try {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Storage set error for ${key}:`, e);
    }
  }

  return {
    // Theme
    getTheme() {
      if (typeof localStorage === 'undefined') return 'dark';
      const theme = localStorage.getItem(KEYS.THEME);
      return theme === 'light' ? 'light' : 'dark';
    },

    setTheme(theme) {
      if (typeof localStorage === 'undefined') return;
      localStorage.setItem(KEYS.THEME, theme);
    },

    // Bookmarks (array of question IDs: ["ch1_q1", "ch2_q3"])
    getBookmarks() {
      return safeGet(KEYS.BOOKMARKS, []);
    },

    isBookmarked(questionId) {
      const list = this.getBookmarks();
      return list.includes(questionId);
    },

    toggleBookmark(questionId) {
      const list = this.getBookmarks();
      const index = list.indexOf(questionId);
      let isAdded = false;
      if (index === -1) {
        list.push(questionId);
        isAdded = true;
      } else {
        list.splice(index, 1);
        isAdded = false;
      }
      safeSet(KEYS.BOOKMARKS, list);
      return isAdded;
    },

    // Mistakes tracking: { [questionId]: { wrongCount: number, lastAttempt: string } }
    getMistakes() {
      return safeGet(KEYS.MISTAKES, {});
    },

    recordMistake(questionId, isCorrect) {
      const mistakes = this.getMistakes();
      const now = new Date().toISOString();
      if (!isCorrect) {
        if (!mistakes[questionId]) {
          mistakes[questionId] = { wrongCount: 1, lastAttempt: now };
        } else {
          mistakes[questionId].wrongCount += 1;
          mistakes[questionId].lastAttempt = now;
        }
      } else {
        // If answered correctly and was in mistakes, decrement or remove
        if (mistakes[questionId]) {
          mistakes[questionId].wrongCount = Math.max(0, mistakes[questionId].wrongCount - 1);
          mistakes[questionId].lastAttempt = now;
          if (mistakes[questionId].wrongCount === 0) {
            delete mistakes[questionId];
          }
        }
      }
      safeSet(KEYS.MISTAKES, mistakes);
    },

    clearMistake(questionId) {
      const mistakes = this.getMistakes();
      if (mistakes[questionId]) {
        delete mistakes[questionId];
        safeSet(KEYS.MISTAKES, mistakes);
      }
    },

    // Practice progress: { [questionId]: { answered: boolean, isCorrect: boolean } }
    getPracticeProgress() {
      return safeGet(KEYS.PRACTICE, {});
    },

    savePracticeAnswer(questionId, isCorrect) {
      const progress = this.getPracticeProgress();
      progress[questionId] = {
        answered: true,
        isCorrect: isCorrect,
        updatedAt: new Date().toISOString()
      };
      safeSet(KEYS.PRACTICE, progress);
    },

    clearPracticeProgress(chapterId) {
      const progress = this.getPracticeProgress();
      if (!chapterId) {
        safeSet(KEYS.PRACTICE, {});
      } else {
        const prefix = `ch${chapterId}_`;
        Object.keys(progress).forEach(key => {
          if (key.startsWith(prefix)) {
            delete progress[key];
          }
        });
        safeSet(KEYS.PRACTICE, progress);
      }
    },

    // Exam History: Array of exam summary objects
    getExamHistory() {
      return safeGet(KEYS.EXAM_HISTORY, []);
    },

    saveExamResult(result) {
      const history = this.getExamHistory();
      history.unshift(result); // latest first
      // Keep up to 50 latest results
      if (history.length > 50) history.pop();
      safeSet(KEYS.EXAM_HISTORY, history);
    }
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = QuizStorage;
}
if (typeof window !== 'undefined') {
  window.QuizStorage = QuizStorage;
}
