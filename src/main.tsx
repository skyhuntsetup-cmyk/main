import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App.tsx'
import { initMonitoring } from './lib/monitoring'
import { initAnalytics } from './lib/analytics'
import './styles/fonts.css'
import './app/index.css'

initMonitoring();
initAnalytics();


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

