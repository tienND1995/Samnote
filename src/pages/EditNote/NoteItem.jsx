import React from 'react'
import { useParams } from 'react-router-dom'

import TextTruncate from 'react-text-truncate'
import Slider from 'react-slick'
import moment from 'moment'
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import deleteNote from '../../assets/delete-note.png'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const NoteItem = ({ note }) => {
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

 const convertTime = (time) =>
  moment(`${time}+0700`).subtract(10, 'days').calendar()

 const content = `<p><span style="background-color: #e03e2d;">danh sach</span></p>`
 if (Object.keys(note).length === 0) return
 return (
  <li
   key={note.idNote}
   style={{
    boxShadow: '0px 4px 10px 0px #00000040',
    backgroundColor: `rgb(${note.color.r}, ${note.color.g}, ${note.color.b})`,

    border: note.idNote === Number.parseInt(id) && `1px solid red`,
   }}
   className='row row-cols-4 justify-between rounded-lg mx-0 p-2 position-relative cursor-pointer'
  >
   <h6 className='col font-semibold'>{note.title}</h6>
   <div className='col-6 px-0'>
    {typeof note.data == 'string' && (
     <TextTruncate
      line={3}
      element='p'
      truncateText='…'
      text={<Markdown rehypePlugins={[rehypeRaw]}>{note.data}</Markdown>}
      containerClassName='text-center'
     />
    )}

    {note?.image?.length > 0 ? (
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
 )
}

export default NoteItem
