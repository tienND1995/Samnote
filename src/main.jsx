import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AppProvider from './context/index.jsx'
import { BrowserRouter } from 'react-router-dom'

import { ThemeProvider, createTheme } from '@mui/material/styles'

const theme = createTheme({
 direction: 'rtl',
})

ReactDOM.createRoot(document.getElementById('root')).render(
 <React.StrictMode>
  <BrowserRouter>
   <AppProvider>
    <ThemeProvider theme={theme}>
     <App />
    </ThemeProvider>
   </AppProvider>
  </BrowserRouter>
 </React.StrictMode>
)
