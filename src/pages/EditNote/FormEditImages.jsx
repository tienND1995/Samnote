import React from 'react'

import Slider from 'react-slick'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'

const FormEditImages = ({ images }) => {
 if (images.length === 0) return

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
     {images?.map(({ id, link }) => (
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
 )
}

export default FormEditImages
