// client/src/config.js
// In production (Vercel), we use relative path '/api' which is rewritten by vercel.json
// In development, we use the full localhost URL

const isProduction = import.meta.env.MODE === 'production';

export const API_URL = isProduction
    ? '/api'
    : 'http://localhost:5001/api';

export default API_URL;
