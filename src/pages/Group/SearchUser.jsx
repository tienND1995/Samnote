import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import avatarDefault from '../../assets/avatar-default.png'

const SearchUser = ({
 showModalSearch,
 searchUserFormName,
 setShowModalSearch,
 idGroup,
 userID,
 socket,
 clickUserSearch,
}) => {
 const [searchUserName, setSearchUserName] = useState('')
 const [searchUserResult, setSearchUserResult] = useState([])
 const [messageNotifi, setMessageNotifi] = useState('')

 const { getMessageList, resetGroup, setInfoOtherUser, setFormName } =
  clickUserSearch

 const roomSplit = (idUser, idOther) =>
  idUser > idOther ? `${idOther}#${idUser}` : `${idUser}#${idOther}`

 const postRelation = (userID, otherUserID) => {
  fetchApiSamenote('post', `/chatblock/${userID}`, {
   idReceive: otherUserID,
  })
 }

 const handleSubmitSearchUser = (e) => {
  e.preventDefault()
  if (
   searchUserName.trim().split(' ').length !== 1 ||
   searchUserName.trim() === ''
  )
   return

  fetchApiSamenote('post', '/group/search_user_by_word', {
   start_name: searchUserName,
  })
   .then((response) => {
    setSearchUserResult(response.data || [])
    setMessageNotifi(response?.data ? '' : 'Not found')
   })
   .catch((error) => console.log(error))
 }

 const handleClickUserSearch = (otherUser) => {
  if (!otherUser) return
  const newInfoOtherUser = {
   id: otherUser.idUser,
   Avarta: otherUser.linkAvatar,
   name: otherUser.userName,
  }

  const roomID = roomSplit(userID, otherUser.idUser)
  socket.emit('join_room', { room: roomID })

  setFormName('chat')
  setInfoOtherUser(newInfoOtherUser)
  resetGroup()

  postRelation(userID, otherUser.idUser)
  getMessageList(userID, otherUser.idUser)

  handleHideModalSearch()
 }

 const handleHideModalSearch = (e) => {
  setSearchUserName('')
  setSearchUserResult([])
  setMessageNotifi('')
  setShowModalSearch(false)
 }
 const handleChangeSearchUser = (e) => {
  setSearchUserName(e.target.value)
 }

 const handleAddUserSearch = (userId) => {
  const idMemberList = [userId]
  if (!idMemberList || !idGroup) return

  // postMembersGroup(idMemberList, idGroup)

  console.log(idMemberList, idGroup)
 }

 //  const postMembersGroup = async (idMemberList, idGroup) => {
 //   try {
 //    const response = await axios.post(`${API_SERVER_URL}/group/add/${idGroup}`, {
 //     idMembers: idMemberList,
 //    })

 //    handleHideModalSearch()
 //    const groupMemberList = await fetchAllMemberGroup(infoGroupItem.idGroup)
 //    setGroupMemberList(groupMemberList)

 //    setSnackbar({
 //     isOpen: true,
 //     message: `Add members successfully!`,
 //     severity: 'success',
 //    })
 //   } catch (error) {
 //    console.log(error)
 //   }
 //  }

 return (
  <Modal show={showModalSearch} centered={true} onHide={handleHideModalSearch}>
   <div className='p-3'>
    <h3 className='text-[25px] font-bold'>
     {searchUserFormName === 'chat' ? 'Search user' : 'Add member'}
    </h3>

    <form
     onSubmit={handleSubmitSearchUser}
     className='flex gap-2 my-3 items-center'
    >
     <div className='border border-black rounded-sm p-2 w-100'>
      <input
       className='w-100 text-[25px]'
       type='text'
       placeholder='User name'
       onChange={handleChangeSearchUser}
       value={searchUserName}
      />
     </div>

     <button
      className='bg-black h-max text-white text-[20px] px-3 py-1 rounded-md'
      type='submit'
     >
      Search
     </button>
    </form>

    <ul className='flex flex-col gap-2 max-h-[70vh] overflow-y-auto style-scrollbar-y style-scrollbar-y-md pe-2'>
     {searchUserResult?.map((user) => (
      <li
       key={user.idUser}
       className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
      >
       <div className='flex gap-2 items-center'>
        <div>
         <img
          onError={(e) => {
           e.target.src = avatarDefault
          }}
          src={user.linkAvatar}
          alt='avatar '
          className='w-[50px] h-[50px] object-cover rounded-[100%]'
         />
        </div>

        <div>
         <h5 className='text-lg font-extrabold capitalize'>{user.userName}</h5>
        </div>
       </div>

       {searchUserFormName === 'chat' && (
        <button
         onClick={() => handleClickUserSearch(user)}
         type='button'
         className='bg-[#F56852] text-white rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
        >
         Chat
        </button>
       )}

       {searchUserFormName === 'group' && (
        <button
         onClick={() => handleAddUserSearch(user.idUser)}
         type='button'
         className='bg-black text-white rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
        >
         Add
        </button>
       )}
      </li>
     ))}

     {messageNotifi.trim() !== '' && (
      <li className='font-bold text-[#ff2d2d]'>{messageNotifi} !</li>
     )}
    </ul>

    <div className='text-right'>
     <button
      className='text-[25px] font-medium text-[#ff2d2d] mt-3'
      type='button'
      onClick={handleHideModalSearch}
     >
      Cancel
     </button>
    </div>
   </div>
  </Modal>
 )
}

export default SearchUser
