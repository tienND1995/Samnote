import Slider from 'react-slick'

import { useChecklist } from 'react-checklist'

import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import CloseIcon from '@mui/icons-material/Close'

const AddImages = ({ imageList, onChangeUploadImages }) => {
 const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
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
    breakpoint: 1280,
    settings: {
     slidesToShow: 8,
     slidesToScroll: 1,
    },
   },
   {
    breakpoint: 1000,
    settings: {
     slidesToShow: 6,
     slidesToScroll: 1,
    },
   },

   {
    breakpoint: 800,
    settings: {
     slidesToShow: 4,
     slidesToScroll: 1,
    },
   },
   {
    breakpoint: 600,
    settings: {
     slidesToShow: 3,
     slidesToScroll: 1,
    },
   },
  ],
 }

 const { handleCheck, isCheckedAll, checkedItems, setCheckedItems } =
  useChecklist(imageList, {
   key: 'id',
   keyType: 'string',
  })

 const selectedImages = [...checkedItems]

 const handleDeleteImage = (id) => {
  checkedItems.delete(id)
  onChangeUploadImages((prev) => prev.filter((image) => image.id !== id))
 }

 const handleDeleteImageList = () => {
  const restImages = imageList.filter(
   (image) => !selectedImages.find((id) => id === image.id)
  )

  onChangeUploadImages(restImages)
  setCheckedItems(new Set())
 }

 if (imageList?.length < 1) return

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
     />
     <label
      className='btn btn-primary text-sm 2xl:text-lg'
      htmlFor='checked-list'
     >
      {isCheckedAll ? 'Cancel' : 'Select All'}
     </label>
    </div>

    <div>
     <button
      onClick={handleDeleteImageList}
      type='button'
      className='btn btn-danger text-sm 2xl:text-lg'
     >
      Delete
     </button>
    </div>
   </div>

   <div className='w-full px-3 mx-auto'>
    <Slider {...settings}>
     {imageList
      ?.sort((a, b) => b.id - a.id)
      ?.map(({ id, src }) => (
       <li key={id} className='p-1 position-relative noteEdit-imageItem'>
        <div className='position-absolute right-0 left-0 top-0 px-1 flex justify-between w-full items-center'>
         <div>
          <button
           type='button'
           onClick={() => {
            handleDeleteImage(id)
           }}
          >
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
         src={src}
         alt='img-create-note'
        />
       </li>
      ))}
    </Slider>
   </div>
  </div>
 )
}

export default AddImages
