import React, { useState, useContext } from 'react'
import axios from 'axios'

import uniqid from 'uniqid'

import Modal from 'react-bootstrap/Modal'

import ImageIcon from '@mui/icons-material/Image'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate'
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

import { AppContext } from '../../../context'
import configs from '../../../configs/configs.json'

const { API_SERVER_URL } = configs

const AddImages = ({ userId, noteId, updateNotes, onGetNoteId }) => {
 const appContext = useContext(AppContext)
 const { setSnackbar } = appContext

 const [showModal, setShowModal] = useState(false)
 const [uploadImageList, setUploadImageList] = useState([])

 const handleShowModal = () => {
  setShowModal(true)
 }

 const handleHideModal = () => {
  setShowModal(false)
  setUploadImageList([])
 }

 const handleChangeUploadImage = (e) => {
  const file = e.target.files[0]
  const blobUrl = URL.createObjectURL(file)

  const image = {
   file,
   thumb: blobUrl,
   id: uniqid(),
  }

  setUploadImageList([...uploadImageList, image])
 }

 const handleSaveUpload = async () => {
  if (uploadImageList.length === 0) return

  const formData = new FormData()

  formData.append('id_user', userId)
  formData.append('id_note', noteId)

  uploadImageList?.forEach(({ file }) => formData.append('image_note', file))

  postImages(formData)
 }

 const handleDeleteAllImage = () => setUploadImageList([])

 const handleDeleteImage = (id) => {
  setUploadImageList(uploadImageList.filter((image) => image.id !== id))
 }

 const postImages = async (formData) => {
  try {
   const response = await axios.post(
    `${API_SERVER_URL}/add_image_note`,
    formData
   )

   setSnackbar({
    isOpen: true,
    message: `Add images complete`,
    severity: 'success',
   })

   // update affter add image
   handleHideModal()
   updateNotes && updateNotes()
   onGetNoteId()
  } catch (error) {
   console.error(error)
   setSnackbar({
    isOpen: true,
    message: error.message,
    severity: 'error',
   })
  }
 }

 return (
  <div>
   <button
    disabled={!noteId}
    onClick={handleShowModal}
    type='button'
    className='ms-2'
   >
    <ImageIcon
     className={`text-[40px] ${noteId ? 'text-white' : 'text-gray-400'}`}
    />
   </button>

   <Modal centered={true} show={showModal} onHide={handleHideModal}>
    <div className='flex flex-col gap-2 p-3'>
     <div className='flex justify-between items-center'>
      <h3 className='text-3xl'>Add image</h3>

      <button onClick={handleHideModal}>
       <HighlightOffIcon className='text-[#FF0000] text-5xl' />
      </button>
     </div>

     <div className='bg-[#d9d9d9] mx-auto py-10 px-6 w-max rounded-md'>
      <input
       onChange={handleChangeUploadImage}
       id='file-editnote-imageupload'
       type='file'
       className='hidden m-0'
      />
      <label
       htmlFor='file-editnote-imageupload'
       className='flex cursor-pointer'
      >
       <AddPhotoAlternateIcon className='md:text-[40px] text-3xl' />
      </label>
     </div>

     {uploadImageList.length > 0 ? (
      <>
       <div className='flex justify-end'>
        <button
         type='button'
         className='bg-[#FF0000] p-2 text-white rounded-md flex items-center'
         onClick={handleDeleteAllImage}
        >
         Delete All <DeleteIcon className='text-white' />
        </button>
       </div>

       <ul className='row flex-nowrap row-cols-3 row-cols-md-6 overflow-x-auto mx-0 style-scrollbar-x style-scrollbar-x-sm pb-2'>
        {uploadImageList?.map(({ id, thumb }) => (
         <li key={id} className='position-relative col px-1'>
          <img
           className='rounded-sm aspect-[2/3] object-cover w-full'
           src={thumb}
           alt={thumb}
          />

          <button
           onClick={() => handleDeleteImage(id)}
           className='position-absolute left-1 top-0 flex'
          >
           <CloseIcon className='text-lg' />
          </button>
         </li>
        ))}
       </ul>

       <div className='flex justify-end'>
        <button
         onClick={handleSaveUpload}
         className='bg-[#1876D2] text-white rounded-md px-3 py-2'
        >
         Save
        </button>
       </div>
      </>
     ) : (
      <h3 className='text-center'>Please select a photo</h3>
     )}
    </div>
   </Modal>
  </div>
 )
}

export default AddImages
