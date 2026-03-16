/* ============================================================
   APP.JS – Interaktive Bildreise Nachkriegszeit
   Vanilla JavaScript SPA – kein Framework benötigt
   Läuft direkt im Browser, GitHub-Pages-tauglich
   ============================================================ */

'use strict';

/* ============================================================
   KONSTANTEN & KONFIGURATION
   ============================================================ */
const STORAGE_KEY = 'bildreise_nachkrieg_v1';
const SECTIONS = ['start', 'checkin', 's1', 's2', 's3', 's4', 's5', 's6', 'checkout', 'done'];
const SECTION_LABELS = {
  start:    'Start',
  checkin:  'Check-in',
  s1:       'Station 1',
  s2:       'Station 2',
  s3:       'Station 3',
  s4:       'Station 4',
  s5:       'Station 5',
  s6:       'Station 6',
  checkout: 'Check-out',
  done:     'Fertig'
};

/* -- Hotspot-Typ-Label & Badge ----------------------------- */
const TYPE_LABELS = {
  info:       'Information',
  task:       'Aufgabe',
  reflection: 'Reflexion',
  source:     'Extra-Info'
};
const TYPE_ICONS = {
  info:       'i',
  task:       '!',
  reflection: '?',
  source:     '+'
};

/* -- Aktuell aktiver Hotspot für Modal-Notizen ------------- */
let activeHotspotId = null;

/* ============================================================
   STATE MANAGEMENT (localStorage)
   ============================================================ */
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupt data */ }
  return {
    currentSection:   'start',
    openedHotspots:   {},
    answers:          {},
    checkInAnswers:   {},
    checkOutAnswers:  {},
    ddAnswers:        {},
    timelineOrders:   {},
    tfAnswers:        {},
    selfAssessment:   {},
    notes:            {}
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) { /* storage full */ }
}

let state = loadState();

/* ============================================================
   NAVIGATION
   ============================================================ */
