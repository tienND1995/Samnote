import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import './ChatList.css'

import TextTruncate from 'react-text-truncate'

import { fetchGroupList } from '../fetchApiGroup'
import avatarDefault from '../../../assets/avatar-default.png'

import Modal from 'react-bootstrap/Modal'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { schemaGroup } from '../../../utils/schema/schema'
import configs from '../../../configs/configs.json'
const { API_SERVER_URL } = configs

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

import SearchIcon from '@mui/icons-material/Search'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import CheckIcon from '@mui/icons-material/Check'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import CameraAltIcon from '@mui/icons-material/CameraAlt'

import ClearIcon from '@mui/icons-material/Clear'

const ChatList = (props) => {
 const {
  userID,
  socket,
  typeFilterChat,

  userList,
  groupList,
  setGroupList,
  userItem,
  groupItem,
  setSnackbar,

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
   (userReaded) => Number(userReaded.idUser) === userID
  )
 }

 // *********** handle create group

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
  defaultValues: { groupName: '', desc: '', members: [] },
 })

 const resetModalCreateGroup = () => {
  reset()

  setSearchUserResult([])
  setSearchUserNotFound(null)
  setSearchValue('')
  setUsersSelected([])
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

   //  cập nhật group list
   const groups = await fetchGroupList(userID, socket, typeFilterChat)
   setGroupList(groups)

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
   // info change
   name: groupName,
   members: members,
   describe: desc,

   //  info constant
   createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
   idOwner: userID,
   r: 255,
   g: 255,
   b: 255,
   a: 0.99,
  }

  console.log(group)

  postGroup(group, userID)
 }

 // search user

 const [searchUserResult, setSearchUserResult] = useState([])
 const [searchUserNotFound, setSearchUserNotFound] = useState(null)
 const [searchValue, setSearchValue] = useState('')

 const [usersSelected, setUsersSelected] = useState([])
 const searchUsersResultRef = useRef()

 const fetchSearchUser = async (userName) => {
  try {
   const url = `${API_SERVER_URL}/group/search_user_by_word`
   const response = await axios.post(url, {
    start_name: userName,
   })

   setSearchUserResult(response.data.data ? response.data.data : [])
   setSearchUserNotFound(response.data.message ? response.data.message : null)
  } catch (error) {
   console.error(error)
  }
 }

 const handleChangeSearchValue = (e) => {
  setSearchValue(e.target.value)
  setSearchUserNotFound(null)
 }

 const handleSubmitSearchUser = (e) => {
  e.preventDefault()
  if (searchValue.trim().split(' ').length !== 1 || searchValue.trim() === '')
   return

  fetchSearchUser(searchValue)
 }

 //  add member and delete member
 const handleChangeCheckbox = (isChecked, userResult) => {
  if (isChecked) {
   setUsersSelected([...usersSelected, userResult])
   const membersChema = getValues('members')

   const member = {
    gmail: userResult.email,
    id: userResult.idUser,
    role: 'member',
   }

   setValue('members', membersChema ? [...membersChema, member] : [member])
  }

  if (!isChecked) {
   setUsersSelected(
    usersSelected.filter((user) => user.idUser !== userResult.idUser)
   )

   const membersChema = getValues('members')
   setValue(
    'members',
    membersChema.filter((member) => member.id !== userResult.idUser)
   )
  }
 }

 const handleDeleteUserSelected = (userId) => {
  setUsersSelected(usersSelected.filter((user) => user.idUser !== userId))

  const membersChema = getValues('members')
  setValue(
   'members',
   membersChema.filter((member) => member.id !== userId)
  )

  // handle change checked input
  const liElementMatch = searchUsersResultRef.current.querySelector(
   `li[data-id="${userId}"]`
  )
  const inputMatch = liElementMatch.querySelector('input')

  inputMatch.checked = !inputMatch.checked
 }

 const isCheckedUser = (userId) => {
  return usersSelected.some((user) => user.idUser === userId)
 }

 return (
  <div className='shadow-lg bg-[#dffffe] flex flex-col flex-grow-1 px-[20px]'>
   <Modal
    className='modal-create-group'
    show={showModalCreateGroup}
    onHide={handleHideModalCreateGroup}
    size='lg'
   >
    <Modal.Header closeButton className='border-none p-[20px]'>
     <Modal.Title className='text-[30px]'>Create group</Modal.Title>
    </Modal.Header>

    <Modal.Body className='px-[20px] py-0'>
     <form onSubmit={handleSubmit(onSubmit)} action=''>
      <div className='flex justify-between items-center gap-2 mb-3'>
       <div className='position-relative'>
        <div>
         <img
          className='w-[90px] h-[90px] object-cover rounded-[100%]'
          src={avatarDefault}
          alt='avatar'
         />
        </div>

        <div className='position-absolute bg-[#d9d9d9] w-[30px] h-[30px] rounded-full right-0 bottom-0 flex items-center justify-center'>
         <input
          // onChange={handleChangeAvatarGroup}
          id='file-avatar-group'
          type='file'
          className='hidden m-0'
          // disabled={!isLeaderTeam(infoGroupItem.idOwner)}
         />
         <label htmlFor='file-avatar-group' className='flex'>
          <CameraAltIcon className='text-[20px]' />
         </label>
        </div>
       </div>

       <div className='grid w-full'>
        <input
         type='text'
         style={{ boxShadow: '-2px -4px 4px 0px #00000040 inset' }}
         className='form-control border-none h-[60px] rounded-[30px] createGroup__groupName'
         placeholder='Enter the group name...'
         {...register('groupName')}
        />

        {errors.groupName && (
         <Box sx={{ mt: 1, color: 'red' }}>{errors.groupName.message}</Box>
        )}
       </div>
      </div>

      <div className='w-1/2 mb-3'>
       <div>
        <input
         className='w-100 rounded-[30px] px-3 h-[50px] bg-white border-secondary border createGroup__groupName'
         type='text'
         placeholder='Group description...'
         {...register('desc')}
        />
       </div>

       {errors.desc && (
        <Box sx={{ mt: 1, color: 'red' }}>{errors.desc.message}</Box>
       )}
      </div>

      <button
       id='create-group-btn'
       className='btn btn-dark hidden'
       type='submit'
      >
       Create
      </button>
     </form>

     <div className='w-1/2 mb-3'>
      <form
       onSubmit={handleSubmitSearchUser}
       className='flex rounded-[30px] gap-[20px] items-center px-2 h-[50px]  bg-white border-secondary border'
      >
       <button
        title='Search user'
        onClick={handleSubmitSearchUser}
        className=''
        type='button'
       >
        <SearchIcon className='text-[30px]' />
       </button>

       <input
        className='w-100 createGroup__groupName'
        type='text'
        placeholder='Enter username/email...'
        value={searchValue}
        onChange={handleChangeSearchValue}
       />
      </form>

      {usersSelected.length > 0 ? (
       ''
      ) : (
       <Box sx={{ mt: 1, color: 'red' }}>{errors?.members?.message}</Box>
      )}
     </div>

     <div className='mx-[40px] mb-3'>
      <div className={usersSelected.length === 0 ? 'hidden' : null}>
       <h3 className='text-[25px] font-medium mb-2'>Selected</h3>
       <ul className='flex gap-[10px] flex-wrap'>
        {usersSelected?.map(({ idUser, linkAvatar, userName }) => (
         <li className='text-center max-w-[100px]' key={idUser}>
          <div className='position-relative'>
           <img
            className='w-[80px] h-[80px] object-cover rounded-full'
            src={linkAvatar}
            alt='avatar'
            onError={(e) => (e.target.src = avatarDefault)}
           />

           <button
            onClick={() => handleDeleteUserSelected(idUser)}
            type='button'
            className='position-absolute top-0 right-1 flex'
           >
            <ClearIcon className='text-[#34a6fa] text-[20px] bg-black rounded-full' />
           </button>
          </div>

          <TextTruncate
           line={1}
           element='h6'
           truncateText='…'
           text={userName}
           containerClassName='text-[18px] font-[400] capitalize'
          />
         </li>
        ))}
       </ul>
      </div>
     </div>
    </Modal.Body>

    {(searchUserResult.length > 0 || searchUserNotFound) && (
     <div className='bg-white py-3 px-[60px] max-h-[45vh] overflow-y-auto createGroup-usersResult'>
      <h5
       className={`text-[25px] font-medium mb-2 ${
        searchUserNotFound ? 'text-red-500' : null
       }`}
      >
       {searchUserNotFound ? searchUserNotFound : 'All user'}
      </h5>

      <ul ref={searchUsersResultRef} className='flex flex-col gap-2 '>
       {searchUserResult?.map((userResult) => (
        <li
         key={userResult.idUser}
         data-id={userResult.idUser}
         className='flex justify-between items-center'
        >
         <div className='flex items-center gap-4'>
          <div>
           <img
            className='w-[80px] h-[80px] object-cover rounded-full'
            onError={(e) => (e.target.src = avatarDefault)}
            src={userResult.linkAvatar}
            alt='avatar'
           />
          </div>

          <h6 className='text-[18px] font-normal capitalize'>
           {userResult.userName}
          </h6>
         </div>
         <div>
          <input
           className='createGroup-inputRadio'
           onChange={(e) => handleChangeCheckbox(e.target.checked, userResult)}
           type='checkbox'
           checked={isCheckedUser(userResult.idUser)}
          />
         </div>
        </li>
       ))}
      </ul>
     </div>
    )}

    <Modal.Footer className='p-[20px] border-none'>
     <div>
      <button
       onClick={handleHideModalCreateGroup}
       className='btn btn-danger'
       type='button'
      >
       Cancle
      </button>
     </div>

     <label className='btn btn-dark' htmlFor='create-group-btn'>
      Create
     </label>
    </Modal.Footer>
   </Modal>

   <div className='flex mt-4 mb-5 justify-between gap-2'>
    <div className='flex justify-between gap-2 w-full'>
     <button
      onClick={onShowModalSearch}
      type='button'
      className='flex w-full gap-2 items-center bg-white p-2 rounded-5 shadow-lg text-[#686464CC]'
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
     className='flex flex-col flex-grow-1 gap-4 overflow-y-auto pb-[30px] overflow-x-hidden list-chat'
     ref={chatListRef}
     style={{ height: `${heightChatList}px`, scrollbarWidth: 'none' }}
    >
     {userList?.map((item) => {
      return (
       <li
        key={item.idMessage}
        className={`flex justify-between items-center rounded-[40px] cursor-pointer ${
         userItem?.id === item.user.id ? 'active' : null
        }`}
        onClick={() => onClickUserItem(item)}
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
           {convertLastText(item.last_text, item.idSend)}
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
        item.idGroup === groupItem?.idGroup ? 'active' : null
       }`}
       onClick={() => onClickGroupItem(item)}
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
