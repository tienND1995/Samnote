import { useEffect, useState } from 'react'

import { fetchNoteList } from '../fetchApiEditNote'

import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import NoteCard from '../../../share/NoteCard'
import { debounce } from '../../../utils/utils'
import PaginationNote from '../../../share/PaginationNote'

const NoteList = ({
 noteList,
 userID,
 onChangeNoteList,
 updateNotes,
 paginate,
}) => {
 const [noteListInitial, setNoteListInitial] = useState([])

 useEffect(() => {
  const getNoteListInitial = async (userID) => {
   const noteListInit = await fetchNoteList(userID)
   setNoteListInitial(noteListInit)
  }

  userID && getNoteListInitial(userID)
 }, [userID])

 const handleChangeSearchNote = async (e) => {
  const textSearch = e.target.value
  if (textSearch.trim() === '') {
   return onChangeNoteList(noteListInitial)
  }

  try {
   const response = await axios.get(
    `https://samnote.mangasocial.online/notes_search_user/${userID}/${textSearch}`
   )

   const data = response.data.search_note
   const filterNoteList = noteListInitial.filter((note) =>
    data.some((item) => note.idNote === item.idNote)
   )

   onChangeNoteList(filterNoteList)
  } catch (error) {
   console.error(error)
  }
 }

 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <div className='flex items-center justify-between'>
    <div
     style={{ boxShadow: '4px 8px 10px 0px #00000073' }}
     className='bg-white rounded-3xl w-1/2 flex items-center px-3 py-[5px] gap-2'
    >
     <SearchIcon className='md:text-3xl text-2xl' />
     <input
      onChange={debounce(handleChangeSearchNote, 1000)}
      className='w-full md:text-2xl text-xl'
      type='text'
      placeholder='Search note'
     />
    </div>

    <PaginationNote {...paginate} />
   </div>

   <div className='mt-3 flex flex-col flex-grow-1'>
    <div className='row row-cols-4 text-white'>
     <div className='col'>
      <h6 className='md:text-2xl text-xl'>Name</h6>
     </div>
     <div className='col-6'>
      <h6 className='md:text-2xl text-xl text-center'>Content</h6>
     </div>
     <div className='col'>
      <h6 className='md:text-2xl text-xl text-right'>Date</h6>
     </div>
    </div>

    <ul className='bg-[#dedede] flex flex-col flex-grow-1 gap-3 rounded-lg overflow-y-auto h-[60vh] p-2 editnote-notelist style-scrollbar-y style-scrollbar-y-sm'>
     {noteList.length > 0 ? (
      noteList.map((note) => (
       <NoteCard
        updateNotes={updateNotes}
        type='edit'
        note={note}
        noteList={noteList}
        key={note.idNote}
       />
      ))
     ) : (
      <h3>There are no notes!</h3>
     )}
    </ul>
   </div>
  </div>
 )
}

export default NoteList
