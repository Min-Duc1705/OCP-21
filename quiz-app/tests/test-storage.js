const assert = require('assert');

// Mock localStorage for Node test environment
const mockStorage = {};
global.localStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; },
  clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); }
};

let QuizStorage;
try {
  QuizStorage = require('../js/storage');
} catch (e) {
  console.log("Expected initial failure: storage module not found:", e.message);
  process.exit(1);
}

// 1. Theme test
assert.strictEqual(QuizStorage.getTheme(), 'dark', 'Default theme should be dark');
QuizStorage.setTheme('light');
assert.strictEqual(QuizStorage.getTheme(), 'light', 'Theme should update to light');

// 2. Bookmark test
assert.deepStrictEqual(QuizStorage.getBookmarks(), [], 'Initially bookmarks should be empty');
assert.strictEqual(QuizStorage.isBookmarked('ch1_q1'), false);
const added = QuizStorage.toggleBookmark('ch1_q1');
assert.strictEqual(added, true, 'First toggle should add bookmark');
assert.strictEqual(QuizStorage.isBookmarked('ch1_q1'), true);
assert.deepStrictEqual(QuizStorage.getBookmarks(), ['ch1_q1']);

const removed = QuizStorage.toggleBookmark('ch1_q1');
assert.strictEqual(removed, false, 'Second toggle should remove bookmark');
assert.strictEqual(QuizStorage.isBookmarked('ch1_q1'), false);

// 3. Mistakes test
QuizStorage.recordMistake('ch2_q5', false);
const mistakes = QuizStorage.getMistakes();
assert.ok(mistakes['ch2_q5'], 'Mistake should be recorded');
assert.strictEqual(mistakes['ch2_q5'].wrongCount, 1);

QuizStorage.recordMistake('ch2_q5', false);
assert.strictEqual(QuizStorage.getMistakes()['ch2_q5'].wrongCount, 2);

// If answered correctly later, can clear mistake or decrease count
QuizStorage.recordMistake('ch2_q5', true);
assert.strictEqual(QuizStorage.getMistakes()['ch2_q5'].wrongCount, 1);

// 4. Exam history test
const sampleResult = {
  id: 'exam_1',
  timestamp: new Date().toISOString(),
  totalQuestions: 20,
  correctCount: 16,
  scorePercent: 80,
  passed: true,
  chapterBreakdown: { 1: { total: 10, correct: 8 } }
};
QuizStorage.saveExamResult(sampleResult);
const history = QuizStorage.getExamHistory();
assert.strictEqual(history.length, 1);
assert.strictEqual(history[0].id, 'exam_1');
assert.strictEqual(history[0].passed, true);

console.log("All storage unit tests PASSED!");
