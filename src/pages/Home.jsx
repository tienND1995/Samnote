/* eslint-disable react/no-unescaped-entities */
// import React from "react";
// import { handleLogOut } from "../helper";
import AndroidIcon from '@mui/icons-material/Android'
import AppleIcon from '@mui/icons-material/Apple'
import ClearIcon from '@mui/icons-material/Clear'
import CloudIcon from '@mui/icons-material/Cloud'
import DescriptionIcon from '@mui/icons-material/Description'
import ErrorIcon from '@mui/icons-material/Error'
import HistoryIcon from '@mui/icons-material/History'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import MenuIcon from '@mui/icons-material/Menu'
import NorthEastIcon from '@mui/icons-material/NorthEast'
import PeopleIcon from '@mui/icons-material/People'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { Link, useNavigate } from 'react-router-dom'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import '../App.css'
import api from '../api'
import '../bootstrap.css'
import { AppContext } from '../context'

const customTime = (lastDate) => {
   const currentTime = new Date()
   const lastTime = new Date(lastDate)
   // @ts-ignore
   const milliseconds = currentTime - lastTime

   const seconds = Math.floor(milliseconds / 1000)
   const minutes = Math.floor(seconds / 60)
   const hours = Math.floor(minutes / 60)
   const days = Math.floor(hours / 24)

   if (days > 0) {
      return days === 1 ? '1 days' : `${days} days`
   } else if (days <= 0) {
      return 'to day'
   }
}

// eslint-disable-next-line react/prop-types
const ScrollClassAdder = ({ targetId, className, threshold }) => {
   const [isScrolled, setIsScrolled] = useState(false)

   useEffect(() => {
      const handleScroll = () => {
         const scrollTop = window.pageYOffset || document.documentElement.scrollTop
         const targetElement = document.getElementById(targetId)

         if (scrollTop >= threshold && !isScrolled) {
            targetElement.classList.add(className.trim()) // Xóa khoảng trắng thừa
            setIsScrolled(true)
         } else if (scrollTop < threshold && isScrolled) {
            targetElement.classList.remove(className.trim())
            setIsScrolled(false)
         }
      }

      window.addEventListener('scroll', handleScroll)
      return () => {
         window.removeEventListener('scroll', handleScroll)
      }
   }, [targetId, className, threshold, isScrolled])

   return null
}

