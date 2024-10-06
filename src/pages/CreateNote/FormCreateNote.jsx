import { useEffect, useState } from 'react'

import {
 FormControl,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const FormCreateNote = ({
 register,
 watch,
 errors,
 userID,
 dirtyFields,
 onChangeColor,
}) => {
 const [colorList, setColorList] = useState([])
 const [folderList, setFolderList] = useState([])
 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 const notePublicForm = watch('notePublic')
 const colorForm = watch('color')
 const folderForm = watch('idFolder')

 useEffect(() => {
  if (!userID) return

  fetchApiSamenote('get', '/get_all_color').then((data) =>
   setColorList(data.data)
  )
  fetchApiSamenote('get', `/folder/${userID}`).then((data) =>
   setFolderList(data.folder)
  )
 }, [userID])

 useEffect(() => {
  // check color form change?
  if (!dirtyFields.color) return

  // handle change color
  const colorMatch = colorList?.find((color) => color.name === colorForm)
  setColor(colorMatch)
  onChangeColor(colorMatch)
 }, [colorForm])

 return (
  <div className='grid grid-cols-2 gap-3'>
   <div className='col-span-2'>
    <InputLabel className='text-white'>Title</InputLabel>
    <TextField
     className='w-full bg-white rounded-1 '
     size='small'
     type='text'
     {...register('title')}
    />

    {errors.title && (
     <p className='text-red-600 border-b border-red-600'>
      {errors.title.message}
     </p>
    )}
   </div>

   <div>
    <InputLabel className='text-white'>Lock</InputLabel>
    <TextField
     className='w-full bg-white rounded-1 '
     size='small'
     type='password'
     {...register('lock')}
    />
   </div>

   <div>
    <InputLabel className='text-white' id='select-public-form'>
     Folder
    </InputLabel>

    <FormControl className=' bg-white rounded-1 w-full'>
     <Select
      value={folderForm}
      {...register('idFolder')}
      labelId='select-public-form'
      size='small'
      className='capitalize'
     >
      {folderList?.map(({ id, nameFolder }) => (
       <MenuItem key={id} value={id} className='capitalize'>
        {nameFolder}
       </MenuItem>
      ))}
     </Select>
    </FormControl>
   </div>

   <div>
    <InputLabel className='text-white' id='select-color-form'>
     Background
    </InputLabel>

    <FormControl className=' bg-white rounded-1 w-full'>
     <Select
      value={colorForm}
      style={{ background: `rgb(${color?.r}, ${color?.g}, ${color?.b})` }}
      {...register('color')}
      labelId='select-color-form'
      size='small'
     >
      {colorList?.map((colorOption) => (
       <MenuItem
        className='capitalize'
        key={colorOption.id}
        value={colorOption.name}
       >
        {colorOption.name}
        <span
         style={{
          height: '20px',
          width: '20px',
          border: '1px solid black',
          marginLeft: '3px',
          background: `rgb(${colorOption.r}, ${colorOption.g}, ${colorOption.b})`,
         }}
        ></span>
       </MenuItem>
      ))}
     </Select>
    </FormControl>
   </div>

   <div>
    <InputLabel className='text-white' id='select-public-form'>
     Note Public
    </InputLabel>

    <FormControl className=' bg-white rounded-1 w-full'>
     <Select value={notePublicForm} {...register('notePublic')} size='small'>
      <MenuItem value={1}>Public</MenuItem>
      <MenuItem value={0}>Private</MenuItem>
     </Select>
    </FormControl>
   </div>

   <div className='w-max'>
    <div className='mb-3'>
     <InputLabel className='text-white'>Due At</InputLabel>
     <TextField
      className='w-full bg-white rounded-1 '
      size='small'
      type='date'
      {...register('dueAt')}
     />
    </div>

    {errors.dueAt && (
     <p style={{ borderBottom: '1px solid red' }} className='text-red-600'>
      {errors.dueAt.message}
     </p>
    )}
   </div>
  </div>
 )
}

export default FormCreateNote
