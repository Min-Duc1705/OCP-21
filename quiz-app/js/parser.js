const fs = require('fs');
const path = require('path');

function parseMarkdownQuestions(content, chapterId, chapterTitle) {
  const questions = [];
  
  // Split by Question headers: ### Câu X or ### Question X
  const sections = content.split(/(?=###\s+(?:Câu|Question)\s+\d+)/i);
  
  for (const section of sections) {
    if (!section.trim() || !section.match(/^###\s+(?:Câu|Question)\s+\d+/i)) {
      continue;
    }
    
    // 1. Question Number
    const headerMatch = section.match(/^###\s+(?:Câu|Question)\s+(\d+)/i);
    if (!headerMatch) continue;
    const questionNumber = parseInt(headerMatch[1], 10);
    const id = `ch${chapterId}_q${questionNumber}`;
    
    // Split section into: (Question & Options) and (<details> Explanation)
    const detailsMatch = section.match(/<details>([\s\S]*?)<\/details>/i);
    const mainPart = section.replace(/<details>[\s\S]*?<\/details>/i, '');
    
    // 2. Separate Question & Code from Options
    const firstOptionIndex = mainPart.search(/^[*-]\s+(?:\*\*)?[A-Z]\.(?:\*\*)?\s*/m);
    
    let promptAndCodePart = "";
    let optionsSection = "";
    
    if (firstOptionIndex !== -1) {
      promptAndCodePart = mainPart.substring(0, firstOptionIndex);
      optionsSection = mainPart.substring(firstOptionIndex);
    } else {
      promptAndCodePart = mainPart;
      optionsSection = "";
    }

    // 3. Extract Code Snippet (from promptAndCodePart only)
    let codeSnippet = null;
    let questionText = promptAndCodePart;
    const codeMatch = promptAndCodePart.match(/```(?:java)?\s*\r?\n([\s\S]*?)```/);
    if (codeMatch) {
      codeSnippet = codeMatch[1].trimEnd();
      questionText = promptAndCodePart.replace(/```(?:java)?\s*\r?\n[\s\S]*?```/, '');
    }

    // Clean up questionText
    questionText = questionText.replace(/^###\s+(?:Câu|Question)\s+\d+.*$/m, '');
    questionText = questionText.replace(/^[ \t]*---[ \t]*$/gm, '');
    questionText = questionText.replace(/\n{2,}/g, '\n\n').trim();
    if (questionText.startsWith('**') && questionText.endsWith('**') && questionText.length > 4) {
      questionText = questionText.slice(2, -2).trim();
    }

    // 4. Extract Options from optionsSection
    const options = [];
    const optHeaderRegex = /^[*-]\s+(?:\*\*)?([A-Z])\.(?:\*\*)?\s*(.*)$/gm;
    const optMatches = [];
    let om;
    while ((om = optHeaderRegex.exec(optionsSection)) !== null) {
      optMatches.push({
        key: om[1],
        firstLine: om[2],
        index: om.index,
        headerLen: om[0].length
      });
    }

    for (let i = 0; i < optMatches.length; i++) {
      const curr = optMatches[i];
      const next = optMatches[i + 1];
      const start = curr.index + curr.headerLen;
      const end = next ? next.index : optionsSection.length;
      const restLines = optionsSection.substring(start, end);
      
      let optText = (curr.firstLine + '\n' + restLines);
      // Clean up separator lines
      optText = optText.replace(/^[ \t]*---[ \t]*$/gm, '').trim();

      // Clean up indentation inside code blocks if present
      if (optText.includes('```')) {
        optText = optText.replace(/```(?:java)?\s*\r?\n([\s\S]*?)```/g, (match, code) => {
          const codeLines = code.split('\n');
          let minIndent = Infinity;
          codeLines.forEach(l => {
            if (l.trim().length > 0) {
              const m = l.match(/^(\s*)/);
              if (m && m[1].length < minIndent) minIndent = m[1].length;
            }
          });
          if (minIndent === Infinity) minIndent = 0;
          const cleanCode = codeLines.map(l => l.slice(minIndent)).join('\n').trim();
          return '```java\n' + cleanCode + '\n```';
        });
      }

      options.push({
        key: curr.key,
        text: optText
      });
    }
    
    // 5. Extract Correct Answers & Explanation from <details>
    let correctAnswers = [];
    let explanation = "";
    
    if (detailsMatch) {
      const detailsContent = detailsMatch[1];
      
      // Look for: * **Đáp án đúng:** **F (7 biến)** or * **Đáp án đúng (Correct Answer):** **D, E** etc.
      const ansMatch = detailsContent.match(/(?:Đáp án(?:\s+đúng)?|Correct Answer)[^:]*:([^\r\n]+)/i);
      if (ansMatch) {
        const ansLine = ansMatch[1];
        const beforeParen = ansLine.split(/[\(（]/)[0];
        const letters = beforeParen.match(/[A-Z]/g);
        if (letters) {
          correctAnswers = [...new Set(letters)];
        }
      }
      
      // Explanation content
      const explMatch = detailsContent.match(/(?:Giải thích chuyên sâu|Detailed Explanation)[^:]*:[*\s]*\r?\n([\s\S]*)/i);
      if (explMatch) {
        explanation = explMatch[1].trim();
      } else {
        explanation = detailsContent.replace(/\*\s*\*\*(?:Đáp án(?:\s+đúng)?|Correct Answer)[^:]*:.*$/im, '').trim();
      }
    }
    
    // 6. Detect Multiple Choice
    const multiHintRegex = /chọn tất cả|chọn các đáp án đúng|tất cả các đáp án|chọn hai|chọn ba|choose all|choose two|choose three|select all|select two|which two|which three/i;
    const hasMultiChoiceHint = multiHintRegex.test(questionText) ||
                               multiHintRegex.test(mainPart) ||
                               correctAnswers.length > 1;
    const isMultipleChoice = hasMultiChoiceHint;
    
    questions.push({
      id,
      chapterId,
      chapterTitle,
      questionNumber,
      questionText,
      codeSnippet,
      isMultipleChoice,
      options,
      correctAnswers,
      explanation
    });
  }
  
  return questions;
}

function parseAllChapters(baseDir) {
  const chapterFiles = [
    { file: "01-chapter-1-review-questions.md", fileEn: "01-chapter-1-review-questions-en.md", id: 1, title: "Chapter 1: Building Blocks" },
    { file: "02-chapter-2-review-questions.md", fileEn: "02-chapter-2-review-questions-en.md", id: 2, title: "Chapter 2: Operators" },
    { file: "03-chapter-3-review-questions.md", fileEn: "03-chapter-3-review-questions-en.md", id: 3, title: "Chapter 3: Making Decisions" },
    { file: "04-chapter-4-review-questions.md", fileEn: "04-chapter-4-review-questions-en.md", id: 4, title: "Chapter 4: Core APIs" },
    { file: "05-chapter-5-review-questions.md", fileEn: "05-chapter-5-review-questions-en.md", id: 5, title: "Chapter 5: Methods" },
    { file: "06-chapter-6-review-questions.md", fileEn: "06-chapter-6-review-questions-en.md", id: 6, title: "Chapter 6: Class Design" },
    { file: "07-chapter-7-review-questions.md", fileEn: "07-chapter-7-review-questions-en.md", id: 7, title: "Chapter 7: Beyond Classes" },
    { file: "08-chapter-8-review-questions.md", fileEn: "08-chapter-8-review-questions-en.md", id: 8, title: "Chapter 8: Lambdas and Functional Interfaces" },
    { file: "09-chapter-9-review-questions.md", fileEn: "09-chapter-9-review-questions-en.md", id: 9, title: "Chapter 9: Collections and Generics" },
    { file: "10-chapter-10-review-questions.md", fileEn: "10-chapter-10-review-questions-en.md", id: 10, title: "Chapter 10: Streams" },
    { file: "11-chapter-11-review-questions.md", fileEn: "11-chapter-11-review-questions-en.md", id: 11, title: "Chapter 11: Exceptions and Localization" },
    { file: "12-chapter-12-review-questions.md", fileEn: "12-chapter-12-review-questions-en.md", id: 12, title: "Chapter 12: Modules" },
    { file: "13-chapter-13-review-questions.md", fileEn: "13-chapter-13-review-questions-en.md", id: 13, title: "Chapter 13: Concurrency" },
    { file: "14-chapter-14-review-questions.md", fileEn: "14-chapter-14-review-questions-en.md", id: 14, title: "Chapter 14: I/O (NIO.2 & Serialization)" },
  ];
  
  const allQuestions = [];
  const chaptersSummary = [];
  
  for (const ch of chapterFiles) {
    const fullPath = path.join(baseDir, ch.file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`File not found: ${fullPath}`);
      continue;
    }
    const content = fs.readFileSync(fullPath, 'utf8');
    const questions = parseMarkdownQuestions(content, ch.id, ch.title);

    // Merge English questions if available
    const fullPathEn = path.join(baseDir, ch.fileEn);
    if (fs.existsSync(fullPathEn)) {
      const contentEn = fs.readFileSync(fullPathEn, 'utf8');
      const questionsEn = parseMarkdownQuestions(contentEn, ch.id, ch.title);
      const enByNum = {};
      for (const qEn of questionsEn) {
        enByNum[qEn.questionNumber] = qEn;
      }
      for (const q of questions) {
        const qEn = enByNum[q.questionNumber];
        if (qEn) {
          q.questionTextVi = q.questionText;
          q.optionsVi = (q.options && q.options.length === qEn.options.length) ? q.options : qEn.options;
          if (!q.options || q.options.length !== qEn.options.length) {
            q.options = qEn.options;
          }
          q.explanationVi = q.explanation;
          q.questionTextEn = qEn.questionText;
          q.optionsEn = qEn.options;
          q.explanationEn = qEn.explanation;
          if (qEn.correctAnswers && qEn.correctAnswers.length > 0) {
            q.correctAnswers = qEn.correctAnswers;
          }
          if (qEn.codeSnippet) {
            q.codeSnippet = qEn.codeSnippet;
          }
          q.isMultipleChoice = qEn.isMultipleChoice;
        }
      }
    }

    allQuestions.push(...questions);
    chaptersSummary.push({
      id: ch.id,
      title: ch.title,
      questionCount: questions.length,
      file: ch.file,
      fileEn: ch.fileEn
    });
  }
  
  return {
    chapters: chaptersSummary,
    questions: allQuestions
  };
}

if (require.main === module) {
  const rootDir = path.resolve(__dirname, '..', '..');
  console.log(`Parsing chapters from ${rootDir}...`);
  const quizData = parseAllChapters(rootDir);
  
  const outputPath = path.resolve(__dirname, 'quiz-data.js');
  const fileContent = `// Auto-generated by parser.js - OCP Java 21 Review Questions (VI & EN)
// Total Chapters: ${quizData.chapters.length}
// Total Questions: ${quizData.questions.length}

(function(root) {
  const data = ${JSON.stringify(quizData, null, 2)};
  if (typeof window !== 'undefined') {
    window.QUIZ_DATA = data;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = data;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);
`;
  
  fs.writeFileSync(outputPath, fileContent, 'utf8');
  console.log(`Successfully generated ${outputPath}`);
  console.log(`Total questions parsed: ${quizData.questions.length}`);
  quizData.chapters.forEach(ch => {
    const enCount = quizData.questions.filter(q => q.chapterId === ch.id && q.questionTextEn).length;
    console.log(` - ${ch.title}: ${ch.questionCount} questions (${enCount} EN)`);
  });
}

module.exports = {
  parseMarkdownQuestions,
  parseAllChapters
};
