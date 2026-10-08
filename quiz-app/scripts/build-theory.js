// Script to bundle theory markdown files into quiz-app/js/theory-data.js and copy to quiz-app/theory/
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..', '..');
const quizAppDir = path.join(rootDir, 'quiz-app');
const theoryDir = path.join(quizAppDir, 'theory');

if (!fs.existsSync(theoryDir)) {
  fs.mkdirSync(theoryDir, { recursive: true });
}

const theoryFiles = {
  1: '01-chapter-1-building-blocks.md',
  2: '02-chapter-2-operators.md',
  3: '03-chapter-3-making-decisions.md',
  4: '04-chapter-4-core-apis.md',
  5: '05-chapter-5-methods.md',
  6: '06-chapter-6-class-design.md',
  7: '07-chapter-7-beyond-classes.md',
  8: '08-chapter-8-lambdas.md',
  9: '09-chapter-9-collections.md',
  10: '10-chapter-10-streams.md',
  11: '11-chapter-11-exceptions.md',
  12: '12-chapter-12-modules.md',
  13: '13-chapter-13-concurrency.md',
  14: '14-chapter-14-io.md'
};

const data = {};

for (const [id, filename] of Object.entries(theoryFiles)) {
  const filePath = path.join(rootDir, filename);
  if (!fs.existsSync(filePath)) {
    console.warn('Theory file not found:', filename);
    continue;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  // Copy to quiz-app/theory
  fs.writeFileSync(path.join(theoryDir, filename), content, 'utf8');

  // Extract Title
  const firstHeaderMatch = content.match(/^#\s+(.+)$/m);
  const title = firstHeaderMatch ? firstHeaderMatch[1].trim() : ('Chương ' + id);

  data[id] = {
    chapterId: Number(id),
    filename: filename,
    title: title,
    githubUrl: 'https://github.com/Min-Duc1705/OCP-21/blob/main/' + filename,
    content: content
  };
}

const outJsPath = path.join(quizAppDir, 'js', 'theory-data.js');
const jsCode = '// Auto-generated theory data for OCP 21 Quiz App\n' +
  '(function(root) {\n' +
  '  root.THEORY_DATA = ' + JSON.stringify(data, null, 2) + ';\n' +
  '})(typeof window !== \'undefined\' ? window : (typeof global !== \'undefined\' ? global : this));\n';

fs.writeFileSync(outJsPath, jsCode, 'utf8');
console.log('Successfully bundled ' + Object.keys(data).length + ' chapters into ' + outJsPath);
