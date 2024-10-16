import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'

import { AppContext } from '../../context'

import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import NoteCard from '../../share/NoteCard'

const Dustbin = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [dustbinNotes, setDustbinNotes] = useState([])

 const { state } = useLocation()

 console.log('state', state)

 useEffect(() => {
  if (state || user) {
   fetchApiSamenote('get', `/trash/${user?.id}`).then((data) => {
    setDustbinNotes(data.notes)
   })
  }
 }, [user, state])

 return (
  <div className='flex flex-col flex-grow-1 px-4 py-3 bg-[#181A1B] text-white'>
   <div className='flex gap-1 justify-center items-center'>
    <h3 className='text-4xl font-bold'>Recycle bin</h3>
    <span>
     <DeleteIcon className='text-4xl' />
    </span>
   </div>

   <div className='mx-auto mt-5'>
    <div className='flex px-3 gap-2 max-w-[400px] items-center h-[40px] rounded-[40px] text-black bg-white'>
     <span>
      <SearchIcon />
     </span>

     <div className='w-full'>
      <input className='w-full' type='Search note' placeholder='Search note' />
     </div>
    </div>

    <h5 className='mt-2 text-[#FF2323] text-3xl'>Auto-delete after 30 days</h5>
   </div>

   <ul className='grid grid-cols-2 my-4 gap-3 flex-grow-1 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
    {dustbinNotes?.map((note) => (
     <NoteCard
      type='delete'
      note={note}
      noteList={dustbinNotes}
      key={note.idNote}
     />
    ))}
   </ul>
  </div>
 )
}

export default Dustbin
