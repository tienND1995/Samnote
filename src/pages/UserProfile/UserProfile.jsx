import { useNavigate, useParams, Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context'
import api from '../../api'
import { Box, Typography, Button, TextField } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import GroupIcon from '@mui/icons-material/Group';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Avatar from '@mui/material/Avatar'
import './UserProfile.css'
import { io } from 'socket.io-client'
import ModalChat from '../../components/ModalChat'
import { getCurrentFormattedDateTime, getTimeDifference, getFormattedDate } from '../../helper'
import { getLuminance } from '@mui/material/styles';


const UserProfile = () => {
  const appContext = useContext(AppContext)
  const { setSnackbar, user } = appContext
  const [socket, setSocket] = useState(null)
  const [userInfomations, setUserInformations] = useState(null)
  const [lastUsers, setLastUsers] = useState([])
  //tabvalue
  const [publicNotesTabValue, setPublicNotesTabValue] = useState('1')
  const [privateNotesTabValue, setPrivateNotesTabValue] = useState('1')
  //data note
  const [allNotePublic, setAllNotePublic] = useState([])
  const [userNotes, setUserNotes] = useState(null)
  const archivedNotes = (userNotes || []).filter((note) => note.inArchived)
  const publicNotes = (userNotes || []).filter((note) => note.notePublic === 1)
  const privateNotes = (userNotes || []).filter((note) => note.notePublic === 0)

  const [isModalMess, setIsModalMessage] = useState(false)
  const [dataMess, setDataMess] = useState([])
  const [payloadData, setPayloadData] = useState('')
  const [reload, setReload] = useState(0)
  const navigate = useNavigate()

  const params = useParams()
  const userID = params.id

  useEffect(() => {
    // let ignore = false
    const getUserInformation = async (userID) => {
      try {
        const res = await api.get(
          `https://samnote.mangasocial.online/profile/${userID}`
        )
        setUserInformations(res.data.user)
        setUserNotes(res.data.note)
      } catch (err) {
        console.log(err)
      }
    }

    getUserInformation(userID)
  }, [userID, reload])

  useEffect(() => {
    fetchLastUsers()
    fetchAllNotePublic()
  }, [])

  useEffect(() => {
    fetchAllDataMess()
    const newSocket = io('https://samnote.mangasocial.online')
    console.log(newSocket)
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to socket.IO server', newSocket.id)
    })

    newSocket.on('join_room', (newRoom) => {
      if (newRoom.includes(user.id)) {
        console.log(newRoom)
        fetchAllDataMess()
      }
    })

    return () => {
      newSocket.disconnect() // Ngắt kết nối khi component bị xoá
    }
  }, [])

  const fetchAllDataMess = async () => {
    const response = await api.get(
      `https://samnote.mangasocial.online/message/list_user_chat1vs1/${userID}`
    )
    if (response && response.data.status === 200) {
      setDataMess(response.data.data)
    }
  }

  const fetchLastUsers = async () => {
    const response = await api.get('/lastUser')
    if (response && response.data.status === 200) {
      setLastUsers(response.data.data)
    }
  }

  const fetchAllNotePublic = async () => {
    try {
      const response = await api.get('/notes_public')
      if (response && response.data.message === 'success') {
        setAllNotePublic(response.data.public_note)
      }
    } catch (err) {
      console.log(err)
    }
  }

  const Checklist = ({ data }) => {
    const [items, setItems] = useState([])

    useEffect(() => {
      setItems(data)
    }, [data])

    return (
      <div>
        {items.map((item, index) => (
          <div key={index}>
            <input
              style={{ marginRight: '5px' }}
              type='checkbox'
              checked={item.status}
            />
            {item.content}
          </div>
        ))}
      </div>
    )
  }

  const deleteNote = async (index) => {
    try {
      await api.delete(`/notes/${index}`)
      setSnackbar({
        isOpen: true,
        message: `Remove note successfully ${index}`,
        severity: 'success',
      })
      setReload((prev) => prev + 1) // Update the state to trigger useEffect
    } catch (err) {
      console.error(err)
      setSnackbar({
        isOpen: true,
        message: `Failed to remove note ${index}`,
        severity: 'error',
      })
    }
  }

  function convertUpdate(dateStr) {
    const dateObj = new Date(dateStr)
    const day = dateObj.getDate()
    const month = dateObj.getMonth() + 1
    const year = dateObj.getFullYear()
    return `${day.toString().padStart(2, '0')}/${month
      .toString()
      .padStart(2, '0')}/${year}`
  }

  function convertCreate(dateStr) {
    const [datePart] = dateStr.split(' ')
    const [year, month, day] = datePart.split('-')
    return `${day}-${month}-${year}`
  }

  const handleSubmit = async () => {
    const payload = {
      type: 'text',
      data: payloadData,
      title: 'Quick notes',
      color: { r: 255, g: 255, b: 255, a: 1 },
      idFolder: null,
      dueAt: getCurrentFormattedDateTime(),
      pinned: false,
      lock: '',
      remindAt: null,
      linkNoteShare: '',
      notePublic: 1,
    }

    console.log('payload', payload) // Check payload structure before sending

    try {
      await api.post(`/notes/${user.id}`, payload)
      setReload((prev) => prev + 1)
      setPayloadData('')
      setSnackbar({
        isOpen: true,
        message: 'Created new note successfully',
        severity: 'success',
      })
    } catch (err) {
      console.error(err)
      setSnackbar({
        isOpen: true,
        message: 'Failed to create note',
        severity: 'error',
      })
    }
  }

  const handleMess = () => {
    setIsModalMessage(!isModalMess)
  }

  const handlePublicNotesTabChange = (event, newValue) => {
    setPublicNotesTabValue(newValue)
  }

  const handlePrivateNotesTabChange = (event, newValue) => {
    setPrivateNotesTabValue(newValue)
  }

  const isLightColor = (color) => {
    const luminance = getLuminance(`rgb(${color.r}, ${color.g}, ${color.b})`);
    return luminance > 0.5;
  };

  console.log(archivedNotes)

  return (
    <Box className='w-full bg-[#4A4B51] h-auto'>
      <Box className='w-full bg-[#4A4B51] h-auto'>
        {userInfomations ? (
          <>
            <div className='intro-user w-full h-auto'>
              <div className='cover-photo-container relative'>
                <img
                  src={userInfomations.AvtProfile}
                  alt=''
                  className='w-full h-[500px] object-fit-cover cover-photo'
                  style={{ filter: 'brightness(0.9)' }}

                />
                <Box className="position-absolute flex flex-column p-3"
                  style={{
                    top: '20%', left: '70%',
                  }}>
                  <Box className="flex align-items-center">
                    <div
                      className="infomation text-white mr-5"
                      style={{ textShadow: '2px 2px 5px rgba(0, 0, 0, 0.5)' }}
                    >
                      <Typography variant="h5" className="font-bold">
                        Hello {userInfomations.name} !
                      </Typography>
                      <Typography className="text-xl">
                        {getFormattedDate(new Date())}
                      </Typography>
                    </div>
                    <Box className="flex align-items-center">
                      <div
                        className="flex align-items-center rounded-circle p-2 me-2"
                        style={{ cursor: 'pointer', height: '39px' }}
                      >
                        <svg
                          width="28"
                          height="28"
                          fill="#fff"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                        >
                          <path d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
                        </svg>
                      </div>
                      <div className="position-relative">
                        <div
                          className="d-flex align-items-center p-2 cursor-pointer rounded-circle"
                          onClick={handleMess}
                          style={{ height: '39px' }}
                        >
                          <svg
                            width="28"
                            height="28"
                            viewBox="0 0 48 48"
                            fill='none'
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_295_3410)">
                              <path
                                d="M0.00198132 23.278C0.00198132 9.898 10.482 0 24.002 0C37.522 0 48 9.9 48 23.278C48 36.656 37.52 46.554 24 46.554C21.58 46.554 19.24 46.234 17.06 45.634C16.6345 45.5195 16.1825 45.5548 15.78 45.734L11 47.834C10.7118 47.9623 10.3965 48.0176 10.0819 47.995C9.76732 47.9724 9.46312 47.8727 9.19622 47.7047C8.92931 47.5366 8.70791 47.3054 8.5516 47.0315C8.39528 46.7575 8.30887 46.4493 8.29998 46.134L8.15998 41.854C8.14913 41.5961 8.08694 41.343 7.97704 41.1095C7.86715 40.876 7.71176 40.6667 7.51998 40.494C5.11521 38.324 3.20093 35.6661 1.90487 32.6977C0.608801 29.7293 -0.0392407 26.5187 0.00398132 23.28L0.00198132 23.278ZM16.642 18.898L9.60198 30.098C8.90198 31.158 10.242 32.376 11.242 31.598L18.822 25.858C19.342 25.458 20.022 25.458 20.562 25.858L26.162 30.058C27.842 31.318 30.242 30.858 31.362 29.098L38.402 17.898C39.102 16.838 37.762 15.638 36.762 16.398L29.182 22.138C28.682 22.538 27.982 22.538 27.462 22.138L21.862 17.938C21.4637 17.6372 21.0073 17.4224 20.5216 17.3074C20.036 17.1924 19.5317 17.1796 19.0408 17.2698C18.55 17.3601 18.0832 17.5515 17.6703 17.8318C17.2573 18.1121 16.9071 18.4752 16.642 18.898Z"
                                fill="#fff"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_295_3410">
                                <rect width="48" height="48" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        </div>
                        <div
                          className="position-absolute translate-middle badge rounded-pill bg-danger"
                          style={{ top: '15%', left: '85%' }}
                        >
                          {dataMess.filter((mess) => mess.is_seen === 0).length !== 0
                            ? dataMess.filter((mess) => mess.is_seen === 0).length
                            : 0}
                        </div>
                        {isModalMess && <ModalChat dataMess={dataMess} />}
                      </div>
                    </Box>
                  </Box>
                </Box>
              </div>
              <div className='info-user-container flex items-center justify-between px-12 py-8 relative'>
                <div className='info-user flex items-center gap-8'>
                  <div className='avartar-user relative'>
                    <img
                      src={userInfomations.Avarta}
                      alt=''
                      className='w-28 h-28 rounded-full hidden lg:block object-cover'
                    />
                    <div className='absolute bottom-1 right-1 bg-green-500 w-7 h-7 rounded-full'></div>
                  </div>
                  <Box className='text-white'>
                    <Typography
                      variant='h4'
                      className='name-user font-bold hidden lg:block mb-1'
                    >
                      {userInfomations.name}
                    </Typography>
                    <Typography className='date-joined text-xl hidden lg:block'>
                      Join at {getFormattedDate(userInfomations.createAccount)}
                    </Typography>
                  </Box>
                </div>

                <div className='actions-user flex gap-2 mt-2'>
                  <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                    <GroupAddIcon className='mr-2' />
                    Add to your group
                  </Button>
                  <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                    <div className='icon-messenger mr-3 relative'>
                      <svg
                        className=''
                        width='20'
                        height='20'
                        fill='#fff'
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512">
                        <path d="M256.6 8C116.5 8 8 110.3 8 248.6c0 72.3 29.7 134.8 78.1 177.9 8.4 7.5 6.6 11.9 8.1 58.2A19.9 19.9 0 0 0 122 502.3c52.9-23.3 53.6-25.1 62.6-22.7C337.9 521.8 504 423.7 504 248.6 504 110.3 396.6 8 256.6 8zm149.2 185.1l-73 115.6a37.4 37.4 0 0 1 -53.9 9.9l-58.1-43.5a15 15 0 0 0 -18 0l-78.4 59.4c-10.5 7.9-24.2-4.6-17.1-15.7l73-115.6a37.4 37.4 0 0 1 53.9-9.9l58.1 43.5a15 15 0 0 0 18 0l78.4-59.4c10.4-8 24.1 4.5 17.1 15.6z" />
                      </svg>
                      <div
                        className="absolute translate-middle badge rounded-pill bg-danger flex items-center justify-center"
                        style={{ top: '15%', left: '95%', width: '1rem', height: '1rem' }}
                      >
                        {dataMess.filter((mess) => mess.is_seen === 0).length !== 0
                          ? dataMess.filter((mess) => mess.is_seen === 0).length
                          : 0}
                      </div>
                    </div>
                    Messenger
                    <ExpandMoreIcon className='ml-2' />
                  </Button>
                  <Button variant="contained" color="primary" style={{ textTransform: 'none' }}>
                    <GroupIcon className='mr-2' />
                    Create group
                  </Button>
                </div>
              </div>
            </div>
            <div className='container-content row m-auto'>
              <div className='leftside col-lg-8'>
                <Box className='flex mb-5 public-notes'>
                  <Box className='flex-[4] w-full'>
                    {publicNotes.length > 0 ? (
                      <>
                        <TabContext value={publicNotesTabValue}>
                          <div className='header-tabContent'>
                            <div
                              className='title'
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 10px 0 10px',
                                backgroundColor: '#fff',
                              }}
                            >
                              <Box component='h4' className='font-bold text-2xl mx-2'>
                                Lastest public notes
                              </Box>
                              <MoreHorizIcon sx={{ cursor: 'pointer', color: 'text.main' }} />
                            </div>
                            <div
                              className='selected-tab'
                              style={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                marginBottom: '6px',
                                backgroundColor: '#fff',
                                width: '100%',
                              }}
                            >
                              <TabList onChange={handlePublicNotesTabChange} aria-label='lab API tabs example'>
                                <Tab label='Recent' value='1' />
                                <Tab label='Recommended' value='2' />
                              </TabList>
                            </div>
                          </div>

                          <TabPanel
                            value='1'
                            className='w-full p-0'
                          >
                            <Swiper
                              direction='vertical'
                              spaceBetween={20}
                              slidesPerView={2.5}
                              style={{ height: '900px', width: '100%' }}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='swiper-publicNotes overflow-y-auto'
                            >
                              {publicNotes &&
                                publicNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className={`p-2 border-[1px] rounded-xl border-black border-solid mr-1
                                                ${isLightColor(info.color) ? 'text-black' : 'text-white'}
                                    `}
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 16px',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: ' 10px 0',
                                        }}
                                      >
                                        <Avatar
                                          style={{
                                            height: '45px',
                                            width: '45px',
                                            marginRight: '10px',
                                            objectFit: 'cover',
                                          }}
                                          src={userInfomations.Avarta}
                                          alt=''
                                        />
                                        <Box sx={{ color: 'text.main' }}>
                                          <p style={{ margin: 0, fontSize: '1.2rem' }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0, opacity: '0.8' }}>
                                            Create at {convertCreate(info.createAt)}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className='actions-note flex items-center gap-2'>
                                        <svg
                                          className='shareNote cursor-pointer opacity-70 hover:opacity-100'
                                          width='24'
                                          height='24'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512"
                                        >
                                          <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                                        </svg>
                                        <svg
                                          className='deleteNote cursor-pointer opacity-70 hover:opacity-100'
                                          width='24'
                                          height='24'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                          onClick={() => deleteNote(info.idNote)}
                                        >
                                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <Box
                                      component='div'
                                      sx={{
                                        color: 'text.main',
                                        margin: '10px 10px 0px',
                                        height: '160px',
                                        overflow: 'hidden',
                                      }}
                                    >
                                      <strong style={{ fontSize: '20px' }}>{info.title}</strong>
                                      {info.type === 'checkList' || info.type === 'checklist' ? (
                                        <>
                                          <Checklist data={info.data.slice(0, 3)} />
                                          {info.data.length - 3 > 0 && (
                                            <div className='font-bold'>
                                              +{info.data.length - 3} item hidden
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div
                                          className='max-h-[100px] text-start overflow-hidden'
                                          dangerouslySetInnerHTML={{
                                            __html: info.data,
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Box
                                      component='div'
                                      sx={{
                                        textAlign: 'end',
                                        padding: '0 10px 0 0',
                                      }}
                                    >
                                      <p style={{ margin: 0, opacity: 0.8 }}>
                                        Last edit at {convertUpdate(info.updateAt)}
                                      </p>
                                    </Box>
                                    <div className='interacted-note flex justify-end items-center gap-3 pr-2 mt-2'>
                                      <div className='like flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512">
                                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                      <div className='dislike flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512"
                                        >
                                          <path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                      <div className='comment flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512">
                                          <path d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </TabPanel>
                          <TabPanel value='2' sx={{ width: '100%', padding: 0 }}>
                            tab2
                          </TabPanel>
                        </TabContext>
                      </>
                    ) : (
                      <Box className='bg-white p-4 rounded-lg'>
                        <Typography variant='h5' className='font-semibold text-center'>
                          No note to show
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
                <Box className='flex mb-5 private-notes'>
                  <Box className='flex-[4] w-full'>
                    {archivedNotes.length > 0 ? (
                      <>
                        <TabContext value={privateNotesTabValue}>
                          <div className='header-tabContent'>
                            <div
                              className='title'
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 10px 0 10px',
                                backgroundColor: '#fff',
                              }}
                            >
                              <Box component='h4' className='font-bold text-2xl mx-2'>
                                Private notes
                              </Box>
                              <MoreHorizIcon sx={{ cursor: 'pointer', color: 'text.main' }} />
                            </div>
                            <div
                              className='selected-tab'
                              style={{
                                borderBottom: 1,
                                borderColor: 'divider',
                                marginBottom: '6px',
                                backgroundColor: '#fff',
                                width: '100%',
                              }}
                            >
                              <TabList onChange={handlePrivateNotesTabChange} aria-label='lab API tabs example'>
                                <Tab label='Recent' value='1' />
                                <Tab label='Recommended' value='2' />
                              </TabList>
                            </div>
                          </div>

                          <TabPanel
                            value='1'
                            className='w-full p-0'
                          >
                            <Swiper
                              spaceBetween={20}
                              slidesPerView={2.5}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='swiper-privateNotes overflow-x-auto'
                            >
                              {archivedNotes &&
                                archivedNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className={`p-2 border-[1px] rounded-xl border-black border-solid mb-1
                                                ${isLightColor(info.color) ? 'bg-white' : 'bg-black'}`}
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 16px',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          padding: ' 10px 0',
                                        }}
                                      >
                                        <Avatar
                                          style={{
                                            height: '45px',
                                            width: '45px',
                                            marginRight: '10px',
                                            objectFit: 'cover',
                                          }}
                                          src={userInfomations.Avarta}
                                          alt=''
                                        />
                                        <Box sx={{ color: 'text.main' }}>
                                          <p style={{ margin: 0, fontSize: '1.2rem' }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0, opacity: '0.8' }}>
                                            Create at {convertCreate(info.createAt)}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className='actions-note flex items-center gap-2'>
                                        <svg
                                          className='shareNote cursor-pointer opacity-70 hover:opacity-100'
                                          width='24'
                                          height='24'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512"
                                        >
                                          <path d="M307 34.8c-11.5 5.1-19 16.6-19 29.2l0 64-112 0C78.8 128 0 206.8 0 304C0 417.3 81.5 467.9 100.2 478.1c2.5 1.4 5.3 1.9 8.1 1.9c10.9 0 19.7-8.9 19.7-19.7c0-7.5-4.3-14.4-9.8-19.5C108.8 431.9 96 414.4 96 384c0-53 43-96 96-96l96 0 0 64c0 12.6 7.4 24.1 19 29.2s25 3 34.4-5.4l160-144c6.7-6.1 10.6-14.7 10.6-23.8s-3.8-17.7-10.6-23.8l-160-144c-9.4-8.5-22.9-10.6-34.4-5.4z" />
                                        </svg>
                                        <svg
                                          className='deleteNote cursor-pointer opacity-70 hover:opacity-100'
                                          width='24'
                                          height='24'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                                          onClick={() => deleteNote(info.idNote)}
                                        >
                                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z" />
                                        </svg>
                                      </div>
                                    </div>
                                    <Box
                                      component='div'
                                      sx={{
                                        color: 'text.main',
                                        margin: '10px 10px 0px',
                                        height: '160px',
                                        overflow: 'hidden',
                                      }}
                                    >
                                      <strong style={{ fontSize: '20px' }}>{info.title}</strong>
                                      {info.type === 'checkList' || info.type === 'checklist' ? (
                                        <>
                                          <Checklist data={info.data.slice(0, 3)} />
                                          {info.data.length - 3 > 0 && (
                                            <div className='font-bold'>
                                              +{info.data.length - 3} item hidden
                                            </div>
                                          )}
                                        </>
                                      ) : (
                                        <div
                                          className='max-h-[100px] text-start overflow-hidden'
                                          dangerouslySetInnerHTML={{
                                            __html: info.data,
                                          }}
                                        />
                                      )}
                                    </Box>
                                    <Box
                                      component='div'
                                      sx={{
                                        color: 'text.secondary',
                                        textAlign: 'end',
                                        padding: '0 10px 0 0',
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>
                                        Last edit at {convertUpdate(info.updateAt)}
                                      </p>
                                    </Box>
                                    <div className='interacted-note flex justify-end items-center gap-3 pr-2 mt-2'>
                                      <div className='like flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512">
                                          <path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.2s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16l-97.5 0c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8l97.5 0c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32L0 448c0 17.7 14.3 32 32 32l64 0c17.7 0 32-14.3 32-32l0-224c0-17.7-14.3-32-32-32l-64 0z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                      <div className='dislike flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512"
                                        >
                                          <path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16l-97.5 0c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8L384 32c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32L0 128c0-17.7 14.3-32 32-32l64 0c17.7 0 32 14.3 32 32l0 224c0 17.7-14.3 32-32 32l-64 0z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                      <div className='comment flex items-center gap-1'>
                                        <svg
                                          width='1rem'
                                          height='1rem'
                                          fill={isLightColor(info.color) ? 'black' : 'white'}
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 512 512">
                                          <path d="M168.2 384.9c-15-5.4-31.7-3.1-44.6 6.4c-8.2 6-22.3 14.8-39.4 22.7c5.6-14.7 9.9-31.3 11.3-49.4c1-12.9-3.3-25.7-11.8-35.5C60.4 302.8 48 272 48 240c0-79.5 83.3-160 208-160s208 80.5 208 160s-83.3 160-208 160c-31.6 0-61.3-5.5-87.8-15.1zM26.3 423.8c-1.6 2.7-3.3 5.4-5.1 8.1l-.3 .5c-1.6 2.3-3.2 4.6-4.8 6.9c-3.5 4.7-7.3 9.3-11.3 13.5c-4.6 4.6-5.9 11.4-3.4 17.4c2.5 6 8.3 9.9 14.8 9.9c5.1 0 10.2-.3 15.3-.8l.7-.1c4.4-.5 8.8-1.1 13.2-1.9c.8-.1 1.6-.3 2.4-.5c17.8-3.5 34.9-9.5 50.1-16.1c22.9-10 42.4-21.9 54.3-30.6c31.8 11.5 67 17.9 104.1 17.9c141.4 0 256-93.1 256-208S397.4 32 256 32S0 125.1 0 240c0 45.1 17.7 86.8 47.7 120.9c-1.9 24.5-11.4 46.3-21.4 62.9zM144 272a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm144-32a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm80 32a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
                                        </svg>
                                        <span>10</span>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          </TabPanel>
                          <TabPanel value='2' sx={{ width: '100%', padding: 0 }}>
                            tab2
                          </TabPanel>
                        </TabContext>
                      </>
                    ) : (
                      <Box className='bg-white p-4 rounded-lg'>
                        <Typography variant='h5' className='font-semibold text-center'>
                          No note to show
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </div>
              <div className='rightside col-lg-4 flex flex-column mb-4'>
                <div className='w-[100%] h-[450px] bg-[#FFF4BA] rounded-xl p-3'>
                  <div className='flex justify-between w-full'>
                    <span className='font-[700] text-[#888888] text-3xl'>Quick notes</span>
                    <Button className='' variant='contained' onClick={handleSubmit}>
                      Create
                    </Button>
                  </div>
                  <TextField
                    className='p-2 w-full'
                    id='standard-multiline-static'
                    placeholder='Content'
                    multiline
                    rows={16}
                    variant='standard'
                    value={payloadData}
                    onChange={(event) => setPayloadData(event.target.value)}
                  />
                </div>
                <div className='mt-3 w-[100%] h-[450px] bg-[#fff] rounded-xl'>
                  <div className='mx-2 my-2 w-[90%] h-[100%]'>
                    <span className='font-[700] text-[#888888] text-xl'>New Users</span>

                    {lastUsers.length > 0 ? (
                      <>
                        <ul className='mt-1 p-0 w-full overflow-hidden'>
                          {lastUsers.slice(0, 7).map(({ id, linkAvatar, user_name, createAt }) => (
                            <li key={`${id}`}>
                              <Link
                                to={`/other-user/${id}`}
                                className='w-full h-[15%] flex justify-between items-center my-1 ml-2 link-dark text-decoration-none'
                              >
                                <img
                                  className='w-[40px] h-[40px] rounded-xl object-cover mt-2'
                                  src={linkAvatar}
                                  alt='image'
                                />
                                <span className='truncate-text w-[50%] mr-2'>{user_name}</span>
                                <span className='mr-3'>
                                  {createAt.split(' ').slice(1, 4).join(' ')}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <p className='text-center'>See more</p>
                      </>
                    ) : (
                      <p className='text-center'>Not found new users</p>
                    )}

                  </div>
                </div>
                <div className='mt-3 w-[100%] h-[450px] bg-[#fff] rounded-xl'>
                  <div className='mx-2 my-2 w-[95%] h-[100%]'>
                    <span className='font-[700] text-[#888888] text-xl'>New Notes</span>
                    {allNotePublic.length > 0 ? (
                      <>
                        <div className='mt-2 w-[95%] ml-2 overflow-hidden'>
                          {allNotePublic.slice(0, 8).map((item, index) => (
                            <div
                              key={`notePublic ${index}`}
                              className='w-full h-[15%] flex justify-evenly my-1 ml-2 items-center py-2'
                            >
                              {/* <img
                                className='w-[40px] h-[40px] rounded-xl object-cover mt-2'
                                src={linkAvatar}
                                alt='image'
                              /> */}
                              <span className=' w-[20%] h-[full] truncate-text border-l-4 border-black-200'>
                                {item.author}
                              </span>
                              <span className='w-[55%] break-words'>
                                Create a new public note
                              </span>
                              <span className='text-xs break-words w-[12%] whitespace-nowrap'>
                                {getTimeDifference(item.update_at, new Date())}
                              </span>
                            </div>
                          ))}
                        </div>
                        <p className='text-center'>See more</p>
                      </>
                    ) : (
                      <p className='text-center'>Not found new notes</p>
                    )}
                  </div>

                </div>
              </div>
            </div>
            <div className='footer w-[100%] h-[60px] bg-[#1D1D1D] flex items-center justify-center'>
              <p className='text-white text-center text-xl font-[700]'>
                Now available on IOS and Android platform. Download now!
              </p>
              <div className='dowload-app-icons flex items-center gap-2 ml-4'>
                <AppleIcon
                  sx={{ color: 'white', fontSize: '1.8rem' }}
                  className='cursor-pointer hover:opacity-80'
                  onClick={() => {
                    window.open('https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669', '_blank')
                  }}
                />
                <AndroidIcon
                  sx={{ color: 'white', fontSize: '1.8rem' }}
                  className='cursor-pointer hover:opacity-80'
                  onClick={() => {
                    window.open('https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&amp;fbclid=IwY2xjawE_8sBleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ', '_blank')
                  }}
                />
              </div>
            </div>
          </>
        ) : (
          <h1 className='text-center text-2xl font-bold'>Not found</h1>
        )}
      </Box>
    </Box>
  )
}

export default UserProfile
