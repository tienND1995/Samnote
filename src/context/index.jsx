// export default AppProvider;
import { createContext, useState, useEffect } from 'react'
import { USER } from '../utils/constant'
import axios from 'axios'
import io from 'socket.io-client'

export const AppContext = createContext(null)

const AppProvider = ({ children }) => {
 const [user, setUser] = useState(
  JSON.parse(localStorage.getItem(USER)) || null
 )
 const [snackbar, setSnackbar] = useState({
  isOpen: false,
  message: '',
  severity: '',
 })

 const [socket, setSocket] = useState(null)

 // set socket
 useEffect(() => {
  const socketIo = io('https://samnote.mangasocial.online')

  socketIo.on('connect', () => {
   setSocket(socketIo)
  })

  return () => {
   socketIo.disconnect()
  }
 }, [])

 useEffect(() => {
  if (user && user.id) {
   // Gọi API mỗi 6 giây
   const interval = setInterval(() => {
    axios
     .get(`https://samnote.mangasocial.online/check-status/${user.id}`)
     .then((response) => {
      console.log('API called successfully')
     })
     .catch((error) => {
      console.error('Error calling API:', error)
     })
   }, 60000)

   // Clean up function để xóa interval khi component unmount
   return () => clearInterval(interval)
  }
 }, [user])

 const updateUserInLocalStorage = (newUserData) => {
  try {
   // Cập nhật dữ liệu mới vào localStorage
   localStorage.setItem(USER, JSON.stringify(newUserData))

   // Cập nhật state `user` ngay tại đây nếu cần
   setUser(newUserData)
  } catch (error) {
   console.error('Error updating user in localStorage:', error)
  }
 }

 return (
  <AppContext.Provider
   value={{
    user,
    setUser,
    socket,

    snackbar,
    setSnackbar,
    updateUserInLocalStorage,
   }}
  >
   {children}
  </AppContext.Provider>
 )
}

export default AppProvider
