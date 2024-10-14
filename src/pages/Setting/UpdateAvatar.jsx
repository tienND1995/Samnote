import { useState, useContext, useEffect } from 'react'
import {
 Button,
 Container,
 TextField,
 Typography,
 Box,
 CircularProgress,
 MenuItem,
 Select,
 Avatar,
} from '@mui/material'
import Swal from 'sweetalert2'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { AppContext } from '../../context'
import PasswordField from '../../share/PasswordField'
import api from '../../api' // Make sure to import the API instance

import avatarDefault from '../../assets/avatar-default.png'

import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { settingSchema } from '../../utils/schema'
import axios from 'axios'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const UpdateAvatar = () => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar, setUser } = appContext
 const [checkChange, setCheckChange] = useState(false)

 const {
  handleSubmit,
  register,
  setValue,
  formState: { errors, dirtyFields },
  reset,
  watch,
 } = useForm({
  resolver: joiResolver(settingSchema),
  defaultValues: {
   name: '',
   gmail: '',
  },
 })

 const [avatarProfile, setAvatarProfile] = useState({
  thumb: '',
  file: null,
  isChange: false,
 })

 const [backgroundProfile, setBackgroundProfile] = useState({
  thumb: '',
  file: null,
  isChange: false,
 })

 useEffect(() => {
  if (dirtyFields?.name) {
   setCheckChange(true)
  }
 }, [watch('name')])

 //  Sử dụng useEffect để cập nhật khi user thay đổi
 useEffect(() => {
  const fetchUserData = async () => {
   try {
    const res = await axios.get(
     `https://samnote.mangasocial.online/profile/${user.id}`
    )

    const { Avarta, name, gmail, AvtProfile } = res.data.user

    setAvatarProfile({ ...avatarProfile, thumb: Avarta })
    setBackgroundProfile({ ...avatarProfile, thumb: AvtProfile })

    // Cập nhật form với dữ liệu mới
    setValue('name', name)
    setValue('gmail', gmail)
   } catch (error) {
    console.error('Failed to fetch user profile', error)
   }
  }

  fetchUserData()
 }, [user, reset])

 const onSubmit = async (data) => {
  const dataForm = { name: data.name }

  if (avatarProfile.isChange) {
   const imageFormData = new FormData()
   imageFormData.append('image', avatarProfile.file)

   const dataImage = await fetchApiSamenote(
    'post',
    `/upload_image/${user.id}`,
    imageFormData
   )

   dataForm.Avarta = dataImage.imagelink
  }

  if (backgroundProfile.isChange) {
   const imageFormData = new FormData()
   imageFormData.append('image', backgroundProfile.file)

   const dataImage = await fetchApiSamenote(
    'post',
    `/upload_image/${user.id}`,
    imageFormData
   )

   dataForm.AvtProfile = dataImage.imagelink
  }

  fetchApiSamenote(
   'patch',
   `/profile/change_Profile/${user.id}`,
   dataForm
  ).then((response) => {
   if (response?.error) {
    setSnackbar({
     isOpen: true,
     message: response?.error,
     severity: 'error',
    })
   } else {
    setUser(response)
    setSnackbar({
     isOpen: true,
     message: 'Updated profile !',
     severity: 'success',
    })
   }
  })
 }

 const handleChangeAvatar = (e) => {
  const file = e.target.files[0]
  const blobUrl = URL.createObjectURL(file)

  setAvatarProfile({ thumb: blobUrl, file, isChange: true })
  setCheckChange(true)
 }

 const handleChangeBackground = (e) => {
  const file = e.target.files[0]
  const blobUrl = URL.createObjectURL(file)

  setBackgroundProfile({ thumb: blobUrl, file, isChange: true })
  setCheckChange(true)
 }

 return (
  <div className=''>
   <Typography
    variant='h5'
    sx={{
     marginTop: '20px',
     color: '#6a53cc',
     fontSize: '22px',
     fontWeight: 700,
    }}
   >
    Update Profile
   </Typography>
   <form
    onSubmit={handleSubmit(onSubmit)}
    action='submit'
    className='gap-3 flex flex-col'
   >
    <div className='flex items-center'>
     <label htmlFor='' className='w-[300px]'>
      Avatar:
     </label>

     <div className='flex items-center gap-3'>
      <img
       className='size-[60px] object-cover rounded-full'
       src={avatarProfile.thumb || avatarDefault}
       alt='avatar default'
      />

      <div className=''>
       <input
        id='setting-upload-avatar'
        type='file'
        hidden
        onChange={handleChangeAvatar}
       />
       <label
        htmlFor='setting-upload-avatar'
        className='border border-primary text-primary cursor-pointer py-2 px-4 uppercase rounded-md'
       >
        change
       </label>
      </div>
     </div>
    </div>

    <div className='flex items-center'>
     <label className='w-[300px]'>Name:</label>

     <div className='flex flex-col'>
      <TextField
       type='text'
       placeholder='name...'
       className='sm:w-[300px] form-control w-[200px]'
       {...register('name')}
      />
      {errors?.name && (
       <span className='text-red-400 mt-3'>{errors.name.message}</span>
      )}
     </div>
    </div>

    <div className='flex items-center max-w'>
     <label className='w-[300px]'>Email:</label>

     <TextField
      disabled
      type='text'
      className='sm:w-[300px] form-control w-[200px]'
      value={watch('gmail')}
     />
    </div>
    <div className='flex items-center'>
     <label htmlFor='' className='w-[300px]'>
      Avatar Profile:
     </label>

     <div className='flex items-center gap-3'>
      <img
       className='size-[60px] object-cover rounded-lg'
       src={backgroundProfile.thumb || avatarDefault}
       alt='avatar default'
      />

      <div className=''>
       <input
        id='setting-upload-avatarProfile'
        type='file'
        hidden
        onChange={handleChangeBackground}
       />
       <label
        htmlFor='setting-upload-avatarProfile'
        className='border border-primary text-primary cursor-pointer py-2 px-4 uppercase rounded-md'
       >
        change
       </label>
      </div>
     </div>
    </div>
    <div className='flex gap-4'>
     <Button
      disabled={!checkChange}
      variant={checkChange ? 'contained' : 'outlined'}
      type='submit'
      className=' px-4 uppercase'
     >
      Update
     </Button>

     <button type='button' className='btn btn-danger'>
      delete
     </button>
    </div>

    {/* {errors?.errorApi && (
          <span className="text-red-400 mt-3">{errors.errorApi.message}</span>
        )} */}
   </form>
  </div>
 )
}
export default UpdateAvatar
