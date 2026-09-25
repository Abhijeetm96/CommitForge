import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { SuiteErrorBoundary } from './platform/errors/SuiteErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SuiteErrorBoundary fallbackTitle="Forge Suite Application Error">
      <App />
    </SuiteErrorBoundary>
  </StrictMode>,
)
