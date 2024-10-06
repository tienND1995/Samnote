import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import './ChatList.css'

import TextTruncate from 'react-text-truncate'

import avatarDefault from '../../../assets/avatar-default.png'
import typeGroup from '../../../assets/type-group.png'

import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CheckIcon from '@mui/icons-material/Check'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import SearchIcon from '@mui/icons-material/Search'

import CreateGroup from '../../../share/CreateGroup'

const ChatList = (props) => {
 const {
  userID,
  socket,
  typeFilterChat,

  userItem,
  groupItem,
  allMessageList,
  setAllMessageList,

  onChangeTypeFilter,
  onShowModalSearch,
  onClickUserItem,
  onClickGroupItem,
 } = props.data

 const chatListRef = useRef()
 const [heightChatList, setHeightChatList] = useState('300')

 useEffect(() => {
  chatListRef.current?.offsetHeight &&
   // @ts-ignore
   setHeightChatList(chatListRef.current.offsetHeight)
 }, [chatListRef])

 // * handle filter message
 const handleTypeFilterChat = (e) => {
  const type = e.target.innerHTML
  if (type === typeFilterChat) return

  window.localStorage.setItem('typeFilterChat', type)
  onChangeTypeFilter(type)
 }

 const convertLastText = (lastText, idSend) => {
  return idSend === userID ? `Bạn: ${lastText}` : `${lastText}`
 }

 const isReadMessageGroup = (listUserReaded, userID) => {
  if (listUserReaded.length < 1) return false

  return listUserReaded.some(
   (userReaded) => parseInt(userReaded.idUser) === userID
  )
 }

 // *********** handle create group
 const [showModalCreateGroup, setShowModalCreateGroup] = useState(false)

 const handleShowModalCreateGroup = () => {
  setShowModalCreateGroup(true)
 }

 return (
  <div
   style={{ boxShadow: '4px -4px 10px 0px #00000040' }}
   className=' bg-[#dffffe] flex flex-col flex-grow-1 px-[20px]'
  >
   <CreateGroup
    data={{ setAllMessageList, socket, typeFilterChat }}
    showModal={showModalCreateGroup}
    setShowModal={setShowModalCreateGroup}
   />

   <div className='flex mt-4 mb-5 justify-between gap-2'>
    <div className='flex justify-between gap-2 w-full'>
     <button
      onClick={onShowModalSearch}
      type='button'
      className='flex w-full gap-2 items-center bg-white p-2 rounded-5  text-[#686464CC]'
     >
      <SearchIcon />
      Search user
     </button>

     <button
      type='button'
      className=''
      title='add group'
      onClick={handleShowModalCreateGroup}
     >
      <GroupAddIcon className='text-[36px]' />
     </button>
    </div>
   </div>

   <div className='flex flex-col flex-grow-1'>
    <ul className='flex justify-between group-buttons mb-4'>
     <li>
      <button
       onClick={handleTypeFilterChat}
       className={typeFilterChat === 'All' && 'active'}
       type='button'
      >
       All
      </button>
     </li>

     <li>
      <button
       className={typeFilterChat === 'Unread' && 'active'}
       onClick={handleTypeFilterChat}
       type='button'
      >
       Unread
      </button>
     </li>

     <li>
      <button
       className={typeFilterChat === 'Read' && 'active'}
       onClick={handleTypeFilterChat}
       type='button'
      >
       Read
      </button>
     </li>
    </ul>

    <ul
     id='list-chat'
     className='flex flex-col flex-grow-1 gap-4 overflow-y-auto overflow-x-hidden list-chat'
     ref={chatListRef}
     style={{ height: `${heightChatList}px`, scrollbarWidth: 'none' }}
    >
     {allMessageList?.map((message) => {
      if (message.type_chat === '1chat1') {
       return (
        <li
         key={message.idMessage}
         className={`flex justify-between items-center rounded-[40px] cursor-pointer ${
          userItem?.id === message.user.id ? 'active' : null
         }`}
         onClick={() => onClickUserItem(message)}
        >
         <div className='flex gap-2 items-center'>
          <div>
           <img
            src={message.user.Avarta}
            alt='avatar'
            className='w-[50px] h-[50px] object-cover rounded-[100%]'
            onError={(e) => (e.target.src = avatarDefault)}
           />
          </div>

          <div>
           <TextTruncate
            line={1}
            element='h6'
            truncateText='…'
            text={message.user.name}
            containerClassName='text-lg font-extrabold capitalize'
           />
           <p
            style={{ maxWidth: '200px' }}
            className={
             message.is_seen === 1 || message.idSend === userID
              ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
              : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg font-[600]'
            }
           >
            {convertLastText(message.last_text, message.idSend)}
           </p>
          </div>
         </div>

         <div
          className={
           message.is_seen === 1 || message.idSend === userID
            ? 'text-[#00ff73] text-[16px] me-2'
            : 'text-[#ff0404] text-[16px] me-2'
          }
         >
          {message.is_seen === 1 || message.idSend === userID ? (
           <CheckIcon />
          ) : (
           <p className='bg-[#dfdfdf] w-[20px] h-[20px] rounded-full flex items-center justify-center'>
            1
           </p>
          )}
         </div>
        </li>
       )
      }

      if (message.type_chat === 'chatgroup') {
       return (
        <li
         key={message.idGroup}
         className={`flex justify-between items-center rounded-[40px] cursor-pointer gap-1 ${
          message.idGroup === groupItem?.idGroup ? 'active' : null
         }`}
         onClick={() => onClickGroupItem(message)}
        >
         <div className='flex gap-2 items-center'>
          <div>
           <img
            src={message.linkAvatar || avatarDefault}
            alt='avatar'
            className='w-[50px] h-[50px] object-cover rounded-[100%]'
            onError={(e) => (e.target.src = avatarDefault)}
           />
          </div>

          <div>
           <div className='flex gap-2 items-center'>
            <TextTruncate
             line={1}
             element='h6'
             truncateText='…'
             text={message.name}
             containerClassName='text-lg font-extrabold capitalize'
            />

            <img
             className='object-cover w-[20px] h-[20px]'
             src={typeGroup}
             alt='group icon'
            />
           </div>
           <p
            style={{ maxWidth: '200px' }}
            className={
             isReadMessageGroup(message.listUserReaded, userID)
              ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
              : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[600] text-lg'
            }
           >
            {message.text_lastest_message_in_group}
           </p>
          </div>
         </div>

         {message.text_lastest_message_in_group && (
          <div
           className={
            isReadMessageGroup(message.listUserReaded, userID)
             ? 'text-[#00ff73] text-[16px] me-2'
             : 'text-[#ff0404] text-[16px] me-2'
           }
          >
           {isReadMessageGroup(message.listUserReaded, userID) ? (
            <CheckIcon />
           ) : (
            <p className='bg-[#dfdfdf] w-[20px] h-[20px] rounded-full flex items-center justify-center'>
             1
            </p>
           )}
          </div>
         )}
        </li>
       )
      }
     })}

     {allMessageList.length === 0 && (
      <div className='text-center'>
       <div>
        <ChatBubbleOutlineIcon className='text-[80px]' />
       </div>
       <h3>Không có tin nhắn nào</h3>
       <p>Tin nhắn mới sẽ được hiện thị tại đây</p>
      </div>
     )}
    </ul>
   </div>

   {/* <ChatUser {...propsChatUser} /> */}
  </div>
 )
}

export default ChatList
