import React from 'react'
import Slider from 'react-slick'

import avatarDefault from '../../assets/avatar-default.png'

function Demo() {
 var settings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
 }

 return (
  <div className='w-full text-center'>
   <Slider {...settings}>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
    <div>
     <img className='mx-auto' src={avatarDefault} alt='' />
    </div>
   </Slider>
  </div>
 )
}

export default Demo
