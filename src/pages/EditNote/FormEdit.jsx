import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

import { joiResolver } from '@hookform/resolvers/joi'
import { schemaNoteEdit } from '../../utils/schema/schema'
import { Editor } from '@tinymce/tinymce-react'

import Slider from 'react-slick'

import { fetchNotsList } from './fetchApiNote'

import { AppContext } from '../../context'

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
 const [noteItem, setNoteItem] = useState({})

 const [colorList, setColorList] = useState([])

 const appContext = useContext(AppContext)
 const { user } = appContext
 const { id } = useParams()

 const [formEdit, setFormEdit] = useState({
  data: '',
  title: '',
  color: {},
  remindAt: '',
  nodePublic: 0,
  lock: '123456',
  idFolder: 45,
 })

 const data = {
  type: 'text',
  data: 'hello cac tinh yeu',
  title: 'giang sinh an lanh',
  color: {
   r: 255,
   g: 255,
   b: 255,
   a: 1,
  },
  idFolder: 45,
  remindAt: '01/01/2024 07:00 AM +07:00',
  nodePublic: 0,
  dueAt: '01/01/2024 07:00 AM +07:00',
  lock: '123456',
  pinned: false,
  linkNoteShare: '',
 }

 const {
  register,
  handleSubmit,
  setValue,
  getValues,
  reset,
  formState: { errors },
 } = useForm({
  resolver: joiResolver(schemaNoteEdit),
  defaultValues: async () => {
   const data = await fetchNoteId(1281)

   return {
    data: data?.data === 'Locked' ? '' : data.data,
    title: data.title,
    color: data.color,
    remindAt: data.remindAt,
    nodePublic: data.nodePublic,
    lock: data.lock,
    idFolder: '',
   }
  },
 })

 const fetchNoteId = async (idNote) => {
  try {
   const response = await axios.get(
    `https://samnote.mangasocial.online/only/${idNote}`
   )

   setNoteItem(response.data.note)
   return response.data.note
  } catch (error) {
   console.error(error)
  }
 }

 useEffect(() => {
  const fetchAllColor = async () => {
   try {
    const response = await axios.get(`${API_SERVER_URL}/get_all_color`)
    setColorList(response.data.data)
   } catch (error) {
    console.error(error)
   }
  }

  id && fetchNoteId(id)
  fetchAllColor()
 }, [])

 console.log(noteItem)

 const settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 5,
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

 return (
  <div className='p-2 bg-[#3A3F42] rounded-lg flex flex-col flex-grow-1'>
   <form className='flex flex-col flex-grow-1 gap-3' action=''>
    <div className='row row-cols-3 text-white'>
     <div className='col'>
      <div className='mb-3'>
       <InputLabel className='text-white'>Type</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='text'
        disabled={true}
        value={'text'}
       />
      </div>

      <div className='mb-3'>
       <InputLabel className='text-white'>Lock</InputLabel>
       <TextField
        className='w-full bg-white rounded-1 '
        size='small'
        type='password'
       />
      </div>

      <div>
       <InputLabel className='text-white' id='select-color-form'>
        Background
       </InputLabel>

       <FormControl className=' bg-white rounded-1 w-full'>
        <Select value={'red'} labelId='select-color-form' size='small'>
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
             background: `rgba(${colorOption.r}, ${colorOption.g}, ${colorOption.b})`,
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
         {...register('idFolder')}
         value={1}
         labelId='select-public-form'
         size='small'
        >
         <MenuItem value='1'>Public</MenuItem>

         <MenuItem value='0'>Private</MenuItem>
        </Select>
       </FormControl>
      </div>

      <div>
       <InputLabel className='text-white' id='select-public-form'>
        Note Public
       </InputLabel>

       <FormControl className=' bg-white rounded-1 w-full'>
        <Select
         {...register('nodePublic')}
         value={1}
         labelId='select-public-form'
         size='small'
        >
         <MenuItem value='0'>Public</MenuItem>

         <MenuItem value='1'>Private</MenuItem>
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
       <button className='btn btn-primary uppercase'>Save</button>
      </div>
     </div>
    </div>

    <div className='bg-white px-3 pt-2  rounded-md'>
     <div className='flex justify-end gap-2 mb-2'>
      <div>
       <button className='btn btn-primary'>Select All</button>
      </div>
      <div>
       <button className='btn btn-danger'>Delete</button>
      </div>
     </div>

     <div className='max-w-[35vw] mx-auto'>
      <Slider {...settings}>
       {noteItem?.image?.map(({ id, link }) => (
        <li key={id} className='p-1  border-none outline-none'>
         <img
          className='object-cover aspect-[1/1] w-full rounded-md'
          src={link}
          alt='img-editnote'
         />
        </li>
       ))}
      </Slider>
     </div>
    </div>

    <div>
     <FormControlLabel
      className='w-full text-white rounded-1'
      label='Pinned'
      control={
       <Checkbox
        className='text-white'
        // checked={false}
        // onChange={(e) => setPinned(e.target.checked)}
       />
      }
     />
    </div>

    <div className='mx-auto w-full flex flex-grow-1'>
     <Editor
      apiKey='c9fpvuqin9s9m9702haau5pyi6k0t0zj29nelhczdvjdbt3y'
      //   value={dataText}
      init={{
       width: '100%',
       height: '100%',
       menubar: true,
       // menubar: false,
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
      //   onEditorChange={(content) => setDataText(content)}
     />
    </div>
   </form>
  </div>
 )
}

export default FormEdit
