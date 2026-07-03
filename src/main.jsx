import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NuqsAdapter } from 'nuqs/adapters/react'
import './index.css'
import App from './App.jsx'
import { GoogleDriveProvider } from './hooks/GoogleDriveContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleDriveProvider>
      <NuqsAdapter>
        <App />
      </NuqsAdapter>
    </GoogleDriveProvider>
  </StrictMode>,
)
