/* ============================================
   MindLoom – Rise Above the Weight Within
   Core JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initFloatingParticles();
  initFadeInObserver();
  initMoodTracker();
  initHabitTracker();
  initBreathingExercise();
  initRelaxPage();
  initChatbase();
});

/* ==========================================
   NAVIGATION
   ========================================== */
function initNavigation() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const overlay = document.querySelector('.nav-overlay');
  const navbar = document.querySelector('.navbar');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      if (overlay) overlay.classList.toggle('show');
    });
    if (overlay) {
      overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        overlay.classList.remove('show');
      });
    }
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        if (overlay) overlay.classList.remove('show');
      });
    });
  }

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
    });
  }

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ==========================================
   FLOATING PARTICLES
   ========================================== */
function initFloatingParticles() {
  const heroBg = document.querySelector('.hero-bg');
  if (!heroBg) return;

  const colors = [
    'rgba(124,140,248,0.25)', 'rgba(180,140,222,0.25)',
    'rgba(212,184,240,0.2)', 'rgba(168,216,240,0.2)',
    'rgba(184,232,208,0.2)', 'rgba(240,200,216,0.18)'
  ];

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size = Math.random() * 60 + 20;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animation = `floatUp ${Math.random() * 12 + 10}s linear ${Math.random() * 10}s infinite`;
    heroBg.appendChild(p);
  }
}

/* ==========================================
   FADE-IN ON SCROLL
   ========================================== */
function initFadeInObserver() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  elements.forEach(el => observer.observe(el));
}

/* ==========================================
   MOOD TRACKER
   ========================================== */
function initMoodTracker() {
  const moodContainer = document.getElementById('mood-selector');
  if (!moodContainer) return;

  const moods = [
    { emoji: '😄', label: 'Happy', color: '#ffd93d' },
    { emoji: '😐', label: 'Neutral', color: '#a8d8ea' },
    { emoji: '😔', label: 'Sad', color: '#6c88c4' },
    { emoji: '😡', label: 'Angry', color: '#ff6b6b' },
    { emoji: '😰', label: 'Anxious', color: '#c9b1ff' },
    { emoji: '😌', label: 'Calm', color: '#7ec8a0' }
  ];

  moods.forEach(mood => {
    const btn = document.createElement('button');
    btn.classList.add('mood-btn');
    btn.innerHTML = `<span class="emoji">${mood.emoji}</span><span class="label">${mood.label}</span>`;
    btn.addEventListener('click', (event) => saveMood(mood, event));
    moodContainer.appendChild(btn);
  });

  function saveMood(mood, event) {
    const history = JSON.parse(localStorage.getItem('mindloom_moods') || '[]');
    const entry = {
      emoji: mood.emoji,
      label: mood.label,
      color: mood.color,
      date: new Date().toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    };
    history.unshift(entry);
    if (history.length > 50) history.pop();
    localStorage.setItem('mindloom_moods', JSON.stringify(history));

    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
    if (event) event.currentTarget.classList.add('selected');

    renderMoodHistory();
    renderMoodChart();
  }

  function renderMoodHistory() {
    const container = document.getElementById('mood-history');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem('mindloom_moods') || '[]');

    if (history.length === 0) {
      container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">No moods logged yet. Select a mood above to get started!</p>';
      return;
    }

    container.innerHTML = history.slice(0, 15).map(entry => `
      <div class="mood-entry">
        <span class="date">${entry.date}</span>
        <span class="mood-emoji">${entry.emoji}</span>
        <span class="mood-label">${entry.label}</span>
      </div>
    `).join('');
  }

  function renderMoodChart() {
    const container = document.getElementById('mood-chart');
    if (!container) return;
    const history = JSON.parse(localStorage.getItem('mindloom_moods') || '[]');
    if (history.length === 0) { container.innerHTML = ''; return; }

    const counts = {};
    const colors = {};
    history.forEach(e => {
      counts[e.label] = (counts[e.label] || 0) + 1;
      colors[e.label] = e.color;
    });
    const max = Math.max(...Object.values(counts));

    container.innerHTML = '<h3 style="font-family:var(--font-display);margin-bottom:1rem;">Mood Distribution</h3>' +
      Object.entries(counts).map(([label, count]) => `
        <div class="mood-bar-row">
          <span class="mood-bar-label">${label}</span>
          <div class="mood-bar-track">
            <div class="mood-bar-fill" style="width:${(count/max)*100}%;background:${colors[label]}"></div>
          </div>
          <span class="mood-bar-count">${count}</span>
        </div>
      `).join('');
  }

  renderMoodHistory();
  renderMoodChart();
}

