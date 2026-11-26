(() => {
  const appEl = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const toastRoot = document.getElementById('toast-root');

  const state = {
    route: 'home',
    history: [],
    profile: null,
    notifications: [],
    heroSlide: 2,
    groupsTab: 'Active',
    paymentsTab: 'Income',
    lessonsFilter: null,
    selectedMentor: null,
    mentorAvailability: null,
    calendarYear: 2026,
    calendarMonth: 10, // 0-indexed: 10 = November
    selectedSlotId: null,
    loggedOut: false
  };

  const heroSlides = [
    {
      eyebrow: 'In the Result Student app',
      headline: 'BOOK SUPPORT LESSONS',
      sub: 'Reserve 1-on-1 sessions with your mentors',
      caption: 'Book your support lessons',
      target: 'booked-lessons'
    },
    {
      eyebrow: 'In the Result Student app',
      headline: 'REFER YOUR FRIENDS',
      sub: 'Invite friends to Saxovat branch',
      caption: 'Refer a friend today',
      target: 'refer'
    },
    {
      eyebrow: 'In the Result Student app',
      headline: 'TRACK YOUR EXAM RESULTS',
      sub: 'Scores and teacher comments in the Exam tab',
      caption: 'Track your exam results',
      target: 'exam'
    },
    {
      eyebrow: 'In the Result Student app',
      headline: 'CHECK YOUR PAYMENTS',
      sub: 'View balance, deposits and tuition charges',
      caption: 'Financial overview & history',
      target: 'payments'
    },
    {
      eyebrow: 'In the Result Student app',
      headline: 'LEARN NEW VOCABULARY',
      sub: 'Daily academic words and examples',
      caption: 'Expand your vocabulary',
      target: 'vocabulary'
    }
  ];

  function showToast(msg, isError = false) {
    const el = document.createElement('div');
    el.className = `toast${isError ? ' error' : ''}`;
    el.textContent = msg;
    toastRoot.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function formatMoney(n) {
    return Number(n || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  function escapeHtml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  const routeMeta = {
    'home': { path: '/result/home', title: 'Result Student — Home' },
    'exam': { path: '/result/exam', title: 'Result Student — Exam Results' },
    'groups': { path: '/result/groups', title: 'Result Student — Groups' },
    'booked-lessons': { path: '/result/booked-lessons', title: 'Result Student — Booked Lessons' },
    'supports': { path: '/result/supports', title: 'Result Student — Supports' },
    'book-calendar': { path: '/result/book', title: 'Result Student — Book Lesson' },
    'books': { path: '/result/books', title: 'Result Student — Books' },
    'podcasts': { path: '/result/podcasts', title: 'Result Student — Podcasts' },
    'refer': { path: '/result/refer-a-friend', title: 'Result Student — Refer a Friend' },
    'change-password': { path: '/result/change-password', title: 'Result Student — Change Password' },
    'payments': { path: '/result/payments', title: 'Result Student — Payments' },
    'profile': { path: '/result/profile', title: 'Result Student — Profile' },
    'vocabulary': { path: '/result/vocabulary', title: 'Result Student — Vocabulary' },
    'vocabulary-beginner': { path: '/result/vocabulary/beginner', title: 'Result Student — Beginner Vocabulary' },
    'vocabulary-elementary': { path: '/result/vocabulary/elementary', title: 'Result Student — Elementary Vocabulary' },
    'vocabulary-pre-intermediate': { path: '/result/vocabulary/pre-intermediate', title: 'Result Student — Pre-Intermediate Vocabulary' },
    'vocabulary-intermediate': { path: '/result/vocabulary/intermediate', title: 'Result Student — Intermediate Vocabulary' },
    'vocabulary-upper-intermediate': { path: '/result/vocabulary/upper-intermediate', title: 'Result Student — Upper-Intermediate Vocabulary' },
    'vocabulary-advanced': { path: '/result/vocabulary/advanced', title: 'Result Student — Advanced Vocabulary' },
    'irregular-verbs': { path: '/result/irregular-verbs', title: 'Result Student — Irregular Verbs' }
  };

  function getRouteFromLocation() {
    const cleanPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    for (const [key, meta] of Object.entries(routeMeta)) {
      if (meta.path === cleanPath) return key;
    }
    return 'home';
  }

  function syncTitle() {
    document.title = 'Result Student';
  }

  function navigate(route, pushHistory = true, query = '') {
    const meta = routeMeta[route] || routeMeta.home;
    const targetUrl = meta.path + query;
    const currentUrl = window.location.pathname + window.location.search;

    if (pushHistory && currentUrl !== targetUrl) {
      window.history.pushState({ route }, '', targetUrl);
    } else if (currentUrl !== targetUrl) {
      window.history.replaceState({ route }, '', targetUrl);
    }

    state.route = route;
    syncTitle(route);
    render();
  }

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('home');
    }
  }

  function closeModal() {
    modalRoot.innerHTML = '';
  }

  function renderBottomNav(activeKey) {
    const tabs = [
      { key: 'home', label: 'Home', icon: Icons.navHome },
      { key: 'exam', label: 'Exam', icon: Icons.navExam },
      { key: 'groups', label: 'Groups', icon: Icons.navGroups },
      { key: 'booked-lessons', label: 'Support', icon: Icons.navSupport }
    ];
    return `
      <nav class="bottom-nav">
        ${tabs.map(t => `
          <button class="nav-item ${activeKey === t.key ? 'active' : ''}" data-nav="${t.key}">
            ${t.icon(activeKey === t.key)}
            <span>${t.label}</span>
          </button>
        `).join('')}
      </nav>
    `;
  }

  function renderHeader(title, { back = false, rightHtml = '', leftHtml = '' } = {}) {
    return `
      <header class="top-header">
        <div class="top-header-left">
          ${back ? `<button class="circle-icon-btn" id="btn-back" aria-label="Back">${Icons.back}</button>` : leftHtml}
        </div>
        <div class="top-header-title">${escapeHtml(title)}</div>
        <div class="top-header-right">${rightHtml}</div>
      </header>
    `;
  }

  // 14. Home Dashboard
  async function renderHome() {
    const p = state.profile;
    const slide = heroSlides[state.heroSlide];
    const unread = state.notifications.filter(n => !n.isRead).length;

    appEl.innerHTML = `
      <div class="screen has-bottom-nav">
        <div class="home-header">
          <button class="home-user-trigger" id="btn-open-profile">
            <div class="avatar-square">${escapeHtml(p.initials)}</div>
            <div class="home-user-meta">
              <div class="home-user-name-row">
                <span class="home-user-name">${escapeHtml(p.fullName)}</span>
                ${Icons.sealBadge(p.isVerified)}
              </div>
              <span class="home-user-phone">${escapeHtml(p.phoneNumber)}</span>
            </div>
          </button>
          <button class="bell-btn" id="btn-notifications" aria-label="Notifications">
            ${Icons.bell}
            ${unread > 0 ? '<span class="bell-dot"></span>' : ''}
          </button>
        </div>

        <div class="hero-wrap">
          <div class="hero-banner" id="hero-banner">
            <div class="hero-banner-brand">RESULT STUDENT</div>
            <div class="hero-banner-body">
              <div class="hero-banner-graphic">${Icons.heroClipboard}</div>
              <div class="hero-banner-copy">
                <div class="hero-banner-eyebrow">${escapeHtml(slide.eyebrow)}</div>
                <div class="hero-banner-headline">${escapeHtml(slide.headline)}</div>
                <div class="hero-banner-sub">${escapeHtml(slide.sub)}</div>
              </div>
            </div>
            <div class="hero-banner-footer">
              <div class="hero-banner-caption">${escapeHtml(slide.caption)}</div>
              <div class="hero-dots">
                ${heroSlides.map((_, idx) => `<button class="hero-dot ${idx === state.heroSlide ? 'active' : ''}" data-slide="${idx}"></button>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="section-title">Useful</div>
        <div class="bento-grid">
          <button class="bento-card tall" id="btn-podcasts">
            <div class="bento-icon-box">${Icons.headphones}</div>
            <div class="bento-label">Podcasts</div>
          </button>
          <button class="bento-card" id="btn-books">
            <div class="bento-icon-box">${Icons.book}</div>
            <div class="bento-label">Books</div>
          </button>
          <button class="bento-card" id="btn-irregular">
            <div class="bento-icon-box">${Icons.irregularVerbs}</div>
            <div class="bento-label">Irregular Verbs</div>
          </button>
          <button class="bento-card" id="btn-vocab">
            <div class="bento-icon-box">${Icons.vocab}</div>
            <div class="bento-label">Vocabulary</div>
          </button>
        </div>
      </div>
      ${renderBottomNav('home')}
    `;

    document.getElementById('btn-open-profile').onclick = () => navigate('profile');
    document.getElementById('btn-notifications').onclick = openNotificationsModal;
    document.getElementById('btn-podcasts').onclick = () => navigate('podcasts');
    document.getElementById('btn-books').onclick = () => navigate('books');
    document.getElementById('btn-irregular').onclick = () => navigate('irregular-verbs');
    document.getElementById('btn-vocab').onclick = () => navigate('vocabulary');
    document.getElementById('hero-banner').onclick = (e) => {
      if (e.target.dataset.slide !== undefined) {
        state.heroSlide = Number(e.target.dataset.slide);
        renderHome();
        return;
      }
      navigate(slide.target);
    };
  }

  // 5. Exam Results
  async function renderExams() {
    appEl.innerHTML = `
      <div class="screen has-bottom-nav">
        ${renderHeader('Exam Results')}
        <div class="page-pad stack-14" id="exams-list">
          <div class="white-card">Loading exams...</div>
        </div>
      </div>
      ${renderBottomNav('exam')}
    `;

    const exams = await Api.getExams();
    const r = 32;
    const c = 2 * Math.PI * r;

    document.getElementById('exams-list').innerHTML = exams.map(ex => {
      const offset = c * (1 - ex.overallScore / 100);
      return `
        <div class="exam-card" data-exam-id="${ex.id}">
          <div>
            <div class="exam-level">${escapeHtml(ex.level)}</div>
            <div class="exam-type">(${escapeHtml(ex.examType)})</div>
            <div class="exam-meta">
              <span class="exam-meta-item">${Icons.calendar} ${escapeHtml(ex.date)}</span>
              <span class="exam-meta-item">${Icons.clock} ${escapeHtml(ex.time)}</span>
            </div>
          </div>
          <div class="score-ring-wrap">
            <svg width="78" height="78" viewBox="0 0 78 78">
              <circle cx="39" cy="39" r="${r}" fill="none" stroke="#EAECEF" stroke-width="6.5"/>
              <circle cx="39" cy="39" r="${r}" fill="none" stroke="#00B82E" stroke-width="6.5"
                stroke-linecap="round"
                stroke-dasharray="${c.toFixed(2)}"
                stroke-dashoffset="${offset.toFixed(2)}"
                transform="rotate(-90 39 39)"/>
            </svg>
            <div class="score-ring-text">
              <span class="score-ring-label">Overall score</span>
              <span class="score-ring-val">${ex.overallScore}%</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.exam-card').forEach(el => {
      el.onclick = () => {
        const exam = exams.find(x => x.id === Number(el.dataset.examId));
        if (exam) openExamDetailModal(exam);
      };
    });
  }

  function openExamDetailModal(exam) {
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header">
            <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
            <div class="verify-title">${escapeHtml(exam.level)} (${escapeHtml(exam.examType)})</div>
          </div>
          <div class="legend-card" style="justify-content:space-between;">
            <div><strong>Listening</strong></div><div><strong>${exam.listeningScore}%</strong></div>
          </div>
          <div class="legend-card" style="justify-content:space-between;">
            <div><strong>Reading</strong></div><div><strong>${exam.readingScore}%</strong></div>
          </div>
          <div class="legend-card" style="justify-content:space-between;">
            <div><strong>Writing</strong></div><div><strong>${exam.writingScore}%</strong></div>
          </div>
          <div class="legend-card" style="justify-content:space-between;">
            <div><strong>Speaking</strong></div><div><strong>${exam.speakingScore}%</strong></div>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);margin:10px 0 18px;">
            <strong>Teacher comment:</strong> ${escapeHtml(exam.teacherComment)}
          </p>
          <button class="primary-btn" id="btn-exam-ok">Close</button>
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
    document.getElementById('btn-exam-ok').onclick = closeModal;
  }

  // 4. Groups
  async function renderGroups() {
    appEl.innerHTML = `
      <div class="screen has-bottom-nav">
        ${renderHeader('Groups')}
        <div class="tabs-bar">
          <button class="tab-btn ${state.groupsTab === 'Active' ? 'active' : ''}" data-gtab="Active">Active</button>
          <button class="tab-btn ${state.groupsTab === 'Finished' ? 'active' : ''}" data-gtab="Finished">Finished</button>
        </div>
        <div class="page-pad stack-14" id="groups-list">
          <div class="white-card">Loading groups...</div>
        </div>
      </div>
      ${renderBottomNav('groups')}
    `;

    document.querySelectorAll('[data-gtab]').forEach(btn => {
      btn.onclick = () => {
        state.groupsTab = btn.dataset.gtab;
        renderGroups();
      };
    });

    const groups = await Api.getGroups(state.groupsTab);
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    document.getElementById('groups-list').innerHTML = groups.length ? groups.map(g => {
      const activeDays = g.scheduleDays.split(',').map(d => d.trim());
      return `
        <div class="white-card">
          <div class="group-header-row">
            <div class="group-badge">${escapeHtml(g.code)}</div>
            <div>
              <div class="group-title">${escapeHtml(g.levelName)}</div>
              <div class="group-subtitle">${escapeHtml(g.title)}</div>
            </div>
          </div>
          <div class="days-row">
            ${allDays.map(d => `<div class="day-pill ${activeDays.includes(d) ? 'active' : ''}">${d}</div>`).join('')}
          </div>
          <div class="group-info-row">
            <span class="group-info-item">${Icons.clock} ${escapeHtml(g.startTime)} — ${escapeHtml(g.endTime)}</span>
            <span class="group-info-item">${Icons.pin} ${escapeHtml(g.classroom)}</span>
          </div>
          <div class="group-teacher-row">
            <div class="teacher-avatar">${escapeHtml(g.teacherInitials)}</div>
            <div class="teacher-name">${escapeHtml(g.teacherName)}</div>
          </div>
        </div>
      `;
    }).join('') : `<div class="empty-state"><div class="empty-state-title">No ${state.groupsTab.toLowerCase()} groups</div></div>`;
  }

  // 6 & 1. Booked Lessons + Legend Modal
  async function renderBookedLessons() {
    appEl.innerHTML = `
      <div class="screen has-bottom-nav">
        ${renderHeader('Booked Lessons', {
          leftHtml: `<button class="circle-icon-btn" id="btn-legend" aria-label="Lesson Legend">${Icons.info}</button>`,
          rightHtml: `
            <button class="circle-icon-btn" id="btn-supports" aria-label="Support Mentors">${Icons.people}</button>
            <button class="circle-icon-btn" id="btn-history" aria-label="History">${Icons.history}</button>
          `
        })}
        <div class="timeline-list" id="lessons-timeline">
          <div class="white-card">Loading slots...</div>
        </div>
        <button class="qr-fab" id="btn-qr-fab" aria-label="QR Check-in">${Icons.qr}</button>
      </div>
      ${renderBottomNav('booked-lessons')}
    `;

    document.getElementById('btn-legend').onclick = openLegendModal;
    document.getElementById('btn-supports').onclick = () => navigate('supports');
    document.getElementById('btn-history').onclick = () => {
      state.lessonsFilter = state.lessonsFilter === 'history' ? null : 'history';
      showToast(state.lessonsFilter ? 'Showing past/booked history' : 'Showing all lesson slots');
      renderBookedLessons();
    };
    document.getElementById('btn-qr-fab').onclick = openQrModal;

    const lessons = await Api.getLessons(state.lessonsFilter);
    document.getElementById('lessons-timeline').innerHTML = lessons.map(slot => {
      const isAvail = slot.status === 'Available';
      const isActive = slot.status === 'Active';
      return `
        <div class="timeline-item">
          <div class="timeline-node ${isAvail ? 'available' : isActive ? 'active' : ''}">
            ${isAvail ? '' : isActive ? '✓' : Icons.lockSmall}
          </div>
          <div class="lesson-card ${slot.status === 'Expired' ? 'expired' : ''}" data-slot-id="${slot.id}" data-status="${slot.status}">
            <div class="lesson-icon-ring ${isAvail ? 'available' : isActive ? 'active' : ''}">
              ${isAvail ? Icons.plusLg : isActive ? '📌' : Icons.lockLg}
            </div>
            <div>
              <div class="lesson-card-title">${escapeHtml(slot.title)}</div>
              <div class="lesson-card-sub">${escapeHtml(slot.subtitle)}</div>
            </div>
            ${isActive ? `<button class="cancel-mini-btn" data-cancel-id="${slot.id}">Cancel</button>` : ''}
          </div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.lesson-card[data-status="Available"]').forEach(card => {
      card.onclick = () => {
        state.selectedSlotId = Number(card.dataset.slotId);
        navigate('supports');
      };
    });

    document.querySelectorAll('[data-cancel-id]').forEach(btn => {
      btn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await Api.cancelLesson(Number(btn.dataset.cancelId));
          showToast('Lesson booking cancelled.');
          renderBookedLessons();
        } catch (err) {
          showToast(err.message, true);
        }
      };
    });
  }

  // 1. Legend Modal
  function openLegendModal() {
    const items = [
      { color: '#00C83C', icon: '📌', title: 'Active Lessons', desc: 'These are the lessons you are scheduled to attend. Please make sure to join and follow the timetable accordingly.' },
      { color: '#1A85FF', icon: '✓', title: 'Attendance Confirmed', desc: 'You have successfully attended the class. Thank you for your participation.' },
      { color: '#E53935', icon: '✕', title: 'Missed Lesson', desc: 'You booked this lesson but did not attend it. This lesson has been marked as absent.' },
      { color: '#FFA726', icon: '🕒', title: 'Late Arrival', desc: 'You attended this lesson but arrived after it started. Try to be on time for the next one.' },
      { color: '#424242', icon: '⊘', title: 'Lesson Deduction', desc: 'This lesson was missed without attendance. One lesson has been deducted from your monthly limit according to the policy.' }
    ];

    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          ${items.map(i => `
            <div class="legend-card">
              <div class="legend-circle" style="background:${i.color}">${i.icon}</div>
              <div>
                <div class="legend-title">${i.title}</div>
                <div class="legend-desc">${i.desc}</div>
              </div>
            </div>
          `).join('')}
          <button class="primary-btn" id="btn-got-it" style="margin-top:6px;">Got it</button>
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-got-it').onclick = closeModal;
  }

  function openQrModal() {
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel" style="text-align:center;">
          <div class="sheet-handle"></div>
          <div class="verify-title" style="margin-bottom:8px;">QR Attendance Check-in</div>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:18px;">
            Show this student pass or scan classroom QR to confirm attendance.
          </p>
          <div style="width:160px;height:160px;margin:0 auto 18px;border:2px dashed #C82B2B;border-radius:20px;display:flex;align-items:center;justify-content:center;color:#C82B2B;">
            ${Icons.qr}
          </div>
          <button class="primary-btn" id="btn-qr-close">Done</button>
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-qr-close').onclick = closeModal;
  }

  // 3. Supports
  async function renderSupports() {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Supports', { back: true })}
        <div class="page-pad stack-12" id="supports-list">
          <div class="white-card">Loading mentors...</div>
        </div>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;

    const mentors = await Api.getSupports();
    document.getElementById('supports-list').innerHTML = mentors.map(m => {
      const initials = m.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
      return `
        <button class="mentor-card" data-mentor-id="${m.id}">
          <div class="mentor-avatar" style="background:${escapeHtml(m.avatarColor)}">${escapeHtml(initials)}</div>
          <div class="mentor-name">${escapeHtml(m.fullName)}</div>
        </button>
      `;
    }).join('');

    document.querySelectorAll('.mentor-card').forEach(btn => {
      btn.onclick = async () => {
        const id = Number(btn.dataset.mentorId);
        state.selectedMentor = mentors.find(m => m.id === id);
        state.mentorAvailability = await Api.getMentorAvailability(id);
        navigate('book-calendar', true, `?mentor=${id}`);
      };
    });
  }

  // 2. Book Lessons / Booking Calendar
  function renderBookCalendar() {
    const m = state.selectedMentor;
    if (!m) {
      navigate('supports', false);
      return;
    }

    const avail = state.mentorAvailability || { availableDates: ['2026-11-27', '2026-11-28'], closedDates: ['2026-11-25', '2026-11-26', '2026-11-29'], timeSlots: ['10:00', '14:00', '15:30'] };
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const y = state.calendarYear;
    const mo = state.calendarMonth;
    const firstDow = (new Date(y, mo, 1).getDay() + 6) % 7; // Monday = 0
    const daysInMonth = new Date(y, mo + 1, 0).getDate();
    const initials = m.fullName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push('<div class="cal-day"></div>');
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `${y}-${String(mo + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isAvail = avail.availableDates.includes(iso);
      const isClosed = avail.closedDates.includes(iso);
      cells.push(`
        <div class="cal-day">
          <button class="cal-day-btn ${isAvail ? 'available' : isClosed ? 'closed' : ''}" data-date="${isAvail ? iso : ''}">${d}</button>
        </div>
      `);
    }

    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Book', { back: true })}
        <div class="page-pad">
          <div class="mentor-card" style="margin-bottom:14px;cursor:default;">
            <div class="mentor-avatar" style="background:${escapeHtml(m.avatarColor)}">${escapeHtml(initials)}</div>
            <div class="mentor-name">${escapeHtml(m.fullName)}</div>
          </div>

          <div class="month-pill">
            <button class="month-nav-btn" id="btn-prev-month">${Icons.chevronLeft}</button>
            <div class="month-label">${monthNames[mo]} ${y}</div>
            <button class="month-nav-btn" id="btn-next-month">${Icons.chevronRightDark}</button>
          </div>

          <div class="calendar-grid">
            ${['M', 'T', 'W', 'T', 'F', 'S', 'S'].map(d => `<div class="cal-dow">${d}</div>`).join('')}
            ${cells.join('')}
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-back').onclick = goBack;
    document.getElementById('btn-prev-month').onclick = () => {
      state.calendarMonth--;
      if (state.calendarMonth < 0) { state.calendarMonth = 11; state.calendarYear--; }
      renderBookCalendar();
    };
    document.getElementById('btn-next-month').onclick = () => {
      state.calendarMonth++;
      if (state.calendarMonth > 11) { state.calendarMonth = 0; state.calendarYear++; }
      renderBookCalendar();
    };

    document.querySelectorAll('.cal-day-btn.available').forEach(btn => {
      btn.onclick = () => openTimeSlotModal(m, btn.dataset.date, avail.timeSlots);
    });
  }

  function openTimeSlotModal(mentor, date, slots) {
    let selectedTime = slots[0];
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header">
            <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
            <div class="verify-title">Select Time · ${escapeHtml(date)}</div>
          </div>
          <p style="font-size:13px;color:var(--text-secondary);margin-bottom:14px;">Mentor: ${escapeHtml(mentor.fullName)}</p>
          <div style="display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px;" id="time-pills">
            ${slots.map((t, idx) => `
              <button class="day-pill ${idx === 0 ? 'active' : ''}" data-time="${t}" style="padding:10px 16px;border:none;cursor:pointer;">${t}</button>
            `).join('')}
          </div>
          <button class="primary-btn" id="btn-confirm-book">Confirm Booking</button>
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
    document.querySelectorAll('[data-time]').forEach(b => {
      b.onclick = () => {
        selectedTime = b.dataset.time;
        document.querySelectorAll('[data-time]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      };
    });
    document.getElementById('btn-confirm-book').onclick = async () => {
      try {
        await Api.bookLesson({
          slotId: state.selectedSlotId,
          mentorId: mentor.id,
          date,
          time: selectedTime
        });
        state.selectedSlotId = null;
        closeModal();
        showToast('Lesson booked successfully!');
        navigate('booked-lessons');
      } catch (err) {
        showToast(err.message, true);
      }
    };
  }

  // 7. Books & 8. Podcasts
  async function renderEmptyResource(title, emptyText, fetchFn) {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader(title, { back: true })}
        <div class="empty-state" id="resource-body">
          ${Icons.panda}
          <div class="empty-state-title">${escapeHtml(emptyText)}</div>
        </div>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;
    await fetchFn();
  }

  // 9. Refer a Friend
  function renderRefer() {
    const p = state.profile;
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Refer a friend', {
          back: true,
          rightHtml: `<button class="circle-icon-btn" id="btn-ref-history" aria-label="Referral History">${Icons.history}</button>`
        })}
        <form class="form-screen" id="refer-form">
          <div>
            <div class="branch-pill-row">
              <div class="branch-pill">
                <span>BRANCH</span>
                <span>${escapeHtml(p.branch)}</span>
              </div>
            </div>
            <div class="field-group">
              <label class="field-label">First name</label>
              <input class="input-box" name="firstName" placeholder="Enter first name" required />
            </div>
            <div class="field-group">
              <label class="field-label">Last name</label>
              <input class="input-box" name="lastName" placeholder="Enter last name" required />
            </div>
            <div class="field-group">
              <label class="field-label">Birth date</label>
              <input class="input-box" name="birthDate" placeholder="dd.MM.yyyy" required />
            </div>
            <div class="field-group">
              <label class="field-label">Phone number</label>
              <div class="phone-row">
                <div class="country-pill">
                  ${Icons.uzFlag}
                  <span>+998</span>
                  <span style="font-size:11px;color:var(--text-secondary);">▾</span>
                </div>
                <input class="input-box" name="phone" placeholder="-- --- -- --" required />
              </div>
            </div>
          </div>
          <button type="submit" class="primary-btn">Submit</button>
        </form>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;
    document.getElementById('btn-ref-history').onclick = openReferralHistoryModal;
    document.getElementById('refer-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        await Api.createReferral({
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          birthDate: fd.get('birthDate'),
          phoneNumber: `+998 ${fd.get('phone')}`
        });
        e.target.reset();
        showToast('Referral submitted successfully!');
      } catch (err) {
        showToast(err.message, true);
      }
    };
  }

  async function openReferralHistoryModal() {
    const list = await Api.getReferrals();
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header">
            <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
            <div class="verify-title">Referral History</div>
          </div>
          ${list.length ? list.map(r => `
            <div class="legend-card" style="justify-content:space-between;align-items:center;">
              <div>
                <div class="legend-title">${escapeHtml(r.firstName)} ${escapeHtml(r.lastName)}</div>
                <div class="legend-desc">${escapeHtml(r.phoneNumber)} · ${escapeHtml(r.branch)}</div>
              </div>
              <span class="day-pill active" style="padding:5px 10px;">${escapeHtml(r.status)}</span>
            </div>
          `).join('') : '<p style="text-align:center;color:var(--text-secondary);padding:24px 0;">No referrals submitted yet.</p>'}
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
  }

  // 10. Change Password
  function renderChangePassword() {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Change Password', { back: true })}
        <form class="form-screen" id="pw-form">
          <div>
            ${[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm Password' }
            ].map(f => `
              <div class="field-group">
                <label class="field-label">${f.label}</label>
                <div class="password-wrap">
                  <input type="password" class="input-box" name="${f.name}" required minlength="6" />
                  <button type="button" class="eye-btn" data-toggle-pw="${f.name}">${Icons.eyeOff}</button>
                </div>
              </div>
            `).join('')}
          </div>
          <button type="submit" class="primary-btn">Change</button>
        </form>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;
    document.querySelectorAll('[data-toggle-pw]').forEach(btn => {
      btn.onclick = () => {
        const input = btn.previousElementSibling;
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        btn.innerHTML = show ? Icons.eye : Icons.eyeOff;
      };
    });
    document.getElementById('pw-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const currentPassword = fd.get('currentPassword');
      const newPassword = fd.get('newPassword');
      const confirmPassword = fd.get('confirmPassword');
      if (newPassword !== confirmPassword) {
        showToast('New password and confirmation do not match.', true);
        return;
      }
      try {
        await Api.changePassword({ currentPassword, newPassword, confirmPassword });
        e.target.reset();
        showToast('Password updated successfully!');
        goBack();
      } catch (err) {
        showToast(err.message, true);
      }
    };
  }

  // 11. Payments
  async function renderPayments() {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Payments', { back: true })}
        <div id="payments-body"><div class="page-pad"><div class="white-card">Loading payments...</div></div></div>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;

    const data = await Api.getPayments();
    const renderTabBody = () => {
      if (state.paymentsTab === 'Pay') {
        return `
          <div class="page-pad">
            <form class="white-card stack-12" id="pay-form">
              <div class="field-group" style="margin-bottom:4px;">
                <label class="field-label">Payment Method</label>
                <select class="input-box" name="method" style="box-shadow:none;border:1px solid var(--border-light);">
                  <option value="PAYME">Payme</option>
                  <option value="CLICK">Click</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>
              <div class="field-group" style="margin-bottom:4px;">
                <label class="field-label">Amount (UZS)</label>
                <input type="number" class="input-box" name="amount" min="1000" step="1000" value="450000" required style="box-shadow:none;border:1px solid var(--border-light);" />
              </div>
              <button type="submit" class="primary-btn">Pay Now</button>
            </form>
          </div>
        `;
      }
      const list = state.paymentsTab === 'Income' ? data.income
        : state.paymentsTab === 'Outcome' ? data.outcome
        : data.transfers;
      if (!list.length) {
        return `<div class="page-pad"><div class="white-card" style="text-align:center;color:var(--text-secondary);">No ${state.paymentsTab.toLowerCase()} records yet.</div></div>`;
      }
      const isOutcome = state.paymentsTab === 'Outcome';
      return `
        <div class="earlier-label">EARLIER</div>
        <div class="page-pad stack-12">
          ${list.map(t => `
            <div class="txn-card">
              <div class="txn-icon-box ${isOutcome ? 'outcome' : ''}">
                ${isOutcome ? Icons.arrowUpRight : Icons.arrowDownLeft}
              </div>
              <div>
                <div class="txn-method">${escapeHtml(t.method)}</div>
                <div class="txn-date">${escapeHtml(t.date)}</div>
              </div>
              <div class="txn-amount-col">
                <div class="txn-amount ${isOutcome ? 'outcome' : ''}">${isOutcome ? '-' : ''}${formatMoney(t.amount)}</div>
                <div class="txn-currency">${escapeHtml(t.currency)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    };

    document.getElementById('payments-body').innerHTML = `
      <div class="payment-card">
        <div class="payment-card-top">
          <div class="payment-holder"><span class="holder-dot"></span> ${escapeHtml(data.studentName)}</div>
          <div class="gold-chip"></div>
        </div>
        <div class="balance-label">Current balance</div>
        <div class="balance-amount">${formatMoney(data.currentBalance)} UZS</div>
        <div class="card-stats-grid">
          <div class="card-stat-col">
            <div class="card-stat-head"><span class="stat-circle">${Icons.arrowDownLeft}</span> DEPOSITED</div>
            <div class="card-stat-val">${formatMoney(data.totalDeposited)} UZS</div>
          </div>
          <div class="card-stat-col">
            <div class="card-stat-head"><span class="stat-circle">${Icons.arrowUpRight}</span> CHARGED</div>
            <div class="card-stat-val">${formatMoney(data.totalCharged)} UZS</div>
          </div>
        </div>
      </div>

      <div class="tabs-bar">
        ${['Income', 'Outcome', 'Pay', 'Transfers'].map(tab => `
          <button class="tab-btn ${state.paymentsTab === tab ? 'active' : ''}" data-ptab="${tab}">${tab}</button>
        `).join('')}
      </div>
      ${renderTabBody()}
    `;

    document.querySelectorAll('[data-ptab]').forEach(btn => {
      btn.onclick = () => {
        state.paymentsTab = btn.dataset.ptab;
        renderPayments();
      };
    });

    const payForm = document.getElementById('pay-form');
    if (payForm) {
      payForm.onsubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        try {
          await Api.makePayment({ method: fd.get('method'), amount: Number(fd.get('amount')) });
          showToast('Payment recorded!');
          state.paymentsTab = 'Income';
          renderPayments();
        } catch (err) {
          showToast(err.message, true);
        }
      };
    }
  }

  // 13 & 12. Profile Settings + Verified Student Modal
  function renderProfile() {
    const p = state.profile;
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Profile', { back: true })}
        <div class="page-pad">
          <div class="profile-hero-card">
            <div class="profile-avatar-lg">${escapeHtml(p.initials)}</div>
            <div class="profile-name-lg">
              ${escapeHtml(p.fullName)}
              ${p.isVerified ? Icons.sealBadge(true) : ''}
            </div>
            <div class="profile-phone-lg">${escapeHtml(p.phoneNumber)}</div>
          </div>

          <div class="group-section-label">Information</div>
          <div class="menu-card">
            <div class="menu-row">
              <div class="menu-icon-box">${Icons.branch}</div>
              <div class="menu-label">Branch</div>
              <div class="menu-value">${escapeHtml(p.branch)}</div>
            </div>
            <div class="menu-row">
              <div class="menu-icon-box">${Icons.level}</div>
              <div class="menu-label">Level</div>
              <div class="menu-value">${escapeHtml(p.level)}</div>
            </div>
            <div class="menu-row">
              <div class="menu-icon-box">${Icons.pulse}</div>
              <div class="menu-label">Status</div>
              <div class="menu-value green">${escapeHtml(p.status)}</div>
            </div>
            <div class="menu-row">
              <div class="menu-icon-box">${Icons.calendar}</div>
              <div class="menu-label">Birthday</div>
              <div class="menu-value">${escapeHtml(p.birthday)}</div>
            </div>
            <button class="menu-row clickable" id="btn-open-verification">
              <div class="menu-icon-box">${Icons.sealOutline.replace('width="46" height="46"', 'width="18" height="18"').replace('#8C6D62', 'currentColor')}</div>
              <div class="menu-label">Verification</div>
              ${Icons.chevronRight}
            </button>
          </div>

          <div class="group-section-label">Settings</div>
          <div class="menu-card">
            <button class="menu-row clickable" id="btn-nav-payments">
              <div class="menu-icon-box">${Icons.dollar}</div>
              <div class="menu-label">Financial Overview</div>
              ${Icons.chevronRight}
            </button>
            <button class="menu-row clickable" id="btn-nav-pw">
              <div class="menu-icon-box">${Icons.lockLg}</div>
              <div class="menu-label">Change Password</div>
              ${Icons.chevronRight}
            </button>
            <button class="menu-row clickable" id="btn-nav-support">
              <div class="menu-icon-box">${Icons.chat}</div>
              <div class="menu-label">Contact Support</div>
              ${Icons.chevronRight}
            </button>
            <button class="menu-row clickable" id="btn-nav-refer">
              <div class="menu-icon-box">${Icons.navSupport(false)}</div>
              <div class="menu-label">Refer a friend</div>
              ${Icons.chevronRight}
            </button>
          </div>

          <button class="primary-btn" id="btn-logout">Log Out</button>
        </div>
      </div>
    `;

    document.getElementById('btn-back').onclick = goBack;
    document.getElementById('btn-open-verification').onclick = openVerificationModal;
    document.getElementById('btn-nav-payments').onclick = () => navigate('payments');
    document.getElementById('btn-nav-pw').onclick = () => navigate('change-password');
    document.getElementById('btn-nav-support').onclick = () => navigate('supports');
    document.getElementById('btn-nav-refer').onclick = () => navigate('refer');
    document.getElementById('btn-logout').onclick = () => {
      Api.setToken(null);
      state.loggedOut = true;
      render();
    };
  }

  // 12. Verified Student Modal
  function openVerificationModal() {
    const p = state.profile;
    const rows = [
      { key: 'instagram', label: 'Instagram', icon: Icons.instagram, val: p.instagram },
      { key: 'telegram', label: 'Telegram', icon: Icons.telegram, val: p.telegram },
      { key: 'location', label: 'Location', icon: Icons.pin, val: p.location }
    ];

    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header">
            <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
            <div class="verify-title">Verified student</div>
          </div>
          <div class="verify-progress">
            ${Icons.sealOutline}
            <div>
              <div style="font-size:15px;font-weight:700;margin-bottom:3px;">${p.verifiedCount} of 3 added</div>
              <div style="font-size:12.5px;color:var(--text-secondary);line-height:1.35;">
                With all three, a badge shows next to your name on your profile and on Home.
              </div>
            </div>
          </div>

          ${rows.map(r => `
            <div class="verify-row">
              <div class="menu-icon-box" style="background:#F8F8FA;">${r.icon}</div>
              <div>
                <div style="font-size:14.5px;font-weight:600;">${r.label}</div>
                <div style="font-size:12.5px;color:var(--text-secondary);">${r.val ? escapeHtml(r.val) : 'Not added'}</div>
              </div>
              <button class="verify-add-btn" data-vkey="${r.key}">${r.val ? 'Edit' : 'Add'}</button>
            </div>
          `).join('')}

          <div class="verify-footer">
            ${Icons.lockSmall}
            <span>Only your school sees your Instagram, Telegram and location.</span>
          </div>
        </div>
      </div>
    `;

    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
    document.querySelectorAll('[data-vkey]').forEach(btn => {
      btn.onclick = async () => {
        const key = btn.dataset.vkey;
        const current = p[key] || '';
        const val = window.prompt(`Enter your ${key}:`, current);
        if (val === null) return;
        try {
          state.profile = await Api.updateVerification({ [key]: val });
          openVerificationModal();
          if (state.route === 'profile') renderProfile();
          showToast('Verification updated!');
        } catch (err) {
          showToast(err.message, true);
        }
      };
    });
  }

  function openEditProfileModal() {
    const p = state.profile;
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header">
            <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
            <div class="verify-title">Edit Profile</div>
          </div>
          <form id="edit-profile-form" class="stack-12">
            <div>
              <label class="field-label">First Name</label>
              <input class="input-box" name="firstName" value="${escapeHtml(p.firstName)}" required style="border:1px solid var(--border-light);box-shadow:none;" />
            </div>
            <div>
              <label class="field-label">Last Name</label>
              <input class="input-box" name="lastName" value="${escapeHtml(p.lastName)}" required style="border:1px solid var(--border-light);box-shadow:none;" />
            </div>
            <div>
              <label class="field-label">Phone Number</label>
              <input class="input-box" name="phoneNumber" value="${escapeHtml(p.phoneNumber)}" required style="border:1px solid var(--border-light);box-shadow:none;" />
            </div>
            <div>
              <label class="field-label">Birthday</label>
              <input class="input-box" name="birthday" value="${escapeHtml(p.birthday)}" required style="border:1px solid var(--border-light);box-shadow:none;" />
            </div>
            <button type="submit" class="primary-btn" style="margin-top:6px;">Save Changes</button>
          </form>
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
    document.getElementById('edit-profile-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        state.profile = await Api.updateProfile({
          firstName: fd.get('firstName'),
          lastName: fd.get('lastName'),
          phoneNumber: fd.get('phoneNumber'),
          birthday: fd.get('birthday')
        });
        closeModal();
        renderProfile();
        showToast('Profile updated!');
      } catch (err) {
        showToast(err.message, true);
      }
    };
  }

  async function openNotificationsModal() {
    const items = await Api.getNotifications();
    state.notifications = items;
    modalRoot.innerHTML = `
      <div class="sheet-backdrop" id="sheet-bg">
        <div class="sheet-panel">
          <div class="sheet-handle"></div>
          <div class="verify-header" style="justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:12px;">
              <button class="circle-icon-btn" id="btn-close-sheet">${Icons.close}</button>
              <div class="verify-title">Notifications</div>
            </div>
            <button class="verify-add-btn" id="btn-mark-read">Mark all read</button>
          </div>
          ${items.map(n => `
            <div class="legend-card" style="flex-direction:column;gap:4px;">
              <div style="display:flex;justify-content:space-between;width:100%;">
                <div class="legend-title">${escapeHtml(n.title)}</div>
                <span style="font-size:11px;color:var(--text-secondary);">${escapeHtml(n.createdAt)}</span>
              </div>
              <div class="legend-desc">${escapeHtml(n.message)}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    document.getElementById('sheet-bg').onclick = (e) => { if (e.target.id === 'sheet-bg') closeModal(); };
    document.getElementById('btn-close-sheet').onclick = closeModal;
    document.getElementById('btn-mark-read').onclick = async () => {
      await Api.markNotificationsRead();
      state.notifications.forEach(n => n.isRead = true);
      closeModal();
      renderHome();
    };
  }

  const vocabLevels = [
    { key: 'Beginner', route: 'vocabulary-beginner', code: 'A1', subtitle: 'Starter everyday words' },
    { key: 'Elementary', route: 'vocabulary-elementary', code: 'A2', subtitle: 'Basic communication words' },
    { key: 'Pre-Intermediate', route: 'vocabulary-pre-intermediate', code: 'B1', subtitle: 'Core daily & study vocabulary' },
    { key: 'Intermediate', route: 'vocabulary-intermediate', code: 'B1+', subtitle: 'Academic & fluent expressions' },
    { key: 'Upper-Intermediate', route: 'vocabulary-upper-intermediate', code: 'B2', subtitle: 'Advanced topics & nuances' },
    { key: 'Advanced', route: 'vocabulary-advanced', code: 'C1', subtitle: 'Complex academic & fluent mastery' }
  ];

  async function renderVocabularyHome() {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Vocabulary', { back: true })}
        <div class="page-pad stack-12" id="vocab-levels-list">
          <div class="white-card">Loading levels...</div>
        </div>
      </div>
    `;
    document.getElementById('btn-back').onclick = goBack;

    const counts = await Api.getVocabularyCounts();
    const countMap = Object.fromEntries(counts.map(c => [c.level.toLowerCase(), c.count]));

    document.getElementById('vocab-levels-list').innerHTML = vocabLevels.map(lvl => {
      const cnt = countMap[lvl.key.toLowerCase()] || 0;
      return `
        <button class="vocab-level-card" data-vroute="${lvl.route}">
          <div class="vocab-level-badge">${lvl.code}</div>
          <div style="flex:1;">
            <div class="group-title" style="margin-bottom:2px;">${lvl.key}</div>
            <div class="group-subtitle">${lvl.subtitle} · ${cnt} ${cnt === 1 ? 'word' : 'words'}</div>
          </div>
          ${Icons.chevronRight}
        </button>
      `;
    }).join('');

    document.querySelectorAll('[data-vroute]').forEach(btn => {
      btn.onclick = () => {
        state.vocabPosFilter = 'all';
        navigate(btn.dataset.vroute);
      };
    });
  }

  async function renderVocabularyLevel(levelName) {
    const params = new URLSearchParams(window.location.search);
    const selectedUnit = params.get('unit');

    if (!selectedUnit) {
      appEl.innerHTML = `
        <div class="screen">
          ${renderHeader(`${levelName} · Units`, { back: true })}
          <div class="page-pad stack-12" id="vocab-units-list">
            <div class="white-card">Loading units...</div>
          </div>
        </div>
      `;
      document.getElementById('btn-back').onclick = goBack;

      const units = await Api.getVocabularyUnits(levelName);
      const unitsEl = document.getElementById('vocab-units-list');
      if (!units.length) {
        unitsEl.innerHTML = `
          <div class="empty-state" style="padding-top:48px;">
            ${Icons.panda}
            <div class="empty-state-title">No units in ${escapeHtml(levelName)} yet</div>
          </div>
        `;
        return;
      }

      unitsEl.innerHTML = units.map(u => {
        const badge = u.unit.replace('Unit ', 'U');
        return `
          <button class="vocab-level-card" data-unit="${escapeHtml(u.unit)}">
            <div class="vocab-level-badge">${escapeHtml(badge)}</div>
            <div style="flex:1;">
              <div class="group-title" style="margin-bottom:2px;">${escapeHtml(u.unit)}</div>
              <div class="group-subtitle">${u.count} ${u.count === 1 ? 'word' : 'words'}</div>
            </div>
            ${Icons.chevronRight}
          </button>
        `;
      }).join('');

      document.querySelectorAll('[data-unit]').forEach(btn => {
        btn.onclick = () => {
          state.vocabPosFilter = 'all';
          state.vocabPage = 1;
          navigate(state.route, true, `?unit=${encodeURIComponent(btn.dataset.unit)}`);
        };
      });
      return;
    }

    const posFilter = state.vocabPosFilter || 'all';
    const currentPage = state.vocabPage || 1;
    const pageSize = 20;
    const posTabs = [
      { key: 'all', label: 'All' },
      { key: 'verb', label: 'Verb' },
      { key: 'noun', label: 'Noun' },
      { key: 'adj', label: 'Adj' },
      { key: 'adv', label: 'Adv' }
    ];

    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader(`${levelName} · ${selectedUnit}`, { back: true })}
        <div class="pos-filter-row">
          ${posTabs.map(t => `<button class="pos-chip ${posFilter === t.key ? 'active' : ''}" data-pos="${t.key}">${t.label}</button>`).join('')}
        </div>
        <div class="page-pad stack-12" id="vocab-words-list">
          <div class="white-card">Loading words...</div>
        </div>
      </div>
    `;

    document.getElementById('btn-back').onclick = goBack;
    document.querySelectorAll('[data-pos]').forEach(btn => {
      btn.onclick = () => {
        state.vocabPosFilter = btn.dataset.pos;
        state.vocabPage = 1;
        renderVocabularyLevel(levelName);
      };
    });

    const words = await Api.getVocabulary(levelName, selectedUnit, posFilter);
    const listEl = document.getElementById('vocab-words-list');
    if (!words.length) {
      listEl.innerHTML = `
        <div class="empty-state" style="padding-top:48px;">
          ${Icons.panda}
          <div class="empty-state-title">No ${posFilter === 'all' ? '' : posFilter + ' '}words yet</div>
        </div>
      `;
      return;
    }

    const totalPages = Math.ceil(words.length / pageSize);
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const pageWords = words.slice((safePage - 1) * pageSize, safePage * pageSize);

    const cardsHtml = pageWords.map(w => {
      const pos = (w.partOfSpeech || 'noun').toLowerCase();
      const posClass = pos === 'phr v' ? 'verb' : pos;
      return `
        <div class="vocab-word-card">
          <div class="vocab-word-top">
            <div style="display:flex;align-items:center;gap:10px;flex:1;min-width:0;">
              <button type="button" class="speak-btn" data-speak="${escapeHtml(w.word)}" aria-label="Pronounce ${escapeHtml(w.word)}">${Icons.speaker}</button>
              <div style="min-width:0;">
                <span class="vocab-word-main">${escapeHtml(w.word)}</span>
                ${w.phonetic ? `<span class="vocab-phonetic"> ${escapeHtml(w.phonetic)}</span>` : ''}
              </div>
            </div>
            <span class="vocab-pos-tag ${escapeHtml(posClass)}">${escapeHtml(pos)}</span>
          </div>
          <div class="vocab-translation">${escapeHtml(w.translation)}</div>
          ${w.example ? `<div class="vocab-example">${escapeHtml(w.example)}</div>` : ''}
        </div>
      `;
    }).join('');

    const paginationHtml = totalPages > 1 ? `
      <div class="pagination-bar">
        <button class="page-num-btn" data-page="${safePage - 1}" ${safePage === 1 ? 'disabled' : ''}>‹</button>
        ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
          <button class="page-num-btn ${p === safePage ? 'active' : ''}" data-page="${p}">${p}</button>
        `).join('')}
        <button class="page-num-btn" data-page="${safePage + 1}" ${safePage === totalPages ? 'disabled' : ''}>Next ›</button>
      </div>
    ` : '';

    listEl.innerHTML = cardsHtml + paginationHtml;

    document.querySelectorAll('[data-speak]').forEach(btn => {
      btn.onclick = () => speakWord(btn.dataset.speak, btn);
    });

    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.onclick = () => {
        const target = Number(btn.dataset.page);
        if (target >= 1 && target <= totalPages && target !== safePage) {
          state.vocabPage = target;
          renderVocabularyLevel(levelName).then(() => {
            const scr = appEl.querySelector('.screen');
            if (scr) scr.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }
      };
    });
  }

  function speakWord(text, btn) {
    if (!('speechSynthesis' in window)) {
      showToast('Browser does not support speech synthesis.', true);
      return;
    }
    window.speechSynthesis.cancel();

    const isSlow = btn.dataset.nextSlow === '1';
    document.querySelectorAll('.speak-btn').forEach(el => {
      el.classList.remove('speaking');
      if (el !== btn) delete el.dataset.nextSlow;
    });
    btn.dataset.nextSlow = isSlow ? '0' : '1';

    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang === 'en-GB') || voices.find(v => v.lang.startsWith('en'));
    if (enVoice) utter.voice = enVoice;
    utter.lang = 'en-GB';
    utter.rate = isSlow ? 0.55 : 0.95;

    btn.classList.add('speaking');
    utter.onend = () => btn.classList.remove('speaking');
    utter.onerror = () => btn.classList.remove('speaking');
    window.speechSynthesis.speak(utter);
  }

  const irregularVerbsData = [
    ['be', 'was / were', 'been', 'bo‘lmoq'],
    ['become', 'became', 'become', 'aylanmoq, bo‘lmoq'],
    ['begin', 'began', 'begun', 'boshlamoq'],
    ['bend', 'bent', 'bent', 'egmoq'],
    ['bite', 'bit', 'bitten', 'tishlamoq'],
    ['blow', 'blew', 'blown', 'puflamoq, esmoq'],
    ['break', 'broke', 'broken', 'sindirmoq'],
    ['bring', 'brought', 'brought', 'olib kelmoq'],
    ['build', 'built', 'built', 'qurmoq'],
    ['burn', 'burned / burnt', 'burned / burnt', 'yonmoq, kuydirmoq'],
    ['buy', 'bought', 'bought', 'sotib olmoq'],
    ['can', 'could', 'been able to', 'qila olmoq'],
    ['catch', 'caught', 'caught', 'tutib olmoq'],
    ['choose', 'chose', 'chosen', 'tanlamoq'],
    ['come', 'came', 'come', 'kelmoq'],
    ['cost', 'cost', 'cost', 'turmoq (narx)'],
    ['cut', 'cut', 'cut', 'kesmoq'],
    ['do', 'did', 'done', 'qilmoq, bajarmoq'],
    ['draw', 'drew', 'drawn', 'chizmoq'],
    ['drink', 'drank', 'drunk', 'ichmoq'],
    ['drive', 'drove', 'driven', 'haydamoq'],
    ['eat', 'ate', 'eaten', 'yemoq'],
    ['fall', 'fell', 'fallen', 'yiqilmoq, tushmoq'],
    ['feel', 'felt', 'felt', 'his qilmoq'],
    ['fight', 'fought', 'fought', 'kurashmoq'],
    ['find', 'found', 'found', 'topmoq'],
    ['fly', 'flew', 'flown', 'uchmoq'],
    ['forget', 'forgot', 'forgotten', 'unutmoq'],
    ['get', 'got', 'got', 'olmoq'],
    ['give', 'gave', 'given', 'bermoq'],
    ['go', 'went', 'gone', 'bormoq'],
    ['grow', 'grew', 'grown', 'o‘smoq'],
    ['hang', 'hung', 'hung', 'osmoq'],
    ['have', 'had', 'had', 'ega bo‘lmoq'],
    ['hear', 'heard', 'heard', 'eshitmoq'],
    ['hide', 'hid', 'hidden', 'yashirmoq'],
    ['hit', 'hit', 'hit', 'urmoq'],
    ['keep', 'kept', 'kept', 'saqlamoq'],
    ['know', 'knew', 'known', 'bilmoq'],
    ['lay', 'laid', 'laid', 'qo‘ymoq, yotqizmoq'],
    ['lead', 'led', 'led', 'yetaklamoq, boshqarmoq'],
    ['learn', 'learned / learnt', 'learned / learnt', 'o‘rganmoq'],
    ['leave', 'left', 'left', 'tark etmoq, jo‘namoq'],
    ['lend', 'lent', 'lent', 'qarz bermoq'],
    ['lose', 'lost', 'lost', 'yo‘qotmoq'],
    ['make', 'made', 'made', 'yasamoq, qilmoq'],
    ['mean', 'meant', 'meant', 'anglatmoq'],
    ['meet', 'met', 'met', 'uchrashmoq'],
    ['overcome', 'overcame', 'overcome', 'yengib o‘tmoq'],
    ['pay', 'paid', 'paid', 'to‘lamoq'],
    ['put', 'put', 'put', 'qo‘ymoq'],
    ['read', 'read', 'read', 'o‘qimoq'],
    ['ride', 'rode', 'ridden', 'minmoq'],
    ['ring', 'rang', 'rung', 'jiringlamoq'],
    ['run', 'ran', 'run', 'yugurmoq'],
    ['say', 'said', 'said', 'aytmoq'],
    ['see', 'saw', 'seen', 'ko‘rmoq'],
    ['sell', 'sold', 'sold', 'sotmoq'],
    ['send', 'sent', 'sent', 'yubormoq'],
    ['set', 'set', 'set', 'o‘rnatmoq, qo‘ymoq'],
    ['shake', 'shook', 'shaken', 'silkitmoq'],
    ['shine', 'shone', 'shone', 'porlamoq, nur sochmoq'],
    ['shoot', 'shot', 'shot', 'otmoq, suratga olmoq'],
    ['show', 'showed', 'shown / showed', 'ko‘rsatmoq'],
    ['shut', 'shut', 'shut', 'yopmoq'],
    ['sing', 'sang', 'sung', 'kuylamoq'],
    ['sink', 'sank', 'sunk', 'cho‘kmoq'],
    ['sit', 'sat', 'sat', 'o‘tirmoq'],
    ['sleep', 'slept', 'slept', 'uxlamoq'],
    ['smell', 'smelled / smelt', 'smelled / smelt', 'hidlamoq'],
    ['speak', 'spoke', 'spoken', 'gapirmoq'],
    ['spell', 'spelled / spelt', 'spelled / spelt', 'harflab aytmoq / yozmoq'],
    ['spend', 'spent', 'spent', 'sarflamoq'],
    ['spill', 'spilled / spilt', 'spilled / spilt', 'to‘kmoq, to‘kilib ketmoq'],
    ['stand', 'stood', 'stood', 'turmoq'],
    ['steal', 'stole', 'stolen', 'o‘g‘irlamoq'],
    ['swim', 'swam', 'swum', 'suzmoq'],
    ['take', 'took', 'taken', 'olmoq'],
    ['teach', 'taught', 'taught', 'o‘qitmoq'],
    ['tell', 'told', 'told', 'aytib bermoq'],
    ['think', 'thought', 'thought', 'o‘ylamoq'],
    ['throw', 'threw', 'thrown', 'otmoq, uloqtirmoq'],
    ['understand', 'understood', 'understood', 'tushunmoq'],
    ['wake', 'woke', 'woken', 'uyg‘onmoq'],
    ['wear', 'wore', 'worn', 'kiymoq'],
    ['win', 'won', 'won', 'g‘alaba qozonmoq'],
    ['write', 'wrote', 'written', 'yozmoq']
  ];

  function renderIrregularVerbs() {
    const query = (state.irregularQuery || '').trim().toLowerCase();
    const filtered = query
      ? irregularVerbsData.filter(v => v.some(part => part.toLowerCase().includes(query)))
      : irregularVerbsData;

    const pageSize = 20;
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(Math.max(1, state.irregularPage || 1), totalPages);
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Irregular Verbs', { back: true })}
        <div class="page-pad" style="padding-bottom:10px;">
          <input class="input-box" id="irregular-search" placeholder="Search verb (e.g. go, went, bormoq)..." value="${escapeHtml(state.irregularQuery || '')}" />
        </div>
        <div class="page-pad stack-12">
          ${pageItems.length ? pageItems.map(([v1, v2, v3, tr]) => {
            const speakText = `${v1}, ${v2.replace(' / ', ', ')}, ${v3.replace(' / ', ', ')}`;
            return `
              <div class="vocab-word-card">
                <div class="vocab-word-top">
                  <div style="display:flex;align-items:center;gap:10px;flex:1;">
                    <button type="button" class="speak-btn" data-speak="${escapeHtml(speakText)}" aria-label="Pronounce ${escapeHtml(v1)}">${Icons.speaker}</button>
                    <div class="vocab-translation">${escapeHtml(tr)}</div>
                  </div>
                </div>
                <div class="verb-forms-row">
                  <div class="verb-form-pill"><span class="verb-form-label">V1</span><span class="verb-form-val">${escapeHtml(v1)}</span></div>
                  <div class="verb-form-pill"><span class="verb-form-label">V2</span><span class="verb-form-val">${escapeHtml(v2)}</span></div>
                  <div class="verb-form-pill"><span class="verb-form-label">V3</span><span class="verb-form-val">${escapeHtml(v3)}</span></div>
                </div>
              </div>
            `;
          }).join('') : `<div class="empty-state" style="padding-top:40px;">${Icons.panda}<div class="empty-state-title">No verbs found</div></div>`}
          ${totalPages > 1 ? `
            <div class="pagination-bar">
              <button class="page-num-btn" data-vpage="${safePage - 1}" ${safePage === 1 ? 'disabled' : ''}>‹</button>
              ${Array.from({ length: totalPages }, (_, i) => i + 1).map(p => `
                <button class="page-num-btn ${p === safePage ? 'active' : ''}" data-vpage="${p}">${p}</button>
              `).join('')}
              <button class="page-num-btn" data-vpage="${safePage + 1}" ${safePage === totalPages ? 'disabled' : ''}>Next ›</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.getElementById('btn-back').onclick = goBack;
    const searchEl = document.getElementById('irregular-search');
    searchEl.oninput = (e) => {
      state.irregularQuery = e.target.value;
      state.irregularPage = 1;
      renderIrregularVerbs();
      const el = document.getElementById('irregular-search');
      if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); }
    };

    document.querySelectorAll('[data-speak]').forEach(btn => {
      btn.onclick = () => speakWord(btn.dataset.speak, btn);
    });

    document.querySelectorAll('[data-vpage]').forEach(btn => {
      btn.onclick = () => {
        const target = Number(btn.dataset.vpage);
        if (target >= 1 && target <= totalPages && target !== safePage) {
          state.irregularPage = target;
          renderIrregularVerbs();
          const scr = appEl.querySelector('.screen');
          if (scr) scr.scrollTo({ top: 0, behavior: 'smooth' });
        }
      };
    });
  }

  function renderLogin() {
    appEl.innerHTML = `
      <div class="screen">
        ${renderHeader('Result Student')}
        <form class="form-screen" id="login-form">
          <div>
            <div class="profile-hero-card">
              <div class="profile-avatar-lg">RS</div>
              <div class="profile-name-lg">Welcome Back</div>
              <div class="profile-phone-lg">Sign in to your student account</div>
            </div>
            <div class="field-group">
              <label class="field-label">Phone Number</label>
              <input class="input-box" name="phoneNumber" value="+998 (99) 191 93 77" required />
            </div>
            <div class="field-group">
              <label class="field-label">Password</label>
              <input type="password" class="input-box" name="password" value="123456" required />
            </div>
          </div>
          <button type="submit" class="primary-btn">Log In</button>
        </form>
      </div>
    `;
    document.getElementById('login-form').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const res = await Api.login(fd.get('phoneNumber'), fd.get('password'));
        Api.setToken(res.token);
        state.profile = res.student;
        state.loggedOut = false;
        state.route = 'home';
        render();
      } catch (err) {
        showToast(err.message, true);
      }
    };
  }

  async function render() {
    if (state.loggedOut) {
      renderLogin();
      return;
    }

    switch (state.route) {
      case 'home': await renderHome(); break;
      case 'exam': await renderExams(); break;
      case 'groups': await renderGroups(); break;
      case 'booked-lessons': await renderBookedLessons(); break;
      case 'supports': await renderSupports(); break;
      case 'book-calendar': renderBookCalendar(); break;
      case 'books': await renderEmptyResource('Books', 'No books yet', Api.getBooks); break;
      case 'podcasts': await renderEmptyResource('Podcasts', 'No podcasts yet', Api.getPodcasts); break;
      case 'refer': renderRefer(); break;
      case 'change-password': renderChangePassword(); break;
      case 'payments': await renderPayments(); break;
      case 'profile': renderProfile(); break;
      case 'vocabulary': await renderVocabularyHome(); break;
      case 'vocabulary-beginner': await renderVocabularyLevel('Beginner'); break;
      case 'vocabulary-elementary': await renderVocabularyLevel('Elementary'); break;
      case 'vocabulary-pre-intermediate': await renderVocabularyLevel('Pre-Intermediate'); break;
      case 'vocabulary-intermediate': await renderVocabularyLevel('Intermediate'); break;
      case 'vocabulary-upper-intermediate': await renderVocabularyLevel('Upper-Intermediate'); break;
      case 'vocabulary-advanced': await renderVocabularyLevel('Advanced'); break;
      case 'irregular-verbs': renderIrregularVerbs(); break;
      default: await renderHome();
    }

    document.querySelectorAll('[data-nav]').forEach(btn => {
      btn.onclick = () => navigate(btn.dataset.nav, true);
    });
  }

  async function ensureBookCalendarMentor() {
    if (!state.selectedMentor) {
      const params = new URLSearchParams(window.location.search);
      const mentorId = Number(params.get('mentor'));
      if (mentorId) {
        const data = await Api.getMentorAvailability(mentorId);
        state.selectedMentor = data.mentor;
        state.mentorAvailability = data;
      }
    }
  }

  window.addEventListener('popstate', async () => {
    closeModal();
    state.route = getRouteFromLocation();
    syncTitle(state.route);
    if (state.route === 'book-calendar') {
      await ensureBookCalendarMentor();
    }
    render();
  });

  async function init() {
    await Api.ensureSession();
    const [profile, notifications] = await Promise.all([
      Api.getProfile(),
      Api.getNotifications()
    ]);
    state.profile = profile;
    state.notifications = notifications;

    const initialRoute = getRouteFromLocation();
    if (initialRoute === 'book-calendar') {
      await ensureBookCalendarMentor();
    }
    const meta = routeMeta[initialRoute] || routeMeta.home;
    const query = window.location.search || '';
    if (window.location.pathname === '/' || window.location.pathname === '/result' || window.location.pathname === '/result/') {
      window.history.replaceState({ route: initialRoute }, '', meta.path);
    } else {
      window.history.replaceState({ route: initialRoute }, '', meta.path + query);
    }
    state.route = initialRoute;
    syncTitle(initialRoute);
    render();
  }

  function hideSplash() {
    const splash = document.getElementById('splash-screen');
    if (splash) {
      setTimeout(() => {
        splash.classList.add('hide');
        setTimeout(() => splash.remove(), 380);
      }, 950);
    }
  }

  init()
    .catch(err => {
      appEl.innerHTML = `<div class="page-pad"><div class="white-card">Failed to load: ${escapeHtml(err.message)}</div></div>`;
    })
    .finally(hideSplash);
})();
