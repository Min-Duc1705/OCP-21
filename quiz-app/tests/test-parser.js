const assert = require('assert');
const path = require('path');
const fs = require('fs');

// We will test parser.js
let parser;
try {
  parser = require('../js/parser');
} catch (e) {
  console.log("Expected initial failure: parser not found or has error:", e.message);
  process.exit(1);
}

const sampleMarkdown = `
# Bộ Câu Hỏi Ôn Tập (Review Questions) - Chapter 1: Building Blocks

### Câu 1 (Question 1)
**Phương thức nào sau đây là điểm khởi đầu hợp lệ? (Chọn tất cả các đáp án đúng)**

\`\`\`java
public class Bunny {
   public static void main(String[] x) {}
}
\`\`\`

* A. private static void main(String[] args)
* B. public static final main(String[] args)
* C. public void main(String[] args)
* D. public static final void main(String[] args)
* E. public static void main(String[] args)

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **D, E**
* **Giải thích chuyên sâu:**
  * **E** là chữ ký chuẩn tắc.
  * **D** hoàn toàn hợp lệ.
</details>

---

### Câu 2 (Question 2)
**Định danh nào hợp lệ?**

* A. _value
* B. 123test

<details>
<summary><b>👉 Xem Đáp Án & Giải Thích Chi Tiết</b></summary>

* **Đáp án đúng:** **A**
* **Giải thích chuyên sâu:**
  * **A** bắt đầu bằng gạch dưới là hợp lệ.
</details>
`;

const questions = parser.parseMarkdownQuestions(sampleMarkdown, 1, "Chapter 1: Building Blocks");

assert.strictEqual(questions.length, 2, "Should extract 2 questions");

// Question 1
const q1 = questions[0];
assert.strictEqual(q1.id, "ch1_q1");
assert.strictEqual(q1.chapterId, 1);
assert.strictEqual(q1.questionNumber, 1);
assert.strictEqual(q1.isMultipleChoice, true, "Should recognize 'Chọn tất cả các đáp án đúng' as multiple choice");
assert.ok(q1.codeSnippet && q1.codeSnippet.includes("public class Bunny"), "Should extract code snippet");
assert.strictEqual(q1.options.length, 5, "Should have 5 options");
assert.strictEqual(q1.options[0].key, "A");
assert.strictEqual(q1.options[0].text, "private static void main(String[] args)");
assert.deepStrictEqual(q1.correctAnswers, ["D", "E"], "Correct answers should be D and E");
assert.ok(q1.explanation.includes("chữ ký chuẩn tắc"), "Should include explanation");

// Question 2
const q2 = questions[1];
assert.strictEqual(q2.id, "ch1_q2");
assert.strictEqual(q2.isMultipleChoice, false, "Should be single choice");
assert.strictEqual(q2.codeSnippet, null, "Should have no code snippet");
assert.deepStrictEqual(q2.correctAnswers, ["A"]);

console.log("All parser unit tests PASSED!");
