import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
<<<<<<< HEAD
=======
import ErrorBoundary from './components/ErrorBoundary.jsx'
>>>>>>> origin/Sanzid
import './index.css' // <-- ADD THIS LINE

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
<<<<<<< HEAD
    <App />
=======
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
>>>>>>> origin/Sanzid
  </React.StrictMode>,
)