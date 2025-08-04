// services/apiConfig.js

const API_CONFIG = {
  // IMPORTANT: This must match your Flask backend port!
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080',

  ENDPOINTS: {
    HEALTH: '/health',
    CHAT: '/chat',
    RESET_SESSION: '/reset_session',
    AUDIO: '/api/audio',
    // Add more endpoints if you add them to backend
  },

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  TIMEOUT: 30000,
  CREDENTIALS: 'include', // Needed for Flask session

  // Supported languages (should match/gtts support)
  LANGUAGES: {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    gu: 'Gujarati',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    kn: 'Kannada',
  },

  // TTS language codes for backend
  TTS_LANG_MAP: {
    en: 'en',
    hi: 'hi',
    mr: 'hi', // gTTS uses Hindi for Marathi
    gu: 'gu',
    ta: 'ta',
    te: 'te',
    bn: 'bn',
    kn: 'kn',
  },

  // Helper to build a full URL for an endpoint
  buildUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,

  // Helper to get default fetch options
  getDefaultOptions: () => ({
    headers: API_CONFIG.HEADERS,
    credentials: API_CONFIG.CREDENTIALS,
    timeout: API_CONFIG.TIMEOUT,
  }),
};

export default API_CONFIG;
