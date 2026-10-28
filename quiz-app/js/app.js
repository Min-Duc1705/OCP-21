// ==========================================================================
// OCP Java 21 Quiz Master - Main Application Controller (app.js)
// Works alongside modular i18n.js, theory-viewer.js, and storage.js
// ==========================================================================

(function() {
  'use strict';

  const { I18N, CHAPTER_METADATA, CHAPTER_VIDEOS, formatMarkdown } = window.AppI18n;

  const state = {
    currentView: 'dashboard',
    chapterFilter: 'all',
    chapterSearch: '',

    // Practice State
    practiceQuestions: [],
    practiceIndex: 0,
    practiceSelectedOptions: new Set(),
    practiceChecked: false,
    practiceStatuses: {},

    // Exam State
    examQuestions: [],
    examIndex: 0,
    examUserAnswers: {},
    examFlagged: new Set(),
    examTimerSeconds: 0,
    examTimerInterval: null,
    examStartTime: null,
    examTotalDuration: 0,

    // Result / Review State
    lastExamResult: null,
    reviewFilter: 'all',

    // Language State ('en' | 'vi')
    questionLang: (typeof localStorage !== 'undefined' && localStorage.getItem('ocp21_question_lang')) || 'en'
  };

  function t(key, vars) {
    const dict = I18N[state.questionLang] || I18N.vi;
    let str = dict[key] || I18N.vi[key] || key;
    if (vars) {
      Object.keys(vars).forEach(k => {
        str = str.replace(`{${k}}`, vars[k]);
      });
    }
    return str;
  }

  function getQText(q) {
    if (!q) return '';
    return (state.questionLang === 'en' && q.questionTextEn) ? q.questionTextEn : (q.questionTextVi || q.questionText);
  }

  function getQOptions(q) {
    if (!q) return [];
    return (state.questionLang === 'en' && q.optionsEn && q.optionsEn.length) ? q.optionsEn : (q.optionsVi || q.options);
  }

  function getQExplanation(q) {
    if (!q) return '';
    return (state.questionLang === 'en' && q.explanationEn) ? q.explanationEn : (q.explanationVi || q.explanation);
  }

  function applyI18nToDOM() {
    const isEn = state.questionLang === 'en';
    document.documentElement.lang = isEn ? 'en' : 'vi';

    const segEn = document.getElementById('lang-seg-en');
    const segVi = document.getElementById('lang-seg-vi');
    if (segEn && segVi) {
      segEn.classList.toggle('active', isEn);
      segVi.classList.toggle('active', !isEn);
    }

    document.querySelectorAll('.btn-inline-lang-toggle').forEach(btn => {
      btn.innerHTML = isEn ? '🇬🇧 EN → 🇻🇳 VI' : '🇻🇳 VI → 🇬🇧 EN';
    });

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    });
  }

  function refreshQuestionLanguageInPlace() {
    applyI18nToDOM();

    if (state.currentView === 'dashboard') {
      renderChapterCards();
    } else if (state.currentView === 'practice') {
      const q = state.practiceQuestions[state.practiceIndex];
      if (!q) return;
      const badge = document.getElementById('practice-type-badge');
      if (badge) badge.textContent = q.isMultipleChoice ? t('common.multiChoice') : t('common.singleChoice');
      updatePracticeBookmarkButton(q.id);
      document.getElementById('practice-prompt-text').innerHTML = formatMarkdown(getQText(q));
      const opts = getQOptions(q);
      document.querySelectorAll('#practice-options-container .option-item').forEach(item => {
        const key = item.dataset.key;
        const found = opts.find(o => o.key === key);
        const textEl = item.querySelector('.option-text');
        if (found && textEl) textEl.innerHTML = formatMarkdown(found.text);
      });
      if (window.Prism) {
        document.querySelectorAll('#practice-options-container pre code').forEach(el => Prism.highlightElement(el));
      }
      const checkBtn = document.getElementById('btn-check-answer');
      if (state.practiceChecked) {
        const isCorrect = evaluateAnswer(state.practiceSelectedOptions, q.correctAnswers);
        if (checkBtn) checkBtn.textContent = isCorrect ? t('practice.checkedCorrect') : t('practice.checkedWrong');
        const explText = document.getElementById('practice-explanation-text');
        if (explText) {
          explText.innerHTML = `
            <div class="explanation-status-banner">
              <strong>${t('common.correctAnswerLabel')}</strong>
              <span class="badge badge-success" style="font-size: 0.9rem;">${q.correctAnswers.join(', ')}</span>
              ${isCorrect ? `<span style="color: var(--success); font-weight: 700;">${t('common.correctBanner')}</span>` : `<span style="color: var(--danger); font-weight: 700;">${t('common.wrongBanner')}</span>`}
            </div>
            <div>${formatMarkdown(getQExplanation(q))}</div>
          `;
        }
      } else if (checkBtn) {
        checkBtn.textContent = t('practice.checkBtn');
      }
    } else if (state.currentView === 'exam') {
      renderExamQuestion();
    } else if (state.currentView === 'result') {
      if (state.lastExamResult) renderExamResults(state.lastExamResult);
    }

    const theoryModal = document.getElementById('theory-modal');
    if (theoryModal && theoryModal.classList.contains('show') && window.TheoryViewer) {
      window.TheoryViewer.populateTheorySidebar();
    }
  }

  function toggleQuestionLang() {
    state.questionLang = state.questionLang === 'en' ? 'vi' : 'en';
    try { localStorage.setItem('ocp21_question_lang', state.questionLang); } catch (e) {}
    refreshQuestionLanguageInPlace();
  }

  function evaluateAnswer(selectedKeys, correctAnswers) {
    const sel = [...selectedKeys].sort();
    const corr = [...correctAnswers].sort();
    if (sel.length !== corr.length) return false;
    return sel.every((val, idx) => val === corr[idx]);
  }

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

  // --- DASHBOARD ---
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
    const isEn = state.questionLang === 'en';
    const searchTerm = (state.chapterSearch || '').trim().toLowerCase();

    window.QUIZ_DATA.chapters.forEach(ch => {
      const chQuestions = window.QUIZ_DATA.questions.filter(q => q.chapterId === ch.id);
      let completedInCh = 0;
      chQuestions.forEach(q => {
        if (progress[q.id] && progress[q.id].answered) completedInCh++;
      });
      const pct = ch.questionCount > 0 ? Math.round((completedInCh / ch.questionCount) * 100) : 0;
      const meta = CHAPTER_METADATA[ch.id] || { icon: '📘', vi: ch.title, en: ch.title, tags: [] };

      // Filter by status
      if (state.chapterFilter === 'progress' && (completedInCh === 0 || pct === 100)) return;
      if (state.chapterFilter === 'done' && pct < 100) return;

      // Filter by search
      if (searchTerm) {
        const hay = `${ch.id} ${meta.vi} ${meta.en} ${(meta.tags || []).join(' ')}`.toLowerCase();
        if (!hay.includes(searchTerm)) return;
      }

      const hasVideo = Boolean(CHAPTER_VIDEOS[ch.id]);
      const displayTitle = isEn ? `Chapter ${ch.id}: ${meta.en}` : `Chương ${ch.id}: ${meta.vi}`;
      const subTitle = isEn ? meta.vi : meta.en;
      const tagsHtml = (meta.tags || []).map(tag => `<span class="chapter-topic-tag">${tag}</span>`).join('');

      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div>
          <div class="chapter-header">
            <span class="chapter-num-pill">
              <span class="chapter-icon-box">${meta.icon || '📘'}</span>
              <span>${t('chapter.label')} ${String(ch.id).padStart(2, '0')}</span>
            </span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${hasVideo ? `<span class="badge badge-warning">${t('chapter.hasVideo')}</span>` : ''}
              <span class="badge badge-info">${ch.questionCount} ${t('chapter.qCount')}</span>
            </div>
          </div>
          <h3 class="chapter-title">${displayTitle}</h3>
          <div class="chapter-sub-desc">${subTitle}</div>
          <div class="chapter-tags-row">${tagsHtml}</div>
          <div class="progress-container">
            <div class="progress-info">
              <span>${t('chapter.progress')}</span>
              <span><strong>${completedInCh}</strong> / ${ch.questionCount} (${pct}%)</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${pct}%;"></div>
            </div>
          </div>
        </div>
        <div>
          <div class="chapter-actions">
            <button class="btn btn-secondary btn-open-theory-ch" data-chapter="${ch.id}">${t('chapter.btnTheory')}</button>
            <button class="btn btn-secondary btn-start-practice" data-chapter="${ch.id}">${t('chapter.btnPractice')}</button>
            <button class="btn btn-primary btn-start-exam-ch" data-chapter="${ch.id}">${t('chapter.btnExam')}</button>
          </div>
          ${hasVideo ? `
          <div style="margin-top: 0.65rem; padding-top: 0.65rem; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
            <span style="font-size: 0.76rem; color: var(--text-muted);">${t('chapter.videoLabel')}</span>
            <button class="btn-chapter-video btn-open-video-ch" data-chapter="${ch.id}">${t('chapter.watchVideo')}</button>
          </div>` : ''}
        </div>
      `;

      card.querySelector('.btn-open-theory-ch').addEventListener('click', () => window.TheoryViewer.openTheoryModal(ch.id));
      card.querySelector('.btn-start-practice').addEventListener('click', () => startPracticeForChapter(ch.id));
      card.querySelector('.btn-start-exam-ch').addEventListener('click', () => openExamSetupModal(ch.id));
      if (hasVideo) {
        card.querySelector('.btn-open-video-ch').addEventListener('click', () => window.TheoryViewer.openVideoModal(ch.id));
      }

      container.appendChild(card);
    });
  }

  // --- PRACTICE MODE ---
  function startPracticeForChapter(chapterId) {
    const questions = window.QUIZ_DATA.questions.filter(q => q.chapterId === chapterId);
    if (!questions.length) return;
    const meta = CHAPTER_METADATA[chapterId] || { vi: questions[0].chapterTitle, en: questions[0].chapterTitle };
    const title = state.questionLang === 'en'
      ? `Chapter ${chapterId}: ${meta.en}`
      : `Chương ${chapterId}: ${meta.vi}`;
    startPracticeSession(questions, title);
  }

  function startPracticeSession(questions, title) {
    state.practiceQuestions = questions;
    state.practiceIndex = 0;
    state.practiceSelectedOptions = new Set();
    state.practiceChecked = false;
    state.practiceStatuses = {};

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
        try { pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' }); } catch (e) {}
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

    document.getElementById('practice-current-index').textContent = state.practiceIndex + 1;
    document.getElementById('practice-question-id').textContent = q.id;

    const badge = document.getElementById('practice-type-badge');
    if (q.isMultipleChoice) {
      badge.textContent = t('common.multiChoice');
      badge.className = 'badge badge-warning';
    } else {
      badge.textContent = t('common.singleChoice');
      badge.className = 'badge badge-info';
    }

    const btnPracticeVideo = document.getElementById('btn-practice-video');
    if (btnPracticeVideo) {
      btnPracticeVideo.style.display = CHAPTER_VIDEOS[q.chapterId] ? 'inline-flex' : 'none';
    }

    updatePracticeBookmarkButton(q.id);
    document.getElementById('practice-prompt-text').innerHTML = formatMarkdown(getQText(q));

    const codeContainer = document.getElementById('practice-code-container');
    const codeBlock = document.getElementById('practice-code-block');
    if (q.codeSnippet) {
      codeContainer.style.display = 'block';
      codeBlock.textContent = q.codeSnippet;
      if (window.Prism) Prism.highlightElement(codeBlock);
    } else {
      codeContainer.style.display = 'none';
      codeBlock.textContent = '';
    }

    const optionsContainer = document.getElementById('practice-options-container');
    optionsContainer.innerHTML = '';

    getQOptions(q).forEach(opt => {
      const item = document.createElement('div');
      item.className = 'option-item';
      item.dataset.key = opt.key;
      item.innerHTML = `
        <div class="option-key">${opt.key}</div>
        <div class="option-text">${formatMarkdown(opt.text)}</div>
      `;

      item.addEventListener('click', () => {
        if (state.practiceChecked) return;
        handleOptionClick(opt.key);
      });

      optionsContainer.appendChild(item);
    });

    if (window.Prism) {
      optionsContainer.querySelectorAll('pre code').forEach(el => Prism.highlightElement(el));
    }

    const explCard = document.getElementById('practice-explanation-card');
    explCard.classList.remove('show');
    explCard.style.display = 'none';

    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.disabled = false;
    checkBtn.textContent = t('practice.checkBtn');

    document.getElementById('btn-practice-prev').disabled = (state.practiceIndex === 0);
    document.getElementById('btn-practice-next').disabled = (state.practiceIndex === state.practiceQuestions.length - 1);

    updatePracticePaletteHighlight();
  }

  function handleOptionClick(key) {
    const q = state.practiceQuestions[state.practiceIndex];
    if (q.isMultipleChoice) {
      if (state.practiceSelectedOptions.has(key)) state.practiceSelectedOptions.delete(key);
      else state.practiceSelectedOptions.add(key);
    } else {
      state.practiceSelectedOptions.clear();
      state.practiceSelectedOptions.add(key);
    }

    document.querySelectorAll('#practice-options-container .option-item').forEach(item => {
      item.classList.toggle('selected', state.practiceSelectedOptions.has(item.dataset.key));
    });
  }

  function checkPracticeAnswer() {
    if (state.practiceChecked) return;
    const q = state.practiceQuestions[state.practiceIndex];
    if (state.practiceSelectedOptions.size === 0) {
      alert(t('practice.alertSelect'));
      return;
    }

    state.practiceChecked = true;
    const isCorrect = evaluateAnswer(state.practiceSelectedOptions, q.correctAnswers);

    QuizStorage.savePracticeAnswer(q.id, isCorrect);
    QuizStorage.recordMistake(q.id, isCorrect);
    updateDashboardStats();

    state.practiceStatuses[state.practiceIndex] = { answered: true, isCorrect };
    const pill = document.getElementById(`practice-pill-${state.practiceIndex}`);
    if (pill) {
      pill.classList.remove('correct', 'incorrect');
      pill.classList.add(isCorrect ? 'correct' : 'incorrect');
    }
    updatePracticePaletteStats();

    document.querySelectorAll('#practice-options-container .option-item').forEach(item => {
      const k = item.dataset.key;
      const isExpected = q.correctAnswers.includes(k);
      const isSelected = state.practiceSelectedOptions.has(k);

      if (isExpected) item.classList.add('correct');
      else if (isSelected && !isExpected) item.classList.add('incorrect');
    });

    const explCard = document.getElementById('practice-explanation-card');
    const explText = document.getElementById('practice-explanation-text');
    explText.innerHTML = `
      <div class="explanation-status-banner">
        <strong>${t('common.correctAnswerLabel')}</strong>
        <span class="badge badge-success" style="font-size: 0.9rem;">${q.correctAnswers.join(', ')}</span>
        ${isCorrect ? `<span style="color: var(--success); font-weight: 700;">${t('common.correctBanner')}</span>` : `<span style="color: var(--danger); font-weight: 700;">${t('common.wrongBanner')}</span>`}
      </div>
      <div>${formatMarkdown(getQExplanation(q))}</div>
    `;
    explCard.style.display = 'block';
    setTimeout(() => explCard.classList.add('show'), 10);

    const checkBtn = document.getElementById('btn-check-answer');
    checkBtn.disabled = true;
    checkBtn.textContent = isCorrect ? t('practice.checkedCorrect') : t('practice.checkedWrong');
  }

  function updatePracticeBookmarkButton(questionId) {
    const btn = document.getElementById('btn-practice-bookmark');
    if (!btn) return;
    const isBookmarked = QuizStorage.isBookmarked(questionId);
    if (isBookmarked) {
      btn.innerHTML = `⭐ <span style="color: var(--warning); font-weight: 700;">${t('practice.savedBtn')}</span>`;
      btn.style.borderColor = 'var(--warning)';
    } else {
      btn.innerHTML = `⭐ <span>${t('practice.saveBtn')}</span>`;
      btn.style.borderColor = 'var(--border-color)';
    }

    const pill = document.getElementById(`practice-pill-${state.practiceIndex}`);
    if (pill) pill.classList.toggle('bookmarked', isBookmarked);
    updatePracticePaletteStats();
  }

  // --- MOCK EXAM MODE ---
  function setExamDrawerOpen(open) {
    const layout = document.getElementById('exam-layout');
    if (layout) layout.classList.toggle('drawer-open', open);
  }

  function openExamSetupModal(defaultChapterId) {
    const modal = document.getElementById('exam-setup-modal');
    const listContainer = document.getElementById('modal-chapters-list');
    listContainer.innerHTML = '';
    const isEn = state.questionLang === 'en';

    window.QUIZ_DATA.chapters.forEach(ch => {
      const isChecked = defaultChapterId ? (ch.id === defaultChapterId) : true;
      const meta = CHAPTER_METADATA[ch.id] || { vi: ch.title, en: ch.title };
      const labelTitle = isEn ? `Chapter ${ch.id}: ${meta.en}` : `Chương ${ch.id}: ${meta.vi}`;
      const row = document.createElement('label');
      row.style.cssText = 'display: flex; align-items: center; gap: 0.6rem; cursor: pointer; padding: 0.35rem; font-size: 0.88rem;';
      row.innerHTML = `
        <input type="checkbox" class="modal-ch-cb" value="${ch.id}" ${isChecked ? 'checked' : ''}>
        <span>${labelTitle} (${ch.questionCount})</span>
      `;
      listContainer.appendChild(row);
    });

    const toggleAllBtn = document.getElementById('btn-toggle-all-chapters');
    if (toggleAllBtn) {
      toggleAllBtn.textContent = defaultChapterId ? t('modalExam.selectAll') : t('modalExam.deselectAll');
    }

    modal.classList.add('show');
  }

  function startExamFromModal() {
    const selectedChBoxes = document.querySelectorAll('.modal-ch-cb:checked');
    const selectedChapterIds = Array.from(selectedChBoxes).map(cb => parseInt(cb.value, 10));

    if (selectedChapterIds.length === 0) {
      alert(t('modalExam.alertNoChapter'));
      return;
    }

    let eligibleQuestions = window.QUIZ_DATA.questions.filter(q => selectedChapterIds.includes(q.chapterId));
    eligibleQuestions = [...eligibleQuestions].sort(() => Math.random() - 0.5);

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

    const timerRadio = document.querySelector('input[name="modal-timer"]:checked').value;
    if (timerRadio === 'standard') state.examTotalDuration = Math.round(state.examQuestions.length * 2.5 * 60);
    else if (timerRadio === 'speed') state.examTotalDuration = Math.round(state.examQuestions.length * 1.5 * 60);
    else state.examTotalDuration = 0;
    state.examTimerSeconds = state.examTotalDuration;

    document.getElementById('exam-setup-modal').classList.remove('show');
    setExamDrawerOpen(false);
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
      timerDisplay.textContent = t('exam.unlimitedTime');
      timerBox.className = 'timer-box';
      return;
    }

    function updateTimerUI() {
      const minutes = Math.floor(state.examTimerSeconds / 60);
      const seconds = state.examTimerSeconds % 60;
      timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (state.examTimerSeconds <= 60) timerBox.className = 'timer-box danger';
      else if (state.examTimerSeconds <= 300) timerBox.className = 'timer-box warning';
      else timerBox.className = 'timer-box';
    }

    updateTimerUI();
    state.examTimerInterval = setInterval(() => {
      state.examTimerSeconds--;
      updateTimerUI();
      if (state.examTimerSeconds <= 0) {
        clearInterval(state.examTimerInterval);
        alert(t('exam.timeUpAlert'));
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
    badge.textContent = q.isMultipleChoice ? t('common.multiChoice') : t('common.singleChoice');
    badge.className = q.isMultipleChoice ? 'badge badge-warning' : 'badge badge-info';

    const flagBtn = document.getElementById('btn-exam-flag');
    if (state.examFlagged.has(state.examIndex)) {
      flagBtn.innerHTML = `🚩 <span style="color: var(--warning); font-weight: 700;">${t('exam.flagged')}</span>`;
      flagBtn.style.borderColor = 'var(--warning)';
    } else {
      flagBtn.innerHTML = t('exam.flag');
      flagBtn.style.borderColor = 'var(--border-color)';
    }

    document.getElementById('exam-prompt-text').innerHTML = formatMarkdown(getQText(q));

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

    const optionsContainer = document.getElementById('exam-options-container');
    optionsContainer.innerHTML = '';
    const currentAnswers = state.examUserAnswers[state.examIndex] || new Set();

    getQOptions(q).forEach(opt => {
      const item = document.createElement('div');
      item.className = 'option-item' + (currentAnswers.has(opt.key) ? ' selected' : '');
      item.dataset.key = opt.key;
      item.innerHTML = `
        <div class="option-key">${opt.key}</div>
        <div class="option-text">${formatMarkdown(opt.text)}</div>
      `;

      item.addEventListener('click', () => handleExamOptionClick(opt.key));
      optionsContainer.appendChild(item);
    });

    if (window.Prism) {
      optionsContainer.querySelectorAll('pre code').forEach(el => Prism.highlightElement(el));
    }

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

    if (current.size === 0) delete state.examUserAnswers[state.examIndex];

    document.querySelectorAll('#exam-options-container .option-item').forEach(item => {
      item.classList.toggle('selected', Boolean(current && current.has(item.dataset.key)));
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

      btn.addEventListener('click', () => {
        state.examIndex = idx;
        renderExamQuestion();
        if (window.innerWidth <= 1024) setExamDrawerOpen(false);
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

    btn.classList.toggle('answered', Boolean(hasAnswer));
    btn.classList.toggle('flagged', isFlagged);
  }

  function updatePaletteHighlight() {
    document.querySelectorAll('.palette-btn').forEach((btn, idx) => {
      btn.classList.toggle('active', idx === state.examIndex);
      updatePaletteItem(idx);
    });
  }

  function toggleExamFlag() {
    if (state.examFlagged.has(state.examIndex)) state.examFlagged.delete(state.examIndex);
    else state.examFlagged.add(state.examIndex);
    renderExamQuestion();
  }

  function finishAndGradeExam() {
    if (state.examTimerInterval) clearInterval(state.examTimerInterval);
    setExamDrawerOpen(false);

    const totalQuestions = state.examQuestions.length;
    let correctCount = 0;
    const chapterBreakdown = {};
    const detailedResults = [];

    state.examQuestions.forEach((q, idx) => {
      const userAnswers = state.examUserAnswers[idx] ? Array.from(state.examUserAnswers[idx]) : [];
      const isCorrect = evaluateAnswer(userAnswers, q.correctAnswers);
      if (isCorrect) correctCount++;

      if (!chapterBreakdown[q.chapterId]) {
        chapterBreakdown[q.chapterId] = { title: q.chapterTitle, total: 0, correct: 0 };
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
    const passed = scorePercent >= 68;

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
      spentTimeStr: `${spentMinutes}m ${spentSeconds}s`,
      chapterBreakdown,
      detailedResults
    };

    QuizStorage.saveExamResult(examResult);
    state.lastExamResult = examResult;

    renderExamResults(examResult);
    switchView('result');
  }

  // --- RESULT & REVIEW ---
  function renderExamResults(result) {
    const badge = document.getElementById('result-pass-badge');
    const scoreText = document.getElementById('result-score-percent');

    if (result.passed) {
      badge.textContent = t('result.passed');
      badge.className = 'pass-status status-passed';
      scoreText.style.color = 'var(--success)';
    } else {
      badge.textContent = t('result.failed');
      badge.className = 'pass-status status-failed';
      scoreText.style.color = 'var(--danger)';
    }

    scoreText.textContent = `${result.scorePercent}%`;
    document.getElementById('result-correct-count').textContent = result.correctCount;
    document.getElementById('result-total-count').textContent = result.totalQuestions;
    document.getElementById('result-time-spent').textContent = result.spentTimeStr;

    const chContainer = document.getElementById('result-chapter-breakdown');
    chContainer.innerHTML = '';
    Object.keys(result.chapterBreakdown).forEach(chId => {
      const data = result.chapterBreakdown[chId];
      const pct = Math.round((data.correct / data.total) * 100);
      const row = document.createElement('div');
      row.innerHTML = `
        <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.25rem;">
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
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">${t('result.emptyFilter')}</div>`;
      return;
    }

    filtered.forEach((item, idx) => {
      const q = item.question;
      const card = document.createElement('div');
      card.className = 'question-box';
      card.style.borderLeft = item.isCorrect ? '4px solid var(--success)' : '4px solid var(--danger)';

      let codeHtml = '';
      if (q.codeSnippet) {
        codeHtml = `<div class="code-snippet-wrap" style="margin: 1rem 0;"><pre><code class="language-java">${q.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre></div>`;
      }

      let optionsHtml = '';
      getQOptions(q).forEach(opt => {
        const isUserSelected = item.userAnswers.includes(opt.key);
        const isCorrectAns = q.correctAnswers.includes(opt.key);
        let optStyle = 'padding: 0.55rem 0.75rem; border-radius: var(--radius-xs); margin-bottom: 0.4rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-start;';
        if (isCorrectAns) optStyle += ' background: var(--success-bg); border: 1px solid var(--success-border); font-weight: 600;';
        else if (isUserSelected && !isCorrectAns) optStyle += ' background: var(--danger-bg); border: 1px solid var(--danger-border);';
        else optStyle += ' background: rgba(148,163,184,0.04);';

        optionsHtml += `
          <div style="${optStyle}">
            <span>${opt.key}.</span>
            <span style="flex: 1; min-width: 0;">${formatMarkdown(opt.text)}</span>
            ${isCorrectAns ? `<span style="margin-left: auto; color: var(--success); font-size: 0.82rem;">${t('result.rightChoice')}</span>` : ''}
            ${isUserSelected && !isCorrectAns ? `<span style="margin-left: auto; color: var(--danger); font-size: 0.82rem;">${t('result.yourChoice')}</span>` : ''}
          </div>
        `;
      });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span style="font-weight: 800; color: ${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
            ${item.isCorrect ? t('result.correctTag') : t('result.wrongTag')} — #${idx + 1} (${q.chapterTitle})
          </span>
          <div style="display: flex; gap: 0.4rem; align-items: center;">
            ${item.isFlagged ? `<span class="badge badge-warning">🚩 ${t('exam.flagged')}</span>` : ''}
            <button class="btn btn-secondary btn-sm btn-bookmark-in-review" data-qid="${q.id}">
              ⭐ ${QuizStorage.isBookmarked(q.id) ? t('practice.savedBtn') : t('practice.saveBtn')}
            </button>
          </div>
        </div>

        <div style="font-size: 1.02rem; font-weight: 600; margin-bottom: 0.75rem;">${formatMarkdown(getQText(q))}</div>
        ${codeHtml}
        <div style="margin: 1rem 0;">${optionsHtml}</div>

        <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid var(--success-border); border-radius: var(--radius-md); padding: 1rem; margin-top: 1rem;">
          <div style="color: var(--success); font-weight: 800; margin-bottom: 0.5rem;">${t('common.explanationTitle')}</div>
          <div class="explanation-body">${formatMarkdown(getQExplanation(q))}</div>
        </div>
      `;

      card.querySelector('.btn-bookmark-in-review').addEventListener('click', (e) => {
        QuizStorage.toggleBookmark(q.id);
        e.currentTarget.textContent = `⭐ ${QuizStorage.isBookmarked(q.id) ? t('practice.savedBtn') : t('practice.saveBtn')}`;
        updateDashboardStats();
      });

      container.appendChild(card);
    });

    if (window.Prism) Prism.highlightAllUnder(container);
  }

  // --- BOOKMARKS & MISTAKES MODAL ---
  function openListModal(type) {
    const modal = document.getElementById('list-modal');
    const title = document.getElementById('list-modal-title');
    const content = document.getElementById('list-modal-content');
    const practiceBtn = document.getElementById('btn-practice-modal-items');

    content.innerHTML = '';

    if (type === 'bookmarks') {
      title.textContent = t('listModal.bookmarksTitle');
      const bookmarks = QuizStorage.getBookmarks();
      const questions = window.QUIZ_DATA.questions.filter(q => bookmarks.includes(q.id));

      if (questions.length === 0) {
        content.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 2rem;">${t('listModal.bookmarksEmpty')}</div>`;
        practiceBtn.style.display = 'none';
      } else {
        practiceBtn.style.display = 'block';
        practiceBtn.textContent = t('listModal.practiceBookmarks', { n: questions.length });
        practiceBtn.onclick = () => {
          modal.classList.remove('show');
          startPracticeSession(questions, t('listModal.bookmarksTitle'));
        };

        questions.forEach(q => {
          const item = document.createElement('div');
          item.style.cssText = 'padding: 0.75rem; background: rgba(148,163,184,0.06); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;';
          item.innerHTML = `
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.78rem; color: var(--accent-primary); font-weight: 700;">${q.chapterTitle} • #${q.questionNumber}</div>
              <div style="font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${getQText(q)}</div>
            </div>
            <button class="btn btn-secondary btn-sm btn-remove-bm">${t('listModal.removeBookmark')}</button>
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
      title.textContent = t('listModal.mistakesTitle');
      const mistakes = QuizStorage.getMistakes();
      const questionIds = Object.keys(mistakes);
      const questions = window.QUIZ_DATA.questions.filter(q => questionIds.includes(q.id));

      if (questions.length === 0) {
        content.innerHTML = `<div style="color: var(--text-muted); text-align: center; padding: 2rem;">${t('listModal.mistakesEmpty')}</div>`;
        practiceBtn.style.display = 'none';
      } else {
        practiceBtn.style.display = 'block';
        practiceBtn.textContent = t('listModal.practiceMistakes', { n: questions.length });
        practiceBtn.onclick = () => {
          modal.classList.remove('show');
          startPracticeSession(questions, t('listModal.mistakesTitle'));
        };

        questions.forEach(q => {
          const wrongCount = mistakes[q.id].wrongCount;
          const item = document.createElement('div');
          item.style.cssText = 'padding: 0.75rem; background: rgba(148,163,184,0.06); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;';
          item.innerHTML = `
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.78rem; color: var(--danger); font-weight: 700;">${q.chapterTitle} • ${t('listModal.wrongTimes', { n: wrongCount })}</div>
              <div style="font-size: 0.9rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${getQText(q)}</div>
            </div>
            <button class="btn btn-secondary btn-sm btn-clear-mistake">${t('listModal.clearMistake')}</button>
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

  // --- KEYBOARD & TOUCH GESTURES ---
  function setupKeyboardAndTouch() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        if (window.TheoryViewer) {
          window.TheoryViewer.closeTheoryModal();
          window.TheoryViewer.closeVideoModal();
        }
        setExamDrawerOpen(false);
        const listModal = document.getElementById('list-modal');
        if (listModal) listModal.classList.remove('show');
        const examModal = document.getElementById('exam-setup-modal');
        if (examModal) examModal.classList.remove('show');
        return;
      }

      if (e.key.toLowerCase() === 'l' && !e.ctrlKey && !e.altKey && !e.metaKey) {
        toggleQuestionLang();
        return;
      }

      if (state.currentView === 'practice') {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(key) && !e.ctrlKey && !e.altKey && !e.metaKey) {
          const q = state.practiceQuestions[state.practiceIndex];
          if (q && q.options.some(o => o.key === key)) {
            handleOptionClick(key);
            return;
          }
        }

        if (e.key === 'Enter') {
          e.preventDefault();
          checkPracticeAnswer();
        } else if (e.key === 'ArrowRight' && state.practiceIndex < state.practiceQuestions.length - 1) {
          state.practiceIndex++;
          renderPracticeQuestion();
        } else if (e.key === 'ArrowLeft' && state.practiceIndex > 0) {
          state.practiceIndex--;
          renderPracticeQuestion();
        }
      } else if (state.currentView === 'exam') {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D', 'E', 'F', 'G'].includes(key) && !e.ctrlKey && !e.altKey) {
          const q = state.examQuestions[state.examIndex];
          if (q && q.options.some(o => o.key === key)) handleExamOptionClick(key);
        } else if (e.key === 'ArrowRight' && state.examIndex < state.examQuestions.length - 1) {
          state.examIndex++;
          renderExamQuestion();
        } else if (e.key === 'ArrowLeft' && state.examIndex > 0) {
          state.examIndex--;
          renderExamQuestion();
        }
      }
    });

    // Touch swipe-left to close Theory Sidebar on Mobile
    const theorySidebar = document.getElementById('theory-sidebar');
    if (theorySidebar && window.TheoryViewer) {
      let touchStartX = 0;
      let touchStartY = 0;
      theorySidebar.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          touchStartX = e.touches[0].clientX;
          touchStartY = e.touches[0].clientY;
        }
      }, { passive: true });
      theorySidebar.addEventListener('touchend', (e) => {
        if (e.changedTouches.length === 1) {
          const dx = e.changedTouches[0].clientX - touchStartX;
          const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
          if (dx < -50 && dy < 60) {
            window.TheoryViewer.setTheorySidebarCollapsed(true);
          }
        }
      }, { passive: true });
    }
  }

  function bindCodeCopyButton(btnId, codeBlockId) {
    const btn = document.getElementById(btnId);
    const codeEl = document.getElementById(codeBlockId);
    if (!btn || !codeEl) return;
    btn.addEventListener('click', () => {
      const text = codeEl.textContent || '';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = t('common.copiedCode');
          setTimeout(() => { btn.textContent = t('common.copyCode'); }, 1800);
        });
      }
    });
  }

  function init() {
    if (window.TheoryViewer) {
      window.TheoryViewer.configure({
        getLang: () => state.questionLang,
        t
      });
    }

    // 1. Theme & Language
    const savedTheme = QuizStorage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyI18nToDOM();

    document.getElementById('btn-toggle-lang').addEventListener('click', toggleQuestionLang);
    document.querySelectorAll('.btn-inline-lang-toggle').forEach(btn => {
      btn.addEventListener('click', toggleQuestionLang);
    });

    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      QuizStorage.setTheme(next);
    });

    // 2. Dashboard Chapter Search & Filter Pills
    const chSearchInput = document.getElementById('chapter-search-input');
    if (chSearchInput) {
      chSearchInput.addEventListener('input', (e) => {
        state.chapterSearch = e.target.value;
        renderChapterCards();
      });
    }

    document.querySelectorAll('#chapter-filter-pills .filter-pill-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('#chapter-filter-pills .filter-pill-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.chapterFilter = e.currentTarget.dataset.chFilter;
        renderChapterCards();
      });
    });

    // 3. Theory & Video Modal Bindings
    document.getElementById('brand-logo').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('dashboard');
    });

    document.getElementById('btn-open-theory').addEventListener('click', () => window.TheoryViewer.openTheoryModal(1));
    document.getElementById('btn-close-theory-modal').addEventListener('click', () => window.TheoryViewer.closeTheoryModal());
    document.getElementById('theory-modal').addEventListener('click', (e) => {
      if (e.target.id === 'theory-modal') window.TheoryViewer.closeTheoryModal();
    });

    document.getElementById('btn-toggle-theory-sidebar').addEventListener('click', () => window.TheoryViewer.toggleTheorySidebar());
    document.getElementById('btn-close-theory-drawer').addEventListener('click', () => window.TheoryViewer.setTheorySidebarCollapsed(true));
    document.getElementById('theory-sidebar-backdrop').addEventListener('click', () => window.TheoryViewer.setTheorySidebarCollapsed(true));

    document.getElementById('btn-theory-video-link').addEventListener('click', () => {
      const chId = window.TheoryViewer.getCurrentChapterId();
      window.TheoryViewer.closeTheoryModal();
      window.TheoryViewer.openVideoModal(chId);
    });

    const btnVoiceToggle = document.getElementById('btn-theory-voice-toggle');
    if (btnVoiceToggle) {
      btnVoiceToggle.addEventListener('click', () => window.TheoryViewer.toggleChapterNarration());
    }

    if (window.VoiceNarrator) {
      window.VoiceNarrator.bindEvents({
        onChapterAdvance: () => window.TheoryViewer.advanceToNextChapterAndRead()
      });
    }

    const scrollTopBtn = document.getElementById('btn-theory-scroll-top');
    const theoryReader = document.getElementById('theory-reader-container');
    if (scrollTopBtn && theoryReader) {
      scrollTopBtn.addEventListener('click', () => theoryReader.scrollTo({ top: 0, behavior: 'smooth' }));
      theoryReader.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('visible', theoryReader.scrollTop > 250);
      });
    }

    const searchInput = document.getElementById('theory-search-input');
    if (searchInput) {
      let searchDebounce = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => window.TheoryViewer.handleTheorySearch(e.target.value), 220);
      });
    }

    document.getElementById('btn-open-videos').addEventListener('click', () => window.TheoryViewer.openVideoModal(1));
    document.getElementById('btn-close-video-modal').addEventListener('click', () => window.TheoryViewer.closeVideoModal());
    document.getElementById('video-modal').addEventListener('click', (e) => {
      if (e.target.id === 'video-modal') window.TheoryViewer.closeVideoModal();
    });

    document.getElementById('btn-open-bookmarks').addEventListener('click', () => openListModal('bookmarks'));
    document.getElementById('btn-open-mistakes').addEventListener('click', () => openListModal('mistakes'));
    document.getElementById('btn-close-list-modal').addEventListener('click', () => {
      document.getElementById('list-modal').classList.remove('show');
    });

    // 4. Practice Mode Bindings
    bindCodeCopyButton('btn-copy-practice-code', 'practice-code-block');
    bindCodeCopyButton('btn-copy-exam-code', 'exam-code-block');

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
    document.getElementById('btn-practice-theory').addEventListener('click', () => {
      const q = state.practiceQuestions[state.practiceIndex];
      window.TheoryViewer.openTheoryModal(q ? q.chapterId : 1);
    });
    document.getElementById('btn-practice-video').addEventListener('click', () => {
      const q = state.practiceQuestions[state.practiceIndex];
      window.TheoryViewer.openVideoModal(q ? q.chapterId : 1);
    });

    // 5. Mock Exam Bindings
    document.getElementById('btn-quick-full-exam').addEventListener('click', () => openExamSetupModal(null));
    document.getElementById('btn-close-exam-modal').addEventListener('click', () => {
      document.getElementById('exam-setup-modal').classList.remove('show');
    });
    document.getElementById('btn-toggle-all-chapters').addEventListener('click', (e) => {
      const cbs = document.querySelectorAll('.modal-ch-cb');
      const allChecked = Array.from(cbs).every(cb => cb.checked);
      cbs.forEach(cb => cb.checked = !allChecked);
      e.target.textContent = allChecked ? t('modalExam.selectAll') : t('modalExam.deselectAll');
    });
    document.getElementById('btn-start-exam-now').addEventListener('click', startExamFromModal);

    document.getElementById('btn-toggle-exam-sidebar').addEventListener('click', () => {
      const layout = document.getElementById('exam-layout');
      if (layout) layout.classList.toggle('drawer-open');
    });
    document.getElementById('btn-close-exam-sidebar').addEventListener('click', () => setExamDrawerOpen(false));
    document.getElementById('exam-sidebar-backdrop').addEventListener('click', () => setExamDrawerOpen(false));

    document.getElementById('btn-exam-quit').addEventListener('click', () => {
      if (confirm(t('exam.quitConfirm'))) {
        if (state.examTimerInterval) clearInterval(state.examTimerInterval);
        setExamDrawerOpen(false);
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
      const msg = unanswered > 0
        ? t('exam.submitUnansweredConfirm', { n: unanswered })
        : t('exam.submitConfirm');
      if (confirm(msg)) finishAndGradeExam();
    });

    // 6. Result & Review Bindings
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

    setupKeyboardAndTouch();
    switchView('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
