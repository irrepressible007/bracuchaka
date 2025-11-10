// client/src/utils/setAuthToken.js

import axios from 'axios';

// This function takes a token and does two things:
// 1. Adds it to the 'x-auth-token' header for all future axios requests
// 2. Deletes it from the header if the token is null (e.g., on logout)

const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;