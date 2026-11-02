// ==========================================================================
// OCP Quiz Master - Bilingual Dictionary & Chapter Metadata (i18n.js)
// Supports both:
//   - 'java': OCP Java SE 21 Developer (1Z0-830) - 14 Chapters
//   - 'sql' : Oracle SQL OCA (1Z0-071) & OCP PL/SQL (1Z0-149) - 26 Chapters
// ==========================================================================

(function(root) {
  'use strict';

  const I18N = {
    vi: {
      'nav.enthuware': 'Enthuware',
      'nav.theory': '14 Chương Lý Thuyết',
      'nav.theorySql': '26 Chương Lý Thuyết',
      'nav.videos': '14 Video Bài Giảng',
      'nav.saved': 'Đã lưu',
      'nav.mistakes': 'Câu sai',
      'hero.badge': '✨ Oracle Certified Professional • Java SE 21 (1Z0-830)',
      'hero.title': 'Hệ Thống Luyện Thi OCP Java 21',
      'hero.subtitle': 'Chinh phục chứng chỉ Oracle 1Z0-830 với 14 chương lý thuyết, 14 video bài giảng và 338 câu hỏi trắc nghiệm song ngữ Anh - Việt kèm phân tích bẫy thi chuyên sâu.',
      'hero.badgeSql': '🗄️ Oracle Database SQL OCA (1Z0-071) & OCP PL/SQL Developer (1Z0-149)',
      'hero.titleSql': 'Hệ Thống Luyện Thi Oracle SQL & PL/SQL (OCA & OCP)',
      'hero.subtitleSql': 'Chinh phục kỳ thi sát hạch VNPT & chứng chỉ Oracle Database SQL (1Z0-071) + PL/SQL Developer (1Z0-149) với 26 chương giáo trình chuyên sâu và 650 câu hỏi trắc nghiệm thực chiến.',
      'stats.total': 'Tổng câu hỏi',
      'stats.attempted': 'Đã luyện tập',
      'stats.accuracy': 'Độ chính xác',
      'stats.exams': 'Đề thi đã làm',
      'banner.title': '🚀 Kỳ Thi Thử Tổng Hợp Chuẩn Oracle (Full 14 Chương)',
      'banner.titleSql': '🚀 Kỳ Thi Thử Tổng Hợp Oracle SQL & PL/SQL (Full 26 Chương)',
      'banner.desc': 'Đề thi mô phỏng ngẫu nhiên từ toàn bộ ngân hàng câu hỏi, tính giờ chuẩn Oracle với ngưỡng đỗ 68%.',
      'banner.cta': '⏱️ Thi Thử Ngay',
      'dashboard.chaptersTitle': 'Lộ Trình 14 Chương Trọng Tâm (Study Chapters)',
      'dashboard.chaptersTitleSql': 'Giáo Trình 26 Chương Oracle SQL & PL/SQL (OCA & OCP)',
      'dashboard.searchPlaceholder': 'Tìm chương hoặc chủ đề...',
      'dashboard.filterAll': 'Tất cả (14)',
      'dashboard.filterAllSql': 'Tất cả (26)',
      'dashboard.filterPart1': 'Phần I: SQL Cơ bản (1–13)',
      'dashboard.filterPart2': 'Phần II: SQL Nâng cao (14–20)',
      'dashboard.filterPart3': 'Phần III: PL/SQL (21–26)',
      'dashboard.filterInProgress': 'Đang học',
      'dashboard.filterCompleted': 'Hoàn thành',
      'chapter.label': 'Chương',
      'chapter.hasVideo': '🎬 Video',
      'chapter.qCount': 'câu',
      'chapter.progress': 'Tiến độ hoàn thành',
      'chapter.btnTheory': '📖 Lý thuyết',
      'chapter.btnPractice': '🎯 Luyện tập',
      'chapter.btnExam': '⏱️ Thi thử',
      'chapter.videoLabel': '🎥 Video bài giảng chuyên sâu',
      'chapter.watchVideo': '▶️ Xem video',
      'common.question': 'Câu hỏi',
      'common.questionPrompt': '📋 Nội dung câu hỏi:',
      'common.javaCode': 'Snippet.java',
      'common.sqlCode': 'Query.sql',
      'common.copyCode': '📋 Sao chép',
      'common.copiedCode': '✓ Đã chép!',
      'common.selectOptions': '✏️ Chọn phương án trả lời:',
      'common.keyHint': 'Phím A, B, C... để chọn',
      'common.explanationTitle': '💡 Giải Thích Chuyên Sâu & Phân Tích Bẫy Thi:',
      'common.prevBtn': '← Câu trước',
      'common.nextBtn': 'Câu tiếp theo →',
      'common.singleChoice': 'Chọn 1 đáp án (Single Choice)',
      'common.multiChoice': 'Chọn nhiều đáp án (Multiple Choice)',
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
      'exam.roomTitle': 'Phòng Thi Chuẩn Oracle',
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
      'listModal.bookmarksTitle': '⭐ Danh Sách Câu Đã Đánh Dấu',
      'listModal.bookmarksEmpty': 'Chưa có câu hỏi nào được đánh dấu. Hãy bấm ⭐ khi luyện tập!',
      'listModal.practiceBookmarks': '🎯 Luyện tập {n} câu đã lưu',
      'listModal.removeBookmark': 'Bỏ lưu',
      'listModal.mistakesTitle': '❌ Sổ Tay Câu Hỏi Làm Sai',
      'listModal.mistakesEmpty': 'Tuyệt vời! Bạn chưa có câu làm sai nào cần ôn lại.',
      'listModal.practiceMistakes': '🎯 Ôn luyện ngay {n} câu làm sai',
      'listModal.wrongTimes': 'Sai {n} lần',
      'listModal.clearMistake': 'Đã hiểu',
      'video.playlistTitle': '📑 Danh sách bài giảng theo chương:',
      'theory.handbook': '📖 Lý Thuyết',
      'theory.searchPlaceholder': 'Tìm kiếm từ khóa trong chương...',
      'theory.sidebarHeading': '📑 DANH SÁCH CHƯƠNG LÝ THUYẾT',
      'theory.resultsCount': '{n} kết quả',
      'theory.copyCode': '📋 Sao chép',
      'theory.copiedCode': '✓ Đã sao chép!'
    },
    en: {
      'nav.enthuware': 'Enthuware',
      'nav.theory': '14 Theory Chapters',
      'nav.theorySql': '26 Theory Chapters',
      'nav.videos': '14 Video Lectures',
      'nav.saved': 'Saved',
      'nav.mistakes': 'Mistakes',
      'hero.badge': '✨ Oracle Certified Professional • Java SE 21 (1Z0-830)',
      'hero.title': 'OCP Java 21 Exam & Study Master',
      'hero.subtitle': 'Master the Oracle 1Z0-830 certification with 14 study guides, 14 video lectures, and 338 bilingual EN/VI questions with deep exam-trap analysis.',
      'hero.badgeSql': '🗄️ Oracle Database SQL OCA (1Z0-071) & OCP PL/SQL Developer (1Z0-149)',
      'hero.titleSql': 'Oracle SQL & PL/SQL Exam & Study Master',
      'hero.subtitleSql': 'Master Oracle Database SQL (1Z0-071) & PL/SQL Developer (1Z0-149) with 26 comprehensive study chapters and 650 exam-style practice questions.',
      'stats.total': 'Total Questions',
      'stats.attempted': 'Practiced',
      'stats.accuracy': 'Accuracy Rate',
      'stats.exams': 'Exams Taken',
      'banner.title': '🚀 Full Oracle Mock Exam Simulator (All 14 Chapters)',
      'banner.titleSql': '🚀 Full Oracle SQL & PL/SQL Mock Exam (All 26 Chapters)',
      'banner.desc': 'Randomized mock exam across the entire question bank with official Oracle timing and 68% passing score.',
      'banner.cta': '⏱️ Start Mock Exam',
      'dashboard.chaptersTitle': 'All 14 Official Study Chapters (1Z0-830)',
      'dashboard.chaptersTitleSql': 'All 26 Oracle SQL & PL/SQL Study Chapters (OCA & OCP)',
      'dashboard.searchPlaceholder': 'Search chapter or topic...',
      'dashboard.filterAll': 'All (14)',
      'dashboard.filterAllSql': 'All (26)',
      'dashboard.filterPart1': 'Part I: Core SQL (1–13)',
      'dashboard.filterPart2': 'Part II: Advanced SQL (14–20)',
      'dashboard.filterPart3': 'Part III: PL/SQL (21–26)',
      'dashboard.filterInProgress': 'In Progress',
      'dashboard.filterCompleted': 'Completed',
      'chapter.label': 'Chapter',
      'chapter.hasVideo': '🎬 Video',
      'chapter.qCount': 'Q',
      'chapter.progress': 'Completion Progress',
      'chapter.btnTheory': '📖 Theory',
      'chapter.btnPractice': '🎯 Practice',
      'chapter.btnExam': '⏱️ Test',
      'chapter.videoLabel': '🎥 Deep-dive video lecture',
      'chapter.watchVideo': '▶️ Watch',
      'common.question': 'Question',
      'common.questionPrompt': '📋 Question Prompt:',
      'common.javaCode': 'Snippet.java',
      'common.sqlCode': 'Query.sql',
      'common.copyCode': '📋 Copy',
      'common.copiedCode': '✓ Copied!',
      'common.selectOptions': '✏️ Select Your Answer:',
      'common.keyHint': 'Press A, B, C... to select',
      'common.explanationTitle': '💡 Detailed Explanation & Exam Trap Analysis:',
      'common.prevBtn': '← Previous',
      'common.nextBtn': 'Next Question →',
      'common.singleChoice': 'Select 1 option (Single Choice)',
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
      'exam.roomTitle': 'Oracle Mock Exam Room',
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
      'theory.sidebarHeading': '📑 THEORY CHAPTERS',
      'theory.resultsCount': '{n} matches',
      'theory.copyCode': '📋 Copy',
      'theory.copiedCode': '✓ Copied!'
    }
  };

  const JAVA_CHAPTER_METADATA = {
    1:  { icon: '🧱', vi: 'Khối Xây Dựng Cơ Bản', en: 'Building Blocks', tags: ['Primitives', 'Text Blocks', 'var', 'GC'] },
    2:  { icon: '⚡', vi: 'Toán Tử & Biểu Thức', en: 'Operators', tags: ['Type Promotion', 'Casting', 'Bitwise'] },
    3:  { icon: '🔀', vi: 'Cấu Trúc Ra Quyết Định', en: 'Making Decisions', tags: ['Pattern Switch', 'Guards', 'Loops'] },
    4:  { icon: '🧰', vi: 'Core APIs Trọng Tâm', en: 'Core APIs', tags: ['String Pool', 'Arrays', 'Date/Time'] },
    5:  { icon: '⚙️', vi: 'Thiết Kế Phương Thức', en: 'Methods', tags: ['Access Modifiers', 'Overloading', 'Varargs'] },
    6:  { icon: '🏛️', vi: 'Thiết Kế Lớp & Kế Thừa', en: 'Class Design', tags: ['Init Order', 'Polymorphism', 'Abstract'] },
    7:  { icon: '💎', vi: 'Beyond Classes', en: 'Beyond Classes', tags: ['Records', 'Sealed Types', 'Enums'] },
    8:  { icon: 'λ',  vi: 'Lambdas & Functional', en: 'Lambdas & Functional Interfaces', tags: ['Predicate', 'Function', 'Method Ref'] },
    9:  { icon: '📦', vi: 'Collections & Generics', en: 'Collections & Generics', tags: ['Sequenced', 'Map/Set', 'Wildcards'] },
    10: { icon: '🌊', vi: 'Java Streams', en: 'Streams', tags: ['Pipelines', 'Collectors', 'Optional'] },
    11: { icon: '🛡️', vi: 'Ngoại Lệ & Localization', en: 'Exceptions & Localization', tags: ['try-with-resources', 'Locale', 'Bundles'] },
    12: { icon: '🧩', vi: 'Hệ Thống Module (JPMS)', en: 'Modules (JPMS)', tags: ['exports/opens', 'requires', 'Services'] },
    13: { icon: '🚀', vi: 'Đa Luồng & Virtual Threads', en: 'Concurrency & Virtual Threads', tags: ['Virtual Threads', 'Executors', 'Locks'] },
    14: { icon: '💾', vi: 'Java I/O & NIO.2', en: 'I/O & NIO.2', tags: ['Path/Files', 'Streams', 'Serialization'] }
  };

  const SQL_CHAPTER_METADATA = {
    1:  { icon: '🏛️', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Tổng Quan Oracle Database & SQL', en: 'Oracle Database & SQL Overview', tags: ['RDBMS', 'Schema', 'DDL/DML/TCL', 'DUAL'] },
    2:  { icon: '🔢', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Kiểu Dữ Liệu Trong Oracle', en: 'Oracle Data Types & Conversions', tags: ['VARCHAR2/NUMBER', 'DATE/TIMESTAMP', 'NULL & Empty String', 'CAST/TO_CHAR'] },
    3:  { icon: '🔍', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Truy Vấn Dữ Liệu Với SELECT', en: 'Retrieving Data with SELECT', tags: ['DISTINCT/Alias', 'ORDER BY NULLS', 'FETCH FIRST', 'Logical Order'] },
    4:  { icon: '🎯', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Điều Kiện Lọc Dữ Liệu (WHERE)', en: 'Restricting & Filtering Data', tags: ['IN / NOT IN Trap', 'BETWEEN', 'LIKE ESCAPE', '3-Valued Logic'] },
    5:  { icon: '🧮', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Các Hàm SQL Thông Dụng', en: 'Single-Row Functions', tags: ['SUBSTR/INSTR', 'ROUND/TRUNC', 'NVL/NVL2/COALESCE', 'CASE & DECODE'] },
    6:  { icon: '📊', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Hàm Tổng Hợp & GROUP BY', en: 'Aggregate Functions & GROUP BY', tags: ['COUNT(*) vs COUNT(col)', 'GROUP BY / HAVING', 'NULL in Aggregates', 'Nested AVG'] },
    7:  { icon: '🔗', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'JOIN Nhiều Bảng', en: 'Joining Multiple Tables', tags: ['INNER/OUTER JOIN', 'USING / NATURAL', 'Oracle (+)', 'Self & Cross Join'] },
    8:  { icon: '🪆', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Subquery — Truy Vấn Con', en: 'Subqueries (Single, Multi-Row & Correlated)', tags: ['IN vs EXISTS', 'ANY / ALL', 'Correlated Subquery', 'Scalar Subquery'] },
    9:  { icon: '➕', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Toán Tử Tập Hợp (Set Operators)', en: 'Set Operators (UNION, INTERSECT, MINUS)', tags: ['UNION / UNION ALL', 'INTERSECT', 'MINUS', 'ORDER BY Rules'] },
    10: { icon: '💳', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'DML & Quản Lý Transaction', en: 'DML & Transactions (ACID)', tags: ['INSERT ALL / MERGE', 'COMMIT/SAVEPOINT', 'Read Consistency', 'Row Locking'] },
    11: { icon: '🏗️', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'DDL & Quản Lý Table', en: 'DDL & Table Management', tags: ['CREATE/ALTER/DROP', 'IDENTITY / CTAS', 'Temporary Table', 'TRUNCATE vs DELETE'] },
    12: { icon: '🛡️', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Constraints — Ràng Buộc Dữ Liệu', en: 'Constraints & Data Integrity', tags: ['PK / FK / UNIQUE', 'CHECK Rules', 'ON DELETE CASCADE', 'ENABLE/VALIDATE'] },
    13: { icon: '🗂️', part: 1, partBadge: 'Phần I • OCA SQL', vi: 'Các Database Objects & Phân Quyền', en: 'Views, Indexes, Sequences & Grants', tags: ['VIEW CHECK OPTION', 'SEQUENCE / SYNONYM', 'USER_*/ALL_*/DBA_*', 'GRANT / REVOKE'] },
    14: { icon: '🧬', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Advanced Subquery & CTE (WITH)', en: 'Advanced Subqueries, CTE & APPLY', tags: ['WITH Clause', 'Recursive CTE', 'Inline View', 'LATERAL / APPLY'] },
    15: { icon: '🪟', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Analytic / Window Functions', en: 'Analytic & Window Functions', tags: ['ROW_NUMBER/RANK', 'LEAD / LAG', 'Running Total', 'ROWS vs RANGE'] },
    16: { icon: '📐', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Advanced Aggregation', en: 'ROLLUP, CUBE, GROUPING SETS & PIVOT', tags: ['ROLLUP / CUBE', 'GROUPING_ID', 'LISTAGG', 'PIVOT / UNPIVOT'] },
    17: { icon: '🌳', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Truy Vấn Phân Cấp (Hierarchical)', en: 'Hierarchical Queries (CONNECT BY)', tags: ['CONNECT BY PRIOR', 'START WITH / LEVEL', 'SYS_CONNECT_BY_PATH', 'ORDER SIBLINGS BY'] },
    18: { icon: '🚀', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Index & SQL Performance Tuning', en: 'Indexes, Execution Plans & SQL Tuning', tags: ['B-Tree vs Bitmap', 'Composite/Func Index', 'EXPLAIN PLAN', 'Cardinality/Tuning'] },
    19: { icon: '🔒', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Transaction & Concurrency Nâng Cao', en: 'Isolation Levels, Locks & Deadlocks', tags: ['Isolation Levels', 'SELECT FOR UPDATE', 'Deadlock ORA-00060', 'Lost Update'] },
    20: { icon: '🛠️', part: 2, partBadge: 'Phần II • SQL Nâng Cao', vi: 'Oracle SQL Nâng Cao Thực Chiến', en: 'Real-World Advanced SQL & Regex', tags: ['Top-N & Pagination', 'Dedup ROWID', 'REGEXP_LIKE/SUBSTR', 'Reporting SQL'] },
    21: { icon: '📜', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'PL/SQL Fundamentals', en: 'PL/SQL Block Structure & Control Flow', tags: ['DECLARE/BEGIN/END', '%TYPE & %ROWTYPE', 'IF / CASE / Loops', 'SELECT INTO'] },
    22: { icon: '🧭', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'Cursor Trong PL/SQL', en: 'Implicit, Explicit & REF Cursors', tags: ['SQL%ROWCOUNT', 'Cursor FOR Loop', 'Parameterized Cursor', 'SYS_REFCURSOR'] },
    23: { icon: '⚙️', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'Procedure & Function', en: 'Stored Procedures & Functions', tags: ['IN / OUT / IN OUT', 'NOCOPY Hint', 'Function in SQL', 'AUTHID DEFINER'] },
    24: { icon: '🚨', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'Exception Handling', en: 'Exception Handling & Propagation', tags: ['Predefined Exceptions', 'EXCEPTION_INIT', 'RAISE_APPLICATION_ERROR', 'SQLCODE/SQLERRM'] },
    25: { icon: '📦', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'Package & Trigger', en: 'Packages, Triggers & Mutating Table', tags: ['Package Spec/Body', 'BEFORE/AFTER/INSTEAD OF', ':OLD & :NEW', 'Mutating ORA-04091'] },
    26: { icon: '⚡', part: 3, partBadge: 'Phần III • PL/SQL (1Z0-149)', vi: 'PL/SQL Nâng Cao & Hiệu Năng', en: 'Collections, Bulk SQL & Dynamic SQL', tags: ['Collections', 'BULK COLLECT / FORALL', 'EXECUTE IMMEDIATE', 'Autonomous Tx'] }
  };

  const CHAPTER_VIDEOS = {
    1:  { chapterId: 1,  title: "OCP Java SE 21 - Chapter 1: Building Blocks", subtitle: "Classes, Packages, Primitives, Variable Scope, Text Blocks & GC", filename: "Giải_Mã_OCP_Java_SE_21_Chương_1.mp4" },
    2:  { chapterId: 2,  title: "OCP Java SE 21 - Chapter 2: Operators", subtitle: "Unary, Arithmetic, Casting, Logical Operators & Type Promotion Traps", filename: "OCP_Java_SE_21__Toán_Tử_chương_2.mp4" },
    3:  { chapterId: 3,  title: "OCP Java 21 - Chapter 3: Making Decisions", subtitle: "if-else, Pattern Matching switch in Java 21, while, do-while & for loops", filename: "OCP_Java_21__Quyết_Định_Chương_3.mp4" },
    4:  { chapterId: 4,  title: "OCP Java SE 21 - Chapter 4: Core APIs", subtitle: "String, StringBuilder, Arrays.compare/mismatch, Math & Date/Time API", filename: "OCP_Java_SE_21_Masterclass_chương_4.mp4" },
    5:  { chapterId: 5,  title: "OCP Java 21 - Chapter 5: Methods", subtitle: "Access Modifiers, Static vs Instance, Autoboxing, Overloading & Varargs", filename: "OCP_Java_21__Bẫy_Biên_Dịch_chương_5.mp4" },
    6:  { chapterId: 6,  title: "OCP Java 21 - Chapter 6: Class Design", subtitle: "Inheritance, Class Initialization Order, Abstract Classes & Overriding Rules", filename: "OCP_Java_21__Thiết_Kế_Lớp_chương_6.mp4" },
    7:  { chapterId: 7,  title: "OCP Java 21 - Chapter 7: Beyond Classes", subtitle: "Interfaces, Enums, Immutable Records, Sealed Classes & Nested Types", filename: "OCP_Java_21__Beyond_Classes_Chương_7.mp4" },
    8:  { chapterId: 8,  title: "OCP Java 21 - Chapter 8: Lambdas & Functional Interfaces", subtitle: "Lambda Syntax, Method References & Built-in Functional Interfaces", filename: "Chuyên_Sâu_OCP_Chapter_8.mp4" },
    9:  { chapterId: 9,  title: "OCP Java 21 - Chapter 9: Collections & Generics", subtitle: "List, Set, Queue, Map, Sequenced Collections & Generics Wildcards", filename: "OCP_Chương_9__Collections.mp4" },
    10: { chapterId: 10, title: "OCP Java 21 - Chapter 10: Streams", subtitle: "Stream Pipelines, Optional, Terminal/Intermediate Ops & Collectors", filename: "Chương_10__Java_Streams.mp4" },
    11: { chapterId: 11, title: "OCP Java 21 - Chapter 11: Exceptions & Localization", subtitle: "try-with-resources, AutoCloseable, Locale, ResourceBundle & Formatting", filename: "OCP_Java_21__Chapter_11.mp4" },
    12: { chapterId: 12, title: "OCP Java 21 - Chapter 12: Modules (JPMS)", subtitle: "module-info.java, exports, opens, requires transitive, Services & CLI", filename: "Giải_Mã_OCP__JPMS___CLI_chương_12.mp4" },
    13: { chapterId: 13, title: "OCP Java 21 - Chapter 13: Concurrency & Virtual Threads", subtitle: "Virtual Threads, ExecutorService, Locks, Atomic Classes & Parallel Streams", filename: "OCP_Java_21__Đa_Luồng_chương_13.mp4" },
    14: { chapterId: 14, title: "OCP Java 21 - Chapter 14: I/O & NIO.2", subtitle: "I/O Streams, Serialization, NIO.2 Path, Files API & File Attributes", filename: "Tránh_Mìn_I_O__OCP_Java_21_chương_14.mp4" }
  };

  function formatMarkdown(text) {
    if (!text) return '';
    let raw = text.trim();
    if (!raw) return '';

    const codeLang = (root.__ACTIVE_COURSE === 'sql') ? 'language-sql' : 'language-java';

    if (raw.includes('```')) {
      raw = raw.replace(/```(?:java|sql|plsql|oracle|text|bash)?\s*\r?\n([\s\S]*?)```/gi, (match, code) => {
        const escaped = code.trim()
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        return `<pre class="option-code-block"><code class="${codeLang}">${escaped}</code></pre>`;
      });
    }

    if (raw.startsWith('<pre') && raw.endsWith('</pre>')) return raw;

    function formatInline(str) {
      if (str.includes('<pre')) return str;
      let s = str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\$\\rightarrow\$/g, '→').replace(/\\rightarrow/g, '→').replace(/\$\\to\$/g, '→').replace(/\$\\iff\$/g, '⇔').replace(/\\iff/g, '⇔');
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

    if (inList) formattedElements.push('</ul>');
    return formattedElements.join('');
  }

  root.AppI18n = {
    I18N,
    CHAPTER_METADATA: JAVA_CHAPTER_METADATA,
    JAVA_CHAPTER_METADATA,
    SQL_CHAPTER_METADATA,
    CHAPTER_VIDEOS,
    formatMarkdown
  };
})(typeof window !== 'undefined' ? window : this);
