import { Navigate, Outlet } from 'react-router-dom'
import UserPanel from '../components/UserPanel'

const RootLayout = () => {
 const isLogin = JSON.parse(localStorage.getItem('USER'))

 return isLogin ? (
  <section className='vw-100 vh-100 flex'>
   <div className='w-[200px] flex flex-grow-1'>
    <UserPanel />
   </div>

   <div className='w-full flex'>
    <Outlet />
   </div>
  </section>
 ) : (
  <Navigate to='/login' />
 )
}

export default RootLayout
