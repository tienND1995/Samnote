import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import avatarDefault from '../../../assets/avatar-default.png'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import GroupsIcon from '@mui/icons-material/Groups'
import ImageIcon from '@mui/icons-material/Image'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { fetchApiSamenote } from '../../../utils/fetchApiSamnote'

const Information = (props) => {
 const { showInfo, onHide, infoMessageGroup } = props.data
 const [toggleMemberList, setToggleMemberList] = useState(false)

 const [imageList, setImageList] = useState([])
 const informationRef = useRef()
 const btnBackRef = useRef()

 useEffect(() => {
  infoMessageGroup.idGroup &&
   fetchApiSamenote(
    'get',
    `/group/allphoto/${infoMessageGroup.idGroup}`
    // {},
    // { page: 1 }
   ).then((data) => {
    setImageList(data?.data || [])
   })
 }, [infoMessageGroup.idGroup])

 // hande click outside element
 useEffect(() => {
  const handleClickOutside = (element) => {
   if (!informationRef.current) return

   const settingBtnItem = document.querySelector('#show-information')

   if (
    showInfo &&
    !informationRef.current?.contains(element) &&
    !settingBtnItem.contains(element)
   ) {
    onHide()
   }
  }

  document.body.addEventListener('click', (e) => {
   handleClickOutside(e.target)
  })

  return document.body.removeEventListener('click', (e) => {
   handleClickOutside(e.target)
  })
 }, [informationRef, btnBackRef, showInfo])

 return (
  <div
   ref={informationRef}
   style={{
    transition: 'all ease-in-out .2s',
    boxShadow: '-1px 2px 2px 2px #00000040 ',
   }}
   className={`p-3 position-absolute w-[480px] top-0 h-full bg-[#dffffe] overflow-hidden flex flex-col max-w-[100%] ${
    showInfo
     ? 'opacity-100 visible right-0'
     : 'opacity-0 invisible -right-[200px]'
   }`}
  >
   <div className='text-center position-relative'>
    <button
     className='position-absolute left-0 top-1/2 translate-y-[-50%]'
     onClick={onHide}
     ref={btnBackRef}
    >
     <ArrowBackIosIcon className='text-xl md:text-[25px]' />
    </button>

    <h3 className='text-2xl md:text-[30px] font-semibold md:font-medium'>
     Group information
    </h3>
   </div>

   <div className='position-relative w-max mx-auto md:my-[60px] my-[20px]'>
    <img
     className='w-[90px] h-[90px] object-cover rounded-[100%]'
     src={infoMessageGroup?.avatar}
     alt='avatar'
    />
   </div>

   <div className='flex justify-between items-center'>
    <div className='flex gap-2 items-center'>
     <GroupsIcon className='text-4xl md:text-[50px]' />

     <h3 className='text-2xl md:text-[30px] font-medium'>{`Group members(${infoMessageGroup.members?.length})`}</h3>
    </div>

    <button
     style={{
      transform: `rotate(${toggleMemberList ? 180 : 0}deg)`,
     }}
     onClick={() => setToggleMemberList((prevState) => !prevState)}
     disabled={infoMessageGroup.members?.length < 1}
    >
     <KeyboardArrowDownIcon className='text-3xl md:text-[50px]' />
    </button>
   </div>

   <ul
    className={`flex flex-col gap-2 my-[20px] max-h-[30%] overflow-y-auto style-scrollbar-y style-scrollbar-y-sm ${
     toggleMemberList ? null : 'hidden'
    }`}
   >
    {infoMessageGroup.members?.map((item) => (
     <li
      key={item.idMember}
      className='flex justify-between bg-white items-center rounded-[40px] cursor-pointer'
     >
      <NavLink
       className='flex gap-2 items-center w-full'
       to={`/profile/${item.idUser}`}
      >
       <div>
        <img
         onError={(e) => {
          e.target.src = avatarDefault
         }}
         src={item.avt}
         alt='avatar '
         className='w-[50px] h-[50px] object-cover rounded-[100%]'
        />
       </div>

       <div>
        <h5 className='text-lg font-extrabold capitalize'>{item.name}</h5>
       </div>
      </NavLink>
     </li>
    ))}
   </ul>

   <div className='flex gap-2'>
    <div>
     <ImageIcon className='text-4xl md:text-[50px]' />
    </div>
    <h3 className='text-2xl md:text-[30px] font-medium'>Image</h3>
   </div>

   <ul className='my-3 grid grid-cols-3 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
    {imageList?.map((image) => {
     return (
      <li key={image.id} className='p-1'>
       <img
        className='w-full object-cover rounded-md border border-gray-400 aspect-[4/3]'
        src={image.image}
        alt=''
       />
      </li>
     )
    })}
   </ul>
  </div>
 )
}

export default Information
