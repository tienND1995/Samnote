import { NavLink, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

import Markdown from 'react-markdown'
import Slider from 'react-slick'
import TextTruncate from 'react-text-truncate'
import rehypeRaw from 'rehype-raw'

import { convertTimeApiNoteToHtml, isLightColor } from '../utils/utils'
import deleteNote from '../assets/delete-note.png'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HistoryIcon from '@mui/icons-material/History'
import axios from 'axios'
import { fetchApiSamenote } from '../utils/fetchApiSamnote'

const NoteCard = ({ note, noteList, type }) => {
 const navigate = useNavigate()
 const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  className: 'slider-btn-arrow',
  nextArrow: (
   <button>
    <ArrowForwardIosIcon />
   </button>
  ),
  prevArrow: (
   <button>
    <ArrowBackIosIcon />
   </button>
  ),
 }

 // delete
 const deleteNoteId = async (id, indexNoteNext) => {
  try {
   const response = await axios.delete(
    `https://samnote.mangasocial.online/${
     type === 'edit' ? 'notes' : 'trunc-notes'
    }/${id}`
   )

   //  handle after delete note

   if (noteList.length === 1) {
    return navigate(`${type === 'edit' ? '/editnote' : '/dustbin'}`, {
     state: 'Delete note',
    })
   }

   if (indexNoteNext === noteList.length - 1) {
    return navigate(
     `${type === 'edit' ? '/editnote' : '/dustbin'}/${
      noteList[indexNoteNext - 1].idNote
     }`,
     {
      state: 'Delete note',
     }
    )
   }

   return navigate(
    `${type === 'edit' ? '/editnote' : '/dustbin'}/${
     noteList[indexNoteNext + 1].idNote
    }`,
    {
     state: 'Delete note',
    }
   )
  } catch (error) {
   console.error(error)
  }
 }

 const handleDeleteNote = async (idNote) => {
  if (!idNote || noteList.length === 0) return

  const indexNoteNext = noteList?.findIndex((note) => note.idNote === idNote)

  Swal.fire({
   title: 'Are you sure?',
   text:
    type === 'edit'
     ? 'This note will be placed in the trash'
     : "You won't be able to revert this!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
   if (result.isConfirmed) {
    deleteNoteId(idNote, indexNoteNext)

    Swal.fire({
     title: 'Deleted!',
     text: `Your note has been deleted.`,
     icon: 'success',
    })
   }
  })
 }

 // restore
 const restoreNote = async (idNote, indexNoteNext) => {
  fetchApiSamenote('post', `/trash-res/${idNote}`).then((result) => {
   //  handle after delete note
   if (noteList.length === 1) {
    return navigate('/dustbin', {
     state: 'Restore note',
    })
   }

   if (indexNoteNext === noteList.length - 1) {
    return navigate(`${'/dustbin'}/${noteList[indexNoteNext - 1].idNote}`, {
     state: 'Restore note',
    })
   }

   return navigate(`${'/dustbin'}/${noteList[indexNoteNext + 1].idNote}`, {
    state: 'Restore note',
   })
  })
 }

 const handleRestoreNote = async (idNote) => {
  if (!idNote || noteList.length === 0) return

  const indexNoteNext = noteList?.findIndex((note) => note.idNote === idNote)

  Swal.fire({
   title: 'Are you sure?',
   text: 'This note will return to your inventory!',
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
   if (result.isConfirmed) {
    restoreNote(idNote, indexNoteNext)

    Swal.fire({
     title: 'Deleted!',
     text: `Restored successfully.`,
     icon: 'success',
    })
   }
  })
 }

 //  *__________________________
 if (Object.keys(note).length === 0) return

 return (
  <li key={note.idNote}>
   <div className='flex flex-col relative'>
    <NavLink
     to={`/${type === 'edit' ? 'editnote' : 'dustbin'}/${note.idNote}`}
     style={{
      boxShadow: '0px 4px 10px 0px #00000040',
      backgroundColor: `rgb(${note.color.r}, ${note.color.g}, ${note.color.b})`,
      color: isLightColor(note.color) ? 'black' : 'white',
     }}
     className={({ isActive, isPending }) =>
      `row row-cols-4 flex-grow-1 justify-between rounded-lg mx-0 p-2 position-relative cursor-pointer text-decoration-none border-2 ${
       isPending
        ? 'pending'
        : isActive
        ? 'border-2 border-green-600 border-solid'
        : ''
      }`
     }
    >
     <h6 className='col font-semibold'>{note.title}</h6>
     <div className='col-6 px-0'>
      <div className='max-h-[100px] overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
       {note.type === 'text' && (
        <TextTruncate
         line={3}
         element='p'
         truncateText='…'
         text={<Markdown rehypePlugins={[rehypeRaw]}>{note.data}</Markdown>}
         containerClassName='flex justify-center'
        />
       )}

       {note.type === 'checklist' && (
        <ul>
         {note.data?.map(({ content, status }) => {
          return (
           <li key={content}>
            <input checked={status} type='checkbox' />
            <span className='ms-2'>{content}</span>
           </li>
          )
         })}
        </ul>
       )}
      </div>

      {note?.image?.length > 0 ? (
       <ul className='mt-2'>
        <Slider {...settings}>
         {note.image
          .sort((a, b) => b.id - a.id)
          .map(({ id, link }) => (
           <li key={id} className='p-1  border-none outline-none'>
            <img
             className='object-cover aspect-[3/2] w-full rounded-lg'
             src={link}
             alt='img-editnote'
            />
           </li>
          ))}
        </Slider>
       </ul>
      ) : null}
     </div>

     <div className='col flex flex-col justify-between items-end gap-2 pb-5'>
      <div>
       <time className=' font-semibold text-center'>
        {convertTimeApiNoteToHtml(
         type === 'edit' ? note.createAt : note.updateAt
        )}
       </time>
      </div>

      <div className=''>
       {type !== 'edit' && (
        <button
         onClick={() => handleRestoreNote(note.idNote)}
         type='button'
         className=''
        >
         <HistoryIcon className='text-[40px]' />
        </button>
       )}
      </div>
     </div>
    </NavLink>

    <div className='flex flex-grow-1 items-start absolute z-10 right-3 bottom-3'>
     <button
      className='w-max p-2 hover:bg-red-rgba ease-in-out duration-150 rounded-md'
      type='button'
      onClick={() => handleDeleteNote(note.idNote)}
     >
      <img src={deleteNote} alt='delete note' />
     </button>
    </div>
   </div>
  </li>
 )
}

export default NoteCard
