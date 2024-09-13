import React, { useState } from 'react'

import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

import AttachFileIcon from '@mui/icons-material/AttachFile'
import CancelIcon from '@mui/icons-material/Cancel'
import SendIcon from '@mui/icons-material/Send'

import configs from '../../../configs/configs.json'
const { BASE64_URL, API_SERVER_URL } = configs

const FormMessage = ({
 userID,
 otherUserID,
 socket,
 messageContentRef,
 heightMessageContent,
 formName,
 inputMessageFormRef,
 idGroup,
}) => {
 const [messageForm, setMessageForm] = useState({
  content: '',
  image: null,
  emoji: null,
  showEmoji: false,
 })

 const { content, image, emoji, showEmoji } = messageForm

 const handleChangeValueMsg = (e) => {
  setMessageForm({
   ...messageForm,
   content: emoji ? '' : e.target.value,
   emoji: null,
  })
 }

 const handleChangeImageMsg = (e) => {
  const reader = new FileReader()

  reader.onload = () => {
   // @ts-ignore
   const imageBase64 = reader.result.split(',')[1]
   setMessageForm({
    ...messageForm,
    image: imageBase64,
   })
  }

  reader.readAsDataURL(e.target.files[0])
  e.target.value = null
 }

 const handleToggleEmoji = () => {
  setMessageForm({
   ...messageForm,
   showEmoji: !showEmoji,
  })
 }

 const handleClickEmoji = (data) => {
  setMessageForm({
   ...messageForm,
   content: data.emoji,
   emoji: convertEmojiToBase64(data.emoji),
   showEmoji: false,
  })
 }

 const sendMessage = (room, data) => {
  if (socket) {
   // * send message chat

   if ((formName === 'chat')) {
    socket.emit('send_message', { room, data }) // Gửi sự kiện "send_message" tới server

    setMessageForm({
     content: '',
     image: null,
     emoji: null,
     showEmoji: false,
    })

    messageContentRef.current.scrollTop = heightMessageContent
    return
   }

   // * send message group

   if (formName === 'group') {
    socket.emit('chat_group', { room, data }) // Gửi sự kiện "send_message" tới server

    setMessageForm({
     content: '',
     image: null,
     emoji: null,
     showEmoji: false,
    })

    // fetchMessagesGroup(groupItem.idGroup)
    return
   }
  } else {
   console.error('Socket.io not initialized.')
   // Xử lý khi socket chưa được khởi tạo
  }
 }

 const handleSubmitMessage = (e) => {
  e.preventDefault()

  // * submit form chat

  if (formName === 'chat') {
   if (!otherUserID) return

   const roomID = roomSplit(userID, otherUserID)

   const dataForm = {
    idSend: `${userID}`,
    idReceive: `${otherUserID}`,
    type: 'text',
    state: '',
    content: content,
   }

   if (image) {
    dataForm.type = 'image'
    dataForm.content = emoji ? '' : content
    dataForm.data = image

    sendMessage(roomID, dataForm)
    return
   }

   if (emoji) {
    dataForm.type = 'icon-image'
    dataForm.content = ''
    dataForm.data = emoji

    sendMessage(roomID, dataForm)
    return
   }

   if (content.trim() !== '') {
    sendMessage(roomID, dataForm)
   }
   return
  }

  // * submit form group chat
  if (formName === 'group' && idGroup) {
   const roomID = idGroup

   const dataForm = {
    idSend: `${userID}`,
    type: 'text',
   }

   if (image) {
    dataForm.type = 'image'
    dataForm.metaData = image

    sendMessage(roomID, dataForm)
    return
   }

   if (emoji) {
    dataForm.type = 'icon-image'
    dataForm.metaData = emoji

    sendMessage(roomID, dataForm)
    return
   }

   if (content.trim() !== '') {
    dataForm.content = content
    sendMessage(roomID, dataForm)
   }
  }

  return null
 }

 const convertEmojiToBase64 = (emoji) => {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.font = '48px Arial'
  context.fillText(emoji, 0, 48)

  const base64 = canvas.toDataURL().split(',')[1]
  return base64
 }

 const roomSplit = (idUser, idOther) =>
  idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 return (
  <form
   onSubmit={handleSubmitMessage}
   className='flex items-end bg-white mx-5 border rounded-[54px] p-3 mb-5 gap-1 position-relative form-message'
  >
   <button type='button' onClick={handleToggleEmoji}>
    <EmojiEmotionsIcon className='text-[40px] text-[#0095ff]' />
   </button>

   {showEmoji && (
    <div className='position-absolute bottom-[100%] left-0'>
     <EmojiPicker
      width='20em'
      onEmojiClick={handleClickEmoji}
      emojiStyle={EmojiStyle.FACEBOOK}
      lazyLoadEmojis={true}
     />
    </div>
   )}

   <div>
    <input
     onChange={handleChangeImageMsg}
     id='file'
     type='file'
     className='hidden m-0'
    />
    <label htmlFor='file'>
     <AttachFileIcon className='text-[40px] text-[#0095ff]' />
    </label>
   </div>

   <div className='w-100'>
    {image && (
     <div style={{ width: 'max-content' }} className='mb-1 position-relative'>
      <button
       className='delete-image'
       onClick={() =>
        setMessageForm({
         ...messageForm,
         image: null,
        })
       }
      >
       <CancelIcon />
      </button>

      <img
       style={{ width: '80px', height: '50px', objectFit: 'cover' }}
       src={`${BASE64_URL}${image}`}
       alt='anh message'
       className='rounded'
      />
     </div>
    )}

    <input
     onChange={handleChangeValueMsg}
     type='text'
     className='w-100 h-100'
     placeholder='Type your message...'
     value={content}
     ref={inputMessageFormRef}
    />
   </div>

   <button type='submit'>
    <SendIcon className='text-[40px] text-[#0095ff]' />
   </button>
  </form>
 )
}

export default FormMessage
