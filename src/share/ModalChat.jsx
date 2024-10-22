import { useContext, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AppContext } from '../context'
import { formatTimeAgo, handleErrorAvatar } from '../utils/utils'

const ModalChat = ({ dataMess, setIsModalMessage, messageIconRef }) => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [chatList, setChatList] = useState([])
 const [visibleMoreChat, setVisibleMoreChat] = useState(7)
 const chatRef = useRef(null)

 useEffect(() => {
  setChatList(dataMess)
 }, [dataMess])

 const handleClickOutside = (event) => {
  if (
   chatRef.current &&
   !chatRef.current.contains(event.target) &&
   messageIconRef.current &&
   !messageIconRef.current.contains(event.target)
  ) {
   setIsModalMessage(false)
  }
 }

 useEffect(() => {
  document.addEventListener('mousedown', handleClickOutside)
  return () => {
   document.removeEventListener('mousedown', handleClickOutside)
  }
 }, [setIsModalMessage, messageIconRef])

 const handleSeeMore = () => {
  setVisibleMoreChat((prevVisible) => prevVisible + 7)
 }

 return (
  <div
   className='absolute bg-white right-0 top-[125%] w-[300px] md:w-[400px] max-h-[450px] shadow-lg 
                    flex flex-col justify-center rounded-3 z-10 overflow-hidden'
   ref={chatRef}
  >
   <div className='p-3 border-bottom border-gray-200'>
    <h2 className='text-2xl font-semibold'>Chats</h2>
   </div>
   <ul className='flex flex-col overflow-y-auto'>
    {chatList.length > 0 ? (
     chatList.slice(0, visibleMoreChat).map((item) => (
      <li key={item.idMessage} className='list-none'>
       <NavLink
        to={`/messages/chat/${item.user.id}`}
        state={item.user}
        className='flex items-center hover:bg-gray-100 p-3 no-underline text-black'
       >
        <img
         className='w-12 h-12 rounded-full mr-3 max-w-[20%]'
         src={item.user.Avarta || '/src/assets/avatar-default.png'}
         alt={item.user.name}
         onError={handleErrorAvatar}
        />
        <div className='flex-1 w-[80%]'>
         <div className='flex justify-between items-baseline'>
          <h5 className='font-semibold truncate-text w-[70%]'>
           {item.user.name}
          </h5>
          <span className='text-xs text-gray-500'>
           {formatTimeAgo(item.sendAt)}
          </span>
         </div>
         <p
          className={`text-sm truncate-text m-0 w-[70%]
                              ${
                               item.idSend !== user.id && item.is_seen === 0
                                ? 'font-semibold'
                                : 'text-gray-500'
                              }`}
         >
          {item.idSend === user.id ? 'You: ' : ''}
          {item.last_text}
         </p>
        </div>
       </NavLink>
      </li>
     ))
    ) : (
     <div className='flex items-center justify-center h-full'>
      <p className='text-gray-500'>No messages yet</p>
     </div>
    )}
   </ul>
   {visibleMoreChat < chatList.length && (
    <div className='flex items-center justify-center p-2 border-top border-gray-200'>
     <p
      className='m-0 text-sm cursor-pointer text-gray-500 hover:text-gray-700'
      onClick={handleSeeMore}
     >
      See more
     </p>
    </div>
   )}
  </div>
 )
}

export default ModalChat
