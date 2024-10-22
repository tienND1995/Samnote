import axios from 'axios'
import configs from '../../configs/configs.json'

const { API_SERVER_URL } = configs

export const fetchAllMessageList = async (userID, typeFilter) => {
 const response = await axios.get(
  `${API_SERVER_URL}/message/list_all_message/${userID}`
 )

 if (typeFilter === 'All') {
  return response.data.data
 }

 if (typeFilter === 'Unread') {
  return response.data.data.filter((item) => {
   if (item.type_chat === '1chat1')
    return item.is_seen !== 1 && item.idSend !== userID
   if (item.type_chat === 'chatgroup')
    return !isReadMessageGroup(item.listUserReaded, userID)
  })
 }

 if (typeFilter === 'Read') {
  return response.data.data.filter((item) => {
   if (item.type_chat === '1chat1')
    return item.is_seen !== 0 || item.idSend === userID
   if (item.type_chat === 'chatgroup')
    return isReadMessageGroup(item.listUserReaded, userID)
  })
 }
}

const isReadMessageGroup = (listUserReaded, userID) => {
 if (listUserReaded.length < 1) return false
 return listUserReaded.some(
  (userReaded) => Number(userReaded.idUser) === userID
 )
}
