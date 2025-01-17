import { useEffect, useRef, useState } from 'react'

import { fetchApiSamenote } from '../../../../utils/fetchApiSamnote'

const FormNameGroup = ({
 onGetAllMessageList,
 infoMessageGroup,
 setInfoMessageGroup,
 userID,
}) => {
 const [valueGroupName, setValueGroupName] = useState('')
 const [disableGroupName, setDisableGroupName] = useState(true)
 const inputGroupNameRef = useRef()
 const formGroupNameRef = useRef()
 const buttonClickEditNameGroup = useRef()

 const updateNameGroup = async (idGroup, newName) => {
  fetchApiSamenote('patch', `/group/update/${idGroup}`, {
   groupName: newName,
  }).then(() => {
   setDisableGroupName(true)
   setInfoMessageGroup((prev) => ({ ...prev, name: newName }))
   onGetAllMessageList && onGetAllMessageList()
  })
 }

 const handleChangeNameGroup = (e) => {
  setValueGroupName(e.target.value)
 }

 const handleSubmitFormNameGroup = (e) => {
  e.preventDefault()
  if (!infoMessageGroup.idGroup) return

  if (
   valueGroupName.trim() !== '' &&
   valueGroupName.trim() !== infoMessageGroup.name
  ) {
   updateNameGroup(infoMessageGroup.idGroup, valueGroupName)
  }
 }

 const isLeaderTeam = (idOwner) => {
  return idOwner === userID
 }

 useEffect(() => {
  if (infoMessageGroup.name.trim() === '') return
  setValueGroupName(infoMessageGroup.name)
 }, [infoMessageGroup])

 // hande click outside element
 useEffect(() => {
  const handleClickOutside = (element) => {
   if (
    !formGroupNameRef.current ||
    !inputGroupNameRef.current ||
    !buttonClickEditNameGroup.current ||
    !disableGroupName ||
    valueGroupName.trim() === ''
   )
    return

   if (
    !formGroupNameRef.current?.contains(element) &&
    !inputGroupNameRef.current.disabled &&
    !buttonClickEditNameGroup.current?.contains(element)
   ) {
    setDisableGroupName(true)
    setValueGroupName(infoMessageGroup.name)
   }
  }

  document.body.addEventListener('click', (e) => {
   handleClickOutside(e.target)
  })

  return document.body.removeEventListener('click', (e) => {
   handleClickOutside(e.target)
  })
 }, [
  formGroupNameRef,
  inputGroupNameRef,
  buttonClickEditNameGroup,
  disableGroupName,
  valueGroupName,
 ])

 return (
  <form
   onSubmit={handleSubmitFormNameGroup}
   className='flex items-center'
   ref={formGroupNameRef}
  >
   <div>
    <input
     disabled={disableGroupName}
     type='text'
     size={valueGroupName?.length}
     value={valueGroupName}
     onChange={handleChangeNameGroup}
     ref={inputGroupNameRef}
     autoFocus={true}
     className={`px-2 py-1 rounded-md ${
      disableGroupName ? '' : 'bg-[#252f31] text-white'
     }`}
    />
   </div>

   {isLeaderTeam(infoMessageGroup.idOwner) && (
    <button
     onClick={(e) => {
      return disableGroupName
       ? setDisableGroupName(false)
       : handleSubmitFormNameGroup(e)
     }}
     ref={buttonClickEditNameGroup}
     title={disableGroupName ? 'Edit name' : 'Save name'}
     type='button'
     disabled={valueGroupName === infoMessageGroup.name && !disableGroupName}
     className={
      valueGroupName?.trim() === infoMessageGroup.name && !disableGroupName
       ? 'cursor-not-allowed text-[#d1deeb]'
       : disableGroupName
       ? ''
       : 'text-[#1976d2]'
     }
    >
     <svg
      className='xl:size-[40px] size-[30px]'
      viewBox='0 0 40 40'
      fill={
       valueGroupName.trim() === infoMessageGroup?.name && !disableGroupName
        ? '#d1deeb'
        : disableGroupName
        ? ''
        : '#1976d2'
      }
      xmlns='http://www.w3.org/2000/svg'
     >
      <g clipPath='url(#clip0_373_1556)'>
       <path d='M31.111 33.3337H6.66656V8.88921H21.3554L23.5777 6.66699H6.66656C6.07719 6.66699 5.51196 6.90112 5.09521 7.31787C4.67846 7.73461 4.44434 8.29984 4.44434 8.88921V33.3337C4.44434 33.923 4.67846 34.4883 5.09521 34.905C5.51196 35.3218 6.07719 35.5559 6.66656 35.5559H31.111C31.7004 35.5559 32.2656 35.3218 32.6824 34.905C33.0991 34.4883 33.3332 33.923 33.3332 33.3337V16.667L31.111 18.8892V33.3337Z' />
       <path d='M37.2555 6.48888L33.511 2.74444C33.3449 2.5778 33.1474 2.4456 32.9301 2.35539C32.7127 2.26518 32.4797 2.21875 32.2444 2.21875C32.009 2.21875 31.776 2.26518 31.5587 2.35539C31.3413 2.4456 31.1439 2.5778 30.9777 2.74444L15.7444 18.0667L14.511 23.4111C14.4585 23.6702 14.464 23.9377 14.5272 24.1943C14.5904 24.451 14.7097 24.6905 14.8765 24.8956C15.0433 25.1006 15.2535 25.2662 15.4919 25.3803C15.7304 25.4944 15.9911 25.5543 16.2555 25.5555C16.3921 25.5705 16.53 25.5705 16.6666 25.5555L22.0555 24.3667L37.2555 9.02221C37.4221 8.85604 37.5543 8.65861 37.6445 8.44126C37.7347 8.2239 37.7812 7.99088 37.7812 7.75555C37.7812 7.52022 37.7347 7.28719 37.6445 7.06984C37.5543 6.85248 37.4221 6.65506 37.2555 6.48888ZM20.8999 22.3111L16.8333 23.2111L17.7777 19.1778L29.2444 7.63333L32.3777 10.7667L20.8999 22.3111ZM33.6333 9.5111L30.4999 6.37777L32.2221 4.62221L35.3777 7.77777L33.6333 9.5111Z' />
      </g>
      <defs>
       <clipPath id='clip0_373_1556'>
        <rect width='40' height='40' fill='white' />
       </clipPath>
      </defs>
     </svg>
    </button>
   )}
  </form>
 )
}

export default FormNameGroup
