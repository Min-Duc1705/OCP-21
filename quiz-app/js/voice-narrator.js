// ==========================================================================
// OCP 21 Study Guide - AI Cloned Voice Narrator & Sleep Podcast Engine
// Ported from drive-video-player (4 Curated Cloned Voices + Sleep Mode)
// ==========================================================================

(function(root) {
  'use strict';

  // ONLY the 4 Cloned Voices as requested
  const CLONED_VOICES = [
    {
      id: 'cloned_microservices_female',
      name: 'Nữ Thuyết Minh Hệ Thống (Cloned)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: '🔥 Giọng Mẫu Clone AI',
      desc: 'Giọng thuyết minh công nghệ cuốn hút, rõ chữ, clone từ video Microservices',
      sampleUrl: 'assets/cloned_voices/microservices_female.wav',
      sampleText: 'Để ngăn chuyện này, các nền tảng lớn dùng kiến trúc microservices. Khi hàng trăm người ồ ạt nộp hồ sơ, hệ thống vẫn xử lý mượt mà.'
    },
    {
      id: 'cloned_jobhub_female',
      name: 'Nữ Thuyết Minh JobHub AI (Cloned)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: '🔥 Giọng Mẫu Clone AI',
      desc: 'Giọng nữ thuyết minh công nghệ JobHub AI & Microservices êm dịu, dễ nghe khi ngủ',
      sampleUrl: 'assets/cloned_voices/jobhub_female.wav',
      sampleText: 'Lấy ví dụ trên Job Hub, một nền tảng tuyển dụng bằng AI. Khi một tập đoàn lớn mở đợt tuyển dụng, có hàng chục nghìn ứng viên cùng nộp CV.'
    },
    {
      id: 'cloned_angular_male',
      name: 'Nam Đối Thoại Angular (Cloned)',
      gender: 'Nam',
      accent: 'Miền Nam',
      tag: '🎙️ Giọng Nam Podcast AI',
      desc: 'Giọng nam podcast NotebookLM trầm ấm, phong thái thảo luận kỹ thuật tự nhiên',
      sampleUrl: 'assets/cloned_voices/angular_male.wav',
      sampleText: 'Chào mừng mọi người quay trở lại với cuộc trò chuyện chuyên sâu ngày hôm nay. Hôm nay chúng ta cùng ôn tập kiến thức Java OCP 21.'
    },
    {
      id: 'cloned_angular_female',
      name: 'Nữ Đối Thoại Angular (Cloned)',
      gender: 'Nữ',
      accent: 'Miền Nam',
      tag: '🎙️ Giọng Nữ Podcast AI',
      desc: 'Giọng nữ podcast NotebookLM hoạt ngôn, biểu cảm đối đáp sinh động',
      sampleUrl: 'assets/cloned_voices/angular_female.wav',
      sampleText: 'Chắc chắn rồi, không phải là một cuốn sách giáo khoa dày cộp hay tài liệu khô khan, chúng ta sẽ nắm chắc các bẫy thi quan trọng nhất.'
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

  // State
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
    chunks: [],
    currentChunkIdx: 0,
    activeTitle: '',
    activeSpeakerVoice: DEFAULT_PRIMARY_VOICE,
    engineMode: 'cloned', // 'cloned' | 'fallback'
    previewingVoiceId: null
  };

  let audioRef = null;
  let previewAudioRef = null;
  let sessionCounter = 0;
  let sleepIntervalId = null;
  let onChapterAdvanceCallback = null;
  const audioBlobCache = new Map();

  function cleanMarkdownForSpeech(rawText, skipCode = state.skipCodeInSleep) {
    if (!rawText) return '';
    return String(rawText)
      .replace(/```[\s\S]*?```/g, (block) => {
        if (skipCode) return ' . ';
        const code = block.replace(/```\w*\n?/g, '').replace(/```/g, '').trim();
        if (code.length > 260) return ' (Xem đoạn mã ví dụ trong bài). ';
        return ' Ví dụ mã: ' + code.replace(/[{}();=<>]/g, ' ') + '. ';
      })
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
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      .replace(/__([^_]+)__/g, '$1')
      .replace(/~~([^~]+)~~/g, '$1')
      .replace(/^>\s*/gm, '')
      .replace(/^[-*_]{3,}\s*$/gm, '')
      .replace(/\|/g, ', ')
      .replace(/[-:]{3,}/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function splitTextIntoSpeechChunks(text, maxLen = 220) {
    const cleaned = cleanMarkdownForSpeech(text);
    if (!cleaned) return [];

    const rawSentences = cleaned
      .split(/(?<=[.!?。\n])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    const chunks = [];
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
              if (current) chunks.push(current);
              current = part.slice(0, maxLen);
            }
          }
        }
      } else if ((current + ' ' + sentence).length <= maxLen) {
        current = `${current} ${sentence}`;
      } else {
        chunks.push(current);
        current = sentence.slice(0, maxLen);
      }
    }

    if (current) chunks.push(current);
    return chunks.filter(c => c.length > 1);
  }

  function getVoiceMeta(voiceId) {
    return CLONED_VOICES.find(v => v.id === voiceId) || CLONED_VOICES[0];
  }

  function getVoiceForChunk(idx) {
    if (!state.dualVoiceMode) return state.primaryVoice;
    return idx % 2 === 0 ? state.primaryVoice : state.secondaryVoice;
  }

  // Synthesize speech via Cloned AI Backend (Port 45678 or Port 8000 or Custom LAN URL)
  async function fetchClonedSpeechBlob(text, voiceId, speed) {
    const validVoice = CLONED_VOICES.some(v => v.id === voiceId) ? voiceId : DEFAULT_PRIMARY_VOICE;
    const cacheKey = `${validVoice}_${speed}_${text}`;
    if (audioBlobCache.has(cacheKey)) {
      return audioBlobCache.get(cacheKey);
    }

    const endpoints = [];
    if (state.customServerUrl && state.customServerUrl.trim()) {
      const base = state.customServerUrl.trim().replace(/\/+$/, '');
      if (base.includes('/tts')) {
        endpoints.push({ type: 'get', url: `${base}?text=${encodeURIComponent(text)}&lang=vi&voice=${encodeURIComponent(validVoice)}&speed=${encodeURIComponent(speed)}` });
      } else {
        endpoints.push({
          type: 'post',
          url: base.endsWith('/v1/audio/speech') ? base : `${base}/v1/audio/speech`,
          body: { model: 'tts-1', input: text, voice: validVoice, speed: speed }
        });
      }
    }

    // 1. Drive Video Player local server (port 45678)
    endpoints.push({
      type: 'get',
      url: `http://127.0.0.1:45678/tts?text=${encodeURIComponent(text)}&lang=vi&voice=${encodeURIComponent(validVoice)}&speed=${encodeURIComponent(speed)}`
    });

    // 2. Direct VieNeu Cloned TTS FastAPI server (port 8000)
    endpoints.push({
      type: 'post',
      url: 'http://127.0.0.1:8000/v1/audio/speech',
      body: { model: 'tts-1', input: text, voice: validVoice, speed: speed }
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
            if (audioBlobCache.size > 80) {
              const firstKey = audioBlobCache.keys().next().value;
              const oldUrl = audioBlobCache.get(firstKey);
              if (oldUrl) URL.revokeObjectURL(oldUrl);
              audioBlobCache.delete(firstKey);
            }
            const objUrl = URL.createObjectURL(blob);
            audioBlobCache.set(cacheKey, objUrl);
            state.engineMode = 'cloned';
            return objUrl;
          }
        }
      } catch (e) {
        // Try next endpoint
      }
    }
    return null;
  }

  function prefetchChunk(idx) {
    if (idx < 0 || idx >= state.chunks.length) return;
    const text = state.chunks[idx];
    const voice = getVoiceForChunk(idx);
    fetchClonedSpeechBlob(text, voice, state.playbackSpeed).catch(() => {});
  }

  function stopAudioInternal() {
    sessionCounter += 1;
    if (audioRef) {
      try {
        audioRef.pause();
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
    state.isPlaying = false;
    state.isPaused = false;
    state.isLoadingAudio = false;
    updateUI();
  }

  function highlightActiveChunkInReader(chunkText) {
    const bodyEl = document.getElementById('theory-content-body');
    if (!bodyEl || !chunkText) return;
    bodyEl.querySelectorAll('.voice-reading-active').forEach(el => el.classList.remove('voice-reading-active'));

    const snippet = chunkText.slice(0, 42).trim().toLowerCase();
    if (snippet.length < 8) return;

    const blocks = bodyEl.querySelectorAll('p, li, h2, h3, h4, blockquote');
    for (const b of blocks) {
      if (b.textContent.toLowerCase().includes(snippet)) {
        b.classList.add('voice-reading-active');
        const container = document.getElementById('theory-reader-container');
        if (container) {
          const cRect = container.getBoundingClientRect();
          const bRect = b.getBoundingClientRect();
          if (bRect.top < cRect.top + 60 || bRect.bottom > cRect.bottom - 60) {
            b.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }
        break;
      }
    }
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

  async function playChunkAtIndex(idx, sessionId) {
    if (sessionId !== sessionCounter) return;

    if (idx >= state.chunks.length) {
      // Chapter finished! Check if Auto-Next Chapter (Sleep continuous listening) is enabled
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

    const chunkText = state.chunks[idx];
    const chosenVoice = getVoiceForChunk(idx);
    state.currentChunkIdx = idx;
    state.activeSpeakerVoice = chosenVoice;
    state.isLoadingAudio = true;
    updateUI();
    highlightActiveChunkInReader(chunkText);
    updateMediaSession();

    // Pre-fetch next chunk in background for gapless cloned playback
    prefetchChunk(idx + 1);

    const blobUrl = await fetchClonedSpeechBlob(chunkText, chosenVoice, state.playbackSpeed);
    if (sessionId !== sessionCounter) return;

    if (blobUrl) {
      try {
        if (audioRef) {
          audioRef.pause();
          audioRef.onended = null;
          audioRef.onerror = null;
        }
        const audio = new Audio(blobUrl);
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
        state.isLoadingAudio = false;
        updateUI();
        return;
      } catch (err) {
        if (sessionId !== sessionCounter) return;
      }
    }

    // Fallback if local cloned voice server is offline
    playFallbackBrowserSpeech(chunkText, idx, sessionId, chosenVoice);
  }

  function playFallbackBrowserSpeech(chunkText, idx, sessionId, chosenVoice) {
    if (sessionId !== sessionCounter) return;
    state.engineMode = 'fallback';
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
      const voiceMeta = getVoiceMeta(chosenVoice);
      if (voiceMeta && voiceMeta.gender === 'Nam') {
        utter.pitch = 0.88;
      } else {
        utter.pitch = 1.05;
      }

      const voices = root.speechSynthesis.getVoices() || [];
      const viVoices = voices.filter(v => v.lang && v.lang.toLowerCase().includes('vi'));
      if (viVoices.length > 0) {
        utter.voice = viVoices[idx % viVoices.length];
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

  function speakText(rawMarkdownText, title = 'Lý thuyết chương') {
    stopAudioInternal();
    const newChunks = splitTextIntoSpeechChunks(rawMarkdownText);
    if (newChunks.length === 0) return;

    const currentSession = sessionCounter;
    state.chunks = newChunks;
    state.activeTitle = title;
    state.currentChunkIdx = 0;
    state.isPlaying = true;
    state.isPaused = false;
    updateUI();

    playChunkAtIndex(0, currentSession);
  }

  function togglePause() {
    if (!state.isPlaying) return;
    if (state.isPaused) {
      state.isPaused = false;
      if (audioRef) {
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
    stopAudioInternal();
    state.isPlaying = true;
    state.isPaused = false;
    playChunkAtIndex(nextIdx, sessionCounter);
  }

  function jumpToChunk(idx) {
    if (!state.isPlaying || idx < 0 || idx >= state.chunks.length) return;
    stopAudioInternal();
    state.isPlaying = true;
    state.isPaused = false;
    playChunkAtIndex(idx, sessionCounter);
  }

  // Play reference sample .wav directly or via TTS backend
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
    if (!CLONED_VOICES.some(v => v.id === voiceId)) return;
    state.primaryVoice = voiceId;
    try { localStorage.setItem(STORAGE_KEYS.primaryVoice, voiceId); } catch (e) {}
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
    updateUI();
    updateVoiceModalUI();
  }

  function setDualVoiceMode(enabled) {
    state.dualVoiceMode = Boolean(enabled);
    try { localStorage.setItem(STORAGE_KEYS.dualMode, String(state.dualVoiceMode)); } catch (e) {}
    updateUI();
    updateVoiceModalUI();
  }

  function setPlaybackSpeed(speed) {
    const num = Math.max(0.75, Math.min(2.0, Number(speed) || 1.0));
    state.playbackSpeed = num;
    try { localStorage.setItem(STORAGE_KEYS.speed, String(num)); } catch (e) {}
    if (state.isPlaying && !state.isPaused) {
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

  // UI Updates for Top Buttons & Audio Control Bar
  function updateUI() {
    const primaryMeta = getVoiceMeta(state.primaryVoice);
    const secondaryMeta = getVoiceMeta(state.secondaryVoice);
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
      const shortName = primaryMeta.name.replace(' (Cloned)', '');
      btnVoiceSelect.innerHTML = `🎙️ <span class="hide-mobile">${state.dualVoiceMode ? 'Podcast 2 Giọng' : shortName}</span>`;
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
        ? `⏳ Đang tạo âm thanh AI (${activeMeta.name})...`
        : `${state.dualVoiceMode ? '🎭 Podcast 2 Giọng' : '🎙️ Giọng Clone AI'}: ${activeMeta.name}`;
    }

    const titleEl = document.getElementById('voice-bar-title');
    if (titleEl) titleEl.textContent = state.activeTitle || 'Đang đọc lý thuyết';

    const chunkCounterEl = document.getElementById('voice-bar-counter');
    if (chunkCounterEl) {
      chunkCounterEl.textContent = `Đoạn ${state.currentChunkIdx + 1} / ${state.chunks.length}`;
    }

    const snippetEl = document.getElementById('voice-bar-snippet');
    if (snippetEl) {
      snippetEl.textContent = `"${state.chunks[state.currentChunkIdx] || ''}"`;
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
        card.className = `cloned-voice-card ${isPrimary ? 'selected-primary' : ''} ${isSecondary ? 'selected-secondary' : ''}`;
        card.innerHTML = `
          <div class="cloned-voice-card-top">
            <div class="cloned-voice-avatar ${v.gender === 'Nam' ? 'male' : 'female'}">
              ${v.gender === 'Nam' ? '👨‍💻' : '👩‍💼'}
            </div>
            <div class="cloned-voice-info">
              <div class="cloned-voice-name-row">
                <strong>${v.name}</strong>
                ${isPrimary ? '<span class="voice-role-badge primary">Giọng chính</span>' : ''}
                ${isSecondary ? '<span class="voice-role-badge secondary">Giọng phụ #2</span>' : ''}
              </div>
              <div class="cloned-voice-badges">
                <span class="voice-meta-pill">${v.tag}</span>
                <span class="voice-meta-pill">${v.gender} · ${v.accent}</span>
              </div>
            </div>
          </div>
          <p class="cloned-voice-desc">${v.desc}</p>
          <div class="cloned-voice-actions">
            <button type="button" class="btn btn-sm ${isPreviewing ? 'btn-danger' : 'btn-secondary'} btn-preview-voice" data-voice="${v.id}">
              ${isPreviewing ? '⏹ Dừng nghe thử' : '🔊 Nghe thử mẫu giọng'}
            </button>
            <button type="button" class="btn btn-sm ${isPrimary ? 'btn-primary' : 'btn-secondary'} btn-pick-primary" data-voice="${v.id}">
              ${isPrimary ? '✓ Đang dùng chính' : 'Chọn làm giọng chính'}
            </button>
            ${state.dualVoiceMode ? `
              <button type="button" class="btn btn-sm ${isSecondary ? 'btn-primary' : 'btn-secondary'} btn-pick-secondary" data-voice="${v.id}">
                ${isSecondary ? '✓ Giọng #2' : 'Chọn làm giọng #2'}
              </button>
            ` : ''}
          </div>
        `;
        listEl.appendChild(card);
      });

      listEl.querySelectorAll('.btn-preview-voice').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          previewClonedVoice(btn.dataset.voice);
        });
      });

      listEl.querySelectorAll('.btn-pick-primary').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPrimaryVoice(btn.dataset.voice);
        });
      });

      listEl.querySelectorAll('.btn-pick-secondary').forEach(btn => {
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

    // Control bar events
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

    // Modal checkboxes & pills
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
    stopSpeaking,
    togglePause,
    skipChunk,
    openVoiceModal,
    closeVoiceModal,
    bindEvents,
    updateUI
  };
})(typeof window !== 'undefined' ? window : globalThis);
