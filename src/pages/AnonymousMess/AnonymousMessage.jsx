import { Box, Avatar, Typography, Button } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context'
import { NavLink } from 'react-router-dom'
import api from '../../api'

import bg_chat from '../../assets/img-chat-an-danh.jpg'
import SearchUnknowMessage from './SearchUnknowMessage.jsx'
import InputMessage from './InputMessage'

const AnonymousMessage = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [listChatUnknow, setListChatUnknow] = useState([])
 const [activeTab, setActiveTab] = useState('all')
 
 const [showChatBox, setShowChatBox] = useState({ info: [], message: [] })

 const handleGetMessage = async (data) => {
  const payload = {
   idRoom: `${data.idRoom}`,
  }
  try {
   const res = await api.post(`/message/chat-unknown-id?page=1`, payload)
   setShowChatBox((prevState) => ({
    ...prevState,
    message: res.data.data,
   }))
   console.log('res.data.data', res.data.data)
   console.log('check state', showChatBox.message)
  } catch (err) {
   console.log(err)
  }
 }

 useEffect(() => {
  // Kiểm tra xem user có tồn tại và id có hợp lệ hay không
  if (user && user.id) {
   const getListChatUnknow = async () => {
    try {
     const res = await api.get(`/message/list_user_unknown/${user.id}`)
     setListChatUnknow(res.data.data)
    } catch (err) {
     console.error('Error fetching chat list:', err)
    }
   }

   getListChatUnknow()
  } else {
   // Reset danh sách nếu không có user
   setListChatUnknow([])
  }
 }, [user])

 // Hàm lọc danh sách dựa trên tab hiện tại
 const filteredChatList = () => {
  if (activeTab === 'unread') {
   return listChatUnknow.filter((item) => item.unReadCount > 0)
  } else if (activeTab === 'read') {
   return listChatUnknow.filter((item) => item.unReadCount === 0)
  }
  return listChatUnknow // Nếu tab là "all", trả về tất cả tin nhắn
 }

 console.log(showChatBox.info)

 return (
  <Box className='text-white lg:flex bg-[#DFFFFE] w-full'>
   <Box
    className='w-[400px]'
    sx={{
     display: 'flex',
     flexDirection: 'column',
     boxShadow: '2px 0 4px rgba(0, 0, 0, 0.1)',
     alignItems: 'center',
    }}
   >
    <Box className='bg-[#B6F6FF] h-[140px] uppercase text-black w-full pt-[50px] text-center text-4xl font-bold'>
     Chat
    </Box>

    <Box
     className='relative w-[90%]'
     style={{
      margin: '0 10px',
      boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
     }}
    >
     <SearchUnknowMessage />
    </Box>

    {/* Tabs for filtering */}
    <Box className='max-h-[47vh] w-[400px] lg:max-h-[50vh] overflow-auto scrollbar-none text-black font-bold'>
     <div className='flex gap-[10px] justify-evenly my-4'>
      <Button
       className={`${
        activeTab === 'all'
         ? 'bg-black text-white font-bold text-[16px]'
         : 'text-black font-bold text-[16px]'
       }`}
       onClick={() => setActiveTab('all')}
      >
       All
      </Button>

      <Button
       className={
        activeTab === 'unread'
         ? 'bg-black text-white font-bold text-[16px]'
         : 'text-black font-bold text-[16px]'
       }
       onClick={() => setActiveTab('unread')}
      >
       Unread
      </Button>
      <Button
       className={
        activeTab === 'read'
         ? 'bg-black text-white font-bold text-[16px]'
         : 'text-black font-bold text-[16px]'
       }
       onClick={() => setActiveTab('read')}
      >
       Read
      </Button>
     </div>

     {/* Render filtered chat list */}
     {filteredChatList()?.length > 0 ? (
      filteredChatList().map((item) => (
       <NavLink
        to={`/user/incognito`}
        key={item.idMessage}
        className={({ isActive, isPending }) =>
         isPending ? 'pending' : isActive ? 'active' : ''
        }

        style={{
         display: 'flex',
         alignItems: 'center',
         borderRadius: '30px',
         margin: '5px 10px',
         height: '70px',
         color: 'black',
         textDecoration: 'none',
         backgroundColor: '#fff',
         justifyContent: 'space-between',
        }}
        onClick={() => {
         setShowChatBox((prevState) => ({
          ...prevState,
          info: item,
         }))

         handleGetMessage(item)
        }}
       >
        <Box
         sx={{
          display: 'flex',
          alignItems: 'center',
         }}
        >
         <Avatar
          sx={{ width: '60px', height: '60px' }}
          src={item.user.avatar}
         />
         <Box sx={{ marginLeft: '10px', fontWeight: '700' }}>
          {item.user === 'Unknow' ? (
           <span style={{ fontWeight: '700', fontSize: '40px' }}>
            User name
           </span>
          ) : (
           <Typography
            variant='body1'
            sx={{ fontWeight: '700', fontSize: '24px' }}
           >
            {item.user.username}
           </Typography>
          )}
          <Typography
           sx={{
            overflow: 'hidden',
            width: '140px',
            fontSize: '20px',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
           }}
           variant='body2'
          >
           {item.last_text}
          </Typography>
         </Box>
        </Box>
        {item.unReadCount > 0 ? (
         <span className='w-[35px] h-[35px] mr-2 rounded-[100%] bg-[#D9D9D9] flex items-center justify-center text-[#FF0404] text-[20px]'>
          {item.unReadCount}
         </span>
        ) : (
         <svg
          className='w-[30px] h-[30px] mr-2'
          width='19'
          height='14'
          viewBox='0 0 19 14'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
         >
          <path
           d='M6.03809 11.0455L1.53383 6.69202L0 8.16406L6.03809 14L19 1.47204L17.477 0L6.03809 11.0455Z'
           fill='#00FF73'
          />
         </svg>
        )}
       </NavLink>
      ))
     ) : (
      <Typography variant='body2' sx={{ marginTop: '20px' }}>
       No chat messages available.
      </Typography>
     )}
    </Box>
   </Box>

   {showChatBox.info.length !== 0 && (
    <div className='w-full'>
     <div className='w-full h-[140px] '>
      <div className='w-full h-[140px] items-center flex'>
       <Avatar
        sx={{ width: '90px', height: '90px' }}
        src={showChatBox.info?.user.avatar}
       />
       <p className='text-black text-[40px] font-bold'>
        {showChatBox.info?.user.username}
       </p>
      </div>
     </div>
     <div
      className='h-[74vh] lg:h-[75vh]'
      style={{
       width: '100%',
       backgroundImage: `url(${bg_chat})`,
       overflow: 'auto',
       scrollbarWidth: 'none',
       backgroundPosition: 'center center',
       backgroundSize: '200%',
       backgroundRepeat: 'no-repeat',
      }}
     >
      {Array.isArray(showChatBox.message) &&
       showChatBox.message?.map((info, index) => (
        <Box
         key={index}
         sx={{
          marginLeft: '10px',
          display: 'flex',
          alignItems: 'center',
          color: '#000',
          justifyContent:
           info.idReceive !== user.id ? 'flex-end' : 'flex-start',
         }}
        >
         {info.idReceive === user.id ? (
          <>
           <div className='flex items-end h-full'>
            {' '}
            <Avatar
             sx={{
              width: '50px',
              height: '50px',
              margin: '5px',
             }}
             src={showChatBox.info?.user?.avatar}
            />
           </div>
           {info.type === 'text' ? (
            <Box
             sx={{
              backgroundColor: '#fff',
              borderRadius: '10px',
              padding: '5px',
              fontSize: '20px',
              maxWidth: '70%',
             }}
            >
             {info.content}
            </Box>
           ) : info.type === 'image' ? (
            <img src={info.img} alt='image' className='w-[30wh] h-[40vh] m-2' />
           ) : info.type === 'gif' ? (
            <img
             src={info.gif}
             alt='GIF'
             className='max-w-[30wh] max-h-[40vh] m-2'
            />
           ) : null}
          </>
         ) : (
          <>
           {' '}
           {info.type === 'text' ? (
            <Box
             sx={{
              backgroundColor: '#1EC0F2',
              borderRadius: '10px',
              fontSize: '20px',
              padding: '5px',
              margin: '5px 10px',
              maxWidth: '70%',
             }}
            >
             {info.content}
            </Box>
           ) : info.type === 'image' ? (
            <img src={info.img} alt='image' className='w-[30wh] h-[40vh] m-2' />
           ) : info.type === 'gif' ? (
            <img
             src={info.gif}
             alt='GIF'
             className='max-w-[30wh] max-h-[40vh] m-2'
            />
           ) : (
            ''
           )}
          </>
         )}
        </Box>
       ))}
      <div id='lastmessage' />
     </div>

     <InputMessage data={showChatBox.info} />
    </div>
   )}
  </Box>
 )
}

export default AnonymousMessage
