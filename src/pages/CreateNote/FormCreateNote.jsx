import { useEffect, useState } from 'react'


import {
 FormControl,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'

const FormCreateNote = ({ register, watch, errors, userID }) => {
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
  // render color when component mounted
  //   const handleColor = () => {
  //    if (colorList.length < 1 || !noteItem.color) return
  //    const colorMatch = colorList?.filter(
  //     (item) =>
  //      item.r === noteItem?.color.r &&
  //      item.g === noteItem?.color.g &&
  //      item.b === noteItem?.color.b
  //    )
  //    setValue('color', colorMatch[0]?.name)
  //    setColor(colorMatch[0])
  //   }
  //   handleColor()
 }, [])

 return (
  <div className='row'>
   <div className='col-12 mb-3'>
    <InputLabel className='text-white'>Title</InputLabel>
    <TextField
     className='w-full bg-white rounded-1 '
     size='small'
     type='text'
     {...register('title')}
    />

    {errors.title && (
     <p style={{ borderBottom: '1px solid red' }} className='text-red-600'>
      {errors.title.message}
     </p>
    )}
   </div>

   <div className='mb-3 col-6'>
    <InputLabel className='text-white'>Lock</InputLabel>
    <TextField
     className='w-full bg-white rounded-1 '
     size='small'
     type='password'
     {...register('lock')}
    />
   </div>

   <div className='mb-3 col-6'>
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

   <div className='col-6 mb-3'>
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

   <div className='col-6 mb-3'>
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
