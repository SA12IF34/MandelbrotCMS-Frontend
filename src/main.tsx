import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
// import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
  <React.StrictMode>
      <App />
  </React.StrictMode>
  </AuthContextProvider>,
)

