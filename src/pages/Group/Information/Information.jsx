import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import avatarDefault from '../../../assets/avatar-default.png'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import GroupsIcon from '@mui/icons-material/Groups'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import ImageIcon from '@mui/icons-material/Image'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'

const Information = ({ idGroup, showInfo, onHide, groupItem }) => {
 const [toggleMemberList, setToggleMemberList] = useState(false)

 const { member } = groupItem

//  useEffect(() => {
//   idGroup && fetchAllMemberGroup(idGroup)
//  }, [idGroup])

//  const fetchAllMemberGroup = async (idGroup) => {
//   try {
//    const response = await axios.get(
//     `https://samnote.mangasocial.online/group/only/${idGroup}`
//    )

//    setMemberList(response.data.data.members)
//   } catch (error) {
//    console.log(error)
//   }
//  }

 return (
  <div
   className={`p-3 position-absolute right-0 top-0 h-full bg-[#dffffe] w-[480px] shadow-md ${
    showInfo ? null : 'hidden'
   }`}
  >
   <div className='text-center position-relative'>
    <button
     className='position-absolute left-0 top-1/2 translate-y-[-50%]'
     onClick={onHide}
    >
     <ArrowBackIosIcon className='text-[25px]' />
    </button>

    <h3 className='text-[30px] font-medium'>Group information</h3>
   </div>

   <div className='position-relative w-max mx-auto my-[60px]'>
    <Link to={'/'}>
     <img
      className='w-[90px] h-[90px] object-cover rounded-[100%]'
      src={groupItem?.linkAvatar}
      alt='avatar'
     />
    </Link>

    <div className='position-absolute bg-[#d9d9d9] w-[30px] h-[30px] rounded-full right-0 bottom-0 flex items-center justify-center'>
     <input
      //   onChange={handleChangeAvatarGroup}
      id='file'
      type='file'
      className='hidden m-0'
      //  disabled={!(infoGroupItem.idOwner === user.id)}
      //   disabled={!isLeaderTeam(infoGroupItem.idOwner)}
     />
     <label htmlFor='file' className='flex'>
      <CameraAltIcon className='text-[20px]' />
     </label>
    </div>
   </div>

   <div className='flex justify-between items-center'>
    <div className='flex gap-2 items-center'>
     <GroupsIcon className='text-[50px]' />

     <h3 className='text-[30px] font-medium'>{`Group members(${member?.length})`}</h3>
    </div>

    <button
     className={`rotate-${toggleMemberList ? '180' : '0'}`}
     onClick={() => setToggleMemberList((prevState) => !prevState)}
     disabled={member?.length < 1}
    >
     <KeyboardArrowDownIcon className='text-[30px]' />
    </button>
   </div>

   <ul
    style={{ scrollbarWidth: 'none' }}
    className={`flex flex-col gap-2 py-[20px] max-h-[30%] overflow-y-auto ${
     toggleMemberList ? null : 'hidden'
    }`}
   >
    {member?.map((item) => (
     <li
      key={item.idMem}
      className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
     >
      <div className='flex gap-2 items-center'>
       <div>
        <img
         onError={(e) => {
          e.target.src = avatarDefault
         }}
         src={item.linkAvatar}
         alt='avatar '
         className='w-[50px] h-[50px] object-cover rounded-[100%]'
        />
       </div>

       <div>
        <h5 className='text-lg font-extrabold capitalize'>{item.userName}</h5>
       </div>
      </div>

      <button
       onClick={() => {
        //   handleDeleteMemberGroup(item.idMember)
       }}
       type='button'
       className='text-red-500 rounded-sm text-decoration-none px-3 py-2 text-xl font-medium'
      >
       <RemoveCircleIcon className='text-[30px]' />
      </button>
     </li>
    ))}
   </ul>

   <div className='flex gap-2'>
    <div>
     <ImageIcon className='text-[50px]' />
    </div>
    <h3 className='text-[30px] font-medium'>Image</h3>
   </div>
  </div>
 )
}

export default Information
