import { Navigate, Outlet } from 'react-router-dom'
import UserPanel from '../components/UserPanel'

const RootLayout = () => {
 const isLogin = JSON.parse(localStorage.getItem('USER'))

 return isLogin ? (
  <section className='vw-100 min-vh-100'>
   <div className='container-fluid'>
    <div className='row'>
     <div className='col-2'>
      <UserPanel />
     </div>
     
     <div className='col-10'>
      <Outlet />
     </div>
    </div>
   </div>
  </section>
 ) : (
  <Navigate to='/login' />
 )
}

export default RootLayout
