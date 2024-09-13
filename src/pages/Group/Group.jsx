import { useContext, useEffect, useRef, useState } from 'react'
import './Group.css'

import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import io from 'socket.io-client'
import Swal from 'sweetalert2'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { schemaGroup } from '../../utils/schema/schema'

import Modal from 'react-bootstrap/Modal'

import addUser from '../../assets/add-user.png'
import avatarDefault from '../../assets/avatar-default.png'
import bgMessage from '../../assets/img-chat-an-danh.jpg'
import textNote from '../../assets/text-note.png'

import configs from '../../configs/configs.json'
import { AppContext } from '../../context'
import FormMessage from './FormMessage/FormMessage'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CheckIcon from '@mui/icons-material/Check'
import DeleteIcon from '@mui/icons-material/Delete'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import SaveIcon from '@mui/icons-material/Save'

import {
 Box,
 Button,
 IconButton,
 List,
 ListItem,
 ListItemSecondaryAction,
 ListItemText,
 TextField,
 Typography,
} from '@mui/material'
import { document } from 'postcss'

const { API_SERVER_URL } = configs

const Group = () => {
 const appContext = useContext(AppContext)
 const { setSnackbar, user } = appContext

 const [socket, setSocket] = useState(null)

 // var chat users
 const [chatUser, setChatUser] = useState({
  userList: [],
  chatUserRef: useRef(),
  heightChatUser: '300',
 })
 const { userList, chatUserRef, heightChatUser } = chatUser
 const [typeFilterChatUser, setTypeFilterChatUser] = useState('All')
 const [infoOtherUser, setInfoOtherUser] = useState({})
 const [messageList, setMessageList] = useState([])

 // var search user
 const [searchUser, setSearchUser] = useState({
  searchUserName: '',
  searchUserResult: [],
  showModalSearch: false,
  messageNotifi: '',
 })
 const { searchUserName, searchUserResult, showModalSearch, messageNotifi } =
  searchUser

 // var chat group
 const [chatGroup, setChatGroup] = useState({
  groupList: [],
  chatGroupRef: useRef(),
  heightChatGroup: '300',
 })
 const { groupList, chatGroupRef, heightChatGroup } = chatGroup
 const [typeFilterChatGroup, setTypeFilterChatGroup] = useState('All')
 const [infoGroupItem, setInfoGroupItem] = useState({})
 const [messageGroupList, setMessageGroupList] = useState([])

 // var content message
 const [messageContent, setMessageContent] = useState({
  messageContentRef: useRef(),
  inputMessageFormRef: useRef(),
  heightMessageContent: '500',
 })
 const { inputMessageFormRef, messageContentRef, heightMessageContent } =
  messageContent

 const [formName, setFormName] = useState(null)

 //______________________________________

 const fetchUserChat = async () => {
  const response = await axios.get(
   `${API_SERVER_URL}/message/list_user_chat1vs1/${user.id}`
  )

  if (typeFilterChatUser === 'All') {
   response.data.data.filter((item) => {
    return socket.emit('join_room', { room: item.idRoom })
   })

   return setChatUser({ ...chatUser, userList: response.data.data })
  }

  if (typeFilterChatUser === 'Unread') {
   response.data.data.filter((item) => {
    if (item.is_seen !== 1)
     return socket.emit('join_room', { room: item.idRoom })
   })

   return setChatUser({
    ...chatUser,
    userList: response.data.data.filter((user) => user.is_seen !== 1),
   })
  }

  if (typeFilterChatUser === 'Read') {
   response.data.data.filter((item) => {
    if (item.is_seen !== 0)
     return socket.emit('join_group', { room: item.idRoom })
   })

   return setChatUser({
    ...chatUser,
    userList: response.data.data.filter((user) => user.is_seen !== 0),
   })
  }
 }

 const getGroups = async (idOwner) => {
  try {
   const res = await axios.get(`${API_SERVER_URL}/group/all/${idOwner}`)

   res.data.data.map((item) => {
    if (item.numberMems >= 1) {
     socket.emit('join_room ', { room: item.idGroup })
    }
   })

   setChatGroup({ ...chatGroup, groupList: res.data.data })
  } catch (err) {
   console.error(err)
  }
 }

 useEffect(() => {
  const socketIo = io(API_SERVER_URL)

  socketIo.on('connect', () => {
   console.log('Connected to server')
   setSocket(socketIo)
  })
 }, [])

 useEffect(() => {
  if (socket) {
   socket.on('send_message', (result) => {
    const { ReceivedID, SenderID } = result.data
    console.log(result)

    fetchUserChat()
    getMessageList(user.id, ReceivedID === user.id ? SenderID : ReceivedID)
   })

   //  socket.on('join_room', (result) => {
   //   console.log('join_room', result)
   //  })

   socket.on('chat_group', (result) => {
    console.log('message received from server', result)

    getGroups(user.id)
    fetchMessagesGroup(infoGroupItem.idGroup)
   })

   getGroups(user.id)
   fetchUserChat()
  }
 }, [socket, typeFilterChatUser])

 // *********** handle chat user messages
 const handleClickChatUser = (otherUser) => {
  if (otherUser.is_seen === 0 && otherUser.idReceive === user.id) {
   fetchUpdateSeenMessage(otherUser.idMessage)
  }
  getMessageList(user.id, otherUser.user.id)

  setInfoOtherUser(otherUser.user)
  resetGroup()
 }

 const handleDeleteMessage = async (messageID) => {
  try {
   const response = await axios.delete(`${API_SERVER_URL}/message/${messageID}`)

   getMessageList(user.id, infoOtherUser.id)
   fetchUserChat()
  } catch (error) {
   console.log(error)
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

 const getMessageList = async (userID, otherUserID) => {
  try {
   const response = await axios.get(
    `${API_SERVER_URL}/message/list_message_chat1vs1/${userID}/${otherUserID}`
   )

   setMessageList(
    response.data.data.length ? response.data.data[0].messages : []
   )

   // @ts-ignore
   messageContentRef.current.scrollTop = heightMessageContent
  } catch (error) {
   console.log(error)
  }
 }

 const convertTime = (time) => moment(`${time}+0700`).calendar()

 const handleChatLastText = (lastText, idSend) =>
  idSend === user.id ? `Bạn: ${lastText}` : `${lastText}`

 // ** search user buy name

 const fetchSearchUser = async (userName) => {
  try {
   const url = `${API_SERVER_URL}/group/search_user_by_word`
   const response = await axios.post(url, {
    start_name: userName,
   })

   setSearchUser({
    ...searchUser,
    searchUserResult: response.data.data ? response.data.data : [],
    messageNotifi: response.data.message ? response.data.message : '',
   })
  } catch (error) {
   console.error(error)
  }
 }

 const postRelation = async (userID, otherUserID) => {
  try {
   const response = await axios.post(`${API_SERVER_URL}/chatblock/${userID}`, {
    idReceive: otherUserID,
   })
  } catch (error) {
   console.log(error)
  }
 }

 const handleChangeSearchUser = (e) => {
  setSearchUser({ ...searchUser, searchUserName: e.target.value })
 }

 const handleSubmitSearchUser = (e) => {
  e.preventDefault()
  if (
   searchUserName.trim().split(' ').length !== 1 ||
   searchUserName.trim() === ''
  )
   return

  fetchSearchUser(searchUserName)
 }

 const handleClickSearchBtn = (otherUser) => {
  if (!otherUser) return
  const newInfoOtherUser = {
   id: otherUser.idUser,
   Avarta: otherUser.linkAvatar,
   name: otherUser.userName,
  }

  socket.emit('join_room', { room: `${otherUser.idUser}#${user.id}` })

  setInfoOtherUser(newInfoOtherUser)
  resetGroup()

  postRelation(user.id, otherUser.idUser)
  getMessageList(user.id, otherUser.idUser)

  handleHideModalSearch()
  inputMessageFormRef.current.focus()
 }

 const handleSubmitSearchGroup = (e) => {
  e.preventDefault()
  console.log('search group')
 }

 const handleShowModalSearch = (e) => {
  setSearchUser({ ...searchUser, showModalSearch: true })
  setSearchUserFormName('chat')
 }

 const handleHideModalSearch = (e) => {
  setSearchUser({
   ...searchUser,
   searchUserResult: [],
   searchUserName: '',
   showModalSearch: false,
   messageNotifi: '',
  })

  setSearchUserFormName('chat')
 }

 // * handle filter message
 const handleFilterMessage = (e) => {
  const type = e.target.innerHTML
  if (type === typeFilterChatUser) return

  setTypeFilterChatUser(type)
 }

 // set height messages, height chat messages, height chat group
 useEffect(() => {
  // @ts-ignore
  messageContentRef.current.offsetHeight &&
   // @ts-ignore
   setMessageContent({
    ...messageContent,
    heightMessageContent: `${messageContentRef.current.offsetHeight - 50}`,
   })

  // @ts-ignore
  chatUserRef.current.offsetHeight &&
   // @ts-ignore
   setChatUser({
    ...chatUser,
    heightChatUser: `${chatUserRef.current.offsetHeight}`,
   })

  // @ts-ignore
  chatGroupRef.current.offsetHeight &&
   // @ts-ignore
   setChatGroup({
    ...chatGroup,
    heightChatGroup: `${chatGroupRef.current.offsetHeight}`,
   })
 }, [])

 // *** handle group

 const resetGroup = () => {
  setInfoGroupItem({})
  setMessageGroupList([])
  setFormName('chat')
 }

 const resetChat = () => {
  setInfoOtherUser({})
  setMessageList([])
  setFormName('group')
 }

 // *********** handle group

 const [memberGroup, setMemberGroup] = useState({ gmail: '', id: '' })
 const [memberListGroup, setMemberListGroup] = useState([])

 const [showModalCreateGroup, setShowModalCreateGroup] = useState(false)

 const {
  register,
  handleSubmit,
  setValue,
  getValues,
  reset,
  formState: { errors },
 } = useForm({
  resolver: joiResolver(schemaGroup),
  defaultValues: { groupName: '', desc: '', members: null },
 })

 const resetModalCreateGroup = () => {
  setMemberGroup({ gmail: '', id: '' })
  setMemberListGroup([])
  reset()
 }

 const fetchMessagesGroup = async (groupID) => {
  try {
   const response = await axios.get(
    `${API_SERVER_URL}/group/messages/${groupID}`
   )
   setMessageGroupList(response.data.data)
  } catch (error) {
   console.log(error)
  }
 }

 const handleClickGroupItem = (group) => {
  fetchMessagesGroup(group.idGroup)
  setValueGroupName(group.name)

  setInfoGroupItem(group)
  resetChat()
 }

 const handleShowModalCreateGroup = () => {
  setShowModalCreateGroup(true)
 }

 const handleHideModalCreateGroup = () => {
  setShowModalCreateGroup(false)
  resetModalCreateGroup()
 }

 const postGroup = async (dataGroup, userID) => {
  try {
   const response = await axios.post(
    `${API_SERVER_URL}/group/create/${userID}`,
    dataGroup
   )
   setSnackbar({
    isOpen: true,
    message: `Create group complete`,
    severity: 'success',
   })

   // cập nhật group list
   getGroups(userID)

   // reset form create group
   setShowModalCreateGroup(false)
   resetModalCreateGroup()
  } catch (error) {
   setSnackbar({
    isOpen: true,
    message: error.response.data.message,
    severity: 'error',
   })
  }
 }

 const onSubmit = (data) => {
  const { groupName, desc, members } = data

  const group = {
   name: groupName,
   createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
   idOwner: user.id,
   describe: desc,
   r: 255,
   g: 255,
   b: 255,
   a: 0.99,
   members: members,
  }

  postGroup(group, user.id)
 }

 const handleAddMember = () => {
  const membersChema = getValues('members')
  const { gmail, id } = memberGroup

  const member = { gmail, id, role: 'member' }
  setMemberListGroup([...memberListGroup, member])
  setMemberGroup({ gmail: '', id: '' })

  setValue(
   'members',
   membersChema
    ? [...membersChema, { gmail: gmail, id: id, role: 'member' }]
    : [{ gmail, id: id, role: 'member' }]
  )
 }

 const handleDeleteMember = (index) => {
  setMemberListGroup(memberListGroup.filter((member, idx) => idx !== index))

  const membersChema = getValues('members')
  setValue(
   'members',
   membersChema.filter((member, idx) => idx !== index)
  )
 }

 const handleChangeMemberGroup = (e) =>
  setMemberGroup({ ...memberGroup, [e.target.name]: e.target.value })

 // props form message
 const propsFormMessage = {
  userID: user.id,
  otherUserID: infoOtherUser?.id,
  idGroup: infoGroupItem.idGroup,
  socket,
  messageContentRef,
  heightMessageContent,
  inputMessageFormRef,
  formName,
 }

 //  handle buttons group
 const [showButtonsGroup, setShowButtonsGroup] = useState(false)
 const ulElementButtonsGroupRef = useRef()
 const showButtonsGroupRef = useRef()
 const [typeButtonGroup, setTypeButtonGroup] = useState(null)

 const fetchQuitGroup = async () => {}

 const handleQuitGroup = () => {
  setTypeButtonGroup('quit')
  // setShowButtonsGroup(false)

  Swal.fire({
   title: 'Are you sure?',
   text: 'Do you want to leave the group?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes',
  }).then((result) => {
   if (result.isConfirmed) {
    Swal.fire({
     title: 'Quitted!',
     text: 'You have left the group.',
     icon: 'success',
    })
   }
  })
 }

 const [searchUserFormName, setSearchUserFormName] = useState('chat')

 const handleShowModalSearchUserGroup = () => {
  setSearchUser({ ...searchUser, showModalSearch: true })
  setSearchUserFormName('group')
  setTypeButtonGroup('add')
 }

 const handleClickSearchUserBtnAdd = (user) => {
  const idMemberList = [user.idUser]
  const idGroup = infoGroupItem.idGroup
  if (!idMemberList || !idGroup) return

  postMembersGroup(idMemberList, idGroup)
 }

 const postMembersGroup = async (idMemberList, idGroup) => {
  try {
   const response = await axios.post(`${API_SERVER_URL}/group/add/${idGroup}`, {
    idMembers: idMemberList,
   })

   handleHideModalSearch()
   setSnackbar({
    isOpen: true,
    message: `Add members successfully!`,
    severity: 'success',
   })
  } catch (error) {
   console.log(error)
  }
 }

 const [showModalMemberList, setShowModalMemberList] = useState(false)
 const [groupMemberList, setGroupMemberList] = useState([])

 useEffect(() => {
  infoGroupItem.idGroup && fetchAllMemberGroup(infoGroupItem.idGroup)
 }, [infoGroupItem.idGroup])

 const fetchAllMemberGroup = async (idGroup) => {
  try {
   const response = await axios.get(
    `https://samnote.mangasocial.online/group/only/${idGroup}`
   )

   setGroupMemberList(response.data.data.members)
  } catch (error) {
   console.log(error)
  }
 }

 const handleShowAllMembers = () => {
  setShowModalMemberList(true)
  setTypeButtonGroup('delete')
 }

 const handleHideModalMembers = () => {
  setShowModalMemberList(false)
 }

 const deleteMember = async (idMember) => {
  try {
   const response = await axios.delete(
    `https://samnote.mangasocial.online/group/quit/${idMember}>`
   )

   setSnackbar({
    isOpen: true,
    message: `Delete members successfully!`,
    severity: 'success',
   })
  } catch (error) {
   console.log(error)
  }
 }

 const [valueGroupName, setValueGroupName] = useState('')
 const [disableGroupName, setDisableGroupName] = useState(true)
 const inputGroupNameRef = useRef()
 const formGroupNameRef = useRef()
 const buttonClickEditNameGroup = useRef()

 const updateNameGroup = async (idGroup, newName) => {
  try {
   const response = await axios.patch(
    `${API_SERVER_URL}/group/update/${idGroup}`,
    { groupName: newName }
   )

   getGroups(user.id)
   setDisableGroupName(true)
   setInfoGroupItem({ ...infoGroupItem, name: newName })
  } catch (error) {
   console.log(error)
  }
 }

 const handleChangeNameGroup = (e) => {
  setValueGroupName(e.target.value)
 }
 const handleSubmitFormNameGroup = (e) => {
  e.preventDefault()
  if (!infoGroupItem.idGroup) return
  if (
   valueGroupName.trim() !== '' &&
   valueGroupName.trim() !== infoGroupItem.name
  ) {
   updateNameGroup(infoGroupItem.idGroup, valueGroupName)
  }
 }

 useEffect(() => {
  !disableGroupName && inputGroupNameRef.current.focus()
 }, [disableGroupName])

 useEffect(() => {
  if (!ulElementButtonsGroupRef.current || !showButtonsGroupRef.current) return
  const bodyElement = document.body

  if (!bodyElement) return

  const handleClickOutside = (element) => {
   if (
    !ulElementButtonsGroupRef?.current?.contains(element) &&
    !showButtonsGroupRef.current?.contains(element)
   ) {
    setShowButtonsGroup(false)
    setTypeButtonGroup(null)
   }
  }

  document.body.addEventListener('click', (e) => {
   handleClickOutside(e.target)
  })

  return document.body.removeEventListener('click', (e) => {
   handleClickOutside(e.target)
  })
 }, [ulElementButtonsGroupRef, showButtonsGroupRef])

 return (
  <div className='w-fluid'>
   <div className='row vh-100 mx-0'>
    <div className='col-6 group-sidebar flex flex-col px-0'>
     <h3 className='text-center py-[60px] px-3 font-bold'>Chat</h3>

     <Modal
      show={showModalCreateGroup}
      onHide={handleHideModalCreateGroup}
      size='sm'
      centered={false}
     >
      <Box
       component='form'
       onSubmit={handleSubmit(onSubmit)}
       sx={{
        width: 'max-content',
        maxWidth: '400px',
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
        type='text'
        variant='outlined'
        margin='normal'
        {...register('groupName')}
       />
       {errors.groupName && (
        <Box sx={{ mt: 1, color: 'red' }}>{errors.groupName.message}</Box>
       )}
       <TextField
        fullWidth
        label='Description'
        type='text'
        variant='outlined'
        margin='normal'
        {...register('desc')}
       />
       {errors.desc && (
        <Box sx={{ mt: 1, color: 'red' }}>{errors.desc.message}</Box>
       )}
       <List>
        {memberListGroup?.map((member, index) => (
         <ListItem key={index}>
          <ListItemText primary={member.gmail} secondary={member.role} />
          <ListItemSecondaryAction>
           <IconButton edge='end' onClick={() => handleDeleteMember(index)}>
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
         gap: '5px',
        }}
       >
        <TextField
         label='Member Email'
         name='gmail'
         type='email'
         fullWidth
         onChange={handleChangeMemberGroup}
         value={memberGroup.gmail}
        />

        <TextField
         label='Member ID'
         name='id'
         type='number'
         fullWidth
         onChange={handleChangeMemberGroup}
         value={memberGroup.id}
        />

        <IconButton
         disabled={
          memberGroup.gmail.trim() !== '' && memberGroup.id.trim() !== ''
           ? false
           : true
         }
         onClick={handleAddMember}
        >
         <AddIcon />
        </IconButton>
       </Box>

       {memberListGroup.length > 0 ? (
        ''
       ) : (
        <Box sx={{ mt: 1, color: 'red' }}>{errors?.members?.message}</Box>
       )}

       <div className='flex justify-end gap-2 mt-3'>
        <Box>
         <Button
          type='button'
          variant='contained'
          color='secondary'
          onClick={handleHideModalCreateGroup}
         >
          cancel
         </Button>
        </Box>
        <Box>
         <Button type='submit' variant='contained' color='primary'>
          Create
         </Button>
        </Box>
       </div>
      </Box>
     </Modal>

     <Modal show={showModalSearch} onHide={handleHideModalSearch}>
      <div className='p-3'>
       <h3 className='text-[25px] font-medium'>Search user</h3>

       <form
        onSubmit={handleSubmitSearchUser}
        className='flex gap-2 ms-4 me-2 my-3 items-center'
       >
        <div className='border border-black rounded-sm p-2 w-100'>
         <input
          className='w-100 text-[25px]'
          type='text'
          placeholder='User name'
          onChange={handleChangeSearchUser}
          value={searchUserName}
         />
        </div>

        <button
         className='bg-black h-max text-white text-[20px] px-3 py-1 rounded-md'
         type='submit'
        >
         Search
        </button>
       </form>

       <ul className='flex flex-col gap-2'>
        {searchUserResult?.map((user) => (
         <li
          key={user.idUser}
          className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
         >
          <div className='flex gap-2 items-center'>
           <div>
            <img
             onError={(e) => {
              e.target.src = avatarDefault
             }}
             src={user.linkAvatar}
             alt='avatar '
             className='w-[50px] h-[50px] object-cover rounded-[100%]'
            />
           </div>

           <div>
            <h5 className='text-lg font-extrabold capitalize'>
             {user.userName}
            </h5>
           </div>
          </div>

          {searchUserFormName === 'chat' && (
           <button
            onClick={() => handleClickSearchBtn(user)}
            type='button'
            className='bg-[#F56852] text-white rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
           >
            Chat
           </button>
          )}

          {searchUserFormName === 'group' && (
           <button
            onClick={() => handleClickSearchUserBtnAdd(user)}
            type='button'
            className='bg-black text-white rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
           >
            Add
           </button>
          )}
         </li>
        ))}

        {messageNotifi.trim() !== '' && (
         <li className='font-bold capitalize'>{messageNotifi} !</li>
        )}
       </ul>

       <div className='text-right'>
        <button
         className='text-[25px] font-medium text-[#ff2d2d]'
         type='button'
         onClick={handleHideModalSearch}
        >
         Cancel
        </button>
       </div>
      </div>
     </Modal>

     <Modal
      dialogClassName='modal-members'
      show={showModalMemberList}
      onHide={handleHideModalSearch}
     >
      <div className='p-3 '>
       <h3 className='text-[25px] font-medium'>All member</h3>

       <ul className='flex flex-col gap-2 py-[20px]'>
        {groupMemberList?.map((user) => (
         <li
          key={user.id}
          className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
         >
          <div className='flex gap-2 items-center'>
           <div>
            <img
             onError={(e) => {
              e.target.src = avatarDefault
             }}
             src={user.avt}
             alt='avatar '
             className='w-[50px] h-[50px] object-cover rounded-[100%]'
            />
           </div>

           <div>
            <h5 className='text-lg font-extrabold capitalize'>{user.name}</h5>
           </div>
          </div>

          <button
           onClick={() => {
            console.log(user.id)
           }}
           type='button'
           className='text-red-500 rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
          >
           <RemoveCircleIcon className='text-[30px]' />
          </button>
         </li>
        ))}

        {messageNotifi.trim() !== '' && (
         <li className='font-bold capitalize'>{messageNotifi} !</li>
        )}
       </ul>

       <div className='text-right'>
        <button
         className='text-[25px] font-medium text-[#ff2d2d]'
         type='button'
         onClick={handleHideModalMembers}
        >
         Cancel
        </button>
       </div>
      </div>
     </Modal>

     <div className='flex gap-2 h-100 flex-grow-1'>
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

      {/* <ChatUser {...propsChatUser} /> */}

      <div className='w-50 flex flex-col search-message px-3 shadow-lg'>
       <form
        onSubmit={handleSubmitSearchGroup}
        className='flex mt-4 mb-5 justify-between gap-2'
       >
        <div className='flex gap-2 items-center bg-white p-2 rounded-5 shadow-lg w-100'>
         <button
          className='bg-transparent outline-none border-none'
          type='submit'
         >
          <SearchIcon />
         </button>

         <div className='w-100'>
          <input
           className='outline-none border-none bg-transparent w-100'
           type='text'
           placeholder='Search group'
          />
         </div>
        </div>

        <button
         type='button'
         className=''
         title='add group'
         onClick={handleShowModalCreateGroup}
        >
         <GroupAddIcon className='text-[36px]' />
        </button>
       </form>

       <div className='flex flex-col flex-grow-1'>
        <ul className='flex justify-between group-buttons mb-4'>
         <li>
          <button className='active' type='button'>
           All
          </button>
         </li>

         <li>
          <button type='button'>Unread</button>
         </li>

         <li>
          <button type='button'>Read</button>
         </li>
        </ul>

        <ul
         className='flex flex-col gap-4 flex-grow-1 overflow-y-auto pb-[30px]'
         ref={chatGroupRef}
         style={{ height: `${heightChatGroup}px`, scrollbarWidth: 'none' }}
        >
         {groupList.length > 0 ? (
          groupList.map((group) => (
           <li
            key={group.idGroup}
            className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
            onClick={() => handleClickGroupItem(group)}
           >
            <div className='flex gap-2 items-center'>
             <div>
              <img
               src={group.linkAvatar || avatarDefault}
               alt='avatar'
               className='w-[50px] h-[50px] object-cover rounded-[100%]'
              />
             </div>

             <div>
              <h5 className='text-lg font-extrabold capitalize'>
               {group.name}
              </h5>
              <p
               style={{ maxWidth: '200px' }}
               className={
                group.is_seen === 0
                 ? 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis font-[600] text-lg'
                 : 'p-0 m-0 whitespace-nowrap overflow-hidden text-ellipsis text-lg'
               }
              >
               {handleChatLastText(group.describe, group.idSend)}
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
         ) : (
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
      </div>
     </div>
    </div>

    <div className='col-6 px-0  flex flex-col'>
     <div className='flex justify-between items-center bg-[#dffffe] py-[30px] px-[20px]'>
      <div className='flex gap-2 items-center'>
       <Link to={infoOtherUser.id && `/other-user/${infoOtherUser.id}`}>
        <img
         className='w-[90px] h-[90px] object-cover rounded-[100%]'
         src={infoOtherUser.Avarta || infoGroupItem.linkAvatar || avatarDefault}
         alt='avatar'
        />
       </Link>
       {formName === null && <h5>Anonymous chatter</h5>}
       {formName === 'chat' && <h5>{infoOtherUser.name}</h5>}
       {formName === 'group' && (
        <form
         onSubmit={handleSubmitFormNameGroup}
         className='flex items-center'
         ref={formGroupNameRef}
        >
         <div>
          <input
           disabled={disableGroupName}
           type='text'
           size={valueGroupName.length}
           value={valueGroupName}
           onChange={handleChangeNameGroup}
           ref={inputGroupNameRef}
           autoFocus={true}
           className={`px-2 py-1 rounded-md ${
            disableGroupName ? '' : 'bg-[#252f31] text-white'
           }`}
          />
         </div>
         {disableGroupName && (
          <button
           onClick={() => setDisableGroupName(false)}
           title='Edit name'
           type='button'
           ref={buttonClickEditNameGroup}
          >
           <img src={textNote} alt='search user' />
          </button>
         )}

         {!disableGroupName && (
          <button
           title='save name'
           type='submit'
           disabled={valueGroupName === infoGroupItem.name}
           className={
            valueGroupName.trim() === infoGroupItem.name
             ? 'cursor-not-allowed text-[#d1deeb]'
             : 'text-[#1976d2]'
           }
          >
           <SaveIcon className='text-[40px]' />
          </button>
         )}
        </form>
       )}
      </div>

      <div className='position-relative show-buttons'>
       <button
        ref={showButtonsGroupRef}
        onClick={() => {
         setShowButtonsGroup((prevState) => !prevState)
         setTypeButtonGroup(null)
        }}
       >
        <MoreVertIcon className='text-[40px]' />
       </button>

       <ul
        className={`bg-black p-2 position-absolute top-100 right-[100%] w-max ${
         showButtonsGroup ? 'active' : null
        }`}
        ref={ulElementButtonsGroupRef}
       >
        <li>
         <button
          className={`text-[25px] ${
           typeButtonGroup === 'quit' ? 'active' : null
          }`}
          onClick={handleQuitGroup}
         >
          <LogoutIcon className='me-2 text-[30px]' /> Quit group
         </button>
        </li>

        <li>
         <button
          className={`text-[25px] ${
           typeButtonGroup === 'add' ? 'active' : null
          }`}
          onClick={handleShowModalSearchUserGroup}
         >
          <AddCircleOutlineIcon className='me-2 text-[30px]' /> Add member
         </button>
        </li>

        <li>
         <button
          className={`text-[25px] ${
           typeButtonGroup === 'delete' ? 'active' : null
          }`}
          onClick={handleShowAllMembers}
         >
          <HighlightOffIcon className='me-2 text-[30px]' /> Delete member
         </button>
        </li>
       </ul>
      </div>
     </div>

     <div
      style={{
       background: `url(${bgMessage}) no-repeat center/cover`,
      }}
      className='flex-grow-1 flex flex-col'
     >
      <div
       style={{
        overflowY: 'auto',
        scrollbarWidth: 'none',
        height: `${heightMessageContent}px`,
       }}
       className='flex-grow-1 p-[20px]'
       ref={messageContentRef}
      >
       <ul>
        {formName === 'chat' &&
         messageList?.map((item) =>
          item.idSend === user.id ? (
           <div key={item.id} className='h-auto flex flex-col items-end'>
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
             {convertTime(item.sendAt)}
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
             {convertTime(item.sendAt)}
            </time>
           </div>
          )
         )}

        {formName === 'group' &&
         messageGroupList?.map((item) =>
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
             {convertTime(item.sendAt)}
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
             {convertTime(item.sendAt)}
            </time>
           </div>
          )
         )}
       </ul>
      </div>
      <FormMessage {...propsFormMessage} />
     </div>
    </div>
   </div>
  </div>
 )
}

export default Group
