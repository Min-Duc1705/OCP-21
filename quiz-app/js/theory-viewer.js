// ==========================================================================
// OCP 21 Quiz Master - Theory Reader & Video Lecture Controller (theory-viewer.js)
// ==========================================================================

(function(root) {
  'use strict';

  let currentChapterId = 1;
  let getLangFn = () => 'en';
  let tFn = (k) => k;

  function configure(opts) {
    if (opts.getLang) getLangFn = opts.getLang;
    if (opts.t) tFn = opts.t;
  }

  function setTheorySidebarCollapsed(collapsed) {
    const layout = document.getElementById('theory-main-layout');
    if (!layout) return;
    if (collapsed) layout.classList.add('sidebar-collapsed');
    else layout.classList.remove('sidebar-collapsed');
  }

  function toggleTheorySidebar() {
    const layout = document.getElementById('theory-main-layout');
    if (layout) layout.classList.toggle('sidebar-collapsed');
  }

  function populateTheorySidebar() {
    const tabsContainer = document.getElementById('theory-chapter-tabs');
    if (!tabsContainer || !root.THEORY_DATA) return;
    tabsContainer.innerHTML = '';
    const isEn = getLangFn() === 'en';
    const metaMap = (root.AppI18n && root.AppI18n.CHAPTER_METADATA) || {};

    Object.keys(root.THEORY_DATA).forEach(k => {
      const item = root.THEORY_DATA[k];
      const chId = Number(item.chapterId);
      const meta = metaMap[chId] || { icon: '📘', vi: item.title || `Chương ${chId}`, en: `Chapter ${chId}` };

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theory-sidebar-item ${chId === currentChapterId ? 'active' : ''}`;
      btn.dataset.chapter = chId;
      btn.innerHTML = `
        <span class="theory-sidebar-badge">${meta.icon || 'CH'} ${String(chId).padStart(2, '0')}</span>
        <div class="theory-sidebar-text">
          <span class="theory-sidebar-title">${isEn ? meta.en : meta.vi}</span>
          <span class="theory-sidebar-sub">${isEn ? meta.vi : meta.en}</span>
        </div>
        <span class="theory-sidebar-arrow">›</span>
      `;
      btn.addEventListener('click', () => {
        renderTheoryChapter(chId);
        if (root.innerWidth <= 768) setTheorySidebarCollapsed(true);
      });
      tabsContainer.appendChild(btn);
    });
  }

  function openTheoryModal(chapterId = 1) {
    currentChapterId = Number(chapterId) || 1;
    const modal = document.getElementById('theory-modal');
    if (!modal) return;
    modal.classList.add('show');

    if (root.innerWidth <= 768) {
      setTheorySidebarCollapsed(true);
    }

    if (!root.THEORY_DATA) return;
    populateTheorySidebar();

    const searchInput = document.getElementById('theory-search-input');
    if (searchInput) searchInput.value = '';
    const searchCount = document.getElementById('theory-search-count');
    if (searchCount) searchCount.style.display = 'none';

    renderTheoryChapter(currentChapterId);
  }

  function renderTheoryChapter(chapterId) {
    currentChapterId = Number(chapterId) || 1;
    if (!root.THEORY_DATA || !root.THEORY_DATA[currentChapterId]) return;

    const data = root.THEORY_DATA[currentChapterId];
    const metaMap = (root.AppI18n && root.AppI18n.CHAPTER_METADATA) || {};
    const meta = metaMap[currentChapterId] || { vi: data.title, en: data.title };
    const isEn = getLangFn() === 'en';

    const breadcrumbEl = document.getElementById('theory-modal-breadcrumb');
    if (breadcrumbEl) {
      breadcrumbEl.textContent = isEn
        ? `Chapter ${currentChapterId}: ${meta.en}`
        : `Chương ${currentChapterId}: ${meta.vi}`;
    }

    const githubLink = document.getElementById('theory-github-link');
    if (githubLink) {
      githubLink.href = data.githubUrl || `https://github.com/Min-Duc1705/OCP-21/blob/main/${data.filename}`;
    }

    document.querySelectorAll('.theory-sidebar-item').forEach(el => {
      el.classList.toggle('active', Number(el.dataset.chapter) === currentChapterId);
    });

    const bodyEl = document.getElementById('theory-content-body');
    const containerEl = document.getElementById('theory-reader-container');
    const rawMd = data.content || '';
    let html = '';

    const markedObj = root.marked || null;
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
    } else if (root.AppI18n) {
      html = root.AppI18n.formatMarkdown(rawMd);
    }

    if (bodyEl) {
      bodyEl.innerHTML = html;
      if (root.Prism && typeof root.Prism.highlightAllUnder === 'function') {
        try { root.Prism.highlightAllUnder(bodyEl); } catch (e) {}
      }

      bodyEl.querySelectorAll('pre').forEach(pre => {
        if (pre.querySelector('.btn-copy-code')) return;
        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-copy-code';
        copyBtn.type = 'button';
        copyBtn.innerHTML = tFn('theory.copyCode');
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const codeEl = pre.querySelector('code');
          const codeText = codeEl ? codeEl.innerText : pre.innerText;
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(codeText).then(() => {
              copyBtn.innerHTML = tFn('theory.copiedCode');
              copyBtn.classList.add('copied');
              setTimeout(() => {
                copyBtn.innerHTML = tFn('theory.copyCode');
                copyBtn.classList.remove('copied');
              }, 2000);
            });
          }
        });
        pre.appendChild(copyBtn);
      });

      setupTheoryHeadingsAndTOC(bodyEl, containerEl);
    }

    if (containerEl) containerEl.scrollTop = 0;
  }

  function setupTheoryHeadingsAndTOC(bodyEl, containerEl) {
    if (!bodyEl || !containerEl) return;

    function generateSlug(text) {
      return text.toLowerCase().trim()
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
      const normSlug = slug.replace(/-+/g, '-');
      slugMap.set(slug, h);
      if (!slugMap.has(normSlug)) slugMap.set(normSlug, h);

      const numMatch = rawText.match(/^(\d+(?:\.\d+)*)/i) || rawText.match(/^phần\s+(\d+)/i);
      if (numMatch) h.setAttribute('data-section-num', numMatch[1]);

      if ((h.tagName === 'H2' || h.tagName === 'H3') && root.VoiceNarrator && !h.querySelector('.btn-speak-heading')) {
        const speakBtn = document.createElement('button');
        speakBtn.type = 'button';
        speakBtn.className = 'btn-speak-heading';
        speakBtn.title = 'Nghe AI Cloned đọc từ mục này';
        speakBtn.innerHTML = '🔊';
        speakBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          speakFromHeading(h, rawText);
        });
        h.appendChild(speakBtn);
      }
    });

    bodyEl.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const href = a.getAttribute('href');
        if (!href || href === '#') return;
        const rawTargetId = href.substring(1);
        let decoded = rawTargetId.toLowerCase().trim();
        try { decoded = decodeURIComponent(rawTargetId).toLowerCase().trim(); } catch (err) {}
        const norm = decoded.replace(/-+/g, '-');

        let targetEl = slugMap.get(decoded) || slugMap.get(norm) || document.getElementById(rawTargetId);
        if (!targetEl) {
          const numMatch = decoded.match(/^(\d+(?:[-.]\d+)*)/);
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

  function speakFromHeading(headingEl, sectionTitle) {
    if (!root.VoiceNarrator || !root.THEORY_DATA || !root.THEORY_DATA[currentChapterId]) return;
    const cleanHeading = sectionTitle.replace(/🔊/g, '').trim();
    root.VoiceNarrator.speakFromTheoryDom(`CH${currentChapterId} · ${cleanHeading}`, headingEl);
  }

  function startChapterNarration(chapterId = currentChapterId) {
    if (!root.VoiceNarrator || !root.THEORY_DATA || !root.THEORY_DATA[chapterId]) return;
    const data = root.THEORY_DATA[chapterId];
    const metaMap = (root.AppI18n && root.AppI18n.CHAPTER_METADATA) || {};
    const meta = metaMap[chapterId] || { vi: data.title, en: data.title };
    const title = `Chương ${chapterId}: ${meta.vi || data.title}`;
    root.VoiceNarrator.speakFromTheoryDom(title, null);
  }

  function toggleChapterNarration() {
    if (!root.VoiceNarrator) return;
    if (root.VoiceNarrator.state.isPlaying) {
      root.VoiceNarrator.stopSpeaking();
    } else {
      startChapterNarration(currentChapterId);
    }
  }

  function advanceToNextChapterAndRead() {
    if (!root.THEORY_DATA) return;
    const keys = Object.keys(root.THEORY_DATA).map(Number).sort((a, b) => a - b);
    if (!keys.length) return;
    const currIdx = keys.indexOf(Number(currentChapterId));
    const nextChapterId = keys[(currIdx + 1) % keys.length];
    renderTheoryChapter(nextChapterId);
    startChapterNarration(nextChapterId);
  }

  function closeTheoryModal() {
    if (root.VoiceNarrator && root.VoiceNarrator.state.isPlaying) {
      root.VoiceNarrator.stopSpeaking();
    }
    const modal = document.getElementById('theory-modal');
    if (modal) modal.classList.remove('show');
  }

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
      countEl.textContent = tFn('theory.resultsCount', { n: nodesToReplace.length });
    }

    let firstMatch = null;
    const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');

    nodesToReplace.forEach(node => {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(regex, '<mark class="highlight-search">$1</mark>');
      if (!firstMatch) firstMatch = span.querySelector('.highlight-search');
      if (node.parentNode) node.parentNode.replaceChild(span, node);
    });

    if (firstMatch) firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Video Modal Functions
  function openVideoModal(chapterId = 1) {
    const modal = document.getElementById('video-modal');
    if (!modal || !root.AppI18n) return;
    const videos = root.AppI18n.CHAPTER_VIDEOS;

    const tabsContainer = document.getElementById('video-chapter-tabs');
    if (tabsContainer) {
      tabsContainer.innerHTML = '';
      Object.values(videos).forEach(v => {
        const tab = document.createElement('button');
        tab.className = `video-tab-btn ${v.chapterId === Number(chapterId) ? 'active' : ''}`;
        tab.textContent = `${tFn('chapter.label')} ${v.chapterId}`;
        tab.title = v.title;
        tab.addEventListener('click', () => playChapterVideo(v.chapterId));
        tabsContainer.appendChild(tab);
      });
    }

    playChapterVideo(chapterId);
    modal.classList.add('show');
  }

  function playChapterVideo(chapterId) {
    const videos = (root.AppI18n && root.AppI18n.CHAPTER_VIDEOS) || {};
    const videoData = videos[chapterId] || videos[1];
    if (!videoData) return;

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
      btn.classList.toggle('active', idx + 1 === Number(chapterId));
    });

    if (player) player.play().catch(() => {});
  }

  function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    if (!modal) return;
    const player = document.getElementById('video-player');
    if (player) player.pause();
    modal.classList.remove('show');
  }

  root.openTheoryModal = openTheoryModal;
  root.closeTheoryModal = closeTheoryModal;
  root.TheoryViewer = {
    configure,
    openTheoryModal,
    closeTheoryModal,
    populateTheorySidebar,
    setTheorySidebarCollapsed,
    toggleTheorySidebar,
    handleTheorySearch,
    openVideoModal,
    closeVideoModal,
    toggleChapterNarration,
    startChapterNarration,
    advanceToNextChapterAndRead,
    getCurrentChapterId: () => currentChapterId
  };
})(typeof window !== 'undefined' ? window : this);
