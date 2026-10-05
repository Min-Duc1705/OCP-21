const assert = require('assert');

// Test evaluation logic for practice & exam grading
function evaluateAnswer(selectedKeys, correctAnswers) {
  const sel = [...selectedKeys].sort();
  const corr = [...correctAnswers].sort();
  if (sel.length !== corr.length) return false;
  return sel.every((val, idx) => val === corr[idx]);
}

// Single choice test
assert.strictEqual(evaluateAnswer(['A'], ['A']), true);
assert.strictEqual(evaluateAnswer(['B'], ['A']), false);
assert.strictEqual(evaluateAnswer([], ['A']), false);

// Multi-choice test
assert.strictEqual(evaluateAnswer(['D', 'E'], ['D', 'E']), true);
assert.strictEqual(evaluateAnswer(['E', 'D'], ['D', 'E']), true, 'Order should not matter');
assert.strictEqual(evaluateAnswer(['D'], ['D', 'E']), false, 'Partial selection should be false');
assert.strictEqual(evaluateAnswer(['D', 'E', 'A'], ['D', 'E']), false, 'Over-selection should be false');

console.log("Practice evaluation tests PASSED!");
