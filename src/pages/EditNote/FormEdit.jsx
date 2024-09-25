import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { schemaNoteEdit } from '../../utils/schema/schema'
import { Editor } from '@tinymce/tinymce-react'
import Slider from 'react-slick'

import { fetchNotsList, fetchAllFolder } from './fetchApiNote'
import { AppContext } from '../../context'
import FormEditImages from './FormEditImages'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

import {
 FormControl,
 InputLabel,
 MenuItem,
 Select,
 TextField,
 FormControlLabel,
 Checkbox,
} from '@mui/material'

import configs from '../../configs/configs.json'
const { API_SERVER_URL } = configs

const FormEdit = () => {
 const appContext = useContext(AppContext)
 const { user } = appContext
 const { id } = useParams()

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
  // resolver: joiResolver(schemaNoteEdit),
  defaultValues: {
   notePublic: 1,
   data: '',
   pinned: false,
   title: '',
   remindAt: null,
   lock: '',
   color: '',
   type: '',
   idFolder: '',
  },
 })
 const notePublicForm = watch('notePublic')
 const colorForm = watch('color')
 const folderForm = watch('idFolder')
 const dataForm = watch('data')

 //  const data = {
 //   type: 'text',
 //   data: 'hello cac tinh yeu',
 //   title: 'giang sinh an lanh',
 //   color: {
 //    r: 255,
 //    g: 255,
 //    b: 255,
 //    a: 1,
 //   },
 //   idFolder: 45,
 //   remindAt: '01/01/2024 07:00 AM +07:00',
 //   nodePublic: 0,
 //   dueAt: '01/01/2024 07:00 AM +07:00',
 //   lock: '123456',
 //   pinned: false,
 //   linkNoteShare: '',
 //  }

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
   if (!noteId || noteId.length === 0) return null

   setNoteItem(noteId[0])
   //  setContentEditor(noteId[0].data)

   // set values form default
   setValue('title', noteId[0].title)
   setValue('data', noteId[0].data)
   setValue('pinned', noteId[0].pinned)
   setValue('type', noteId[0].type)
   setValue('remindAt', noteId[0].remindAt)
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

 const onSubmit = (data) => {
  console.log(data)
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
        {...register('remindAt')}
       />
      </div>

      <div className='text-right'>
       <button type='submit' className='btn btn-primary uppercase'>
        Save
       </button>
      </div>
     </div>
    </div>

    <FormEditImages images={noteItem?.image} />

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
        'undo redo |formatselect | bold italic backcolor | \
          alignleft aligncenter alignright alignjustify | \
          bullist numlist outdent indent | removeformat|',
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
