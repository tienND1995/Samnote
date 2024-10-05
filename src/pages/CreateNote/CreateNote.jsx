<<<<<<< HEAD
import React, { useEffect } from 'react'

import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const CreateNote = () => {
 useEffect(() => {
  fetchApiSamenote('get', '/notes/127').then((data) => {
   console.log(data)
  })
 }, [])
 return <div>CreateNote</div>
=======
import React from 'react'
import FormCreateNote from './Components/FormCreateNote'

import imageCreateNote from '../../assets/create-note.png'

import { FormControlLabel, Checkbox } from '@mui/material'

import ImageIcon from '@mui/icons-material/Image'

const CreateNote = () => {
 return (
  <div className='bg-[#181A1B] w-full p-4 flex flex-col'>
   <div className='flex justify-center items-end gap-2'>
    <img src={imageCreateNote} alt='' />

    <h3 className='text-white'>Create Note</h3>
   </div>
   <form className='text-white bg-[#3A3F42] rounded-top flex flex-col flex-grow-1 px-3 py-4'>
    <div className='max-w-[600px] mx-auto'>
     <FormCreateNote />

     <div className='flex justify-between'>
      <div className='flex justify-start items-center gap-2'>
       <FormControlLabel
        className=' text-white rounded-1'
        label='Pinned'
        control={<Checkbox className='text-white' />}
       />

       <div>
        <button className='btn btn-primary w-max'>Share Note</button>
       </div>

       <button type='button'>
        <ImageIcon className='text-[40px] text-white' />
       </button>
      </div>

      <div>
       <button className='btn btn-primary text-white'>Save</button>
      </div>
     </div>
    </div>
   </form>
  </div>
 )
>>>>>>> page/createnote
}

export default CreateNote
