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
    Demo,
    AnonymousMessage,
    Home,
    UserDustbin,
    UserProfile,
    UserSetting,
    UserSketch,
    Login,
} from './pages'

// import Incognito from './pages/Incognito'

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
                    <Route path='/user/sketch' element={<UserSketch />} />
                    <Route path='/user/dustbin' element={<UserDustbin />} />
                    <Route path='/user/incognito' element={<AnonymousMessage />} />
                    {/* ................................ */}
                    <Route path='/photo' element={<Photo />} />
                    <Route path='/group' element={<Group />} />
                    <Route path='/profile/:id' element={<UserProfile />} />
                    <Route path='/editnote/:id' element={<EditNote />} />
                    <Route path='/editnote' exact element={<EditNote />} />
                    <Route path='/create-note' element={<CreateNote />} />
                    <Route path='/demo' element={<Demo />} />
                </Route>
            </Routes>
        </main>
    )
}

export default App
