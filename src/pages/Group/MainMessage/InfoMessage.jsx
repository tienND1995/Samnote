import CameraAltIcon from '@mui/icons-material/CameraAlt'
import { Link } from 'react-router-dom'

import { fetchApiSamenote } from '../../../utils/fetchApiSamnote'
import FormNameGroup from './components/FormNameGroup'

import avatarDefault from '../../../assets/avatar-default.png'

const InfoMessage = ({
 typeMessage,
 userID,

 onGetAllMessageList,
 infoMessageGroup,
 setInfoMessageGroup,
 infoMessageChat,
}) => {
 const updateAvatarGroup = async (idGroup, newAvatar) => {
  fetchApiSamenote('patch', `/group/update/${idGroup}`, {
   linkAvatar: newAvatar,
  }).then((response) => {
   onGetAllMessageList()

   // render new avatar
   setTimeout(() => {
    const ulElement = document.querySelector('#list-chat')
    const liElementActive = ulElement.querySelector('li.active')

    liElementActive.click()
   }, 300)
  })
 }

 const handleChangeAvatarGroup = async (e) => {
  if (!infoMessageGroup.idGroup) return

  const reader = new FileReader()
  reader.readAsDataURL(e.target.files[0])
  reader.onload = () => {
   // @ts-ignore
   const imageBase64 = reader.result.split(',')[1]
   updateAvatarGroup(infoMessageGroup.idGroup, imageBase64)
  }

  e.target.value = null
 }

 const isLeaderTeam = (idOwner) => {
  return idOwner === userID
 }

 return (
  <div className='flex gap-2 items-center'>
   <div className='position-relative'>
    <Link to={infoMessageChat.id && `/profile/${infoMessageChat.id}`}>
     <img
      className='xl:size-[90px] size-[60px] object-cover rounded-[100%]'
      src={infoMessageGroup.avatar || infoMessageChat.avatar || avatarDefault}
      alt='avatar'
     />
    </Link>

    {typeMessage === 'group' && (
     <div className='position-absolute bg-[#d9d9d9] w-[30px] h-[30px] rounded-full right-0 bottom-0 flex items-center justify-center'>
      <input
       onChange={handleChangeAvatarGroup}
       id='file-avatar-group'
       type='file'
       className='hidden m-0'
       disabled={!isLeaderTeam(infoMessageGroup.idOwner)}
      />
      <label htmlFor='file-avatar-group' className='flex cursor-pointer'>
       <CameraAltIcon className='text-[20px]' />
      </label>
     </div>
    )}
   </div>
   {typeMessage === 'chat' && (
    <h5 className='xl:text-xl text-lg capitalize'>{infoMessageChat.name}</h5>
   )}

   {!typeMessage && (
    <h5 className='xl:text-xl text-lg capitalize'>Anonymous chatter</h5>
   )}

   {typeMessage === 'group' && (
    <FormNameGroup
     onGetAllMessageList={onGetAllMessageList}
     infoMessageGroup={infoMessageGroup}
     setInfoMessageGroup={setInfoMessageGroup}
     userID={userID}
    />
   )}
  </div>
 )
}

export default InfoMessage
