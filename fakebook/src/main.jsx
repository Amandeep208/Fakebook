import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ChatProvider } from './context/ChatContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrapped in Chat Provider context so that it is available to all sub components */}
    <ChatProvider>
      <App />
    </ChatProvider>
  </StrictMode>,
)
