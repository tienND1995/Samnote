import { useContext, useEffect, useState } from 'react'

import uniqid from 'uniqid'
import { convertTimeToApi } from '../../utils/utils'

import { joiResolver } from '@hookform/resolvers/joi'
import { useForm } from 'react-hook-form'
import { schemaNoteCreate } from '../../utils/schema'

import { AppContext } from '../../context'

import ImageIcon from '@mui/icons-material/Image'
import { Checkbox, FormControlLabel } from '@mui/material'
import imageCreateNote from '../../assets/create-note.png'
import FormCreateNote from './FormCreateNote'

import AddImages from './AddImages'
import TextEditor from '../../share/TextEditor'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

const CreateNote = () => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext

 const [uploadImageList, setUploadImageList] = useState([])
 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
  setError,

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

 const contentEditor = watch('data')

 const [textEditor, setTextEditor] = useState('')
 const handleChangeTextEditor = (text) => setTextEditor(text)
 const handleChangeColor = (color) => setColor(color)

 const postNote = async (data) => {
  let params = ''
  params = uploadImageList.length > 0 ? 'new-note-image' : 'notes'

  try {
   const response = await fetch(
    `https://samnote.mangasocial.online/${params}/${user?.id}`,
    {
     method: 'POST',
     body: data,
    }
   )

   reset()

   setSnackbar({
    isOpen: true,
    message: `Create note success!`,
    severity: 'success',
   })
  } catch (error) {
   console.log(error)
  }
 }

 const onSubmit = (data) => {
  if (data.data.trim() === '<p><br></p>') {
   return setError('data', { type: 'text', message: 'Not content yet!' })
  }

  // *** convert time and color to api
  const newColor = {
   r: color.r,
   b: color.b,
   g: color.g,
   a: 1,
  }

  const dataForm = {
   ...data,
   color: newColor,
   dueAt: convertTimeToApi(data.dueAt),
   type: 'text',
   linkNoteShare: '',
  }

  if (uploadImageList.length === 0) {
   return postNote(dataForm)
  }

  if (uploadImageList.length > 0) {
   const dataWithImage = new FormData()

   dataWithImage.append('content', dataForm.data)
   dataWithImage.append('dueAt', dataForm.dueAt)
   dataWithImage.append('type', 'image')
   dataWithImage.append('title', dataForm.title)
   dataWithImage.append('pinned', dataForm.pinned)
   dataWithImage.append('idFolder', dataForm.idFolder)
   dataWithImage.append('linkNoteShare', dataForm.linkNoteShare)
   dataWithImage.append('remindAt', dataForm.remindAt)
   dataWithImage.append('r', newColor.r)
   dataWithImage.append('g', newColor.g)
   dataWithImage.append('b', newColor.b)
   dataWithImage.append('a', newColor.a)

   uploadImageList.forEach(({ file }) =>
    dataWithImage.append('image_note', file)
   )
   return postNote(dataWithImage)
  }
 }

 // handle upload image
 const handleChangeImage = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const blobUrl = URL.createObjectURL(file)
  const image = {
   id: uniqid(file.id),
   file,
   src: blobUrl,
  }

  setUploadImageList([...uploadImageList, image])
 }

 return (
  <div className='bg-[#181A1B] w-full p-4 flex flex-col'>
   <div className='flex justify-center items-end gap-2'>
    <img src={imageCreateNote} alt='' />

    <h3 className='text-white'>Create Note</h3>
   </div>
   <form
    onSubmit={handleSubmit(onSubmit)}
    className='bg-[#3A3F42] rounded-t-[10px] flex flex-col flex-grow-1 px-3 py-4'
   >
    <div className='w-[600px] mx-auto'>
     <FormCreateNote
      userID={user?.id}
      register={register}
      watch={watch}
      errors={errors}
      dirtyFields={dirtyFields}
      onChangeColor={handleChangeColor}
     />

     <div className='flex justify-between'>
      <div className='flex justify-start items-center gap-2'>
       <FormControlLabel
        className=' text-white rounded-1'
        label='Pinned'
        control={<Checkbox className='text-white' {...register('pinned')} />}
       />

       <div>
        <button className='btn btn-primary w-max'>Share Note</button>
       </div>

       <div>
        <input
         onChange={handleChangeImage}
         id='upload-file-craete-note'
         type='file'
         className='hidden'
        />
        <label htmlFor='upload-file-craete-note' className='flex'>
         <ImageIcon className='text-[40px] text-white' />
        </label>
       </div>
      </div>

      <div>
       <button className='btn btn-primary text-white uppercase'>Create</button>
      </div>
     </div>
    </div>

    <AddImages
     imageList={uploadImageList}
     onChangeUploadImages={setUploadImageList}
    />

    <div>
     {errors.data && (
      <p
       style={{ borderBottom: '1px solid red' }}
       className='text-red-600 w-max mb-3'
      >
       {errors.data.message}
      </p>
     )}
     <TextEditor
      setValue={setValue}
      value={contentEditor}
      onChangeTextEditor={handleChangeTextEditor}
     />
    </div>
   </form>
  </div>
 )
}

export default CreateNote
