import { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../context'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'
import FormEdit from './components/FormEdit.jsx'
import NoteList from './components/NoteList.jsx'
import { useSearchParams } from 'react-router-dom'

const EditNote = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [noteList, setNoteList] = useState([])

 // params pagination
 const [searchParams, setSearchParams] = useSearchParams()
 const pageParam = searchParams.get('page')
 const [pageSize, setPageSize] = useState(5)
 const [totalNote, setTotalNote] = useState(10)

 //  .................................
 const handleChangeNoteList = (newNoteList) => setNoteList(newNoteList)

 const getNoteList = () => {
  fetchApiSamenote(
   'get',
   `/notes/${user?.id}?page=${pageParam || 1}`
  ).then((result) => {
   setPageSize(result.total_item)
   setTotalNote(result.total_item * result.total_page)
   setNoteList(result.notes)
  })
 }

 useEffect(() => {
  user?.id && getNoteList()
 }, [user, pageParam])

 return (
  <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 flex-grow-1'>
   <div className='flex flex-col'>
    <NoteList
     noteList={noteList}
     onChangeNoteList={handleChangeNoteList}
     userID={user?.id}
     updateNotes={getNoteList}
     paginate={{
      pageSize,
      totalItem: totalNote,
      pathName: '/editnote',
     }}
    />
   </div>

   <div className='xl:flex hidden'>
    {<FormEdit updateNotes={getNoteList} />}
   </div>
  </div>
 )
}

export default EditNote
