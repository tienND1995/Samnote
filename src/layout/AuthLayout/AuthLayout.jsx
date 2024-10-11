import { useState, useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import Auth from './Auth'
import './AuthLayout.css'

import { AppContext } from '../../context'

const AuthLayout = () => {
 const [showModal, setShowModal] = useState(false)

 const appContext = useContext(AppContext)
 const { setSnackbar, setUser } = appContext
 const isLogin = JSON.parse(localStorage.getItem('USER'))

 const handleShowModal = () => setShowModal(true)

 if (isLogin) return <Navigate to='/' />

 return (
  <div className={`h-screen relative bg-[url(/loginBackground.png)] `}>
   <Auth onShowModal={handleShowModal} />
   <Outlet
    context={{
     showModal,
     onChangeShowModal: setShowModal,
     setSnackbar,
     setUser,
    }}
   />
  </div>
 )
}

export default AuthLayout
