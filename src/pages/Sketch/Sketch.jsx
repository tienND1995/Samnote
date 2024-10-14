import { useContext, useEffect, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { schemaNoteCreate } from '../../utils/schema'

import { AppContext } from '../../context'
import { fetchApiSamenote } from '../../utils/fetchApiSamnote'

import FormNote from '../../share/FormNote'
import SketchCanvas from './SketchCanvas'

import SketchBar from './SketchBar'
import { convertColorNoteToApi, convertTimeToApi } from '../../utils/utils'

const Sketch = () => {
 const appContext = useContext(AppContext)
 const { user, setSnackbar } = appContext

 const [color, setColor] = useState({
  b: 250,
  g: 250,
  r: 255,
  name: 'snow',
 })

 // var canvas
 const [strokeColor, setStrokeColor] = useState('red')
 const [strokeWidth, setStrokeWidth] = useState(1)
 const [fileImage, setFileImage] = useState(null)

 const handleChangeColorCanvas = (color) => setStrokeColor(color)
 const handleChangeStrokeWidth = (number) => setStrokeWidth(number)

 const sketchCanvasRef = useRef()

 const {
  handleSubmit,
  register,
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

 const handleChangeColor = (color) => setColor(color)

 const propsFormNote = {
  userID: user?.id,
  register,
  watch,
  errors,
  dirtyFields,
  onChangeColor: handleChangeColor,
  color,
  setFileImage,
 }

 const onSubmitForm = (data) => {
  const dataForm = {
   ...data,
   color: convertColorNoteToApi(color),
   dueAt: convertTimeToApi(data.dueAt),
   remindAt: convertTimeToApi(data.remindAt),
   type: 'text',
   linkNoteShare: '',
  }

  if (!fileImage) return
  postNote(dataForm)
 }

 const postNote = (data) => {
  fetchApiSamenote('post', `/notes/${user?.id}`, data)
   .then((data) => {
    reset()
    setColor({ b: 250, g: 250, r: 255, name: 'snow' })
    setSnackbar({
     isOpen: true,
     message: `Create note success!`,
     severity: 'success',
    })

    // post image sketch
    const newFormData = new FormData()
    newFormData.append('id_user', user?.id)
    newFormData.append('id_note', data.note.idNote)
    newFormData.append('image_note', fileImage)

    fetchApiSamenote('post', '/add_image_note', newFormData)
   })
   .catch((error) => console.log('error', error))
 }

 const disableSubmit = () => {
  return Object.keys(dirtyFields).length === 0 && !fileImage
 }

 return (
  <div className='flex flex-col w-full'>
   <div className='bg-black w-full text-white p-4'>
    <h2 className='font-Roboto font-bold mb-3 text-[40px] flex justify-center items-end gap-2'>
     Sketch
     <div className='h-[50px] flex'>
      <svg
       width='40'
       height='38'
       viewBox='0 0 40 38'
       fill='none'
       xmlns='http://www.w3.org/2000/svg'
      >
       <path
        d='M31.5002 37.7484C33.0627 37.7484 34.6078 37.3665 36.1356 36.6026C37.6634 35.8387 38.896 34.8318 39.8335 33.5818C38.9307 33.5818 38.0106 33.2259 37.0731 32.5141C36.1356 31.8023 35.6668 30.7693 35.6668 29.4151C35.6668 27.679 35.0592 26.2033 33.8439 24.988C32.6286 23.7727 31.1529 23.1651 29.4168 23.1651C27.6807 23.1651 26.205 23.7727 24.9897 24.988C23.7745 26.2033 23.1668 27.679 23.1668 29.4151C23.1668 31.7068 23.9828 33.6686 25.6147 35.3005C27.2467 36.9325 29.2085 37.7484 31.5002 37.7484ZM19.521 25.2484L25.2502 19.5193L6.60433 0.873438C6.22239 0.491493 5.74495 0.29184 5.17204 0.274479C4.59912 0.257118 4.10433 0.456771 3.68766 0.873438L0.875164 3.68594C0.458496 4.1026 0.250164 4.58872 0.250164 5.14427C0.250164 5.69983 0.458496 6.18594 0.875164 6.6026L19.521 25.2484Z'
        fill='white'
       />
      </svg>
     </div>
    </h2>

    <div className='grid grid-cols-2 gap-[10%]'>
     <form onSubmit={handleSubmit(onSubmitForm)}>
      <FormNote {...propsFormNote} />

      <div className='mt-3'>
       <button
        className={`text-white bg-[#1876D2] w-[100px] h-[40px] rounded-md uppercase ${
         disableSubmit() ? 'opacity-70' : 'opacity-100'
        }`}
        type='submit'
        disabled={disableSubmit()}
       >
        Create
       </button>
      </div>
     </form>

     <div>
      <textarea
       className='size-full relative max-h-[300px] mt-[23px] rounded-lg outline-none p-3'
       placeholder='Content...'
       {...register('data')}
      ></textarea>

      {errors?.data && (
       <span style={{ borderBottom: '1px solid red' }} className='text-red-600'>
        {errors.data.message}
       </span>
      )}
     </div>
    </div>
   </div>

   <div className='bg-white size-full flex'>
    <SketchBar
     onChangeColorCanvas={handleChangeColorCanvas}
     onChangeStrokeWidth={handleChangeStrokeWidth}
     strokeColor={strokeColor}
     strokeWidth={strokeWidth}
     sketchCanvasRef={sketchCanvasRef}
     setFileImage={setFileImage}
    />

    <SketchCanvas
     strokeColor={strokeColor}
     strokeWidth={strokeWidth}
     sketchCanvasRef={sketchCanvasRef}
    />
   </div>
  </div>
 )
}

export default Sketch
