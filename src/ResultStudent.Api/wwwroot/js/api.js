window.Api = (() => {
  const TOKEN_KEY = 'result_student_jwt';

  function getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  function setToken(token) {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }

  async function request(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
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
  }

  async function ensureSession() {
    if (!getToken()) {
      const res = await fetch('/api/auth/demo-session', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        return data.student;
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