function goTo(sectionId) {
  if (!SECTIONS.includes(sectionId)) return;
  state.currentSection = sectionId;
  saveState();
  renderSection(sectionId);
  updateProgressBar(sectionId);
  updateProgressSteps(sectionId);
  updateStationIndicator(sectionId);
  const main = document.getElementById('main-content');
  if (main) { main.focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
}

function goNext() {
  const idx = SECTIONS.indexOf(state.currentSection);
  if (idx < SECTIONS.length - 1) goTo(SECTIONS[idx + 1]);
}

function goPrev() {
  const idx = SECTIONS.indexOf(state.currentSection);
  if (idx > 0) goTo(SECTIONS[idx - 1]);
}

/* ============================================================
   PROGRESS BAR & STEP DOTS
   ============================================================ */
function updateProgressBar(sectionId) {
  const idx = SECTIONS.indexOf(sectionId);
  const pct = Math.round((idx / (SECTIONS.length - 1)) * 100);
  const bar = document.getElementById('progress-bar');
  const container = document.getElementById('progress-container');
  if (bar) bar.style.width = pct + '%';
  if (container) container.setAttribute('aria-valuenow', pct);
}

function updateProgressSteps(activeSectionId) {
  const nav = document.getElementById('progress-steps');
  if (!nav) return;
  nav.innerHTML = '';
  SECTIONS.forEach(function(sec) {
    const idx = SECTIONS.indexOf(sec);
    const activeIdx = SECTIONS.indexOf(activeSectionId);
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    if (idx < activeIdx) dot.classList.add('done');
    if (sec === activeSectionId) dot.classList.add('active');

    const lbl = document.createElement('span');
    lbl.className = 'progress-dot-label';
    lbl.textContent = SECTION_LABELS[sec] || sec;
    dot.appendChild(lbl);
    dot.setAttribute('title', SECTION_LABELS[sec] || sec);
    nav.appendChild(dot);
  });
}

function updateStationIndicator(sectionId) {
  const el = document.getElementById('station-indicator');
  if (!el) return;
  el.textContent = SECTION_LABELS[sectionId] || '';
}

/* ============================================================
   MAIN RENDER DISPATCHER
   ============================================================ */
function renderSection(sectionId) {
  const main = document.getElementById('main-content');
  if (!main) return;

  if (sectionId === 'start') {
    main.innerHTML = renderStart();
  } else if (sectionId === 'checkin') {
    main.innerHTML = renderCheckIn();
  } else if (sectionId === 'checkout') {
    main.innerHTML = renderCheckOut();
  } else if (sectionId === 'done') {
    main.innerHTML = renderDone();
  } else {
    const stationIdx = parseInt(sectionId.replace('s', ''), 10) - 1;
    if (stationIdx >= 0 && stationIdx < STATIONS.length) {
      main.innerHTML = renderStation(STATIONS[stationIdx], sectionId);
    }
  }

  restoreAnswers(sectionId);
  attachTextareaListeners();
}

/* ============================================================
   RENDER: STARTSEITE
   ============================================================ */
function renderStart() {
  const goals = START_PAGE.learningGoals.map(function(g) {
    return '<li>' + escHtml(g) + '</li>';
  }).join('');

  return [
    '<section class="start-page">',
    '  <div class="start-hero">',
    '    <div class="start-hero-content">',
    '      <h1>' + escHtml(START_PAGE.title) + '</h1>',
    '      <p class="subtitle">' + escHtml(START_PAGE.subtitle) + '</p>',
    '      <p class="intro-text">' + escHtml(START_PAGE.intro) + '</p>',
    '      <button class="btn btn-primary btn-lg" onclick="goTo(\'checkin\')">Los geht\'s &#8594;</button>',
    '    </div>',
    '  </div>',
    '  <div class="learning-goals">',
    '    <h2>Das lernst du auf dieser Bildreise</h2>',
    '    <ul>' + goals + '</ul>',
    '  </div>',
    '  <div class="journey-hint">',
    '    <strong>&#128252; Wie funktioniert die Bildreise?</strong><br>',
    escHtml(START_PAGE.journeyHint),
    '  </div>',
    '  <div class="text-center mt-3">',
    '    <button class="btn btn-primary btn-lg" onclick="goTo(\'checkin\')">Bildreise starten &#8594;</button>',
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ============================================================
   RENDER: CHECK-IN
   ============================================================ */
function renderCheckIn() {
  const stmts = CHECK_IN.statements.map(function(s) {
    const saved = state.checkInAnswers[s.id] || '';
    const fbHtml = saved
      ? buildCheckInFeedback(s, saved)
      : '<div id="ci-fb-' + s.id + '" class="checkin-feedback" aria-live="polite"></div>';

    const btns = CHECK_IN.options.map(function(opt) {
      const sel = saved === opt ? ' selected' : '';
      return '<button class="checkin-btn' + sel + '" onclick="selectCheckin(\'' + s.id + '\', \'' + opt + '\')">' + escHtml(opt) + '</button>';
    }).join('');

    return [
      '<div class="checkin-statement">',
      '  <p>' + escHtml(s.text) + '</p>',
      '  <div class="checkin-options">' + btns + '</div>',
      '  ' + fbHtml,
      '</div>'
    ].join('\n');
  }).join('\n');

  const savedOpenAnswer = state.checkInAnswers['open'] || '';

  return [
    '<section class="checkin-page">',
    '  <div class="page-header">',
    '    <span class="section-label">Check-in</span>',
    '    <h1>' + escHtml(CHECK_IN.title) + '</h1>',
    '    <p>' + escHtml(CHECK_IN.instructions) + '</p>',
    '  </div>',
    stmts,
    '  <div class="card open-question-card mt-2">',
    '    <span class="task-badge badge-reflect">Einstiegsfrage</span>',
    '    <p class="task-prompt">' + escHtml(CHECK_IN.openPrompt) + '</p>',
    '    <textarea class="task-textarea" id="checkin-open" rows="4"',
    '      placeholder="Schreib hier deine Gedanken..."',
    '      oninput="saveCheckinOpen(this.value)">' + escHtml(savedOpenAnswer) + '</textarea>',
    '  </div>',
    '  <div class="nav-row">',
    '    <button class="btn btn-secondary" onclick="goTo(\'start\')">&#8592; Zurück</button>',
    '    <button class="btn btn-primary" onclick="goTo(\'s1\')">Zur ersten Station &#8594;</button>',
    '  </div>',
    '</section>'
  ].join('\n');
}

function buildCheckInFeedback(statement, selected) {
  const isCorrect = selected === statement.correct;
  const cls = isCorrect ? 'correct' : (selected === 'weiß ich nicht' ? '' : 'wrong');
  const show = cls ? '' : '';
  return '<div id="ci-fb-' + statement.id + '" class="checkin-feedback ' + cls + '" aria-live="polite">' +
    escHtml(statement.feedback) + '</div>';
}

function selectCheckin(stmtId, option) {
  state.checkInAnswers[stmtId] = option;
  saveState();

  // Update button selected state
  const allBtns = document.querySelectorAll('[onclick^="selectCheckin(\'' + stmtId + '\'"]');
  // Simpler: find statement container and update
  const stmt = CHECK_IN.statements.find(function(s) { return s.id === stmtId; });
  if (!stmt) return;

  // Re-render just the buttons + feedback via container
  const containers = document.querySelectorAll('.checkin-statement');
  let targetContainer = null;
  containers.forEach(function(c) {
    if (c.querySelector('[onclick*="' + stmtId + '"]')) targetContainer = c;
  });

  if (!targetContainer) return;

  // Update buttons
  const btns = targetContainer.querySelectorAll('.checkin-btn');
  btns.forEach(function(btn) {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === option) btn.classList.add('selected');
  });

  // Show feedback
  const fb = document.getElementById('ci-fb-' + stmtId);
  if (fb) {
    const isCorrect = option === stmt.correct;
    fb.className = 'checkin-feedback ' + (isCorrect ? 'correct' : 'wrong');
    fb.textContent = stmt.feedback;
  }
}

function saveCheckinOpen(val) {
  state.checkInAnswers['open'] = val;
  saveState();
  updateJournalContent();
}

/* ============================================================
   RENDER: STATION
   ============================================================ */
function renderStation(station, sectionId) {
  const stationNum = sectionId.replace('s', '');
  const totalStations = STATIONS.length;
  const imgFile = ASSETS[station.image] || '';
  const imgCaption = ASSET_CAPTIONS[station.image] || '';

  // Secondary image for station 4
  let secondaryImgHtml = '';
  if (station.secondaryImage) {
    const sf = ASSETS[station.secondaryImage] || '';
    const sc = ASSET_CAPTIONS[station.secondaryImage] || '';
    secondaryImgHtml = [
      '<div class="image-section mt-2">',
      '  <div class="station-image-wrap">',
      '    <img class="station-image" src="images/' + encodeURIComponent(sf) + '"',
      '      alt="Weiteres historisches Bild zu ' + escHtml(station.title) + '"',
      '      onerror="this.closest(\'.image-section\').style.display=\'none\'">',
      '    <div class="image-caption">' + escHtml(sc) + '</div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  const hotspotsHtml = station.hotspots.map(function(hs) {
    const openedClass = state.openedHotspots[hs.id] ? ' opened' : '';
    const xPct = (hs.position.x * 100).toFixed(1) + '%';
    const yPct = (hs.position.y * 100).toFixed(1) + '%';
    return [
      '<button class="hotspot-btn hotspot-' + hs.type + openedClass + '"',
      '  style="left:' + xPct + ';top:' + yPct + '"',
      '  aria-label="Hotspot: ' + escHtml(hs.label) + '"',
      '  title="' + escHtml(hs.label) + '"',
      '  onclick="openHotspot(\'' + station.id + '\', \'' + hs.id + '\')">' +
      escHtml(TYPE_ICONS[hs.type] || '?') +
      '</button>'
    ].join(' ');
  }).join('\n');

  const legendHtml = [
    '<div class="hotspot-legend" aria-label="Hotspot-Legende">',
    '  <span class="legend-item"><span class="legend-dot" style="background:#1565c0"></span>Information</span>',
    '  <span class="legend-item"><span class="legend-dot" style="background:#d4690a"></span>Aufgabe</span>',
    '  <span class="legend-item"><span class="legend-dot" style="background:#2e7d32"></span>Reflexion</span>',
    '  <span class="legend-item"><span class="legend-dot" style="background:#546e7a"></span>Extra-Info</span>',
    '</div>'
  ].join('\n');

  const requiredHtml = station.requiredTasks.map(function(t, i) {
    const saved = state.answers[t.id] || '';
    let inputHtml;

    if (t.format === 'sentenceStarter' && t.starter) {
      inputHtml = '<div class="sentence-starter">' + escHtml(t.starter) + '</div>' +
        '<textarea class="task-textarea" id="ans-' + t.id + '" rows="4"' +
        ' placeholder="Fortsetzung schreiben..."' +
        ' oninput="saveAnswer(\'' + t.id + '\', this.value)">' + escHtml(saved) + '</textarea>';
    } else {
      inputHtml = '<textarea class="task-textarea" id="ans-' + t.id + '" rows="4"' +
        ' placeholder="Schreib hier deine Antwort..."' +
        ' oninput="saveAnswer(\'' + t.id + '\', this.value)">' + escHtml(saved) + '</textarea>';
    }

    return [
      '<div class="task-card task-pflicht">',
      '  <span class="task-badge badge-pflicht">Pflichtaufgabe</span>',
      '  <p class="task-prompt">' + escHtml(t.prompt || '') + '</p>',
      inputHtml,
      '  <p class="save-hint">&#10003; Wird automatisch gespeichert</p>',
      '</div>'
    ].join('\n');
  }).join('\n');

  const extraHtml = station.extraTasks.map(function(t) {
    const saved = state.answers[t.id] || '';
    let inputHtml;

    if (t.format === 'sentenceStarter' && t.starter) {
      inputHtml = '<div class="sentence-starter">' + escHtml(t.starter) + '</div>' +
        '<textarea class="task-textarea" id="ans-' + t.id + '" rows="5"' +
        ' placeholder="Gedanken aufschreiben..."' +
        ' oninput="saveAnswer(\'' + t.id + '\', this.value)">' + escHtml(saved) + '</textarea>';
    } else {
      inputHtml = '<textarea class="task-textarea" id="ans-' + t.id + '" rows="5"' +
        ' placeholder="Schreib hier deine Antwort..."' +
        ' oninput="saveAnswer(\'' + t.id + '\', this.value)">' + escHtml(saved) + '</textarea>';
    }

    return [
      '<div class="task-card task-extra">',
      '  <span class="task-badge badge-extra">Zusatzaufgabe (freiwillig)</span>',
      '  <p class="task-prompt">' + escHtml(t.prompt || '') + '</p>',
      inputHtml,
      '</div>'
    ].join('\n');
  }).join('\n');

  const collabHtml = [
    '<div class="collapsible">',
    '  <button class="collapsible-header" aria-expanded="false" onclick="toggleCollapsible(this)">',
    '    &#128172; ' + escHtml(station.collaboration.title) + ' <span class="arrow">&#9660;</span>',
    '  </button>',
    '  <div class="collapsible-body">',
    '    <span class="task-badge badge-collab" style="margin-bottom:0.5rem;display:inline-block">Zusammenarbeit</span>',
    '    <p style="white-space:pre-line">' + escHtml(station.collaboration.prompt) + '</p>',
    '  </div>',
    '</div>'
  ].join('\n');

  const reflectionSaved = state.answers['reflect_' + station.id] || '';
  const reflectHtml = [
    '<div class="task-card task-reflect">',
    '  <span class="task-badge badge-reflect">Reflexion</span>',
    '  <p class="task-prompt">' + escHtml(station.reflection.prompt) + '</p>',
    '  <textarea class="task-textarea" id="ans-reflect_' + station.id + '" rows="4"',
    '    placeholder="Meine Gedanken dazu..."',
    '    oninput="saveAnswer(\'reflect_' + station.id + '\', this.value)">' + escHtml(reflectionSaved) + '</textarea>',
    '</div>'
  ].join('\n');

  const exercisesHtml = station.interactiveExercises.map(function(ex) {
    return renderExercise(ex);
  }).join('\n');

  const sourcesHtml = station.sources.length
    ? [
        '<details class="sources-section mt-2">',
        '  <summary>&#128218; Mehr entdecken (Quellen &amp; Links)</summary>',
        '  <div style="padding:0.5rem 0">',
        station.sources.map(function(s) {
          return '<a class="source-link" href="' + escHtml(s.url || '#') + '" target="_blank" rel="noopener noreferrer">' + escHtml(s.label) + '</a>';
        }).join('\n'),
        '  </div>',
        '</details>'
      ].join('\n')
    : '';

  const prevSec = SECTIONS[SECTIONS.indexOf(sectionId) - 1] || 'start';
  const nextSec = SECTIONS[SECTIONS.indexOf(sectionId) + 1] || 'checkout';
  const nextLabel = nextSec === 'checkout' ? 'Zum Check-out' : 'Nächste Station';

  return [
    '<section class="station-page">',
    '  <div class="station-header">',
    '    <span class="station-label">Station ' + stationNum + ' von ' + totalStations + '</span>',
    '    <h1 class="station-title">' + escHtml(station.title) + '</h1>',
    '    <p class="leitfrage">' + escHtml(station.guidingQuestion) + '</p>',
    '  </div>',

    '  <div class="image-section">',
    '    <div class="station-image-wrap">',
    '      <img class="station-image"',
    '        src="images/' + encodeURIComponent(imgFile) + '"',
    '        alt="' + escHtml(station.title) + ' – historisches Bild"',
    '        onerror="this.closest(\'.image-section\').style.display=\'none\'">',
    hotspotsHtml,
    '    </div>',
    imgCaption ? '    <div class="image-caption">Quelle: ' + escHtml(imgCaption) + '</div>' : '',
    legendHtml,
    '  </div>',

    secondaryImgHtml,

    '  <div class="intro-card">',
    '    <h3>&#128065; Zum Einstieg</h3>',
    '    <p>' + escHtml(station.introText) + '</p>',
    '  </div>',

    '  <div class="task-section">',
    '    <div class="task-section-title">&#128203; Pflichtaufgaben</div>',
    requiredHtml,
    '  </div>',

    exercisesHtml
      ? '<div class="task-section"><div class="task-section-title">&#127919; Interaktive Übungen</div>' + exercisesHtml + '</div>'
      : '',

    station.extraTasks.length
      ? '<div class="task-section"><div class="task-section-title">&#11088; Zusatzaufgaben (freiwillig)</div>' + extraHtml + '</div>'
      : '',

    collabHtml,
    reflectHtml,
    sourcesHtml,

    '  <div class="nav-row">',
    '    <button class="btn btn-secondary" onclick="goTo(\'' + prevSec + '\')">&#8592; Zurück</button>',
    '    <button class="btn btn-primary" onclick="goTo(\'' + nextSec + '\')">' + nextLabel + ' &#8594;</button>',
    '  </div>',
    '</section>'
  ].join('\n');
}

/* ============================================================
   RENDER: EXERCISES
   ============================================================ */
function renderExercise(ex) {
  if (ex.type === 'multipleChoice') return renderMCExercise(ex);
  if (ex.type === 'trueFalse')     return renderTFExercise(ex);
  if (ex.type === 'dragAndDrop')   return renderDDExercise(ex);
  if (ex.type === 'fillInTheBlank') return renderFillExercise(ex);
  if (ex.type === 'timeline')      return renderTimelineExercise(ex);
  if (ex.type === 'sentenceStarter') return renderSentenceExercise(ex);
  return '';
}

/* -- Multiple Choice --------------------------------------- */
function renderMCExercise(ex) {
  const opts = ex.options.map(function(opt, i) {
    return [
      '<label class="mc-option">',
      '  <input type="checkbox" name="mc-' + ex.id + '" value="' + i + '">',
      '  <span>' + escHtml(opt.text) + '</span>',
      '</label>'
    ].join('');
  }).join('\n');

  return [
    '<div class="exercise-card" id="ex-' + ex.id + '">',
    '  <div class="exercise-title">&#127919; Übung</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt) + '</p>',
    '  <div class="mc-options">' + opts + '</div>',
    '  <button class="btn btn-sm btn-secondary" onclick="checkMC(\'' + ex.id + '\')">Überprüfen</button>',
    '  <div id="fb-' + ex.id + '" class="feedback-area" aria-live="polite"></div>',
    '</div>'
  ].join('\n');
}

function checkMC(exId) {
  // Find exercise data across all stations
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  const container = document.getElementById('ex-' + exId);
  if (!container) return;

  const checkboxes = container.querySelectorAll('input[type="checkbox"]');
  const selected = [];
  checkboxes.forEach(function(cb) {
    if (cb.checked) selected.push(parseInt(cb.value, 10));
  });

  const correctIndices = ex.options.map(function(o, i) { return o.correct ? i : -1; }).filter(function(i) { return i >= 0; });

  // Mark each option
  const labels = container.querySelectorAll('.mc-option');
  labels.forEach(function(lbl, i) {
    lbl.classList.remove('correct-answer', 'wrong-answer');
    const isSelected = selected.includes(i);
    const isCorrect = ex.options[i].correct;
    if (isSelected && isCorrect)  lbl.classList.add('correct-answer');
    if (isSelected && !isCorrect) lbl.classList.add('wrong-answer');
    if (!isSelected && isCorrect) lbl.classList.add('correct-answer'); // show missed correct
  });

  const correctCount = selected.filter(function(i) { return ex.options[i] && ex.options[i].correct; }).length;
  const wrongCount   = selected.filter(function(i) { return ex.options[i] && !ex.options[i].correct; }).length;
  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;

  if (wrongCount === 0 && correctCount === correctIndices.length) {
    fb.className = 'feedback-area fb-correct';
    fb.textContent = ex.feedbackCorrect || '✓ Richtig!';
  } else {
    fb.className = 'feedback-area fb-partial';
    fb.textContent = ex.feedbackPartial || 'Nicht ganz. Schau dir die Antworten noch einmal an – die richtigen Antworten sind jetzt markiert.';
  }
}

/* -- True/False -------------------------------------------- */
function renderTFExercise(ex) {
  const stmts = ex.statements.map(function(stmt, i) {
    return [
      '<div class="tf-statement" id="tf-stmt-' + ex.id + '-' + i + '">',
      '  <p>' + escHtml(stmt.text) + '</p>',
      '  <div class="tf-options">',
      '    <label class="tf-option"><input type="radio" name="tf-' + ex.id + '-' + i + '" value="true"> &#10003; Richtig</label>',
      '    <label class="tf-option"><input type="radio" name="tf-' + ex.id + '-' + i + '" value="false"> &#10007; Falsch</label>',
      '  </div>',
      '</div>'
    ].join('\n');
  }).join('\n');

  return [
    '<div class="exercise-card" id="ex-' + ex.id + '">',
    '  <div class="exercise-title">&#127919; Übung</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt) + '</p>',
    stmts,
    '  <button class="btn btn-sm btn-secondary" onclick="checkTF(\'' + ex.id + '\')">Überprüfen</button>',
    '  <div id="fb-' + ex.id + '" class="feedback-area" aria-live="polite"></div>',
    '</div>'
  ].join('\n');
}

function checkTF(exId) {
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  let allCorrect = true;
  const msgs = [];

  ex.statements.forEach(function(stmt, i) {
    const radios = document.querySelectorAll('[name="tf-' + exId + '-' + i + '"]');
    let selected = null;
    radios.forEach(function(r) { if (r.checked) selected = r.value === 'true'; });
    const isCorrect = (selected === stmt.correct);
    const stmtEl = document.getElementById('tf-stmt-' + exId + '-' + i);
    if (stmtEl) {
      stmtEl.classList.remove('correct-stmt', 'wrong-stmt');
      stmtEl.classList.add(isCorrect ? 'correct-stmt' : 'wrong-stmt');
    }
    if (!isCorrect) {
      allCorrect = false;
      msgs.push(stmt.explanation || (stmt.correct ? 'Die Aussage ist richtig.' : 'Die Aussage ist falsch.'));
    }
  });

  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;
  if (allCorrect) {
    fb.className = 'feedback-area fb-correct';
    fb.textContent = '✓ Alle Aussagen richtig bewertet!';
  } else {
    fb.className = 'feedback-area fb-partial';
    fb.innerHTML = 'Schau noch einmal hin:<br>' + msgs.map(function(m) { return '• ' + escHtml(m); }).join('<br>');
  }
}

/* -- Drag & Drop (Click-Assign) ---------------------------- */
function renderDDExercise(ex) {
  if (!state.ddAnswers[ex.id]) state.ddAnswers[ex.id] = {};

  const items = ex.items.map(function(item) {
    const saved = state.ddAnswers[ex.id][item.text] || '';
    const targetBtns = ex.targets.map(function(target) {
      const sel = saved === target ? ' selected' : '';
      return '<button class="dd-target-btn' + sel + '" onclick="assignDD(\'' + ex.id + '\', ' +
        JSON.stringify(item.text) + ', ' + JSON.stringify(target) + ')">' +
        escHtml(target) + '</button>';
    }).join('');

    return [
      '<div class="dd-item" id="dd-item-' + ex.id + '-' + slugify(item.text) + '">',
      '  <span class="dd-item-label">' + escHtml(item.text) + '</span>',
      '  <div class="dd-target-btns">' + targetBtns + '</div>',
      '</div>'
    ].join('\n');
  }).join('\n');

  return [
    '<div class="exercise-card" id="ex-' + ex.id + '">',
    '  <div class="exercise-title">&#127919; Übung – Zuordnung</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt) + '</p>',
    '  <div class="dd-container">' + items + '</div>',
    '  <button class="btn btn-sm btn-secondary" onclick="checkDD(\'' + ex.id + '\')">Überprüfen</button>',
    '  <div id="fb-' + ex.id + '" class="feedback-area" aria-live="polite"></div>',
    '</div>'
  ].join('\n');
}

function assignDD(exId, itemText, target) {
  if (!state.ddAnswers[exId]) state.ddAnswers[exId] = {};
  state.ddAnswers[exId][itemText] = target;
  saveState();

  // Update button states
  const key = slugify(itemText);
  const itemEl = document.getElementById('dd-item-' + exId + '-' + key);
  if (!itemEl) return;
  itemEl.querySelectorAll('.dd-target-btn').forEach(function(btn) {
    btn.classList.remove('selected');
    if (btn.textContent.trim() === target) btn.classList.add('selected');
  });
}

function checkDD(exId) {
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  const answers = state.ddAnswers[exId] || {};
  let correct = 0;
  const total = ex.items.length;

  ex.items.forEach(function(item) {
    const given = answers[item.text] || '';
    const isCorrect = given === item.correct;
    const key = slugify(item.text);
    const itemEl = document.getElementById('dd-item-' + exId + '-' + key);
    if (itemEl) {
      itemEl.classList.remove('correct-item', 'wrong-item');
      itemEl.classList.add(isCorrect ? 'correct-item' : 'wrong-item');
    }
    if (isCorrect) correct++;
  });

  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;
  if (correct === total) {
    fb.className = 'feedback-area fb-correct';
    fb.textContent = '✓ Alles richtig zugeordnet!';
  } else {
    fb.className = 'feedback-area fb-partial';
    fb.textContent = correct + ' von ' + total + ' richtig. Schau dir die rot markierten Einträge noch einmal an.';
  }
}

/* -- Fill in the blank ------------------------------------- */
function renderFillExercise(ex) {
  let html = ex.template || '';
  ex.answers.forEach(function(ans, i) {
    const placeholder = '[BLANK' + (i + 1) + ']';
    const inputHtml = '<input type="text" class="blank-input" id="blank-' + ex.id + '-' + ans.id +
      '" placeholder="..." aria-label="Lücke ' + (i + 1) + '">';
    html = html.replace(placeholder, inputHtml);
  });

  return [
    '<div class="exercise-card" id="ex-' + ex.id + '">',
    '  <div class="exercise-title">&#127919; Übung – Lückentext</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt) + '</p>',
    '  <p class="blank-text">' + html + '</p>',
    '  <button class="btn btn-sm btn-secondary" onclick="checkFill(\'' + ex.id + '\')">Überprüfen</button>',
    '  <div id="fb-' + ex.id + '" class="feedback-area" aria-live="polite"></div>',
    '</div>'
  ].join('\n');
}

function checkFill(exId) {
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  let allOk = true;
  ex.answers.forEach(function(ans) {
    const input = document.getElementById('blank-' + exId + '-' + ans.id);
    if (!input) return;
    const val = input.value.trim().toLowerCase();
    const acceptedVals = (ans.accept || [ans.correct]).map(function(a) { return a.toLowerCase().trim(); });
    const ok = acceptedVals.some(function(a) { return val.includes(a) || a.includes(val); });
    input.className = 'blank-input ' + (ok ? 'correct' : 'wrong');
    if (!ok) allOk = false;
  });

  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;
  if (allOk) {
    fb.className = 'feedback-area fb-correct';
    fb.textContent = '✓ Richtig ausgefüllt!';
  } else {
    fb.className = 'feedback-area fb-partial';
    fb.textContent = 'Noch nicht ganz richtig. Schau nochmals in die Aufgaben der Station.';
  }
}

/* -- Timeline --------------------------------------------- */
function renderTimelineExercise(ex) {
  // Shuffle for display
  if (!state.timelineOrders[ex.id]) {
    const shuffled = ex.items.map(function(item, i) { return { text: item, origIdx: i }; });
    shuffleArray(shuffled);
    state.timelineOrders[ex.id] = shuffled.map(function(s) { return s.origIdx; });
    saveState();
  }

  const order = state.timelineOrders[ex.id];
  const items = order.map(function(origIdx, pos) {
    return [
      '<li class="timeline-item" id="tl-' + ex.id + '-' + pos + '" data-pos="' + pos + '" data-orig="' + origIdx + '">',
      '  <span class="timeline-num">' + (pos + 1) + '</span>',
      '  <span class="timeline-text">' + escHtml(ex.items[origIdx]) + '</span>',
      '  <div class="timeline-arrows">',
      '    <button aria-label="Nach oben" onclick="moveTL(\'' + ex.id + '\', ' + pos + ', -1)">&#9650;</button>',
      '    <button aria-label="Nach unten" onclick="moveTL(\'' + ex.id + '\', ' + pos + ', 1)">&#9660;</button>',
      '  </div>',
      '</li>'
    ].join('');
  }).join('\n');

  return [
    '<div class="exercise-card" id="ex-' + ex.id + '">',
    '  <div class="exercise-title">&#127919; Übung – Zeitstrahl</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt) + '</p>',
    '  <ul class="timeline-list" id="tl-list-' + ex.id + '">' + items + '</ul>',
    '  <button class="btn btn-sm btn-secondary" onclick="checkTL(\'' + ex.id + '\')">Reihenfolge überprüfen</button>',
    '  <div id="fb-' + ex.id + '" class="feedback-area" aria-live="polite"></div>',
    '</div>'
  ].join('\n');
}

function moveTL(exId, pos, dir) {
  const order = state.timelineOrders[exId];
  if (!order) return;
  const newPos = pos + dir;
  if (newPos < 0 || newPos >= order.length) return;

  // Swap
  const tmp = order[pos];
  order[pos] = order[newPos];
  order[newPos] = tmp;
  saveState();

  // Re-render just the list
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  const list = document.getElementById('tl-list-' + exId);
  if (!list) return;

  list.innerHTML = order.map(function(origIdx, p) {
    return [
      '<li class="timeline-item" id="tl-' + exId + '-' + p + '" data-pos="' + p + '" data-orig="' + origIdx + '">',
      '  <span class="timeline-num">' + (p + 1) + '</span>',
      '  <span class="timeline-text">' + escHtml(ex.items[origIdx]) + '</span>',
      '  <div class="timeline-arrows">',
      '    <button aria-label="Nach oben" onclick="moveTL(\'' + exId + '\', ' + p + ', -1)">&#9650;</button>',
      '    <button aria-label="Nach unten" onclick="moveTL(\'' + exId + '\', ' + p + ', 1)">&#9660;</button>',
      '  </div>',
      '</li>'
    ].join('');
  }).join('\n');
}

function checkTL(exId) {
  let ex = null;
  STATIONS.forEach(function(st) {
    st.interactiveExercises.forEach(function(e) {
      if (e.id === exId) ex = e;
    });
  });
  if (!ex) return;

  const order = state.timelineOrders[exId] || [];
  const correct = (ex.correctOrder || ex.items.map(function(_, i) { return i; }));
  const isCorrect = order.every(function(origIdx, pos) { return origIdx === correct[pos]; });

  // Mark items
  order.forEach(function(origIdx, pos) {
    const el = document.getElementById('tl-' + exId + '-' + pos);
    if (el) {
      el.classList.remove('correct-order', 'wrong-order');
      el.classList.add(origIdx === correct[pos] ? 'correct-order' : 'wrong-order');
    }
  });

  const fb = document.getElementById('fb-' + exId);
  if (!fb) return;
  if (isCorrect) {
    fb.className = 'feedback-area fb-correct';
    fb.textContent = '✓ Richtige Reihenfolge!';
  } else {
    fb.className = 'feedback-area fb-partial';
    fb.textContent = 'Noch nicht ganz richtig. Schau, welche Einträge rot markiert sind, und sortiere weiter.';
  }
}

/* -- Sentence Starter in exercises ------------------------- */
function renderSentenceExercise(ex) {
  const saved = state.answers[ex.id] || '';
  return [
    '<div class="exercise-card">',
    '  <div class="exercise-title">&#128221; Aufgabe</div>',
    '  <p class="exercise-prompt">' + escHtml(ex.prompt || '') + '</p>',
    '  <div class="sentence-starter">' + escHtml(ex.starter || '') + '</div>',
    '  <textarea class="task-textarea" id="ans-' + ex.id + '" rows="4"',
    '    placeholder="... dein Text hier"',
    '    oninput="saveAnswer(\'' + ex.id + '\', this.value)">' + escHtml(saved) + '</textarea>',
    '</div>'
  ].join('\n');
}

/* ============================================================
   HOTSPOT MODAL
   ============================================================ */
function openHotspot(stationId, hotspotId) {
  activeHotspotId = hotspotId;

  // Mark as opened
  state.openedHotspots[hotspotId] = true;
  saveState();

  // Update button class
  const btn = document.querySelector('[onclick*="' + hotspotId + '"]');
  if (btn) btn.classList.add('opened');

  // Find station + hotspot data
  const station = STATIONS.find(function(s) { return s.id === stationId; });
  if (!station) return;
  const hs = station.hotspots.find(function(h) { return h.id === hotspotId; });
  if (!hs) return;

  // Build modal content
  const badge = document.getElementById('modal-type-badge');
  const title = document.getElementById('modal-title');
  const body  = document.getElementById('modal-body');
  const noteEl = document.getElementById('modal-note');

  if (badge) {
    badge.className = 'modal-badge type-' + hs.type;
    badge.textContent = TYPE_LABELS[hs.type] || hs.type;
  }
  if (title) title.textContent = hs.title || hs.label;

  if (body) {
    let html = '';

    if (hs.content) {
      html += '<p>' + escHtml(hs.content) + '</p>';
    }

    if (hs.contentList && hs.contentList.length) {
      html += '<ul class="modal-content-list">' +
        hs.contentList.map(function(item) {
          return '<li>' + escHtml(item) + '</li>';
        }).join('') +
        '</ul>';
    }

    if (hs.task) {
      html += '<div class="modal-task-prompt">&#128221; <strong>Aufgabe:</strong> ' + escHtml(hs.task) + '</div>';
    }

    body.innerHTML = html;
  }

  if (noteEl) {
    noteEl.value = state.notes[hotspotId] || '';
  }

  // Show modal
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    // Focus close button
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) setTimeout(function() { closeBtn.focus(); }, 50);
  }
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  activeHotspotId = null;
}

