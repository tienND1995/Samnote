import avatarDefault from '../../../../assets/avatar-default.png'
import { convertTimeMessage } from '../../../../utils/utils'

const MessageGroupCard = ({ message, userID }) => {
 return message.idSend === userID ? (
  <div key={message.id} className='h-auto mb-2 flex flex-col items-end'>
   <div className='flex gap-2 mb-1'>
    <div className='flex items-center gap-1'>
     <div className='flex flex-col gap-1 items-end'>
      {message?.image?.trim() !== '' && (
       <div>
        <img
         className={`h-auto rounded-md ${
          message.type === 'image' ? 'w-[100px]' : 'w-[30px]'
         }`}
         src={message.image}
        />
       </div>
      )}

      {message.content && (
       <p
        style={{
         width: 'max-content',
         overflowWrap: 'anywhere',
         maxWidth: '250px',
        }}
        className='break-words text-[14px] md:text-[16px] bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto'
       >
        {message.content}
       </p>
      )}
     </div>
    </div>
   </div>

   <time className='text-[10px] md:text-xs text-black-50'>
    {convertTimeMessage(message.sendAt)}
   </time>
  </div>
 ) : (
  <div key={message.id} className='h-auto mb-2'>
   <div className='flex gap-2 mb-1'>
    <div className='flex gap-1 items-end'>
     <img
      className='object-fit-cover rounded-circle'
      style={{ width: '40px', height: '40px' }}
      src={message.avt}
      alt='avatar other_user'
      onError={(e) => (e.target.src = avatarDefault)}
     />
    </div>

    <div className='flex items-center gap-1'>
     <div className='flex flex-col gap-1'>
      {message.image?.trim() !== '' && (
       <div>
        <h3 className='mb-1 text-[12px] font-light capitalize'>
         {message.name}
        </h3>
        <div>
         <img
          className={`h-auto rounded-md ${
           message.type === 'image' ? 'w-[100px]' : 'w-[30px]'
          }`}
          src={message.image}
         />
        </div>
       </div>
      )}

      {message.content && (
       <div
        style={{
         width: 'max-content',
         overflowWrap: 'anywhere',
         maxWidth: '250px',
        }}
        className='break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto'
       >
        <h3 className='mb-1 text-[12px] font-light capitalize'>
         {message.name}
        </h3>
        <p className='font-semibold text-[14px] md:text-[16px] '>{message.content}</p>
       </div>
      )}
     </div>
    </div>
   </div>

   <time className='text-[10px] md:text-xs text-black-50'>
    {convertTimeMessage(message.sendAt)}
   </time>
  </div>
 )
}

export default MessageGroupCard
