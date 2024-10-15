import { useContext } from 'react'

import { Alert, Snackbar } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppContext } from './context'

import RootLayout from './layout/RootLayout'

import {
  Photo,
  EditNote,
  CreateNote,
  Group,
  AnonymousMessage,
  Home,
  UserProfile,
  //  UserSetting,
  Sketch,
  Dustbin,
  SearchResults,
} from './pages'
import AuthLayout from './layout/AuthLayout/AuthLayout'
import SignIn from './layout/AuthLayout/SignIn'
import Register from './layout/AuthLayout/Register'
import ForgotPassword from './layout/AuthLayout/ForgotPassword'

import UserSetting from './pages/Setting/UserSetting'

const AppSnackbar = () => {
  const appContext = useContext(AppContext)
  const { snackbar, setSnackbar } = appContext
  const { isOpen, message, severity } = snackbar

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackbar({ isOpen: false, message: '', severity: '' })
  }

  return (
    <Snackbar open={isOpen} autoHideDuration={1000} onClose={handleCloseSnackbar}>
      <Alert
        onClose={handleCloseSnackbar}
        severity={severity}
        variant='filled'
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  )
}

function App() {
  const isLogin = JSON.parse(localStorage.getItem('USER'))

  return (
    <main>
      <AppSnackbar />

      <Routes>
        <Route path='/login' element={isLogin ? <Navigate to='/' /> : <Login />} />
        <Route path='/' exact element={<Home />} />
        <Route path='*' element={<Navigate replace to='/' />} />

        <Route element={<RootLayout />}>
          <Route path='/user/setting' element={<UserSetting />} />

          <Route path='/user/incognito' element={<AnonymousMessage />} />
          {/* ................................ */}
          <Route path='/search-results' element={<SearchResults />} />
          <Route path='/photo' element={<Photo />} />
          <Route path='/group' element={<Group />} />
          <Route path='/profile/:id' element={<UserProfile />} />

          <Route path='/editnote/:id' element={<EditNote />} />
          <Route path='/editnote' exact element={<EditNote />} />
          <Route path='/create-note' element={<CreateNote />} />


          <Route path='/sketch' element={<Sketch />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
