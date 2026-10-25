// OCP Java 21 Quiz App - Application Controller v3.0
// Full Bilingual (VI / EN) UI & Questions + Smooth Responsive Mobile Drawers

(function() {
  'use strict';

  const I18N = {
    vi: {
      'nav.enthuware': 'Đề Enthuware',
      'nav.theory': '14 Chương Lý Thuyết',
      'nav.videos': '14 Video Bài Giảng',
      'nav.saved': 'Đã lưu',
      'nav.mistakes': 'Câu sai',
      'hero.badge': '✨ Oracle Certified Professional • Java SE 21 (1Z0-830)',
      'hero.title': 'Ôn Luyện Trắc Nghiệm OCP Java 21',
      'hero.subtitle': 'Hệ thống ôn thi chuẩn hóa toàn diện 14 chương kiến thức trọng tâm (338 câu hỏi song ngữ Anh - Việt) kèm phân tích bẫy đề thi chuyên sâu.',
      'stats.total': 'Tổng số câu hỏi',
      'stats.attempted': 'Câu đã luyện tập',
      'stats.accuracy': 'Độ chính xác',
      'stats.exams': 'Đề thi đã làm',
      'banner.title': '🚀 Thử Sức Với Kỳ Thi Tổng Hợp (Tất cả các chương)',
      'banner.desc': 'Đề thi mô phỏng ngẫu nhiên từ toàn bộ 14 chương, tính giờ chuẩn Oracle với ngưỡng đỗ 68%.',
      'banner.cta': '⏱️ Bắt Đầu Thi Thử Ngay',
      'dashboard.chaptersTitle': 'Danh Sách 14 Chương Kiến Thức Toàn Diện (Study Chapters)',
      'chapter.label': 'Chương',
      'chapter.hasVideo': '🎬 Có video',
      'chapter.qCount': 'câu hỏi',
      'chapter.progress': 'Tiến độ học tập',
      'chapter.btnTheory': '📖 Lý thuyết',
      'chapter.btnPractice': '🎯 Luyện tập',
      'chapter.btnExam': '⏱️ Thi thử',
      'chapter.videoLabel': '🎥 Video bài giảng chuyên sâu',
      'chapter.watchVideo': '▶️ Xem bài giảng',
      'common.question': 'Câu hỏi',
      'common.questionPrompt': '📋 Nội dung câu hỏi:',
      'common.javaCode': '💻 Đoạn mã nguồn Java:',
      'common.selectOptions': '✏️ Chọn phương án trả lời:',
      'common.keyHint': 'Phím A, B, C... để chọn',
      'common.explanationTitle': '💡 Giải Thích Chuyên Sâu & Phân Tích Bẫy Thi:',
      'common.prevBtn': '← Câu trước',
      'common.nextBtn': 'Câu tiếp theo →',
      'common.singleChoice': 'Chọn 1 đáp án duy nhất (Single Choice)',
      'common.multiChoice': 'Chọn tất cả đáp án đúng (Multiple Choice)',
      'common.correctAnswerLabel': 'Đáp án đúng:',
      'common.correctBanner': '— CHÍNH XÁC! 🎉',
      'common.wrongBanner': '— CHƯA CHÍNH XÁC! ❌',
      'practice.back': '← Dashboard',
      'practice.theoryBtn': 'Lý thuyết',
      'practice.videoBtn': 'Bài giảng',
      'practice.saveBtn': 'Lưu câu hỏi',
      'practice.savedBtn': 'Đã lưu',
      'practice.navTitle': '🗺️ Sơ đồ câu hỏi:',
      'practice.unanswered': 'Chưa làm',
      'practice.correct': 'Đúng',
      'practice.wrong': 'Sai',
      'practice.saved': 'Đã lưu',
      'practice.checkBtn': '✔️ Kiểm Tra Đáp Án (Enter)',
      'practice.checkedCorrect': '✔️ Đã trả lời đúng',
      'practice.checkedWrong': '❌ Đã kiểm tra (Xem giải thích)',
      'practice.retry': '🔄 Làm lại',
      'practice.alertSelect': 'Vui lòng chọn ít nhất một đáp án trước khi kiểm tra!',
      'exam.quit': '← Thoát phòng thi',
      'exam.roomTitle': 'Thi thử OCP Java 21',
      'exam.flag': '🚩 Cắm cờ xem lại',
      'exam.flagged': 'Đã cắm cờ',
      'exam.paletteBtn': 'Bảng câu hỏi',
      'exam.paletteTitle': 'Bảng điều hướng câu hỏi:',
      'exam.legendAnswered': 'Đã trả lời',
      'exam.legendUnanswered': 'Chưa làm',
      'exam.legendFlagged': 'Đã cắm cờ xem lại',
      'exam.submitBtn': '📝 Nộp Bài Thi',
      'exam.unlimitedTime': '∞ Không giới hạn',
      'exam.timeUpAlert': 'Hết giờ làm bài! Hệ thống đang tự động nộp bài và chấm điểm.',
      'exam.quitConfirm': 'Bạn có chắc chắn muốn thoát khỏi bài thi? Kết quả sẽ không được lưu.',
      'exam.submitConfirm': 'Bạn có chắc chắn muốn nộp bài thi?',
      'exam.submitUnansweredConfirm': 'Bạn còn {n} câu chưa trả lời. Bạn có chắc chắn muốn nộp bài không?',
      'result.passed': '🎉 PASSED (ĐẠT CHUẨN ORACLE ≥ 68%)',
      'result.failed': '⚠️ FAILED (CHƯA ĐẠT - CẦN CỐ GẮNG)',
      'result.yourScore': 'Điểm số của bạn:',
      'result.correctPrefix': 'Bạn trả lời đúng',
      'result.questionsWord': 'câu hỏi',
      'result.timeSpentPrefix': 'Thời gian:',
      'result.breakdownTitle': 'Phân Tích Chi Tiết Theo Từng Chương:',
      'result.homeBtn': '🏠 Về Trang Chủ',
      'result.reviewBtn': '🔍 Xem Lại Chi Tiết Toàn Bộ Đề',
      'result.detailedTitle': 'Chi Tiết Từng Câu Hỏi & Đáp Án',
      'result.filterAll': 'Tất cả',
      'result.filterWrong': '❌ Câu làm sai',
      'result.filterCorrect': '✔️ Câu làm đúng',
      'result.filterFlagged': '🚩 Đã cắm cờ',
      'result.emptyFilter': 'Không có câu hỏi nào khớp với bộ lọc.',
      'result.correctTag': '✔️ ĐÚNG',
      'result.wrongTag': '❌ SAI',
      'result.yourChoice': '✖ Lựa chọn của bạn',
      'result.rightChoice': '✔ Đúng',
      'modalExam.title': '⚙️ Thiết Lập Đề Thi Thử',
      'modalExam.selectChapters': '1. Chọn các chương muốn thi:',
      'modalExam.selectAll': 'Chọn tất cả',
      'modalExam.deselectAll': 'Bỏ chọn tất cả',
      'modalExam.questionCount': '2. Số lượng câu hỏi:',
      'modalExam.q15': '15 câu (Nhanh)',
      'modalExam.q25': '25 câu (Tiêu chuẩn)',
      'modalExam.q50': '50 câu (Chuyên sâu)',
      'modalExam.qAll': 'Toàn bộ câu hỏi',
      'modalExam.timeLimit': '3. Thời gian làm bài:',
      'modalExam.tStandard': 'Chuẩn Oracle (2.5 phút/câu)',
      'modalExam.tSpeed': 'Tốc độ (1.5 phút/câu)',
      'modalExam.tUnlimited': 'Không giới hạn',
      'modalExam.startBtn': '🚀 Bắt Đầu Làm Bài Thi',
      'modalExam.alertNoChapter': 'Vui lòng chọn ít nhất một chương để làm bài thi!',
      'listModal.bookmarksTitle': '⭐ Danh Sách Câu Đã Đánh Dấu (Bookmarks)',
      'listModal.bookmarksEmpty': 'Chưa có câu hỏi nào được đánh dấu. Hãy bấm ⭐ khi luyện tập!',
      'listModal.practiceBookmarks': '🎯 Luyện tập {n} câu đã lưu',
      'listModal.removeBookmark': 'Bỏ lưu',
      'listModal.mistakesTitle': '❌ Sổ Tay Câu Hỏi Làm Sai (Mistakes Notebook)',
      'listModal.mistakesEmpty': 'Tuyệt vời! Bạn chưa có câu làm sai nào cần ôn lại.',
      'listModal.practiceMistakes': '🎯 Ôn luyện ngay {n} câu làm sai',
      'listModal.wrongTimes': 'Sai {n} lần',
      'listModal.clearMistake': 'Đã hiểu',
      'video.playlistTitle': '📑 Danh sách bài giảng theo chương:',
      'theory.handbook': '📖 Lý Thuyết',
      'theory.searchPlaceholder': 'Tìm kiếm từ khóa trong chương...',
      'theory.sidebarHeading': '📑 14 CHƯƠNG LÝ THUYẾT',
      'theory.resultsCount': '{n} kết quả',
      'theory.copyCode': '📋 Sao chép',
      'theory.copiedCode': '✓ Đã sao chép!'
    },
    en: {
      'nav.enthuware': 'Enthuware',
      'nav.theory': '14 Theory Chapters',
      'nav.videos': '14 Video Lectures',
      'nav.saved': 'Saved',
      'nav.mistakes': 'Mistakes',
      'hero.badge': '✨ Oracle Certified Professional • Java SE 21 (1Z0-830)',
      'hero.title': 'OCP Java 21 Exam & Practice Master',
      'hero.subtitle': 'Comprehensive preparation across all 14 official chapters (338 bilingual EN/VI questions) with deep-dive explanations and exam trap analysis.',
      'stats.total': 'Total Questions',
      'stats.attempted': 'Practiced',
      'stats.accuracy': 'Accuracy Rate',
      'stats.exams': 'Exams Taken',
      'banner.title': '🚀 Take a Comprehensive Full Mock Exam (All Chapters)',
      'banner.desc': 'Randomized mock exam across all 14 chapters with official Oracle timing and 68% passing score.',
      'banner.cta': '⏱️ Start Mock Exam Now',
      'dashboard.chaptersTitle': 'All 14 Official Study Chapters (1Z0-830)',
      'chapter.label': 'Chapter',
      'chapter.hasVideo': '🎬 Video included',
      'chapter.qCount': 'questions',
      'chapter.progress': 'Study Progress',
      'chapter.btnTheory': '📖 Theory',
      'chapter.btnPractice': '🎯 Practice',
      'chapter.btnExam': '⏱️ Mock Test',
      'chapter.videoLabel': '🎥 Deep-dive video lecture',
      'chapter.watchVideo': '▶️ Watch Video',
      'common.question': 'Question',
      'common.questionPrompt': '📋 Question Prompt:',
      'common.javaCode': '💻 Java Source Code:',
      'common.selectOptions': '✏️ Select Your Answer:',
      'common.keyHint': 'Press A, B, C... to select',
      'common.explanationTitle': '💡 Detailed Explanation & Exam Trap Analysis:',
      'common.prevBtn': '← Previous',
      'common.nextBtn': 'Next Question →',
      'common.singleChoice': 'Select 1 best option (Single Choice)',
      'common.multiChoice': 'Select all that apply (Multiple Choice)',
      'common.correctAnswerLabel': 'Correct Answer:',
      'common.correctBanner': '— CORRECT! 🎉',
      'common.wrongBanner': '— INCORRECT! ❌',
      'practice.back': '← Dashboard',
      'practice.theoryBtn': 'Theory',
      'practice.videoBtn': 'Video',
      'practice.saveBtn': 'Bookmark',
      'practice.savedBtn': 'Saved',
      'practice.navTitle': '🗺️ Question Navigator:',
      'practice.unanswered': 'Unanswered',
      'practice.correct': 'Correct',
      'practice.wrong': 'Wrong',
      'practice.saved': 'Saved',
      'practice.checkBtn': '✔️ Check Answer (Enter)',
      'practice.checkedCorrect': '✔️ Answered Correctly',
      'practice.checkedWrong': '❌ Checked (See Explanation)',
      'practice.retry': '🔄 Retry',
      'practice.alertSelect': 'Please select at least one option before checking!',
      'exam.quit': '← Quit Exam',
      'exam.roomTitle': 'OCP Java 21 Mock Exam',
      'exam.flag': '🚩 Flag for Review',
      'exam.flagged': 'Flagged',
      'exam.paletteBtn': 'Palette',
      'exam.paletteTitle': 'Question Palette:',
      'exam.legendAnswered': 'Answered',
      'exam.legendUnanswered': 'Unanswered',
      'exam.legendFlagged': 'Flagged for review',
      'exam.submitBtn': '📝 Submit Exam',
      'exam.unlimitedTime': '∞ Unlimited',
      'exam.timeUpAlert': 'Time is up! Submitting and grading your exam automatically.',
      'exam.quitConfirm': 'Are you sure you want to quit the exam? Progress will not be saved.',
      'exam.submitConfirm': 'Are you sure you want to submit your exam?',
      'exam.submitUnansweredConfirm': 'You still have {n} unanswered questions. Submit anyway?',
      'result.passed': '🎉 PASSED (ORACLE STANDARD ≥ 68%)',
      'result.failed': '⚠️ FAILED (KEEP PRACTICING)',
      'result.yourScore': 'Your Score:',
      'result.correctPrefix': 'You answered',
      'result.questionsWord': 'questions correctly',
      'result.timeSpentPrefix': 'Time spent:',
      'result.breakdownTitle': 'Performance Breakdown by Chapter:',
      'result.homeBtn': '🏠 Back to Dashboard',
      'result.reviewBtn': '🔍 Review All Questions',
      'result.detailedTitle': 'Detailed Question Review',
      'result.filterAll': 'All',
      'result.filterWrong': '❌ Incorrect',
      'result.filterCorrect': '✔️ Correct',
      'result.filterFlagged': '🚩 Flagged',
      'result.emptyFilter': 'No questions match the selected filter.',
      'result.correctTag': '✔️ CORRECT',
      'result.wrongTag': '❌ INCORRECT',
      'result.yourChoice': '✖ Your choice',
      'result.rightChoice': '✔ Correct',
      'modalExam.title': '⚙️ Configure Mock Exam',
      'modalExam.selectChapters': '1. Select chapters to include:',
      'modalExam.selectAll': 'Select all',
      'modalExam.deselectAll': 'Deselect all',
      'modalExam.questionCount': '2. Number of questions:',
      'modalExam.q15': '15 questions (Quick)',
      'modalExam.q25': '25 questions (Standard)',
      'modalExam.q50': '50 questions (Deep)',
      'modalExam.qAll': 'All questions',
      'modalExam.timeLimit': '3. Time limit:',
      'modalExam.tStandard': 'Oracle Standard (2.5 min/q)',
      'modalExam.tSpeed': 'Speed Drill (1.5 min/q)',
      'modalExam.tUnlimited': 'Unlimited time',
      'modalExam.startBtn': '🚀 Start Mock Exam',
      'modalExam.alertNoChapter': 'Please select at least one chapter!',
      'listModal.bookmarksTitle': '⭐ Saved Questions (Bookmarks)',
      'listModal.bookmarksEmpty': 'No bookmarked questions yet. Click ⭐ during practice to save!',
      'listModal.practiceBookmarks': '🎯 Practice {n} saved questions',
      'listModal.removeBookmark': 'Remove',
      'listModal.mistakesTitle': '❌ Mistakes Notebook',
      'listModal.mistakesEmpty': 'Awesome! You have no recorded mistakes to review.',
      'listModal.practiceMistakes': '🎯 Practice {n} mistaken questions',
      'listModal.wrongTimes': 'Missed {n}x',
      'listModal.clearMistake': 'Got it',
      'video.playlistTitle': '📑 Video Lectures by Chapter:',
      'theory.handbook': '📖 Theory Docs',
      'theory.searchPlaceholder': 'Search keywords in this chapter...',
      'theory.sidebarHeading': '📑 14 THEORY CHAPTERS',
      'theory.resultsCount': '{n} matches',
      'theory.copyCode': '📋 Copy',
      'theory.copiedCode': '✓ Copied!'
    }
  };

  const CHAPTER_METADATA = {
    1: { vi: "Khối Xây Dựng Cơ Bản", en: "Building Blocks" },
    2: { vi: "Toán Tử & Biểu Thức", en: "Operators" },
    3: { vi: "Cấu Trúc Ra Quyết Định", en: "Making Decisions" },
    4: { vi: "Core APIs Trọng Tâm", en: "Core APIs" },
    5: { vi: "Thiết Kế Phương Thức", en: "Methods" },
    6: { vi: "Thiết Kế Lớp & Kế Thừa", en: "Class Design" },
    7: { vi: "Beyond Classes (Records, Sealed, Enums)", en: "Beyond Classes" },
    8: { vi: "Lambdas & Functional Interfaces", en: "Lambdas & Functional Interfaces" },
    9: { vi: "Collections & Generics", en: "Collections & Generics" },
    10: { vi: "Java Streams", en: "Streams" },
    11: { vi: "Xử Lý Ngoại Lệ & Localization", en: "Exceptions & Localization" },
    12: { vi: "Hệ Thống Module (JPMS)", en: "Modules (JPMS)" },
    13: { vi: "Lập Trình Đa Luồng & Virtual Threads", en: "Concurrency & Virtual Threads" },
    14: { vi: "Java I/O & NIO.2", en: "I/O & NIO.2" }
  };

  // App State
  const state = {
    currentView: 'dashboard',
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

    // Review / Result state
    lastExamResult: null,
    reviewFilter: 'all',

    // Theory Reader State
    currentTheoryChapterId: 1,
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

    // Top language button
    const topBtn = document.getElementById('btn-toggle-lang');
    if (topBtn) {
      topBtn.innerHTML = isEn
        ? '🇬🇧 <span id="lang-toggle-label">EN</span>'
        : '🇻🇳 <span id="lang-toggle-label">VI</span>';
    }

    // Inline question language toggle buttons
    document.querySelectorAll('.btn-inline-lang-toggle').forEach(btn => {
      btn.innerHTML = isEn ? '🇬🇧 EN → 🇻🇳 VI' : '🇻🇳 VI → 🇬🇧 EN';
    });

    // All static elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (key) el.textContent = t(key);
    });

    // Placeholders
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
      if (badge) {
        badge.textContent = q.isMultipleChoice ? t('common.multiChoice') : t('common.singleChoice');
      }
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

    // Also update Theory sidebar titles if theory modal is open
    const theoryModal = document.getElementById('theory-modal');
    if (theoryModal && theoryModal.classList.contains('show')) {
      populateTheorySidebar();
    }
  }

  function toggleQuestionLang() {
    state.questionLang = state.questionLang === 'en' ? 'vi' : 'en';
    try {
      localStorage.setItem('ocp21_question_lang', state.questionLang);
    } catch (e) {}
    refreshQuestionLanguageInPlace();
  }

  // Format Markdown Text to HTML
  function formatMarkdown(text) {
    if (!text) return '';
    let raw = text.trim();
    if (!raw) return '';

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

      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\$\\rightarrow\$/g, '→').replace(/\$\\to\$/g, '→');
      return s;
    }

    const lines = raw.split('\n');
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

    window.QUIZ_DATA.chapters.forEach(ch => {
      const chQuestions = window.QUIZ_DATA.questions.filter(q => q.chapterId === ch.id);
      let completedInCh = 0;
      chQuestions.forEach(q => {
        if (progress[q.id] && progress[q.id].answered) completedInCh++;
      });
      const pct = ch.questionCount > 0 ? Math.round((completedInCh / ch.questionCount) * 100) : 0;
      const hasVideo = Boolean(CHAPTER_VIDEOS[ch.id]);
      const meta = CHAPTER_METADATA[ch.id] || { vi: ch.title, en: ch.title };
      const displayTitle = isEn ? `Chapter ${ch.id}: ${meta.en}` : `Chương ${ch.id}: ${meta.vi}`;
      const subTitle = isEn ? meta.vi : meta.en;

      const card = document.createElement('div');
      card.className = 'chapter-card';
      card.innerHTML = `
        <div>
          <div class="chapter-header">
            <span class="chapter-num">${t('chapter.label')} ${String(ch.id).padStart(2, '0')}</span>
            <div style="display: flex; gap: 0.35rem; align-items: center;">
              ${hasVideo ? `<span class="badge badge-warning">${t('chapter.hasVideo')}</span>` : ''}
              <span class="badge badge-info">${ch.questionCount} ${t('chapter.qCount')}</span>
            </div>
          </div>
          <h3 class="chapter-title">${displayTitle}</h3>
          <div class="chapter-sub-desc">${subTitle}</div>
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
            <span style="font-size: 0.78rem; color: var(--text-muted);">${t('chapter.videoLabel')}</span>
            <button class="btn-chapter-video btn-open-video-ch" data-chapter="${ch.id}">${t('chapter.watchVideo')}</button>
          </div>` : ''}
        </div>
      `;

      card.querySelector('.btn-open-theory-ch').addEventListener('click', () => openTheoryModal(ch.id));
      card.querySelector('.btn-start-practice').addEventListener('click', () => startPracticeForChapter(ch.id));
      card.querySelector('.btn-start-exam-ch').addEventListener('click', () => openExamSetupModal(ch.id));
      if (hasVideo) {
        card.querySelector('.btn-open-video-ch').addEventListener('click', () => openVideoModal(ch.id));
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
      if (state.practiceSelectedOptions.has(item.dataset.key)) item.classList.add('selected');
      else item.classList.remove('selected');
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
    if (pill) {
      if (isBookmarked) pill.classList.add('bookmarked');
      else pill.classList.remove('bookmarked');
    }
    updatePracticePaletteStats();
  }

  // --- MOCK EXAM MODE ---
  function setExamDrawerOpen(open) {
    const layout = document.getElementById('exam-layout');
    if (!layout) return;
    if (open) layout.classList.add('drawer-open');
    else layout.classList.remove('drawer-open');
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
    if (timerRadio === 'standard') {
      state.examTotalDuration = Math.round(state.examQuestions.length * 2.5 * 60);
    } else if (timerRadio === 'speed') {
      state.examTotalDuration = Math.round(state.examQuestions.length * 1.5 * 60);
    } else {
      state.examTotalDuration = 0;
    }
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

    if (current.size === 0) {
      delete state.examUserAnswers[state.examIndex];
    }

    document.querySelectorAll('#exam-options-container .option-item').forEach(item => {
      if (current && current.has(item.dataset.key)) item.classList.add('selected');
      else item.classList.remove('selected');
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
        if (window.innerWidth <= 1024) {
          setExamDrawerOpen(false);
        }
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
        codeHtml = `<pre style="margin: 1rem 0; overflow-x: auto;"><code class="language-java">${q.codeSnippet.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code></pre>`;
      }

      let optionsHtml = '';
      getQOptions(q).forEach(opt => {
        const isUserSelected = item.userAnswers.includes(opt.key);
        const isCorrectAns = q.correctAnswers.includes(opt.key);
        let optStyle = 'padding: 0.55rem 0.75rem; border-radius: var(--radius-sm); margin-bottom: 0.4rem; display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: flex-start;';
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
            <span style="flex: 1; min-width: 0;">${formatMarkdown(opt.text)}</span>
            ${isCorrectAns ? `<span style="margin-left: auto; color: var(--success); font-size: 0.82rem;">${t('result.rightChoice')}</span>` : ''}
            ${isUserSelected && !isCorrectAns ? `<span style="margin-left: auto; color: var(--danger); font-size: 0.82rem;">${t('result.yourChoice')}</span>` : ''}
          </div>
        `;
      });

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
          <span style="font-weight: 700; color: ${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
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
          <div style="color: var(--success); font-weight: 700; margin-bottom: 0.5rem;">${t('common.explanationTitle')}</div>
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
          item.style.cssText = 'padding: 0.75rem; background: rgba(0,0,0,0.18); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;';
          item.innerHTML = `
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.78rem; color: var(--accent-primary); font-weight: 600;">${q.chapterTitle} • #${q.questionNumber}</div>
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
          item.style.cssText = 'padding: 0.75rem; background: rgba(0,0,0,0.18); border-radius: var(--radius-md); border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;';
          item.innerHTML = `
            <div style="min-width: 0; flex: 1;">
              <div style="font-size: 0.78rem; color: var(--danger); font-weight: 600;">${q.chapterTitle} • ${t('listModal.wrongTimes', { n: wrongCount })}</div>
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

  // --- VIDEO LECTURE PLAYER ---
  const CHAPTER_VIDEOS = {
    1: { chapterId: 1, title: "OCP Java SE 21 - Chapter 1: Building Blocks", subtitle: "Classes, Packages, Primitives, Variable Scope, Text Blocks & GC", filename: "Giải_Mã_OCP_Java_SE_21_Chương_1.mp4" },
    2: { chapterId: 2, title: "OCP Java SE 21 - Chapter 2: Operators", subtitle: "Unary, Arithmetic, Casting, Logical Operators & Type Promotion Traps", filename: "OCP_Java_SE_21__Toán_Tử_chương_2.mp4" },
    3: { chapterId: 3, title: "OCP Java 21 - Chapter 3: Making Decisions", subtitle: "if-else, Pattern Matching switch in Java 21, while, do-while & for loops", filename: "OCP_Java_21__Quyết_Định_Chương_3.mp4" },
    4: { chapterId: 4, title: "OCP Java SE 21 - Chapter 4: Core APIs", subtitle: "String, StringBuilder, Arrays.compare/mismatch, Math & Date/Time API", filename: "OCP_Java_SE_21_Masterclass_chương_4.mp4" },
    5: { chapterId: 5, title: "OCP Java 21 - Chapter 5: Methods", subtitle: "Access Modifiers, Static vs Instance, Autoboxing, Overloading & Varargs", filename: "OCP_Java_21__Bẫy_Biên_Dịch_chương_5.mp4" },
    6: { chapterId: 6, title: "OCP Java 21 - Chapter 6: Class Design", subtitle: "Inheritance, Class Initialization Order, Abstract Classes & Overriding Rules", filename: "OCP_Java_21__Thiết_Kế_Lớp_chương_6.mp4" },
    7: { chapterId: 7, title: "OCP Java 21 - Chapter 7: Beyond Classes", subtitle: "Interfaces, Enums, Immutable Records, Sealed Classes & Nested Types", filename: "OCP_Java_21__Beyond_Classes_Chương_7.mp4" },
    8: { chapterId: 8, title: "OCP Java 21 - Chapter 8: Lambdas & Functional Interfaces", subtitle: "Lambda Syntax, Method References & Built-in Functional Interfaces", filename: "Chuyên_Sâu_OCP_Chapter_8.mp4" },
    9: { chapterId: 9, title: "OCP Java 21 - Chapter 9: Collections & Generics", subtitle: "List, Set, Queue, Map, Sequenced Collections & Generics Wildcards", filename: "OCP_Chương_9__Collections.mp4" },
    10: { chapterId: 10, title: "OCP Java 21 - Chapter 10: Streams", subtitle: "Stream Pipelines, Optional, Terminal/Intermediate Ops & Collectors", filename: "Chương_10__Java_Streams.mp4" },
    11: { chapterId: 11, title: "OCP Java 21 - Chapter 11: Exceptions & Localization", subtitle: "try-with-resources, AutoCloseable, Locale, ResourceBundle & Formatting", filename: "OCP_Java_21__Chapter_11.mp4" },
    12: { chapterId: 12, title: "OCP Java 21 - Chapter 12: Modules (JPMS)", subtitle: "module-info.java, exports, opens, requires transitive, Services & CLI", filename: "Giải_Mã_OCP__JPMS___CLI_chương_12.mp4" },
    13: { chapterId: 13, title: "OCP Java 21 - Chapter 13: Concurrency & Virtual Threads", subtitle: "Virtual Threads, ExecutorService, Locks, Atomic Classes & Parallel Streams", filename: "OCP_Java_21__Đa_Luồng_chương_13.mp4" },
    14: { chapterId: 14, title: "OCP Java 21 - Chapter 14: I/O & NIO.2", subtitle: "I/O Streams, Serialization, NIO.2 Path, Files API & File Attributes", filename: "Tránh_Mìn_I_O__OCP_Java_21_chương_14.mp4" }
  };

  function openVideoModal(chapterId = 1) {
    const modal = document.getElementById('video-modal');
    if (!modal) return;

    const tabsContainer = document.getElementById('video-chapter-tabs');
    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      Object.values(CHAPTER_VIDEOS).forEach(v => {
        const tab = document.createElement('button');
        tab.className = `video-tab-btn ${v.chapterId === Number(chapterId) ? 'active' : ''}`;
        tab.textContent = `${t('chapter.label')} ${v.chapterId}`;
        tab.title = v.title;
        tab.addEventListener('click', () => playChapterVideo(v.chapterId));
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

    document.querySelectorAll('.video-tab-btn').forEach((btn, idx) => {
      if (idx + 1 === Number(chapterId)) btn.classList.add('active');
      else btn.classList.remove('active');
    });

    if (player) {
      player.play().catch(() => {});
    }
  }

  function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const player = document.getElementById('video-player');
    if (player) player.pause();
    modal.classList.remove('show');
  }

  // --- THEORY READER ---
  function setTheorySidebarCollapsed(collapsed) {
    const layout = document.getElementById('theory-main-layout');
    if (!layout) return;
    if (collapsed) layout.classList.add('sidebar-collapsed');
    else layout.classList.remove('sidebar-collapsed');
  }

  function toggleTheorySidebar() {
    const layout = document.getElementById('theory-main-layout');
    if (!layout) return;
    layout.classList.toggle('sidebar-collapsed');
  }

  function populateTheorySidebar() {
    const tabsContainer = document.getElementById('theory-chapter-tabs');
    if (!tabsContainer || !window.THEORY_DATA) return;
    tabsContainer.innerHTML = '';
    const isEn = state.questionLang === 'en';

    Object.keys(window.THEORY_DATA).forEach(k => {
      const item = window.THEORY_DATA[k];
      const chId = Number(item.chapterId);
      const meta = CHAPTER_METADATA[chId] || { vi: item.title || `Chương ${chId}`, en: `Chapter ${chId}` };

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theory-sidebar-item ${chId === state.currentTheoryChapterId ? 'active' : ''}`;
      btn.dataset.chapter = chId;
      btn.innerHTML = `
        <span class="theory-sidebar-badge">CH ${String(chId).padStart(2, '0')}</span>
        <div class="theory-sidebar-text">
          <span class="theory-sidebar-title">${isEn ? meta.en : meta.vi}</span>
          <span class="theory-sidebar-sub">${isEn ? meta.vi : meta.en}</span>
        </div>
        <span class="theory-sidebar-arrow">›</span>
      `;
      btn.addEventListener('click', () => {
        renderTheoryChapter(chId);
        if (window.innerWidth <= 768) {
          setTheorySidebarCollapsed(true);
        }
      });
      tabsContainer.appendChild(btn);
    });
  }

  function openTheoryModal(chapterId = 1) {
    state.currentTheoryChapterId = Number(chapterId) || 1;
    const modal = document.getElementById('theory-modal');
    if (!modal) return;

    modal.classList.add('show');

    // On mobile phones, start with sidebar collapsed so content is immediately readable
    if (window.innerWidth <= 768) {
      setTheorySidebarCollapsed(true);
    }

    if (!window.THEORY_DATA) return;

    populateTheorySidebar();

    const searchInput = document.getElementById('theory-search-input');
    if (searchInput) searchInput.value = '';
    const searchCount = document.getElementById('theory-search-count');
    if (searchCount) searchCount.style.display = 'none';

    renderTheoryChapter(state.currentTheoryChapterId);
  }

  function renderTheoryChapter(chapterId) {
    state.currentTheoryChapterId = Number(chapterId) || 1;
    if (!window.THEORY_DATA || !window.THEORY_DATA[state.currentTheoryChapterId]) return;

    const data = window.THEORY_DATA[state.currentTheoryChapterId];
    const meta = CHAPTER_METADATA[state.currentTheoryChapterId] || { vi: data.title, en: data.title };
    const isEn = state.questionLang === 'en';

    const breadcrumbEl = document.getElementById('theory-modal-breadcrumb');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = isEn
        ? `Chapter ${state.currentTheoryChapterId}: ${meta.en}`
        : `Chương ${state.currentTheoryChapterId}: ${meta.vi}`;
    }

    const githubLink = document.getElementById('theory-github-link');
    if (githubLink) {
      githubLink.href = data.githubUrl || `https://github.com/Min-Duc1705/OCP-21/blob/main/${data.filename}`;
    }

    const bodyEl = document.getElementById('theory-content-body');
    const containerEl = document.getElementById('theory-reader-container');

    document.querySelectorAll('.theory-sidebar-item').forEach(el => {
      if (Number(el.dataset.chapter) === state.currentTheoryChapterId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    const rawMd = data.content || '';
    let html = '';

    const markedObj = (typeof window !== 'undefined' && window.marked) || (typeof marked !== 'undefined' ? marked : null);
    if (markedObj && typeof markedObj.parse === 'function') {
      html = markedObj.parse(rawMd);
      html = html.replace(/<blockquote>\s*<p>\s*\[!NOTE\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        '<div class="md-alert md-alert-note"><div class="md-alert-title">ℹ️ Note</div><p>$1</p></div>');
      html = html.replace(/<blockquote>\s*<p>\s*\[!TIP\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        '<div class="md-alert md-alert-tip"><div class="md-alert-title">💡 Exam Tip</div><p>$1</p></div>');
      html = html.replace(/<blockquote>\s*<p>\s*\[!IMPORTANT\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        '<div class="md-alert md-alert-important"><div class="md-alert-title">⚡ Important</div><p>$1</p></div>');
      html = html.replace(/<blockquote>\s*<p>\s*\[!WARNING\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        '<div class="md-alert md-alert-warning"><div class="md-alert-title">⚠️ Exam Trap Warning</div><p>$1</p></div>');
      html = html.replace(/<blockquote>\s*<p>\s*\[!CAUTION\]\s*([\s\S]*?)<\/p>\s*<\/blockquote>/gi,
        '<div class="md-alert md-alert-caution"><div class="md-alert-title">🛑 Caution</div><p>$1</p></div>');
    } else {
      html = formatMarkdown(rawMd);
    }

    if (bodyEl) {
      bodyEl.innerHTML = html;
      if (window.Prism && typeof window.Prism.highlightAllUnder === 'function') {
        try { window.Prism.highlightAllUnder(bodyEl); } catch (e) {}
      }

      bodyEl.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.btn-copy-code')) return;
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy-code';
        copyBtn.type = 'button';
        copyBtn.innerHTML = t('theory.copyCode');
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeEl = pre.querySelector('code');
          const codeText = codeEl ? codeEl.innerText : pre.innerText;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeText).then(() => {
              copyBtn.innerHTML = t('theory.copiedCode');
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.innerHTML = t('theory.copyCode');
                copyBtn.classList.remove('copied');
              }, 2000);
            });
          }
        });
        pre.appendChild(copyBtn);
      });

      setupTheoryHeadingsAndTOC(bodyEl, containerEl);
    }

    if (containerEl) {
      containerEl.scrollTop = 0;
    }
  }

  function setupTheoryHeadingsAndTOC(bodyEl, containerEl) {
    if (!bodyEl || !containerEl) return;

    function generateSlug(text) {
      return text
        .toLowerCase()
        .trim()
        .replace(/<[^>]+>/g, '')
        .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '')
        .replace(/\s/g, '-');
    }

    const headings = bodyEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const slugMap = new Map();
    const slugCounts = {};

    headings.forEach((h, idx) => {
      const rawText = h.textContent.trim();
      let slug = generateSlug(rawText) || `section-${idx + 1}`;
      if (slugCounts[slug]) {
        slugCounts[slug]++;
        slug = `${slug}-${slugCounts[slug] - 1}`;
      } else {
        slugCounts[slug] = 1;
      }

      h.id = slug;
      h.setAttribute('data-slug', slug);
      const normSlug = slug.replace(/-+/g, '-');
      h.setAttribute('data-slug-norm', normSlug);
      h.setAttribute('data-heading-text', rawText.toLowerCase());

      slugMap.set(slug, h);
      if (!slugMap.has(normSlug)) slugMap.set(normSlug, h);

      const numMatch = rawText.match(/^(\d+(?:\.\d+)*)/i) || rawText.match(/^phần\s+(\d+)/i);
      if (numMatch) h.setAttribute('data-section-num', numMatch[1]);
    });

    bodyEl.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href');
        if (!href || href === '#') return;

        const rawTargetId = href.substring(1);
        let decodedTargetId = '';
        try {
          decodedTargetId = decodeURIComponent(rawTargetId).toLowerCase().trim();
        } catch (err) {
          decodedTargetId = rawTargetId.toLowerCase().trim();
        }
        const normTargetId = decodedTargetId.replace(/-+/g, '-');

        let targetEl = slugMap.get(decodedTargetId) ||
                       slugMap.get(normTargetId) ||
                       document.getElementById(rawTargetId) ||
                       document.getElementById(decodedTargetId) ||
                       document.getElementById(normTargetId);

        if (!targetEl) {
          const numMatch = decodedTargetId.match(/^(\d+(?:[-.]\d+)*)/);
          if (numMatch) {
            const secNum = numMatch[1].replace(/-/g, '.');
            for (const h of headings) {
              const hSec = h.getAttribute('data-section-num');
              if (hSec && (hSec === secNum || hSec.startsWith(secNum + '.'))) {
                targetEl = h;
                break;
              }
            }
          }
        }

        if (targetEl) {
          const containerRect = containerEl.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          const targetTop = targetRect.top - containerRect.top + containerEl.scrollTop - 18;
          containerEl.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
          targetEl.classList.add('heading-target-active');
          setTimeout(() => targetEl.classList.remove('heading-target-active'), 1800);
        }
      });
    });

    bodyEl.querySelectorAll('a[href^="http"]').forEach(a => {
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    });
  }

  function closeTheoryModal() {
    const modal = document.getElementById('theory-modal');
    if (modal) modal.classList.remove('show');
  }

  window.openTheoryModal = openTheoryModal;
  window.closeTheoryModal = closeTheoryModal;

  function handleTheorySearch(term) {
    term = (term || '').trim();
    const bodyEl = document.getElementById('theory-content-body');
    const countEl = document.getElementById('theory-search-count');
    if (!bodyEl) return;

    bodyEl.querySelectorAll('.highlight-search').forEach(m => {
      const parent = m.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      }
    });

    if (!term || term.length < 2) {
      if (countEl) countEl.style.display = 'none';
      return;
    }

    const walker = document.createTreeWalker(bodyEl, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement && ['CODE', 'PRE', 'SCRIPT'].includes(node.parentElement.tagName)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodesToReplace = [];
    let currentNode;
    while ((currentNode = walker.nextNode())) {
      if (currentNode.nodeValue.toLowerCase().includes(term.toLowerCase())) {
        nodesToReplace.push(currentNode);
      }
    }

    if (countEl) {
      countEl.style.display = 'inline-block';
      countEl.textContent = t('theory.resultsCount', { n: nodesToReplace.length });
    }

    let firstMatch = null;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    nodesToReplace.forEach(node => {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight-search">$1</mark>');
      if (!firstMatch) firstMatch = span.querySelector('.highlight-search');
      if (node.parentNode) node.parentNode.replaceChild(span, node);
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // --- KEYBOARD & TOUCH GESTURES ---
  function setupKeyboardAndTouch() {
    window.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.key === 'Escape') {
        closeTheoryModal();
        closeVideoModal();
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
          if (q && q.options.some(o => o.key === key)) {
            handleExamOptionClick(key);
          }
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
    if (theorySidebar) {
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
            setTheorySidebarCollapsed(true);
          }
        }
      }, { passive: true });
    }
  }

  // --- INITIALIZATION ---
  function init() {
    // 1. Theme & Language Setup
    const savedTheme = QuizStorage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    applyI18nToDOM();

    const btnToggleLang = document.getElementById('btn-toggle-lang');
    if (btnToggleLang) btnToggleLang.addEventListener('click', toggleQuestionLang);
    document.querySelectorAll('.btn-inline-lang-toggle').forEach(btn => {
      btn.addEventListener('click', toggleQuestionLang);
    });

    document.getElementById('btn-toggle-theme').addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      QuizStorage.setTheme(next);
    });

    // 2. Navigation & Theory Modal Controls (Single clean registration!)
    document.getElementById('brand-logo').addEventListener('click', (e) => {
      e.preventDefault();
      switchView('dashboard');
    });

    document.getElementById('btn-open-theory').addEventListener('click', () => openTheoryModal(1));
    document.getElementById('btn-close-theory-modal').addEventListener('click', closeTheoryModal);
    document.getElementById('theory-modal').addEventListener('click', (e) => {
      if (e.target.id === 'theory-modal') closeTheoryModal();
    });

    const btnToggleSidebar = document.getElementById('btn-toggle-theory-sidebar');
    if (btnToggleSidebar) btnToggleSidebar.addEventListener('click', toggleTheorySidebar);

    const btnCloseTheoryDrawer = document.getElementById('btn-close-theory-drawer');
    if (btnCloseTheoryDrawer) btnCloseTheoryDrawer.addEventListener('click', () => setTheorySidebarCollapsed(true));

    const theoryBackdrop = document.getElementById('theory-sidebar-backdrop');
    if (theoryBackdrop) theoryBackdrop.addEventListener('click', () => setTheorySidebarCollapsed(true));

    document.getElementById('btn-theory-video-link').addEventListener('click', () => {
      closeTheoryModal();
      openVideoModal(state.currentTheoryChapterId);
    });

    const scrollTopBtn = document.getElementById('btn-theory-scroll-top');
    const theoryReader = document.getElementById('theory-reader-container');
    if (scrollTopBtn && theoryReader) {
      scrollTopBtn.addEventListener('click', () => {
        theoryReader.scrollTo({ top: 0, behavior: 'smooth' });
      });
      theoryReader.addEventListener('scroll', () => {
        if (theoryReader.scrollTop > 250) scrollTopBtn.classList.add('visible');
        else scrollTopBtn.classList.remove('visible');
      });
    }

    const searchInput = document.getElementById('theory-search-input');
    if (searchInput) {
      let searchDebounce = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => handleTheorySearch(e.target.value), 220);
      });
    }

    // 3. Video & List Modals
    document.getElementById('btn-open-videos').addEventListener('click', () => openVideoModal(1));
    document.getElementById('btn-close-video-modal').addEventListener('click', closeVideoModal);
    document.getElementById('video-modal').addEventListener('click', (e) => {
      if (e.target.id === 'video-modal') closeVideoModal();
    });

    document.getElementById('btn-open-bookmarks').addEventListener('click', () => openListModal('bookmarks'));
    document.getElementById('btn-open-mistakes').addEventListener('click', () => openListModal('mistakes'));
    document.getElementById('btn-close-list-modal').addEventListener('click', () => {
      document.getElementById('list-modal').classList.remove('show');
    });

    // 4. Practice View Controls
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
      openTheoryModal(q ? q.chapterId : 1);
    });
    document.getElementById('btn-practice-video').addEventListener('click', () => {
      const q = state.practiceQuestions[state.practiceIndex];
      openVideoModal(q ? q.chapterId : 1);
    });

    // 5. Exam Setup Modal & Exam Drawer Controls
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

    const btnToggleExamSidebar = document.getElementById('btn-toggle-exam-sidebar');
    if (btnToggleExamSidebar) {
      btnToggleExamSidebar.addEventListener('click', () => {
        const layout = document.getElementById('exam-layout');
        if (layout) layout.classList.toggle('drawer-open');
      });
    }
    const btnCloseExamSidebar = document.getElementById('btn-close-exam-sidebar');
    if (btnCloseExamSidebar) btnCloseExamSidebar.addEventListener('click', () => setExamDrawerOpen(false));
    const examBackdrop = document.getElementById('exam-sidebar-backdrop');
    if (examBackdrop) examBackdrop.addEventListener('click', () => setExamDrawerOpen(false));

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

    // 7. Keyboard & Touch Gestures
    setupKeyboardAndTouch();

    // 8. Initial Render
    switchView('dashboard');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