function saveHotspotNote() {
  if (!activeHotspotId) return;
  const noteEl = document.getElementById('modal-note');
  if (!noteEl) return;
  state.notes[activeHotspotId] = noteEl.value;
  saveState();

  // Brief confirmation
  const btn = noteEl.nextElementSibling;
  if (btn) {
    const orig = btn.textContent;
    btn.textContent = '✓ Gespeichert!';
    setTimeout(function() { btn.textContent = orig; }, 1500);
  }
  updateJournalContent();
}

/* Close modal on backdrop click */
document.addEventListener('click', function(e) {
  const overlay = document.getElementById('modal-overlay');
  if (overlay && e.target === overlay) closeModal();
});

/* Close modal on Escape */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeModal();
    closeJournal();
  }
});

/* ============================================================
   ANSWER PERSISTENCE
   ============================================================ */
function saveAnswer(taskId, value) {
  state.answers[taskId] = value;
  saveState();
  updateJournalContent();
}

function attachTextareaListeners() {
  // Already using inline oninput – nothing extra needed
}

function restoreAnswers(sectionId) {
  // Textareas: values already set in innerHTML via state
  // Nothing needed – answers are rendered into textarea values directly
}

/* ============================================================
   COLLAPSIBLE
   ============================================================ */
function toggleCollapsible(btn) {
  const expanded = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', !expanded);
  const body = btn.nextElementSibling;
  if (body) body.classList.toggle('open', !expanded);
}

