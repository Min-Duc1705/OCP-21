// ==========================================================================
// Build Script: Parse 26 Oracle SQL & PL/SQL Chapters into sql-quiz-data.js & sql-theory-data.js
// ==========================================================================

const fs = require('fs');
const path = require('path');

const sqlDir = path.join(__dirname, '..', '..', 'sql');
const outQuizFile = path.join(__dirname, 'sql-quiz-data.js');
const outTheoryFile = path.join(__dirname, 'sql-theory-data.js');

function parseChaptersAndQuestions() {
  if (!fs.existsSync(sqlDir)) {
    console.error('SQL directory not found:', sqlDir);
    process.exit(1);
  }

  const files = fs.readdirSync(sqlDir);
  const reviewFiles = files
    .filter(f => f.endsWith('-review-questions.md'))
    .sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);
      return numA - numB;
    });

  const theoryFiles = files
    .filter(f => f.endsWith('-theory.md'))
    .sort((a, b) => {
      const numA = parseInt(a.split('-')[0], 10);
      const numB = parseInt(b.split('-')[0], 10);
      return numA - numB;
    });

  const allQuestions = [];
  const chapters = [];

  for (const file of reviewFiles) {
    const filePath = path.join(sqlDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    const chapterMatch = file.match(/^(\d+)-chapter-(\d+)-review-questions\.md$/);
    const chapterNum = chapterMatch ? parseInt(chapterMatch[2], 10) : 0;

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const rawTitle = titleMatch ? titleMatch[1].replace(/[📘📙📗📕📓🎯]/g, '').trim() : `Chương ${chapterNum}`;

    const questionBlocks = content.split(/(?=^###\s+Câu\s+\d+\b)/m).filter(b => /^###\s+Câu\s+\d+\b/.test(b.trim()));
    let chapterQuestionCount = 0;

    for (const block of questionBlocks) {
      const qNumMatch = block.match(/^###\s+Câu\s+(\d+)\b/m);
      if (!qNumMatch) continue;
      const qNum = parseInt(qNumMatch[1], 10);

      const parts = block.split(/<details>/i);
      const topPart = parts[0] || '';
      const detailsPart = parts[1] || '';

      const lines = topPart.replace(/^###\s+Câu\s+\d+[^\r\n]*\r?\n?/, '').split(/\r?\n/);

      let inCodeBlock = false;
      const promptLines = [];
      const options = [];
      let currentOption = null;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock;
          promptLines.push(line);
          continue;
        }

        if (inCodeBlock) {
          promptLines.push(line);
          continue;
        }

        const optMatch = line.match(/^\s*[-*]\s*(?:\*\*)?([A-G])\.(?:\*\*)?\s+(.*)$/);
        if (optMatch) {
          currentOption = {
            key: optMatch[1],
            text: optMatch[2].trim()
          };
          options.push(currentOption);
        } else if (currentOption && line.trim() !== '' && !line.trim().startsWith('<') && !line.trim().startsWith('---')) {
          currentOption.text += '\n' + line;
        } else if (!currentOption && !line.trim().startsWith('---')) {
          promptLines.push(line);
        }
      }

      const rawPrompt = promptLines.join('\n').trim();
      let cleanQuestionText = rawPrompt;
      let extractedCode = '';
      const codeRegex = /```(?:sql|plsql|java)?\s*\r?\n([\s\S]*?)```/gi;
      let match;
      const codeSnippets = [];
      while ((match = codeRegex.exec(rawPrompt)) !== null) {
        codeSnippets.push(match[1].trim());
      }
      if (codeSnippets.length > 0) {
        extractedCode = codeSnippets.join('\n\n-- ---\n\n');
        cleanQuestionText = rawPrompt.replace(/```(?:sql|plsql|java)?\s*\r?\n[\s\S]*?```/gi, '').trim();
      }

      let correctAnswers = [];
      let explanation = '';

      if (detailsPart) {
        const cleanDetails = detailsPart
          .replace(/<summary>.*?<\/summary>/is, '')
          .replace(/<\/details>/gi, '')
          .replace(/^\s*---\s*$/gm, '')
          .trim();

        const ansMatch = cleanDetails.match(/Đáp án đúng\s*:\*{0,2}\s*\*{0,2}([A-G](?:\s*,\s*[A-G])*)\*{0,2}/i);
        if (ansMatch) {
          correctAnswers = ansMatch[1]
            .split(',')
            .map(s => s.trim().toUpperCase())
            .filter(s => /^[A-G]$/.test(s));
        }

        explanation = cleanDetails
          .replace(/^\s*[-*]?\s*\*\*Đáp án đúng\s*:.*$/im, '')
          .replace(/\*\*Đáp án đúng\s*:\s*[A-G,\s]+\*\*/i, '')
          .trim();
      }

      const isMultipleChoice = correctAnswers.length > 1 ||
        /chọn tất cả|select all|choose two|choose three|chọn \d+ đáp án/i.test(cleanQuestionText);

      const questionObj = {
        id: `sql_ch${chapterNum}_q${qNum}`,
        chapterId: chapterNum,
        chapterTitle: `Chương ${chapterNum}`,
        questionNumber: qNum,
        questionText: cleanQuestionText,
        questionTextVi: cleanQuestionText,
        questionTextEn: cleanQuestionText,
        codeSnippet: extractedCode,
        options: options,
        optionsVi: options,
        optionsEn: options,
        correctAnswers: correctAnswers,
        explanation: explanation,
        explanationVi: explanation,
        explanationEn: explanation,
        isMultipleChoice: isMultipleChoice
      };

      allQuestions.push(questionObj);
      chapterQuestionCount++;
    }

    chapters.push({
      id: chapterNum,
      title: rawTitle,
      filename: file,
      questionCount: chapterQuestionCount
    });
  }

  const theoryMap = {};
  for (const file of theoryFiles) {
    const filePath = path.join(sqlDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const chapterMatch = file.match(/^(\d+)-chapter-(\d+)-theory\.md$/);
    const chapterNum = chapterMatch ? parseInt(chapterMatch[2], 10) : 0;
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const rawTitle = titleMatch ? titleMatch[1].trim() : `Chương ${chapterNum}`;

    theoryMap[String(chapterNum)] = {
      chapterId: chapterNum,
      filename: file,
      title: rawTitle,
      githubUrl: `https://github.com/Min-Duc1705/OCP-21/blob/main/sql/${file}`,
      content: content
    };
  }

  const quizJsContent = `window.SQL_QUIZ_DATA = ${JSON.stringify({ chapters, questions: allQuestions }, null, 2)};\n`;
  fs.writeFileSync(outQuizFile, quizJsContent, 'utf-8');

  const theoryJsContent = `window.SQL_THEORY_DATA = ${JSON.stringify(theoryMap, null, 2)};\n`;
  fs.writeFileSync(outTheoryFile, theoryJsContent, 'utf-8');

  console.log(`Built ${chapters.length} SQL chapters, ${allQuestions.length} questions, and ${Object.keys(theoryMap).length} theory documents.`);
}

parseChaptersAndQuestions();