/* ==========================================
   HABIT TRACKER
   ========================================== */
function initHabitTracker() {
  const addBtn = document.getElementById('add-habit-btn');
  const input = document.getElementById('habit-input');
  if (!addBtn || !input) return;

  addBtn.addEventListener('click', () => addHabit());
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addHabit(); });

  function getHabits() {
    return JSON.parse(localStorage.getItem('mindloom_habits') || '[]');
  }
  function saveHabits(habits) {
    localStorage.setItem('mindloom_habits', JSON.stringify(habits));
  }

  function addHabit() {
    const name = input.value.trim();
    if (!name) return;
    const habits = getHabits();
    habits.push({
      id: Date.now(),
      name: name,
      completed: false,
      streak: 0,
      lastCompleted: null
    });
    saveHabits(habits);
    input.value = '';
    renderHabits();
  }

  function toggleHabit(id) {
    const habits = getHabits();
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const today = new Date().toDateString();
    if (!habit.completed) {
      habit.completed = true;
      if (habit.lastCompleted !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (habit.lastCompleted === yesterday.toDateString()) {
          habit.streak += 1;
        } else {
          habit.streak = 1;
        }
        habit.lastCompleted = today;
      }
    } else {
      habit.completed = false;
    }
    saveHabits(habits);
    renderHabits();
  }

  function deleteHabit(id) {
    const habits = getHabits().filter(h => h.id !== id);
    saveHabits(habits);
    renderHabits();
  }

  function renderHabits() {
    const list = document.getElementById('habit-list');
    if (!list) return;
    const habits = getHabits();

    if (habits.length === 0) {
      list.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">No habits yet. Add one above to start building positive routines!</p>';
      return;
    }

    list.innerHTML = habits.map(h => `
      <div class="habit-item ${h.completed ? 'completed' : ''}">
        <div class="habit-checkbox ${h.completed ? 'checked' : ''}" data-id="${h.id}"></div>
        <span class="habit-name">${escapeHtml(h.name)}</span>
        <span class="habit-streak">🔥 ${h.streak} day${h.streak !== 1 ? 's' : ''}</span>
        <button class="habit-delete" data-id="${h.id}">✕</button>
      </div>
    `).join('');

    list.querySelectorAll('.habit-checkbox').forEach(cb => {
      cb.addEventListener('click', () => toggleHabit(Number(cb.dataset.id)));
    });
    list.querySelectorAll('.habit-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteHabit(Number(btn.dataset.id)));
    });
  }

  renderHabits();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ==========================================
   BREATHING EXERCISE
   ========================================== */