/* ============================================================
   JOURNAL PANEL
   ============================================================ */
function openJournal() {
  const panel = document.getElementById('journal-panel');
  const backdrop = document.getElementById('journal-backdrop');
  const toggle = document.getElementById('journal-toggle');
  if (panel) { panel.classList.add('open'); panel.setAttribute('aria-hidden', 'false'); }
  if (backdrop) backdrop.classList.add('open');
  if (toggle) toggle.setAttribute('aria-expanded', 'true');
  updateJournalContent();
}

function closeJournal() {
  const panel = document.getElementById('journal-panel');
  const backdrop = document.getElementById('journal-backdrop');
  const toggle = document.getElementById('journal-toggle');
  if (panel) { panel.classList.remove('open'); panel.setAttribute('aria-hidden', 'true'); }
  if (backdrop) backdrop.classList.remove('open');
  if (toggle) toggle.setAttribute('aria-expanded', 'false');
}

document.getElementById('journal-toggle').addEventListener('click', function() {
  const panel = document.getElementById('journal-panel');
  const isOpen = panel && panel.classList.contains('open');
  if (isOpen) closeJournal(); else openJournal();
});

document.getElementById('journal-close').addEventListener('click', closeJournal);

function updateJournalContent() {
  const container = document.getElementById('journal-content');
  if (!container) return;

  const entries = [];

  // Check-in answers
  CHECK_IN.statements.forEach(function(s) {
    const ans = state.checkInAnswers[s.id];
    if (ans) {
      entries.push({ label: 'Check-in: ' + s.text.substring(0, 40) + '...', text: ans });
    }
  });
  if (state.checkInAnswers['open']) {
    entries.push({ label: 'Check-in Einstiegsfrage', text: state.checkInAnswers['open'] });
  }

  // Station answers
  STATIONS.forEach(function(st) {
    const allTasks = st.requiredTasks.concat(st.extraTasks || []);
    allTasks.forEach(function(t) {
      const ans = state.answers[t.id];
      if (ans && ans.trim()) {
        const shortPrompt = (t.prompt || '').substring(0, 50);
        entries.push({ label: st.shortTitle + ' – ' + shortPrompt, text: ans });
      }
    });
    const ref = state.answers['reflect_' + st.id];
    if (ref && ref.trim()) {
      entries.push({ label: st.shortTitle + ' – Reflexion', text: ref });
    }
  });

  // Notes
  Object.keys(state.notes).forEach(function(hsId) {
    const note = state.notes[hsId];
    if (note && note.trim()) {
      entries.push({ label: 'Hotspot-Notiz (' + hsId + ')', text: note });
    }
  });

  // Check-out answers
  if (CHECK_OUT) {
    CHECK_OUT.quiz.forEach(function(q) {
      const ans = state.checkOutAnswers[q.id];
      if (ans && ans.trim()) {
        entries.push({ label: 'Check-out: ' + q.question.substring(0, 40) + '...', text: ans });
      }
    });
    CHECK_OUT.reflectionPrompts.forEach(function(p, i) {
      const ans = state.checkOutAnswers['co_reflect_' + i];
      if (ans && ans.trim()) {
        entries.push({ label: 'Reflexion: ' + p.substring(0, 40) + '...', text: ans });
      }
    });
    const transfer = state.checkOutAnswers['co_transfer'];
    if (transfer && transfer.trim()) {
      entries.push({ label: 'Transfer', text: transfer });
    }
  }

  if (entries.length === 0) {
    container.innerHTML = '<p class="journal-empty">Noch keine Einträge. Bearbeite Aufgaben und Notizen – sie erscheinen hier.</p>';
    return;
  }

  container.innerHTML = entries.map(function(e) {
    return [
      '<div class="journal-entry">',
      '  <div class="journal-entry-label">' + escHtml(e.label) + '</div>',
      '  <div class="journal-entry-text">' + escHtml(e.text) + '</div>',
      '</div>'
    ].join('');
  }).join('');
}

