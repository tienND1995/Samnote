// @ts-nocheck
import { useState, useEffect, useContext, useMemo, useRef } from 'react'
import io from 'socket.io-client'
import { AppContext } from '../context'
import api from '../api'
import {
 Box,
 Typography,
 Avatar,
 InputBase,
 IconButton,
 Modal,
 TextField,
 Button,
 Accordion,
 AccordionSummary,
 AccordionDetails,
 List,
 ListItem,
 ListItemText,
 ListItemSecondaryAction,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SubdirectoryArrowRightSharpIcon from '@mui/icons-material/SubdirectoryArrowRightSharp'
import DeleteIcon from '@mui/icons-material/Delete'
import { useLocation } from 'react-router-dom'
import EmojiPicker, { EmojiStyle } from 'emoji-picker-react'
import CancelIcon from '@mui/icons-material/Cancel'

import config from '../configs/configs.json'
import axios from 'axios'
const { BASE64_URL, API_SERVER_URL } = config

const newSocket = io(API_SERVER_URL)

const UserGroup = () => {
 const location = useLocation()

 const [open, setOpen] = useState(false)
 const [groupName, setGroupName] = useState('')
 const [groupDescription, setGroupDescription] = useState('')
 const [members, setMembers] = useState([])
 const [memberEmail, setMemberEmail] = useState('')
 const [memberId, setMemberId] = useState('')

 const [message, setMessage] = useState([])
 const [userChat, setUserChat] = useState([])

 const appContext = useContext(AppContext)
 const { setSnackbar, user } = appContext
 const [socket, setSocket] = useState(null)
 const pickerEmojiRef = useRef(null)
 const scrollContainerRef = useRef(null)

 const handleOpen = () => setOpen(true)
 const handleClose = () => setOpen(false)
 const handleGroupNameChange = (e) => setGroupName(e.target.value)
 const handleGroupDescriptionChange = (e) => setGroupDescription(e.target.value)
 const handleMemberIdChange = (e) => setMemberId(e.target.value)
 const handleMemberEmailChange = (e) => setMemberEmail(e.target.value)

 // form message
 const [groupList, setGroupList] = useState([])
 const [groupItem, setGroupItem] = useState({})
 const [infoOtherUser, setInfoOtherUser] = useState({})

 // Kết nối tới server Socket.IO khi component được tạo ra

 const fetchUserChat = async () => {
  const response = await api.get(
   `https://samnote.mangasocial.online/message/list_user_chat1vs1/${user.id}`
  )

  try {
   response.data.data.map((item) => {
    newSocket.emit('join_room', { room: item.idRoom })
   })
   setUserChat(response.data.data)
  } catch (error) {
   console.log(error)
  }
 }

 const getGroups = async (idOwner) => {
  try {
   const res = await api.get(`/group/all/${idOwner}`)
   res.data.data.map((item) => {
    if (item.numberMems >= 1) {
     newSocket.emit('join_room', { room: item.idGroup })
    }
   })

   setGroupList(res.data.data)
  } catch (err) {
   console.error(err)
  }
 }

 useMemo(() => {
  setSocket(newSocket)

  newSocket.on('connect', () => {
   console.log('Connected to server')
  })

  newSocket.on('send_message', (result) => {
   console.log('send message', result)
   fetchUserChat()
  })

  getGroups(user.id)
  fetchUserChat()

  return () => {
   newSocket.disconnect() // Ngắt kết nối khi component bị xoá
  }
 }, [])

 useEffect(() => {
  const scrollContainer = scrollContainerRef.current
  scrollContainer.scrollTop = scrollContainer.scrollHeight
 }, [infoOtherUser, groupItem])

 useEffect(() => {
  const scrollContainer = scrollContainerRef.current
  scrollContainer.scrollTop =
   scrollContainer.scrollHeight - scrollContainer.clientHeight
 }, [infoOtherUser, groupItem])

 const handleGroupClick = async (group) => {
  try {
   fetchMessagesGroup(group.idGroup)

   setInfoOtherUser({})
   setGroupItem(group)
   setMessage([])
   setFormName('group')
  } catch (err) {
   console.log(err)
  }
 }

 const handleAddMember = () => {
  setMembers([...members, { gmail: memberEmail, id: memberId, role: 'member' }])
  setMemberEmail('')
  setMemberId('')
 }

 const handleRemoveMember = (index) => {
  setMembers(members.filter((_, i) => i !== index))
 }

 useEffect(() => {
  const handleClickOutside = (event) => {
   if (
    pickerEmojiRef.current &&
    !pickerEmojiRef.current.contains(event.target)
   ) {
    setIsEmoji(false)
   }
  }

  document.addEventListener('mousedown', handleClickOutside)
  return () => {
   document.removeEventListener('mousedown', handleClickOutside)
  }
 }, [])

 // todo new code message

 const [formName, setFormName] = useState('chat')

 const [messageForm, setMessageForm] = useState({
  content: '',
  image: null,
  emoji: null,
 })
 const { content, image, emoji } = messageForm
 const [showEmoji, setShowEmoji] = useState(false)

 useEffect(() => {
  if (location.state) {
   setInfoOtherUser(location.state)
   getMessageChats(user.id, location.state.id)
  }
 }, [location.state])

 //..........

 const getMessageChats = async (userID, otherUserID) => {
  try {
   const response = await api.get(
    `https://samnote.mangasocial.online/message/list_message_chat1vs1/${userID}/${otherUserID}`
   )

   setMessageGroup([])
   setMessage(response.data.data[0].messages)
  } catch (error) {
   console.log(error)
  }
 }

 const handleUserChatClick = async (otherUser) => {
  if (otherUser.is_seen === 0 && otherUser.idReceive === user.id) {
   fetchUpdateSeenMessage(otherUser.idMessage)
  }

  getMessageChats(user.id, otherUser.user.id)

  setInfoOtherUser(otherUser.user)
  setGroupItem({})
  setMessageGroup([])
  setFormName('chat')
 }

 const fetchUpdateSeenMessage = async (messageID) => {
  try {
   const response = await api.post(
    `https://samnote.mangasocial.online/message/${messageID}`
   )
  } catch (error) {
   console.log(error)
  }
 }

 const handleDeleteMessage = async (messageID) => {
  try {
   const response = await axios.delete(
    `https://samnote.mangasocial.online/message/${messageID}`
   )

   getMessageChats(user.id, infoOtherUser.id)
   fetchUserChat()
  } catch (error) {
   console.log(error)
  }
 }

 // handle convert time, image, emoji, roomID
 const handleTimeUserChat = (time) => {
  const realTime = new Date()
  const diffInMs = realTime.getTime() - new Date(time).getTime()
  const daysDifference = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  const monthsDifference = Math.floor(daysDifference / 30.436875) // Trung bình số ngày trong một tháng
  const yearsDifference = Math.floor(daysDifference / 365.25)
  const timeSplit = time.split(' ')

  if (daysDifference < 1) {
   return `${timeSplit[4].slice(0, -3)}`
  } else if (daysDifference < 7) {
   return `${timeSplit[0].slice(0, -1)}`
  } else if (daysDifference < 30) {
   return `${timeSplit[1]}${timeSplit[2]}`
  } else if (monthsDifference < 12) {
   return `${timeSplit[2]}`
  } else {
   return `${timeSplit[3]}`
  }
 }

 const handleChatLastText = (lastText, idSend) => {
  if (idSend === user.id) {
   return `Bạn: ${lastText}`
  } else {
   return `${lastText}`
  }
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

 const roomSplit = (idUser, idOther) => {
  if (idUser > idOther) {
   return `${idOther}#${idUser}`
  } else {
   return `${idUser}#${idOther}`
  }
 }

 // ******** GROUPS ********

 const [messageGroup, setMessageGroup] = useState([])

 const fetchMessagesGroup = async (groupID) => {
  try {
   const response = await api.get(
    `https://samnote.mangasocial.online/group/messages/${groupID}`
   )
   setMessageGroup(response.data.data)
  } catch (error) {
   console.log(error)
  }
 }

 const postGroup = async (dataGroup, userID) => {
  try {
   const response = await axios.post(
    `${API_SERVER_URL}/group/create/${userID}`,
    dataGroup
   )

   handleClose()
   setSnackbar({
    isOpen: true,
    message: `Create group complete`,
    severity: 'success',
   })

   getGroups(user.id)
  } catch (error) {
   setSnackbar({
    isOpen: true,
    message: error.message,
    severity: 'error',
   })
  }
 }

 const handleCreateGroup = async () => {
  const dataGroup = {
   name: groupName,
   createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
   idOwner: user.id,
   describe: groupDescription,
   r: 255,
   g: 255,
   b: 255,
   a: 0.99,
   members: [
    {
     gmail: memberEmail,
     id: memberId,
     role: 'member',
    },
    ...members,
   ],
  }

  postGroup(dataGroup, user.id)
 }

 //  ** handle submit form message

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
   const imageBase64 = reader.result.split(',')[1]
   setMessageForm({ ...messageForm, image: imageBase64 })
  }

  reader.readAsDataURL(e.target.files[0])
  e.target.files[0] = null
 }

 const handleToggleEmoji = () => {
  setShowEmoji((prevState) => !prevState)
 }

 const handleClickEmoji = (data) => {
  setMessageForm({
   ...messageForm,
   content: data.emoji,
   emoji: convertEmojiToBase64(data.emoji),
  })

  setShowEmoji(false)
 }

 const sendMessage = (room, data) => {
  if (socket) {
   // * send message chat
   if (formName === 'chat') {
    newSocket.emit('send_message', { room, data }) // Gửi sự kiện "send_message" tới server
    setMessageForm({ content: '', image: null, emoji: null })

    // Xử lý logic khi tin nhắn được gửi đi
    getMessageChats(user.id, infoOtherUser.id)
    fetchUserChat()

    return
   }

   // * send message group

   if (formName === 'group') {
    newSocket.emit('chat_group', { room, data }) // Gửi sự kiện "send_message" tới server
    setMessageForm({ content: '', image: null, emoji: null })

    fetchMessagesGroup(groupItem.idGroup)
    return
   }
  } else {
   console.error('Socket.io not initialized.')
   // Xử lý khi socket chưa được khởi tạo
  }
 }

 const handleSubmitMessage = () => {
  // * submit form chat

  if (formName === 'chat') {
   const roomID = roomSplit(user.id, infoOtherUser.id)

   if (!infoOtherUser.id) return

   const dataForm = {
    idSend: `${user.id}`,
    idReceive: `${infoOtherUser.id}`,
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

  const roomID = groupItem.idGroup

  const dataForm = {
   idSend: `${user.id}`,
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
  return null
 }

 return (
  <div
   className='mb-[3rem] lg:mb-0'
   style={{
    display: 'grid',
    gridTemplateColumns: '40% 60%',
   }}
  >
   <Box
    sx={{
     backgroundColor: 'bgitem.main',
     paddingTop: '10px',
     height: '635px',
    }}
   >
    <Box
     sx={{
      color: 'text.main',
      boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.5)',
      paddingLeft: '10px',
     }}
    >
     <div
      style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       fontWeight: '700',
       fontSize: '20px',
       padding: '10px 10px 20px',
      }}
     >
      Chat
     </div>
     <div
      style={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
      }}
     >
      <Box
       component='form'
       sx={{
        backgroundColor: '#DADADA',
        display: 'flex',
        alignItems: 'center',
        height: '40px',
        width: '100%',
        borderRadius: '30px',
        margin: '0 10px 10px 0px',
       }}
      >
       <SearchIcon sx={{ marginLeft: '15px', color: '#333' }} />
       <InputBase
        sx={{ ml: 1, flex: 1, color: '#333' }}
        placeholder='Search Messenger'
        inputProps={{ 'aria-label': 'search google maps' }}
       />
      </Box>
     </div>
    </Box>
    <Accordion>
     <AccordionSummary>
      <ExpandMoreIcon />
      <Typography>Chat</Typography>
     </AccordionSummary>
     <AccordionDetails>
      <Box
       sx={{
        maxHeight: '400px',
        overflow: 'auto',
        scrollbarWidth: 'none',
       }}
      >
       {userChat.map((item, index) => {
        return (
         <Box
          key={`chat ${index}`}
          sx={{
           margin: '2px 0',
           display: 'flex',
           justifyContent: 'flex-start',
           alignItems: 'center',
           color: 'text.main',
           backgroundColor: ' rgba(178, 178, 178, 0.1)',
           borderRadius: '30px',
           '&:hover': {
            backgroundColor: ' rgba(178, 178, 178, 0.3)',
            cursor: 'pointer',
           },
          }}
          onClick={() => handleUserChatClick(item)}
         >
          <Avatar
           src={item.user.Avarta}
           sx={{ width: '30px', height: '30px', margin: '10px' }}
          />
          <div style={{ width: '100%', overflow: 'hidden' }}>
           <strong
            style={{
             padding: 0,
             margin: 0,
             whiteSpace: 'nowrap',
             overflow: 'hidden',
             textOverflow: 'ellipsis',
             textTransform: 'capitalize',
            }}
           >
            {item.user.name}
           </strong>
           <p
            style={{ maxWidth: '200px' }}
            className={
             item.is_seen === 0
              ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[700]'
              : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis'
            }
           >
            {handleChatLastText(item.last_text, item.idSend)}
           </p>
          </div>
          <div className='h-full mr-4 flex items-start'>
           <p className='mt-3 text-xs'>{handleTimeUserChat(item.sendAt)}</p>
          </div>
         </Box>
        )
       })}
      </Box>
     </AccordionDetails>
    </Accordion>

    <Accordion>
     <AccordionSummary
      expandIcon={<AddIcon sx={{ cursor: 'pointer' }} onClick={handleOpen} />}
      aria-controls='panel2a-content'
      id='panel2a-header'
     >
      <ExpandMoreIcon />
      <Typography>Group</Typography>
     </AccordionSummary>
     <AccordionDetails>
      <Box
       sx={{
        maxHeight: '400px',
        overflowY: 'auto',
       }}
      >
       {groupList?.map((item, index) => {
        if (item.numberMems >= 1) {
         return (
          <Box
           key={index}
           sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            margin: '20px',
            padding: '10px',
            color: 'text.main',
            '&:hover': {
             backgroundColor: '#BFEFFF',
             cursor: 'pointer',
            },
           }}
           onClick={() => handleGroupClick(item)}
          >
           <div className='flex gap-2 items-center'>
            <Avatar
             src={item.linkAvatar}
             sx={{ width: '30px', height: '30px' }}
            />
            <div className='flex flex-col gap-2' style={{ width: '100%' }}>
             <h3 className='text-capitalize fs-6 fw-bold mb-0'>{item.name}</h3>
             {/* <p
              style={{
               padding: 0,
               margin: 0,
               whiteSpace: 'nowrap',
               overflow: 'hidden',
               textOverflow: 'ellipsis',
              }}
             >
              {msgGroupLast.type}
             </p> */}
            </div>
           </div>

           {/* <p className='mb-0'>{item.numberMems}</p> */}
          </Box>
         )
        } else {
         return null
        }
       })}
      </Box>
     </AccordionDetails>
    </Accordion>
   </Box>

   <div
    className='mb-2'
    style={{
     borderLeft: '1px solid black',
     borderRight: '1px solid black',
     height: 'auto',
    }}
   >
    <Box
     sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      color: 'text.main',
      backgroundColor: 'bg.main',
      borderBottom: '1px solid #999',
     }}
    >
     <div style={{ display: 'flex', alignItems: 'center' }}>
      <Avatar
       style={{
        height: '40px',
        width: '40px',
        marginRight: '15px',
       }}
       src={infoOtherUser.Avarta || groupItem.linkAvatar}
       alt='avatar'
      />

      <h3 style={{ margin: 0, textTransform: 'capitalize' }}>
       {infoOtherUser.name || groupItem.name || 'Anonymous chatter'}
      </h3>
     </div>
     <div
      style={{
       display: 'flex',
       flexDirection: 'column',
       justifyContent: 'center',
       alignItems: 'center',
      }}
     ></div>
     <MoreHorizIcon />
    </Box>
    <Box
     ref={scrollContainerRef}
     sx={{
      backgroundColor: 'bgitem.main',
      height: '515px',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      padding: '10px',
     }}
    >
     {/* Đã cập nhật để hiển thị tin nhắn từ server */}
     {messageGroup.length > 0 ? (
      <>
       {messageGroup.map((item) =>
        item.idSend === user.id ? (
         <div key={item.id} className='h-auto mb-2 flex flex-col items-end'>
          <div className='flex gap-2 mb-1'>
           <div className='flex items-center hover-message gap-1'>
            <div className='flex flex-col gap-1 items-end'>
             {item.image.trim() !== '' && (
              <div>
               <img
                className={`h-auto rounded-md ${
                 item.type === 'image' ? 'w-[100px]' : 'w-[30px]'
                }`}
                src={item.image}
               />
              </div>
             )}

             {item.content && (
              <p
               style={{
                width: 'max-content',
                overflowWrap: 'anywhere',
                maxWidth: '250px',
               }}
               className='break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto'
              >
               {item.content}
              </p>
             )}
            </div>
           </div>
          </div>

          <time className='text-xs text-black-50'>
           {handleTimeUserChat(item.sendAt)}
          </time>
         </div>
        ) : (
         <div key={item.id} className='h-auto mb-2'>
          <div className='flex gap-2 mb-1'>
           <div className='flex gap-1 items-end'>
            <img
             className='object-fit-cover rounded-circle'
             style={{ width: '40px', height: '40px' }}
             src={item.avt}
             alt='avatar other_user'
            />
           </div>

           <div className='flex items-center hover-message gap-1'>
            <div className='flex flex-col gap-1'>
             {item.image.trim() !== '' && (
              <div>
               <img
                className={`h-auto rounded-md ${
                 item.type === 'image' ? 'w-[100px]' : 'w-[30px]'
                }`}
                src={item.image}
               />
              </div>
             )}

             {item.content && (
              <p
               style={{
                width: 'max-content',
                overflowWrap: 'anywhere',
                maxWidth: '250px',
               }}
               className='break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto'
              >
               {item.content}
              </p>
             )}
            </div>
           </div>
          </div>

          <time className='text-xs text-black-50'>
           {handleTimeUserChat(item.sendAt)}
          </time>
         </div>
        )
       )}
      </>
     ) : (
      <>
       {message.map((item) =>
        item.idSend === user.id ? (
         <div key={item.id} className='h-auto mb-2 flex flex-col items-end'>
          <div className='flex gap-2 mb-1'>
           <div className='flex items-center hover-message gap-1'>
            <button
             style={{
              border: 'none',
              backgroundColor: 'transparent',
              transition: 'all .3s ease-in-out',
             }}
             className='d-none'
             onClick={() => {
              handleDeleteMessage(item.id)
             }}
            >
             <DeleteIcon />
            </button>

            <div className='flex flex-col gap-1 items-end'>
             {item.image && (
              <div>
               <img
                className={`h-auto rounded-md ${
                 item.type === 'image' ? 'w-[100px]' : 'w-[30px]'
                }`}
                src={item.image}
               />
              </div>
             )}

             {item.text.trim() !== '' && (
              <p
               style={{
                width: 'max-content',
                overflowWrap: 'anywhere',
                maxWidth: '250px',
               }}
               className='break-words bg-[#007AFF] text-white h-auto rounded-[26.14px] p-2 my-auto'
              >
               {item.text}
              </p>
             )}
            </div>
           </div>
          </div>

          <time className='text-xs text-black-50'>
           {handleTimeUserChat(item.sendAt)}
          </time>
         </div>
        ) : (
         <div key={item.id} className='h-auto mb-2'>
          <div className='flex gap-2 mb-1'>
           <div className='flex gap-1 items-end'>
            <img
             className='object-fit-cover rounded-circle'
             style={{ width: '40px', height: '40px' }}
             src={infoOtherUser.Avarta}
             alt='avatar other_user'
            />
           </div>

           <div className='flex items-center hover-message gap-1'>
            <div className='flex flex-col gap-1'>
             {item.image && (
              <div>
               <img
                className={`h-auto rounded-md ${
                 item.type === 'image' ? 'w-[100px]' : 'w-[30px]'
                }`}
                src={item.image}
               />
              </div>
             )}

             {item.text.trim() !== '' && (
              <p
               style={{
                width: 'max-content',
                overflowWrap: 'anywhere',
                maxWidth: '250px',
               }}
               className='break-words bg-[#F2F2F7] h-auto rounded-[26.14px] p-2 my-auto'
              >
               {item.text}
              </p>
             )}
            </div>
            <button
             style={{
              border: 'none',
              backgroundColor: 'transparent',
              transition: 'all .3s ease-in-out',
             }}
             className='d-none'
             onClick={() => {
              handleDeleteMessage(item.id)
             }}
            >
             <DeleteIcon />
            </button>
           </div>
          </div>

          <time className='text-xs text-black-50'>
           {handleTimeUserChat(item.sendAt)}
          </time>
         </div>
        )
       )}
      </>
     )}
    </Box>

    <form
     onSubmit={(e) => {
      e.preventDefault()
      handleSubmitMessage()
     }}
     className='form-message position-relative'
    >
     <div>
      <button type='button' className='border-none' onClick={handleToggleEmoji}>
       <EmojiEmotionsIcon />
      </button>
     </div>

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

     <div className='w-100'>
      {image && (
       <div style={{ width: 'max-content' }} className='mb-1 position-relative'>
        <button
         className='delete-image'
         onClick={() => setMessageForm({ ...messageForm, image: null })}
        >
         <CancelIcon />
        </button>

        <img
         style={{ width: '80px', height: '50px', objectFit: 'cover' }}
         src={`${BASE64_URL}${image}`}
         alt='image message'
         className='rounded'
        />
       </div>
      )}

      <input
       type='text'
       placeholder='Type your message...'
       onChange={handleChangeValueMsg}
       value={messageForm.content}
      />
     </div>

     <div>
      <input
       id='file'
       type='file'
       className='hidden m-0'
       onChange={handleChangeImageMsg}
      />
      <label htmlFor='file'>
       <AttachFileIcon />
      </label>
     </div>

     <button
      type='submit'
      className={content || image || emoji ? 'text-[#1976d2]' : 'text-black'}
     >
      <SubdirectoryArrowRightSharpIcon sx={{ cursor: 'pointer' }} />
     </button>
    </form>
   </div>
   <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby='modal-modal-title'
    aria-describedby='modal-modal-description'
   >
    <Box
     sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
     }}
    >
     <Typography id='modal-modal-title' variant='h6' component='h2'>
      Create Group
     </Typography>
     <TextField
      fullWidth
      label='Group Name'
      variant='outlined'
      margin='normal'
      value={groupName}
      onChange={handleGroupNameChange}
     />
     <TextField
      fullWidth
      label='Description'
      variant='outlined'
      margin='normal'
      value={groupDescription}
      onChange={handleGroupDescriptionChange}
     />
     <List>
      {members?.map((member, index) => (
       <ListItem key={index}>
        <ListItemText primary={member.gmail} secondary={member.role} />
        <ListItemSecondaryAction>
         <IconButton edge='end' onClick={() => handleRemoveMember(index)}>
          <DeleteIcon />
         </IconButton>
        </ListItemSecondaryAction>
       </ListItem>
      ))}
     </List>
     <Box
      sx={{
       display: 'flex',
       alignItems: 'center',
       justifyContent: 'space-between',
       mt: 2,
      }}
     >
      <TextField
       label='Member Email'
       value={memberEmail}
       onChange={handleMemberEmailChange}
       fullWidth
      />
      <TextField
       label='Member ID'
       value={memberId}
       onChange={handleMemberIdChange}
       fullWidth
      />
      <IconButton onClick={handleAddMember}>
       <AddIcon />
      </IconButton>
     </Box>
     <Box sx={{ mt: 3, textAlign: 'right' }}>
      <Button variant='contained' color='primary' onClick={handleCreateGroup}>
       Create
      </Button>
     </Box>
    </Box>
   </Modal>
  </div>
 )
}

export default UserGroup