function initBreathingExercise() {
  const circle = document.getElementById('breathing-circle');
  const guide = document.getElementById('breathing-guide');
  const startBtn = document.getElementById('breathing-start');
  const timerDisplay = document.getElementById('breathing-timer');
  if (!circle || !guide || !startBtn) return;

  let isRunning = false;
  let breathInterval = null;
  let countdownInterval = null;
  let selectedDuration = 60; 

  document.querySelectorAll('.timer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.timer-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = Number(btn.dataset.duration);
    });
  });

  startBtn.addEventListener('click', () => {
    if (isRunning) {
      stopBreathing();
    } else {
      startBreathing();
    }
  });

  function startBreathing() {
    isRunning = true;
    startBtn.textContent = 'Stop';
    startBtn.classList.remove('btn-primary');
    startBtn.classList.add('btn-outline');

    let remaining = selectedDuration;
    updateTimerDisplay(remaining);

    countdownInterval = setInterval(() => {
      remaining--;
      updateTimerDisplay(remaining);
      if (remaining <= 0) stopBreathing();
    }, 1000);

    breathCycle();
  }

  function breathCycle() {
    if (!isRunning) return;

    circle.className = 'breathing-circle inhale';
    guide.textContent = 'Inhale…';

    setTimeout(() => {
      if (!isRunning) return;
      circle.className = 'breathing-circle hold';
      guide.textContent = 'Hold…';

      setTimeout(() => {
        if (!isRunning) return;
        circle.className = 'breathing-circle exhale';
        guide.textContent = 'Exhale…';

        setTimeout(() => {
          if (isRunning) breathCycle();
        }, 4000);
      }, 4000);
    }, 4000);
  }

  function stopBreathing() {
    isRunning = false;
    clearInterval(countdownInterval);
    circle.className = 'breathing-circle';
    guide.textContent = 'Press start to begin';
    startBtn.textContent = 'Start';
    startBtn.classList.add('btn-primary');
    startBtn.classList.remove('btn-outline');
    if (timerDisplay) timerDisplay.textContent = '';
  }

  function updateTimerDisplay(seconds) {
    if (!timerDisplay) return;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    timerDisplay.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }
}

/* ==========================================
   RELAX PAGE
   ========================================== */
function initRelaxPage() {
  const relaxWrapper = document.querySelector('.relax-wrapper');
  if (!relaxWrapper) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.classList.add('relax-particle');
    const size = Math.random() * 10 + 4;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.animation = `floatUp ${Math.random() * 15 + 8}s linear ${Math.random() * 8}s infinite`;
    relaxWrapper.appendChild(p);
  }

  const musicBtn = document.getElementById('music-toggle');
  if (musicBtn) {
    let isPlaying = false;
    let audioCtx = null;
    let oscillator = null;
    let gainNode = null;

    musicBtn.addEventListener('click', () => {
      if (!isPlaying) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        oscillator = audioCtx.createOscillator();
        gainNode = audioCtx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(174, audioCtx.currentTime); 
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.start();
        isPlaying = true;
        musicBtn.textContent = '🔇 Pause Sound';
      } else {
        if (oscillator) oscillator.stop();
        if (audioCtx) audioCtx.close();
        isPlaying = false;
        musicBtn.textContent = '🔊 Play Ambient Sound';
      }
    });
  }

  const messages = [
    'Let your thoughts float away…',
    'You are lighter than your worries…',
    'Breathe in peace, exhale tension…',
    'This moment is yours. Be still…',
    'You are safe. You are enough…'
  ];
  const msgEl = document.getElementById('relax-message');
  if (msgEl) {
    let idx = 0;
    setInterval(() => {
      idx = (idx + 1) % messages.length;
      msgEl.style.opacity = '0';
      setTimeout(() => {
        msgEl.textContent = messages[idx];
        msgEl.style.opacity = '1';
      }, 600);
    }, 6000);
    msgEl.style.transition = 'opacity 0.6s ease';
  }
}

/* ==========================================
   CHATBASE AI INTEGRATION
   ========================================== */
function initChatbase() {
  window.embeddedChatbotConfig = {
    chatbotId: "FSogqUnMcqKzx8Ijge5h-",
    domain: "www.chatbase.co"
  };
  
  const script = document.createElement('script');
  script.src = "https://www.chatbase.co/embed.min.js";
  script.setAttribute('chatbotId', "FSogqUnMcqKzx8Ijge5h-");
  script.setAttribute('domain', "www.chatbase.co");
  script.defer = true;
  document.head.appendChild(script);
}
