// export default UserPanel;
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
import { handleLogOut } from '../utils/utils'

const UserPanel = () => {
  const appContext = useContext(AppContext)
  const { user, setUser } = appContext
  const [userInfomations, setUserInformations] = useState(null)
  const navigate = useNavigate()

  const navbarItems = [
    {
      name: 'Home Page',
      icon: (
        <HomeIcon className='md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/',
    },
    {
      name: 'Photos',
      icon: (
        <PhotoLibraryIcon className='md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/photo',
    },
    {
      name: 'Note',
      icon: (
        <EventNoteIcon className='md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: `/editnote`,
    },
    {
      name: 'Group',
      icon: (
        <GroupIcon className=' md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/group',
    },

    {
      name: 'incognito',
      icon: (
        <IconChatUnknow className='md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/user/incognito',
      state: { userInfomations: null },
    },

    {
      name: 'dustbin',
      icon: (
        <DeleteIcon className=' md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/dustbin',
    },

    {
      name: 'Sketch',
      icon: (
        <DriveFileRenameOutlineIcon className=' md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
      url: '/sketch',
    },

    {
      name: 'setting',
      icon: (
        <SettingsIcon className='  md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      ),
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
  // function AlertButton() {
  //   // Hàm xử lý khi bấm nút
  //   const handleClick = () => {
  //     alert("Chiều rộng màn hình: " + window.innerWidth);
  //   };

  //   return (
  //     <button
  //       onClick={handleClick}
  //       style={{
  //         position: "fixed",
  //         bottom: "20px", // Cách đáy màn hình 20px
  //         right: "20px", // Cách phải màn hình 20px
  //         padding: "10px 20px",
  //         backgroundColor: "#4CAF50",
  //         color: "white",
  //         border: "none",
  //         zIndex: 1000,
  //         borderRadius: "5px",
  //         cursor: "pointer",
  //       }}
  //     >
  //       Bấm vào tôi
  //     </button>
  //   );
  // }

  return userInfomations ? (
    <Box className='bg-gray-700 text-white w-full pt-3 flex items-center flex-col md:gap-2 xl:gap-3 2xl:gap-4 gap-3'>
      {/* <AlertButton /> */}
      <Box
        className='flex items-center cursor-pointer'
        onClick={() => navigate(`/profile/${user.id}`)}
      >
        <img
          src={userInfomations.Avarta}
          alt=''
          className='rounded-full md:size-[50px] xl:size-[60px] 2xl:size-[80px] hidden md:block'
        />
      </Box>

      {/* className="size-[12px]" */}
      <Box
        className="flex items-end text-white hidden md:block whitespace-nowrap cursor-pointer"
        onClick={() => navigate(`/search-results`)}
      >
        <SearchIcon className="mr-1 text-white md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]" />
      </Box>

      <Button
        variant='contained'
        className='bg-[#198E39] rounded-full  '
        onClick={() => navigate(`/create-note`)}
      >
        <IconCreateNewNote className=' md:size-[15px] xl:size-[20px]' />
        <span className='hidden lg:block text-[10px] xl:text-[15px] pl-1'>new</span>
      </Button>

      {navbarItems.map((item, idx) => (
        <Box
          key={idx}
          className='flex cursor-pointer'
          title={item.name}
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

      <Button
        className='hidden md:block'
        onClick={() => {
          const submit = confirm('Do you want to logout?')
          if (submit) {
            setUser(null)
            handleLogOut()
          }
        }}
      >
        <IconLogout className='md:size-[25px] lg:size-[30px] xl:size-[35px] 2xl:size-[40px]' />
      </Button>
    </Box>
  ) : null
}

export default UserPanel
