import { useChecklist } from 'react-checklist'
import { useParams } from 'react-router-dom'
import Slider from 'react-slick'
import Swal from 'sweetalert2'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'

import configs from '../../../configs/configs.json'
const { API_SERVER_URL } = configs

const DeleteImages = ({ images, userId, noteId, updateNotes, onGetNoteId }) => {
 const { handleCheck, isCheckedAll, checkedItems, setCheckedItems } =
  useChecklist(images, {
   key: 'id',
   keyType: 'number',
  })

 const { id } = useParams()

 const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 8,
  slidesToScroll: 1,
  className: 'slider-btn-arrow',
  nextArrow: (
   <button type='button'>
    <ArrowForwardIosIcon />
   </button>
  ),
  prevArrow: (
   <button type='button'>
    <ArrowBackIosIcon />
   </button>
  ),

  responsive: [
   {
    breakpoint: 1500,
    settings: {
     slidesToShow: 7,
     slidesToScroll: 1,
    },
   },
   {
    breakpoint: 1000,
    settings: {
     slidesToShow: 5,
     slidesToScroll: 1,
    },
   },

   {
    breakpoint: 700,
    settings: {
     slidesToShow: 3,
     slidesToScroll: 1,
    },
   },

   {
    breakpoint: 400,
    settings: {
     slidesToShow: 2,
     slidesToScroll: 1,
    },
   },
  ],
 }

 // checklist image

 const selectedImages = [...checkedItems]

 const deleteImage = async (idImage) => {
  const formData = new FormData()
  formData.append('id_user', userId)
  formData.append('id_note', noteId)
  formData.append('id_images', idImage)

  try {
   const response = await fetch(`${API_SERVER_URL}/delete_image_note`, {
    method: 'delete',
    body: formData,
   })

   updateNotes && updateNotes()
   onGetNoteId()
  } catch (error) {
   console.error(error)
  }
 }

 const handleDeleteImage = async (id) => {
  Swal.fire({
   title: 'Are you sure?',
   text: "You won't be able to revert this!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
   if (result.isConfirmed) {
    deleteImage(id)
    checkedItems.delete(id)
    Swal.fire({
     title: 'Deleted!',
     text: 'Your image has been deleted.',
     icon: 'success',
    })
   }
  })
 }

 const deleteImageList = async (idImage) => {
  const formData = new FormData()
  formData.append('id_user', userId)
  formData.append('id_note', noteId)
  formData.append('id_images', idImage)

  try {
   const response = await fetch(`${API_SERVER_URL}/delete_image_note`, {
    method: 'delete',
    body: formData,
   })
  } catch (error) {
   console.error(error)
  }
 }

 const handleDeleteImageList = async () => {
  Swal.fire({
   title: 'Are you sure?',
   text: "You won't be able to revert this!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
   if (result.isConfirmed) {
    selectedImages.forEach(async (id, idx) => {
     await deleteImageList(id)

     if (idx === selectedImages.length - 1) {
      updateNotes()
      onGetNoteId()
      setCheckedItems(new Set())
     }
    })

    Swal.fire({
     title: 'Deleted!',
     text: 'Your imagelist has been deleted.',
     icon: 'success',
    })
   }
  })
 }

 if (!images?.length || !id) return

 const imageSort = images.sort((a, b) => a.id - b.id)

 return (
  <div className='bg-white px-2 pt-1 px-sm-3 pt-sm-2 rounded-sm sm:rounded-md'>
   <div className='flex justify-end gap-2 mb-2'>
    <div>
     <input
      id='checked-list'
      onChange={handleCheck}
      checked={isCheckedAll}
      type='checkbox'
      hidden
     />
     <label
      className='btn btn-primary md:text-lg text-sm'
      htmlFor='checked-list'
     >
      {isCheckedAll ? 'Cancel' : 'Select All'}
     </label>
    </div>

    <div>
     <button
      onClick={handleDeleteImageList}
      type='button'
      className='btn btn-danger md:text-lg text-sm'
     >
      Delete
     </button>
    </div>
   </div>

   <div className='max-w-[80vw] mx-auto'>
    <Slider {...settings}>
     {imageSort
      .sort((a, b) => b.id - a.id)
      ?.map(({ id, link }) => (
       <li key={id} className='p-1 position-relative noteEdit-imageItem'>
        <div className='position-absolute right-0 left-0 top-0 px-1 flex justify-between w-full items-center'>
         <div>
          <button type='button' onClick={() => handleDeleteImage(id)}>
           <CloseIcon className='text-[20px]' />
          </button>
         </div>

         <div>
          <input
           type='checkbox'
           checked={checkedItems.has(id)}
           data-key={id}
           onChange={handleCheck}
          />
         </div>
        </div>

        <img
         className='object-cover aspect-[3/4] w-full rounded-sm border border-gray-400'
         src={link}
         alt='img-editnote'
        />
       </li>
      ))}
    </Slider>
   </div>
  </div>
 )
}

export default DeleteImages
