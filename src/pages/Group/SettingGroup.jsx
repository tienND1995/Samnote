import React, { useRef, useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'

import avatarDefault from '../../assets/avatar-default.png'
import { fetchAllMemberGroup } from './fetchApiGroup'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import LogoutIcon from '@mui/icons-material/Logout'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import InfoIcon from '@mui/icons-material/Info'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const SettingGroup = (props) => {
 const {
  userID,
  onShowModalSearch,
  setShowInforMation,
  groupItem,
  formName,
  groupMemberList,
  setGroupMemberList,
  getAllMessageList,
 } = props.data

 const [showSettingGroup, setShowSettingGroup] = useState(false)
 const [typeButtonGroup, setTypeButtonGroup] = useState(null)

 const ulElementSettingGroupRef = useRef()
 const showSettingGroupRef = useRef()

 const [showModalMemberList, setShowModalMemberList] = useState(false)

 const isLeaderTeam = (idOwner) => {
  return idOwner === userID
 }

 const handleShowSettingsGroup = () => {
  if (formName === 'group') {
   setShowSettingGroup((prevState) => !prevState)
   setTypeButtonGroup(null)
  }

  if (formName === 'chat') {
   console.log('chat')
  }
  return null
 }

 const fetchQuitGroup = (idMem) => {
  fetchApiSamenote('delete', `/group/quit/${idMem}`)
   .then(() => {
    fetchAllMemberGroup(groupItem.idGroup).then((data) =>
     setGroupMemberList(data)
    )

    getAllMessageList()
   })
   .catch((err) => console.error(err))
 }

 const handleQuitGroup = () => {
  setTypeButtonGroup('quit')

  const memberQuit = groupItem.member.find((member) => member.idUser === userID)

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
    fetchQuitGroup(memberQuit.idMem)
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
    fetchQuitGroup(idMember)
    Swal.fire({
     title: 'Delete!',
     text: 'This member has been removed from the group.',
     icon: 'success',
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
      {groupMemberList?.map((user) => (
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
          <h5 className='text-lg font-extrabold capitalize'>{user.name}</h5>
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
      ))}
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

   <button ref={showSettingGroupRef} onClick={handleShowSettingsGroup}>
    <MoreVertIcon className='text-[40px]' />
   </button>

   <ul
    className={`bg-black p-2 position-absolute top-100 right-[100%] z-10 w-max ${
     showSettingGroup ? null : 'hidden'
    }`}
    ref={ulElementSettingGroupRef}
   >
    <li>
     <button
      className={`text-[25px] flex items-center ${
       typeButtonGroup === 'quit' ? 'active' : null
      }`}
      onClick={handleQuitGroup}
     >
      <LogoutIcon className='me-2 text-[30px]' /> Quit group
     </button>
    </li>

    <li>
     <button
      className={`text-[25px] flex items-center ${
       typeButtonGroup === 'add' ? 'active' : null
      }`}
      onClick={onShowModalSearch}
     >
      <AddCircleOutlineIcon className='me-2 text-[30px]' /> Add member
     </button>
    </li>

    {isLeaderTeam(groupItem?.idOwner) && (
     <li>
      <button
       className={`text-[25px] flex items-center ${
        typeButtonGroup === 'delete' ? 'active' : null
       }`}
       onClick={handleShowAllMembers}
      >
       <HighlightOffIcon className='me-2 text-[30px]' /> Delete member
      </button>
     </li>
    )}

    <li>
     <button
      className={`text-[25px] flex items-center ${
       typeButtonGroup === 'add' ? 'active' : null
      }`}
      onClick={handleShowInformation}
      id='show-information'
     >
      <InfoIcon className='me-2 text-[30px]' />
      Information
     </button>
    </li>
   </ul>
  </div>
 )
}

export default SettingGroup
