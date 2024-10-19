import avatarDefault from '../../../assets/avatar-default.png'
import { convertTimeMessage } from '../../../utils/utils'

import DeleteIcon from '@mui/icons-material/Delete'
const MessageChatCard = ({ message, userID, onDeleteMessage, avatar }) => {
 return message.idSend === userID ? (
  <div className='h-auto flex flex-col justify-center items-end'>
   <div className='flex gap-2 mb-1'>
    <div className='flex messages-center group gap-1'>
     <button
      style={{
       border: 'none',
       backgroundColor: 'transparent',
       transition: 'all .3s ease-in-out',
      }}
      className='hidden group-hover:block '
      onClick={() => {
       onDeleteMessage(message.id)
      }}
     >
      <DeleteIcon />
     </button>

     <div className='flex flex-col gap-1'>
      {message.image && (
       <div>
        <img
         className={`h-auto rounded-md ${
            message.type === 'image' ? 'w-[100px]' : 'w-[30px]'
         }`}
         src={message.image}
        />
       </div>
      )}

      {message.text.trim() !== '' && (
       <p
        style={{
         width: 'max-content',
         overflowWrap: 'anywhere',
         maxWidth: '250px',
        }}
        className='break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto'
       >
        {message.text}
       </p>
      )}
     </div>
    </div>
   </div>

   <time className='text-xs text-black-50'>
    {convertTimeMessage(message.sendAt)}
   </time>
  </div>
 ) : (
  <div className='h-auto mb-2 justify-center items-start'>
   <div className='flex gap-2 mb-1'>
    <div className='flex gap-1'>
     <img
      className='object-fit-cover rounded-circle'
      style={{ width: '40px', height: '40px' }}
      src={avatar}
      alt='avatar other_user'
      onError={(e) => (e.target.src = avatarDefault)}
     />
    </div>

    <div className='flex items-center gap-1'>
     <div className='flex flex-col gap-1'>
      {message.image && (
       <div>
        <img
         className={`h-auto rounded-md ${
            message.type === 'image' ? 'w-[100px]' : 'w-[30px]'
         }`}
         src={message.image}
        />
       </div>
      )}

      {message.text.trim() !== '' && (
       <p
        style={{
         width: 'max-content',
         overflowWrap: 'anywhere',
         maxWidth: '250px',
        }}
        className='break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto'
       >
        {message.text}
       </p>
      )}
     </div>
    </div>
   </div>

   <time className='text-xs text-black-50'>
    {convertTimeMessage(message.sendAt)}
   </time>
  </div>
 )
}

export default MessageChatCard
