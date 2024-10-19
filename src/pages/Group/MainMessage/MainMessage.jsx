import { useRef, useState, useEffect, useContext } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

import { AppContext } from '../../../context'

import FormMessage from './FormMessage'
import Information from './Information'
import SettingGroup from './SettingGroup'

import avatarDefault from '../../../assets/avatar-default.png'
import bgMessage from '../../../assets/img-chat-an-danh.jpg'

import CameraAltIcon from '@mui/icons-material/CameraAlt'

import { fetchApiSamenote } from '../../../utils/fetchApiSamnote'
import MessageChatCard from './MessageChatCard'
import MessageComponent from './MessageComponent'
import MessageGroupCard from './MessageGroupCard'

const MainMessage = ({ socket, typeFilterChat, getAllMessageList }) => {
 const appContent = useContext(AppContext)
 const { user } = appContent
 const { id } = useParams()
 const { pathname } = useLocation()

 // ********************************

 const [typeMessage, setTypeMessage] = useState(null)

 const [infoMessageChat, setInfoMessageChat] = useState({
  name: '',
  avatar: '',
  id: null,
 })
 const [infoMessageGroup, setInfoMessageGroup] = useState({
  idGroup: null,
  idOwner: null,
  avatar: '',
  name: '',
  members: [],
 })

 const [messagesChat, setMessagesChat] = useState([])
 const [messagesGroup, setMessagesGroup] = useState([])

 //  var setting group
 const [valueGroupName, setValueGroupName] = useState('')
 const [disableGroupName, setDisableGroupName] = useState(true)
 const inputGroupNameRef = useRef()
 const formGroupNameRef = useRef()
 const buttonClickEditNameGroup = useRef()

 const [showInforMation, setShowInforMation] = useState(false)
 const [groupMemberList, setGroupMemberList] = useState([])

 const handleHideInformation = () => {
  setShowInforMation(false)
 }

 // get data messages
 const getInfoMessageChat = () =>
  fetchApiSamenote('get', `/profile/${id}`).then((data) => {
   const newInfoMessage = {
    name: data.user.name,
    avatar: data.user.Avarta,
    id: data.user.id,
   }

   setInfoMessageChat(newInfoMessage)
  })

 const getInfoMesssageGroup = (groupId) =>
  fetchApiSamenote('get', `/group/only/${groupId}`).then((data) => {
   setInfoMessageGroup({
    idGroup: data.data.idGroup,
    idOwner: data.data.idOwner,
    avatar: data.data.avt.avt,
    name: data.data.name,
    members: data.data.members,
   })

   setValueGroupName(data.data.name)
  })

 const getMessagesChat = (userID, otherID) =>
  fetchApiSamenote(
   'get',
   `/message/list_message_chat1vs1/${userID}/${otherID}`,
   {},
   { page: 1 }
  ).then((data) => {
   const newMessagesChat = []
   data.data.map((item) => {
    return item.messages.map((message) => newMessagesChat.push(message))
   })

   setMessagesChat(newMessagesChat)
  })

 const getMessagesGroup = (groupID) =>
  fetchApiSamenote('get', `/group/messages/${groupID}`, {}, { page: 1 }).then(
   (data) => {
    setMessagesGroup(data.data)
   }
  )

 // handle socket

 useEffect(() => {
  if (!socket) return

  socket.on('send_message', (result) => {
   if (result.message === 'Error') return
   getAllMessageList()

   const { ReceivedID, SenderID, MessageID } = result?.data
   if (SenderID === user?.id) {
    fetchApiSamenote('post', `/message/${MessageID}`).then((data) => {
     getAllMessageList()
    })
   }

   if (
    typeMessage === 'chat' &&
    (ReceivedID === infoMessageChat.id || SenderID === infoMessageChat.id)
   ) {
    getMessagesChat(user?.id, ReceivedID === user?.id ? SenderID : ReceivedID)
   }
  })

  socket.on('chat_group', (result) => {
   getAllMessageList()

   if (typeMessage === 'group') {
    const newIdGroup = result.data.idGroup
    getMessagesGroup(newIdGroup)
   }
  })
  // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [socket, typeFilterChat, typeMessage, pathname])

 // handle link profile to group
 //  useEffect(() => {
 //   if (!state || !socket) return

 //   const roomSplit = (idUser, idOther) =>
 //    idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 //   setInfoMessageChat({ ...infoMessageChat, name: 'chat' })
 //   setInfoMessageChat(state || {})

 //   // đặt mối quan hệ true vs user khác
 //   fetchApiSamenote('post', `/chatblock/${user?.id}`, {
 //    idReceive: state.id,
 //   })

 //   // join room chat
 //   socket.emit('join_room', { room: roomSplit(user?.id, state.id) })
 //   state?.id &&
 //    fetchApiSamenote(
 //     'get',
 //     `/message/list_message_chat1vs1/${user?.id}/${state?.id}`,
 //     {},
 //     { page: 1 }
 //    ).then((data) => {
 //     const newMessagesChat = []
 //     data.data.map((item) => {
 //      return item.messages.map((message) => newMessagesChat.push(message))
 //     })

 //     setMessagesChat(newMessagesChat)
 //    })
 //  }, [state, socket])

 //  ****************************************

 useEffect(() => {
  const isChat = pathname.includes('chat')
  const isGroup = pathname.includes('group')

  if (!isChat && !isGroup) {
   // reset data
   setInfoMessageChat({
    name: '',
    avatar: '',
    id: null,
   })

   setInfoMessageGroup({
    idGroup: null,
    idOwner: null,
    avatar: '',
    name: '',
    members: [],
   })

   setTypeMessage(null)
  }

  if (isChat) {
   setTypeMessage('chat')
   setInfoMessageGroup({
    idGroup: null,
    idOwner: null,
    avatar: '',
    name: '',
    members: [],
   })

   getInfoMessageChat()
  }

  if (isGroup) {
   setTypeMessage('group')
   setInfoMessageChat({
    name: '',
    avatar: '',
    id: null,
   })

   getInfoMesssageGroup(id)
   fetchApiSamenote('get', `/group/only/${id}`).then((data) => {
    const memberList = data.data.members
    setGroupMemberList(memberList)
   })
  }
 }, [id, pathname])

 useEffect(() => {
  if (infoMessageChat.id) {
   getMessagesChat(user?.id, infoMessageChat.id)
  }

  if (infoMessageGroup.idGroup) {
   getMessagesGroup(infoMessageGroup.idGroup)
  }
 }, [infoMessageChat.id, infoMessageGroup.idGroup, user?.id])

 // handle message chat
 const handleDeleteMessage = async (messageID) => {
  fetchApiSamenote('delete', `/message/${messageID}`).then(() => {
   getAllMessageList()
   getMessagesChat(user?.id, infoMessageChat.id)
  })
 }

 //  handle setting group
 const updateAvatarGroup = async (idGroup, newAvatar) => {
  fetchApiSamenote('patch', `/group/update/${idGroup}`, {
   linkAvatar: newAvatar,
  }).then((response) => {
   getAllMessageList()

   // render new avatar
   setTimeout(() => {
    const ulElement = document.querySelector('#list-chat')
    const liElementActive = ulElement.querySelector('li.active')

    liElementActive.click()
   }, 300)
  })
 }

 const updateNameGroup = async (idGroup, newName) => {
  fetchApiSamenote('patch', `/group/update/${idGroup}`, {
   groupName: newName,
  }).then((response) => {
   setDisableGroupName(true)
   //  setInfoGroupItem({ ...infoGroupItem, name: newName })
   getAllMessageList()
  })
 }

 const handleChangeNameGroup = (e) => {
  setValueGroupName(e.target.value)
 }

 const handleChangeAvatarGroup = async (e) => {
  if (!infoMessageGroup.idGroup) return

  const reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  reader.onload = () => {
   // @ts-ignore
   const imageBase64 = reader.result.split(',')[1]
   updateAvatarGroup(infoMessageGroup.idGroup, imageBase64)
  }

  e.target.value = null
 }

 const handleSubmitFormNameGroup = (e) => {
  e.preventDefault()
  if (!infoMessageGroup.idGroup) return

  if (
   valueGroupName.trim() !== '' &&
   valueGroupName.trim() !== infoMessageGroup.name
  ) {
   updateNameGroup(infoMessageGroup.idGroup, valueGroupName)
  }
 }

 const propsSettingGroup = {
  userID: user?.id,
  formName: typeMessage,
  groupItem: infoMessageGroup,

  groupMemberList,
  setGroupMemberList,

  setShowInforMation,
  getAllMessageList,
 }

 const propsFormMessage = {
  userID: user?.id,
  otherUserID: infoMessageChat?.id,
  idGroup: infoMessageGroup.idGroup,

  formName: typeMessage,
  socket,
 }

 const propsInformation = {
  showInfo: showInforMation,
  onHide: handleHideInformation,

  groupItem: infoMessageGroup,
  groupMemberList,
 }

 // handle scroll content message
 const scrollViewRef = useRef()
 useEffect(() => {
  scrollViewRef?.current.scrollIntoView()
 }, [messagesChat, messagesGroup])

 // hande click outside element

 useEffect(() => {
  const handleClickOutside = (element) => {
   if (
    !formGroupNameRef.current ||
    !inputGroupNameRef.current ||
    !buttonClickEditNameGroup.current ||
    !disableGroupName ||
    infoMessageGroup.name.trim() === '' ||
    valueGroupName.trim() === ''
   )
    return

   if (
    !formGroupNameRef.current?.contains(element) &&
    !inputGroupNameRef.current.disabled &&
    !buttonClickEditNameGroup.current?.contains(element)
   ) {
    setDisableGroupName(true)
    setValueGroupName(infoMessageGroup.name)
   }
  }

  document.body.addEventListener('click', (e) => {
   handleClickOutside(e.target)
  })

  return document.body.removeEventListener('click', (e) => {
   handleClickOutside(e.target)
  })
 }, [
  formGroupNameRef,
  inputGroupNameRef,
  buttonClickEditNameGroup,
  disableGroupName,
  infoMessageGroup,
 ])

 const isLeaderTeam = (idOwner) => {
  return idOwner === user?.id
 }

 console.log('messagesChat', messagesChat)

 return (
  <div
   style={{ boxShadow: '0px 8px 10px 0px #00000040' }}
   className='hidden col-md-8 col-xl-9 px-0 md:flex flex-col'
  >
   <div className='flex justify-between items-center bg-[#dffffe] py-[20px] px-[15px] xl:py-[30px] xl:px-[20px]'>
    <div className='flex gap-2 items-center'>
     <div className='position-relative'>
      <Link to={infoMessageChat.id && `/profile/${infoMessageChat.id}`}>
       <img
        className='xl:size-[90px] size-[60px] object-cover rounded-[100%]'
        src={infoMessageGroup.avatar || infoMessageChat.avatar || avatarDefault}
        alt='avatar'
       />
      </Link>

      {typeMessage === 'group' && (
       <div className='position-absolute bg-[#d9d9d9] w-[30px] h-[30px] rounded-full right-0 bottom-0 flex items-center justify-center'>
        <input
         onChange={handleChangeAvatarGroup}
         id='file-avatar-group'
         type='file'
         className='hidden m-0'
         disabled={!isLeaderTeam(infoMessageGroup.idOwner)}
        />
        <label htmlFor='file-avatar-group' className='flex cursor-pointer'>
         <CameraAltIcon className='text-[20px]' />
        </label>
       </div>
      )}
     </div>

     <h5 className='xl:text-xl text-lg capitalize'>
      {typeMessage === 'chat'
       ? infoMessageChat.name
       : !typeMessage
       ? 'Anonymous chatter'
       : ''}
     </h5>

     {typeMessage === 'group' && (
      <form
       onSubmit={handleSubmitFormNameGroup}
       className='flex items-center'
       ref={formGroupNameRef}
      >
       <div>
        <input
         disabled={disableGroupName}
         type='text'
         size={valueGroupName?.length}
         value={valueGroupName}
         onChange={handleChangeNameGroup}
         ref={inputGroupNameRef}
         autoFocus={true}
         className={`px-2 py-1 rounded-md ${
          disableGroupName ? '' : 'bg-[#252f31] text-white'
         }`}
        />
       </div>

       <button
        onClick={(e) => {
         if (!isLeaderTeam(infoMessageGroup.idOwner)) return

         return disableGroupName
          ? setDisableGroupName(false)
          : handleSubmitFormNameGroup(e)
        }}
        ref={buttonClickEditNameGroup}
        title={disableGroupName ? 'Edit name' : 'Save name'}
        type='button'
        disabled={valueGroupName === infoMessageGroup.name && !disableGroupName}
        className={
         valueGroupName?.trim() === infoMessageGroup.name && !disableGroupName
          ? 'cursor-not-allowed text-[#d1deeb]'
          : disableGroupName
          ? ''
          : 'text-[#1976d2]'
        }
       >
        <svg
         className='xl:size-[40px] size-[30px]'
         viewBox='0 0 40 40'
         fill={
          valueGroupName.trim() === infoMessageGroup?.name && !disableGroupName
           ? '#d1deeb'
           : disableGroupName
           ? ''
           : '#1976d2'
         }
         xmlns='http://www.w3.org/2000/svg'
        >
         <g clipPath='url(#clip0_373_1556)'>
          <path d='M31.111 33.3337H6.66656V8.88921H21.3554L23.5777 6.66699H6.66656C6.07719 6.66699 5.51196 6.90112 5.09521 7.31787C4.67846 7.73461 4.44434 8.29984 4.44434 8.88921V33.3337C4.44434 33.923 4.67846 34.4883 5.09521 34.905C5.51196 35.3218 6.07719 35.5559 6.66656 35.5559H31.111C31.7004 35.5559 32.2656 35.3218 32.6824 34.905C33.0991 34.4883 33.3332 33.923 33.3332 33.3337V16.667L31.111 18.8892V33.3337Z' />
          <path d='M37.2555 6.48888L33.511 2.74444C33.3449 2.5778 33.1474 2.4456 32.9301 2.35539C32.7127 2.26518 32.4797 2.21875 32.2444 2.21875C32.009 2.21875 31.776 2.26518 31.5587 2.35539C31.3413 2.4456 31.1439 2.5778 30.9777 2.74444L15.7444 18.0667L14.511 23.4111C14.4585 23.6702 14.464 23.9377 14.5272 24.1943C14.5904 24.451 14.7097 24.6905 14.8765 24.8956C15.0433 25.1006 15.2535 25.2662 15.4919 25.3803C15.7304 25.4944 15.9911 25.5543 16.2555 25.5555C16.3921 25.5705 16.53 25.5705 16.6666 25.5555L22.0555 24.3667L37.2555 9.02221C37.4221 8.85604 37.5543 8.65861 37.6445 8.44126C37.7347 8.2239 37.7812 7.99088 37.7812 7.75555C37.7812 7.52022 37.7347 7.28719 37.6445 7.06984C37.5543 6.85248 37.4221 6.65506 37.2555 6.48888ZM20.8999 22.3111L16.8333 23.2111L17.7777 19.1778L29.2444 7.63333L32.3777 10.7667L20.8999 22.3111ZM33.6333 9.5111L30.4999 6.37777L32.2221 4.62221L35.3777 7.77777L33.6333 9.5111Z' />
         </g>
         <defs>
          <clipPath id='clip0_373_1556'>
           <rect width='40' height='40' fill='white' />
          </clipPath>
         </defs>
        </svg>
       </button>
      </form>
     )}
    </div>

    <SettingGroup data={propsSettingGroup} />
   </div>

   <div
    style={{
     background: `url(${bgMessage}) no-repeat center/cover`,
     boxShadow: '10px 0px 10px 0px #00000040, 0px 1px 10px 0px #00000040',
    }}
    className='flex-grow-1 flex flex-col position-relative'
   >
    <div className='flex-grow-1 p-[20px] h-[30vh] overflow-auto style-scrollbar-y style-scrollbar-y-md'>
     <ul id='message-content'>
      {typeMessage === 'chat' && (
       <MessageComponent
        data={messagesChat}
        renderItem={(message) => (
         <MessageChatCard
          key={message.id}
          message={message}
          userID={user?.id}
          onDeleteMessage={handleDeleteMessage}
          avatar={infoMessageChat.avatar}
         />
        )}
       />
      )}

      {typeMessage === 'group' && (
       <MessageComponent
        data={messagesGroup}
        renderItem={(message) => (
         <MessageGroupCard
          key={message.id}
          message={message}
          userID={user?.id}
         />
        )}
       />
      )}

      <span ref={scrollViewRef}></span>
     </ul>
    </div>

    <FormMessage {...propsFormMessage} />
    <Information data={propsInformation} />
   </div>
  </div>
 )
}

export default MainMessage
