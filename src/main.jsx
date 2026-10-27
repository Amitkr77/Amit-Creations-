import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import NotFound from './components/NotFound.jsx'
import { greetDevelopers } from './lib/console'

greetDevelopers()

// Static hosts rewrite unknown paths to index.html (see vercel.json / public/_redirects)
const isHome = ['/', '/index.html'].includes(window.location.pathname)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isHome ? <App /> : <NotFound />}
  </StrictMode>,
)
