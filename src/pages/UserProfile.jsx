import { useNavigate, useParams, Link } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context'
import api from '../api'
import { Box, Typography, Button, TextField } from '@mui/material'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import SettingsIcon from '@mui/icons-material/Settings'
import SearchIcon from '@mui/icons-material/Search'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import SvgIcon from '@mui/material/SvgIcon'
import Avatar from '@mui/material/Avatar'
import './UserProfile.css'
import { io } from 'socket.io-client'
import ModalChat from '../components/ModalChat'

const UserProfile = () => {
  const appContext = useContext(AppContext)
  const { setSnackbar, user } = appContext
  const [socket, setSocket] = useState(null)
  const [userInfomations, setUserInformations] = useState(null)
  const [lastUsers, setLastUsers] = useState([])
  const [imgsUser, setImgsUser] = useState([])
  //tabvalue
  const [notesTabValue, setNotesTabValue] = useState('1')
  const [pinnedNotesTabValue, setPinnedNotesTabValue] = useState('1')
  const [publicNotesTabValue, setPublicNotesTabValue] = useState('1')
  const [checkListTabValue, setCheckListTabValue] = useState('1')
  const [recordedInfoTabValue, setRecordedInfo] = useState('1')
  //data note
  const [allNotePublic, setAllNotePublic] = useState([])
  const [userNotes, setUserNotes] = useState(null)
  const archivedNotes = (userNotes || []).filter((note) => note.inArchived)
  const pinnedNotes = (userNotes || []).filter((note) => note.pinned)
  const publicNotes = (userNotes || []).filter((note) => note.notePublic === 1)
  const checkList = (userNotes || []).filter((note) => note.checkList) // chua co attr checkList

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
    fetchAllImgsUser()
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
      setLastUsers(response.data.data.slice(0, 10))
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

  const fetchAllImgsUser = async () => {
    console.log('userID', userID)
    try {
      const response = await api.get(`/profile/image_history/70`)
      console.log(response.data)
      if (response) {
        setImgsUser(response.data)
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

  const handleNotesTabChange = (event, newValue) => {
    setNotesTabValue(newValue)
  }

  const handlePinnedNotesTabChange = (event, newValue) => {
    setPinnedNotesTabValue(newValue)
  }

  const handlePublicNotesTabChange = (event, newValue) => {
    setPublicNotesTabValue(newValue)
  }

  const handleCheckListTabChange = (event, newValue) => {
    setCheckListTabValue(newValue)
  }

  const handleRecordedInfoTabChange = (event, newValue) => {
    setRecordedInfo(newValue)
  }

  function getCurrentFormattedDateTime() {
    const date = new Date()

    // Lấy các thành phần của ngày và giờ
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0') // Tháng tính từ 0-11, cần +1
    const year = date.getFullYear()

    let hours = date.getHours()
    const minutes = String(date.getMinutes()).padStart(2, '0')

    // Xác định AM/PM
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12 // Giờ 0 thành 12
    const formattedHours = String(hours).padStart(2, '0')

    // Lấy múi giờ
    const timeZoneOffset = -date.getTimezoneOffset()
    const offsetSign = timeZoneOffset >= 0 ? '+' : '-'
    const offsetHours = String(
      Math.floor(Math.abs(timeZoneOffset) / 60)
    ).padStart(2, '0')
    const offsetMinutes = String(Math.abs(timeZoneOffset) % 60).padStart(2, '0')

    // Tạo chuỗi thời gian định dạng
    const formattedDateTime = `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm} ${offsetSign}${offsetHours}:${offsetMinutes}`

    return formattedDateTime
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

  const getTimeDifference = (time1, time2) => {
    const realTime = time1 + '+0700'
    const diffInMs = new Date(time2).getTime() - new Date(realTime).getTime()
    const diffInSeconds = Math.floor(diffInMs / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)

    if (diffInHours < 1) {
      return `${diffInMinutes} min`
    } else if (diffInDays < 1) {
      return `${diffInHours} hours`
    } else if (diffInDays < 30) {
      return `${diffInDays} day`
    } else {
      return `more 30 day`
    }
  }

  function getFormattedDate(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    // Thêm hậu tố cho ngày
    const daySuffix = (day) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    return `${dayName}, ${day}${daySuffix(day)} ${month} ${year}`;
  }

  console.log(lastUsers)
  return (
    <Box className='w-full bg-[#4A4B51] h-auto'>
      <Box className='w-full bg-[#ddd] h-auto'>
        {userInfomations ? (
          <>
            <div className='cover-photo-container mb-4 relative'>
              <img
                src={userInfomations.AvtProfile}
                alt=''
                className='w-full h-[400px] object-fit-cover cover-photo'
              />
              <Box className="position-absolute flex flex-column p-3"
                style={{
                  top: '15%', left: '70%',
                }}>
                <Box className="flex align-items-center">
                  <Box className="infomation text-white mr-5">
                    <Typography variant="h5" className="text-capitalize font-bold">
                      Hello {userInfomations.name} !
                    </Typography>
                    <Typography className="text-xl">
                      {getFormattedDate(new Date())}
                    </Typography>
                  </Box>
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
            <div className='seach-form flex w-full items-end bg-[#99999] justify-center text-white mb-6 block lg:hidden'>
              <SearchIcon className='mr-1 my-1' />
              <input
                className='w-[80%] h-[35px] text-white bg-[#777777] placeholder-white-400 placeholder-shown:text-gray-500 block lg:hidden'
                type='text'
                placeholder='Search...'
              />
            </div>
            <div className='container-content row m-auto'>
              <div className='leftside col-lg-8'>
                <Box className='flex mb-4 notes'>
                  <Box className='flex-[4] w-full'>
                    {archivedNotes.length > 0 ? (
                      <>
                        <TabContext value={notesTabValue}>
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
                              <Box component='h3' sx={{ color: 'text.main' }}>
                                NOTES
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
                              <TabList onChange={handleNotesTabChange} aria-label='lab API tabs example'>
                                <Tab label='Recent' value='1' />
                                <Tab label='Recommended' value='2' />
                              </TabList>
                            </div>
                          </div>

                          <TabPanel
                            value='1'
                            className='lg:w-[1000px] w-auto'
                            sx={{ maxWidth: '1000px', padding: 0 }}
                          >
                            <Swiper
                              spaceBetween={20}
                              slidesPerView={2.5}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='overflow-x-auto'
                            >
                              {archivedNotes &&
                                archivedNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className='p-2 border-[1px] rounded-xl border-black border-solid mb-1'
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 20px',
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
                                          <p style={{ margin: 0 }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0 }}>
                                            {' '}
                                            Create at {convertCreate(info.createAt)}{' '}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className=' flex items-center'>
                                        <div className=' flex items-center'>
                                          <SvgIcon
                                            style={{
                                              marginRight: '3px',
                                              color: '#fff',
                                              width: '28px',
                                              height: '30px',
                                            }}
                                            viewBox='0 0 32 25'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                          >
                                            <path
                                              d='M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                            <path
                                              d='M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </SvgIcon>
                                          {info.view}
                                        </div>
                                        <SvgIcon
                                          onClick={() => deleteNote(info.idNote)}
                                          sx={{
                                            color: '#fff',
                                            marginLeft: '10px',
                                          }}
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M1.71429 6H22.2857'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M9.42859 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M14.5714 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </SvgIcon>
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

                                      <Box
                                        component='div'
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          color: 'text.main',
                                          justifyContent: 'flex-end',
                                        }}
                                      ></Box>
                                    </Box>
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
                <Box className='flex mb-4 pinned-note'>
                  <Box className='flex-[4] w-full'>
                    {archivedNotes.length > 0 ? (
                      <>
                        <TabContext value={pinnedNotesTabValue}>
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
                              <Box component='h3' sx={{ color: 'text.main' }}>
                                PINNED NOTE
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
                              <TabList onChange={handlePinnedNotesTabChange} aria-label='lab API tabs example'>
                                <Tab label='Recent' value='1' />
                                <Tab label='Recommended' value='2' />
                              </TabList>
                            </div>
                          </div>

                          <TabPanel
                            value='1'
                            className='lg:w-[1000px] w-auto'
                            sx={{ maxWidth: '1000px', padding: 0 }}
                          >
                            <Swiper
                              spaceBetween={20}
                              slidesPerView={2.5}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='overflow-x-auto'
                            >
                              {archivedNotes &&
                                archivedNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className='p-2 border-[1px] rounded-xl border-black border-solid mb-1'
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 20px',
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
                                          <p style={{ margin: 0 }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0 }}>
                                            {' '}
                                            Create at {convertCreate(info.createAt)}{' '}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className=' flex items-center'>
                                        <div className=' flex items-center'>
                                          <SvgIcon
                                            style={{
                                              marginRight: '3px',
                                              color: '#fff',
                                              width: '28px',
                                              height: '30px',
                                            }}
                                            viewBox='0 0 32 25'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                          >
                                            <path
                                              d='M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                            <path
                                              d='M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </SvgIcon>
                                          {info.view}
                                        </div>
                                        <SvgIcon
                                          onClick={() => deleteNote(info.idNote)}
                                          sx={{
                                            color: '#fff',
                                            marginLeft: '10px',
                                          }}
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M1.71429 6H22.2857'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M9.42859 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M14.5714 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </SvgIcon>
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

                                      <Box
                                        component='div'
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          color: 'text.main',
                                          justifyContent: 'flex-end',
                                        }}
                                      ></Box>
                                    </Box>
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
                <Box className='flex mb-4 public-note'>
                  <Box className='flex-[4] w-full'>
                    {archivedNotes.length > 0 ? (
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
                              <Box component='h3' sx={{ color: 'text.main' }}>
                                PUBLIC NOTE
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
                            className='lg:w-[1000px] w-auto'
                            sx={{ maxWidth: '1000px', padding: 0 }}
                          >
                            <Swiper
                              spaceBetween={20}
                              slidesPerView={2.5}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='overflow-x-auto'
                            >
                              {archivedNotes &&
                                archivedNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className='p-2 border-[1px] rounded-xl border-black border-solid mb-1'
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 20px',
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
                                          <p style={{ margin: 0 }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0 }}>
                                            {' '}
                                            Create at {convertCreate(info.createAt)}{' '}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className=' flex items-center'>
                                        <div className=' flex items-center'>
                                          <SvgIcon
                                            style={{
                                              marginRight: '3px',
                                              color: '#fff',
                                              width: '28px',
                                              height: '30px',
                                            }}
                                            viewBox='0 0 32 25'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                          >
                                            <path
                                              d='M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                            <path
                                              d='M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </SvgIcon>
                                          {info.view}
                                        </div>
                                        <SvgIcon
                                          onClick={() => deleteNote(info.idNote)}
                                          sx={{
                                            color: '#fff',
                                            marginLeft: '10px',
                                          }}
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M1.71429 6H22.2857'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M9.42859 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M14.5714 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </SvgIcon>
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

                                      <Box
                                        component='div'
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          color: 'text.main',
                                          justifyContent: 'flex-end',
                                        }}
                                      ></Box>
                                    </Box>
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
                <Box className='flex mb-4 check-list'>
                  <Box className='flex-[4] w-full'>
                    {archivedNotes.length > 0 ? (
                      <>
                        <TabContext value={checkListTabValue}>
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
                              <Box component='h3' sx={{ color: 'text.main' }}>
                                CHECK LIST
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
                              <TabList onChange={handleCheckListTabChange} aria-label='lab API tabs example'>
                                <Tab label='Recent' value='1' />
                                <Tab label='Recommended' value='2' />
                              </TabList>
                            </div>
                          </div>

                          <TabPanel
                            value='1'
                            className='lg:w-[1000px] w-auto'
                            sx={{ maxWidth: '1000px', padding: 0 }}
                          >
                            <Swiper
                              spaceBetween={20}
                              slidesPerView={2.5}
                              navigation={{ prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' }}
                              onSlideChange={() => console.log('slide change')}
                              onSwiper={(swiper) => console.log(swiper)}
                              className='overflow-x-auto'
                            >
                              {archivedNotes &&
                                archivedNotes.map((info, index) => (
                                  <SwiperSlide
                                    key={index}
                                    className='p-2 border-[1px] rounded-xl border-black border-solid mb-1'
                                    style={{
                                      backgroundColor: `rgba(${info.color.r}, ${info.color.g}, ${info.color.b}, ${info.color.a})`,
                                    }}
                                  >
                                    <div
                                      style={{
                                        display: 'flex',
                                        margin: '10px 20px',
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
                                          <p style={{ margin: 0 }}>
                                            <strong>{userInfomations.name}</strong>
                                          </p>
                                          <p style={{ margin: 0 }}>
                                            {' '}
                                            Create at {convertCreate(info.createAt)}{' '}
                                          </p>
                                        </Box>
                                      </div>
                                      <div className=' flex items-center'>
                                        <div className=' flex items-center'>
                                          <SvgIcon
                                            style={{
                                              marginRight: '3px',
                                              color: '#fff',
                                              width: '28px',
                                              height: '30px',
                                            }}
                                            viewBox='0 0 32 25'
                                            fill='none'
                                            xmlns='http://www.w3.org/2000/svg'
                                          >
                                            <path
                                              d='M30.4044 10.5738C30.7877 11.1021 31 11.7884 31 12.5C31 13.2117 30.7877 13.898 30.4044 14.4263C27.9767 17.675 22.4507 24 16 24C9.54928 24 4.02338 17.675 1.59568 14.4263C1.21225 13.898 1 13.2117 1 12.5C1 11.7884 1.21225 11.1021 1.59568 10.5738C4.02338 7.32501 9.54928 1 16 1C22.4507 1 27.9767 7.32501 30.4044 10.5738Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                            <path
                                              d='M15.9999 17.6108C18.5538 17.6108 20.6241 15.3225 20.6241 12.4997C20.6241 9.67697 18.5538 7.38867 15.9999 7.38867C13.446 7.38867 11.3757 9.67697 11.3757 12.4997C11.3757 15.3225 13.446 17.6108 15.9999 17.6108Z'
                                              stroke='black'
                                              strokeWidth='2'
                                              strokeLinecap='round'
                                              strokeLinejoin='round'
                                            />
                                          </SvgIcon>
                                          {info.view}
                                        </div>
                                        <SvgIcon
                                          onClick={() => deleteNote(info.idNote)}
                                          sx={{
                                            color: '#fff',
                                            marginLeft: '10px',
                                          }}
                                          width='24'
                                          height='24'
                                          viewBox='0 0 24 24'
                                          fill='none'
                                          xmlns='http://www.w3.org/2000/svg'
                                        >
                                          <path
                                            d='M1.71429 6H22.2857'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M4.28571 6H19.7143V21.4286C19.7143 21.8832 19.5336 22.3193 19.2122 22.6407C18.8907 22.9622 18.4546 23.1429 18 23.1429H5.99999C5.54533 23.1429 5.1093 22.9622 4.7878 22.6407C4.46632 22.3193 4.28571 21.8832 4.28571 21.4286V6Z'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M7.71429 6V5.14286C7.71429 4.00622 8.16582 2.91612 8.96955 2.1124C9.77327 1.30868 10.8634 0.857147 12 0.857147C13.1366 0.857147 14.2267 1.30868 15.0305 2.1124C15.8342 2.91612 16.2857 4.00622 16.2857 5.14286V6'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M9.42859 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                          <path
                                            d='M14.5714 11.1454V18.0051'
                                            stroke='black'
                                            strokeWidth='2'
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                          />
                                        </SvgIcon>
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

                                      <Box
                                        component='div'
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          color: 'text.main',
                                          justifyContent: 'flex-end',
                                        }}
                                      ></Box>
                                    </Box>
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
                <div className='w-[100%] h-[425px] bg-[#FFF4BA] rounded-xl'>
                  <div className='flex justify-between w-full mt-2 px-2'>
                    <span className='font-[700] text-[#888888] text-xl'>Quick notes</span>
                    <Button className='' variant='contained' onClick={handleSubmit}>
                      Create
                    </Button>
                  </div>
                  <TextField
                    className='p-2 w-full'
                    id='standard-multiline-static'
                    placeholder='Content'
                    multiline
                    rows={15}
                    variant='standard'
                    value={payloadData}
                    onChange={(event) => setPayloadData(event.target.value)}
                  />
                </div>
                <div className='mt-3 w-[100%] h-[625px] bg-[#fff] rounded-xl'>
                  <div className='mx-2 my-2 w-[95%] h-[100%]'>
                    <span className='font-[700] text-[#888888] text-xl'>New User</span>

                    {lastUsers.length > 0 ? (
                      <>
                        <ul className='mt-1 p-0 w-full h-[87%] overflow-hidden'>
                          {lastUsers.map(({ id, linkAvatar, user_name, createAt }) => (
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
                <div className='mt-3 w-[100%] h-[625px] bg-[#fff] rounded-xl'>
                  <div className='mx-2 my-2 w-[95%] h-[100%]'>
                    <span className='font-[700] text-[#888888] text-xl'>New Notes</span>
                    {allNotePublic.length > 0 ? (
                      <>
                        <div className='mt-2 w-[95%] h-[87%] ml-2 overflow-hidden'>
                          {allNotePublic.slice(0, 10).map((item, index) => (
                            <div
                              key={`notePublic ${index}`}
                              className='w-full h-[9%] flex justify-evenly my-1 ml-2 items-center'
                            >
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
            <div className='recorded-info w-[98%] h-[500px] m-auto'>
              <Box className='flex-[4] w-full h-full mb-4'>
                <TabContext value={recordedInfoTabValue}>
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
                      <Box component='h3' sx={{ color: 'text.main' }}>
                        NEWLY RECORDED INFOMATION
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
                      <TabList onChange={handleRecordedInfoTabChange} aria-label='lab API tabs example'>
                        <Tab label='Photo' value='1' />
                        <Tab label='Document' value='2' />
                        <Tab label='Audio' value='3' />
                        <Tab label='Note' value='4' />
                        <Tab label='Email' value='5' />
                      </TabList>
                    </div>
                  </div>

                  <TabPanel value='1' sx={{ width: '100%', padding: 0 }}>
                    {imgsUser.length > 0 ? (
                      <>
                        {imgsUser.map((item, index) => (
                          <img key={index} src={item} alt='image' />
                        ))}
                      </>
                    ) : (
                      <p>Not found photo</p>
                    )}
                  </TabPanel>
                  <TabPanel value='2' sx={{ width: '100%', padding: 0 }}>
                    Docs
                  </TabPanel>
                  <TabPanel value='3' sx={{ width: '100%', padding: 0 }}>
                    Audio
                  </TabPanel>
                  <TabPanel value='4' sx={{ width: '100%', padding: 0 }}>
                    Note
                  </TabPanel>
                  <TabPanel value='5' sx={{ width: '100%', padding: 0 }}>
                    Email
                  </TabPanel>
                </TabContext>
                {/*<Box className='bg-white p-4 rounded-lg'>
                       <Typography variant='h5' className='font-semibold text-center'>
                       Not found
                       </Typography>
                  </Box> */}
              </Box>
            </div>
            <div className='footer w-[100%] h-[60px] bg-[#4A4B51] flex items-center justify-center'>
              <p className='text-white text-center text-xl font-[700]'>
                Now available on IOS and Android platform. Download now!
              </p>
            </div>
          </>
        ) : (
          <h1>Not found</h1>
        )}
      </Box>
    </Box>
  )
}

export default UserProfile
