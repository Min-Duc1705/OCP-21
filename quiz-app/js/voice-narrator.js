// ==========================================================================
// OCP 21 Study Guide - AI Cloned Voice Narrator & Sleep Podcast Engine
// Supports Pre-Rendered Static Cloned .MP3 + Cue Sync (100% Offline Mobile)
// & Live Local VieNeu TTS Server + Exact DOM Highlight & Auto-Scroll
// ==========================================================================

(function(root) {
  'use strict';

  // ONLY the 4 Cloned Voices as requested
  const CLONED_VOICES = [
    {
      id: 'cloned_microservices_female',
      name: 'Nữ Thuyết Minh Hệ Thống (Cloned)',
      shortName: 'Nữ Hệ Thống (Clone)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: 'Clone AI',
      desc: 'Giọng thuyết minh công nghệ cuốn hút, clone từ video Microservices',
      sampleUrl: 'assets/cloned_voices/microservices_female.wav'
    },
    {
      id: 'cloned_jobhub_female',
      name: 'Nữ Thuyết Minh JobHub AI (Cloned)',
      shortName: 'Nữ JobHub AI (Clone)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: 'Clone AI',
      desc: 'Giọng nữ thuyết minh công nghệ JobHub AI & Microservices tuyển dụng',
      sampleUrl: 'assets/cloned_voices/jobhub_female.wav'
    },
    {
      id: 'cloned_angular_male',
      name: 'Nam Đối Thoại Angular (Cloned)',
      shortName: 'Nam Angular (Clone)',
      gender: 'Nam',
      accent: 'Miền Nam',
      tag: 'Clone AI',
      desc: 'Giọng nam podcast NotebookLM trầm ấm, phong thái thảo luận kỹ thuật tự nhiên',
      sampleUrl: 'assets/cloned_voices/angular_male.wav'
    },
    {
      id: 'cloned_angular_female',
      name: 'Nữ Đối Thoại Angular (Cloned)',
      shortName: 'Nữ Angular (Clone)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: 'Clone AI',
      desc: 'Giọng nữ podcast NotebookLM hoạt ngôn, biểu cảm đối đáp sinh động',
      sampleUrl: 'assets/cloned_voices/angular_female.wav'
    }
  ];

  const DEFAULT_PRIMARY_VOICE = 'cloned_microservices_female';
  const DEFAULT_SECONDARY_VOICE = 'cloned_angular_male';

  const STORAGE_KEYS = {
    primaryVoice: 'ocp_voice_primary_cloned_v1',
    secondaryVoice: 'ocp_voice_secondary_cloned_v1',
    dualMode: 'ocp_voice_dual_mode_v1',
    speed: 'ocp_voice_speed_v1',
    autoNextChapter: 'ocp_voice_auto_next_ch_v1',
    skipCodeInSleep: 'ocp_voice_skip_code_v1',
    customServerUrl: 'ocp_voice_custom_server_v1'
  };

  function getSavedVoice(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      if (val && CLONED_VOICES.some(v => v.id === val)) return val;
    } catch (e) {}
    return fallback;
  }

  function getSavedBool(key, fallback) {
    try {
      const val = localStorage.getItem(key);
      if (val !== null) return val === 'true';
    } catch (e) {}
    return fallback;
  }

  function getSavedNumber(key, fallback) {
    try {
      const val = parseFloat(localStorage.getItem(key));
      if (!isNaN(val) && val >= 0.5 && val <= 2.5) return val;
    } catch (e) {}
    return fallback;
  }

  const state = {
    primaryVoice: getSavedVoice(STORAGE_KEYS.primaryVoice, DEFAULT_PRIMARY_VOICE),
    secondaryVoice: getSavedVoice(STORAGE_KEYS.secondaryVoice, DEFAULT_SECONDARY_VOICE),
    dualVoiceMode: getSavedBool(STORAGE_KEYS.dualMode, false),
    playbackSpeed: getSavedNumber(STORAGE_KEYS.speed, 1.0),
    autoNextChapter: getSavedBool(STORAGE_KEYS.autoNextChapter, true),
    skipCodeInSleep: getSavedBool(STORAGE_KEYS.skipCodeInSleep, true),
    customServerUrl: (function() {
      try { return localStorage.getItem(STORAGE_KEYS.customServerUrl) || ''; } catch (e) { return ''; }
    })(),
    sleepTimerMinutes: 0,
    sleepTimerRemainingSec: 0,
    isPlaying: false,
    isPaused: false,
    isLoadingAudio: false,
    activeChapterId: 1,
    isStaticMp3Mode: false,
    chunks: [],
    currentChunkIdx: 0,
    activeTitle: '',
    activeSpeakerVoice: DEFAULT_PRIMARY_VOICE,
    previewingVoiceId: null
  };

  let audioRef = null;
  let previewAudioRef = null;
  let sessionCounter = 0;
  let sleepIntervalId = null;
  let onChapterAdvanceCallback = null;
  const audioBlobCache = new Map();
  const manifestCache = new Map();

  function cleanTextForSpeech(rawText) {
    if (!rawText) return '';
    return String(rawText)
      .replace(/🔊/g, '')
      .replace(/📋\s*(Sao chép|Copy|Đã chép|Copied!?)/gi, '')
      .replace(/\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/gi, (_, type) => {
        const map = {
          NOTE: 'Lưu ý: ',
          TIP: 'Mẹo thi: ',
          IMPORTANT: 'Quan trọng: ',
          WARNING: 'Cảnh báo bẫy thi: ',
          CAUTION: 'Thận trọng: '
        };
        return map[type.toUpperCase()] || 'Lưu ý: ';
      })
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/\|/g, ', ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function splitBlockTextIntoSentences(text, maxLen = 220) {
    const cleaned = cleanTextForSpeech(text);
    if (!cleaned || cleaned.length < 2) return [];

    const rawSentences = cleaned
      .split(/(?<=[.!?。\n])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    const parts = [];
    let current = '';

    for (const sentence of rawSentences) {
      if (!current) {
        if (sentence.length <= maxLen) {
          current = sentence;
        } else {
          const subParts = sentence.split(/(?<=[,;:])\s+/);
          for (const part of subParts) {
            if ((current + ' ' + part).trim().length <= maxLen) {
              current = (current + ' ' + part).trim();
            } else {
              if (current) parts.push(current);
              current = part.slice(0, maxLen);
            }
          }
        }
      } else if ((current + ' ' + sentence).length <= maxLen) {
        current = `${current} ${sentence}`;
      } else {
        parts.push(current);
        current = sentence.slice(0, maxLen);
      }
    }
    if (current) parts.push(current);
    return parts.filter(c => c.length > 1);
  }

  // Fetch pre-rendered static MP3 manifest from assets/theory_audio/ch{id}_{voice}.json
  async function fetchPreRenderedManifest(chapterId, voiceId) {
    const validVoice = CLONED_VOICES.some(v => v.id === voiceId) ? voiceId : DEFAULT_PRIMARY_VOICE;
    const key = `ch${chapterId}_${validVoice}`;
    if (manifestCache.has(key)) {
      return manifestCache.get(key);
    }
    try {
      const res = await fetch(`assets/theory_audio/${key}.json`);
      if (res && res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.cues) && data.cues.length > 0) {
          manifestCache.set(key, data);
          return data;
        }
      }
    } catch (e) {}
    return null;
  }

  // Bind manifest cues directly to DOM headings/blocks in #theory-content-body
  function mapManifestCuesToDom(bodyEl, cues, startFromEl = null) {
    if (!bodyEl || !Array.isArray(cues)) return { mappedCues: cues || [], startIdx: 0 };

    bodyEl.querySelectorAll('[data-voice-block-id]').forEach(el => {
      el.removeAttribute('data-voice-block-id');
      el.classList.remove('voice-reading-active');
    });

    const headings = Array.from(bodyEl.querySelectorAll('h1, h2, h3'));
    let startIdx = 0;

    const mapped = cues.map((cue, idx) => {
      const blockId = `vb-static-${idx}`;
      const normAnchor = (cue.anchorText || '').toLowerCase().replace(/🔊/g, '').trim();

      let matchedEl = null;
      if (normAnchor) {
        matchedEl = headings.find(h => {
          const hTxt = h.textContent.toLowerCase().replace(/🔊/g, '').trim();
          return hTxt === normAnchor || hTxt.includes(normAnchor) || normAnchor.includes(hTxt);
        });
      }
      if (!matchedEl && headings[idx]) {
        matchedEl = headings[idx];
      }

      if (matchedEl) {
        matchedEl.setAttribute('data-voice-block-id', blockId);
        if (startFromEl && (matchedEl === startFromEl || matchedEl.contains(startFromEl) || startFromEl.contains(matchedEl))) {
          startIdx = idx;
        }
        if (!matchedEl.dataset.voiceStaticClickBound) {
          matchedEl.dataset.voiceStaticClickBound = '1';
          matchedEl.addEventListener('click', (e) => {
            if (!state.isPlaying) return;
            if (e.target.closest('a, .btn-copy-code')) return;
            jumpToChunk(idx);
          });
        }
      }

      return {
        ...cue,
        index: idx,
        blockId
      };
    });

    // If startFromEl was a H3 inside a H2 section, find the closest preceding H2 cue
    if (startFromEl && startIdx === 0) {
      let prev = startFromEl;
      while (prev) {
        const bid = prev.getAttribute && prev.getAttribute('data-voice-block-id');
        if (bid && bid.startsWith('vb-static-')) {
          startIdx = parseInt(bid.replace('vb-static-', ''), 10) || 0;
          break;
        }
        prev = prev.previousElementSibling || prev.parentElement;
      }
    }

    return { mappedCues: mapped, startIdx };
  }

  function buildDomMappedChunks(bodyEl, startFromEl = null) {
    if (!bodyEl) return [];

    bodyEl.querySelectorAll('[data-voice-block-id]').forEach(el => {
      el.removeAttribute('data-voice-block-id');
      el.classList.remove('voice-reading-active');
    });

    const candidates = Array.from(
      bodyEl.querySelectorAll('h1, h2, h3, h4, h5, h6, p, li, tr, pre')
    );

    const leafBlocks = candidates.filter(el => {
      if (el.tagName === 'PRE') return !state.skipCodeInSleep;
      if (el.closest('pre')) return false;
      if (el.tagName === 'TR') return el.textContent.trim().length > 2;
      if (el.tagName === 'LI') return !el.querySelector('p, ul, ol');
      return true;
    });

    let started = !startFromEl;
    let blockCounter = 0;
    const mappedChunks = [];

    for (const el of leafBlocks) {
      if (!started) {
        if (el === startFromEl || startFromEl.contains(el) || el.contains(startFromEl)) {
          started = true;
        } else {
          continue;
        }
      }

      let rawText = '';
      if (el.tagName === 'PRE') {
        const codeText = (el.querySelector('code') || el).innerText || '';
        rawText = codeText.length > 220
          ? 'Ví dụ đoạn mã Java minh họa trên màn hình.'
          : 'Ví dụ mã: ' + codeText.replace(/[{}();=<>]/g, ' ');
      } else if (el.tagName === 'TR') {
        const cells = Array.from(el.querySelectorAll('th, td')).map(c => c.innerText.trim()).filter(Boolean);
        rawText = cells.join(', ');
      } else {
        const clone = el.cloneNode(true);
        clone.querySelectorAll('.btn-speak-heading, .btn-copy-code, pre, ul, ol').forEach(n => n.remove());
        rawText = clone.textContent || '';
      }

      const sentenceParts = splitBlockTextIntoSentences(rawText, 220);
      if (sentenceParts.length === 0) continue;

      const blockId = `vb-${blockCounter++}`;
      el.setAttribute('data-voice-block-id', blockId);

      if (!el.dataset.voiceClickBound) {
        el.dataset.voiceClickBound = '1';
        el.addEventListener('click', (e) => {
          if (!state.isPlaying || state.isStaticMp3Mode) return;
          if (e.target.closest('a, button, pre, code')) return;
          const targetBlockId = el.getAttribute('data-voice-block-id');
          if (!targetBlockId) return;
          const foundIdx = state.chunks.findIndex(c => c.blockId === targetBlockId);
          if (foundIdx >= 0) jumpToChunk(foundIdx);
        });
      }

      for (const part of sentenceParts) {
        mappedChunks.push({ text: part, blockId });
      }
    }

    return mappedChunks;
  }

  function getVoiceMeta(voiceId) {
    return CLONED_VOICES.find(v => v.id === voiceId) || CLONED_VOICES[0];
  }

  function getVoiceForChunk(idx) {
    if (!state.dualVoiceMode) return state.primaryVoice;
    return idx % 2 === 0 ? state.primaryVoice : state.secondaryVoice;
  }

  async function fetchClonedSpeechBlob(text, voiceId) {
    const validVoice = CLONED_VOICES.some(v => v.id === voiceId) ? voiceId : DEFAULT_PRIMARY_VOICE;
    const cacheKey = `${validVoice}_${text}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey);
    }

    const endpoints = [];
    if (state.customServerUrl && state.customServerUrl.trim()) {
      const base = state.customServerUrl.trim().replace(/\/+$/, '');
      if (base.includes('/tts')) {
        endpoints.push({ type: 'get', url: `${base}?text=${encodeURIComponent(text)}&lang=vi&voice=${encodeURIComponent(validVoice)}&speed=1.0` });
      } else {
        endpoints.push({
          type: 'post',
          url: base.endsWith('/v1/audio/speech') ? base : `${base}/v1/audio/speech`,
          body: { model: 'tts-1', input: text, voice: validVoice, speed: 1.0 }
        });
      }
    }

    endpoints.push({
      type: 'get',
      url: `http://127.0.0.1:45678/tts?text=${encodeURIComponent(text)}&lang=vi&voice=${encodeURIComponent(validVoice)}&speed=1.0`
    });

    endpoints.push({
      type: 'post',
      url: 'http://127.0.0.1:8000/v1/audio/speech',
      body: { model: 'tts-1', input: text, voice: validVoice, speed: 1.0 }
    });

    for (const ep of endpoints) {
      try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 28000);
        let res;
        if (ep.type === 'get') {
          res = await fetch(ep.url, { signal: controller.signal });
        } else {
          res = await fetch(ep.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer local_drive_player_agy_key_8888'
            },
            body: JSON.stringify(ep.body),
            signal: controller.signal
          });
        }
        clearTimeout(timer);
        if (res && res.ok) {
          const blob = await res.blob();
          if (blob && blob.size > 100) {
            if (audioBlobCache.size > 90) {
              const firstKey = audioBlobCache.keys().next().value;
              const oldUrl = audioBlobCache.get(firstKey);
              if (oldUrl) URL.revokeObjectURL(oldUrl);
              audioBlobCache.delete(firstKey);
            }
            const objUrl = URL.createObjectURL(blob);
            audioBlobCache.set(cacheKey, objUrl);
            return objUrl;
          }
        }
      } catch (e) {}
    }
    return null;
  }

  function prefetchChunk(idx) {
    if (state.isStaticMp3Mode || idx < 0 || idx >= state.chunks.length) return;
    const item = state.chunks[idx];
    const text = typeof item === 'string' ? item : item.text;
    const voice = getVoiceForChunk(idx);
    fetchClonedSpeechBlob(text, voice).catch(() => {});
  }

  function clearActiveHighlight() {
    const bodyEl = document.getElementById('theory-content-body');
    if (!bodyEl) return;
    bodyEl.querySelectorAll('.voice-reading-active').forEach(el => {
      el.classList.remove('voice-reading-active');
    });
  }

  function highlightAndScrollToChunk(chunkObj) {
    const bodyEl = document.getElementById('theory-content-body');
    const container = document.getElementById('theory-reader-container');
    if (!bodyEl || !chunkObj) return;

    clearActiveHighlight();

    let targetEl = null;
    if (chunkObj.blockId) {
      targetEl = bodyEl.querySelector(`[data-voice-block-id="${chunkObj.blockId}"]`);
    }

    if (!targetEl && chunkObj.anchorText) {
      const normAnchor = chunkObj.anchorText.toLowerCase().trim();
      const headings = bodyEl.querySelectorAll('h1, h2, h3');
      for (const h of headings) {
        if (h.textContent.toLowerCase().includes(normAnchor)) {
          targetEl = h;
          break;
        }
      }
    }

    if (!targetEl && chunkObj.text) {
      const snippet = chunkObj.text.slice(0, 32).trim().toLowerCase();
      if (snippet.length > 5) {
        const blocks = bodyEl.querySelectorAll('h1, h2, h3, h4, p, li, tr, blockquote');
        for (const b of blocks) {
          if (b.textContent.toLowerCase().includes(snippet)) {
            targetEl = b;
            break;
          }
        }
      }
    }

    if (targetEl) {
      targetEl.classList.add('voice-reading-active');
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const relativeTop = targetRect.top - containerRect.top + container.scrollTop;
        const desiredTop = relativeTop - (containerRect.height * 0.28);
        container.scrollTo({
          top: Math.max(0, desiredTop),
          behavior: 'smooth'
        });
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  function stopAudioInternal() {
    sessionCounter += 1;
    if (audioRef) {
      try {
        audioRef.pause();
        audioRef.ontimeupdate = null;
        audioRef.onended = null;
        audioRef.onerror = null;
        audioRef.src = '';
      } catch (e) {}
      audioRef = null;
    }
    if (root.speechSynthesis) {
      try { root.speechSynthesis.cancel(); } catch (e) {}
    }
  }

  function stopSpeaking() {
    stopAudioInternal();
    clearActiveHighlight();
    state.isPlaying = false;
    state.isPaused = false;
    state.isLoadingAudio = false;
    updateUI();
  }

  function updateMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const voiceMeta = getVoiceMeta(state.activeSpeakerVoice);
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: state.activeTitle || 'OCP Java 21 Theory Audio',
        artist: `${voiceMeta.name} · OCP 21`,
        album: 'OCP Java SE 21 Sleep Narration'
      });
      navigator.mediaSession.setActionHandler('play', () => { if (state.isPaused) togglePause(); });
      navigator.mediaSession.setActionHandler('pause', () => { if (!state.isPaused) togglePause(); });
      navigator.mediaSession.setActionHandler('previoustrack', () => skipChunk(-1));
      navigator.mediaSession.setActionHandler('nexttrack', () => skipChunk(1));
    } catch (e) {}
  }

  // Play Pre-Rendered Static Cloned .MP3 (100% Offline Mobile & Lock-Screen Friendly)
  async function playStaticMp3AtCue(idx, sessionId) {
    if (sessionId !== sessionCounter) return;

    if (idx >= state.chunks.length) {
      clearActiveHighlight();
      if (state.autoNextChapter && typeof onChapterAdvanceCallback === 'function') {
        onChapterAdvanceCallback();
        return;
      }
      state.isPlaying = false;
      state.isPaused = false;
      state.isLoadingAudio = false;
      state.currentChunkIdx = 0;
      updateUI();
      return;
    }

    const chosenVoice = getVoiceForChunk(idx);
    const manifest = await fetchPreRenderedManifest(state.activeChapterId, chosenVoice);
    if (sessionId !== sessionCounter || !manifest || !manifest.cues[idx]) return;

    const cue = manifest.cues[idx];
    state.currentChunkIdx = idx;
    state.activeSpeakerVoice = chosenVoice;
    state.isLoadingAudio = false;
    updateUI();
    highlightAndScrollToChunk(state.chunks[idx]);
    updateMediaSession();

    const targetAudioUrl = manifest.audioUrl;

    // In Single-Voice mode, play 1 continuous MP3 for the entire chapter and sync via ontimeupdate!
    if (!state.dualVoiceMode) {
      if (audioRef && audioRef.dataset.staticUrl === targetAudioUrl) {
        audioRef.playbackRate = state.playbackSpeed;
        audioRef.currentTime = cue.start;
        if (audioRef.paused && !state.isPaused) {
          audioRef.play().catch(() => {});
        }
        return;
      }

      if (audioRef) {
        audioRef.pause();
        audioRef.ontimeupdate = null;
        audioRef.onended = null;
      }

      state.isLoadingAudio = true;
      updateUI();

      const audio = new Audio(targetAudioUrl);
      audio.dataset.staticUrl = targetAudioUrl;
      audio.playbackRate = state.playbackSpeed;
      audioRef = audio;

      audio.onloadedmetadata = () => {
        if (sessionId !== sessionCounter) return;
        audio.currentTime = cue.start;
        audio.playbackRate = state.playbackSpeed;
        state.isLoadingAudio = false;
        updateUI();
      };

      audio.ontimeupdate = () => {
        if (sessionId !== sessionCounter || !audioRef) return;
        const t = audioRef.currentTime;
        const activeIdx = state.chunks.findIndex(c => t >= c.start && t <= c.end + 0.35);
        if (activeIdx >= 0 && activeIdx !== state.currentChunkIdx) {
          state.currentChunkIdx = activeIdx;
          updateUI();
          highlightAndScrollToChunk(state.chunks[activeIdx]);
          updateMediaSession();
        }
      };

      audio.onended = () => {
        if (sessionId !== sessionCounter) return;
        playStaticMp3AtCue(state.chunks.length, sessionId);
      };

      try {
        await audio.play();
        audio.playbackRate = state.playbackSpeed;
        state.isLoadingAudio = false;
        updateUI();
      } catch (e) {}
      return;
    }

    // In Dual-Voice Podcast mode, alternate cue slices between Speaker A MP3 and Speaker B MP3!
    if (audioRef) {
      audioRef.pause();
      audioRef.ontimeupdate = null;
      audioRef.onended = null;
    }

    const audio = new Audio(targetAudioUrl);
    audio.playbackRate = state.playbackSpeed;
    audioRef = audio;

    audio.onloadedmetadata = () => {
      if (sessionId !== sessionCounter) return;
      audio.currentTime = cue.start;
      audio.playbackRate = state.playbackSpeed;
    };

    let advanced = false;
    audio.ontimeupdate = () => {
      if (sessionId !== sessionCounter || advanced) return;
      if (audio.currentTime >= cue.end) {
        advanced = true;
        audio.pause();
        playStaticMp3AtCue(idx + 1, sessionId);
      }
    };

    audio.onended = () => {
      if (sessionId !== sessionCounter || advanced) return;
      advanced = true;
      playStaticMp3AtCue(idx + 1, sessionId);
    };

    try {
      await audio.play();
      audio.playbackRate = state.playbackSpeed;
    } catch (e) {}
  }

  async function playChunkAtIndex(idx, sessionId) {
    if (sessionId !== sessionCounter) return;

    if (state.isStaticMp3Mode) {
      await playStaticMp3AtCue(idx, sessionId);
      return;
    }

    if (idx >= state.chunks.length) {
      clearActiveHighlight();
      if (state.autoNextChapter && typeof onChapterAdvanceCallback === 'function') {
        onChapterAdvanceCallback();
        return;
      }
      state.isPlaying = false;
      state.isPaused = false;
      state.isLoadingAudio = false;
      state.currentChunkIdx = 0;
      updateUI();
      return;
    }

    const chunkItem = state.chunks[idx];
    const chunkText = typeof chunkItem === 'string' ? chunkItem : chunkItem.text;
    const chosenVoice = getVoiceForChunk(idx);

    state.currentChunkIdx = idx;
    state.activeSpeakerVoice = chosenVoice;
    state.isLoadingAudio = true;
    updateUI();
    highlightAndScrollToChunk(chunkItem);
    updateMediaSession();

    prefetchChunk(idx + 1);
    prefetchChunk(idx + 2);

    const blobUrl = await fetchClonedSpeechBlob(chunkText, chosenVoice);
    if (sessionId !== sessionCounter) return;

    if (blobUrl) {
      try {
        if (audioRef) {
          audioRef.pause();
          audioRef.onended = null;
          audioRef.onerror = null;
        }
        const audio = new Audio(blobUrl);
        audio.playbackRate = state.playbackSpeed;
        audioRef = audio;
        audio.oncanplay = () => {
          if (sessionId === sessionCounter) {
            state.isLoadingAudio = false;
            updateUI();
          }
        };
        audio.onended = () => {
          if (sessionId !== sessionCounter) return;
          playChunkAtIndex(idx + 1, sessionId);
        };
        audio.onerror = () => {
          if (sessionId !== sessionCounter) return;
          playFallbackBrowserSpeech(chunkText, idx, sessionId, chosenVoice);
        };
        await audio.play();
        audio.playbackRate = state.playbackSpeed;
        state.isLoadingAudio = false;
        updateUI();
        return;
      } catch (err) {
        if (sessionId !== sessionCounter) return;
      }
    }

    playFallbackBrowserSpeech(chunkText, idx, sessionId, chosenVoice);
  }

  function playFallbackBrowserSpeech(chunkText, idx, sessionId, chosenVoice) {
    if (sessionId !== sessionCounter) return;
    state.isLoadingAudio = false;
    updateUI();

    if (!root.speechSynthesis) {
      state.isPlaying = false;
      updateUI();
      return;
    }

    try {
      root.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(chunkText);
      utter.lang = 'vi-VN';
      utter.rate = state.playbackSpeed;

      const pitchMap = {
        cloned_microservices_female: 1.05,
        cloned_jobhub_female: 0.96,
        cloned_angular_male: 0.82,
        cloned_angular_female: 1.14
      };
      utter.pitch = pitchMap[chosenVoice] || 1.0;

      const voices = root.speechSynthesis.getVoices() || [];
      const viVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes('vi'));
      if (viVoices.length > 0) {
        const voiceIdx = CLONED_VOICES.findIndex(v => v.id === chosenVoice);
        utter.voice = viVoices[Math.max(0, voiceIdx) % viVoices.length];
      }

      utter.onend = () => {
        if (sessionId !== sessionCounter) return;
        playChunkAtIndex(idx + 1, sessionId);
      };
      utter.onerror = () => {
        if (sessionId !== sessionCounter) return;
        playChunkAtIndex(idx + 1, sessionId);
      };
      root.speechSynthesis.speak(utter);
    } catch (e) {
      state.isPlaying = false;
      updateUI();
    }
  }

  // Primary entry point: checks static pre-rendered Cloned .MP3 first, then falls back to live TTS
  async function speakFromTheoryDom(title = 'Lý thuyết chương', startFromEl = null, chapterId = 1) {
    stopAudioInternal();
    state.activeChapterId = Number(chapterId) || 1;
    const currentSession = sessionCounter;
    const bodyEl = document.getElementById('theory-content-body');

    state.activeTitle = title;
    state.isPlaying = true;
    state.isPaused = false;
    state.isLoadingAudio = true;
    updateUI();

    // 1. Check if static pre-rendered Cloned AI .MP3 + .JSON manifest exists for this chapter
    const manifest = await fetchPreRenderedManifest(state.activeChapterId, state.primaryVoice);
    if (currentSession !== sessionCounter) return;

    if (manifest && Array.isArray(manifest.cues) && manifest.cues.length > 0) {
      state.isStaticMp3Mode = true;
      const { mappedCues, startIdx } = mapManifestCuesToDom(bodyEl, manifest.cues, startFromEl);
      state.chunks = mappedCues;
      state.currentChunkIdx = startIdx;
      updateUI();
      await playStaticMp3AtCue(startIdx, currentSession);
      return;
    }

    // 2. Otherwise use live DOM block chunks
    state.isStaticMp3Mode = false;
    const domChunks = buildDomMappedChunks(bodyEl, startFromEl);
    if (domChunks.length === 0) {
      state.isPlaying = false;
      state.isLoadingAudio = false;
      updateUI();
      return;
    }

    state.chunks = domChunks;
    state.currentChunkIdx = 0;
    updateUI();
    playChunkAtIndex(0, currentSession);
  }

  function speakText(rawMarkdownText, title = 'Lý thuyết chương', startFromEl = null, chapterId = 1) {
    speakFromTheoryDom(title, startFromEl, chapterId);
  }

  function togglePause() {
    if (!state.isPlaying) return;
    if (state.isPaused) {
      state.isPaused = false;
      if (audioRef) {
        audioRef.playbackRate = state.playbackSpeed;
        audioRef.play().catch(() => {});
      } else if (root.speechSynthesis && root.speechSynthesis.paused) {
        root.speechSynthesis.resume();
      } else {
        playChunkAtIndex(state.currentChunkIdx, sessionCounter);
      }
    } else {
      state.isPaused = true;
      if (audioRef) {
        audioRef.pause();
      } else if (root.speechSynthesis && root.speechSynthesis.speaking) {
        root.speechSynthesis.pause();
      }
    }
    updateUI();
  }

  function skipChunk(delta) {
    if (!state.isPlaying || state.chunks.length === 0) return;
    const nextIdx = Math.max(0, Math.min(state.chunks.length - 1, state.currentChunkIdx + delta));
    jumpToChunk(nextIdx);
  }

  function jumpToChunk(idx) {
    if (!state.isPlaying || idx < 0 || idx >= state.chunks.length) return;
    state.isPaused = false;
    if (state.isStaticMp3Mode && !state.dualVoiceMode && audioRef && state.chunks[idx]) {
      state.currentChunkIdx = idx;
      audioRef.currentTime = state.chunks[idx].start || 0;
      audioRef.playbackRate = state.playbackSpeed;
      if (audioRef.paused) audioRef.play().catch(() => {});
      updateUI();
      highlightAndScrollToChunk(state.chunks[idx]);
      return;
    }
    stopAudioInternal();
    state.isPlaying = true;
    playChunkAtIndex(idx, sessionCounter);
  }

  async function previewClonedVoice(voiceId) {
    const meta = getVoiceMeta(voiceId);
    if (!meta) return;

    if (previewAudioRef) {
      try {
        previewAudioRef.pause();
        previewAudioRef.src = '';
      } catch (e) {}
      previewAudioRef = null;
    }

    if (state.previewingVoiceId === voiceId) {
      state.previewingVoiceId = null;
      updateVoiceModalUI();
      return;
    }

    state.previewingVoiceId = voiceId;
    updateVoiceModalUI();

    try {
      const audio = new Audio(meta.sampleUrl);
      previewAudioRef = audio;
      audio.playbackRate = state.playbackSpeed;
      audio.onended = () => {
        state.previewingVoiceId = null;
        updateVoiceModalUI();
      };
      audio.onerror = () => {
        state.previewingVoiceId = null;
        updateVoiceModalUI();
      };
      await audio.play();
    } catch (e) {
      state.previewingVoiceId = null;
      updateVoiceModalUI();
    }
  }

  function setSleepTimer(minutes) {
    state.sleepTimerMinutes = Number(minutes) || 0;
    if (sleepIntervalId) {
      clearInterval(sleepIntervalId);
      sleepIntervalId = null;
    }
    if (state.sleepTimerMinutes > 0) {
      state.sleepTimerRemainingSec = state.sleepTimerMinutes * 60;
      sleepIntervalId = setInterval(() => {
        if (state.sleepTimerRemainingSec <= 1) {
          clearInterval(sleepIntervalId);
          sleepIntervalId = null;
          state.sleepTimerMinutes = 0;
          state.sleepTimerRemainingSec = 0;
          stopSpeaking();
          return;
        }
        state.sleepTimerRemainingSec -= 1;
        updateSleepTimerBadge();
      }, 1000);
    } else {
      state.sleepTimerRemainingSec = 0;
    }
    updateUI();
    updateVoiceModalUI();
  }

  function formatSec(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function updateSleepTimerBadge() {
    const badge = document.getElementById('voice-sleep-countdown');
    if (!badge) return;
    if (state.sleepTimerRemainingSec > 0) {
      badge.style.display = 'inline-flex';
      badge.textContent = `🌙 Tắt sau ${formatSec(state.sleepTimerRemainingSec)}`;
    } else {
      badge.style.display = 'none';
    }
  }

  function setPrimaryVoice(voiceId) {
    if (voiceId === 'dual_podcast') {
      setDualVoiceMode(true);
      return;
    }
    if (!CLONED_VOICES.some(v => v.id === voiceId)) return;
    state.primaryVoice = voiceId;
    state.dualVoiceMode = false;
    try {
      localStorage.setItem(STORAGE_KEYS.primaryVoice, voiceId);
      localStorage.setItem(STORAGE_KEYS.dualMode, 'false');
    } catch (e) {}
    if (state.isPlaying && !state.isPaused) {
      const idx = state.currentChunkIdx;
      stopAudioInternal();
      state.isPlaying = true;
      playChunkAtIndex(idx, sessionCounter);
    }
    updateUI();
    updateVoiceModalUI();
  }

  function setSecondaryVoice(voiceId) {
    if (!CLONED_VOICES.some(v => v.id === voiceId)) return;
    state.secondaryVoice = voiceId;
    try { localStorage.setItem(STORAGE_KEYS.secondaryVoice, voiceId); } catch (e) {}
    if (state.isPlaying && !state.isPaused && state.dualVoiceMode) {
      const idx = state.currentChunkIdx;
      stopAudioInternal();
      state.isPlaying = true;
      playChunkAtIndex(idx, sessionCounter);
    }
    updateUI();
    updateVoiceModalUI();
  }

  function setDualVoiceMode(enabled) {
    state.dualVoiceMode = Boolean(enabled);
    try { localStorage.setItem(STORAGE_KEYS.dualMode, String(state.dualVoiceMode)); } catch (e) {}
    if (state.isPlaying && !state.isPaused) {
      const idx = state.currentChunkIdx;
      stopAudioInternal();
      state.isPlaying = true;
      playChunkAtIndex(idx, sessionCounter);
    }
    updateUI();
    updateVoiceModalUI();
  }

  function setPlaybackSpeed(speed) {
    const num = Math.max(0.75, Math.min(2.0, Number(speed) || 1.0));
    state.playbackSpeed = num;
    try { localStorage.setItem(STORAGE_KEYS.speed, String(num)); } catch (e) {}

    if (audioRef) {
      try { audioRef.playbackRate = num; } catch (e) {}
    } else if (state.isPlaying && !state.isPaused) {
      const idx = state.currentChunkIdx;
      stopAudioInternal();
      state.isPlaying = true;
      playChunkAtIndex(idx, sessionCounter);
    }
    updateUI();
    updateVoiceModalUI();
  }

  function setAutoNextChapter(enabled) {
    state.autoNextChapter = Boolean(enabled);
    try { localStorage.setItem(STORAGE_KEYS.autoNextChapter, String(state.autoNextChapter)); } catch (e) {}
    updateUI();
    updateVoiceModalUI();
  }

  function setSkipCodeInSleep(enabled) {
    state.skipCodeInSleep = Boolean(enabled);
    try { localStorage.setItem(STORAGE_KEYS.skipCodeInSleep, String(state.skipCodeInSleep)); } catch (e) {}
    updateVoiceModalUI();
  }

  function setCustomServerUrl(url) {
    state.customServerUrl = (url || '').trim();
    try { localStorage.setItem(STORAGE_KEYS.customServerUrl, state.customServerUrl); } catch (e) {}
  }

  function updateUI() {
    const primaryMeta = getVoiceMeta(state.primaryVoice);
    const activeMeta = getVoiceMeta(state.activeSpeakerVoice);

    const btnReadToggle = document.getElementById('btn-theory-voice-toggle');
    if (btnReadToggle) {
      if (state.isPlaying) {
        btnReadToggle.innerHTML = `⏹ <span class="hide-mobile">Dừng đọc</span>`;
        btnReadToggle.classList.add('btn-voice-playing');
      } else {
        btnReadToggle.innerHTML = `🔊 <span class="hide-mobile">Nghe Lý Thuyết</span>`;
        btnReadToggle.classList.remove('btn-voice-playing');
      }
    }

    const btnVoiceSelect = document.getElementById('btn-theory-voice-select');
    if (btnVoiceSelect) {
      const shortName = primaryMeta.shortName || primaryMeta.name.replace(' (Cloned)', '');
      btnVoiceSelect.innerHTML = `🎙️ <span class="hide-mobile">${state.dualVoiceMode ? 'Podcast 2 Giọng' : shortName}</span>`;
    }

    const voiceQuickSelect = document.getElementById('voice-bar-voice-select');
    if (voiceQuickSelect) {
      voiceQuickSelect.value = state.dualVoiceMode ? 'dual_podcast' : state.primaryVoice;
    }

    const controlBar = document.getElementById('ocp-voice-control-bar');
    if (!controlBar) return;

    if (!state.isPlaying) {
      controlBar.style.display = 'none';
      return;
    }

    controlBar.style.display = 'flex';
    const speakerLabel = document.getElementById('voice-bar-speaker');
    if (speakerLabel) {
      speakerLabel.textContent = state.isLoadingAudio
        ? `⏳ Đang tải giọng (${activeMeta.shortName})...`
        : `${state.dualVoiceMode ? '🎭 Podcast 2 Giọng' : '🎙️ Giọng Clone AI'}: ${activeMeta.name}`;
    }

    const titleEl = document.getElementById('voice-bar-title');
    if (titleEl) titleEl.textContent = state.activeTitle || 'Đang đọc lý thuyết';

    const chunkCounterEl = document.getElementById('voice-bar-counter');
    if (chunkCounterEl) {
      chunkCounterEl.textContent = `Mục ${state.currentChunkIdx + 1} / ${state.chunks.length}`;
    }

    const currentChunkObj = state.chunks[state.currentChunkIdx];
    const currentText = currentChunkObj ? (typeof currentChunkObj === 'string' ? currentChunkObj : currentChunkObj.text) : '';
    const snippetEl = document.getElementById('voice-bar-snippet');
    if (snippetEl) {
      snippetEl.textContent = `"${currentText}"`;
    }

    const progressFill = document.getElementById('voice-bar-progress-fill');
    if (progressFill && state.chunks.length > 0) {
      const pct = Math.round(((state.currentChunkIdx + 1) / state.chunks.length) * 100);
      progressFill.style.width = `${pct}%`;
    }

    const btnPause = document.getElementById('btn-voice-bar-pause');
    if (btnPause) {
      btnPause.innerHTML = state.isPaused ? '▶️ Tiếp tục' : '⏸ Tạm dừng';
    }

    const speedSelect = document.getElementById('voice-bar-speed-select');
    if (speedSelect) {
      speedSelect.value = String(state.playbackSpeed);
    }

    const autoNextBtn = document.getElementById('btn-voice-bar-autonext');
    if (autoNextBtn) {
      autoNextBtn.classList.toggle('active', state.autoNextChapter);
      autoNextBtn.innerHTML = state.autoNextChapter ? '🔁 Tự qua chương: BẬT' : '🔁 Tự qua chương: TẮT';
    }

    updateSleepTimerBadge();
  }

  function updateVoiceModalUI() {
    const modal = document.getElementById('voice-selector-modal');
    if (!modal) return;

    const listEl = document.getElementById('cloned-voices-grid');
    if (listEl) {
      listEl.innerHTML = '';
      CLONED_VOICES.forEach(v => {
        const isPrimary = state.primaryVoice === v.id;
        const isSecondary = state.dualVoiceMode && state.secondaryVoice === v.id;
        const isPreviewing = state.previewingVoiceId === v.id;

        const card = document.createElement('div');
        card.className = `cloned-voice-row ${isPrimary ? 'selected-primary' : ''} ${isSecondary ? 'selected-secondary' : ''}`;
        card.innerHTML = `
          <div class="cloned-voice-row-left">
            <div class="cloned-voice-avatar ${v.gender === 'Nam' ? 'male' : 'female'}">
              ${v.gender === 'Nam' ? '👱‍♂️' : '👱‍♀️'}
            </div>
            <div class="cloned-voice-info">
              <div class="cloned-voice-name-row">
                <strong class="cloned-voice-title">${v.name}</strong>
                ${isPrimary ? '<span class="voice-speaker-badge speaker-a">SPEAKER A</span>' : ''}
                ${isSecondary ? '<span class="voice-speaker-badge speaker-b">SPEAKER B</span>' : ''}
                <span class="voice-clone-ai-badge">${v.tag}</span>
                <span class="voice-accent-badge">${v.accent}</span>
              </div>
              <p class="cloned-voice-desc">${v.desc}</p>
            </div>
          </div>
          <div class="cloned-voice-row-actions">
            ${state.dualVoiceMode && !isPrimary ? `
              <button type="button" class="btn-voice-slot-b ${isSecondary ? 'active' : ''}" data-voice="${v.id}" title="Đặt làm Speaker B (Giọng #2)">
                ${isSecondary ? '✓ Speaker B' : '+ Speaker B'}
              </button>
            ` : ''}
            <button type="button" class="btn-voice-preview ${isPreviewing ? 'playing' : ''}" data-voice="${v.id}">
              ${isPreviewing ? '⏹ Dừng' : '▶ Nghe thử'}
            </button>
            <button type="button" class="btn-voice-radio ${isPrimary ? 'checked' : ''}" data-voice="${v.id}" title="Chọn làm giọng đọc chính (Speaker A)">
              ${isPrimary ? '✓' : ''}
            </button>
          </div>
        `;
        card.addEventListener('click', (e) => {
          if (e.target.closest('.btn-voice-preview, .btn-voice-slot-b')) return;
          setPrimaryVoice(v.id);
        });
        listEl.appendChild(card);
      });

      listEl.querySelectorAll('.btn-voice-preview').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          previewClonedVoice(btn.dataset.voice);
        });
      });

      listEl.querySelectorAll('.btn-voice-slot-b').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setSecondaryVoice(btn.dataset.voice);
        });
      });
    }

    const chkDual = document.getElementById('chk-voice-dual-mode');
    if (chkDual) chkDual.checked = state.dualVoiceMode;

    const chkAutoNext = document.getElementById('chk-voice-auto-next');
    if (chkAutoNext) chkAutoNext.checked = state.autoNextChapter;

    const chkSkipCode = document.getElementById('chk-voice-skip-code');
    if (chkSkipCode) chkSkipCode.checked = state.skipCodeInSleep;

    document.querySelectorAll('.sleep-timer-pill').forEach(pill => {
      const mins = Number(pill.dataset.minutes) || 0;
      pill.classList.toggle('active', state.sleepTimerMinutes === mins);
    });

    document.querySelectorAll('.voice-speed-pill').forEach(pill => {
      const spd = parseFloat(pill.dataset.speed);
      pill.classList.toggle('active', Math.abs(state.playbackSpeed - spd) < 0.01);
    });

    const serverInput = document.getElementById('voice-custom-server-input');
    if (serverInput && document.activeElement !== serverInput) {
      serverInput.value = state.customServerUrl;
    }
  }

  function openVoiceModal() {
    const modal = document.getElementById('voice-selector-modal');
    if (!modal) return;
    updateVoiceModalUI();
    modal.classList.add('show');
  }

  function closeVoiceModal() {
    if (previewAudioRef) {
      try {
        previewAudioRef.pause();
        previewAudioRef.src = '';
      } catch (e) {}
      previewAudioRef = null;
      state.previewingVoiceId = null;
    }
    const modal = document.getElementById('voice-selector-modal');
    if (modal) modal.classList.remove('show');
  }

  function bindEvents(opts = {}) {
    if (opts.onChapterAdvance) {
      onChapterAdvanceCallback = opts.onChapterAdvance;
    }

    const btnVoiceSelect = document.getElementById('btn-theory-voice-select');
    if (btnVoiceSelect) {
      btnVoiceSelect.addEventListener('click', openVoiceModal);
    }

    const btnCloseVoiceModal = document.getElementById('btn-close-voice-modal');
    if (btnCloseVoiceModal) {
      btnCloseVoiceModal.addEventListener('click', closeVoiceModal);
    }

    const voiceModalOverlay = document.getElementById('voice-selector-modal');
    if (voiceModalOverlay) {
      voiceModalOverlay.addEventListener('click', (e) => {
        if (e.target === voiceModalOverlay) closeVoiceModal();
      });
    }

    const btnPause = document.getElementById('btn-voice-bar-pause');
    if (btnPause) btnPause.addEventListener('click', togglePause);

    const btnPrev = document.getElementById('btn-voice-bar-prev');
    if (btnPrev) btnPrev.addEventListener('click', () => skipChunk(-1));

    const btnNext = document.getElementById('btn-voice-bar-next');
    if (btnNext) btnNext.addEventListener('click', () => skipChunk(1));

    const btnStop = document.getElementById('btn-voice-bar-stop');
    if (btnStop) btnStop.addEventListener('click', stopSpeaking);

    const btnOpenModalFromBar = document.getElementById('btn-voice-bar-settings');
    if (btnOpenModalFromBar) btnOpenModalFromBar.addEventListener('click', openVoiceModal);

    const btnAutoNextBar = document.getElementById('btn-voice-bar-autonext');
    if (btnAutoNextBar) {
      btnAutoNextBar.addEventListener('click', () => setAutoNextChapter(!state.autoNextChapter));
    }

    const voiceQuickSelect = document.getElementById('voice-bar-voice-select');
    if (voiceQuickSelect) {
      voiceQuickSelect.addEventListener('change', (e) => setPrimaryVoice(e.target.value));
    }

    const speedSelect = document.getElementById('voice-bar-speed-select');
    if (speedSelect) {
      speedSelect.addEventListener('change', (e) => setPlaybackSpeed(parseFloat(e.target.value)));
    }

    const progressTrack = document.getElementById('voice-bar-progress-track');
    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        if (!state.chunks.length) return;
        const rect = progressTrack.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        jumpToChunk(Math.floor(ratio * state.chunks.length));
      });
    }

    const chkDual = document.getElementById('chk-voice-dual-mode');
    if (chkDual) {
      chkDual.addEventListener('change', (e) => setDualVoiceMode(e.target.checked));
    }

    const chkAutoNext = document.getElementById('chk-voice-auto-next');
    if (chkAutoNext) {
      chkAutoNext.addEventListener('change', (e) => setAutoNextChapter(e.target.checked));
    }

    const chkSkipCode = document.getElementById('chk-voice-skip-code');
    if (chkSkipCode) {
      chkSkipCode.addEventListener('change', (e) => setSkipCodeInSleep(e.target.checked));
    }

    document.querySelectorAll('.sleep-timer-pill').forEach(pill => {
      pill.addEventListener('click', () => setSleepTimer(Number(pill.dataset.minutes) || 0));
    });

    document.querySelectorAll('.voice-speed-pill').forEach(pill => {
      pill.addEventListener('click', () => setPlaybackSpeed(parseFloat(pill.dataset.speed)));
    });

    const serverInput = document.getElementById('voice-custom-server-input');
    if (serverInput) {
      serverInput.addEventListener('change', (e) => setCustomServerUrl(e.target.value));
      serverInput.addEventListener('blur', (e) => setCustomServerUrl(e.target.value));
    }

    updateUI();
  }

  root.VoiceNarrator = {
    CLONED_VOICES,
    state,
    speakText,
    speakFromTheoryDom,
    stopSpeaking,
    togglePause,
    skipChunk,
    openVoiceModal,
    closeVoiceModal,
    bindEvents,
    updateUI
  };
})(typeof window !== 'undefined' ? window : globalThis);
