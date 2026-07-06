import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LeadProvider } from './context/LeadContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LeadProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </LeadProvider>
    </AuthProvider>
  </StrictMode>,
)
