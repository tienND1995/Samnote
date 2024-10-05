import React, { useEffect, useContext } from 'react'

import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { schemaNoteCreate } from '../../utils/schema'

import { AppContext } from '../../context'

import FormCreateNote from './FormCreateNote'
import imageCreateNote from '../../assets/create-note.png'
import { FormControlLabel, Checkbox } from '@mui/material'
import ImageIcon from '@mui/icons-material/Image'

const CreateNote = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext

 const {
  register,
  handleSubmit,
  setValue,
  getValues,
  watch,
  reset,

  formState: { errors, dirtyFields },
 } = useForm({
  resolver: joiResolver(schemaNoteCreate),
  defaultValues: {
   data: '',
   title: '',
   dueAt: null,

   remindAt: null,
   pinned: false,
   notePublic: 1,
   lock: '',
   color: '',
   idFolder: null,
  },
 })

 const onSubmit = (data) => {
  console.log('data', data)
 }

 console.log('error', errors)

 return (
  <div className='bg-[#181A1B] w-full p-4 flex flex-col'>
   <div className='flex justify-center items-end gap-2'>
    <img src={imageCreateNote} alt='' />

    <h3 className='text-white'>Create Note</h3>
   </div>
   <form
    onSubmit={handleSubmit(onSubmit)}
    className='text-white bg-[#3A3F42] rounded-t-[10px] flex flex-col flex-grow-1 px-3 py-4'
   >
    <div className='max-w-[600px] mx-auto'>
     <FormCreateNote userID = {user?.id} register={register} watch={watch} errors={errors} />

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
}

export default CreateNote
