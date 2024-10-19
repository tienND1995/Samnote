import { useContext, useEffect, useState } from 'react'
import './Group.css'

import io from 'socket.io-client'

import configs from '../../configs/configs.json'
import { AppContext } from '../../context'
import { fetchAllMessageList } from './fetchApiGroup'

import ChatList from './ChatList/ChatList'
import MainMessage from './MainMessage/MainMessage'

const { API_SERVER_URL } = configs

const Group = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 const [socket, setSocket] = useState(null)

 // var data message
 const [allMessageList, setAllMessageList] = useState([])
 const [typeFilterChat, setTypeFilterChat] = useState(
  window.localStorage.getItem('typeFilterChat') || 'All'
 )

 const handleChangeTypeFilterChat = (type) => setTypeFilterChat(type)

 //______________________________________
 const getAllMessageList = async () => {
  const typeFilterLocal = window.localStorage.getItem('typeFilterChat')
  const messageList = await fetchAllMessageList(
   user.id,
   socket,
   typeFilterLocal || typeFilterChat
  )
  setAllMessageList(messageList)
 }

 useEffect(() => {
  const socketIo = io(API_SERVER_URL)

  socketIo.on('connect', () => {
   setSocket(socketIo)
   console.log('Connected')
  })
 }, [])

 useEffect(() => {
  if (!socket) return
  getAllMessageList()
 }, [user?.id, socket, typeFilterChat])

 const propsChatList = {
  userID: user?.id,
  socket,
  typeFilterChat,
  allMessageList,

  getAllMessageList,
  onChangeTypeFilter: handleChangeTypeFilterChat,
 }

 const propsMainMessage = {
  socket,
  typeFilterChat,
  getAllMessageList,
 }

 return (
  <div className='flex flex-grow-1'>
   <div className='col col-md-4 col-xl-3 group-sidebar flex flex-col px-0'>
    <h3 className='text-center xl:py-[60px] py-[30px] px-3 font-bold hidden md:block'>
     Chat
    </h3>

    <ChatList data={propsChatList} />
   </div>

   <MainMessage {...propsMainMessage} />
  </div>
 )
}

export default Group
