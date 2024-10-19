import { useContext } from 'react'

import { Alert, Snackbar } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppContext } from './context'

import RootLayout from './layout/RootLayout'

import AuthLayout from './layout/AuthLayout/AuthLayout'
import ForgotPassword from './layout/AuthLayout/ForgotPassword'
import Register from './layout/AuthLayout/Register'
import SignIn from './layout/AuthLayout/SignIn'
import {
 AnonymousMessage,
 CreateNote,
 Dustbin,
 FormEdit,
 EditNote,
 EditNoteLayout,
 Group,
 Home,
 Photo,
 //  UserSetting,
 Sketch,
 UserProfile,
} from './pages'

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
 return (
  <main>
   <AppSnackbar />
   <Routes>
    <Route path='/auth' element={<AuthLayout />}>
     <Route path='signin' element={<SignIn />} />
     <Route path='register' element={<Register />} />
     <Route path='forgot-password' element={<ForgotPassword />} />
    </Route>

    <Route path='/' exact element={<Home />} />
    <Route path='*' element={<Navigate replace to='/' />} />

    <Route element={<RootLayout />}>
     <Route path='/setting' element={<UserSetting />} />

     <Route path='/incognito' element={<AnonymousMessage />} />
     {/* ................................ */}
     <Route path='/photo' element={<Photo />} />
     <Route path='/group' element={<Group />} />
     <Route path='/profile/:id' element={<UserProfile />} />

     <Route path='/create-note' element={<CreateNote />} />

     <Route path='/editnote' exact element={<EditNoteLayout />}>
      <Route index element={<EditNote />} />
      <Route path=':id' element={<EditNote />} />
      <Route path='form/:id' element={<FormEdit />} />
     </Route>

     <Route path='/sketch' element={<Sketch />} />

     <Route path='/dustbin' exact element={<Dustbin />} />
     <Route path='/dustbin/:id' element={<Dustbin />} />
    </Route>
   </Routes>
  </main>
 )
}

export default App