function printJournal() {
  window.print();
}

function confirmClearJournal() {
  if (confirm('Möchtest du wirklich alle gespeicherten Antworten löschen und neu beginnen? Das kann nicht rückgängig gemacht werden.')) {
    localStorage.removeItem(STORAGE_KEY);
    state = loadState();
    closeJournal();
    goTo('start');
  }
}

/* ============================================================
   RENDER: CHECK-OUT
   ============================================================ */
function renderCheckOut() {
  const quizHtml = CHECK_OUT.quiz.map(function(q) {
    const saved = state.checkOutAnswers[q.id] || '';
    return [
      '<div class="card">',
      '  <p class="task-prompt">' + escHtml(q.question) + '</p>',
      '  <textarea class="task-textarea" id="co-' + q.id + '" rows="3"',
      '    placeholder="Deine Antwort..."',
      '    oninput="saveCheckOut(\'' + q.id + '\', this.value)">' + escHtml(saved) + '</textarea>',
      '</div>'
    ].join('\n');
  }).join('\n');

  // Timeline (simplified: just display in correct order with checkboxes)
  const timelineHtml = [
    '<div class="checkout-timeline">',
    '  <h3>&#8987; Zeitstrahl</h3>',
    '  <p style="color:var(--text-mid);margin-bottom:1rem;font-size:0.9rem">Diese Ereignisse in der richtigen Reihenfolge – erkennst du sie alle?</p>',
    '  <ol style="padding-left:1.5rem">',
    CHECK_OUT.timeline.map(function(item) {
      return '<li style="padding:0.4rem 0;border-bottom:1px solid var(--border)">' + escHtml(item) + '</li>';
    }).join('\n'),
    '  </ol>',
    '</div>'
  ].join('\n');

  const saHtml = [
    '<div class="self-assessment">',
    '  <h3>&#129505; Selbsteinschätzung</h3>',
    '  <p style="color:var(--text-mid);font-size:0.88rem;margin-bottom:1rem">Wie gut kannst du das? &#128577; = noch nicht so gut | &#128536; = geht so | &#128522; = ich hab\'s verstanden</p>',
    CHECK_OUT.selfAssessment.map(function(sa) {
      const saved = state.selfAssessment[sa.id] || '';
      const btns = sa.emojis.map(function(emoji) {
        const sel = saved === emoji ? ' selected' : '';
        return '<button class="sa-btn' + sel + '" onclick="saveSA(\'' + sa.id + '\', \'' + emoji + '\')" aria-label="' + emoji + '">' + emoji + '</button>';
      }).join('');
      return [
        '<div class="sa-item">',
        '  <span class="sa-text">' + escHtml(sa.text) + '</span>',
        '  <div class="sa-scale">' + btns + '</div>',
        '</div>'
      ].join('');
    }).join('\n'),
    '</div>'
  ].join('\n');

  const reflectHtml = CHECK_OUT.reflectionPrompts.map(function(p, i) {
    const saved = state.checkOutAnswers['co_reflect_' + i] || '';
    return [
      '<div class="card open-question-card">',
      '  <p class="task-prompt">' + escHtml(p) + '</p>',
      '  <textarea class="task-textarea" id="co-reflect-' + i + '" rows="3"',
      '    placeholder="Deine Gedanken..."',
      '    oninput="saveCheckOut(\'co_reflect_' + i + '\', this.value)">' + escHtml(saved) + '</textarea>',
      '</div>'
    ].join('\n');
  }).join('\n');

  const transferSaved = state.checkOutAnswers['co_transfer'] || '';
  const transferHtml = [
    '<div class="card" style="border-left:4px solid var(--gold);background:var(--bg-card-alt)">',
    '  <span class="task-badge" style="background:var(--gold);color:#1a0f00;margin-bottom:0.5rem;display:inline-block">Transfer</span>',
    '  <p class="task-prompt">' + escHtml(CHECK_OUT.transferPrompt) + '</p>',
    '  <textarea class="task-textarea" id="co-transfer" rows="4"',
    '    placeholder="Deine Gedanken..."',
    '    oninput="saveCheckOut(\'co_transfer\', this.value)">' + escHtml(transferSaved) + '</textarea>',
    '</div>'
  ].join('\n');

  return [
    '<section class="checkout-page">',
    '  <div class="page-header">',
    '    <span class="section-label">Check-out</span>',
    '    <h1>' + escHtml(CHECK_OUT.title) + '</h1>',
    '    <p>' + escHtml(CHECK_OUT.subtitle) + '</p>',
    '  </div>',

    '  <h2 style="margin-bottom:1rem">&#128203; Mini-Quiz</h2>',
    quizHtml,

    timelineHtml,
    saHtml,

    '  <h2 style="margin:1.5rem 0 1rem">&#128161; Reflexionsfragen</h2>',
    reflectHtml,
    transferHtml,

    '  <div class="nav-row">',
    '    <button class="btn btn-secondary" onclick="goTo(\'s6\')">&#8592; Zurück</button>',
    '    <button class="btn btn-primary btn-lg" onclick="goTo(\'done\')">Bildreise abschliessen &#10003;</button>',
    '  </div>',
    '</section>'
  ].join('\n');
}

