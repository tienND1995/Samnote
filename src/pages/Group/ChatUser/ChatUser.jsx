import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'

import addUser from '../../../assets/add-user.png'

import SearchIcon from '@mui/icons-material/Search'
import CheckIcon from '@mui/icons-material/Check'

import configs from '../../../configs/configs.json'

const { BASE64_URL, API_SERVER_URL } = configs

const ChatUser = ({
 userID,
 socket,
 setInfoOtherUser,
 setFormName,
 getMessageList,
 setSearchUser,
 searchUser,
}) => {
 const [typeFilterChatUser, setTypeFilterChatUser] = useState('All')
 const [userList, setUserList] = useState([])
 const chatUserRef = useRef()
 const [heightChatUser, setHeightChatUser] = useState('300')

 useEffect(() => {
  if (socket) {
   socket.on('send_message', (result) => {
    const { ReceivedID, SenderID } = result.data

    fetchUserChat()
   })

   fetchUserChat()
  }
 }, [socket, typeFilterChatUser])

 useEffect(() => {
  // @ts-ignore
  chatUserRef.current.offsetHeight &&
   // @ts-ignore
   setHeightChatUser(`${chatUserRef.current.offsetHeight}`)
 }, [])

 const handleShowModalSearch = (e) => {
  setSearchUser({ ...searchUser, showModalSearch: true })
 }

 const handleFilterMessage = (e) => {
  const type = e.target.innerHTML
  if (type === typeFilterChatUser) return

  setTypeFilterChatUser(type)
 }

 const handleClickChatUser = (otherUser) => {
  if (otherUser.is_seen === 0 && otherUser.idReceive === userID) {
   fetchUpdateSeenMessage(otherUser.idMessage)
  }
  getMessageList(userID, otherUser.user.id)

  setInfoOtherUser(otherUser.user)
  setFormName('chat')

  //   resetGroup()
 }

 const handleChatLastText = (lastText, idSend) =>
  idSend === userID ? `Bạn: ${lastText}` : `${lastText}`

 const fetchUserChat = async () => {
  const response = await axios.get(
   `${API_SERVER_URL}/message/list_user_chat1vs1/${userID}`
  )

  if (typeFilterChatUser === 'All') {
   response.data.data.filter((item) => {
    return socket.emit('join_room', { room: item.idRoom })
   })

   setUserList(response.data.data)

   return
  }

  if (typeFilterChatUser === 'Unread') {
   setUserList(response.data.data.filter((user) => user.is_seen !== 1))

   response.data.data.filter((item) => {
    if (item.is_seen !== 1)
     return socket.emit('join_room', { room: item.idRoom })
   })
   return
  }

  if (typeFilterChatUser === 'Read') {
   setUserList(response.data.data.filter((user) => user.is_seen !== 0))

   response.data.data.filter((item) => {
    if (item.is_seen !== 0)
     return socket.emit('join_room', { room: item.idRoom })
   })
   return
  }
 }

 const fetchUpdateSeenMessage = async (messageID) => {
  try {
   const response = await axios.post(`${API_SERVER_URL}/message/${messageID}`)
   fetchUserChat()
  } catch (error) {
   console.log(error)
  }
 }

 return (
  <div className='w-50 search-message px-3 shadow-lg flex flex-col'>
   <div className='flex mt-4 mb-5 justify-between gap-2'>
    <button
     onClick={handleShowModalSearch}
     className='flex gap-2 items-center bg-white p-2 rounded-5 shadow-lg w-100 text-[#686464CC]'
    >
     <SearchIcon />
     Search messenger
    </button>

    <button type='button' className=''>
     <img src={addUser} alt='add user' />
    </button>
   </div>

   <div className='flex flex-col flex-grow-1'>
    <ul className='flex justify-between group-buttons mb-4'>
     <li>
      <button
       onClick={handleFilterMessage}
       className={typeFilterChatUser === 'All' && 'active'}
       type='button'
      >
       All
      </button>
     </li>

     <li>
      <button
       className={typeFilterChatUser === 'Unread' && 'active'}
       onClick={handleFilterMessage}
       type='button'
      >
       Unread
      </button>
     </li>

     <li>
      <button
       className={typeFilterChatUser === 'Read' && 'active'}
       onClick={handleFilterMessage}
       type='button'
      >
       Read
      </button>
     </li>
    </ul>

    <ul
     className='flex flex-col flex-grow-1 gap-4 overflow-y-auto pb-[30px]'
     ref={chatUserRef}
     style={{ height: `${heightChatUser}px` }}
    >
     {userList.length > 0
      ? userList.map((user) => (
         <li
          key={user.idMessage}
          className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
          onClick={() => handleClickChatUser(user)}
         >
          <div className='flex gap-2 items-center'>
           <div>
            <img
             src={user.user.Avarta}
             alt='avatar'
             className='w-[50px] h-[50px] object-cover rounded-[100%]'
            />
           </div>

           <div>
            <h5 className='text-lg font-extrabold capitalize'>
             {user.user.name}
            </h5>
            <p
             style={{ maxWidth: '200px' }}
             className={
              user.is_seen === 0
               ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[600] text-lg'
               : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
             }
            >
             {handleChatLastText(user.last_text, user.idSend)}
            </p>
           </div>
          </div>

          <div
           className={
            user.is_seen === 0
             ? 'text-[#ff0404] text-[16px] me-2'
             : 'text-[#00ff73] text-[16px] me-2'
           }
          >
           {user.is_seen === 0 ? (
            <p className='bg-[#dfdfdf] w-[20px] h-[20px] rounded-full flex items-center justify-center'>
             1
            </p>
           ) : (
            <CheckIcon />
           )}
          </div>
         </li>
        ))
      : null}
    </ul>
   </div>
  </div>
 )
}

export default ChatUser
