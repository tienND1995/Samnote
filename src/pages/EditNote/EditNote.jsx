import { useContext, useEffect, useState } from 'react'

import { AppContext } from '../../context'
import { fetchNoteList } from './fetchApiEditNote'

import FormEdit from './components/FormEdit.jsx'
import NoteList from './components/NoteList.jsx'

const EditNote = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [noteList, setNoteList] = useState([])

 //  .................................
 const handleChangeNoteList = (newNoteList) => setNoteList(newNoteList)

 const getNoteList = async () => {
  const data = await fetchNoteList(user?.id)
  setNoteList(data)
 }

 useEffect(() => {
  if (user?.id) {
   getNoteList()
  }
 }, [user])

 return (
  <div className='grid grid-cols-1 xl:grid-cols-2 gap-3 flex-grow-1'>
   <div className='flex flex-col'>
    <NoteList
     noteList={noteList}
     onChangeNoteList={handleChangeNoteList}
     userID={user?.id}
     updateNotes={getNoteList}
    />
   </div>

   <div className='xl:flex hidden'>
    {<FormEdit updateNotes={getNoteList} />}
   </div>
  </div>
 )
}

export default EditNote
