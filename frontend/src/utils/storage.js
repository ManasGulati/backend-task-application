export const storage = {
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  setAccessToken: (t) => localStorage.setItem('accessToken', t),
  getAccessToken: () => localStorage.getItem('accessToken'),
  setRefreshToken: (t) => localStorage.setItem('refreshToken', t),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  clearAll: () => { localStorage.removeItem('user'); localStorage.removeItem('accessToken'); localStorage.removeItem('refreshToken'); }
};
