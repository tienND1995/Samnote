import React, { useState, useContext, useRef } from 'react'

import axios from 'axios'
import Modal from 'react-bootstrap/Modal'
import TextTruncate from 'react-text-truncate'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'

// material
import { Box } from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'

import { AppContext } from '../context'
import { schemaGroup } from '../utils/schema'
import { fetchAllMessageList } from '../pages/Group/fetchApiGroup'
import configs from '../configs/configs.json'

import avatarDefault from '../assets/avatar-default.png'

const { API_SERVER_URL, BASE64_URL } = configs

const CreateGroup = ({
 data,

 showModal,
 setShowModal,
}) => {
 const { setAllMessageList, socket, typeFilterChat } = data

 const appContext = useContext(AppContext)
 const { setSnackbar, user } = appContext

 const {
  register,
  handleSubmit,
  setValue,
  getValues,
  reset,
  formState: { errors },
 } = useForm({
  resolver: joiResolver(schemaGroup),
  defaultValues: { groupName: '', desc: '', members: [], linkAvatar: '' },
 })

 const resetModalCreateGroup = () => {
  reset()

  setSearchUserResult([])
  setSearchUserNotFound(null)
  setUsersSelected([])
  setAvatarGroup(null)
  setShowModal(false)
 }

 const handleHideModalCreateGroup = () => {
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

   const allMessageList = await fetchAllMessageList(
    userID,
    socket,
    typeFilterChat
   )
   setAllMessageList(allMessageList)

   // reset form create group

   resetModalCreateGroup()
  } catch (error) {
   setSnackbar({
    isOpen: true,
    message: error.response.data.message,
    severity: 'error',
   })
  }
 }

 const onSubmit = async (data) => {
  const { groupName, desc, members } = data

  const linkAvatar = await postAvatar(fileUpload)

  const group = {
   // info change
   name: groupName,
   members: members,
   describe: desc,
   linkAvatar: linkAvatar,

   //  info constant
   createAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
   idOwner: user?.id,
   r: 255,
   g: 255,
   b: 255,
   a: 0.99,
  }

  postGroup(group, user?.id)
 }

 // search user

 const [searchUserResult, setSearchUserResult] = useState([])
 const [searchUserNotFound, setSearchUserNotFound] = useState(null)

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
  const textSearch = e.target.value

  if (textSearch.trim() === '') {
   setSearchUserResult([])
   setSearchUserNotFound(null)

   return
  }

  fetchSearchUser(textSearch)
  setSearchUserNotFound(null)
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

 // avatar group

 const [avatarGroup, setAvatarGroup] = useState(null)
 const [fileUpload, setFileUpload] = useState(null)

 const postAvatar = async (file) => {
  const formData = new FormData()
  formData.append('image', file)

  try {
   const response = await axios.post(
    `https://samnote.mangasocial.online/upload_image/${user?.id}`,
    formData
   )

   return response.data.imagelink
  } catch (error) {
   console.error(error)
  }
 }

 const handleChangeAvatarGroup = async (e) => {
  const reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  reader.onload = () => {
   const imageBase64 = reader.result?.split(',')[1]
   setValue('linkAvatar', imageBase64)
   setAvatarGroup(imageBase64)
  }

  setFileUpload(e.target.files[0])
  e.target.value = null
 }

 return (
  <Modal
   className='modal-create-group'
   show={showModal}
   onHide={handleHideModalCreateGroup}
   size='lg'
  >
   <Modal.Header closeButton className='border-none p-[20px]'>
    <Modal.Title className='text-[30px]'>Create group</Modal.Title>
   </Modal.Header>

   <Modal.Body className='px-[20px] py-0'>
    <form onSubmit={handleSubmit(onSubmit)} action=''>
     <div className='flex justify-between items-center gap-3 mb-3'>
      <div>
       <div className='position-relative w-max'>
        <div>
         <img
          className='w-[90px] h-[90px] object-cover rounded-[100%]'
          src={avatarGroup ? `${BASE64_URL}${avatarGroup}` : avatarDefault}
          alt='avatar'
         />
        </div>

        <div className='position-absolute bg-[#d9d9d9] w-[30px] h-[30px] rounded-full right-0 bottom-0 flex items-center justify-center'>
         <input
          onChange={handleChangeAvatarGroup}
          id='file-avatar-create-group'
          type='file'
          className='hidden m-0'
         />
         <label
          htmlFor='file-avatar-create-group'
          className='flex cursor-pointer'
         >
          <CameraAltIcon className='text-[20px]' />
         </label>
        </div>
       </div>

       {!avatarGroup && errors.linkAvatar && (
        <Box sx={{ color: 'red' }}>{errors.linkAvatar.message}</Box>
       )}
      </div>

      <div className='h-[50px] flex flex-grow-1 justify-between gap-3'>
       <div className='w-1/2'>
        <div>
         <input
          type='text'
          className='w-full rounded-[30px] px-3 h-[50px] bg-white createGroup__groupName'
          placeholder='Enter the group name...'
          {...register('groupName')}
         />
        </div>

        {errors.groupName && (
         <Box sx={{ mt: 1, color: 'red' }}>{errors.groupName.message}</Box>
        )}
       </div>

       <div className='w-1/2'>
        <div>
         <input
          className='w-full rounded-[30px] px-3 h-[50px] bg-white createGroup__groupName'
          type='text'
          placeholder='Group description...'
          {...register('desc')}
         />
        </div>

        {errors.desc && (
         <Box sx={{ mt: 1, color: 'red' }}>{errors.desc.message}</Box>
        )}
       </div>
      </div>
     </div>

     <button
      id='create-group-btn'
      className='btn btn-dark hidden'
      type='submit'
     >
      Create
     </button>
    </form>

    <div className='mx-[40px] mb-3 mt-5'>
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

     <div className='w-1/2 my-3'>
      <div className='flex rounded-[30px] gap-[20px] items-center px-2 h-[50px]  bg-white border-secondary border'>
       <div>
        <SearchIcon className='text-[30px]' />
       </div>

       <input
        className='w-100 createGroup__groupName'
        type='text'
        placeholder='Enter username/email...'
        onChange={handleChangeSearchValue}
       />
      </div>

      {usersSelected.length > 0 ? (
       ''
      ) : (
       <Box sx={{ mt: 1, color: 'red' }}>{errors?.members?.message}</Box>
      )}
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
 )
}

export default CreateGroup
