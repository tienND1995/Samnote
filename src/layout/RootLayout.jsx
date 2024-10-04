import { Navigate, Outlet } from 'react-router-dom'
import UserPanel from '../components/UserPanel'

const RootLayout = () => {
 const isLogin = JSON.parse(localStorage.getItem('USER'))

 return isLogin ? (
  <section className='w-full vh-100 flex'>
   <div className='w-[100px] flex '>
    <UserPanel />
   </div>

   <div
    style={{ maxWidth: 'calc(100% - 100px)' }}
    className='w-full flex flex-grow-1'
   >
    <Outlet />
   </div>
  </section>
 ) : (
  <Navigate to='/login' />
 )
}

export default RootLayout
