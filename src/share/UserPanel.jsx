import { Outlet, useNavigate, useParams } from 'react-router-dom'
import IconChatUnknow from '../assets/iconChatUnknow'
import IconCreateNewNote from '../assets/iconCreateNewNote'
import IconLogout from '../assets/iconLogout'
import DeleteIcon from '@mui/icons-material/Delete'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import EventNoteIcon from '@mui/icons-material/EventNote'
import GroupIcon from '@mui/icons-material/Group'
import HomeIcon from '@mui/icons-material/Home'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import SearchIcon from '@mui/icons-material/Search'
import SettingsIcon from '@mui/icons-material/Settings'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import api from '../api'
import { AppContext } from '../context'
import { handleLogOut } from '../helper'

const UserPanel = () => {
 const appContext = useContext(AppContext)
 const { user, setUser } = appContext
 const [userInfomations, setUserInformations] = useState(null)
 const navigate = useNavigate()


 const navbarItems = [
  {
   name: 'Home Page',
   icon: <HomeIcon sx={{ fontSize: 40 }} />,
   url: '/',
  },
  {
   name: 'Photos',
   icon: <PhotoLibraryIcon sx={{ fontSize: 40 }} />,
   url: '/photo',
  },
  {
   name: 'Note',
   icon: <EventNoteIcon sx={{ fontSize: 40 }} />,
   url: `/editnote`,
  },
  {
   name: 'Group',
   icon: <GroupIcon sx={{ fontSize: 40 }} />,
   url: '/group',
  },
  {
   name: 'Dustbin',
   icon: <DeleteIcon sx={{ fontSize: 40 }} />,
   url: '/user/dustbin',
  },
  {
   name: 'incognito',
   icon: <IconChatUnknow />,
   url: '/user/incognito',
   state: { userInfomations: null },
  },
  {
   name: 'Sketch',
   icon: <DriveFileRenameOutlineIcon sx={{ fontSize: 40 }} />,
   url: '/user/sketch',
  },
  {
   name: 'setting',
   icon: <SettingsIcon sx={{ fontSize: 40 }} />,
   url: '/user/setting',
  },
 ]

 useEffect(() => {
  let ignore = false
  const getUserInformation = async (userID) => {
   try {
    const res = await api.get(
     `https://samnote.mangasocial.online/profile/${userID}`
    )
    if (!ignore) {
     setUserInformations(res.data.user)
    }
   } catch (err) {
    console.log(err)
   }
  }

  user && getUserInformation(user.id)

  return () => {
   ignore = true
  }
 }, [user])

 return userInfomations ? (
  <Box className='bg-gray-700 text-white w-full pt-3 flex items-center flex-col'>
   <Box className='flex items-center justify-between'>
    <Box
     className='flex gap-3 items-center cursor-pointer'
     onClick={() => navigate(`/profile/${user.id}`)}
    >
     <img
      src={userInfomations.Avarta}
      alt=''
      className='rounded-full w-[80px] h-[80px] hidden lg:block'
     />
    </Box>
   </Box>

   <Box className='flex items-end text-white mb-4 hidden lg:block whitespace-nowrap '>
    <SearchIcon className='mr-1 mt-3 text-white' sx={{ fontSize: 40 }} />
   </Box>

   <Button
    variant='contained'
    className='bg-[#198E39] rounded-full  mb-4 flex absolute top-[-45%] left-[47%] transform-translate-x-[-50%] w-[20px] lg:w-[95%] lg:h-[45px] lg:static'
    onClick={() => navigate(`/create-note`)}
   >
    <IconCreateNewNote />
    <Typography className='hidden lg:block pl-1'>new</Typography>
   </Button>

   <Box className='flex lg:flex-col lg:justify-normal justify-around gap-4'>
    {navbarItems.map((item, idx) => (
     <Box
      key={idx}
      className='flex gap-1 text-xl cursor-pointer'
      onClick={() => {
       if (item.state) {
        navigate(item.url, { state: item.state })
       } else {
        navigate(item.url)
       }
      }}
     >
      {item.icon}
     </Box>
    ))}
   </Box>

   <Button
    className=' mt-4 hidden lg:block'
    onClick={() => {
     const submit = confirm('Do you want to logout?')
     if (submit) {
      setUser(null)
      handleLogOut()
     }
    }}
   >
    <IconLogout />
   </Button>
  </Box>
 ) : null
}

export default UserPanel
