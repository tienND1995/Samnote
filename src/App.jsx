import { useContext } from 'react'

import { Alert, Snackbar } from '@mui/material'
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { AppContext } from './context'
import Home from './pages/Home'

import AnonymousMessage from './pages/AnonymousMess/AnonymousMessage'

// import Incognito from './pages/Incognito'
import Login from './pages/Login'
import OtherUser from './pages/OtherUser'
import UserDustbin from './pages/UserDustbin'
import UserGroup from './pages/UserGroup'
import UserNotes from './pages/UserNotes'
import UserProfile from './pages/UserProfile/UserProfile'
import UserSetting from './pages/UserSetting'
import UserSketch from './pages/UserSketch'

import RootLayout from './layout/RootLayout'
import Demo from './pages/Demo/Demo'
import EditNote from './pages/EditNote/EditNote'
import Group from './pages/Group/Group'
import Photo from './pages/Photo/Photo'
import CreateNote from './pages/CreateNote/CreateNote'

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
    <Route path='/' element={<Home />} />
    <Route path='*' element={<Navigate replace to='/' />} />

    <Route element={<RootLayout />}>
     <Route path='/other-user/:id' element={<OtherUser />} />
     <Route path='/user/note/:id' element={<UserNotes />} />
     <Route path='/user/setting' element={<UserSetting />} />
     <Route path='/user/sketch' element={<UserSketch />} />
     <Route path='/user/group' element={<UserGroup />} />
     <Route path='/user/dustbin' element={<UserDustbin />} />

     <Route path='/user/profile/:id' element={<UserProfile />} />
     <Route path='/profile-other-user/:id' element={<UserProfile />} />
     <Route path='/user/incognito' element={<AnonymousMessage />} />

     {/* ................................ */}

     <Route path='/editnote/:id' element={<EditNote />} />
     <Route path='/editnote' element={<EditNote />} />
     <Route path='/create-note' element={<CreateNote />} />

     <Route path='/photo' element={<Photo />} />
     <Route path='/group' element={<Group />} />

     <Route path='/demo' element={<Demo />} />
    </Route>
   </Routes>
  </main>
 )
}

export default App
