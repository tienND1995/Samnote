import React from 'react'
import { NavLink } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'
import CheckIcon from '@mui/icons-material/Check'

import avatarDefault from '../../../../assets/avatar-default.png'
import typeGroup from '../../../../assets/type-group.png'
import { fetchApiSamenote } from '../../../../utils/fetchApiSamnote'

const ChatListGroup = ({ message, onGetAllMessageList, userID }) => {
 const updateSeenMessageGroup = (messageLastestID) => {
  messageLastestID &&
   fetchApiSamenote(
    'get',
    `/seen_message_group/${messageLastestID}/${userID}`
   ).then((response) => {
    if (response.error) return
    onGetAllMessageList()
   })
 }

 const isReadMessageGroup = (listUserReaded, userID) => {
  if (listUserReaded.length < 1) return false

  return listUserReaded.some(
   (userReaded) => parseInt(userReaded.idUser) === userID
  )
 }

 return (
  <li key={message.idGroup}>
   <NavLink
    to={`/messages/group/${message.idGroup}`}
    className={({ isActive }) =>
     `flex justify-between items-center rounded-[40px] hover:bg-[#70ffff] ${
      isActive ? 'bg-[#70ffff]' : 'bg-[#fff]'
     } `
    }
    onClick={() => {
     !isReadMessageGroup(message.listUserReaded, userID) &&
      updateSeenMessageGroup(message.id_lastest_message_in_group)
    }}
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
   </NavLink>
  </li>
 )
}

export default ChatListGroup
