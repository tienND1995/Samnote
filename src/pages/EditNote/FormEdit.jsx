import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useParams, useNavigate } from 'react-router-dom'

import { joiResolver } from '@hookform/resolvers/joi'
import { Editor } from '@tinymce/tinymce-react'
import moment from 'moment'
import { schemaNoteEdit } from '../../utils/schema/schema'

import { AppContext } from '../../context'
import { fetchAllFolder, fetchNotsList } from './fetchApiNote'
import FormEditImages from './FormEditImages'

import {
 Checkbox,
 FormControl,
 FormControlLabel,
 InputLabel,
 MenuItem,
 Select,
 TextField,
} from '@mui/material'

import configs from '../../configs/configs.json'
const { API_SERVER_URL } = configs

const FormEdit = ({ onDispatchName }) => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext
 const { id } = useParams()
 const navigate = useNavigate()

 const [noteItem, setNoteItem] = useState({})

 const [colorList, setColorList] = useState([])
 const [folderList, setFolderList] = useState([])
 const [color, setColor] = useState({
  r: '255',
  g: '0',
  b: '0',
  name: 'red',
 })

 // Declare variables for the form
 const {
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
  unregister,
  formState: { errors, dirtyFields },
 } = useForm({
  resolver: joiResolver(schemaNoteEdit),
  defaultValues: {
   notePublic: 1,
   data: '',
   pinned: false,
   title: '',
   dueAt: null,
   lock: '',
   color: '',
   type: 'text',
   idFolder: null,
  },
 })
 const notePublicForm = watch('notePublic')
 const colorForm = watch('color')
 const folderForm = watch('idFolder')
 const dataForm = watch('data')

 const convertTime = (time) => moment(`${time}+0700`).format('YYYY-MM-DD')

 useEffect(() => {
  const fetchAllColor = async () => {
   try {
    const response = await axios.get(`${API_SERVER_URL}/get_all_color`)
    setColorList(response.data.data)
   } catch (error) {
    console.error(error)
   }
  }
  const getDataNoteId = async () => {
   const noteList = await fetchNotsList(user?.id)
   const noteId = noteList.filter((note) => note.idNote === Number.parseInt(id))
   if (!noteId || noteId.length === 0) return navigate('/')

   setNoteItem(noteId[0])

   // set values form default
   setValue('title', noteId[0].title)
   setValue('data', noteId[0].data)
   setValue('pinned', noteId[0].pinned)
   setValue('type', noteId[0].type)
   setValue('dueAt', convertTime(noteId[0].dueAt))
   setValue('notePublic', noteId[0].notePublic)
   setValue('idFolder', noteId[0].idFolder)
  }

  const getFolders = async () => {
   const folders = await fetchAllFolder(user?.id)
   setFolderList(folders)
  }

  if (!user?.id) return

  getDataNoteId()
  getFolders()
  fetchAllColor()
 }, [user?.id])

 useEffect(() => {
  // render color when component mounted
  const handleColor = () => {
   if (colorList.length < 1 || !noteItem.color) return

   const colorMatch = colorList?.filter(
    (item) =>
     item.r === noteItem?.color.r &&
     item.g === noteItem?.color.g &&
     item.b === noteItem?.color.b
   )
   setValue('color', colorMatch[0]?.name)
   setColor(colorMatch[0])
  }

  handleColor()
 }, [colorList, noteItem])

 useEffect(() => {
  // check color form change?
  if (!dirtyFields.color) return

  // handle change color
  const colorMatch = colorList?.filter((color) => color.name === colorForm)
  setColor(colorMatch[0])
 }, [colorForm])

 const pacthNote = async (noteId, data) => {
  try {
   const response = await axios.patch(`${API_SERVER_URL}/notes/${noteId}`, data)
   onDispatchName('patch note')
   setSnackbar({
    isOpen: true,
    message: `Update note complete!`,
    severity: 'success',
   })
  } catch (error) {
   console.error(error)
  }
 }

 const onSubmit = async (data) => {
  if (color.name !== data.color || !noteItem.idNote) return
  if (Object.keys(dirtyFields).length === 0 && data.data === noteItem.data)
   return

  // *** convert time and color to api
  const newDueAt = `${moment(data.dueAt).format('DD/MM/YYYY hh:mm A')} +07:00`
  const newColor = {
   r: color.r,
   b: color.b,
   g: color.g,
   a: 1,
  }

  const dataForm = {
   ...data,
   color: newColor,
   dueAt: newDueAt,
  }

  console.log(data)

  pacthNote(noteItem.idNote, dataForm)
 }

 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <form
    onSubmit={handleSubmit(onSubmit)}
    className='flex flex-col flex-grow-1 gap-3'
    action=''
   >
    <div className='row row-cols-3 text-white'>
     <div className='col'>
      <div className='mb-3'>
       <InputLabel className='text-white'>Type</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='text'
        disabled={true}
        {...register('type')}
       />
      </div>

      <div className='mb-3'>
       <InputLabel className='text-white'>Lock</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='password'
        {...register('lock')}
       />
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
     </div>

     <div className='col'>
      <div className='mb-3'>
       <InputLabel className='text-white'>title</InputLabel>
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

      <div className='mb-3'>
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
     </div>

     <div className='col flex flex-col justify-between'>
      <div className='mb-3'>
       <InputLabel className='text-white'>Remind At</InputLabel>
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

      <div className='text-right'>
       <button type='submit' className='btn btn-primary uppercase'>
        Save
       </button>
      </div>
     </div>
    </div>

    <FormEditImages
     images={noteItem?.image}
     userId={user?.id}
     noteId={noteItem.idNote}
     onDispatchName={onDispatchName}
    />

    <div className='flex justify-start items-center'>
     <FormControlLabel
      className=' text-white rounded-1'
      label='Pinned'
      control={<Checkbox className='text-white' {...register('pinned')} />}
     />

     <div>
      <button className='btn btn-primary w-max'>Share Note</button>
     </div>
    </div>

    <div className='mx-auto w-full flex flex-grow-1'>
     <Editor
      apiKey='c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y'
      value={dataForm}
      init={{
       width: '100%',
       height: '100%',
       menubar: true,
       statusbar: false,
       images_file_types: 'jpg,svg,webp',
       automatic_uploads: true,
       plugins: [
        'advlist autolink lists link charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table paste code help wordcount',
        'image',
       ],
       bold: [
        { inline: 'strong', remove: 'all' },
        { inline: 'p', styles: { fontWeight: 'bold' } },
        { inline: 'b', remove: 'all' },
       ],
       toolbar:
        'undo redo |formatselect | bold italic backcolor | link image | code| \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat|',

       file_picker_types: 'image',
       file_picker_callback: (cb, value, meta) => {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')

        input.addEventListener('change', (e) => {
         const file = e.target.files[0]
         const imageUrl = URL.createObjectURL(e.target.files[0])

         const reader = new FileReader()
         reader.addEventListener('load', () => {
          const id = 'blobid' + new Date().getTime()
          const blobCache = tinymce.activeEditor.editorUpload.blobCache

          const base64 = reader.result.split(',')[1]
          const blobInfo = blobCache.create(id, file, imageUrl)
          blobCache.add(blobInfo)

          console.log('blobInfo', blobCache)

          /* call the callback and populate the Title field with the file name */
          cb(blobInfo.blobUri(), { title: file.name })
         })
         reader.readAsDataURL(file)
        })

        input.click()
       },
      }}
      onEditorChange={(value, editor) => {
       setValue('data', value)

       // editor.getContent({ format: 'text' })
      }}
     />
    </div>
   </form>
  </div>
 )
}

export default FormEdit