function saveCheckOut(key, val) {
  state.checkOutAnswers[key] = val;
  saveState();
  updateJournalContent();
}

function saveSA(saId, emoji) {
  state.selfAssessment[saId] = emoji;
  saveState();

  // Update UI
  const allBtns = document.querySelectorAll('[onclick*="saveSA(\'' + saId + '\'"]');
  allBtns.forEach(function(btn) {
    btn.classList.remove('selected');
    if (btn.getAttribute('aria-label') === emoji) btn.classList.add('selected');
  });
}

/* ============================================================
   RENDER: DONE
   ============================================================ */
function renderDone() {
  const answeredCount = Object.keys(state.answers).filter(function(k) {
    return state.answers[k] && state.answers[k].trim();
  }).length;
  const stationsVisited = STATIONS.filter(function(st) {
    return st.hotspots.some(function(hs) { return state.openedHotspots[hs.id]; });
  }).length;

  return [
    '<section class="done-page">',
    '  <div class="done-hero">',
    '    <h1>&#127881; Bildreise abgeschlossen!</h1>',
    '    <p>Du hast alle Stationen der Bildreise zur Nachkriegszeit durchlaufen.</p>',
    '    <div class="done-stats">',
    '      <div class="done-stat"><div class="stat-num">' + stationsVisited + '</div><div class="stat-label">Stationen erkundet</div></div>',
    '      <div class="done-stat"><div class="stat-num">' + answeredCount + '</div><div class="stat-label">Aufgaben beantwortet</div></div>',
    '      <div class="done-stat"><div class="stat-num">' + Object.keys(state.notes).length + '</div><div class="stat-label">Hotspot-Notizen</div></div>',
    '    </div>',
    '  </div>',
    '  <div class="card" style="margin:0 auto;max-width:600px;text-align:left">',
    '    <h2>Was du gelernt hast</h2>',
    '    <ul>',
    START_PAGE.learningGoals.map(function(g) { return '<li>' + escHtml(g) + '</li>'; }).join(''),
    '    </ul>',
    '  </div>',
    '  <div class="gap-row mt-3" style="justify-content:center">',
    '    <button class="btn btn-secondary" onclick="printJournal()">&#128424; Lernjournal drucken</button>',
    '    <button class="btn btn-secondary" onclick="openJournal()">&#128221; Journal anzeigen</button>',
    '    <button class="btn btn-secondary" onclick="goTo(\'checkin\')">&#8592; Nochmal ansehen</button>',
    '  </div>',
    '  <p style="color:var(--text-muted);margin-top:2rem;font-size:0.9rem">Deine Antworten sind im Browser gespeichert. Du kannst das Journal jederzeit drucken oder als PDF speichern.</p>',
    '</section>'
  ].join('\n');
}

/* ============================================================
   UTILITY FUNCTIONS
   ============================================================ */
function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugify(str) {
  return String(str).toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/* ============================================================
   INIT
   ============================================================ */
(function init() {
  const section = state.currentSection || 'start';
  updateProgressBar(section);
  updateProgressSteps(section);
  updateStationIndicator(section);
  renderSection(section);
  updateJournalContent();
})();
