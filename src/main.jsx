import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './hooks/AuthContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </AuthProvider>
  </StrictMode>,
)
