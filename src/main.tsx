import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@fontsource/caveat/600.css'
import '@fontsource/lora/400.css'
import '@fontsource/lora/600.css'
import './index.css'
import './App.css'
import App from './App.tsx'

// HashRouter keeps links working on GitHub Pages (no server-side routing).
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
