import React from 'react'
import ReactDOM from 'react-dom/client' // Import pour React 18
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import Application from './application'
import './assets/css/dots.css'

const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <React.StrictMode>
    <AppProviders>
      <Application />
    </AppProviders>
  </React.StrictMode>
)

reportWebVitals()
