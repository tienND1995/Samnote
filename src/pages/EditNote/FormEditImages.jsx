import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import axios from 'axios'
import Slider from 'react-slick'

import CloseIcon from '@mui/icons-material/Close'

import { useChecklist } from 'react-checklist'
import { useEffect, useState } from 'react'

const FormEditImages = ({ images, onChangeDeleteImages }) => {
 const [imageList, setImageList] = useState([])

 const { handleCheck, isCheckedAll, checkedItems, setCheckedItems } =
  useChecklist(images, {
   key: 'id',
   keyType: 'number',
  })

 useEffect(() => {
  images?.length > 0 && setImageList(images)
 }, [images])

 const settings = {
  dots: false,
  infinite: false,
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

 // checklist image

 const selectedImages = [...checkedItems]

 const handleDeleteImage = async (id) => {
  // const data = { id_user: userId, id_note: noteId, id_images: '' }

  setImageList(imageList.filter((image) => image.id !== id))
  await checkedItems.add(id)

  onChangeDeleteImages([...checkedItems])
 }

 const handleDeleteImageList = () => {
  const resultImages = imageList.filter((item) =>
   selectedImages.every((id) => id !== item.id)
  )

  setImageList(resultImages)

  onChangeDeleteImages([...checkedItems])
 }

 return (
  <div className='bg-white px-3 pt-2  rounded-md'>
   <div className='flex justify-end gap-2 mb-2'>
    <div>
     <input
      id='checked-list'
      onChange={handleCheck}
      checked={isCheckedAll}
      type='checkbox'
      hidden
      disabled={imageList.length === 0}
     />
     <label className='btn btn-primary' htmlFor='checked-list'>
      {isCheckedAll ? 'Cancel' : 'Select All'}
     </label>
    </div>

    <div>
     <button
      onClick={handleDeleteImageList}
      type='button'
      className='btn btn-danger'
      disabled={imageList.length === 0}
     >
      Delete
     </button>
    </div>
   </div>

   {imageList.length > 0 ? (
    <div className='max-w-[35vw] mx-auto'>
     <Slider {...settings}>
      {imageList?.map(({ id, link }) => (
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
         className='object-cover aspect-[3/4] w-full rounded-sm'
         src={link}
         alt='img-editnote'
        />
       </li>
      ))}
     </Slider>
    </div>
   ) : (
    <h3 className='font-semibold mb-2'>All photos have been deleted.</h3>
   )}
  </div>
 )
}

export default FormEditImages
