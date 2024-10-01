import React, { useState, useContext } from 'react'
import { Button, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { getTimeDifference } from '../../../helper'
import { AppContext } from '../../../context'
import api from '../../../api'
import { getCurrentFormattedDateTime } from '../../../helper'

const RightsideContent = ({ lastUsers, allNotePublic, setReload, userID }) => {
 const [payloadData, setPayloadData] = useState('')
 const appContext = useContext(AppContext)
 const { setSnackbar, user } = appContext

 const handleCreateNote = async () => {
  if (payloadData.trim() === '') {
   return
  }
  const payload = {
   type: 'text',
   data: payloadData,
   title: 'Quick notes',
   color: { r: 255, g: 255, b: 255, a: 1 },
   idFolder: null,
   dueAt: getCurrentFormattedDateTime(),
   pinned: false,
   lock: '',
   remindAt: null,
   linkNoteShare: '',
   notePublic: 1,
  }

  console.log('payload', payload) // Check payload structure before sending

  try {
   await api.post(`/notes/${user.id}`, payload)
   setReload((prev) => prev + 1)
   setPayloadData('')
   setSnackbar({
    isOpen: true,
    message: 'Created new note successfully',
    severity: 'success',
   })
  } catch (err) {
   console.error(err)
   setSnackbar({
    isOpen: true,
    message: 'Failed to create note',
    severity: 'error',
   })
  }
 }

 return (
  <div className='rightside col-lg-4 flex flex-column mb-4'>
   <div className='create-note-container w-[100%] h-[450px] bg-[#FFF4BA] rounded-xl p-3'>
    <div className='flex justify-between w-full'>
     <span className='font-[700] text-[#888888] text-3xl'>Quick notes</span>
     <Button
      className='btn-create-quickNotes'
      disabled={user.id != userID}
      variant='contained'
      onClick={handleCreateNote}
     >
      Create
     </Button>
    </div>
    <TextField
     className='p-2 w-full'
     id='standard-multiline-static'
     placeholder='Content'
     multiline
     rows={16}
     variant='standard'
     value={payloadData}
     onChange={(event) => setPayloadData(event.target.value)}
    />
   </div>
   <div className='new-users mt-3 w-[100%] h-[450px] bg-[#fff] rounded-xl'>
    <div className='mx-2 my-2 w-[90%] h-[100%]'>
     <span className='font-[700] text-[#888888] text-xl'>New Users</span>

     {lastUsers.length > 0 ? (
      <>
       <ul className='mt-1 p-0 w-full overflow-hidden'>
        {lastUsers
         .slice(0, 7)
         .map(({ id, linkAvatar, user_name, createAt }) => (
          <li key={`${id}`}>
           <Link
            to={`/profile-other-user/${id}`}
            className='w-full h-[15%] flex justify-between items-center my-1 ml-2 link-dark text-decoration-none'
           >
            <img
             className='w-[40px] h-[40px] rounded-xl object-cover mt-2'
             src={linkAvatar}
             alt='image'
            />
            <span className='truncate-text w-[50%] mr-2'>{user_name}</span>
            <span className='mr-3'>
             {createAt.split(' ').slice(1, 4).join(' ')}
            </span>
           </Link>
          </li>
         ))}
       </ul>
       <p className='text-center'>See more</p>
      </>
     ) : (
      <p className='text-center'>Not found new users</p>
     )}
    </div>
   </div>
   <div className='new-notes mt-3 w-[100%] h-[450px] bg-[#fff] rounded-xl'>
    <div className='mx-2 my-2 w-[95%] h-[100%]'>
     <span className='font-[700] text-[#888888] text-xl'>New Notes</span>
     {allNotePublic.length > 0 ? (
      <>
       <div className='mt-2 w-[95%] ml-2 overflow-hidden'>
        {allNotePublic.slice(0, 8).map((item, index) => (
         <div
          key={`notePublic ${index}`}
          className='w-full h-[15%] flex justify-evenly my-1 ml-2 items-center py-2'
         >
          {/* <img
                                className='w-[40px] h-[40px] rounded-xl object-cover mt-2'
                                src={linkAvatar}
                                alt='image'
                              /> */}
          <span className=' w-[20%] h-[full] truncate-text border-l-4 border-black-200'>
           {item.author}
          </span>
          <span className='w-[55%] break-words'>Create a new public note</span>
          <span className='text-xs break-words w-[12%] whitespace-nowrap'>
           {getTimeDifference(item.update_at, new Date())}
          </span>
         </div>
        ))}
       </div>
       <p className='text-center mt-2'>See more</p>
      </>
     ) : (
      <p className='text-center'>Not found new notes</p>
     )}
    </div>
   </div>
  </div>
 )
}

export default RightsideContent
