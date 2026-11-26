window.Api = (() => {
  const TOKEN_KEY = 'result_student_jwt';
  let offlineMode = false;
  let vocabCache = null;

  async function loadVocabCache() {
    if (vocabCache) return vocabCache;
    try {
      const res = await fetch('/data/vocabulary.json');
      vocabCache = res.ok ? await res.json() : [];
    } catch {
      vocabCache = [];
    }
    return vocabCache;
  }

  const fallbackStore = {
    profile: {
      id: 1,
      firstName: 'Azizbek',
      lastName: 'Karimov',
      fullName: 'Azizbek Karimov',
      initials: 'AK',
      phoneNumber: '+998 (90) 452 18 64',
      branch: 'Saxovat',
      level: 'N/A',
      status: 'Studying',
      birthday: '14.05.2008',
      instagram: null,
      telegram: null,
      location: null,
      verifiedCount: 0,
      isVerified: false
    },
    notifications: [
      { id: 1, title: 'Mid Term Exam Result Published', message: 'Your Inter (Mid Term) score is 70%. Check the Exam tab for details.', createdAt: '13.11.2026', isRead: false },
      { id: 2, title: 'Support Slots Open', message: '2 support lesson slots are available for Nov 23–29.', createdAt: '23.11.2026', isRead: false }
    ],
    exams: [
      { id: 1, level: 'Inter', examType: 'Mid Term', date: '13.11.2026', time: '00:00', overallScore: 70, listeningScore: 74, readingScore: 68, writingScore: 66, speakingScore: 72, teacherComment: 'Good progress in speaking and listening.' },
      { id: 2, level: 'Pre', examType: 'Final', date: '21.09.2026', time: '00:00', overallScore: 70, listeningScore: 70, readingScore: 72, writingScore: 68, speakingScore: 70, teacherComment: 'Ready to advance to Intermediate level.' }
    ],
    groups: [
      { id: 1, code: 'IN', levelName: 'Intermediate', title: 'MR OTABEKJON STANDARD INTERMEDIATE M/W/F 15:30', scheduleDays: 'Mon,Wed,Fri', startTime: '15:30', endTime: '17:00', classroom: 'Classroom 7', teacherName: 'Otabekjon Abdullayev', teacherInitials: 'OA', status: 'Active' },
      { id: 2, code: 'PR', levelName: 'Pre-Intermediate', title: 'MR OTABEKJON PRE-INTERMEDIATE M/W/F 14:00', scheduleDays: 'Mon,Wed,Fri', startTime: '14:00', endTime: '15:30', classroom: 'Classroom 4', teacherName: 'Otabekjon Abdullayev', teacherInitials: 'OA', status: 'Finished' }
    ],
    supports: [
      'Charos Ibroximova', 'Dilafruz Yo\'ldosheva', 'Dilobar Abdurazzoqova',
      'Fotima Abdug\'aniyeva', 'Ma’mura Ermatova', 'Marjona Xojimurodova',
      'Sabohat Temirova', 'Shahzoda Begaliyeva', 'Shaxzoda Saydimqulova',
      'Shoxjahon Usmonaliyev', 'Ulug\'bek Bultakov'
    ].map((fullName, idx) => ({
      id: idx + 1,
      fullName,
      avatarColor: ['#D94E67', '#6B7280', '#4A7C59', '#3B6E8C', '#8B5A2B', '#C06C84', '#4F6D7A', '#9B5DE5', '#B56576', '#355070', '#6D597A'][idx]
    })),
    lessons: [
      ...Array.from({ length: 8 }, (_, i) => ({ id: i + 1, status: 'Expired', title: 'Expired', subtitle: 'This slot has expired and is no longer available.' })),
      { id: 9, status: 'Available', title: 'Book a lesson · Nov 23–29', subtitle: 'You can book a lesson for this slot.' },
      { id: 10, status: 'Available', title: 'Book a lesson · Nov 23–29', subtitle: 'You can book a lesson for this slot.' }
    ],
    payments: {
      studentName: 'AZIZBEK KARIMOV',
      currentBalance: 0,
      totalDeposited: 1345000,
      totalCharged: 1345000,
      income: [
        { id: 1, type: 'Income', method: 'CASH', date: '04.11.2026', amount: 450000, currency: 'UZS' },
        { id: 2, type: 'Income', method: 'CASH', date: '14.10.2026', amount: 445000, currency: 'UZS' },
        { id: 3, type: 'Income', method: 'CASH', date: '08.09.2026', amount: 450000, currency: 'UZS' }
      ],
      outcome: [
        { id: 4, type: 'Outcome', method: 'TUITION', date: '04.11.2026', amount: 450000, currency: 'UZS' },
        { id: 5, type: 'Outcome', method: 'TUITION', date: '14.10.2026', amount: 445000, currency: 'UZS' },
        { id: 6, type: 'Outcome', method: 'TUITION', date: '08.09.2026', amount: 450000, currency: 'UZS' }
      ],
      transfers: []
    },
    referrals: []
  };

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function handleOffline(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const body = options.body ? JSON.parse(options.body) : {};
    const u = new URL(url, window.location.origin);
    const path = u.pathname;

    if (path === '/api/auth/login') return { token: 'demo-token', student: fallbackStore.profile };
    if (path === '/api/auth/change-password') return { message: 'Password updated successfully.' };
    if (path === '/api/profile' && method === 'GET') return fallbackStore.profile;
    if (path === '/api/profile' && method === 'PUT') {
      Object.assign(fallbackStore.profile, body, { fullName: `${body.firstName} ${body.lastName}` });
      return fallbackStore.profile;
    }
    if (path === '/api/profile/verification' && method === 'PUT') {
      Object.assign(fallbackStore.profile, body);
      const c = ['instagram', 'telegram', 'location'].filter(k => fallbackStore.profile[k]).length;
      fallbackStore.profile.verifiedCount = c;
      fallbackStore.profile.isVerified = c === 3;
      return fallbackStore.profile;
    }
    if (path === '/api/profile/notifications') return fallbackStore.notifications;
    if (path === '/api/profile/notifications/read-all') {
      fallbackStore.notifications.forEach(n => n.isRead = true);
      return {};
    }
    if (path === '/api/exams') return fallbackStore.exams;
    if (path === '/api/groups') {
      const st = (u.searchParams.get('status') || 'Active').toLowerCase();
      return fallbackStore.groups.filter(g => g.status.toLowerCase() === st);
    }
    if (path === '/api/supports') return fallbackStore.supports;
    if (path.startsWith('/api/supports/') && path.endsWith('/availability')) {
      const id = Number(path.split('/')[3]);
      return {
        mentor: fallbackStore.supports.find(m => m.id === id) || fallbackStore.supports[0],
        availableDates: ['2026-11-27', '2026-11-28'],
        closedDates: ['2026-11-25', '2026-11-26', '2026-11-29'],
        timeSlots: ['10:00', '11:30', '14:00', '15:30', '17:00']
      };
    }
    if (path === '/api/lessons') {
      const f = u.searchParams.get('filter');
      return f === 'history' ? fallbackStore.lessons.filter(l => l.status !== 'Available') : fallbackStore.lessons;
    }
    if (path === '/api/lessons/book' && method === 'POST') {
      const slot = fallbackStore.lessons.find(l => l.status === 'Available');
      const mentor = fallbackStore.supports.find(m => m.id === body.mentorId);
      if (slot && mentor) {
        slot.status = 'Active';
        slot.title = `${mentor.fullName} · ${body.date}`;
        slot.subtitle = `Scheduled at ${body.time} · Academic Support`;
      }
      return slot || {};
    }
    if (path.startsWith('/api/lessons/') && method === 'DELETE') {
      const id = Number(path.split('/')[3]);
      const slot = fallbackStore.lessons.find(l => l.id === id);
      if (slot) {
        slot.status = 'Available';
        slot.title = 'Book a lesson · Nov 23–29';
        slot.subtitle = 'You can book a lesson for this slot.';
      }
      return slot || {};
    }
    if (path === '/api/payments') return fallbackStore.payments;
    if (path === '/api/payments/pay' && method === 'POST') {
      const txn = { id: Date.now(), type: 'Income', method: (body.method || 'PAYME').toUpperCase(), date: '26.11.2026', amount: Number(body.amount), currency: 'UZS' };
      fallbackStore.payments.income.unshift(txn);
      fallbackStore.payments.totalDeposited += txn.amount;
      fallbackStore.payments.currentBalance += txn.amount;
      return txn;
    }
    if (path === '/api/referrals' && method === 'GET') return fallbackStore.referrals;
    if (path === '/api/referrals' && method === 'POST') {
      const r = { ...body, branch: fallbackStore.profile.branch, status: 'Pending' };
      fallbackStore.referrals.unshift(r);
      return r;
    }
    if (path === '/api/resources/vocabulary/counts') {
      const all = await loadVocabCache();
      const map = {};
      all.forEach(w => { map[w.level] = (map[w.level] || 0) + 1; });
      return Object.entries(map).map(([level, count]) => ({ level, count }));
    }
    if (path === '/api/resources/vocabulary/units') {
      const all = await loadVocabCache();
      const lvl = (u.searchParams.get('level') || '').toLowerCase();
      const map = new Map();
      all.filter(w => w.level.toLowerCase() === lvl).forEach(w => {
        map.set(w.unit, (map.get(w.unit) || 0) + 1);
      });
      return Array.from(map.entries()).map(([unit, count]) => ({ unit, count }));
    }
    if (path === '/api/resources/vocabulary') {
      const all = await loadVocabCache();
      const lvl = (u.searchParams.get('level') || '').toLowerCase();
      const unit = (u.searchParams.get('unit') || '').toLowerCase();
      const pos = (u.searchParams.get('pos') || 'all').toLowerCase();
      return all.filter(w => {
        if (lvl && w.level.toLowerCase() !== lvl) return false;
        if (unit && w.unit.toLowerCase() !== unit) return false;
        if (pos && pos !== 'all') {
          const wp = (w.partOfSpeech || '').toLowerCase();
          if (pos === 'verb') return wp === 'verb' || wp === 'phr v';
          return wp === pos;
        }
        return true;
      });
    }
    if (path.startsWith('/api/resources/')) return [];
    return {};
  }

  async function request(url, options = {}) {
    if (offlineMode) return handleOffline(url, options);

    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(url, { ...options, headers });
      if (res.status === 404) {
        offlineMode = true;
        return handleOffline(url, options);
      }
      if (res.status === 401 && !options._retried) {
        await ensureSession();
        return request(url, { ...options, _retried: true });
      }

      const text = await res.text();
      const data = text ? JSON.parse(text) : null;
      if (!res.ok) {
        throw new Error(data?.message || `Request failed (${res.status})`);
      }
      return data;
    } catch (err) {
      if (err instanceof TypeError) {
        offlineMode = true;
        return handleOffline(url, options);
      }
      throw err;
    }
  }

  async function ensureSession() {
    if (!getToken()) {
      try {
        const res = await fetch('/api/auth/demo-session', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          return data.student;
        }
        if (res.status === 404) offlineMode = true;
      } catch {
        offlineMode = true;
      }
    }
    return null;
  }

  return {
    getToken,
    setToken,
    ensureSession,
    login: (phoneNumber, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ phoneNumber, password }) }),
    getProfile: () => request('/api/profile'),
    updateProfile: (payload) => request('/api/profile', { method: 'PUT', body: JSON.stringify(payload) }),
    updateVerification: (payload) => request('/api/profile/verification', { method: 'PUT', body: JSON.stringify(payload) }),
    changePassword: (payload) => request('/api/auth/change-password', { method: 'POST', body: JSON.stringify(payload) }),
    getNotifications: () => request('/api/profile/notifications'),
    markNotificationsRead: () => request('/api/profile/notifications/read-all', { method: 'POST' }),
    getExams: () => request('/api/exams'),
    getGroups: (status) => request(`/api/groups?status=${encodeURIComponent(status)}`),
    getSupports: () => request('/api/supports'),
    getMentorAvailability: (id) => request(`/api/supports/${id}/availability`),
    getLessons: (filter) => request(`/api/lessons${filter ? `?filter=${filter}` : ''}`),
    bookLesson: (payload) => request('/api/lessons/book', { method: 'POST', body: JSON.stringify(payload) }),
    cancelLesson: (id) => request(`/api/lessons/${id}`, { method: 'DELETE' }),
    getPayments: () => request('/api/payments'),
    makePayment: (payload) => request('/api/payments/pay', { method: 'POST', body: JSON.stringify(payload) }),
    getReferrals: () => request('/api/referrals'),
    createReferral: (payload) => request('/api/referrals', { method: 'POST', body: JSON.stringify(payload) }),
    getBooks: () => request('/api/resources/books'),
    getPodcasts: () => request('/api/resources/podcasts'),
    getVocabulary: (level, unit, pos) => {
      const params = new URLSearchParams();
      if (level) params.set('level', level);
      if (unit) params.set('unit', unit);
      if (pos && pos !== 'all') params.set('pos', pos);
      const q = params.toString();
      return request(`/api/resources/vocabulary${q ? `?${q}` : ''}`);
    },
    getVocabularyUnits: (level) => request(`/api/resources/vocabulary/units?level=${encodeURIComponent(level)}`),
    getVocabularyCounts: () => request('/api/resources/vocabulary/counts')
  };
})();
