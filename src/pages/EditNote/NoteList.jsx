import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

import TextTruncate from 'react-text-truncate'
import Slider from 'react-slick'
import moment from 'moment'

import { fetchNotsList } from './fetchApiNote'

import { AppContext } from '../../context'
import deleteNote from '../../assets/delete-note.png'

import SearchIcon from '@mui/icons-material/Search'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import axios from 'axios'

const NoteList = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const [noteList, setNoteList] = useState([])

 const { id } = useParams()

 const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  className: 'editnote-btn-slick',
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

 //  .................................

 const fetchNoteId = async (idNote) => {
  try {
   const response = await axios.get(
    `https://samnote.mangasocial.online/only/${idNote}`
   )
  } catch (error) {
   console.error(error)
  }
 }

 useEffect(() => {
  const getNoteList = async (userID) => {
   const data = await fetchNotsList(userID)
   setNoteList(data)
  }

  user?.id && getNoteList(user.id)
 }, [user, id])

 const convertTime = (time) =>
  moment(`${time}+0700`).subtract(10, 'days').calendar()

 console.log(noteList)

 const handleClickNoteItem = (noteID) => {
  console.log(noteID)
 }
 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <div className='flex items-center justify-between'>
    <div
     style={{ boxShadow: '4px 8px 10px 0px #00000073' }}
     className='bg-white rounded-3xl w-1/2 flex items-center px-3 py-[5px] gap-2'
    >
     <SearchIcon className='text-3xl' />
     <input className='w-full' type='text' placeholder='Search note' />
    </div>

    <nav aria-label='Page navigation'>
     <ul className='pagination items-center gap-2'>
      <li className='page-item'>
       <a className='text-white text-decoration-none ' href='#'>
        <SkipPreviousIcon className='text-2xl' />
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm block bg-white text-decoration-none text-xl'
        href='#'
       >
        1
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        2
       </a>
      </li>
      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        3
       </a>
      </li>

      <li className='page-item'>
       <a
        className='text-black text-center w-[25px] rounded-sm  block bg-white text-decoration-none text-xl'
        href='#'
       >
        ...
       </a>
      </li>

      <li className='page-item'>
       <a className='text-white text-decoration-none ' href='#'>
        <SkipNextIcon className='text-2xl' />
       </a>
      </li>
     </ul>
    </nav>
   </div>

   <div className='mt-3 flex flex-col flex-grow-1'>
    <div className='row row-cols-4 text-white'>
     <div className='col'>
      <h6 className='text-2xl'>Name</h6>
     </div>
     <div className='col-6'>
      <h6 className='text-2xl'>Content</h6>
     </div>
     <div className='col'>
      <h6 className='text-2xl'>Date</h6>
     </div>
    </div>

    {noteList.length > 0 ? (
     <ul className='bg-[#dedede] flex flex-col flex-grow-1 gap-3 rounded-lg overflow-y-auto h-[60vh] p-2 editnote-notelist'>
      {noteList.map((note) => (
       <li
        key={note.idNote}
        style={{ boxShadow: '0px 4px 10px 0px #00000040' }}
        className='row row-cols-4 justify-between rounded-lg bg-white mx-0 p-2 position-relative cursor-pointer'
        onClick={() => handleClickNoteItem(note.idNote)}
       >
        <h6 className='col font-semibold'>{note.title}</h6>
        <div className='col-6 px-0'>
         <TextTruncate
          line={3}
          element='p'
          truncateText='…'
          text={`${note.data}`}
          containerClassName='text-center'
         />

         {note.image.length > 0 ? (
          <ul className='mt-2'>
           <Slider {...settings}>
            {note.image.map(({ id, link }) => (
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
        <time className='col font-semibold text-center'>
         {convertTime(note.createAt)}
        </time>

        <button
         className='position-absolute right-2 top-1/2 -translate-y-1/2 w-max'
         type='button'
        >
         <img src={deleteNote} alt='delete note' />
        </button>
       </li>
      ))}
     </ul>
    ) : null}
   </div>
  </div>
 )
}

export default NoteList
