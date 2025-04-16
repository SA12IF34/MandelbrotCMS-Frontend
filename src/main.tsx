import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import {GoogleOAuthProvider} from '@react-oauth/google';

// import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthContextProvider>
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT} >
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  </AuthContextProvider>,
)

