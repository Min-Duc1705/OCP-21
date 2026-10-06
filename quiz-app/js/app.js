// OCP Java 21 Quiz App - Application Controller
// Handles Dashboard, Practice Mode, Mock Exam, Results, and State

(function() {
  'use strict';

  // App State
  const state = {
    currentView: 'dashboard',
    practiceQuestions: [],
    practiceIndex: 0,
    practiceSelectedOptions: new Set(),
    practiceChecked: false,

    // Exam State
    examQuestions: [],
    examIndex: 0,
    examUserAnswers: {}, // { [index]: Set(['A', 'B']) }
    examFlagged: new Set(), // Set of question indexes
    examTimerSeconds: 0,
    examTimerInterval: null,
    examStartTime: null,
    examTotalDuration: 0,

    // Review / Result state
    lastExamResult: null,
    reviewFilter: 'all'
  };

  // Helper: Format Markdown Text to HTML (for prompts, explanations, options)
  function formatMarkdown(text) {
    if (!text) return '';
    let raw = text.trim();
    if (!raw) return '';

    // Convert fenced code blocks: ```java ... ```
    if (raw.includes('```')) {
      raw = raw.replace(/```(?:java)?\s*\r?\n([\s\S]*?)```/g, (match, code) => {
        const escaped = code.trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre class="option-code-block"><code class="language-java">${escaped}</code></pre>`;
      });
    }

    if (raw.startsWith('<pre') && raw.endsWith('</pre>')) {
      return raw;
    }

    function formatInline(str) {
      if (str.includes('<pre')) return str;
      let s = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      // Inline code: `code`
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      // Bold: **text**
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Replace LaTeX arrows $\rightarrow$ or $\to$ with clean unicode arrow →
      s = s.replace(/\$\\rightarrow\$/g, '→').replace(/\$\\to\$/g, '→');
      return s;
    }

    const lines = raw.split('\n');

    // Single line without bullets
    if (lines.length === 1 && !raw.trim().match(/^[*-]\s+/)) {
      return formatInline(raw);
    }

    const formattedElements = [];
    let inList = false;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) {
        if (inList) {
          formattedElements.push('</ul>');
          inList = false;
        }
        continue;
      }

      if (trimmed.includes('<pre')) {
        if (inList) {
          formattedElements.push('</ul>');
          inList = false;
        }
        formattedElements.push(trimmed);
        continue;
      }

      // Check if line is a bullet item (* or -)
      const bulletMatch = trimmed.match(/^[*-]\s+(.*)$/);
      if (bulletMatch) {
        if (!inList) {
          formattedElements.push('<ul class="expl-list">');
          inList = true;
        }
        formattedElements.push(`<li>${formatInline(bulletMatch[1])}</li>`);
      } else {
        if (inList) {
          formattedElements.push('</ul>');
          inList = false;
        }
        formattedElements.push(`<p class="expl-paragraph">${formatInline(trimmed)}</p>`);
      }
    }

    if (inList) {
      formattedElements.push('</ul>');
    }

    return formattedElements.join('');
  }

  // Evaluate Answer
  function evaluateAnswer(selectedKeys, correctAnswers) {
    const sel = [...selectedKeys].sort();
    const corr = [...correctAnswers].sort();
    if (sel.length !== corr.length) return false;
    return sel.every((val, idx) => val === corr[idx]);
  }

  // Switch View
  function switchView(viewName) {
    state.currentView = viewName;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`${viewName}-view`);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (viewName === 'dashboard') {
      updateDashboardStats();
      renderChapterCards();
    }
  }

  // --- DASHBOARD FUNCTIONS ---
  function updateDashboardStats() {
    const questions = window.QUIZ_DATA ? window.QUIZ_DATA.questions : [];
    const progress = QuizStorage.getPracticeProgress();
    const history = QuizStorage.getExamHistory();
    const bookmarks = QuizStorage.getBookmarks();
    const mistakes = QuizStorage.getMistakes();

    const totalQuestions = questions.length;
    const attemptedKeys = Object.keys(progress);
    const attemptedCount = attemptedKeys.length;
    let correctCount = 0;
    attemptedKeys.forEach(k => {
      if (progress[k].isCorrect) correctCount++;
    });

    const accuracyRate = attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

    document.getElementById('stat-total-questions').textContent = totalQuestions;
    document.getElementById('stat-attempted-questions').textContent = attemptedCount;
    document.getElementById('stat-accuracy-rate').textContent = `${accuracyRate}%`;
    document.getElementById('stat-exams-taken').textContent = history.length;

    document.getElementById('bookmark-count-badge').textContent = bookmarks.length;
    document.getElementById('mistake-count-badge').textContent = Object.keys(mistakes).length;
  }

  function renderChapterCards() {
    const container = document.getElementById('chapter-cards-container');
    if (!container || !window.QUIZ_DATA) return;
    container.innerHTML = '';

    const progress = QuizStorage.getPracticeProgress();

    window.QUIZ_DATA.chapters.forEach(ch => {
      const chQuestions = window.QUIZ_DATA.questions.filter(q => q.chapterId === ch.id);
      let completedInCh = 0;
      chQuestions.forEach(q => {
        if (progress[q.id] && progress[q.id].answered) completedInCh++;
      });
      const pct = ch.questionCount > 0 ? Math.round((completedInCh / ch.questionCount) * 100) : 0;

      const hasVideo = Boolean(CHAPTER_VIDEOS[ch.id]);

      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div>
          <div class="chapter-header">
            <span class="chapter-num">Chương ${ch.id}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${hasVideo ? '<span class="badge badge-warning" style="font-size: 0.72rem; padding: 0.15rem 0.45rem;">🎬 Có video</span>' : ''}
              <span class="badge badge-info">${ch.questionCount} câu hỏi</span>
            </div>
          </div>
          <h3 class="chapter-title">${ch.title}</h3>
          <div class="progress-container">
            <div class="progress-info">
              <span>Tiến độ học tập</span>
              <span><strong>${completedInCh}</strong> / ${ch.questionCount} (${pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        </div>
        <div>
          <div class="chapter-actions">
            <button class="btn btn-secondary btn-start-practice" data-chapter="${ch.id}">🎯 Luyện tập</button>
            <button class="btn btn-primary btn-start-exam-ch" data-chapter="${ch.id}">⏱️ Thi thử</button>
          </div>
          ${hasVideo ? `
          <div style="margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between;">
            <span style="font-size: 0.8rem; color: var(--text-muted);">🎥 Video bài giảng chuyên sâu</span>
            <button class="btn-chapter-video btn-open-video-ch" data-chapter="${ch.id}">▶️ Xem bài giảng</button>
          </div>` : ''}
        </div>
      `;

      card.querySelector('.btn-start-practice').addEventListener('click', () => {
        startPracticeForChapter(ch.id);
      });

      card.querySelector('.btn-start-exam-ch').addEventListener('click', () => {
        openExamSetupModal(ch.id);
      });

      if (hasVideo) {
        card.querySelector('.btn-open-video-ch').addEventListener('click', () => {
          openVideoModal(ch.id);
        });
      }

      container.appendChild(card);
    });
  }

  // --- PRACTICE MODE FUNCTIONS ---
  function startPracticeForChapter(chapterId) {
    const questions = window.QUIZ_DATA.questions.filter(q => q.chapterId === chapterId);
    if (!questions.length) return;
    startPracticeSession(questions, `Chương ${chapterId}: ${questions[0].chapterTitle}`);
  }

  function startPracticeSession(questions, title) {
    state.practiceQuestions = questions;
    state.practiceIndex = 0;
    state.practiceSelectedOptions = new Set();
    state.practiceChecked = false;
    state.practiceStatuses = {};

    // Restore prior answered status if recorded in storage
    const progress = QuizStorage.getPracticeProgress();
    questions.forEach((q, idx) => {
      if (progress[q.id] && progress[q.id].answered) {
        state.practiceStatuses[idx] = {
          answered: true,
          isCorrect: progress[q.id].isCorrect
        };
      }
    });

    document.getElementById('practice-chapter-title').textContent = title;
    document.getElementById('practice-total-count').textContent = questions.length;

    switchView('practice');
    renderPracticePalette();
    renderPracticeQuestion();
  }

  function renderPracticePalette() {
    const container = document.getElementById('practice-palette-pills');
    if (!container) return;
    container.innerHTML = '';

    state.practiceQuestions.forEach((q, idx) => {
      const btn = document.createElement('button');
      btn.className = 'nav-pill';
      btn.id = `practice-pill-${idx}`;
      btn.textContent = idx + 1;
      btn.title = `Chuyển đến câu ${idx + 1}`;

      const status = state.practiceStatuses[idx];
      if (status && status.answered) {
        btn.classList.add(status.isCorrect ? 'correct' : 'incorrect');
      }
      if (QuizStorage.isBookmarked(q.id)) {
        btn.classList.add('bookmarked');
      }

      btn.addEventListener('click', () => {
        state.practiceIndex = idx;
        renderPracticeQuestion();
      });

      container.appendChild(btn);
    });

    updatePracticePaletteHighlight();
    updatePracticePaletteStats();
  }

  function updatePracticePaletteHighlight() {
    const pills = document.querySelectorAll('#practice-palette-pills .nav-pill');
    pills.forEach((pill, idx) => {
      if (idx === state.practiceIndex) {
        pill.classList.add('active');
        try {
          pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        } catch (e) {}
      } else {
        pill.classList.remove('active');
      }
    });
  }

  function updatePracticePaletteStats() {
    let correct = 0;
    let wrong = 0;
    let bookmarked = 0;

    state.practiceQuestions.forEach((q, idx) => {
      const st = state.practiceStatuses[idx];
      if (st && st.answered) {
        if (st.isCorrect) correct++;
        else wrong++;
      }
      if (QuizStorage.isBookmarked(q.id)) bookmarked++;
    });

    const unanswered = state.practiceQuestions.length - (correct + wrong);

    const uEl = document.getElementById('stat-nav-unanswered');
    const cEl = document.getElementById('stat-nav-correct');
    const wEl = document.getElementById('stat-nav-wrong');
    const bEl = document.getElementById('stat-nav-bookmarked');

    if (uEl) uEl.textContent = unanswered;
    if (cEl) cEl.textContent = correct;
    if (wEl) wEl.textContent = wrong;
    if (bEl) bEl.textContent = bookmarked;
  }

  function renderPracticeQuestion() {
    const q = state.practiceQuestions[state.practiceIndex];
    if (!q) return;

    state.practiceSelectedOptions.clear();
    state.practiceChecked = false;

    // Reset UI
    document.getElementById('practice-current-index').textContent = state.practiceIndex + 1;
    document.getElementById('practice-question-id').textContent = q.id;

    // Badge
    const badge = document.getElementById('practice-type-badge');
    if (q.isMultipleChoice) {
      badge.textContent = 'Chọn tất cả các đáp án đúng (Multiple Choice)';
      badge.className = 'badge badge-warning';
    } else {
      badge.textContent = 'Chọn 1 đáp án duy nhất (Single Choice)';
      badge.className = 'badge badge-info';
    }

    // Video button state
    const btnPracticeVideo = document.getElementById('btn-practice-video');
    if (btnPracticeVideo) {
      if (CHAPTER_VIDEOS[q.chapterId]) {
        btnPracticeVideo.style.display = 'inline-flex';
        btnPracticeVideo.textContent = `🎬 Bài giảng Chương ${q.chapterId}`;
      } else {
        btnPracticeVideo.style.display = 'none';
      }
    }

    // Bookmark button state
    updatePracticeBookmarkButton(q.id);

    // Prompt
    document.getElementById('practice-prompt-text').innerHTML = formatMarkdown(q.questionText);

    // Code block
    const codeContainer = document.getElementById('practice-code-container');
    const codeBlock = document.getElementById('practice-code-block');
    if (q.codeSnippet) {
      codeContainer.style.display = 'block';
      codeBlock.textContent = q.codeSnippet;
      if (window.Prism) {
        Prism.highlightElement(codeBlock);
      }
    } else {
      codeContainer.style.display = 'none';
      codeBlock.textContent = '';
    }

    // Options
    const optionsContainer = document.getElementById('practice-options-container');
    optionsContainer.innerHTML = '';

    q.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'option-item';
      item.dataset.key = opt.key;
      item.innerHTML = `
        <div class="option-key">${opt.key}</div>
        <div class="option-text">${formatMarkdown(opt.text)}</div>
      `;

      item.addEventListener('click', () => {
        if (state.practiceChecked) return; // Locked after check
        handleOptionClick(opt.key);
      });

      optionsContainer.appendChild(item);
    });

    if (window.Prism) {
      optionsContainer.querySelectorAll('pre code').forEach(el => Prism.highlightElement(el));
    }

    // Hide explanation & enable check button
    const explCard = document.getElementById('practice-explanation-card');
    explCard.classList.remove('show');
    explCard.style.display = 'none';

    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.disabled = false;
    checkBtn.textContent = '✔️ Kiểm Tra Đáp Án (Enter)';

    // Update navigation buttons
    document.getElementById('btn-practice-prev').disabled = (state.practiceIndex === 0);
    document.getElementById('btn-practice-next').disabled = (state.practiceIndex === state.practiceQuestions.length - 1);

    // Update Palette active pill
    updatePracticePaletteHighlight();
  }

  function handleOptionClick(key) {
    const q = state.practiceQuestions[state.practiceIndex];
    if (q.isMultipleChoice) {
      if (state.practiceSelectedOptions.has(key)) {
        state.practiceSelectedOptions.delete(key);
      } else {
        state.practiceSelectedOptions.add(key);
      }
    } else {
      state.practiceSelectedOptions.clear();
      state.practiceSelectedOptions.add(key);
    }

    // Update UI selected classes
    const items = document.querySelectorAll('#practice-options-container .option-item');
    items.forEach(item => {
      if (state.practiceSelectedOptions.has(item.dataset.key)) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  }

  function checkPracticeAnswer() {
    if (state.practiceChecked) return;
    const q = state.practiceQuestions[state.practiceIndex];
    if (state.practiceSelectedOptions.size === 0) {
      alert('Vui lòng chọn ít nhất một đáp án trước khi kiểm tra!');
      return;
    }

    state.practiceChecked = true;
    const isCorrect = evaluateAnswer(state.practiceSelectedOptions, q.correctAnswers);

    // Save to storage
    QuizStorage.savePracticeAnswer(q.id, isCorrect);
    QuizStorage.recordMistake(q.id, isCorrect);
    updateDashboardStats();

    // Update status in Navigator Palette
    state.practiceStatuses[state.practiceIndex] = {
      answered: true,
      isCorrect: isCorrect
    };
    const pill = document.getElementById(`practice-pill-${state.practiceIndex}`);
    if (pill) {
      pill.classList.remove('correct', 'incorrect');
      pill.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    updatePracticePaletteStats();

    // Style options
    const items = document.querySelectorAll('#practice-options-container .option-item');
    items.forEach(item => {
      const k = item.dataset.key;
      const isExpected = q.correctAnswers.includes(k);
      const isSelected = state.practiceSelectedOptions.has(k);

      if (isExpected) {
        item.classList.add('correct');
      } else if (isSelected && !isExpected) {
        item.classList.add('incorrect');
      }
    });

    // Reveal explanation
    const explCard = document.getElementById('practice-explanation-card');
    const explText = document.getElementById('practice-explanation-text');
    explText.innerHTML = `
      <div class="explanation-status-banner">
        <strong>Đáp án đúng:</strong>
        <span class="badge badge-success" style="font-size: 0.9rem;">${q.correctAnswers.join(', ')}</span>
        ${isCorrect ? '<span style="color: var(--success); font-weight: 700;">— CHÍNH XÁC! 🎉</span>' : '<span style="color: var(--danger); font-weight: 700;">— CHƯA CHÍNH XÁC! ❌</span>'}
      </div>
      <div>${formatMarkdown(q.explanation)}</div>
    `;
    explCard.style.display = 'block';
    setTimeout(() => explCard.classList.add('show'), 10);

    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.disabled = true;
    checkBtn.textContent = isCorrect ? '✔️ Đã trả lời đúng' : '❌ Đã kiểm tra (Xem giải thích)';
  }

  function updatePracticeBookmarkButton(questionId) {
    const btn = document.getElementById('btn-practice-bookmark');
    if (!btn) return;
    const isBookmarked = QuizStorage.isBookmarked(questionId);
    if (isBookmarked) {
      btn.innerHTML = '⭐ <span style="color: var(--warning); font-weight: 700;">Đã lưu</span>';
      btn.style.borderColor = 'var(--warning)';
    } else {
      btn.innerHTML = '⭐ Lưu câu hỏi';
      btn.style.borderColor = 'var(--border-color)';
    }

    const pill = document.getElementById(`practice-pill-${state.practiceIndex}`);
    if (pill) {
      if (isBookmarked) pill.classList.add('bookmarked');
      else pill.classList.remove('bookmarked');
    }
    updatePracticePaletteStats();
  }

  // --- MOCK EXAM MODE FUNCTIONS ---
  function openExamSetupModal(defaultChapterId) {
    const modal = document.getElementById('exam-setup-modal');
    const listContainer = document.getElementById('modal-chapters-list');
    listContainer.innerHTML = '';

    window.QUIZ_DATA.chapters.forEach(ch => {
      const isChecked = defaultChapterId ? (ch.id === defaultChapterId) : true;
      const row = document.createElement('label');
      row.style.cssText = 'display: flex; align-items: center; gap: 0.6rem; cursor: pointer; padding: 0.35rem;';
      row.innerHTML = `
        <input type="checkbox" class="modal-ch-cb" value="${ch.id}" ${isChecked ? 'checked' : ''}>
        <span>Chương ${ch.id}: ${ch.title} (${ch.questionCount} câu)</span>
      `;
      listContainer.appendChild(row);
    });

    modal.classList.add('show');
  }

  function startExamFromModal() {
    const selectedChBoxes = document.querySelectorAll('.modal-ch-cb:checked');
    const selectedChapterIds = Array.from(selectedChBoxes).map(cb => parseInt(cb.value, 10));

    if (selectedChapterIds.length === 0) {
      alert('Vui lòng chọn ít nhất một chương để làm bài thi!');
      return;
    }

    // Filter questions by chapters
    let eligibleQuestions = window.QUIZ_DATA.questions.filter(q => selectedChapterIds.includes(q.chapterId));

    // Shuffle questions
    eligibleQuestions = [...eligibleQuestions].sort(() => Math.random() - 0.5);

    // Question count limit
    const countRadio = document.querySelector('input[name="modal-q-count"]:checked').value;
    let limit = eligibleQuestions.length;
    if (countRadio === '15') limit = Math.min(15, eligibleQuestions.length);
    else if (countRadio === '25') limit = Math.min(25, eligibleQuestions.length);
    else if (countRadio === '50') limit = Math.min(50, eligibleQuestions.length);

    state.examQuestions = eligibleQuestions.slice(0, limit);
    state.examIndex = 0;
    state.examUserAnswers = {};
    state.examFlagged.clear();
    state.examStartTime = new Date();

    // Timer calculation: standard 2.5 min/question, speed 1.5 min/question, unlimited
    const timerRadio = document.querySelector('input[name="modal-timer"]:checked').value;
    if (timerRadio === 'standard') {
      state.examTotalDuration = Math.round(state.examQuestions.length * 2.5 * 60);
    } else if (timerRadio === 'speed') {
      state.examTotalDuration = Math.round(state.examQuestions.length * 1.5 * 60);
    } else {
      state.examTotalDuration = 0; // unlimited
    }
    state.examTimerSeconds = state.examTotalDuration;

    // Close modal & enter exam
    document.getElementById('exam-setup-modal').classList.remove('show');
    switchView('exam');
    startExamTimer();
    renderExamQuestion();
    renderExamPalette();
  }

  function startExamTimer() {
    if (state.examTimerInterval) clearInterval(state.examTimerInterval);
    const timerDisplay = document.getElementById('timer-digits');
    const timerBox = document.getElementById('exam-timer-display');

    if (state.examTotalDuration === 0) {
      timerDisplay.textContent = '∞ Không giới hạn';
      timerBox.className = 'timer-box';
      return;
    }

    function updateTimerUI() {
      const minutes = Math.floor(state.examTimerSeconds / 60);
      const seconds = state.examTimerSeconds % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (state.examTimerSeconds <= 60) {
        timerBox.className = 'timer-box danger';
      } else if (state.examTimerSeconds <= 300) {
        timerBox.className = 'timer-box warning';
      } else {
        timerBox.className = 'timer-box';
      }
    }

    updateTimerUI();
    state.examTimerInterval = setInterval(() => {
      state.examTimerSeconds--;
      updateTimerUI();

      if (state.examTimerSeconds <= 0) {
        clearInterval(state.examTimerInterval);
        alert('Hết giờ làm bài! Hệ thống đang tự động nộp bài và chấm điểm.');
        finishAndGradeExam();
      }
    }, 1000);
  }

  function renderExamQuestion() {
    const q = state.examQuestions[state.examIndex];
    if (!q) return;

    document.getElementById('exam-current-index').textContent = state.examIndex + 1;
    document.getElementById('exam-total-count').textContent = state.examQuestions.length;
    document.getElementById('exam-chapter-indicator').textContent = q.chapterTitle;

    const badge = document.getElementById('exam-type-badge');
    badge.textContent = q.isMultipleChoice ? 'Chọn tất cả đáp án đúng' : 'Chọn 1 đáp án duy nhất';

    // Flag button
    const flagBtn = document.getElementById('btn-exam-flag');
    if (state.examFlagged.has(state.examIndex)) {
      flagBtn.innerHTML = '🚩 <span style="color: var(--warning); font-weight: 700;">Đã cắm cờ</span>';
      flagBtn.style.borderColor = 'var(--warning)';
    } else {
      flagBtn.innerHTML = '🚩 Cắm cờ xem lại';
      flagBtn.style.borderColor = 'var(--border-color)';
    }

    // Prompt
    document.getElementById('exam-prompt-text').innerHTML = formatMarkdown(q.questionText);

    // Code
    const codeContainer = document.getElementById('exam-code-container');
    const codeBlock = document.getElementById('exam-code-block');
    if (q.codeSnippet) {
      codeContainer.style.display = 'block';
      codeBlock.textContent = q.codeSnippet;
      if (window.Prism) Prism.highlightElement(codeBlock);
    } else {
      codeContainer.style.display = 'none';
      codeBlock.textContent = '';
    }

    // Options
    const optionsContainer = document.getElementById('exam-options-container');
    optionsContainer.innerHTML = '';

    const currentAnswers = state.examUserAnswers[state.examIndex] || new Set();

    q.options.forEach(opt => {
      const item = document.createElement('div');
      item.className = 'option-item' + (currentAnswers.has(opt.key) ? ' selected' : '');
      item.dataset.key = opt.key;
      item.innerHTML = `
        <div class="option-key">${opt.key}</div>
        <div class="option-text">${formatMarkdown(opt.text)}</div>
      `;

      item.addEventListener('click', () => {
        handleExamOptionClick(opt.key);
      });

      optionsContainer.appendChild(item);
    });

    if (window.Prism) {
      optionsContainer.querySelectorAll('pre code').forEach(el => Prism.highlightElement(el));
    }

    // Nav buttons
    document.getElementById('btn-exam-prev').disabled = (state.examIndex === 0);
    document.getElementById('btn-exam-next').disabled = (state.examIndex === state.examQuestions.length - 1);

    updatePaletteHighlight();
  }

  function handleExamOptionClick(key) {
    const q = state.examQuestions[state.examIndex];
    if (!state.examUserAnswers[state.examIndex]) {
      state.examUserAnswers[state.examIndex] = new Set();
    }
    const current = state.examUserAnswers[state.examIndex];

    if (q.isMultipleChoice) {
      if (current.has(key)) current.delete(key);
      else current.add(key);
    } else {
      current.clear();
      current.add(key);
    }

    if (current.size === 0) {
      delete state.examUserAnswers[state.examIndex];
    }

    // Update UI selected
    const items = document.querySelectorAll('#exam-options-container .option-item');
    items.forEach(item => {
      if (current && current.has(item.dataset.key)) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });

    updatePaletteItem(state.examIndex);
  }

  function renderExamPalette() {
    const palette = document.getElementById('exam-palette-grid');
    palette.innerHTML = '';

    state.examQuestions.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.className = 'palette-btn';
      btn.id = `palette-btn-${idx}`;
      btn.textContent = idx + 1;
      btn.title = `Câu hỏi ${idx + 1}`;

      btn.addEventListener('click', () => {
        state.examIndex = idx;
        renderExamQuestion();
      });

      palette.appendChild(btn);
    });

    updatePaletteHighlight();
  }

  function updatePaletteItem(idx) {
    const btn = document.getElementById(`palette-btn-${idx}`);
    if (!btn) return;
    const hasAnswer = state.examUserAnswers[idx] && state.examUserAnswers[idx].size > 0;
    const isFlagged = state.examFlagged.has(idx);

    if (hasAnswer) btn.classList.add('answered');
    else btn.classList.remove('answered');

    if (isFlagged) btn.classList.add('flagged');
    else btn.classList.remove('flagged');
  }

  function updatePaletteHighlight() {
    document.querySelectorAll('.palette-btn').forEach((btn, idx) => {
      if (idx === state.examIndex) btn.classList.add('active');
      else btn.classList.remove('active');
      updatePaletteItem(idx);
    });
  }

  function toggleExamFlag() {
    if (state.examFlagged.has(state.examIndex)) {
      state.examFlagged.delete(state.examIndex);
    } else {
      state.examFlagged.add(state.examIndex);
    }
    renderExamQuestion();
  }

  function finishAndGradeExam() {
    if (state.examTimerInterval) clearInterval(state.examTimerInterval);

    const totalQuestions = state.examQuestions.length;
    let correctCount = 0;
    const chapterBreakdown = {};
    const detailedResults = [];

    state.examQuestions.forEach((q, idx) => {
      const userAnswers = state.examUserAnswers[idx] ? Array.from(state.examUserAnswers[idx]) : [];
      const isCorrect = evaluateAnswer(userAnswers, q.correctAnswers);
      if (isCorrect) correctCount++;

      // Chapter breakdown
      if (!chapterBreakdown[q.chapterId]) {
        chapterBreakdown[q.chapterId] = {
          title: q.chapterTitle,
          total: 0,
          correct: 0
        };
      }
      chapterBreakdown[q.chapterId].total++;
      if (isCorrect) chapterBreakdown[q.chapterId].correct++;

      detailedResults.push({
        question: q,
        userAnswers,
        isCorrect,
        isFlagged: state.examFlagged.has(idx)
      });
    });

    const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passed = scorePercent >= 68; // Oracle OCP Passing Score

    // Calculate time spent
    const now = new Date();
    const timeSpentMs = now - (state.examStartTime || now);
    const spentMinutes = Math.floor(timeSpentMs / 60000);
    const spentSeconds = Math.floor((timeSpentMs % 60000) / 1000);

    const examResult = {
      id: `exam_${Date.now()}`,
      timestamp: now.toISOString(),
      totalQuestions,
      correctCount,
      scorePercent,
      passed,
      spentTimeStr: `${spentMinutes} phút ${spentSeconds} giây`,
      chapterBreakdown,
      detailedResults
    };

    QuizStorage.saveExamResult(examResult);
    state.lastExamResult = examResult;

    renderExamResults(examResult);
    switchView('result');
  }

  // --- RESULT & REVIEW FUNCTIONS ---
  function renderExamResults(result) {
    const badge = document.getElementById('result-pass-badge');
    const scoreText = document.getElementById('result-score-percent');

    if (result.passed) {
      badge.textContent = '🎉 PASSED (ĐẠT CHUẨN ORACLE)';
      badge.className = 'pass-status status-passed';
      scoreText.style.color = 'var(--success)';
    } else {
      badge.textContent = '⚠️ FAILED (CHƯA ĐẠT - CẦN CỐ GẮNG)';
      badge.className = 'pass-status status-failed';
      scoreText.style.color = 'var(--danger)';
    }

    scoreText.textContent = `${result.scorePercent}%`;
    document.getElementById('result-correct-count').textContent = result.correctCount;
    document.getElementById('result-total-count').textContent = result.totalQuestions;
    document.getElementById('result-time-spent').textContent = result.spentTimeStr;

    // Render Chapter Breakdown
    const chContainer = document.getElementById('result-chapter-breakdown');
    chContainer.innerHTML = '';
    Object.keys(result.chapterBreakdown).forEach(chId => {
      const data = result.chapterBreakdown[chId];
      const pct = Math.round((data.correct / data.total) * 100);
      const row = document.createElement('div');
      row.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; margin-bottom: 0.25rem;">
          <span>${data.title}</span>
          <span><strong>${data.correct}/${data.total}</strong> (${pct}%)</span>
        </div>
        <div class="progress-bar-bg" style="height: 6px;">
          <div class="progress-bar-fill" style="width: ${pct}%; background: ${pct >= 68 ? 'var(--success)' : 'var(--danger)'};"></div>
        </div>
      `;
      chContainer.appendChild(row);
    });

    renderReviewQuestionsList();
  }

  function renderReviewQuestionsList() {
    const container = document.getElementById('review-questions-list');
    if (!container || !state.lastExamResult) return;
    container.innerHTML = '';

    const filter = state.reviewFilter;
    const filtered = state.lastExamResult.detailedResults.filter(item => {
      if (filter === 'wrong') return !item.isCorrect;
      if (filter === 'correct') return item.isCorrect;
      if (filter === 'flagged') return item.isFlagged;
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Không có câu hỏi nào khớp với bộ lọc.</div>`;
      return;
    }

    filtered.forEach((item, idx) => {
      const q = item.question;
      const card = document.createElement('div');
      card.className = 'question-box';
      card.style.borderLeft = item.isCorrect ? '4px solid var(--success)' : '4px solid var(--danger)';

      let userSelectionStr = item.userAnswers.length > 0 ? item.userAnswers.join(', ') : '(Bỏ trống)';
      let correctAnswersStr = q.correctAnswers.join(', ');

      let codeHtml = '';
      if (q.codeSnippet) {
        codeHtml = `<pre style="margin: 1rem 0;"><code class="language-java">${q.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      }

      let optionsHtml = '';
      q.options.forEach(opt => {
        const isUserSelected = item.userAnswers.includes(opt.key);
        const isCorrectAns = q.correctAnswers.includes(opt.key);
        let optStyle = 'padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.4rem; display: flex; gap: 0.5rem;';
        if (isCorrectAns) {
          optStyle += ' background: var(--success-bg); border: 1px solid var(--success-border); font-weight: 600;';
        } else if (isUserSelected && !isCorrectAns) {
          optStyle += ' background: var(--danger-bg); border: 1px solid var(--danger-border);';
        } else {
          optStyle += ' background: rgba(255,255,255,0.02);';
        }
        optionsHtml += `
          <div style="${optStyle}">
            <span>${opt.key}.</span>
            <span>${formatMarkdown(opt.text)}</span>
            ${isCorrectAns ? '<span style="margin-left: auto; color: var(--success);">✔ Đúng</span>' : ''}
            ${isUserSelected && !isCorrectAns ? '<span style="margin-left: auto; color: var(--danger);">✖ Lựa chọn của bạn</span>' : ''}
          </div>
        `;
      });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; color: ${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
            ${item.isCorrect ? '✔️ ĐÚNG' : '❌ SAI'} — Câu ${idx + 1} (${q.chapterTitle})
          </span>
          <div>
            ${item.isFlagged ? '<span class="badge badge-warning">🚩 Cắm cờ</span>' : ''}
            <button class="btn btn-secondary btn-sm btn-bookmark-in-review" data-qid="${q.id}" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">
              ⭐ ${QuizStorage.isBookmarked(q.id) ? 'Đã lưu' : 'Lưu câu này'}
            </button>
          </div>
        </div>

        <div style="font-size: 1.05rem; font-weight: 600; margin-bottom: 0.75rem;">${formatMarkdown(q.questionText)}</div>
        ${codeHtml}
        <div style="margin: 1rem 0;">${optionsHtml}</div>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--success-border); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
          <div style="color: var(--success); font-weight: 700; margin-bottom: 0.5rem;">💡 Giải Thích Chuyên Sâu:</div>
          <div class="explanation-body" style="font-size: 0.95rem;">${formatMarkdown(q.explanation)}</div>
        </div>
      `;

      card.querySelector('.btn-bookmark-in-review').addEventListener('click', (e) => {
        QuizStorage.toggleBookmark(q.id);
        e.currentTarget.textContent = QuizStorage.isBookmarked(q.id) ? '⭐ Đã lưu' : '⭐ Lưu câu này';
        updateDashboardStats();
      });

      container.appendChild(card);
    });

    if (window.Prism) {
      Prism.highlightAllUnder(container);
    }
  }

  // --- BOOKMARKS & MISTAKES MODAL ---
  function openListModal(type) {
    const modal = document.getElementById('list-modal');
    const title = document.getElementById('list-modal-title');
    const content = document.getElementById('list-modal-content');
    const practiceBtn = document.getElementById('btn-practice-modal-items');

    content.innerHTML = '';

    if (type === 'bookmarks') {
      title.textContent = '⭐ Danh Sách Câu Đã Đánh Dấu (Bookmarks)';
      const bookmarks = QuizStorage.getBookmarks();
      const questions = window.QUIZ_DATA.questions.filter(q => bookmarks.includes(q.id));

      if (questions.length === 0) {
        content.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Chưa có câu hỏi nào được đánh dấu. Hãy bấm ⭐ khi luyện tập!</div>';
        practiceBtn.style.display = 'none';
      } else {
        practiceBtn.style.display = 'block';
        practiceBtn.textContent = `🎯 Luyện tập ${questions.length} câu đã lưu`;
        practiceBtn.onclick = () => {
          modal.classList.remove('show');
          startPracticeSession(questions, `Các câu hỏi đã đánh dấu (${questions.length} câu)`);
        };

        questions.forEach(q => {
          const item = document.createElement('div');
          item.style.cssText = 'padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;';
          item.innerHTML = `
            <div>
              <div style="font-size: 0.8rem; color: var(--accent-primary); font-weight: 600;">${q.chapterTitle} - Câu ${q.questionNumber}</div>
              <div style="font-size: 0.95rem; font-weight: 500; max-width: 420px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${q.questionText}</div>
            </div>
            <button class="btn btn-secondary btn-sm btn-remove-bm" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Bỏ lưu</button>
          `;
          item.querySelector('.btn-remove-bm').addEventListener('click', () => {
            QuizStorage.toggleBookmark(q.id);
            openListModal('bookmarks');
            updateDashboardStats();
          });
          content.appendChild(item);
        });
      }
    } else {
      title.textContent = '❌ Sổ Tay Câu Hỏi Làm Sai (Mistakes Notebook)';
      const mistakes = QuizStorage.getMistakes();
      const questionIds = Object.keys(mistakes);
      const questions = window.QUIZ_DATA.questions.filter(q => questionIds.includes(q.id));

      if (questions.length === 0) {
        content.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Tuyệt vời! Bạn chưa có câu làm sai nào cần ôn lại.</div>';
        practiceBtn.style.display = 'none';
      } else {
        practiceBtn.style.display = 'block';
        practiceBtn.textContent = `🎯 Ôn luyện ngay ${questions.length} câu làm sai`;
        practiceBtn.onclick = () => {
          modal.classList.remove('show');
          startPracticeSession(questions, `Ôn tập câu làm sai (${questions.length} câu)`);
        };

        questions.forEach(q => {
          const wrongCount = mistakes[q.id].wrongCount;
          const item = document.createElement('div');
          item.style.cssText = 'padding: 0.75rem; background: rgba(0,0,0,0.2); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;';
          item.innerHTML = `
            <div>
              <div style="font-size: 0.8rem; color: var(--danger); font-weight: 600;">${q.chapterTitle} • Sai ${wrongCount} lần</div>
              <div style="font-size: 0.95rem; font-weight: 500; max-width: 420px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${q.questionText}</div>
            </div>
            <button class="btn btn-secondary btn-sm btn-clear-mistake" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Đã hiểu</button>
          `;
          item.querySelector('.btn-clear-mistake').addEventListener('click', () => {
            QuizStorage.clearMistake(q.id);
            openListModal('mistakes');
            updateDashboardStats();
          });
          content.appendChild(item);
        });
      }
    }

    modal.classList.add('show');
  }

  // --- VIDEO LECTURE FUNCTIONS ---
  const CHAPTER_VIDEOS = {
    1: {
      chapterId: 1,
      title: "Giải Mã OCP Java SE 21 - Chương 1: Building Blocks",
      subtitle: "Cấu trúc Class, Packages, Imports, Kiểu nguyên thủy, Scope biến, Text Blocks & Garbage Collection",
      filename: "Giải_Mã_OCP_Java_SE_21_Chương_1.mp4"
    },
    2: {
      chapterId: 2,
      title: "OCP Java SE 21 - Chương 2: Operators (Toán Tử)",
      subtitle: "Toán tử một ngôi, số học, ép kiểu (casting), quan hệ, logic, toán tử ba ngôi & bẫy thi ngầm định",
      filename: "OCP_Java_SE_21__Toán_Tử_chương_2.mp4"
    },
    3: {
      chapterId: 3,
      title: "OCP Java 21 - Chương 3: Making Decisions (Cấu Trúc Điều Khiển)",
      subtitle: "Câu lệnh if-else, switch statement, pattern matching switch Java 21, vòng lặp while, do-while, for",
      filename: "OCP_Java_21__Quyết_Định_Chương_3.mp4"
    },
    4: {
      chapterId: 4,
      title: "OCP Java SE 21 Masterclass - Chương 4: Core APIs",
      subtitle: "Các API cốt lõi: String, StringBuilder, Mảng (Arrays.compare / mismatch), Math, Date & Time API",
      filename: "OCP_Java_SE_21_Masterclass_chương_4.mp4"
    },
    5: {
      chapterId: 5,
      title: "OCP Java 21 - Chương 5: Methods (Phương Thức)",
      subtitle: "Bẫy biên dịch Access Modifiers, Static vs Instance, Overloading, Varargs & Kiểu trả về",
      filename: "OCP_Java_21__Bẫy_Biên_Dịch_chương_5.mp4"
    },
    6: {
      chapterId: 6,
      title: "OCP Java 21 - Chương 6: Class Design (Thiết Kế Lớp)",
      subtitle: "Kế thừa, Thứ tự khởi tạo (Initialization Order), Abstract classes & Ghi đè phương thức (Overriding)",
      filename: "OCP_Java_21__Thiết_Kế_Lớp_chương_6.mp4"
    },
    7: {
      chapterId: 7,
      title: "OCP Java 21 - Chương 7: Beyond Classes (Enums, Records & Sealed)",
      subtitle: "Lập trình nâng cao với Enums, Records bất biến, Sealed Classes & Sealed Interfaces",
      filename: "OCP_Java_21__Beyond_Classes_Chương_7.mp4"
    },
    8: {
      chapterId: 8,
      title: "Chuyên Sâu OCP Java 21 - Chương 8: Lambdas & Functional Interfaces",
      subtitle: "Cú pháp biểu thức Lambda, Method References và bộ các Functional Interfaces tiêu chuẩn trong java.util.function",
      filename: "Chuyên_Sâu_OCP_Chapter_8.mp4"
    }
  };

  function openVideoModal(chapterId = 1) {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    // Render playlist tabs
    const tabsContainer = document.getElementById('video-chapter-tabs');
    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      Object.values(CHAPTER_VIDEOS).forEach(v => {
        const tab = document.createElement('button');
        tab.className = `video-tab-btn ${v.chapterId === Number(chapterId) ? 'active' : ''}`;
        tab.innerHTML = `<span>Chương ${v.chapterId}</span>`;
        tab.title = v.title;
        tab.addEventListener('click', () => {
          playChapterVideo(v.chapterId);
        });
        tabsContainer.appendChild(tab);
      });
    }

    playChapterVideo(chapterId);
    modal.classList.add('show');
  }

  function playChapterVideo(chapterId) {
    const videoData = CHAPTER_VIDEOS[chapterId] || CHAPTER_VIDEOS[1];
    const player = document.getElementById('video-player');
    const source = document.getElementById('video-source');
    const titleEl = document.getElementById('video-modal-title');
    const subtitleEl = document.getElementById('video-modal-subtitle');

    if (titleEl) titleEl.textContent = videoData.title;
    if (subtitleEl) subtitleEl.textContent = videoData.subtitle;

    const videoUrl = `videos/${encodeURIComponent(videoData.filename)}`;
    if (source && source.getAttribute('src') !== videoUrl) {
      source.src = videoUrl;
      player.load();
    }

    // Update active tab styling
    document.querySelectorAll('.video-tab-btn').forEach(btn => {
      if (btn.textContent.includes(`Chương ${chapterId}`)) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    if (player) {
      player.play().catch(e => console.log('Autoplay prevented:', e));
    }
  }

  function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const player = document.getElementById('video-player');
    if (player) {
      player.pause();
    }
    modal.classList.remove('show');
  }

  // --- KEYBOARD SHORTCUTS ---
  function setupKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Don't intercept if inside input / modal
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        closeVideoModal();
        const listModal = document.getElementById('list-modal');
        if (listModal) listModal.classList.remove('show');
        const examModal = document.getElementById('exam-setup-modal');
        if (examModal) examModal.classList.remove('show');
        return;
      }

      if (state.currentView === 'practice') {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
          if (key === 'B' && e.shiftKey) {
            // Shift+B or plain B
          }
          // Check if option key exists in current question
          const q = state.practiceQuestions[state.practiceIndex];
          if (q && q.options.some(o => o.key === key)) {
            handleOptionClick(key);
            return;
          }
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          checkPracticeAnswer();
        } else if (e.key === 'ArrowRight') {
          if (state.practiceIndex < state.practiceQuestions.length - 1) {
            state.practiceIndex++;
            renderPracticeQuestion();
          }
        } else if (e.key === 'ArrowLeft') {
          if (state.practiceIndex > 0) {
            state.practiceIndex--;
            renderPracticeQuestion();
          }
        } else if (e.key.toLowerCase() === 'b' && !e.ctrlKey) {
          const q = state.practiceQuestions[state.practiceIndex];
          if (q) {
            QuizStorage.toggleBookmark(q.id);
            updatePracticeBookmarkButton(q.id);
            updateDashboardStats();
          }
        }
      } else if (state.currentView === 'exam') {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(key) && !e.ctrlKey && !e.altKey) {
          const q = state.examQuestions[state.examIndex];
          if (q && q.options.some(o => o.key === key)) {
            handleExamOptionClick(key);
          }
        } else if (e.key === 'ArrowRight') {
          if (state.examIndex < state.examQuestions.length - 1) {
            state.examIndex++;
            renderExamQuestion();
          }
        } else if (e.key === 'ArrowLeft') {
          if (state.examIndex > 0) {
            state.examIndex--;
            renderExamQuestion();
          }
        }
      }
    });
  }

  // --- INITIALIZATION ---
  function init() {
    // 1. Theme Setup
    const savedTheme = QuizStorage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);

    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      QuizStorage.setTheme(next);
    });

    // 2. Navigation & Brand
    document.getElementById('brand-logo').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('dashboard');
    });

    document.getElementById('btn-open-videos').addEventListener('click', () => openVideoModal(1));
    document.getElementById('btn-close-video-modal').addEventListener('click', closeVideoModal);
    document.getElementById('video-modal').addEventListener('click', (e) => {
      if (e.target.id === 'video-modal') closeVideoModal();
    });

    document.getElementById('btn-open-bookmarks').addEventListener('click', () => openListModal('bookmarks'));
    document.getElementById('btn-open-mistakes').addEventListener('click', () => openListModal('mistakes'));

    // 3. Practice View Navigation
    document.getElementById('btn-practice-back').addEventListener('click', () => switchView('dashboard'));
    document.getElementById('btn-practice-prev').addEventListener('click', () => {
      if (state.practiceIndex > 0) {
        state.practiceIndex--;
        renderPracticeQuestion();
      }
    });
    document.getElementById('btn-practice-next').addEventListener('click', () => {
      if (state.practiceIndex < state.practiceQuestions.length - 1) {
        state.practiceIndex++;
        renderPracticeQuestion();
      }
    });
    document.getElementById('btn-check-answer').addEventListener('click', checkPracticeAnswer);
    document.getElementById('btn-reset-practice-question').addEventListener('click', renderPracticeQuestion);
    document.getElementById('btn-practice-bookmark').addEventListener('click', () => {
      const q = state.practiceQuestions[state.practiceIndex];
      if (q) {
        QuizStorage.toggleBookmark(q.id);
        updatePracticeBookmarkButton(q.id);
        updateDashboardStats();
      }
    });
    document.getElementById('btn-practice-video').addEventListener('click', () => {
      const q = state.practiceQuestions[state.practiceIndex];
      const chId = q ? q.chapterId : 1;
      openVideoModal(chId);
    });

    // 4. Exam Setup Modal
    document.getElementById('btn-quick-full-exam').addEventListener('click', () => openExamSetupModal(null));
    document.getElementById('btn-close-exam-modal').addEventListener('click', () => {
      document.getElementById('exam-setup-modal').classList.remove('show');
    });
    document.getElementById('btn-toggle-all-chapters').addEventListener('click', (e) => {
      const cbs = document.querySelectorAll('.modal-ch-cb');
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
      e.target.textContent = allChecked ? 'Chọn tất cả' : 'Bỏ chọn tất cả';
    });
    document.getElementById('btn-start-exam-now').addEventListener('click', startExamFromModal);

    // 5. Exam Room Navigation
    document.getElementById('btn-exam-quit').addEventListener('click', () => {
      if (confirm('Bạn có chắc chắn muốn thoát khỏi bài thi? Kết quả sẽ không được lưu.')) {
        if (state.examTimerInterval) clearInterval(state.examTimerInterval);
        switchView('dashboard');
      }
    });
    document.getElementById('btn-exam-flag').addEventListener('click', toggleExamFlag);
    document.getElementById('btn-exam-prev').addEventListener('click', () => {
      if (state.examIndex > 0) {
        state.examIndex--;
        renderExamQuestion();
      }
    });
    document.getElementById('btn-exam-next').addEventListener('click', () => {
      if (state.examIndex < state.examQuestions.length - 1) {
        state.examIndex++;
        renderExamQuestion();
      }
    });
    document.getElementById('btn-exam-submit').addEventListener('click', () => {
      const unanswered = state.examQuestions.length - Object.keys(state.examUserAnswers).length;
      let msg = 'Bạn có chắc chắn muốn nộp bài thi?';
      if (unanswered > 0) {
        msg = `Bạn còn ${unanswered} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài không?`;
      }
      if (confirm(msg)) {
        finishAndGradeExam();
      }
    });

    // 6. Result & Review Controls
    document.getElementById('btn-result-home').addEventListener('click', () => switchView('dashboard'));
    document.getElementById('btn-result-review-all').addEventListener('click', () => {
      document.getElementById('exam-review-section').scrollIntoView({ behavior: 'smooth' });
    });

    document.querySelectorAll('#review-filters button').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#review-filters button').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.reviewFilter = e.currentTarget.dataset.filter;
        renderReviewQuestionsList();
      });
    });

    // 7. Modals close
    document.getElementById('btn-close-list-modal').addEventListener('click', () => {
      document.getElementById('list-modal').classList.remove('show');
    });

    // 8. Keyboard shortcuts
    setupKeyboardShortcuts();

    // 9. Initial Render
    switchView('dashboard');
  }

  // DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
