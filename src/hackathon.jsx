import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HackathonPage from './HackathonPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HackathonPage />
  </StrictMode>,
)
