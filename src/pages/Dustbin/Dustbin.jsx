import { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AppContext } from '../../context'

import DeleteIcon from '@mui/icons-material/Delete'
import SearchIcon from '@mui/icons-material/Search'
import NoteCard from '../../share/NoteCard'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import { debounce } from '../../utils/utils'
import PaginationNote from '../../share/PaginationNote'

const Dustbin = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [dustbinNotes, setDustbinNotes] = useState([])
 const [dustbinNotesInit, setDustbinNotesInit] = useState([])

 const [messageNotifi, setMessageNottifi] = useState('')

 // params pagination
 const [searchParams, setSearchParams] = useSearchParams()
 const pageParam = searchParams.get('page')
 const [pageSize, setPageSize] = useState(5)
 const [totalNote, setTotalNote] = useState(10)

 const getDustbinNotes = () => {
  return fetchApiSamenote('get', `/trash/${user?.id}?page=${pageParam || 1}`).then(
   (data) => {
    setDustbinNotes(data.notes)
    setDustbinNotesInit(data.notes)

    setPageSize(data.total_item)
    setTotalNote(data.total_item * data.total_page)
    console.log('data', data)
   }
  )
 }

 useEffect(() => {
  if (!user) return

  getDustbinNotes()
 }, [user, pageParam])

 const handleChangeSearchNote = async (e) => {
  const textSearch = e.target.value

  if (textSearch.trim() === '') {
   setDustbinNotes(dustbinNotesInit)
   setMessageNottifi('')
   return
  }

  fetchApiSamenote('get', `/searchTrash/${user?.id}?key=${textSearch}`).then(
   (data) => {
    const newNoteList = dustbinNotesInit.filter((note) =>
     data.data.some((item) => note.idNote === item.idNote)
    )

    if (!newNoteList.length) {
     setMessageNottifi('Not Found !')
    } else {
     setMessageNottifi('')
    }

    setDustbinNotes(newNoteList)
   }
  )
 }

 return (
  <div className='flex flex-col flex-grow-1 px-lg-4 py-lg-3 px-2 py-2 bg-[#181A1B] text-white'>
   <div className='flex gap-1 justify-center items-center'>
    <h3 className='xl:text-4xl lg:text-3xl text-2xl font-semibold xl:font-bold'>
     Recycle bin
    </h3>
    <span>
     <DeleteIcon className='xl:text-4xl lg:text-3xl text-2xl' />
    </span>
   </div>

   <div className='mx-auto mt-xl-5 mt-lg-3 mt-2'>
    <div className='flex px-3 gap-2 max-w-[400px] items-center h-[40px] rounded-[40px] text-black bg-white'>
     <span>
      <SearchIcon />
     </span>

     <div className='w-full'>
      <input
       onChange={debounce(handleChangeSearchNote, 1000)}
       className='w-full'
       type='Search note'
       placeholder='Search note'
      />
     </div>
    </div>

    <h5 className='mt-2 text-[#FF2323] xl:text-3xl text-2xl'>
     Auto-delete after 30 days
    </h5>
   </div>

   {messageNotifi && (
    <span className='text-center text-red-500 text-3xl font-semibold mt-3'>
     {messageNotifi}
    </span>
   )}

   <ul className='grid grid-cols-1 md:grid-cols-2 my-lg-4 my-2 my-md-3 gap-lg-3 gap-2 pr-1 overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
    {dustbinNotes?.map((note) => (
     <NoteCard
      type='delete'
      note={note}
      noteList={dustbinNotes}
      key={note.idNote}
      updateNotes={getDustbinNotes}
     />
    ))}
   </ul>

   <PaginationNote pageSize={pageSize} totalItem={totalNote} pathName={'/dustbin'} />
  </div>
 )
}

export default Dustbin
