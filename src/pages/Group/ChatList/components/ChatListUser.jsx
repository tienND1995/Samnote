import CheckIcon from '@mui/icons-material/Check'
import { NavLink } from 'react-router-dom'
import TextTruncate from 'react-text-truncate'

import avatarDefault from '../../../../assets/avatar-default.png'
import { fetchApiSamenote } from '../../../../utils/fetchApiSamnote'

const ChatListUser = ({ message, onGetAllMessageList, userID }) => {
 const updateSeenMessageChat = (messageId) => {
  fetchApiSamenote('post', `/message/${messageId}`).then((response) => {
   onGetAllMessageList()
  })
 }

 const convertLastText = (lastText, idSend) => {
  return idSend === userID ? `Bạn: ${lastText}` : `${lastText}`
 }

 return (
  <li key={message.idMessage}>
   <NavLink
    to={`/messages/chat/${message.user.id}`}
    className={({ isActive }) =>
     `flex justify-between items-center rounded-[40px] hover:bg-[#70ffff] ${
      isActive ? 'bg-[#70ffff]' : 'bg-[#fff]'
     } `
    }
    onClick={() =>
     message.is_seen === 0 &&
     message.idReceive === userID &&
     updateSeenMessageChat(message.idMessage)
    }
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
       containerClassName='text-lg font-extrabold capitalize break-all'
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
   </NavLink>
  </li>
 )
}

export default ChatListUser
