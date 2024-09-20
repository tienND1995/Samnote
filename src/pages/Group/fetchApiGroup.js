import axios from 'axios'
import configs from '../../configs/configs.json'

const { API_SERVER_URL } = configs

export const fetchUserChatList = async (userID, socket, typeFilter) => {
 const response = await axios.get(
  `${API_SERVER_URL}/message/list_user_chat1vs1/${userID}`
 )

 if (typeFilter === 'All') {
  response.data.data.map((item) => {
   return socket.emit('join_room', { room: item.idRoom })
  })


  return response.data.data
 }

 if (typeFilter === 'Unread') {
  response.data.data.filter((item) => {
   if (item.is_seen !== 1)
    return socket.emit('join_room', { room: item.idRoom })
  })


  return response.data.data.filter((user) => user.is_seen !== 1)
 }

 if (typeFilter === 'Read') {
  response.data.data.filter((item) => {
   if (item.is_seen !== 0)
    return socket.emit('join_room', { room: item.idRoom })
  })


  return response.data.data.filter((user) => user.is_seen !== 0)
 }
 
}

const isReadMessageGroup = (listUserReaded, userID) => {
 if (listUserReaded.length < 1) return false
 return listUserReaded.some(
  (userReaded) => Number(userReaded.idUser) === userID
 )
}

export const fetchGroupList = async (userID, socket, typeFilter) => {
 try {
  const response = await axios.get(`${API_SERVER_URL}/group/all/${userID}`)

  if (typeFilter === 'All') {
   response.data.data.map((item) =>
    socket.emit('join_room', { room: item.idGroup })
   )

   return response.data.data
  }

  if (typeFilter === 'Unread') {
   response.data.data.filter((item) => {
    if (
     item.listUserReaded === 0 ||
     !isReadMessageGroup(item.listUserReaded, userID)
    ) {
     return socket.emit('join_room', { room: item.idGroup })
    }
   })

   return response.data.data.filter(
    (item) =>
     item.listUserReaded === 0 || !isReadMessageGroup(item.listUserReaded)
   )
  }

  if (typeFilter === 'Read') {
   response.data.data.filter((item) => {
    if (item.listUserReaded > 0 && isReadMessageGroup(item.listUserReaded)) {
     return socket.emit('join_room', { room: item.idGroup })
    }
   })

   return response.data.data.filter((group) =>
    isReadMessageGroup(group.listUserReaded)
   )
  }
 } catch (err) {
  console.error(err)
 }
}

export const fetchAllMemberGroup = async (idGroup) => {
 try {
  const response = await axios.get(
   `https://samnote.mangasocial.online/group/only/${idGroup}`
  )

  return response.data.data.members
 } catch (error) {
  console.log(error)
 }
}
