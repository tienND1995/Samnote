import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Modal from 'react-bootstrap/Modal'
import Swal from 'sweetalert2'
import TextTruncate from 'react-text-truncate'

import avatarDefault from '../../../assets/avatar-default.png'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InfoIcon from '@mui/icons-material/Info'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { fetchApiSamenote } from '../../../utils/fetchApiSamnote'
import ModalSearchUserAddGroup from './components/ModalSearchUserAddGroup'

const SettingGroup = (props) => {
 const {
  userID,
  infoMessageGroup,
  typeMessage,

  setShowInforMation,
  getAllMessageList,
  getInfoMesssageGroup,
 } = props.data

 const navigate = useNavigate()

 const [showSettingGroup, setShowSettingGroup] = useState(false)
 const [typeButtonGroup, setTypeButtonGroup] = useState(null)

 const ulElementSettingGroupRef = useRef()
 const showSettingGroupRef = useRef()

 const [showModalMemberList, setShowModalMemberList] = useState(false)

 const isLeaderTeam = (idOwner) => {
  return idOwner === userID
 }

 const handleShowSettingsGroup = () => {
  if (typeMessage === 'group') {
   setShowSettingGroup((prevState) => !prevState)
   setTypeButtonGroup(null)
  }

  if (typeMessage === 'chat') {
   console.log('chat')
  }
  return null
 }

 const handleQuitGroup = () => {
  setTypeButtonGroup('quit')

  const memberQuit = infoMessageGroup.members.find(
   (member) => member.idUser === userID
  )

  Swal.fire({
   title: 'Are you sure?',
   text: 'Do you want to leave the group?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes',
  }).then((result) => {
   if (result.isConfirmed) {
    fetchApiSamenote('delete', `/group/quit/${memberQuit.idMember}`).then(
     () => {
      // update members and chat list
      getAllMessageList && getAllMessageList()
      getInfoMesssageGroup(infoMessageGroup.idGroup)
      navigate('/messages')
     }
    )

    Swal.fire({
     title: 'Quitted!',
     text: 'You have left the group.',
     icon: 'success',
    })
   }
  })
 }

 const handleDeleteMemberGroup = (idMember) => {
  if (!idMember) return

  Swal.fire({
   title: 'Are you sure?',
   text: 'Do you want to delete this member?',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes',
  }).then((result) => {
   if (result.isConfirmed) {
    fetchApiSamenote('delete', `/group/quit/${idMember}`).then(() => {
     // hidden modalMembers
     if (infoMessageGroup.members?.length === 2) setShowModalMemberList(false)

     // update members and chat list
     getAllMessageList && getAllMessageList()
     getInfoMesssageGroup(infoMessageGroup.idGroup)
    })
   }
  })
 }

 const handleHideModalMembers = () => {
  setShowModalMemberList(false)
 }

 const handleShowAllMembers = () => {
  setShowModalMemberList(true)
  setTypeButtonGroup('delete')
 }

 const handleShowInformation = () => {
  setShowInforMation(true)
  setTypeButtonGroup(null)
  setShowSettingGroup(false)
 }

 const [showModalSearch, setShowModalSearch] = useState(false)

 // handle click outside
 useEffect(() => {
  if (!ulElementSettingGroupRef.current || !showSettingGroupRef.current) return

  const handleClickOutside = (element) => {
   if (
    !ulElementSettingGroupRef?.current?.contains(element) &&
    !showSettingGroupRef.current?.contains(element)
   ) {
    setShowSettingGroup(false)
    setTypeButtonGroup(null)
   }
  }

  document.body.addEventListener('click', (e) => {
   handleClickOutside(e.target)
  })

  return document.body.removeEventListener('click', (e) => {
   handleClickOutside(e.target)
  })
 }, [ulElementSettingGroupRef, showSettingGroupRef])

 return (
  <div className='position-relative setting-group' title='setting group'>
   <Modal
    dialogClassName='modal-members'
    show={showModalMemberList}
    onHide={() => setShowModalMemberList(false)}
   >
    <div className='p-3 '>
     <h3 className='text-[25px] font-medium'>All member</h3>

     <ul className='flex flex-col gap-2 py-[20px] max-h-[60vh] overflow-y-auto'>
      {infoMessageGroup.members?.map((user) =>
       user.idUser === userID ? null : (
        <li
         key={user.idMember}
         className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
        >
         <div className='flex gap-2 items-center'>
          <div>
           <img
            onError={(e) => {
             e.target.src = avatarDefault
            }}
            src={user.avt}
            alt='avatar '
            className='w-[50px] h-[50px] object-cover rounded-[100%]'
           />
          </div>

          <div>
           <TextTruncate
            line={1}
            element='h6'
            truncateText='…'
            text={user.name}
            containerClassName='text-lg font-extrabold capitalize break-all'
           />
          </div>
         </div>

         <button
          onClick={() => {
           handleDeleteMemberGroup(user.idMember)
          }}
          type='button'
          className='text-red-500 rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
         >
          <RemoveCircleIcon className='text-[30px]' />
         </button>
        </li>
       )
      )}
     </ul>

     <div className='text-right'>
      <button
       className='text-[25px] font-medium text-[#ff2d2d]'
       type='button'
       onClick={handleHideModalMembers}
      >
       Cancel
      </button>
     </div>
    </div>
   </Modal>

   <ModalSearchUserAddGroup
    idGroup={infoMessageGroup.idGroup}
    setShowModalSearch={setShowModalSearch}
    showModalSearch={showModalSearch}
    onGetInfoMesssageGroup={getInfoMesssageGroup}
   />

   <button ref={showSettingGroupRef} onClick={handleShowSettingsGroup}>
    <MoreVertIcon className='xl:text-[40px] text-[35px]' />
   </button>

   <ul
    className={`bg-black p-2 position-absolute top-100 right-[100%] z-10 w-max ${
     showSettingGroup ? null : 'hidden'
    }`}
    ref={ulElementSettingGroupRef}
   >
    <li>
     <button
      className={`text-[16px] md:text-xl lg:text-[25px] flex items-center ${
       typeButtonGroup === 'quit' ? 'active' : null
      }`}
      onClick={handleQuitGroup}
     >
      <LogoutIcon className='me-2 text-[20px] md:text-[25px] lg:text-[30px]' />{' '}
      Quit group
     </button>
    </li>

    <li>
     <button
      className={`text-[16px] md:text-xl lg:text-[25px] flex items-center ${
       typeButtonGroup === 'add' ? 'active' : null
      }`}
      onClick={() => setShowModalSearch(true)}
     >
      <AddCircleOutlineIcon className='me-2 text-[20px] md:text-[25px] lg:text-[30px]' />{' '}
      Add member
     </button>
    </li>

    {isLeaderTeam(infoMessageGroup?.idOwner) && (
     <li>
      <button
       className={`text-[16px] md:text-xl lg:text-[25px] flex items-center ${
        typeButtonGroup === 'delete' ? 'active' : null
       }`}
       onClick={handleShowAllMembers}
      >
       <HighlightOffIcon className='me-2 text-[20px] md:text-[25px] lg:text-[30px]' />{' '}
       Delete member
      </button>
     </li>
    )}

    <li>
     <button
      className={`text-[16px] md:text-xl lg:text-[25px] flex items-center ${
       typeButtonGroup === 'add' ? 'active' : null
      }`}
      onClick={handleShowInformation}
      id='show-information'
     >
      <InfoIcon className='me-2 text-[20px] md:text-[25px] lg:text-[30px]' />
      Information
     </button>
    </li>
   </ul>
  </div>
 )
}

export default SettingGroup
