import React, { useState, useEffect, useRef } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import GroupAddIcon from '@mui/icons-material/GroupAdd'

const ChatList = () => {
 const [userList, setUserList] = useState([])
 const [groupList, setGroupList] = useState([])

 const chatListRef = useRef()
 const [heightChatList, setHeightChatList] = useState('300')

 const [typeFilterChat, setTypeFilterChat] = useState('All')

 // * handle filter message
 const handleTypeFilterChat = (e) => {
  const type = e.target.innerHTML
  if (type === typeFilterChat) return

  setTypeFilterChat(type)
 }

 return (
  <div className='shadow-lg bg-[#dffffe] flex flex-col flex-grow-1 px-[20px]'>
   <div className='flex mt-4 mb-5 justify-between gap-2'>
    <button
     //  onClick={handleShowModalSearch}
     className='flex gap-2 items-center bg-white p-2 rounded-5 shadow-lg w-100 text-[#686464CC]'
    >
     <SearchIcon />
     Search user
    </button>

    <form
     //  onSubmit={handleSubmitSearchGroup}
     className='flex justify-between gap-2'
    >
     <button
      type='button'
      className=''
      title='add group'
    //   onClick={handleShowModalCreateGroup}
     >
      <GroupAddIcon className='text-[36px]' />
     </button>
    </form>
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
     className='flex flex-col flex-grow-1 gap-4 overflow-y-auto pb-[30px] overflow-x-hidden list-chat'
     ref={chatListRef}
     style={{ height: `${heightChatList}px`, scrollbarWidth: 'none' }}
    >
     {/* render userlist and grouplist */}
     {userList?.map((item) => {
      return (
       <li
        key={item.idMessage}
        className={`flex justify-between items-center rounded-[40px] cursor-pointer ${
         infoOtherUser.id === item.user.id ? 'active' : null
        }`}
        onClick={() => handleClickChatUser(item)}
       >
        <div className='flex gap-2 items-center'>
         <div>
          <img
           src={item.user.Avarta}
           alt='avatar'
           className='w-[50px] h-[50px] object-cover rounded-[100%]'
          />
         </div>

         <div>
          <h5 className='text-lg font-extrabold capitalize'>
           {item.user.name}
          </h5>
          <p
           style={{ maxWidth: '200px' }}
           className={
            item.is_seen === 0
             ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[600] text-lg'
             : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
           }
          >
           {handleChatLastText(item.last_text, item.idSend)}
          </p>
         </div>
        </div>

        <div
         className={
          item.is_seen === 0
           ? 'text-[#ff0404] text-[16px] me-2'
           : 'text-[#00ff73] text-[16px] me-2'
         }
        >
         {item.is_seen === 0 ? (
          <p className='bg-[#dfdfdf] w-[20px] h-[20px] rounded-full flex items-center justify-center'>
           1
          </p>
         ) : (
          <CheckIcon />
         )}
        </div>
       </li>
      )
     })}

     {groupList?.map((item) => (
      <li
       key={item.idGroup}
       className={`flex justify-between items-center rounded-[40px] cursor-pointer ${
        item.idGroup === infoGroupItem.idGroup ? 'active' : null
       }`}
       onClick={() => handleClickGroupItem(item)}
      >
       <div className='flex gap-2 items-center'>
        <div>
         <img
          src={item.linkAvatar || avatarDefault}
          alt='avatar'
          className='w-[50px] h-[50px] object-cover rounded-[100%]'
         />
        </div>

        <div>
         <h5 className='text-lg font-extrabold capitalize'>{item.name}</h5>
         <p
          style={{ maxWidth: '200px' }}
          className={
           item.is_seen === 0
            ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[600] text-lg'
            : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
          }
         >
          {item.text_lastest_message_in_group}
         </p>
        </div>
       </div>

       <div
        className={
         isReadMessageGroup(item.listUserReaded)
          ? 'text-[#00ff73] text-[16px] me-2'
          : 'text-[#ff0404] text-[16px] me-2'
        }
       >
        {isReadMessageGroup(item.listUserReaded) ? (
         <CheckIcon />
        ) : (
         <p className='bg-[#dfdfdf] w-[20px] h-[20px] rounded-full flex items-center justify-center'>
          1
         </p>
        )}
       </div>
      </li>
     ))}

     {userList.length === 0 && groupList.length === 0 && (
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
