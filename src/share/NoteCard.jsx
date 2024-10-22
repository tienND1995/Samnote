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

const NoteCard = ({ note, noteList, type, updateNotes }) => {
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

  responsive: [
   {
    breakpoint: 600,
    settings: {
     slidesToShow: 2,
     slidesToScroll: 1,
    },
   },
  ],
 }

 const styleNoteCard = {
  boxShadow: '0px 4px 10px 0px #00000040',
  backgroundColor: `rgb(${note.color.r}, ${note.color.g}, ${note.color.b})`,
  color: isLightColor(note.color) ? 'black' : 'white',
  minHeight: type !== 'edit' ? '130px' : '80px',
 }

 // delete
 const deleteNoteId = async (id) => {
  try {
   const response = await axios.delete(
    `https://samnote.mangasocial.online/${
     type === 'edit' ? 'notes' : 'trunc-notes'
    }/${id}`
   )

   // update note
   updateNotes()
  } catch (error) {
   console.error(error)
  }
 }

 const handleDeleteNote = async (idNote) => {
  if (!idNote || noteList.length === 0) return

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
    deleteNoteId(idNote)

    Swal.fire({
     title: 'Deleted!',
     text: `Your note has been deleted.`,
     icon: 'success',
    })
   }
  })
 }

 // restore
 const restoreNote = async (idNote) => {
  fetchApiSamenote('post', `/trash-res/${idNote}`).then((result) => {
   //  handle after delete note

   updateNotes()
  })
 }

 const handleRestoreNote = async (idNote) => {
  if (!idNote || noteList.length === 0) return

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
    restoreNote(idNote)

    Swal.fire({
     title: 'Deleted!',
     text: `Restored successfully.`,
     icon: 'success',
    })
   }
  })
 }

 const optionLink = () =>
  `/${type === 'edit' ? 'editnote' : 'dustbin'}/${note.idNote}`

 //  *__________________________
 if (Object.keys(note).length === 0) return

 return (
  <li className='flex flex-col' key={note.idNote}>
   <div className='flex flex-col relative'>
    <NavLink
     to={optionLink()}
     style={styleNoteCard}
     className={({ isActive, isPending }) =>
      `grid grid-cols-4 flex-grow-1 p-md-2 p-1 justify-between rounded-lg position-relative cursor-pointer text-decoration-none border-2 ${
       isPending
        ? 'pending'
        : isActive
        ? 'border-2 border-green-600 border-solid'
        : ''
      }`
     }
    >
     <h6 className='text-sm md:text-[16px] md:font-semibold'>{note.title}</h6>
     <div className='col-span-2 px-0'>
      <div className='max-h-[100px] overflow-y-auto style-scrollbar-y style-scrollbar-y-sm'>
       {note.type === 'text' && (
        <TextTruncate
         line={3}
         element='p'
         truncateText='…'
         text={<Markdown rehypePlugins={[rehypeRaw]}>{note.data}</Markdown>}
         containerClassName='flex justify-center text-sm md:text-[16px]'
        />
       )}

       {note.type === 'checklist' && (
        <ul className='text-sm md:text-[16px]'>
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

     <div className='flex flex-col justify-between items-end'>
      <time className='text-sm md:text-[16px] md:font-semibold text-center'>
       {convertTimeApiNoteToHtml(
        type === 'edit' ? note.createAt : note.updateAt
       )}
      </time>
     </div>
    </NavLink>

    <div className='absolute z-10 flex flex-col justify-between right-1 right-md-3 top-2/3 -translate-y-1/2'>
     {type !== 'edit' && (
      <button
       onClick={() => handleRestoreNote(note.idNote)}
       type='button'
       className='hover:bg-red-rgba ease-in-out duration-150 rounded-md'
      >
       <HistoryIcon className='text-[40px]' />
      </button>
     )}

     <button
      className='w-max p-1 p-md-2 hover:bg-red-rgba ease-in-out duration-150 rounded-md'
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