const Home = () => {
   const [informations, setInformation] = useState(null)
   const [newNotes, setLastPublicNote] = useState(null)
   const [newUsers, setNewUser] = useState(null)
   const [userOnline, setUserOnline] = useState(null)
   const [firstNote, setFirstNote] = useState(null)
   const [loading, setLoading] = useState(false)
   const [canRefresh, setCanRefresh] = useState(true)
   const appContext = useContext(AppContext)
   const { user } = appContext
   const navigate = useNavigate()
   console.log('user', user)

   useEffect(() => {
      const getUserNote = async () => {
         // Kiểm tra nếu user không tồn tại
         if (!user) {
            console.log('User ID is missing or invalid')
            return
         }

         try {
            const res = await api.get(`/notes/${user.id}?page=1`)
            console.log('firstNote', firstNote)
            // Cập nhật số trang tối đa và danh sách ghi chú
            setFirstNote(res.data.notes[0])
         } catch (err) {
            console.log(err)
         }
      }

      if (user) {
         getUserNote()
      }
   }, [user])

   const getProfile = async () => {
      try {
         const res = await axios(`https://samnote.mangasocial.online/numbernote`)
         setInformation(res.data.data)
         console.log(res.data.data)
      } catch (err) {
         console.log(err)
      } finally {
         setLoading(false)
      }
   }

   const getLastPublicNote = async () => {
      try {
         const res = await axios(`https://samnote.mangasocial.online/notes_public`)
         setLastPublicNote(res.data.public_note)
         console.log(res.data.public_note)
      } catch (err) {
         console.log(err)
      }
   }

   const getUserOnline = async () => {
      try {
         const res = await axios(`https://samnote.mangasocial.online/users-online`)
         setUserOnline(res.data.users)
      } catch (err) {
         console.log(err)
      }
   }

   const getNewUser = async () => {
      try {
         const res = await axios(`https://samnote.mangasocial.online/lastUser`)
         setNewUser(res.data.data)
      } catch (err) {
         console.log(err)
      }
   }

   const handleRefresh = () => {
      if (canRefresh) {
         setLoading(true)
         setCanRefresh(false)
         setTimeout(() => {
            setCanRefresh(true)
         }, 5000)
         setTimeout(() => {
            getProfile()
         }, 1000)
      }
   }

   useEffect(() => {
      getProfile()
      getLastPublicNote()
      getNewUser()
      getUserOnline()
   }, [])

   const [isOpen, setIsOpen] = useState(false)

   const toggleMenu = () => {
      setIsOpen(!isOpen)
   }

   const mdScreen = useMediaQuery('(max-width:767px)')

   return (
      <Box sx={{}}>
         <ScrollClassAdder targetId='myElement' className='active ' threshold={150} />
         <header
            id='myElement'
            className='header-container flex items-center justify-between 
            h-[10vh] md:h-[14vh] bg-[#E95B31] px-5'
         >
            <div className='logo-container flex items-center justify-center'>
               <p className='text-2xl text-white font-bold p-0 m-0'>
                  SAMNOTES
               </p>
            </div>

            <div className='nav-main-container flex items-center justify-between'>
               <ul className='nav-main'
                  style={
                     mdScreen
                        ? {
                           display: isOpen ? 'block' : 'none',
                           flexDirection: 'column',
                           position: 'absolute',
                           zIndex: '50',
                           top: '70px',
                           borderRadius: '10px',
                           right: '10px',
                           backgroundColor: '#323436',
                           padding: '20px 30px',
                        }
                        : {
                           display: 'flex',
                           marginBottom: '0px',
                           alignItems: 'center',
                           color: '#fff',
                        }
                  }
               >
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', padding: '10px 0px', cursor: 'pointer' }
                           : {
                              whiteSpace: 'nowrap',
                              fontSize: '14px',
                              fontWeight: '500',
                              cursor: 'pointer',
                           }
                     }
                     onClick={() => navigate(`/profile/${user?.id}`)}
                  >
                     Manager My Note
                  </li>
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', padding: '10px 0px', cursor: 'pointer' }
                           : {
                              whiteSpace: 'nowrap',
                              margin: '0 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              fontWeight: '500',
                           }
                     }
                     onClick={() => navigate(`/photo`)}
                  >
                     Photos
                  </li>
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', cursor: 'pointer', padding: '10px 0px' }
                           : {
                              whiteSpace: 'nowrap',
                              margin: '0 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              fontWeight: '500',
                           }
                     }
                     onClick={() => navigate(`/messages`)}
                  >
                     Message
                  </li>
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', cursor: 'pointer', padding: '10px 0px' }
                           : {
                              whiteSpace: 'nowrap',
                              margin: '0 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              fontWeight: '500',
                           }
                     }
                     onClick={() => navigate(`/dustbin`)}
                  >
                     Dustbin
                  </li>
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', cursor: 'pointer', padding: '10px 0px' }
                           : {
                              whiteSpace: 'nowrap',
                              margin: '0 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              fontWeight: '500',
                           }
                     }
                     onClick={() => navigate(`/sketch`)}
                  >
                     Sketch
                  </li>
                  <li
                     className='hover:text-gray-100'
                     style={
                        mdScreen
                           ? { color: '#fff', cursor: 'pointer', padding: '10px 0px' }
                           : {
                              whiteSpace: 'nowrap',
                              margin: '0 10px',
                              fontSize: '14px',
                              cursor: 'pointer',
                              fontWeight: '500',
                           }
                     }
                  >
                     Contact Us
                  </li>

                  {user === null ? (
                     <li
                        style={
                           mdScreen
                              ? { color: '#fff', cursor: 'pointer', padding: '10px 0px' }
                              : {
                                 whiteSpace: 'nowrap',
                                 margin: '0 10px',
                                 fontSize: '14px',
                                 cursor: 'pointer',
                                 fontWeight: '500',
                              }
                        }
                        onClick={() => {
                           navigate(`/auth`)
                        }}
                     >
                        <Link
                           to='login'
                           style={{
                              textDecoration: 'none',
                              fontWeight: '500',
                              cursor: 'pointer',
                              color: '#fff',
                           }}
                        >
                           <svg
                              width='25'
                              height='25'
                              viewBox='0 0 25 25'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                           >
                              <path
                                 d='M12.5 12.5C13.7432 12.5 14.9355 12.0061 15.8146 11.1271C16.6936 10.248 17.1875 9.0557 17.1875 7.8125C17.1875 6.5693 16.6936 5.37701 15.8146 4.49794C14.9355 3.61886 13.7432 3.125 12.5 3.125C11.2568 3.125 10.0645 3.61886 9.18544 4.49794C8.30636 5.37701 7.8125 6.5693 7.8125 7.8125C7.8125 9.0557 8.30636 10.248 9.18544 11.1271C10.0645 12.0061 11.2568 12.5 12.5 12.5ZM15.625 7.8125C15.625 8.6413 15.2958 9.43616 14.7097 10.0222C14.1237 10.6083 13.3288 10.9375 12.5 10.9375C11.6712 10.9375 10.8763 10.6083 10.2903 10.0222C9.70424 9.43616 9.375 8.6413 9.375 7.8125C9.375 6.9837 9.70424 6.18884 10.2903 5.60279C10.8763 5.01674 11.6712 4.6875 12.5 4.6875C13.3288 4.6875 14.1237 5.01674 14.7097 5.60279C15.2958 6.18884 15.625 6.9837 15.625 7.8125ZM21.875 20.3125C21.875 21.875 20.3125 21.875 20.3125 21.875H4.6875C4.6875 21.875 3.125 21.875 3.125 20.3125C3.125 18.75 4.6875 14.0625 12.5 14.0625C20.3125 14.0625 21.875 18.75 21.875 20.3125ZM20.3125 20.3062C20.3109 19.9219 20.0719 18.7656 19.0125 17.7062C17.9938 16.6875 16.0766 15.625 12.5 15.625C8.92344 15.625 7.00625 16.6875 5.9875 17.7062C4.92813 18.7656 4.69062 19.9219 4.6875 20.3062H20.3125Z'
                                 fill='black'
                              />
                           </svg>
                        </Link>
                     </li>
                  ) : (
                     <li
                        style={{ cursor: 'pointer', marginLeft: '7px' }}
                        onClick={() => {
                           navigate(`/profile/${user.id}`)
                        }}
                     >
                        <Avatar src={user.Avarta} sx={{ width: '40px', height: '40px' }} />
                     </li>
                  )}
               </ul>
               <div onClick={toggleMenu} className='toggle-menu'>
                  {isOpen ? (
                     <ClearIcon
                        sx={{
                           color: 'white',
                           cursor: 'pointer',
                           display: 'none',
                        }}
                        className='menu-mobile w-8 h-8'
                     />
                  ) : (
                     <MenuIcon
                        sx={{
                           color: 'white',
                           cursor: 'pointer',
                           display: 'none',
                        }}
                        className='menu-mobile w-8 h-8'
                     />
                  )}
               </div>
            </div>
         </header>

         <main className='max-w-[95%] w-[760px] mx-auto'>
            <div className='flex flex-col items-center text-center gap-3 my-4'>
               {' '}
               <img
                  src='https://i.ibb.co/wcgXW9s/logo.png'
                  alt='logo'
                  style={{ width: '80px', height: '80px', marginRight: '20px' }}
               />
               <h2
                  style={{
                     textTransform: 'uppercase',
                     fontSize: '40px',
                     fontWeight: '700',
                  }}
               >
                  samnote
               </h2>
               <p style={{ fontSize: '20px', fontWeight: '700' }}>
                  Visit the app store for more information
               </p>
               <div>
                  <a
                     style={{ textDecoration: 'none' }}
                     href='https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&fbclid=IwY2xjawE_8sBleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ'
                  >
                     {' '}
                     <button
                        style={{
                           backgroundColor: '#fff',
                           borderRadius: '30px',
                           padding: '5px 10px',
                           margin: '0 5px',
                           width: '180px',
                           textAlign: 'center',
                        }}
                     >
                        Google Play Store <NorthEastIcon />
                     </button>
                  </a>{' '}
                  <a
                     style={{ textDecoration: 'none' }}
                     href='https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669'
                  >
                     {' '}
                     <button
                        style={{
                           backgroundColor: '#fff',
                           borderRadius: '30px',
                           padding: '5px 10px',
                           margin: '0 5px',
                           width: '180px',
                           textAlign: 'center',
                        }}
                     >
                        App Store
                        <NorthEastIcon />
                     </button>
                  </a>{' '}
               </div>
               <h2 className='text-[2rem] md:text-[2.5rem] font-bold'>
                  About Samsung Notes
               </h2>
               <p>
                  With Samsung Notes you can create notes containing texts, images with
                  footnotes, voice recordings, and music. Moreover, you can share your notes
                  easily to SNS.nPreviously made any memos from S Note and Memo also can be
                  imported into Samsung Notes.nSamsung Notes provides various brush types
                  and color mixers, so that you can draw fabulous paintings like
                  professional painters.
               </p>
               <Iframe
                  className='mb-4 w-[100%] md:w-[550px] h-[300px]'
                  src='https://www.youtube.com/embed/VyP-Fix9I-8?si=rRMEizqO0HOYdeT-'
                  title='YouTube video player'
                  frameborder='0'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
                  referrerpolicy='strict-origin-when-cross-origin'
                  allowfullscreen
               ></Iframe>
               <div className='w-full md:w-[750px] h-[250px] sm:h-[300px] md:h-[350px]'>
                  <Swiper
                     className='h-full'
                     modules={[Navigation, Pagination, Autoplay]}
                     spaceBetween={20}
                     slidesPerView={1}
                     pagination={{ clickable: true }}
                     navigation
                     autoplay={{
                        delay: 2500,
                        // disableOnInteraction: false,
                     }}
                  >
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-1.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-2.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-3.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-4.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-5.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-6.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-8.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-9.png)] bg-center bg-no-repeat bg-cover`}
                     ></SwiperSlide>
                     <SwiperSlide
                        className={`rounded-xl bg-[url(/img-slider-7.png)] bg-center bg-no-repeat bg-cover relative`}
                     >
                        <div
                           style={{
                              position: 'absolute',
                              bottom: '40px',
                              left: '50%',
                              display: 'flex',
                              transform: 'translateX(-50%)',
                           }}
                        >
                           <a
                              href='https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&fbclid=IwY2xjawE_8sBleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ'
                              style={{
                                 backgroundColor: '#fff',
                                 borderRadius: '30px',
                                 padding: '5px 10px',
                                 display: 'inline-block',
                                 margin: '0 5px',
                                 textDecoration: 'none ',
                                 color: '#000',
                                 width: '180px',
                                 textAlign: 'center',
                              }}
                           >
                              Google Play Store <NorthEastIcon />
                           </a>
                           <a
                              href='https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669'
                              style={{
                                 textDecoration: 'none ',
                                 color: '#000',
                                 backgroundColor: '#fff',
                                 borderRadius: '30px',
                                 padding: '5px 10px',
                                 display: 'inline-block',
                                 margin: '0 5px',
                                 width: '180px',
                                 textAlign: 'center',
                              }}
                           >
                              App Store
                              <NorthEastIcon />
                           </a>
                        </div>
                     </SwiperSlide>
                  </Swiper>
               </div>
               <div className='find-solutions flex flex-col items-center w-full lg:w-[750px]'>
                  <h2 className='text-[2rem] md:text-[2.5rem] font-bold'
                     style={{
                        textAlign: 'center',
                        marginTop: '30px',
                     }}
                  >
                     Find solutions
                  </h2>
                  <div className='rounded-xl border border-gray-500 p-3 flex items-center gap-2'>
                     <img
                        className='w-[170px] h-[100px] object-cover rounded-xl'
                        src='/img-Find-solutions-1.png'
                        alt=''
                     />
                     <div className='text-left '>
                        <h5>Sync Samsung Notes with Microsoft OneNote</h5>
                        <p className='text-justify text-xs'>
                           If your Samsung Notes app is full of important folders, notes, and
                           tasks, you can make sure they'll never get lost by using Microsoft
                           OneNote. This service allows you to sync your notes across all of your
                           devices so you can view them from Microsoft Office on a PC. You’ll just
                           need to make sure you’re signed in to your Microsoft account on your
                           Galaxy phone or tablet. You can sync the Reminder app with Microsoft To
                           Do as well, if you’d like to view both your notes and reminders...
                        </p>
                     </div>
                  </div>
                  <div className='rounded-xl border border-gray-500 p-3 flex items-center gap-2 mt-2'>
                     <img
                        className='w-[170px] h-[100px] object-cover rounded-xl'
                        src='/img-Find-solutions-2.png'
                        alt=''
                     />
                     <div className='text-left'>
                        <h5>Use Samsung Notes on your Samsung PC</h5>
                        <p className='text-justify text-xs'>
                           Create memos and reminders with the Samsung Notes app on a Samsung
                           Galaxy Book. It lets you type notes using the keyboard or draw right on
                           the screen with an S Pen. If your model doesn't include an S Pen but has
                           a touch screen, you can use a stylus or your finger to create notes
                           instead. If you have voice recognition enabled, you can speak to the app
                           so it will write notes for you. Your notes can be saved for future
                           editing and browsing if you need to check them again....
                        </p>
                     </div>
                  </div>
                  <div className='rounded-xl border border-gray-500 p-3 flex items-center gap-2 mt-2'>
                     <img
                        className='w-[170px] h-[100px] object-cover rounded-xl'
                        src='/img-Find-solutions-3.png'
                        alt=''
                     />
                     <div className='text-left '>
                        <h5>Use Samsung Notes handwriting functions with your S Pen</h5>
                        <p className='text-justify text-xs'>
                           Handwriting mode in the Samsung Notes app makes it easier than ever to
                           copy down your ideas or draw a picture any time your muse inspires you.
                           While you can use your finger to draw or write in the app, an S
                           Pen truly enhances the experience! Handwriting in notes can be altered,
                           moved, and converted to text as well so you'll be able to organize your
                           notes and share them with your friends or associates via text or
                           email...{' '}
                        </p>
                     </div>
                  </div>
                  <div className='rounded-xl border border-gray-500 p-3 flex items-center gap-2 mt-2'>
                     <img
                        className='w-[170px] h-[100px] object-cover rounded-xl'
                        src='/img-Find-solutions-4.png'
                        alt=''
                     />
                     <div className='text-left '>
                        <h5>Import and export PDFs with Samsung Notes</h5>
                        <p className='text-justify text-xs'>
                           The Samsung Notes app on your Note20 5G or Note20 Ultra 5G has a new
                           feature that lets you import PDF documents. You can write on, draw on,
                           and annotate your PDFs right from the app and then save them for future
                           use. There are additional options for exporting PDFs and notes as well,
                           such as PowerPoint presentations or Microsoft Word documents, if you
                           need to add the contents elsewhere...
                        </p>
                     </div>
                  </div>

               </div>
               <div className='bg-[url(/bg-SamNotes-Account.png)] w-full lg:w-[1100px] h-[150px] bg-cover bg-center bg-no-repeat flex items-center flex-col justify-center'>
                  <h5>SamNotes Account</h5>
                  <p>
                     Access your SamNotes account to get product support, order tracking,
                     exclusive rewards and offers.
                  </p>
                  <h6>
                     <a className='text-black' href=''>
                        Sign in to SamNotes
                     </a>
                  </h6>
               </div>
            </div>
            <h2 className='title text-[2rem] md:text-[2.5rem] font-bold'
               style={{
                  textAlign: 'center',
                  marginTop: '30px',
                  marginBottom: '10px',
               }}
            >
               The simplest way to <br></br>
               keep notes
            </h2>
            <p style={{ marginBottom: '10px', textAlign: 'center' }}>
               All your notes, synced on all your devices. Get Samnotes now for iOS,
               Android or in your browser.
            </p>
            <div className='flex items-center justify-center'>
               <Button
                  sx={{
                     padding: '10px 20px',
                     alignItems: 'center',
                     display: 'flex',
                     marginBottom: '40px',
                  }}
                  variant='contained'
                  onClick={() => navigate(`/create-note`)}
               >
                  Create Public Notes
               </Button>
            </div>
            <div className='members bg-[#E95B31] p-3 rounded-xl'>
               <div className='flex items-center justify-between'>
                  <h2
                     style={{
                        color: '#fff',
                        fontWeight: '700',
                        textAlign: 'center',
                        marginBottom: '10px',
                     }}
                  >
                     Members
                  </h2>
                  <Box
                     onClick={handleRefresh}
                     sx={{
                        height: '40px',
                        width: '105px',
                        borderRadius: '10px',
                        fontSize: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        bgcolor: '#fff',
                        marginBottom: '10px',
                     }}
                  >
                     Refresh
                  </Box>
               </div>
               <div className='list-user overflow-hidden rounded-xl'>
                  {loading ? (
                     <p className='text-center text-white text-lg'>Loading data...</p>
                  ) : (
                     informations &&
                     informations.map((info, index) => (
                        <div
                           key={index}
                           style={{
                              margin: '0px',
                              padding: '8px 15px',
                              display: 'flex',
                              alignItems: 'center',
                              whiteSpace: 'nowrap',
                              fontSize: '20px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              borderBottom: '1px dotted #000',
                              backgroundColor: '#fff',
                              cursor: 'pointer',
                           }}
                           onClick={() => {
                              navigate(`/profile/${info.idUser}`)
                           }}
                        >
                           <p style={{ margin: 0, width: '7%' }}>{index + 1}</p>
                           <div style={{ width: '50px', marginRight: '5px' }}>
                              <Avatar
                                 src={info.Avatar}
                                 alt='Avatar'
                                 style={{ width: '50px', height: '50px' }}
                              />
                           </div>
                           <p
                              style={{
                                 margin: 0,
                                 width: '60%',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                              }}
                           >
                              {info.name}
                           </p>
                           <p
                              style={{
                                 margin: 0,
                                 width: 'fit-content',
                                 textAlign: 'end',
                              }}
                           >
                              {info.nbnote} notes
                           </p>
                        </div>
                     ))
                  )}
               </div>
            </div>
            <Box component='hr'
               sx={{
                  height: '1px',
                  borderRadius: '5px',
                  backgroundColor: 'text.primary',
               }}
            ></Box>
            <div className='lastest-public-notes'
               style={{
                  backgroundColor: '#E95B31',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '50px',
               }}
            >
               <h2
                  style={{
                     color: '#fff',
                     fontWeight: '700',
                     textAlign: 'center',
                     marginBottom: '10px',
                  }}
               >
                  Lastest Public Notes
               </h2>
               <div className='overflow-hidden rounded-xl'>
                  {newNotes?.map((item, index) => (
                     <div
                        key={index}
                        style={{
                           fontSize: '20px',
                           display: 'flex',
                           backgroundColor: '#fff',
                           padding: '10px 15px',
                           borderBottom: '1px dotted #000',
                        }}
                     >
                        <div
                           style={{
                              width: '8%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                           }}
                        >
                           {index + 1}
                        </div>
                        <div className='w-[35%] lg:w-[20%] overflow-hidden whitespace-nowrap text-ellipsis'>
                           {item.type}
                        </div>
                        <div className='w-[30%] hidden sm:block overflow-hidden whitespace-nowrap text-ellipsis'>
                           {item.title}
                        </div>
                        <div className='sm:w-[30%] w-[25%] overflow-hidden whitespace-nowrap text-ellipsis'>
                           {customTime(item.update_at)}
                        </div>
                        <div className='w-[30%] lg:w-[20%] overflow-hidden whitespace-nowrap text-ellipsis'>
                           {item.author}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <Box component='hr'
               sx={{
                  height: '1px',
                  borderRadius: '5px',
                  backgroundColor: 'text.primary',
               }}
            ></Box>
            <div className='new-users'
               style={{
                  backgroundColor: '#E95B31',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '50px',
               }}
            >
               <h2
                  style={{
                     color: '#fff',
                     fontWeight: '700',
                     textAlign: 'center',
                     marginBottom: '10px',
                  }}
               >
                  New Users
               </h2>
               <div className='overflow-hidden rounded-xl'>
                  {newUsers?.map((item, index) => (
                     <div
                        key={index}
                        style={{
                           fontSize: '20px',
                           display: 'flex',
                           backgroundColor: '#fff',
                           padding: '8px 15px',
                           borderBottom: '1px dotted #000',
                           alignItems: 'center',
                        }}
                        onClick={() => navigate(`/profile/${item.id}`)}
                     >
                        <div
                           style={{
                              width: '8%',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                           }}
                        >
                           {index + 1}
                        </div>
                        <div style={{ width: '50px', marginRight: '5px' }}>
                           <Avatar
                              src={item.linkAvatar}
                              alt='Avatar'
                              style={{ width: '50px', height: '50px' }}
                           />
                        </div>

                        <div className='w-[60%] sm:w-[35%] overflow-hidden whitespace-nowrap text-ellipsis'>
                           {item.name}
                        </div>
                        <div className='w-[30%] sm:w-[20%] overflow-hidden whitespace-nowrap text-ellipsis pl-5'>
                           {customTime(item.createAt)}
                        </div>
                        <div className='sm:w-[30%] hidden sm:block overflow-hidden whitespace-nowrap text-ellipsis'>
                           {item.gmail}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <Box component='hr'
               sx={{
                  height: '1px',
                  borderRadius: '5px',
                  backgroundColor: 'text.primary',
               }}
            ></Box>
            <div className='users-online'
               style={{
                  backgroundColor: '#E95B31',
                  padding: '20px',
                  borderRadius: '10px',
                  marginTop: '50px',
               }}
            >
               <h2
                  style={{
                     color: '#fff',
                     fontWeight: '700',
                     textAlign: 'center',
                     marginBottom: '10px',
                  }}
               >
                  Users Online
               </h2>
               <div className='overflow-hidden rounded-xl'>
                  {userOnline !== null ? (
                     userOnline?.map((item, index) => (
                        <div
                           key={index}
                           style={{
                              fontSize: '20px',
                              display: 'flex',
                              backgroundColor: '#fff',
                              padding: '8px 15px',
                              borderBottom: '1px dotted #000',
                              alignItems: 'center',
                           }}
                        >
                           <div style={{ width: '50px', marginRight: '5px' }}>
                              <Avatar
                                 src={item.url_avatar}
                                 alt='Avatar'
                                 sx={{ width: '50px', height: '50px' }}
                              />
                           </div>

                           <div
                              style={{
                                 width: '65%',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap',
                              }}
                           >
                              {item.user_name}
                           </div>
                           <div
                              style={{
                                 width: '20%',
                                 display: 'flex',
                                 alignItems: 'center',
                                 overflow: 'hidden',
                                 textOverflow: 'ellipsis',
                                 whiteSpace: 'nowrap',
                              }}
                           >
                              Online
                              <div
                                 style={{
                                    width: '20px',
                                    height: '20px',
                                    marginLeft: '20px',
                                    backgroundColor: 'rgb(14 152 198)',
                                    borderRadius: '50%',
                                 }}
                              ></div>
                           </div>
                        </div>
                     ))
                  ) : (
                     <p>Không có người dùng nào đang online</p>
                  )}
               </div>
            </div>
            <Box component='hr'
               sx={{
                  height: '1.5px',
                  borderRadius: '5px',
                  backgroundColor: 'text.primary',
               }}
            ></Box>
            <section className='feature'>
               <p className='text-[2rem] md:text-[2.5rem] font-bold'
                  style={{
                     textAlign: 'center',
                     marginTop: '30px',
                     marginBottom: '10px',
                  }}
               >
                  Comprehensive underneath,<br></br> simple on the surface
               </p>
               <div className='container'>
                  <div className='row'>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <CloudIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />
                           <h5>Use it everywhere</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Notes stay updated across all your devices, automatically and in real
                           time. There's no “sync” button: It just works.
                        </Box>
                     </div>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <LocalOfferIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />
                           <h5>Stay organized</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Add tags to find notes quickly with instant searching.
                        </Box>
                     </div>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <PeopleIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />

                           <h5>Work together</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Share a to-do list, post some instructions, or publish your notes
                           online.
                        </Box>
                     </div>
                  </div>
                  <div className='row md:pt-3'>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <HistoryIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />
                           <h5>Go back in time</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Share a to-do list, post some instructions, or publish your notes
                           online.
                        </Box>
                     </div>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <DescriptionIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />
                           <h5>Markdown support</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Share a to-do list, post some instructions, or publish your notes
                           online.
                        </Box>
                     </div>
                     <div className='col-md-4 col-12 mt-2 md:mt-0'>
                        <Box sx={{ display: 'flex' }}>
                           <ErrorIcon sx={{ color: 'mycolor.main', marginRight: '5px' }} />
                           <h5>It's free</h5>
                        </Box>
                        <Box component='p' sx={{ color: 'text.disabled' }}>
                           Share a to-do list, post some instructions, or publish your notes
                           online.
                        </Box>
                     </div>
                  </div>
               </div>
            </section>
            <section className='saying'>
               <p className='text-[2rem] md:text-[2.5rem] font-bold'
                  style={{
                     textAlign: 'center',
                     marginTop: '30px',
                     marginBottom: '10px',
                  }}
               >
                  What people are saying
               </p>
               <div className='container'>
                  <div className='row'>
                     <div
                        className='col-sm-4 mb-3 sm:mb-0'
                        style={{
                           position: 'relative',
                           height: 'fit-content',
                        }}
                     >
                        <p>If you're not using Samnotes, you're missing out.</p>
                        <Box
                           component='span'
                           sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                        >
                           TechCrunch
                        </Box>
                     </div>
                     <div
                        className='col-sm-4 mb-3 sm:mb-0'
                        style={{
                           position: 'relative',
                           height: 'fit-content',
                        }}
                     >
                        <p>
                           If you're looking for a cross-platform note-taking tool with just
                           enough frills, it's hard to look beyond Samnotes.
                        </p>
                        <Box
                           component='span'
                           sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                        >
                           MacWorld
                        </Box>
                     </div>
                     <div
                        className='col-sm-4 mb-3 sm:mb-0'
                        style={{
                           position: 'relative',
                           height: 'fit-content',
                        }}
                     >
                        <p>
                           If you want a truly distraction-free environment then you can't do
                           better than Samnotes for your note-taking needs do better than Samnotes
                           for your note-taking needs.
                        </p>
                        <Box
                           component='span'
                           sx={{ color: 'text.disabled', fontStyle: 'italic' }}
                        >
                           Zapier
                        </Box>
                     </div>
                  </div>
               </div>
            </section>
            <section className='download-app'>
               <p className='text-[2rem] md:text-[2.5rem] font-bold'
                  style={{
                     textAlign: 'center',
                     marginTop: '30px',
                     marginBottom: '10px',
                  }}
               >
                  Available on all your devices
               </p>
               <Box
                  component='p'
                  sx={{
                     textAlign: 'center',
                     fontSize: '20px',
                     marginBottom: '20px',
                  }}
               >
                  Download Samnotes for any device and stay in
                  <br></br>sync - all the time, everywhere.
               </Box>
               <div className='flex flex-col md:flex-row justify-center items-center flex-wrap gap-3'>
                  <div>
                     <a
                        href='https://apps.apple.com/us/app/sam-note-sticky-remind-color/id6445824669'
                        style={{
                           color: '#000',
                           border: '1px solid',
                           borderColor: '#000',
                           padding: '10px 15px',
                           height: '65px',
                           width: '235px',
                           borderRadius: '5px',
                           display: 'flex',
                           textDecoration: 'none',
                           justifyContent: 'space-evenly',
                           textTransform: 'none',
                           alignItems: 'center',
                           fontSize: '16px',
                        }}
                     >
                        <AppleIcon />
                        <div style={{ textAlign: 'center' }}>
                           <p style={{ margin: 0 }}>Download on the </p>
                           <p style={{ margin: 0 }}>App Store</p>
                        </div>
                     </a>
                  </div>
                  <div>
                     <a
                        href='https://play.google.com/store/apps/details?id=com.thinkdiffai.cloud_note&fbclid=IwY2xjawE_8eZleHRuA2FlbQIxMAABHYHaE1EWM6Iw4ZzcIta8_d6hLRUNJapdVbYO_a18uKUB20nuk851Tb-QEg_aem_ECePGLD4eDM--aBNYVTGoQ'
                        style={{
                           color: '#000',
                           border: '1px solid',
                           borderColor: '#000',
                           padding: '10px 15px',
                           height: '65px',
                           width: '235px',
                           borderRadius: '5px',
                           display: 'flex',
                           textDecoration: 'none',
                           justifyContent: 'space-evenly',
                           textTransform: 'none',
                           alignItems: 'center',
                           fontSize: '16px',
                        }}
                     >
                        <AndroidIcon />
                        <div style={{ textAlign: 'center' }}>
                           <p style={{ margin: 0 }}>Download on the </p>
                           <p style={{ margin: 0 }}>Google Play</p>
                        </div>
                     </a>
                  </div>
               </div>
            </section>
         </main>

         <footer style={{ marginTop: '50px' }}>
            <ul
               style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  padding: '0',
               }}
            >
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a> Contact Us</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Help</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Blog</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Developers</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Term & Conditions</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Privacy</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Press</a>
               </li>
               <li style={{ margin: '0 10px', whiteSpace: 'nowrap', fontSize: '14px' }}>
                  <a>Privacy Notice for California Users</a>
               </li>
            </ul>
            <p style={{ textAlign: 'center', padding: '20px 0' }}>© Automatic</p>
         </footer>
      </Box>
   )
}

export default Home
